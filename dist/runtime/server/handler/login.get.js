import { useRuntimeConfig } from "#imports";
import { eventHandler, getQuery, getRequestHeader, sendRedirect } from "h3";
import { withQuery } from "ufo";
import * as providerPresets from "../../providers/index.js";
import { validateConfig } from "../utils/config.js";
import { configMerger, convertObjectToSnakeCase, oidcErrorHandler, useOidcLogger } from "../utils/oidc.js";
import { generatePkceCodeChallenge, generatePkceVerifier, generateRandomUrlSafeString } from "../utils/security.js";
import { useAuthSession } from "../utils/session.js";
function loginEventHandler() {
  const logger = useOidcLogger();
  return eventHandler(async (event) => {
    const provider = event.path.split("/")[2];
    const config = configMerger(useRuntimeConfig().oidc.providers[provider], providerPresets[provider]);
    const validationResult = validateConfig(config, config.requiredProperties);
    if (!validationResult.valid) {
      logger.error(`[${provider}] Missing configuration properties:`, validationResult.missingProperties?.join(", "));
      oidcErrorHandler(event, "Invalid configuration");
    }
    const session = await useAuthSession(event);
    await session.update({
      state: generateRandomUrlSafeString(),
      codeVerifier: generatePkceVerifier(),
      redirect: getRequestHeader(event, "referer"),
      nonce: void 0
    });
    const additionalClientAuthParameters = {};
    if (config.allowedClientAuthParameters?.length) {
      const clientQueryParams = getQuery(event);
      config.allowedClientAuthParameters.forEach((param) => {
        if (clientQueryParams[param]) {
          additionalClientAuthParameters[param] = clientQueryParams[param];
        }
      });
    }
    const query = {
      client_id: config.clientId,
      response_type: config.responseType,
      ...config.state && { state: session.data.state },
      ...config.scope && { scope: config.scope.join(" ") },
      ...config.responseMode && { response_mode: config.responseMode },
      ...config.redirectUri && { redirect_uri: config.redirectUri },
      ...config.prompt && { prompt: config.prompt.join(" ") },
      ...config.pkce && { code_challenge: await generatePkceCodeChallenge(session.data.codeVerifier), code_challenge_method: "S256" },
      ...config.additionalAuthParameters && convertObjectToSnakeCase(config.additionalAuthParameters),
      ...additionalClientAuthParameters && convertObjectToSnakeCase(additionalClientAuthParameters)
    };
    if (config.responseType.includes("token") || config.nonce) {
      const nonce = generateRandomUrlSafeString();
      await session.update({ nonce });
      query.response_mode = "form_post";
      query.nonce = nonce;
      if (!query.scope?.includes("openid"))
        query.scope = `openid ${query.scope}`;
    }
    return sendRedirect(
      event,
      config.encodeRedirectUri ? withQuery(config.authorizationUrl, query).replace(query.redirect_uri, encodeURI(query.redirect_uri)) : withQuery(config.authorizationUrl, query),
      200
    );
  });
}
export default loginEventHandler();
