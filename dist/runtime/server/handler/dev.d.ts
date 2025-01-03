import type { OAuthConfig, UserSession } from '../../types.js';
export declare function devEventHandler({ onSuccess }: OAuthConfig<UserSession>): import("h3").EventHandler<import("h3").EventHandlerRequest, Promise<void>>;
declare const _default: import("h3").EventHandler<import("h3").EventHandlerRequest, Promise<void>>;
export default _default;
