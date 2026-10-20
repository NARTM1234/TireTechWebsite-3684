import { createAuthClient } from "better-auth/react";
const TOKEN_KEY = "tiretech-admin-session";
export function getAdminToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}
export function clearAdminToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* unavailable storage */
  }
}
export const authClient = createAuthClient({
  baseURL: window.location.origin,
  basePath: "/api/auth",
  fetchOptions: {
    credentials: "include",
    auth: { type: "Bearer", token: getAdminToken },
    onSuccess(ctx) {
      const token = ctx.response.headers.get("set-auth-token");
      if (token) {
        try {
          sessionStorage.setItem(TOKEN_KEY, token);
        } catch {
          /* cookie session fallback */
        }
      }
    },
  },
});
