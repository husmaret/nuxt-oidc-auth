import { ofetch } from "ofetch";
import { generateProviderUrl } from "../server/utils/config.js";
import { defineOidcProvider } from "../server/utils/provider.js";
export const keycloak = defineOidcProvider({
  authorizationUrl: "protocol/openid-connect/auth",
  tokenUrl: "protocol/openid-connect/token",
  userInfoUrl: "protocol/openid-connect/userinfo",
  tokenRequestType: "form-urlencoded",
  pkce: true,
  state: false,
  nonce: true,
  requiredProperties: [
    "clientId",
    "clientSecret",
    "authorizationUrl",
    "tokenUrl",
    "redirectUri"
  ],
  additionalLogoutParameters: {
    idTokenHint: ""
  },
  sessionConfiguration: {
    expirationCheck: true,
    automaticRefresh: true,
    expirationThreshold: 240
  },
  validateAccessToken: true,
  validateIdToken: false,
  exposeIdToken: true,
  baseUrl: "",
  logoutUrl: "protocol/openid-connect/logout",
  logoutRedirectParameterName: "post_logout_redirect_uri",
  async openIdConfiguration(config) {
    const configUrl = generateProviderUrl(config.baseUrl, ".well-known/openid-configuration");
    return await ofetch(configUrl);
  }
});
