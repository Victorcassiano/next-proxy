export const configTemplate = `
import { defineNextProxyConfig } from "next-proxy";

export default defineNextProxyConfig({
  auth: {
    strategy: "cookie",
    cookie: {
      name: "auth_token",
      secret: "VARIABLE_ENV",
    },
  },
  routes: {
    "/": "public",
    "/dashboard": "private",
    "/login": "publicOnly",
  },
  redirects: {
    unauthenticated: "/login",
    authenticated: "/dashboard",
    unauthorized: "/dashboard",
  },
  fallback: "/",
  roles: 
    [
      {name: "admin", navigations: ["/admin", "/dashboard"]}, 
      {name: "user", navigations: ["/dashboard"]}
    ]
});
`;