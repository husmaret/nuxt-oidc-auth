interface Auth0ProviderConfig {
    /**
     * Forces the user to sign in with a specific connection. For example, you can pass a value of github to send the user directly to GitHub to log in with their GitHub account. When not specified, the user sees the Auth0 Lock screen with all configured connections. You can see a list of your configured connections on the Connections tab of your application.
     * @default undefined
     */
    connection?: string;
    /**
     * ID of the organization to use when authenticating a user. When not provided, if your application is configured to Display Organization Prompt, the user will be able to enter the organization name when authenticating.
     * @default undefined
     */
    organization?: string;
    /**
     * Ticket ID of the organization invitation. When inviting a member to an Organization, your application should handle invitation acceptance by forwarding the invitation and organization key-value pairs when the user accepts the invitation.
     * @default undefined
     */
    invitation?: string;
    /**
     * Populates the username/email field for the login or signup page when redirecting to Auth0. Supported by the Universal Login experience.
     * @default undefined
     */
    loginHint?: string;
    /**
     * The unique identifier of the API your web app wants to access.
     * @default undefined
     */
    audience?: string;
}
export declare const auth0: Partial<Partial<Omit<import("../server/utils/provider").OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof import("../server/utils/provider").OidcProviderConfig)[] | undefined;
}> & object & {
    additionalAuthParameters?: Partial<Auth0ProviderConfig> | undefined;
    additionalTokenParameters?: Partial<Auth0ProviderConfig> | undefined;
    additionalLogoutParameters?: Partial<Auth0ProviderConfig> | undefined;
}> & Required<Pick<Partial<Partial<Omit<import("../server/utils/provider").OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof import("../server/utils/provider").OidcProviderConfig)[] | undefined;
}> & object & {
    additionalAuthParameters?: Partial<Auth0ProviderConfig> | undefined;
    additionalTokenParameters?: Partial<Auth0ProviderConfig> | undefined;
    additionalLogoutParameters?: Partial<Auth0ProviderConfig> | undefined;
}>, never>>;
export {};
