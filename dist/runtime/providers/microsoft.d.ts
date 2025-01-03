interface MicrosoftAdditionalFields {
    /**
     * Optional. Indicates the type of user interaction that is required. Valid values are `login`, `none`, `consent`, and `select_account`.
     * @default 'login'
     */
    prompt?: 'login' | 'none' | 'consent' | 'select_account';
    /**
     * Optional. You can use this parameter to pre-fill the username and email address field of the sign-in page for the user. Apps can use this parameter during reauthentication, after already extracting the login_hint optional claim from an earlier sign-in.
     * @default undefined
     */
    loginHint?: string;
    /**
     * Optional. Enables sign-out to occur without prompting the user to select an account. To use logout_hint, enable the login_hint optional claim in your client application and use the value of the login_hint optional claim as the logout_hint parameter.
     * @default undefined
     */
    logoutHint?: string;
    /**
     * Optional. If included, the app skips the email-based discovery process that user goes through on the sign-in page, leading to a slightly more streamlined user experience.
     * @default undefined
     */
    domainHint?: boolean;
}
interface MicrosoftProviderConfig {
    /**
     * Required. The tenant id is used to automatically configure the correct endpoint urls for the Microsoft provider to work.
     * @default 'login'
     */
    tenantId: 'login' | 'none' | 'consent' | 'select_account';
}
export declare const microsoft: Partial<Partial<Omit<import("../server/utils/provider").OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof import("../server/utils/provider").OidcProviderConfig | "tenantId")[] | undefined;
}> & Partial<MicrosoftProviderConfig> & {
    additionalAuthParameters?: Partial<MicrosoftAdditionalFields> | undefined;
    additionalTokenParameters?: Partial<MicrosoftAdditionalFields> | undefined;
    additionalLogoutParameters?: Partial<MicrosoftAdditionalFields> | undefined;
}> & Required<Pick<Partial<Partial<Omit<import("../server/utils/provider").OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof import("../server/utils/provider").OidcProviderConfig | "tenantId")[] | undefined;
}> & Partial<MicrosoftProviderConfig> & {
    additionalAuthParameters?: Partial<MicrosoftAdditionalFields> | undefined;
    additionalTokenParameters?: Partial<MicrosoftAdditionalFields> | undefined;
    additionalLogoutParameters?: Partial<MicrosoftAdditionalFields> | undefined;
}>, never>>;
export {};
