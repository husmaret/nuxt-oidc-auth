import { ofetch } from "ofetch";
import { parseURL } from "ufo";
import { defineOidcProvider } from "../server/utils/provider.js";
export const entra = defineOidcProvider({
  tokenRequestType: "form-urlencoded",
  logoutRedirectParameterName: "post_logout_redirect_uri",
  grantType: "authorization_code",
  scope: ["openid"],
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
  async openIdConfiguration(config) {
    const parsedUrl = parseURL(config.authorizationUrl);
    const tenantId = parsedUrl.pathname.split("/")[1];
    const openIdConfig = await ofetch(`https://${parsedUrl.host}/${tenantId}/.well-known/openid-configuration${config.audience && `?appid=${config.audience}`}`);
    openIdConfig.issuer = [`https://${parsedUrl.host}/${tenantId}/v2.0`, openIdConfig.issuer];
    return openIdConfig;
  },
  sessionConfiguration: {
    expirationCheck: true,
    automaticRefresh: true,
    expirationThreshold: 1800
  },
  validateAccessToken: false,
  validateIdToken: true
});
