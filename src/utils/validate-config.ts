import { existsSync } from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";
import { detectShadowedRoutes } from "./detect-shadowed-routes.js";

export interface ValidationError {
  field: string;
  message: string;
}

export async function loadConfig(root?: string): Promise<{ config: Record<string, unknown>; configPath: string }> {
  const cwd = root ?? process.cwd();
  const configPath = resolve(cwd, "proxy.config.ts");

  if (!existsSync(configPath)) {
    throw new Error("proxy.config.ts not found. Run 'npx next-proxy init' first.");
  }

  const configUrl = pathToFileURL(configPath).href;
  const { default: config } = await import(configUrl);

  return { config, configPath };
}

export function validateConfig(config: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!config.routes || typeof config.routes !== "object") {
    errors.push({ field: "routes", message: "Missing 'routes' property. It must be an object mapping paths to access types." });
  } else {
    const routes = config.routes as Record<string, unknown>;
    for (const [path, access] of Object.entries(routes)) {
      if (!path.startsWith("/")) {
        errors.push({ field: `routes["${path}"]`, message: `Route path "${path}" must start with "/".` });
      }
      if (!["public", "private", "public-only"].includes(access as string)) {
        errors.push({ field: `routes["${path}"]`, message: `Route "${path}" has invalid access type "${String(access)}". Must be "public", "private", or "public-only".` });
      }
    }

    const shadowed = detectShadowedRoutes(routes as Record<string, string>);
    for (const s of shadowed) {
      errors.push({ field: "routes", message: s });
    }
  }

  if (!config.auth || typeof config.auth !== "object") {
    errors.push({ field: "auth", message: "Missing 'auth' property. It must define the authentication strategy." });
  } else {
    const auth = config.auth as Record<string, unknown>;
    if (!["cookie", "header", "jwt"].includes(auth.strategy as string)) {
      errors.push({ field: "auth.strategy", message: `Invalid strategy "${String(auth.strategy)}". Must be "cookie", "header", or "jwt".` });
    }
    if (!auth.key || typeof auth.key !== "string" || auth.key.trim() === "") {
      errors.push({ field: "auth.key", message: "Missing or empty 'auth.key'. It must be a non-empty string (cookie name, header name, etc.)." });
    }
  }

  if (!config.redirects || typeof config.redirects !== "object") {
    errors.push({ field: "redirects", message: "Missing 'redirects' property. It must define 'unauthenticated' and 'authenticated' redirect paths." });
  } else {
    const redirects = config.redirects as Record<string, unknown>;
    if (!redirects.unauthenticated || typeof redirects.unauthenticated !== "string") {
      errors.push({ field: "redirects.unauthenticated", message: "Missing or invalid 'redirects.unauthenticated'. Must be a redirect path string." });
    }
    if (!redirects.authenticated || typeof redirects.authenticated !== "string") {
      errors.push({ field: "redirects.authenticated", message: "Missing or invalid 'redirects.authenticated'. Must be a redirect path string." });
    }
  }

  return errors;
}
