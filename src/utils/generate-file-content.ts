import type { NextProxyConfig } from "../types/next-proxy-config.js";
import { normalizeRoutes } from "./normalize-routes.js";
import { generateRouteLogic } from "./generate-route-logic.js";

export function generateFileContent(config: NextProxyConfig, fileName: string): string {
  const routes = normalizeRoutes(config.routes);
  const routeLogic = generateRouteLogic(
    routes,
    config.redirects,
    config.fallback
  );

  const functionName = fileName.startsWith("proxy") ? "proxy" : "middleware";

  return `
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function ${functionName}(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthenticated = !!request.cookies.get("${config.auth.key}")?.value;

  ${routeLogic}
}

export const config = {
  matcher: ["/((?!_next|fonts|examples|[\\\\w-]+\\\\.\\\\w+).*)"],
};
`;
}