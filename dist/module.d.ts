import * as _nuxt_schema from '@nuxt/schema';
import { ProviderKeys, ProviderConfigs, AuthSessionConfig, MiddlewareConfig, DevModeConfig } from '../dist/runtime/types.js';

declare module '@nuxt/schema' {
    interface RuntimeConfig {
        oidc: ModuleOptions;
    }
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions, ModuleOptions, false>;

interface ModuleOptions {
    /**
     * Enable module
     */
    enabled: boolean;
    /**
     * Enable Nuxt devtools integration
     * @default true
     */
    devtools?: boolean;
    /**
     * Default provider. Will be used with composable if no provider is specified
     */
    defaultProvider?: ProviderKeys;
    /**
     * OIDC providers
     */
    providers: Partial<ProviderConfigs>;
    /**
     * Optional session configuration.
     */
    session: AuthSessionConfig;
    /**
     * Middleware configuration
     */
    middleware: MiddlewareConfig;
    /**
     * Dev mode configuration
     */
    devMode?: DevModeConfig;
    /**
     * Provide defaults for NUXT_OIDC_SESSION_SECRET, NUXT_OIDC_TOKEN_KEY and NUXT_OIDC_AUTH_SESSION_SECRET using a Nitro plugin. Turning this off can lead to the app not working if no secrets are provided.
     * @default true
     */
    provideDefaultSecrets?: boolean;
}

export { type ModuleOptions, _default as default };
