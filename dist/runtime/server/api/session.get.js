import { eventHandler } from "h3";
import { getUserSession, sessionHooks } from "../utils/session.js";
export default eventHandler(async (event) => {
  const session = await getUserSession(event);
  await sessionHooks.callHookParallel("fetch", session, event);
  return session;
});
