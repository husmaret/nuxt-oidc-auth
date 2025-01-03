import { defineOidcProvider } from "../server/utils/provider.js";
export const paypal = defineOidcProvider({
  responseType: "code",
  validateAccessToken: false,
  validateIdToken: false,
  skipAccessTokenParsing: true,
  state: true,
  nonce: true,
  tokenRequestType: "form-urlencoded",
  scope: ["openid"],
  requiredProperties: [
    "clientId",
    "clientSecret",
    "authorizationUrl",
    "tokenUrl",
    "redirectUri"
  ],
  authorizationUrl: "",
  tokenUrl: "",
  userInfoUrl: "",
  redirectUri: ""
});
