import type { RouteRule } from "../types/route-rule.js";
import type { AccessType } from "../types/acess-type.js";
import { pathToRegex } from "./path-to-regex.js";

export interface NormalizedRoute {
  path: string;
  regex: string;
  access: AccessType;
}

export function normalizeRoutes(
  routes: Record<string, RouteRule>
): NormalizedRoute[] {
  const normalized: Record<string, NormalizedRoute> = {};

  for (const [path, rule] of Object.entries(routes)) {
    normalized[path] = {
      path,
      regex: pathToRegex(path),
      access: rule as AccessType,
    };
  }

  return Object.values(normalized);
}