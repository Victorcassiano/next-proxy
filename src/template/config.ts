export const configTemplate = `
import { defineNextProxyConfig } from "@victorcassiano/next-proxy";

export default defineNextProxyConfig({
  auth: {
    strategy: "cookie",
    key: "auth_token",
  },
  routes: {
    "/": "public",
    "/dashboard": "private",
    "/login": "public",
  },
  redirects: {
    unauthenticated: "/login",
  },
  fallback: "/",
});
`;