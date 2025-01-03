import type { ComputedRef } from '#imports';
import type { ProviderKeys, UserSession } from '../types.js';
export declare function useOidcAuth(): {
    loggedIn: ComputedRef<boolean>;
    user: ComputedRef<UserSession | undefined>;
    currentProvider: ComputedRef<ProviderKeys | "dev" | undefined>;
    fetch: () => Promise<void>;
    refresh: () => Promise<void>;
    login: (provider?: ProviderKeys | "dev", params?: Record<string, string>) => Promise<void>;
    logout: (provider?: ProviderKeys | "dev", logoutRedirectUri?: string) => Promise<void>;
    clear: () => Promise<void>;
};
