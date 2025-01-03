import { useRuntimeConfig } from "#imports";
export function parsePath(path) {
  const nuxtBaseUrl = useRuntimeConfig().app.baseURL ?? "/";
  return `${nuxtBaseUrl}${path.startsWith("/") ? path.slice(1) : path}`;
}
