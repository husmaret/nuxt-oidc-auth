import { computed, navigateTo, useRequestFetch, useState } from "#imports";
import { parsePath } from "../server/utils/path.js";
const useSessionState = () => useState("nuxt-oidc-auth-session", void 0);
export function useOidcAuth() {
  const sessionState = useSessionState();
  const user = computed(() => sessionState.value ?? void 0);
  const loggedIn = computed(() => {
    return Boolean(sessionState.value?.expireAt);
  });
  const currentProvider = computed(() => sessionState.value?.provider || void 0);
  async function fetch() {
    useSessionState().value = await useRequestFetch()(parsePath("/api/_auth/session"), {
      headers: {
        Accept: "text/json"
      }
    }).catch(() => void 0);
  }
  async function refresh() {
    useSessionState().value = await useRequestFetch()(parsePath("/api/_auth/refresh"), {
      headers: {
        Accept: "text/json"
      },
      method: "POST"
    }).catch(() => login());
  }
  async function login(provider, params) {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : "";
    await navigateTo(parsePath(`/auth${provider ? `/${provider}` : ""}/login${queryParams}`), { external: true, redirectCode: 302 });
  }
  async function logout(provider, logoutRedirectUri) {
    await navigateTo(parsePath(`/auth${provider ? `/${provider}` : currentProvider.value ? `/${currentProvider.value}` : ""}/logout${logoutRedirectUri ? `?logout_redirect_uri=${logoutRedirectUri}` : ""}`), { external: true, redirectCode: 302 });
  }
  async function clear() {
    await useRequestFetch()(parsePath("/api/_auth/session"), {
      method: "DELETE",
      headers: {
        Accept: "text/json"
      }
    });
  }
  return {
    loggedIn,
    user,
    currentProvider,
    fetch,
    refresh,
    login,
    logout,
    clear
  };
}
