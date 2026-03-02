import type { AccessType } from "./acess-type";

export type RouteRule =
  | AccessType
  | {
      access: AccessType;
      roles?: string[];
    };