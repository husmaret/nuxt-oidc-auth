import { defu } from "defu";
import { createError, deleteCookie, sendRedirect, useSession } from "h3";
import { createHooks } from "hookable";
import * as providerPresets from "../../providers/index.js";
import { configMerger, refreshAccessToken, useOidcLogger } from "./oidc.js";
import { decryptToken, encryptToken } from "./security.js";
import { useRuntimeConfig, useStorage } from "#imports";
import { parsePath } from "./path.js";
const sessionName = "nuxt-oidc-auth";
let sessionConfig;
const providerSessionConfigs = {};
export async function useAuthSession(event) {
  const session = await useSession(event, {
    name: "oidc",
    password: process.env.NUXT_OIDC_AUTH_SESSION_SECRET,
    maxAge: 300
    // 5 minutes if for example registration takes place
  });
  return session;
}
export const sessionHooks = createHooks();
export async function setUserSession(event, data) {
  const session = await _useSession(event);
  await session.update(defu(data, session.data));
  return session.data;
}
export async function clearUserSession(event, skipHook = false) {
  const session = await _useSession(event);
  await useStorage("oidc").removeItem(session.id);
  if (!skipHook)
    await sessionHooks.callHookParallel("clear", event);
  await session.clear();
  deleteCookie(event, sessionName);
}
export async function refreshUserSession(event) {
  const logger = useOidcLogger();
  const session = await _useSession(event);
  const persistentSession = await useStorage("oidc").getItem(session.id);
  if (!session.data.canRefresh || !persistentSession?.refreshToken) {
    logger.warn("No refresh token");
    return;
  }
  const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY;
  const refreshToken = await decryptToken(persistentSession.refreshToken, tokenKey);
  const provider = session.data.provider;
  const config = configMerger(useRuntimeConfig().oidc.providers[provider], providerPresets[provider]);
  let tokenRefreshResponse;
  try {
    tokenRefreshResponse = await refreshAccessToken(refreshToken, config);
  } catch (error) {
    logger.error(error);
    return sendRedirect(event, parsePath(`/auth/${provider}/logout`));
  }
  const { user, tokens, expiresIn, parsedAccessToken } = tokenRefreshResponse;
  const updatedPersistentSession = {
    exp: parsedAccessToken.exp || Math.trunc(Date.now() / 1e3) + Number.parseInt(expiresIn),
    iat: parsedAccessToken.iat || Math.trunc(Date.now() / 1e3),
    accessToken: await encryptToken(tokens.accessToken, tokenKey),
    refreshToken: await encryptToken(tokens.refreshToken, tokenKey),
    ...tokens.idToken && { idToken: await encryptToken(tokens.idToken, tokenKey) }
  };
  await useStorage("oidc").setItem(session.id, updatedPersistentSession);
  const { accessToken: _accessToken, idToken: _idToken, ...userWithoutToken } = user;
  await session.update(defu(userWithoutToken, session.data));
  return {
    ...session.data,
    ...tokens.accessToken && (useRuntimeConfig(event).oidc.providers[provider]?.exposeAccessToken || providerPresets[provider].exposeAccessToken) && { accessToken: tokens.accessToken },
    ...tokens.idToken && (useRuntimeConfig(event).oidc.providers[provider]?.exposeIdToken || providerPresets[provider].exposeIdToken) && { idToken: tokens.idToken }
  };
}
export async function requireUserSession(event) {
  return await getUserSession(event);
}
export async function getUserSession(event) {
  const logger = useOidcLogger();
  const session = await _useSession(event);
  const userSession = session.data;
  if (Object.keys(userSession).length === 0) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized"
    });
  }
  const provider = userSession.provider;
  if (providerSessionConfigs[provider]?.expirationCheck) {
    const sessionId = session.id;
    const persistentSession = await useStorage("oidc").getItem(sessionId);
    if (!persistentSession)
      logger.warn("Persistent user session not found");
    let expired = true;
    if (persistentSession) {
      expired = persistentSession?.exp <= Math.trunc(Date.now() / 1e3) + (providerSessionConfigs[provider].expirationThreshold && typeof providerSessionConfigs[provider].expirationThreshold === "number" ? providerSessionConfigs[provider].expirationThreshold : 0);
    } else if (userSession) {
      expired = userSession?.expireAt <= Math.trunc(Date.now() / 1e3) + (providerSessionConfigs[provider].expirationThreshold && typeof providerSessionConfigs[provider].expirationThreshold === "number" ? providerSessionConfigs[provider].expirationThreshold : 0);
    } else {
      throw createError({
        statusCode: 401,
        message: "Session not found"
      });
    }
    if (expired) {
      logger.info("Session expired");
      if (providerSessionConfigs[provider].automaticRefresh) {
        await refreshUserSession(event);
        return userSession;
      }
      await clearUserSession(event);
      throw createError({
        statusCode: 401,
        message: "Session expired"
      });
    }
  }
  if (useRuntimeConfig(event).oidc.providers[provider]?.exposeAccessToken || providerPresets[provider].exposeAccessToken) {
    const persistentSession = await useStorage("oidc").getItem(session.id);
    const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY;
    if (persistentSession)
      userSession.accessToken = await decryptToken(persistentSession.accessToken, tokenKey);
  }
  if (useRuntimeConfig(event).oidc.providers[provider]?.exposeIdToken || providerPresets[provider].exposeIdToken) {
    const persistentSession = await useStorage("oidc").getItem(session.id);
    const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY;
    if (persistentSession?.idToken)
      userSession.idToken = await decryptToken(persistentSession.idToken, tokenKey) || void 0;
  }
  return userSession;
}
export async function getUserSessionId(event) {
  return (await _useSession(event)).id;
}
function _useSession(event) {
  if (!sessionConfig || !Object.keys(providerSessionConfigs).length) {
    sessionConfig = defu({ password: process.env.NUXT_OIDC_SESSION_SECRET, name: sessionName }, useRuntimeConfig(event).oidc.session);
    Object.keys(useRuntimeConfig(event).oidc.providers).map(
      (key) => key
    ).forEach(
      (key) => providerSessionConfigs[key] = defu(useRuntimeConfig(event).oidc.providers[key]?.sessionConfiguration, providerPresets[key].sessionConfiguration, {
        automaticRefresh: useRuntimeConfig(event).oidc.session.automaticRefresh,
        expirationCheck: useRuntimeConfig(event).oidc.session.expirationCheck,
        expirationThreshold: useRuntimeConfig(event).oidc.session.expirationThreshold
      })
    );
  }
  return useSession(event, sessionConfig);
}
