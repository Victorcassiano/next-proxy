import type { RouteRule } from "./route-rule.js";

export type AuthStrategy = "cookie" | "header" | "jwt";

export type AuthConfig = {
  strategy: AuthStrategy;
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
    matcher?: string[];
  };
  fallback?: string;
};
