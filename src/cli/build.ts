import { existsSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join, relative, resolve } from "path";
import { detectNextVersion } from "../utils/detect-next-version.js";
import { detectBasePath } from "../utils/detect-base-path.js";
import { generateFileContent } from "../utils/generate-file-content.js";
import { loadConfig, validateConfig } from "../utils/validate-config.js";
import type { NextProxyConfig } from "../types/next-proxy-config.js";

export async function build(options: { force?: boolean } = {}) {
  const root = process.cwd();
  const { force = false } = options;

  try {
    const { config } = await loadConfig();
    const errors = validateConfig(config);

    if (errors.length > 0) {
      for (const err of errors) {
        console.error(`  • ${err.field}: ${err.message}`);
      }
      throw new Error(`Validation failed with ${errors.length} error(s).`);
    }

    const nextVersion = detectNextVersion() || 15;
    const basePath = (config.output as Record<string, unknown>)?.basePath as string | undefined || detectBasePath();

    const fileName =
      nextVersion >= 16 ? "proxy.ts" : "middleware.ts";

    const absolutePath = join(root, basePath, fileName);

    if (existsSync(absolutePath) && !force) {
      console.log(`⚠️  ${fileName} already exists. Use --force to overwrite.`);
      return;
    }

    mkdirSync(dirname(absolutePath), { recursive: true });

    const content = generateFileContent(config as unknown as NextProxyConfig, fileName);

    writeFileSync(absolutePath, content);

    const relativePath =
      "/" + relative(root, absolutePath).replace(/\\/g, "/");

    console.log(`\n✅ ${fileName} successfully generated in:`);
    console.log(`📂 ${relativePath}`);
    console.log(`🧠 Next ${nextVersion} detected!`);
  } catch (error) {
    console.error(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    process.exit(1);
  }
}
