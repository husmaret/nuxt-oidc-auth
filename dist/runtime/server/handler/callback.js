import { deleteCookie, eventHandler, getQuery, getRequestURL, readBody, sendRedirect } from "h3";
import { ofetch } from "ofetch";
import { normalizeURL, parseURL } from "ufo";
import * as providerPresets from "../../providers/index.js";
import { validateConfig } from "../utils/config.js";
import { configMerger, convertObjectToSnakeCase, convertTokenRequestToType, oidcErrorHandler, useOidcLogger } from "../utils/oidc.js";
import { encryptToken, parseJwtToken, validateToken } from "../utils/security.js";
import { getUserSessionId, setUserSession, useAuthSession } from "../utils/session.js";
import { useRuntimeConfig, useStorage } from "#imports";
import { textToBase64 } from "undio";
import { parsePath } from "../utils/path.js";
function callbackEventHandler({ onSuccess }) {
  const logger = useOidcLogger();
  return eventHandler(async (event) => {
    const provider = event.path.split("/")[2];
    const config = configMerger(useRuntimeConfig().oidc.providers[provider], providerPresets[provider]);
    const validationResult = validateConfig(config, config.requiredProperties);
    if (!validationResult.valid) {
      logger.error(`[${provider}] Missing configuration properties: `, validationResult.missingProperties?.join(", "));
      oidcErrorHandler(event, "Invalid configuration");
    }
    const session = await useAuthSession(event);
    const { code, state, id_token, admin_consent, error, error_description } = event.method === "POST" ? await readBody(event) : getQuery(event);
    if (admin_consent) {
      const url = getRequestURL(event);
      sendRedirect(event, url.origin + parsePath(`/auth/${provider}/login`), 200);
    }
    if (id_token) {
      const parsedIdToken = parseJwtToken(id_token);
      if (parsedIdToken.nonce !== session.data.nonce) {
        oidcErrorHandler(event, "Nonce mismatch");
      }
    }
    if (!code || config.state && !state || error) {
      if (error) {
        logger.error(`[${provider}] ${error}`, error_description && `: ${error_description}`);
      }
      if (!code) {
        oidcErrorHandler(event, "Callback failed, missing code");
      }
      oidcErrorHandler(event, "Callback failed");
    }
    if (config.state && state !== session.data.state) {
      oidcErrorHandler(event, "State mismatch");
    }
    const headers = {};
    if (config.authenticationScheme === "header") {
      const encodedCredentials = textToBase64(`${config.clientId}:${config.clientSecret}`, { dataURL: false });
      headers.authorization = `Basic ${encodedCredentials}`;
    }
    const requestBody = {
      client_id: config.clientId,
      code,
      grant_type: config.grantType,
      ...config.redirectUri && { redirect_uri: config.redirectUri },
      ...config.scopeInTokenRequest && config.scope && { scope: config.scope.join(" ") },
      ...config.pkce && { code_verifier: session.data.codeVerifier },
      ...config.authenticationScheme && config.authenticationScheme === "body" && { client_secret: normalizeURL(config.clientSecret) },
      ...config.additionalTokenParameters && convertObjectToSnakeCase(config.additionalTokenParameters)
    };
    let tokenResponse;
    try {
      tokenResponse = await ofetch(
        config.tokenUrl,
        {
          method: "POST",
          headers,
          body: convertTokenRequestToType(requestBody, config.tokenRequestType ?? void 0)
        }
      );
    } catch (error2) {
      logger.error(error2?.data ? `${error2.data.error}: ${error2.data.error_description}` : error2);
      if (error2?.data?.suberror === "consent_required") {
        const consentUrl = `https://login.microsoftonline.com/${parseURL(config.authorizationUrl).pathname.split("/")[1]}/adminconsent?client_id=${config.clientId}`;
        return sendRedirect(
          event,
          consentUrl,
          302
        );
      }
      return oidcErrorHandler(event, "Token request failed");
    }
    let tokens;
    let accessToken;
    let idToken;
    if (!tokenResponse.access_token)
      return oidcErrorHandler(event, `[${provider}] No access token found`);
    try {
      accessToken = parseJwtToken(tokenResponse.access_token, !!config.skipAccessTokenParsing);
      idToken = tokenResponse.id_token ? parseJwtToken(tokenResponse.id_token) : void 0;
    } catch (error2) {
      return oidcErrorHandler(event, `[${provider}] Token parsing failed: ${error2}`);
    }
    if ([config.audience, config.clientId].some((audience) => accessToken.aud?.includes(audience) || idToken?.aud?.includes(audience)) && (config.validateAccessToken || config.validateIdToken)) {
      const openIdConfiguration = config.openIdConfiguration && typeof config.openIdConfiguration === "object" ? config.openIdConfiguration : typeof config.openIdConfiguration === "string" ? await ofetch(config.openIdConfiguration) : await config.openIdConfiguration(config);
      const validationOptions = { jwksUri: openIdConfiguration.jwks_uri, ...openIdConfiguration.issuer && { issuer: openIdConfiguration.issuer }, ...config.audience && { audience: [config.audience, config.clientId] } };
      try {
        tokens = {
          accessToken: config.validateAccessToken ? await validateToken(tokenResponse.access_token, validationOptions) : accessToken,
          ...tokenResponse.refresh_token && { refreshToken: tokenResponse.refresh_token },
          ...tokenResponse.id_token && { idToken: config.validateIdToken ? await validateToken(tokenResponse.id_token, validationOptions) : parseJwtToken(tokenResponse.id_token) }
        };
      } catch (error2) {
        return oidcErrorHandler(event, `[${provider}] Token validation failed: ${error2}`);
      }
    } else {
      logger.info("Skipped token validation");
      tokens = {
        accessToken,
        ...tokenResponse.refresh_token && { refreshToken: tokenResponse.refresh_token },
        ...tokenResponse.id_token && { idToken: parseJwtToken(tokenResponse.id_token) }
      };
    }
    const timestamp = Math.trunc(Date.now() / 1e3);
    const user = {
      canRefresh: !!tokens.refreshToken,
      loggedInAt: timestamp,
      updatedAt: timestamp,
      expireAt: tokens.accessToken.exp || timestamp + useRuntimeConfig().oidc.session.maxAge,
      provider
    };
    try {
      if (config.userInfoUrl) {
        const userInfoResult = await ofetch(config.userInfoUrl, {
          headers: {
            Authorization: `${tokenResponse.token_type} ${tokenResponse.access_token}`
          }
        });
        user.userInfo = config.filterUserInfo ? Object.fromEntries(Object.entries(userInfoResult).filter(([key]) => config.filterUserInfo?.includes(key))) : userInfoResult;
      }
    } catch (error2) {
      logger.warn(`[${provider}] Failed to fetch userinfo`, error2);
    }
    if (config.userNameClaim) {
      user.userName = config.userNameClaim in tokens.accessToken ? tokens.accessToken[config.userNameClaim] : "";
    }
    if (config.optionalClaims && tokens.idToken) {
      const parsedIdToken = tokens.idToken;
      user.claims = {};
      config.optionalClaims.forEach((claim) => parsedIdToken[claim] && (user.claims[claim] = parsedIdToken[claim]));
    }
    if (tokenResponse.refresh_token || config.exposeAccessToken || config.exposeIdToken) {
      const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY;
      const persistentSession = {
        exp: accessToken.exp,
        iat: accessToken.iat,
        accessToken: await encryptToken(tokenResponse.access_token, tokenKey),
        ...tokenResponse.refresh_token && { refreshToken: await encryptToken(tokenResponse.refresh_token, tokenKey) },
        ...tokenResponse.id_token && { idToken: await encryptToken(tokenResponse.id_token, tokenKey) }
      };
      const userSessionId = await getUserSessionId(event);
      await useStorage("oidc").setItem(userSessionId, persistentSession);
    }
    await session.clear();
    deleteCookie(event, "oidc");
    return onSuccess(event, {
      user,
      callbackRedirectUrl: config.callbackRedirectUrl
    });
  });
}
export default callbackEventHandler({
  async onSuccess(event, { user, callbackRedirectUrl }) {
    await setUserSession(event, user);
    return sendRedirect(event, parsePath(callbackRedirectUrl ?? "/"));
  }
});
