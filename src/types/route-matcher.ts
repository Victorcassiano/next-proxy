import type { AccessType } from "./acess-type.js";

export interface RouteMatcher {
  regex: RegExp;
  access: AccessType;
  roles: string[];
}
