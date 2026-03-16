import type { AccessType } from "./acess-type.js";

export type RouteRule =
  | AccessType
  | {
      access: AccessType;
      roles?: string[];
    };