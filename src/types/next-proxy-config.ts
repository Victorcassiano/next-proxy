import type { RoleConfig } from "./role-config";
import type { RouteRule } from "./route-rule";

export type NextProxyConfig = {
  routes: Record<string, RouteRule>;
  redirects: {
    unauthenticated: string;
    unauthorized: string;
    authenticated: string;
  };
  auth: {
    strategy: "cookie" | "jwt";
    cookie: {
      name: string;
      secret: string;
    };
  };
  roles?: RoleConfig[];
  output?: {
    basePath?: string;
  };
  fallback?: string;
};