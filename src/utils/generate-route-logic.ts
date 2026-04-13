import type { NextProxyConfig } from "../types/next-proxy-config.js";
import type { NormalizedRoute } from "./normalize-routes.js";

export function generateRouteLogic(
  routes: NormalizedRoute[],
  redirects: NextProxyConfig["redirects"],
  fallback?: string
): string {
  let code = `const routeMatchers = [
`;

  for (const route of routes) {
    code += `{
      regex: new RegExp(${JSON.stringify(route.regex)}),
      access: "${route.access}"
    },
`;
  }

  code += `
  ];

  for (const route of routeMatchers) {
    if (route.regex.test(pathname)) {
      if (route.access === "public-only" && isAuthenticated) {
        return NextResponse.redirect(
          new URL("${redirects.authenticated}", request.url)
        );
      }
      if (route.access === "private" && !isAuthenticated) {
        return NextResponse.redirect(
          new URL("${redirects.unauthenticated}", request.url)
        );
      }
      return NextResponse.next();
    }
  }
`;

  if (fallback) {
    code += `
  return NextResponse.redirect(
    new URL("${fallback}", request.url)
  );
`;
  } else {
    code += `return NextResponse.next();`;
  }

  return code;
}