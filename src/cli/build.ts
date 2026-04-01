import { existsSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join, relative } from "path";
import { detectNextVersion } from "../utils/detect-next-version.js";
import { detectBasePath } from "../utils/detect-base-path.js";
import { generateFileContent } from "../utils/generate-file-content.js";
import type { NextProxyConfig } from "../types/next-proxy-config.js";

export async function build(options: { force?: boolean } = {}) {
  const root = process.cwd();
  const configPath = join(root, "proxy.config.ts");
  const { force = false } = options;

  try {
    if (!existsSync(configPath)) {
      throw new Error("proxy.config.ts not found.");
    }

    const { default: config } = await import(configPath);

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

    const nextVersion = detectNextVersion() || 15;
    const basePath = config.output?.basePath || detectBasePath();

    const fileName =
      nextVersion >= 16 ? "proxy.ts" : "middleware.ts";

    const absolutePath = join(root, basePath, fileName);

    if (existsSync(absolutePath) && !force) {
      console.log(`⚠️  ${fileName} already exists. Use --force to overwrite.`);
      return;
    }

    mkdirSync(dirname(absolutePath), { recursive: true });

    const content = generateFileContent(config as NextProxyConfig, fileName);

    writeFileSync(absolutePath, content);

    const relativePath =
      "/" + relative(root, absolutePath).replace(/\\/g, "/");

    console.log(`\n✅ ${fileName} successfully generated in:`);
    console.log(`📂 ${relativePath}`);
    console.log(`🧠 Next ${nextVersion} detected!`);
  } catch (error) {
    console.error(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
