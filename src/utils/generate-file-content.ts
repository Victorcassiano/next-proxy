import type { NextProxyConfig } from "../types/next-proxy-config.js";
import { normalizeRoutes } from "./normalize-routes.js";
import { generateRouteLogic } from "./generate-route-logic.js";

export function generateFileContent(config: NextProxyConfig, fileName: string): string {
  const routes = normalizeRoutes(config.routes, config.roles);
  const routeLogic = generateRouteLogic(
    routes,
    config.redirects,
    config.fallback
  );

  const functionName = fileName.startsWith("proxy") ? "proxy" : "middleware";

  return `
import "dotenv/config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validateAuthToken, type RouteMatcher } from "@victorcassiano/next-proxy";

export async function ${functionName}(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("${config.auth.cookie.name}")?.value;
  const result = await validateAuthToken(token, process.env.${config.auth.cookie.secret} || "");
  
  const isAuthenticated = result.authenticated;
  const userRole = result.authenticated ? (result.payload?.role || "user") : null;

  ${routeLogic}
}

export const config = {
  matcher: ["/((?!_next|fonts|examples|[\\\\w-]+\\\\.\\\\w+).*)"],
};
`;
}
