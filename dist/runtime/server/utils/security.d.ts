export interface JwtPayload {
    iss?: string;
    sub?: string;
    aud?: string | string[];
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
    [key: string]: string | number | string[] | number[] | undefined;
}
interface JwtHeader {
    'alg': 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512' | 'PS256' | 'PS384' | 'PS512' | 'none';
    'jku'?: string;
    'jwk'?: string;
    'kid'?: string;
    'x5u'?: string | string[];
    'x5c'?: string | string[];
    'x5t'?: string;
    'x5t#S256'?: string;
    'crit'?: Array<Exclude<keyof JwtHeader, 'crit'>>;
    'typ'?: string;
    'cty'?: string;
    [key: string]: unknown;
}
export interface JwtToken {
    header: JwtHeader;
    payload: JwtPayload;
    signature: string;
}
export interface EncryptedToken {
    encryptedToken: string;
    iv: string;
}
export interface ValidateAccessTokenOptions {
    issuer: string | string[];
    jwksUri: string;
    audience?: string | string[];
}
/**
 * Generates a PKCE (Proof Key for Code Exchange) verifier string.
 * @param length The length of the verifier string. Defaults to 64.
 * @returns The generated PKCE verifier string.
 * @see https://datatracker.ietf.org/doc/html/rfc7636#section-4.1
 */
export declare function generatePkceVerifier(length?: number): string;
/**
 * Generates a PKCE (Proof Key for Code Exchange) code challenge.
 * @param pkceVerifier The PKCE verifier string.
 * @returns The generated PKCE code challenge.
 * @see https://datatracker.ietf.org/doc/html/rfc7636#section-4.2
 */
export declare function generatePkceCodeChallenge(pkceVerifier: string): Promise<string>;
/**
 * Generates a random URL-safe string. The resulting string can be a different size
 * @param length The length of the underlying byte array. Defaults to 48.
 * @returns The generated URL-safe bytes as base64url encoded string.
 */
export declare function generateRandomUrlSafeString(length?: number): string;
/**
 * Encrypts a refresh token with AES-GCM.
 * @param token The refresh token to encrypt.
 * @param key The base64 encoded 256-bit key to use for encryption.
 * @returns The base64 encoded encrypted refresh token and the base64 encoded initialization vector.
 */
export declare function encryptToken(token: string, key: string): Promise<EncryptedToken>;
/**
 * Decrypts a refresh token with AES-GCM.
 * @param input The encrypted refresh token and the initialization vector.
 * @param key The base64 encoded 256-bit key to use for decryption.
 * @returns The decrypted refresh token.
 */
export declare function decryptToken(input: EncryptedToken, key: string): Promise<string>;
/**
 * Decode and parse a standard 3 segment JWT token
 * @param token
 * @param skipParsing
 * @returns A decoded JWT token object with a JSON parsed header and payload
 */
export declare function parseJwtToken(token: string, skipParsing?: boolean): JwtPayload | Record<string, never>;
export declare function validateToken(token: string, options: ValidateAccessTokenOptions): Promise<JwtPayload>;
export {};
