import type { H3Event } from 'h3';
import type { RefreshTokenRequest, TokenRequest, UserSession } from '../../types.js';
import type { OidcProviderConfig } from './provider.js';
export declare function useOidcLogger(): import("consola").ConsolaInstance;
export declare const configMerger: <Source extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
}, Defaults extends Array<{
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} | (number | boolean | any[] | Record<never, any> | null | undefined)>>(source: Source, ...defaults: Defaults) => import("defu").Defu<Source, Defaults>;
export declare function refreshAccessToken(refreshToken: string, config: OidcProviderConfig): Promise<{
    user: Omit<UserSession, "provider">;
    tokens: Record<"accessToken" | "idToken" | "refreshToken", string>;
    expiresIn: string;
    parsedAccessToken: import("./security").JwtPayload | Record<string, never>;
}>;
export declare function generateFormDataRequest(requestValues: RefreshTokenRequest | TokenRequest): FormData;
export declare function generateFormUrlEncodedRequest(requestValues: RefreshTokenRequest | TokenRequest): URLSearchParams;
export declare function convertTokenRequestToType(requestValues: RefreshTokenRequest | TokenRequest, requestType?: OidcProviderConfig['tokenRequestType']): URLSearchParams | RefreshTokenRequest | TokenRequest | FormData;
export declare function convertObjectToSnakeCase(object: Record<string, any>): Record<string, any>;
export declare function oidcErrorHandler(event: H3Event, errorText: string, errorCode?: number): Promise<void>;
