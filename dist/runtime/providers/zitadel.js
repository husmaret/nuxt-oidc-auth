import { ofetch } from "ofetch";
import { normalizeURL, withHttps, withoutTrailingSlash } from "ufo";
import { defineOidcProvider } from "../server/utils/provider.js";
export const zitadel = defineOidcProvider({
  tokenRequestType: "form-urlencoded",
  userInfoUrl: "oidc/v1/userinfo",
  scope: ["openid", "offline_access"],
  pkce: true,
  state: true,
  nonce: true,
  authenticationScheme: "none",
  scopeInTokenRequest: true,
  authorizationUrl: "oauth/v2/authorize",
  tokenUrl: "oauth/v2/token",
  logoutUrl: "oidc/v1/end_session",
  requiredProperties: [
    "baseUrl",
    "clientId",
    "clientSecret",
    "authorizationUrl",
    "tokenUrl"
  ],
  validateAccessToken: false,
  validateIdToken: true,
  skipAccessTokenParsing: true,
  sessionConfiguration: {
    expirationCheck: true,
    automaticRefresh: true,
    expirationThreshold: 1800
  },
  additionalLogoutParameters: {
    clientId: "{clientId}"
  },
  logoutRedirectParameterName: "post_logout_redirect_uri",
  async openIdConfiguration(config) {
    const baseUrl = normalizeURL(withoutTrailingSlash(withHttps(config.baseUrl)));
    return await ofetch(`${baseUrl}/.well-known/openid-configuration`);
  },
  excludeOfflineScopeFromTokenRequest: true
});
