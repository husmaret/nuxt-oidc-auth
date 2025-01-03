import { createDefu } from "defu";
const configMerger = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value)) {
    obj[key] = key === "requiredProperties" ? Array.from(new Set(obj[key].concat(value))) : value;
    return true;
  }
});
export function defineOidcProvider(config = {}) {
  const defaults = {
    clientId: "",
    redirectUri: "",
    clientSecret: "",
    authorizationUrl: "",
    tokenUrl: "",
    responseType: "code",
    authenticationScheme: "header",
    grantType: "authorization_code",
    pkce: false,
    state: true,
    nonce: false,
    scope: ["openid"],
    scopeInTokenRequest: false,
    tokenRequestType: "form",
    requiredProperties: [
      "clientId",
      "redirectUri",
      "clientSecret",
      "authorizationUrl",
      "tokenUrl"
    ],
    validateAccessToken: true,
    validateIdToken: true,
    skipAccessTokenParsing: false,
    exposeAccessToken: false,
    exposeIdToken: false,
    callbackRedirectUrl: "/",
    allowedClientAuthParameters: void 0,
    logoutUrl: "",
    sessionConfiguration: void 0,
    additionalAuthParameters: void 0,
    additionalTokenParameters: void 0,
    additionalLogoutParameters: void 0,
    excludeOfflineScopeFromTokenRequest: false
  };
  const mergedConfig = configMerger(config, defaults);
  return mergedConfig;
}
