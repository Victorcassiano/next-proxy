import { defineNextProxyConfig } from "@victorcassiano/next-proxy";

export default defineNextProxyConfig({
  auth: {
    strategy: "cookie",
    key: "session_token",
  },
  routes: {
    "/": "public",
    "/about": "public",
    "/dashboard": "private",
    "/dashboard/settings": "private",
    "/admin/*": "private",
    "/api/public": "public",
    "/api/private": "private",
    "/login": "public-only",
    "/register": "public-only",
  },
  redirects: {
    unauthenticated: "/login",
    authenticated: "/dashboard",
  },
  fallback: "/",
  output: {
    matcher: ["/((?!_next|fonts|icons|[\\w-]+\\.\\w+).*)"],
  },
});
