import type { RouteRule } from "./route-rule.js";

export type AuthConfig = {
  strategy: "cookie";
  key: string;
};

export type NextProxyConfig = {
  routes: Record<string, RouteRule>;
  redirects: {
    unauthenticated: string;
    authenticated: string;
  };
  auth: AuthConfig;
  output?: {
    basePath?: string;
  };
  fallback?: string;
};