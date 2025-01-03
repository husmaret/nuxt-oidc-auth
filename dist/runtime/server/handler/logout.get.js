import { useRuntimeConfig } from "#imports";
import { eventHandler, getQuery, getRequestURL, sendRedirect } from "h3";
import { withQuery } from "ufo";
import * as providerPresets from "../../providers/index.js";
import { configMerger, convertObjectToSnakeCase } from "../utils/oidc.js";
import { clearUserSession, getUserSession } from "../utils/session.js";
export function logoutEventHandler({ onSuccess }) {
  return eventHandler(async (event) => {
    const provider = event.path.split("/")[2];
    const config = configMerger(useRuntimeConfig().oidc.providers[provider], providerPresets[provider]);
    if (config.logoutUrl) {
      const logoutParams = getQuery(event);
      const logoutRedirectUri = logoutParams.logoutRedirectUri || config.logoutRedirectUri;
      const additionalLogoutParameters = config.additionalLogoutParameters ? { ...config.additionalLogoutParameters } : {};
      if (config.additionalLogoutParameters) {
        const userSession = await getUserSession(event);
        Object.keys(config.additionalLogoutParameters).forEach((key) => {
          if (key === "idTokenHint" && userSession.idToken)
            additionalLogoutParameters[key] = userSession.idToken;
          if (key === "logoutHint" && userSession.claims?.login_hint)
            additionalLogoutParameters[key] = userSession.claims.login_hint;
        });
      }
      const location = withQuery(config.logoutUrl, {
        ...config.logoutRedirectParameterName && logoutRedirectUri && { [config.logoutRedirectParameterName]: logoutRedirectUri },
        ...config.additionalLogoutParameters && convertObjectToSnakeCase(additionalLogoutParameters)
      });
      await clearUserSession(event);
      return sendRedirect(
        event,
        location,
        302
      );
    }
    await clearUserSession(event);
    return onSuccess(event, {
      user: null
    });
  });
}
export default logoutEventHandler({
  async onSuccess(event) {
    return sendRedirect(event, `${getRequestURL(event).protocol}//${getRequestURL(event).host}`, 302);
  }
});
