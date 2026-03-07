import type { RoleConfig } from "../types/role-config.js";
import type { RouteRule } from "../types/route-rule.js";
import type { AccessType } from "../types/acess-type.js";
import { pathToRegex } from "./path-to-regex.js";

export interface NormalizedRoute {
  path: string;
  regex: string;
  access: AccessType;
  roles: string[];
}

export function normalizeRoutes(
  routes: Record<string, RouteRule>,
  globalRoles: RoleConfig[] = []
): NormalizedRoute[] {
  const normalized: Record<string, NormalizedRoute> = {};

  for (const [path, rule] of Object.entries(routes)) {
    const base = typeof rule === "string"
      ? { access: rule as AccessType, roles: [] as string[] }
      : { access: rule.access as AccessType, roles: rule.roles ?? [] };

    normalized[path] = {
      path,
      regex: pathToRegex(path),
      access: base.access,
      roles: base.roles,
    };
  }

  for (const roleDef of globalRoles) {
    for (const navPath of roleDef.navigations) {
      if (!normalized[navPath]) {
        normalized[navPath] = {
          path: navPath,
          regex: pathToRegex(navPath),
          access: "private",
          roles: [roleDef.name],
        };
      } else if (normalized[navPath].access === "private") {
        if (!normalized[navPath].roles.includes(roleDef.name)) {
          normalized[navPath].roles.push(roleDef.name);
        }
      }
    }
  }

  return Object.values(normalized);
}
