interface EntraProviderConfig {
    /**
     * The resource identifier for the requested resource.
     * @default undefined
     */
    resource?: string;
    /**
     * The audience for the token, typically the client ID.
     * @default undefined
     */
    audience?: string;
    /**
     * Indicates the type of user interaction that is required. Valid values are login, none, consent, and select_account.
     * @default undefined
     */
    prompt?: 'login' | 'none' | 'consent' | 'select_account';
    /**
     * You can use this parameter to pre-fill the username and email address field of the sign-in page for the user. Apps can use this parameter during reauthentication, after already extracting the login_hint optional claim from an earlier sign-in.
     * @default undefined
     */
    loginHint?: string;
    /**
     * Enables sign-out to occur without prompting the user to select an account. To use logout_hint, enable the login_hint optional claim in your client application and use the value of the login_hint optional claim as the logout_hint parameter.
     * @default undefined
     */
    logoutHint?: string;
    /**
     * If included, the app skips the email-based discovery process that user goes through on the sign-in page, leading to a slightly more streamlined user experience.
     * @default undefined
     */
    domainHint?: boolean;
}
export declare const entra: Partial<Partial<Omit<import("../server/utils/provider").OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof import("../server/utils/provider").OidcProviderConfig)[] | undefined;
}> & object & {
    additionalAuthParameters?: Partial<EntraProviderConfig> | undefined;
    additionalTokenParameters?: Partial<EntraProviderConfig> | undefined;
    additionalLogoutParameters?: Partial<EntraProviderConfig> | undefined;
}> & Required<Pick<Partial<Partial<Omit<import("../server/utils/provider").OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof import("../server/utils/provider").OidcProviderConfig)[] | undefined;
}> & object & {
    additionalAuthParameters?: Partial<EntraProviderConfig> | undefined;
    additionalTokenParameters?: Partial<EntraProviderConfig> | undefined;
    additionalLogoutParameters?: Partial<EntraProviderConfig> | undefined;
}>, "redirectUri">>;
export {};
