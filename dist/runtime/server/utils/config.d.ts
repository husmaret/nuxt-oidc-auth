import type { ProviderConfigs, ProviderKeys } from '../../types.js';
import type { OidcProviderConfig } from './provider.js';
export interface ValidationResult<T> {
    valid: boolean;
    missingProperties?: string[];
    config: T;
}
/**
 * Validate a configuration object
 * @param config The configuration object to validate
 * @returns ValidationResult object with the validation result and the validated config stripped of optional properties
 */
export declare function validateConfig<T>(config: T, requiredProps: string[]): ValidationResult<T>;
export declare function generateProviderUrl(baseUrl: string, relativeUrl?: string): string;
export declare function replaceInjectedParameters(injectedParameters: Array<keyof OidcProviderConfig>, providerOptions: OidcProviderConfig, providerPreset: ProviderConfigs[keyof ProviderConfigs], provider: ProviderKeys): void;
