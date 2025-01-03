import type { ProviderSessionConfig } from '../../types.js';
type MakePropertiesRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
type PossibleCombinations<T extends string, U extends string = T> = T extends any ? (T | `${T} ${PossibleCombinations<Exclude<U, T>>}`) : never;
export interface OidcProviderConfig {
    /**
     * Client ID - Required by OIDC spec
     */
    clientId: string;
    /**
     * Client Secret
     */
    clientSecret: string;
    /**
     * Response Type - Required by OIDC spec
     * @default 'code'
     */
    responseType: 'code' | 'code token' | 'code id_token' | 'id_token token' | 'code id_token token';
    /**
     * Authentication scheme
     * @default 'header'
     */
    authenticationScheme: 'header' | 'body' | 'none';
    /**
     * Response mode for authentication request
     * @see https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html
     */
    responseMode: 'query' | 'fragment' | 'form_post' | string;
    /**
     * Authorization endpoint URL
     */
    authorizationUrl: string;
    /**
     * Token endpoint URL
     */
    tokenUrl: string;
    /**
     * Userinfo endpoint URL
     */
    userInfoUrl?: string;
    /**
     * Redirect URI - Required by OIDC spec
     */
    redirectUri: string;
    /**
     * Grant Type
     * @default 'authorization_code'
     */
    grantType: 'authorization_code' | 'refresh_token';
    /**
     * Scope - 'openid' required by OIDC spec, use 'offline_access' to request a refresh_token
     * @default ['openid']
     * @example ['openid', 'profile', 'email']
     */
    scope?: string[];
    /**
     * Some token refresh endpoints require to strip the offline_access scope when requesting/refreshing a access_token
     * @default false
     */
    excludeOfflineScopeFromTokenRequest?: boolean;
    /**
     * Use PKCE (Proof Key for Code Exchange)
     * @default false
     */
    pkce?: boolean;
    /**
     * Use state parameter with a random value. If state is not used, the nonce parameter is used to identify the flow.
     * @default true
     */
    state?: boolean;
    /**
     * Use nonce parameter with a random value.
     * @default false
     */
    nonce?: boolean;
    /**
     * User name claim that is used to get the user name from the access token as a fallback in case the userinfo endpoint is not provided or the userinfo request fails.
     * @default ''
     */
    userNameClaim?: string;
    /**
     * Claims to be extracted from the id token
     * @default []
     */
    optionalClaims?: string[];
    /**
     * Logout endpoint URL
     * @default ''
     */
    logoutUrl?: string;
    /**
     * Include scope in token request
     * @default false
     */
    scopeInTokenRequest?: boolean;
    /**
     * Token request type
     * @default 'form'
     */
    tokenRequestType?: 'form' | 'json' | 'form-urlencoded';
    /**
     * Audience used for token validation (not included in requests by default, use additionalTokenParameters or additionalAuthParameters to add it)
     */
    audience?: string;
    /**
     * Required properties of the configuration that will be validated at runtime
     */
    requiredProperties: (keyof OidcProviderConfig)[];
    /**
     * Filter userinfo response to only include these properties
     */
    filterUserInfo?: string[];
    /**
     * Skip access token parsing (for providers that don't follow the OIDC spec/don't issue JWT access tokens)
     */
    skipAccessTokenParsing?: boolean;
    /**
     * Query parameter name for logout redirect. Will be appended to the logoutUrl as a query parameter with this value and the name of logoutRedirectParameterName.
     */
    logoutRedirectUri?: string;
    /**
     * Query parameter name for logout redirect. Will be appended to the logoutUrl as a query parameter with this name and a value of logoutRedirectUri. The logoutRedirectUri can also be provided as a parameter with the `logout` composable function.
     */
    logoutRedirectParameterName?: string;
    /**
     * Additional parameters to be added to the authorization request
     * @default undefined
     */
    additionalAuthParameters?: Record<string, string>;
    /**
     * Additional parameters to be added to the token request
     * @default undefined
     */
    additionalTokenParameters?: Record<string, string>;
    /**
     * Additional parameters to be added to the logout request
     * @default undefined
     */
    additionalLogoutParameters?: Record<string, string>;
    /**
     * OpenID Configuration object or function promise that resolves to an OpenID Configuration object
     */
    openIdConfiguration?: Record<string, unknown> | ((config: any) => Promise<Record<string, unknown>>);
    /**
     * Validate access token
     * @default true
     */
    validateAccessToken?: boolean;
    /**
     * Validate id token
     * @default true
     */
    validateIdToken?: boolean;
    /**
     * Provider Only. Base URL for the provider, used when to dynamically create authorizationUrl, tokenUrl, userinfoUrl and logoutUrl if possible
     */
    baseUrl?: string;
    /**
     * Space-delimited list of string values that specifies whether the authorization server prompts the user for reauthentication and consent
     */
    prompt?: Array<'none'> | Array<PossibleCombinations<'login' | 'consent' | 'select_account'>>;
    /**
     * Encode redirect uri query parameter in authorization request. Only for compatibility with services that don't implement proper parsing of query parameters.
     * @default false
     */
    encodeRedirectUri?: boolean;
    /**
     * Expose raw access token to the client within session object
     * @default false
     */
    exposeAccessToken?: boolean;
    /**
     * Expose raw id token to the client within session object
     * @default false
     */
    exposeIdToken?: boolean;
    /**
     * Set a custom redirect url to redirect to after a successful callback
     * @default '/'
     */
    callbackRedirectUrl?: string;
    /**
     * List of allowed client-side user-added query parameters for the auth request
     * @default []
     */
    allowedClientAuthParameters?: string[];
    /**
     * Session configuration overrides
     * @default undefined
     */
    sessionConfiguration?: ProviderSessionConfig;
}
export declare function defineOidcProvider<TConfig, TRequired extends keyof (OidcProviderConfig & TProviderConfig), TProviderConfig extends object = object>(config?: Partial<Omit<OidcProviderConfig, 'requiredProperties'> & {
    requiredProperties?: (keyof (TProviderConfig & OidcProviderConfig))[];
}> & Partial<TProviderConfig> & {
    additionalAuthParameters?: Partial<TConfig>;
    additionalTokenParameters?: Partial<TConfig>;
    additionalLogoutParameters?: Partial<TConfig>;
}): MakePropertiesRequired<Partial<Partial<Omit<OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof (TProviderConfig & OidcProviderConfig))[];
}> & Partial<TProviderConfig> & {
    additionalAuthParameters?: Partial<TConfig>;
    additionalTokenParameters?: Partial<TConfig>;
    additionalLogoutParameters?: Partial<TConfig>;
} extends infer T ? T extends Partial<Omit<OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof (TProviderConfig & OidcProviderConfig))[];
}> & Partial<TProviderConfig> & {
    additionalAuthParameters?: Partial<TConfig>;
    additionalTokenParameters?: Partial<TConfig>;
    additionalLogoutParameters?: Partial<TConfig>;
} ? T extends Partial<Omit<OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof (TProviderConfig & OidcProviderConfig))[];
}> ? T : Omit<T, keyof T & ("clientId" | "clientSecret" | "responseType" | "authenticationScheme" | "responseMode" | "authorizationUrl" | "tokenUrl" | "userInfoUrl" | "redirectUri" | "grantType" | "scope" | "excludeOfflineScopeFromTokenRequest" | "pkce" | "state" | "nonce" | "userNameClaim" | "optionalClaims" | "logoutUrl" | "scopeInTokenRequest" | "tokenRequestType" | "audience" | "requiredProperties" | "filterUserInfo" | "skipAccessTokenParsing" | "logoutRedirectUri" | "logoutRedirectParameterName" | "additionalAuthParameters" | "additionalTokenParameters" | "additionalLogoutParameters" | "openIdConfiguration" | "validateAccessToken" | "validateIdToken" | "baseUrl" | "prompt" | "encodeRedirectUri" | "exposeAccessToken" | "exposeIdToken" | "callbackRedirectUrl" | "allowedClientAuthParameters" | "sessionConfiguration")> & Omit<Partial<Omit<OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof (TProviderConfig & OidcProviderConfig))[];
}>, keyof T & ("clientId" | "clientSecret" | "responseType" | "authenticationScheme" | "responseMode" | "authorizationUrl" | "tokenUrl" | "userInfoUrl" | "redirectUri" | "grantType" | "scope" | "excludeOfflineScopeFromTokenRequest" | "pkce" | "state" | "nonce" | "userNameClaim" | "optionalClaims" | "logoutUrl" | "scopeInTokenRequest" | "tokenRequestType" | "audience" | "requiredProperties" | "filterUserInfo" | "skipAccessTokenParsing" | "logoutRedirectUri" | "logoutRedirectParameterName" | "additionalAuthParameters" | "additionalTokenParameters" | "additionalLogoutParameters" | "openIdConfiguration" | "validateAccessToken" | "validateIdToken" | "baseUrl" | "prompt" | "encodeRedirectUri" | "exposeAccessToken" | "exposeIdToken" | "callbackRedirectUrl" | "allowedClientAuthParameters" | "sessionConfiguration")> & { -readonly [Key in keyof T & ("clientId" | "clientSecret" | "responseType" | "authenticationScheme" | "responseMode" | "authorizationUrl" | "tokenUrl" | "userInfoUrl" | "redirectUri" | "grantType" | "scope" | "excludeOfflineScopeFromTokenRequest" | "pkce" | "state" | "nonce" | "userNameClaim" | "optionalClaims" | "logoutUrl" | "scopeInTokenRequest" | "tokenRequestType" | "audience" | "requiredProperties" | "filterUserInfo" | "skipAccessTokenParsing" | "logoutRedirectUri" | "logoutRedirectParameterName" | "additionalAuthParameters" | "additionalTokenParameters" | "additionalLogoutParameters" | "openIdConfiguration" | "validateAccessToken" | "validateIdToken" | "baseUrl" | "prompt" | "encodeRedirectUri" | "exposeAccessToken" | "exposeIdToken" | "callbackRedirectUrl" | "allowedClientAuthParameters" | "sessionConfiguration")]: T[Key] extends void | null | undefined ? Partial<Omit<OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof (TProviderConfig & OidcProviderConfig))[];
}>[Key] extends void | null | undefined ? void | null | undefined : Partial<Omit<OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof (TProviderConfig & OidcProviderConfig))[];
}>[Key] : Partial<Omit<OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof (TProviderConfig & OidcProviderConfig))[];
}>[Key] extends void | null | undefined ? T[Key] : T[Key] extends infer T_1 ? T_1 extends T[Key] ? T_1 extends void | null | undefined ? Partial<Omit<OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof (TProviderConfig & OidcProviderConfig))[];
}>[Key] extends infer T_2 ? T_2 extends Partial<Omit<OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof (TProviderConfig & OidcProviderConfig))[];
}>[Key] ? T_2 extends void | null | undefined ? void | null | undefined : T_2 : never : never : Partial<Omit<OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof (TProviderConfig & OidcProviderConfig))[];
}>[Key] extends infer T_3 ? T_3 extends Partial<Omit<OidcProviderConfig, "requiredProperties"> & {
    requiredProperties?: (keyof (TProviderConfig & OidcProviderConfig))[];
}>[Key] ? T_3 extends void | null | undefined ? T_1 : T_1 extends any[] ? T_3 extends any[] ? T_1 extends infer T_4 ? T_4 extends T_1 ? T_4 extends (infer DestinationType)[] ? T_3 extends infer T_5 ? T_5 extends T_3 ? T_5 extends (infer SourceType)[] ? (DestinationType | SourceType)[] : DestinationType[] | T_5 : never : never : T_3 | T_4 : never : never : T_3 | T_1 : T_1 extends Function ? T_3 | T_1 : T_1 extends RegExp ? T_3 | T_1 : T_1 extends Promise<any> ? T_3 | T_1 : T_3 extends Function ? T_1 | T_3 : T_3 extends RegExp ? T_1 | T_3 : T_3 extends Promise<any> ? T_1 | T_3 : T_1 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_3 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_1 extends infer T_6 ? T_6 extends T_1 ? T_6 extends T_3 ? T_6 : Omit<T_6, keyof T_6 & keyof T_3> & Omit<T_3, keyof T_6 & keyof T_3> & { -readonly [Key_1 in keyof T_6 & keyof T_3]: T_6[Key_1] extends void | null | undefined ? T_3[Key_1] extends void | null | undefined ? void | null | undefined : T_3[Key_1] : T_3[Key_1] extends void | null | undefined ? T_6[Key_1] : T_6[Key_1] extends infer T_7 ? T_7 extends T_6[Key_1] ? T_7 extends void | null | undefined ? T_3[Key_1] extends infer T_8 ? T_8 extends T_3[Key_1] ? T_8 extends void | null | undefined ? void | null | undefined : T_8 : never : never : T_3[Key_1] extends infer T_9 ? T_9 extends T_3[Key_1] ? T_9 extends void | null | undefined ? T_7 : T_7 extends any[] ? T_9 extends any[] ? T_7 extends infer T_10 ? T_10 extends T_7 ? T_10 extends (infer DestinationType)[] ? T_9 extends infer T_11 ? T_11 extends T_9 ? T_11 extends (infer SourceType)[] ? (DestinationType | SourceType)[] : DestinationType[] | T_11 : never : never : T_9 | T_10 : never : never : T_9 | T_7 : T_7 extends Function ? T_9 | T_7 : T_7 extends RegExp ? T_9 | T_7 : T_7 extends Promise<any> ? T_9 | T_7 : T_9 extends Function ? T_7 | T_9 : T_9 extends RegExp ? T_7 | T_9 : T_9 extends Promise<any> ? T_7 | T_9 : T_7 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_9 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_7 extends infer T_12 ? T_12 extends T_7 ? T_12 extends T_9 ? T_12 : Omit<T_12, keyof T_12 & keyof T_9> & Omit<T_9, keyof T_12 & keyof T_9> & { -readonly [Key_2 in keyof T_12 & keyof T_9]: T_12[Key_2] extends void | null | undefined ? T_9[Key_2] extends void | null | undefined ? void | null | undefined : T_9[Key_2] : T_9[Key_2] extends void | null | undefined ? T_12[Key_2] : T_12[Key_2] extends infer T_13 ? T_13 extends T_12[Key_2] ? T_13 extends void | null | undefined ? T_9[Key_2] extends infer T_14 ? T_14 extends T_9[Key_2] ? T_14 extends void | null | undefined ? void | null | undefined : T_14 : never : never : T_9[Key_2] extends infer T_15 ? T_15 extends T_9[Key_2] ? T_15 extends void | null | undefined ? T_13 : T_13 extends any[] ? T_15 extends any[] ? T_13 extends infer T_16 ? T_16 extends T_13 ? T_16 extends (infer DestinationType)[] ? T_15 extends infer T_17 ? T_17 extends T_15 ? T_17 extends (infer SourceType)[] ? (DestinationType | SourceType)[] : DestinationType[] | T_17 : never : never : T_15 | T_16 : never : never : T_15 | T_13 : T_13 extends Function ? T_15 | T_13 : T_13 extends RegExp ? T_15 | T_13 : T_13 extends Promise<any> ? T_15 | T_13 : T_15 extends Function ? T_13 | T_15 : T_15 extends RegExp ? T_13 | T_15 : T_15 extends Promise<any> ? T_13 | T_15 : T_13 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_15 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_13 extends infer T_18 ? T_18 extends T_13 ? T_18 extends T_15 ? T_18 : Omit<T_18, keyof T_18 & keyof T_15> & Omit<T_15, keyof T_18 & keyof T_15> & { -readonly [Key_3 in keyof T_18 & keyof T_15]: T_18[Key_3] extends void | null | undefined ? T_15[Key_3] extends void | null | undefined ? void | null | undefined : T_15[Key_3] : T_15[Key_3] extends void | null | undefined ? T_18[Key_3] : T_18[Key_3] extends infer T_19 ? T_19 extends T_18[Key_3] ? T_19 extends void | null | undefined ? T_15[Key_3] extends infer T_20 ? T_20 extends T_15[Key_3] ? T_20 extends void | null | undefined ? void | null | undefined : T_20 : never : never : T_15[Key_3] extends infer T_21 ? T_21 extends T_15[Key_3] ? T_21 extends void | null | undefined ? T_19 : T_19 extends any[] ? T_21 extends any[] ? T_19 extends infer T_22 ? T_22 extends T_19 ? T_22 extends (infer DestinationType)[] ? T_21 extends infer T_23 ? T_23 extends T_21 ? T_23 extends (infer SourceType)[] ? (DestinationType | SourceType)[] : DestinationType[] | T_23 : never : never : T_21 | T_22 : never : never : T_21 | T_19 : T_19 extends Function ? T_21 | T_19 : T_19 extends RegExp ? T_21 | T_19 : T_19 extends Promise<any> ? T_21 | T_19 : T_21 extends Function ? T_19 | T_21 : T_21 extends RegExp ? T_19 | T_21 : T_21 extends Promise<any> ? T_19 | T_21 : T_19 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_21 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_19 extends infer T_24 ? T_24 extends T_19 ? T_24 extends T_21 ? T_24 : Omit<T_24, keyof T_24 & keyof T_21> & Omit<T_21, keyof T_24 & keyof T_21> & { -readonly [Key_4 in keyof T_24 & keyof T_21]: T_24[Key_4] extends void | null | undefined ? T_21[Key_4] extends void | null | undefined ? void | null | undefined : T_21[Key_4] : T_21[Key_4] extends void | null | undefined ? T_24[Key_4] : T_24[Key_4] extends infer T_25 ? T_25 extends T_24[Key_4] ? T_25 extends void | null | undefined ? T_21[Key_4] extends infer T_26 ? T_26 extends T_21[Key_4] ? T_26 extends void | null | undefined ? void | null | undefined : T_26 : never : never : T_21[Key_4] extends infer T_27 ? T_27 extends T_21[Key_4] ? T_27 extends void | null | undefined ? T_25 : T_25 extends any[] ? T_27 extends any[] ? T_25 extends infer T_28 ? T_28 extends T_25 ? T_28 extends (infer DestinationType)[] ? T_27 extends infer T_29 ? T_29 extends T_27 ? T_29 extends (infer SourceType)[] ? (DestinationType | SourceType)[] : DestinationType[] | T_29 : never : never : T_27 | T_28 : never : never : T_27 | T_25 : T_25 extends Function ? T_27 | T_25 : T_25 extends RegExp ? T_27 | T_25 : T_25 extends Promise<any> ? T_27 | T_25 : T_27 extends Function ? T_25 | T_27 : T_27 extends RegExp ? T_25 | T_27 : T_27 extends Promise<any> ? T_25 | T_27 : T_25 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_27 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_25 extends infer T_30 ? T_30 extends T_25 ? T_30 extends T_27 ? T_30 : Omit<T_30, keyof T_30 & keyof T_27> & Omit<T_27, keyof T_30 & keyof T_27> & { -readonly [Key_5 in keyof T_30 & keyof T_27]: T_30[Key_5] extends void | null | undefined ? T_27[Key_5] extends void | null | undefined ? void | null | undefined : T_27[Key_5] : T_27[Key_5] extends void | null | undefined ? T_30[Key_5] : T_30[Key_5] extends infer T_31 ? T_31 extends T_30[Key_5] ? T_31 extends void | null | undefined ? T_27[Key_5] extends infer T_32 ? T_32 extends T_27[Key_5] ? T_32 extends void | null | undefined ? void | null | undefined : T_32 : never : never : T_27[Key_5] extends infer T_33 ? T_33 extends T_27[Key_5] ? T_33 extends void | null | undefined ? T_31 : T_31 extends any[] ? T_33 extends any[] ? T_31 extends infer T_34 ? T_34 extends T_31 ? T_34 extends (infer DestinationType)[] ? T_33 extends infer T_35 ? T_35 extends T_33 ? T_35 extends (infer SourceType)[] ? (DestinationType | SourceType)[] : DestinationType[] | T_35 : never : never : T_33 | T_34 : never : never : T_33 | T_31 : T_31 extends Function ? T_33 | T_31 : T_31 extends RegExp ? T_33 | T_31 : T_31 extends Promise<any> ? T_33 | T_31 : T_33 extends Function ? T_31 | T_33 : T_33 extends RegExp ? T_31 | T_33 : T_33 extends Promise<any> ? T_31 | T_33 : T_31 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_33 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_31 extends infer T_36 ? T_36 extends T_31 ? T_36 extends T_33 ? T_36 : Omit<T_36, keyof T_36 & keyof T_33> & Omit<T_33, keyof T_36 & keyof T_33> & { -readonly [Key_6 in keyof T_36 & keyof T_33]: T_36[Key_6] extends void | null | undefined ? T_33[Key_6] extends void | null | undefined ? void | null | undefined : T_33[Key_6] : T_33[Key_6] extends void | null | undefined ? T_36[Key_6] : T_36[Key_6] extends infer T_37 ? T_37 extends T_36[Key_6] ? T_37 extends void | null | undefined ? T_33[Key_6] extends infer T_38 ? T_38 extends T_33[Key_6] ? T_38 extends void | null | undefined ? void | null | undefined : T_38 : never : never : T_33[Key_6] extends infer T_39 ? T_39 extends T_33[Key_6] ? T_39 extends void | null | undefined ? T_37 : T_37 extends any[] ? T_39 extends any[] ? T_37 extends infer T_40 ? T_40 extends T_37 ? T_40 extends (infer DestinationType)[] ? T_39 extends infer T_41 ? T_41 extends T_39 ? T_41 extends (infer SourceType)[] ? (DestinationType | SourceType)[] : DestinationType[] | T_41 : never : never : T_39 | T_40 : never : never : T_39 | T_37 : T_37 extends Function ? T_39 | T_37 : T_37 extends RegExp ? T_39 | T_37 : T_37 extends Promise<any> ? T_39 | T_37 : T_39 extends Function ? T_37 | T_39 : T_39 extends RegExp ? T_37 | T_39 : T_39 extends Promise<any> ? T_37 | T_39 : T_37 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_39 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_37 extends infer T_42 ? T_42 extends T_37 ? T_42 extends T_39 ? T_42 : Omit<T_42, keyof T_42 & keyof T_39> & Omit<T_39, keyof T_42 & keyof T_39> & { -readonly [Key_7 in keyof T_42 & keyof T_39]: T_42[Key_7] extends void | null | undefined ? T_39[Key_7] extends void | null | undefined ? void | null | undefined : T_39[Key_7] : T_39[Key_7] extends void | null | undefined ? T_42[Key_7] : T_42[Key_7] extends infer T_43 ? T_43 extends T_42[Key_7] ? T_43 extends void | null | undefined ? T_39[Key_7] extends infer T_44 ? T_44 extends T_39[Key_7] ? T_44 extends void | null | undefined ? void | null | undefined : T_44 : never : never : T_39[Key_7] extends infer T_45 ? T_45 extends T_39[Key_7] ? T_45 extends void | null | undefined ? T_43 : T_43 extends any[] ? T_45 extends any[] ? T_43 extends infer T_46 ? T_46 extends T_43 ? T_46 extends (infer DestinationType)[] ? T_45 extends infer T_47 ? T_47 extends T_45 ? T_47 extends (infer SourceType)[] ? (DestinationType | SourceType)[] : DestinationType[] | T_47 : never : never : T_45 | T_46 : never : never : T_45 | T_43 : T_43 extends Function ? T_45 | T_43 : T_43 extends RegExp ? T_45 | T_43 : T_43 extends Promise<any> ? T_45 | T_43 : T_45 extends Function ? T_43 | T_45 : T_45 extends RegExp ? T_43 | T_45 : T_45 extends Promise<any> ? T_43 | T_45 : T_43 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_45 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_43 extends infer T_48 ? T_48 extends T_43 ? T_48 extends T_45 ? T_48 : Omit<T_48, keyof T_48 & keyof T_45> & Omit<T_45, keyof T_48 & keyof T_45> & { -readonly [Key_8 in keyof T_48 & keyof T_45]: T_48[Key_8] extends void | null | undefined ? T_45[Key_8] extends void | null | undefined ? void | null | undefined : T_45[Key_8] : T_45[Key_8] extends void | null | undefined ? T_48[Key_8] : T_48[Key_8] extends infer T_49 ? T_49 extends T_48[Key_8] ? T_49 extends void | null | undefined ? T_45[Key_8] extends infer T_50 ? T_50 extends T_45[Key_8] ? T_50 extends void | null | undefined ? void | null | undefined : T_50 : never : never : T_45[Key_8] extends infer T_51 ? T_51 extends T_45[Key_8] ? T_51 extends void | null | undefined ? T_49 : T_49 extends any[] ? T_51 extends any[] ? T_49 extends infer T_52 ? T_52 extends T_49 ? T_52 extends (infer DestinationType)[] ? T_51 extends infer T_53 ? T_53 extends T_51 ? T_53 extends (infer SourceType)[] ? (DestinationType | SourceType)[] : DestinationType[] | T_53 : never : never : T_51 | T_52 : never : never : T_51 | T_49 : T_49 extends Function ? T_51 | T_49 : T_49 extends RegExp ? T_51 | T_49 : T_49 extends Promise<any> ? T_51 | T_49 : T_51 extends Function ? T_49 | T_51 : T_51 extends RegExp ? T_49 | T_51 : T_51 extends Promise<any> ? T_49 | T_51 : T_49 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_51 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_49 extends infer T_54 ? T_54 extends T_49 ? T_54 extends T_51 ? T_54 : Omit<T_54, keyof T_54 & keyof T_51> & Omit<T_51, keyof T_54 & keyof T_51> & { -readonly [Key_9 in keyof T_54 & keyof T_51]: T_54[Key_9] extends void | null | undefined ? T_51[Key_9] extends void | null | undefined ? void | null | undefined : T_51[Key_9] : T_51[Key_9] extends void | null | undefined ? T_54[Key_9] : T_54[Key_9] extends infer T_55 ? T_55 extends T_54[Key_9] ? T_55 extends void | null | undefined ? T_51[Key_9] extends infer T_56 ? T_56 extends T_51[Key_9] ? T_56 extends void | null | undefined ? void | null | undefined : T_56 : never : never : T_51[Key_9] extends infer T_57 ? T_57 extends T_51[Key_9] ? T_57 extends void | null | undefined ? T_55 : T_55 extends any[] ? T_57 extends any[] ? T_55 extends infer T_58 ? T_58 extends T_55 ? T_58 extends (infer DestinationType)[] ? T_57 extends infer T_59 ? T_59 extends T_57 ? T_59 extends (infer SourceType)[] ? (DestinationType | SourceType)[] : DestinationType[] | T_59 : never : never : T_57 | T_58 : never : never : T_57 | T_55 : T_55 extends Function ? T_57 | T_55 : T_55 extends RegExp ? T_57 | T_55 : T_55 extends Promise<any> ? T_57 | T_55 : T_57 extends Function ? T_55 | T_57 : T_57 extends RegExp ? T_55 | T_57 : T_57 extends Promise<any> ? T_55 | T_57 : T_55 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_57 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_55 extends infer T_60 ? T_60 extends T_55 ? T_60 extends T_57 ? T_60 : Omit<T_60, keyof T_60 & keyof T_57> & Omit<T_57, keyof T_60 & keyof T_57> & { -readonly [Key_10 in keyof T_60 & keyof T_57]: T_60[Key_10] extends void | null | undefined ? T_57[Key_10] extends void | null | undefined ? void | null | undefined : T_57[Key_10] : T_57[Key_10] extends void | null | undefined ? T_60[Key_10] : T_60[Key_10] extends infer T_61 ? T_61 extends T_60[Key_10] ? T_61 extends void | null | undefined ? T_57[Key_10] extends infer T_62 ? T_62 extends T_57[Key_10] ? T_62 extends void | null | undefined ? void | null | undefined : T_62 : never : never : T_57[Key_10] extends infer T_63 ? T_63 extends T_57[Key_10] ? T_63 extends void | null | undefined ? T_61 : T_61 extends any[] ? T_63 extends any[] ? T_61 extends infer T_64 ? T_64 extends T_61 ? T_64 extends (infer DestinationType)[] ? T_63 extends infer T_65 ? T_65 extends T_63 ? T_65 extends (infer SourceType)[] ? (DestinationType | SourceType)[] : DestinationType[] | T_65 : never : never : T_63 | T_64 : never : never : T_63 | T_61 : T_61 extends Function ? T_63 | T_61 : T_61 extends RegExp ? T_63 | T_61 : T_61 extends Promise<any> ? T_63 | T_61 : T_63 extends Function ? T_61 | T_63 : T_63 extends RegExp ? T_61 | T_63 : T_63 extends Promise<any> ? T_61 | T_63 : T_61 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? T_63 extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} ? any : T_63 | T_61 : T_61 | T_63 : never : never : never : never; } : never : never : T_57 | T_55 : T_55 | T_57 : never : never : never : never; } : never : never : T_51 | T_49 : T_49 | T_51 : never : never : never : never; } : never : never : T_45 | T_43 : T_43 | T_45 : never : never : never : never; } : never : never : T_39 | T_37 : T_37 | T_39 : never : never : never : never; } : never : never : T_33 | T_31 : T_31 | T_33 : never : never : never : never; } : never : never : T_27 | T_25 : T_25 | T_27 : never : never : never : never; } : never : never : T_21 | T_19 : T_19 | T_21 : never : never : never : never; } : never : never : T_15 | T_13 : T_13 | T_15 : never : never : never : never; } : never : never : T_9 | T_7 : T_7 | T_9 : never : never : never : never; } : never : never : T_3 | T_1 : T_1 | T_3 : never : never : never : never; } : never : never>, TRequired & "redirectUri">;
export {};
