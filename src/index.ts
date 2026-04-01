import type { NextProxyConfig } from "./types/next-proxy-config.js";

export function defineNextProxyConfig(config: NextProxyConfig) {
  return config;
}

export * from "./types/next-proxy-config.js";
export * from "./types/route-rule.js";
export * from "./types/acess-type.js";