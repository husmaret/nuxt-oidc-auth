import { ofetch } from "ofetch";
import { defineOidcProvider } from "../server/utils/provider.js";
export const microsoft = defineOidcProvider({
  tokenRequestType: "form-urlencoded",
  logoutRedirectParameterName: "post_logout_redirect_uri",
  grantType: "authorization_code",
  // scopeInTokenRequest: true,
  scope: ["openid", "User.Read"],
  pkce: true,
  state: true,
  nonce: true,
  requiredProperties: [
    "clientId",
    "clientSecret",
    "authorizationUrl",
    "tokenUrl",
    "redirectUri"
  ],
  responseType: "code id_token",
  async openIdConfiguration(config) {
    const openIdConfig = await ofetch(`https://login.microsoftonline.com/${config.tenantId ? config.tenantId : "common"}/v2.0/.well-known/openid-configuration`);
    openIdConfig.issuer = config.tenantId ? [`https://login.microsoftonline.com/${config.tenantId}/v2.0`, openIdConfig.issuer] : void 0;
    return openIdConfig;
  },
  sessionConfiguration: {
    expirationCheck: true,
    automaticRefresh: true,
    expirationThreshold: 1800
  },
  skipAccessTokenParsing: true,
  validateAccessToken: false,
  validateIdToken: true,
  additionalAuthParameters: {
    prompt: "select_account"
  },
  optionalClaims: ["name", "preferred_username"],
  baseUrl: "https://login.microsoftonline.com/common",
  authorizationUrl: "/oauth2/v2.0/authorize",
  tokenUrl: "/oauth2/v2.0/token",
  userInfoUrl: "https://graph.microsoft.com/v1.0/me"
  // https://graph.microsoft.com/oidc/userinfo"
});
