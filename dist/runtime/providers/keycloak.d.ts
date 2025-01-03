interface KeycloakProviderConfig {
    /**
     * This parameter allows to slightly customize the login flow on the Keycloak server side. For example, enforce displaying the login screen in case of value login.
     * @default undefined
     */
    prompt?: string;
    /**
     * Used to pre-fill the username/email field on the login form.
     * @default undefined
     */
    loginHint?: string;
    /**
     * Used to tell Keycloak to skip showing the login page and automatically redirect to the specified identity provider instead.
     * @default undefined
     */
    idpHint?: string;
    /**
     * Sets the 'ui_locales' query param.
     * @default undefined
     */
    locale?: string;
}
export declare const keycloak: Partial<Partial<Omit<import("../server/utils/provider").OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof import("../server/utils/provider").OidcProviderConfig)[] | undefined;
}> & object & {
    additionalAuthParameters?: Partial<KeycloakProviderConfig> | undefined;
    additionalTokenParameters?: Partial<KeycloakProviderConfig> | undefined;
    additionalLogoutParameters?: Partial<KeycloakProviderConfig> | undefined;
}> & Required<Pick<Partial<Partial<Omit<import("../server/utils/provider").OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof import("../server/utils/provider").OidcProviderConfig)[] | undefined;
}> & object & {
    additionalAuthParameters?: Partial<KeycloakProviderConfig> | undefined;
    additionalTokenParameters?: Partial<KeycloakProviderConfig> | undefined;
    additionalLogoutParameters?: Partial<KeycloakProviderConfig> | undefined;
}>, "redirectUri">>;
export {};
