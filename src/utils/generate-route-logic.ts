import type { NextProxyConfig } from "../types/next-proxy-config.js";
import type { NormalizedRoute } from "./normalize-routes.js";

export function generateRouteLogic(
  routes: NormalizedRoute[],
  redirects: NextProxyConfig["redirects"],
  fallback?: string
): string {
  let code = `
  const routeMatchers: RouteMatcher[] = [
`;

  for (const route of routes) {
    code += `
    {
      regex: new RegExp(${JSON.stringify(route.regex)}),
      access: "${route.access}",
      roles: ${JSON.stringify(route.roles)}
    },
`;
  }

  code += `
  ];

  for (const route of routeMatchers) {
    if (route.regex.test(pathname)) {

      if (route.access === "publicOnly") {
        if (isAuthenticated) {
          return NextResponse.redirect(
            new URL("${redirects.authenticated}", request.url)
          );
        }
        return NextResponse.next();
      }

      if (route.access === "private") {
        if (!isAuthenticated) {
          return NextResponse.redirect(
            new URL("${redirects.unauthenticated}", request.url)
          );
        }

        if (route.roles.length > 0) {
          if (!route.roles.includes(userRole)) {
            return NextResponse.redirect(
              new URL("${redirects.unauthorized}", request.url)
            );
          }
        }
      }

      return NextResponse.next();
    }
  }
${fallback ? `
  return NextResponse.redirect(
    new URL("${fallback}", request.url)
  );
` : `
  return NextResponse.next();
`}
`;

  return code;
}
