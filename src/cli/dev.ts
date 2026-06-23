import { watch, existsSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname, join, relative } from "path";
import { pathToFileURL } from "url";
import { detectNextVersion } from "../utils/detect-next-version.js";
import { detectBasePath } from "../utils/detect-base-path.js";
import { generateFileContent } from "../utils/generate-file-content.js";
import { validateConfig } from "../utils/validate-config.js";
import type { NextProxyConfig } from "../types/next-proxy-config.js";

async function loadConfigWithCacheBust(root: string): Promise<NextProxyConfig> {
  const configPath = resolve(root, "proxy.config.ts");
  const configUrl = pathToFileURL(configPath).href + "?t=" + Date.now();
  const { default: config } = await import(configUrl);
  return config as NextProxyConfig;
}

async function runBuild(root: string) {
  try {
    const config = await loadConfigWithCacheBust(root);
    const errors = validateConfig(config as unknown as Record<string, unknown>);

    if (errors.length > 0) {
      for (const err of errors) {
        console.error(`  • ${err.field}: ${err.message}`);
      }
      console.error(`❌ Build failed (${errors.length} error(s)). Fix proxy.config.ts to retry.`);
      return;
    }

    const nextVersion = detectNextVersion() || 15;
    const basePath = config.output?.basePath || detectBasePath();

    const fileName = nextVersion >= 16 ? "proxy.ts" : "middleware.ts";
    const absolutePath = join(root, basePath, fileName);

    mkdirSync(dirname(absolutePath), { recursive: true });

    const content = generateFileContent(config, fileName);
    writeFileSync(absolutePath, content);

    const relativePath = "/" + relative(root, absolutePath).replace(/\\/g, "/");

    console.log(`✅ ${fileName} regenerated in ${relativePath}`);
  } catch (error) {
    console.error(`❌ Build error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function dev() {
  const root = process.cwd();
  const configPath = resolve(root, "proxy.config.ts");

  if (!existsSync(configPath)) {
    console.error("❌ proxy.config.ts not found. Run 'npx next-proxy init' first.");
    process.exit(1);
  }

  console.log("🔍 Initial build...");
  await runBuild(root);

  console.log("👀 Watching proxy.config.ts for changes...");

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  watch(configPath, (eventType) => {
    if (eventType === "change") {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        console.log("🔄 Change detected, rebuilding...");
        await runBuild(root);
      }, 300);
    }
  });
}
