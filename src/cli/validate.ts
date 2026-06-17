import { existsSync } from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";
import { detectShadowedRoutes } from "../utils/detect-shadowed-routes.js";

export async function validate() {
  const root = process.cwd();
  const configPath = resolve(root, "proxy.config.ts");

  try {
    if (!existsSync(configPath)) {
      throw new Error("proxy.config.ts not found. Run 'npx next-proxy init' first.");
    }

    const configUrl = pathToFileURL(configPath).href;
    const { default: config } = await import(configUrl);

    if (!config || !config.routes) {
      throw new Error("Invalid proxy.config.ts: missing 'routes' property.");
    }

    if (!config.auth) {
      throw new Error("Invalid proxy.config.ts: missing 'auth' property.");
    }

    if (!config.auth.key) {
      throw new Error("Invalid proxy.config.ts: missing 'auth.key' property.");
    }

    if (!config.redirects) {
      throw new Error("Invalid proxy.config.ts: missing 'redirects' property.");
    }

    if (!config.redirects.unauthenticated) {
      throw new Error("Invalid proxy.config.ts: missing 'redirects.unauthenticated' property.");
    }

    if (!config.redirects.authenticated) {
      throw new Error("Invalid proxy.config.ts: missing 'redirects.authenticated' property.");
    }

    const shadowed = detectShadowedRoutes(config.routes);
    if (shadowed.length > 0) {
      throw new Error(
        "Shadowed routes detected:\n  " + shadowed.join("\n  ")
      );
    }

    const routeCount = Object.keys(config.routes).length;
    console.log(`✅ proxy.config.ts is valid (${routeCount} routes configured)`);
  } catch (error) {
    console.error(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    process.exit(1);
  }
}
