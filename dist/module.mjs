import { onDevToolsInitialized, extendServerRpc } from '@nuxt/devtools-kit';
import { createResolver, defineNuxtModule, useLogger, addImportsDir, addPlugin, addServerPlugin, addServerHandler, extendRouteRules, addRouteMiddleware } from '@nuxt/kit';
import { defu } from 'defu';
import { existsSync } from 'node:fs';
import * as providerPresets from '../dist/runtime/providers/index.js';
import { generateProviderUrl, replaceInjectedParameters } from '../dist/runtime/server/utils/config.js';

const DEVTOOLS_UI_ROUTE = "/__nuxt-oidc-auth";
const DEVTOOLS_UI_LOCAL_PORT = 3300;
function setupDevToolsUI(nuxt, resolver) {
  const clientPath = resolver.resolve("./client");
  const isProductionBuild = existsSync(clientPath);
  if (isProductionBuild) {
    nuxt.hook("vite:serverCreated", async (server) => {
      const sirv = await import('sirv').then((r) => r.default || r);
      server.middlewares.use(
        DEVTOOLS_UI_ROUTE,
        sirv(clientPath, { dev: true, single: true })
      );
    });
  } else {
    nuxt.hook("vite:extendConfig", (config) => {
      config.server = config.server || {};
      config.server.proxy = config.server.proxy || {};
      config.server.proxy[DEVTOOLS_UI_ROUTE] = {
        target: `http://localhost:${DEVTOOLS_UI_LOCAL_PORT}${DEVTOOLS_UI_ROUTE}`,
        changeOrigin: true,
        followRedirects: true,
        rewrite: (path) => path.replace(DEVTOOLS_UI_ROUTE, "")
      };
    });
  }
  nuxt.hook("devtools:customTabs", (tabs) => {
    tabs.push({
      name: "nuxt-oidc-auth",
      title: "Nuxt OIDC Auth",
      icon: "carbon:rule-locked",
      view: {
        type: "iframe",
        src: DEVTOOLS_UI_ROUTE
      }
    });
  });
}

