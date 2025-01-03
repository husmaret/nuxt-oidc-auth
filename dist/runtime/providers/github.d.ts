import type { OidcProviderConfig } from '../server/utils/provider.js';
export declare const github: Partial<Partial<Omit<OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof OidcProviderConfig)[] | undefined;
}> & object & {
    additionalAuthParameters?: Partial<OidcProviderConfig> | undefined;
    additionalTokenParameters?: Partial<OidcProviderConfig> | undefined;
    additionalLogoutParameters?: Partial<OidcProviderConfig> | undefined;
}> & Required<Pick<Partial<Partial<Omit<OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof OidcProviderConfig)[] | undefined;
}> & object & {
    additionalAuthParameters?: Partial<OidcProviderConfig> | undefined;
    additionalTokenParameters?: Partial<OidcProviderConfig> | undefined;
    additionalLogoutParameters?: Partial<OidcProviderConfig> | undefined;
}>, "redirectUri">>;
