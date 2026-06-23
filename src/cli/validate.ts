import { loadConfig, validateConfig } from "../utils/validate-config.js";

export async function validate() {
  try {
    const { config } = await loadConfig();
    const errors = validateConfig(config);

    if (errors.length > 0) {
      for (const err of errors) {
        console.error(`  • ${err.field}: ${err.message}`);
      }
      throw new Error(`Validation failed with ${errors.length} error(s).`);
    }

    const routeCount = Object.keys(config.routes as Record<string, unknown>).length;
    console.log(`✅ proxy.config.ts is valid (${routeCount} routes configured)`);
  } catch (error) {
    console.error(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    process.exit(1);
  }
}
