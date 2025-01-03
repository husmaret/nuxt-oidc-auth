import { snakeCase } from "scule";
import { cleanDoubleSlashes, joinURL, parseURL, withHttps, withoutTrailingSlash } from "ufo";
export function validateConfig(config, requiredProps) {
  const missingProperties = [];
  let valid = true;
  for (const prop of requiredProps) {
    if (!(prop in config)) {
      valid = false;
      missingProperties.push(prop.toString());
    }
  }
  return { valid, missingProperties, config };
}
export function generateProviderUrl(baseUrl, relativeUrl) {
  const parsedUrl = parseURL(baseUrl);
  return parsedUrl.protocol ? withoutTrailingSlash(cleanDoubleSlashes(joinURL(baseUrl, "/", relativeUrl || ""))) : withoutTrailingSlash(cleanDoubleSlashes(withHttps(joinURL(baseUrl, "/", relativeUrl || ""))));
}
export function replaceInjectedParameters(injectedParameters, providerOptions, providerPreset, provider) {
  const additionalParameterKeys = ["additionalAuthParameters", "additionalTokenParameters", "additionalLogoutParameters"];
  additionalParameterKeys.forEach((parameterKey) => {
    const presetParams = providerPreset[parameterKey];
    if (!presetParams)
      return;
    const providerParams = providerOptions[parameterKey];
    if (!providerParams) {
      providerOptions[parameterKey] = {};
    }
    Object.entries(presetParams).forEach(([key, value]) => {
      injectedParameters.forEach((injectedParameter) => {
        const placeholder = `{${injectedParameter}}`;
        if (value.includes(placeholder)) {
          providerOptions[parameterKey][key] = value.replace(
            placeholder,
            providerOptions[injectedParameter] || process.env[`NUXT_OIDC_PROVIDERS_${provider.toUpperCase()}_${snakeCase(injectedParameter).toUpperCase()}`] || ""
          );
        }
      });
    });
  });
}
