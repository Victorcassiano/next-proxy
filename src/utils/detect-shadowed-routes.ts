import { pathToRegex } from "./path-to-regex.js";

export function detectShadowedRoutes(
  routes: Record<string, string>
): string[] {
  const shadows: string[] = [];

  const dynamicRoutes = Object.entries(routes).filter(
    ([path]) => /\[/.test(path)
  );

  const staticRoutes = Object.entries(routes).filter(
    ([path]) => !/\[/.test(path)
  );

  for (const [staticPath] of staticRoutes) {
    for (const [dynamicPath] of dynamicRoutes) {
      const regex = new RegExp(pathToRegex(dynamicPath));
      if (regex.test(staticPath)) {
        shadows.push(
          `Route "${staticPath}" is shadowed by "${dynamicPath}". The dynamic route matches this path first, so "${staticPath}" will never be reached.`
        );
      }
    }
  }

  return shadows;
}