const RPC_NAMESPACE = "nuxt-oidc-auth-rpc";
const { resolve } = createResolver(import.meta.url);
const DEFAULTS = {
  enabled: true,
  session: {
    automaticRefresh: true,
    expirationCheck: true,
    maxAge: 60 * 60 * 24,
    // 1 day
    cookie: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    }
  },
  providers: {},
  middleware: {
    globalMiddlewareEnabled: true,
    customLoginPage: false
  },
  provideDefaultSecrets: true,
  devtools: true
};
const module = defineNuxtModule({
  meta: {
    name: "nuxt-oidc-auth",
    configKey: "oidc",
    compatibility: {
      nuxt: ">=3.9.0",
      bridge: false
    }
  },
  defaults: DEFAULTS,
  setup(options, nuxt) {
    const logger = useLogger("nuxt-oidc-auth");
    if (!options.enabled)
      return;
    nuxt.options.alias["#oidc-auth"] = resolve("./types");
    addImportsDir(resolve("./runtime/composables"));
    addPlugin(resolve("./runtime/plugins/session.server"));
    if (options.provideDefaultSecrets) {
      addServerPlugin(resolve("./runtime/plugins/provideDefaults"));
    }
    if (nuxt.options.nitro.imports !== false) {
      nuxt.options.nitro.imports = defu(nuxt.options.nitro.imports, {
        presets: [
          {
            from: resolve("./runtime/server/utils/session"),
            imports: [
              "sessionHooks"
            ]
          }
        ]
      });
    }
    addServerHandler({
      handler: resolve("./runtime/server/api/session.delete"),
      route: "/api/_auth/session",
      method: "delete"
    });
    addServerHandler({
      handler: resolve("./runtime/server/api/session.get"),
      route: "/api/_auth/session",
      method: "get"
    });
    addServerHandler({
      handler: resolve("./runtime/server/api/refresh.post"),
      route: "/api/_auth/refresh",
      method: "post"
    });
    const providers = Object.keys(options.providers);
    if (!options.defaultProvider && providers.length === 1) {
      options.defaultProvider = providers[0];
    }
    if (process.env.NODE_ENV && !process.env.NODE_ENV.toLowerCase().startsWith("prod") && options.devMode?.enabled) {
      extendRouteRules("/auth/login", {
        redirect: {
          to: "/auth/dev/login",
          statusCode: 302
        }
      });
      extendRouteRules("/auth/logout", {
        redirect: {
          to: `/auth/dev/logout`,
          statusCode: 302
        }
      });
    } else {
      if (options.defaultProvider) {
        if (!options.middleware.customLoginPage) {
          extendRouteRules("/auth/login", {
            redirect: {
              to: `/auth/${options.defaultProvider}/login`,
              statusCode: 302
            }
          });
        }
        extendRouteRules("/auth/logout", {
          redirect: {
            to: `/auth/${options.defaultProvider}/logout`,
            statusCode: 302
          }
        });
      }
    }
    if (process.env.NODE_ENV && !process.env.NODE_ENV.toLowerCase().startsWith("prod") && options.devMode?.enabled) {
      addServerHandler({
        handler: resolve("./runtime/server/handler/dev"),
        route: "/auth/dev/login",
        method: "get"
      });
      addServerHandler({
        handler: resolve("./runtime/server/handler/logout.get"),
        route: "/auth/dev/logout",
        method: "get"
      });
    }
    providers.forEach((provider) => {
      const baseUrl = process.env[`NUXT_OIDC_PROVIDERS_${provider.toUpperCase()}_BASE_URL`] || options.providers[provider].baseUrl || providerPresets[provider].baseUrl;
      if (baseUrl) {
        let _baseUrl = baseUrl;
        const placeholders = baseUrl.matchAll(/\{(.*?)\}/g);
        for (const placeholderMatch of placeholders) {
          if (placeholderMatch && options.providers[provider] && Object.prototype.hasOwnProperty.call(options.providers[provider], placeholderMatch[1])) {
            _baseUrl = _baseUrl.replace(`{${placeholderMatch[1]}}`, options.providers[provider][placeholderMatch[1]]);
          }
        }
        options.providers[provider].authorizationUrl = generateProviderUrl(_baseUrl, providerPresets[provider].authorizationUrl);
        options.providers[provider].tokenUrl = generateProviderUrl(_baseUrl, providerPresets[provider].tokenUrl);
        if (providerPresets[provider].userInfoUrl && !providerPresets[provider].userInfoUrl.startsWith("https"))
          options.providers[provider].userInfoUrl = generateProviderUrl(_baseUrl, providerPresets[provider].userInfoUrl);
        if (providerPresets[provider].logoutUrl)
          options.providers[provider].logoutUrl = generateProviderUrl(_baseUrl, providerPresets[provider].logoutUrl);
      }
      replaceInjectedParameters(["clientId"], options.providers[provider], providerPresets[provider], provider);
      addServerHandler({
        handler: resolve("./runtime/server/handler/login.get"),
        route: `/auth/${provider}/login`,
        method: "get"
      });
      addServerHandler({
        handler: resolve("./runtime/server/handler/callback"),
        route: `/auth/${provider}/callback`,
        method: "get"
      });
      addServerHandler({
        handler: resolve("./runtime/server/handler/callback"),
        route: `/auth/${provider}/callback`,
        method: "post"
      });
      addServerHandler({
        handler: resolve("./runtime/server/handler/logout.get"),
        route: `/auth/${provider}/logout`,
        method: "get"
      });
    });
    if (!nuxt.options._prepare)
      logger.success(`Registered ${providers.length} OIDC providers: ${providers.join(", ")}`);
    if (options.middleware.globalMiddlewareEnabled) {
      addRouteMiddleware({
        name: "00.auth.global",
        path: resolve("runtime/middleware/oidcAuth"),
        global: true
      });
    }
    onDevToolsInitialized(async () => {
      extendServerRpc(RPC_NAMESPACE, {
        getNuxtOidcAuthSecrets() {
          const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY || "";
          const sessionSecret = process.env.NUXT_OIDC_SESSION_SECRET || "";
          const authSessionSecret = process.env.NUXT_OIDC_AUTH_SESSION_SECRET || "";
          return {
            tokenKey,
            sessionSecret,
            authSessionSecret
          };
        }
      });
    });
    if (options.devtools)
      setupDevToolsUI(nuxt, createResolver(import.meta.url));
    nuxt.options.runtimeConfig.oidc = defu(
      nuxt.options.runtimeConfig.oidc,
      {
        ...options
      }
    );
  }
});

export { module as default };
