import { writeFileSync, existsSync } from "fs";
import { join } from "path";
import { configTemplate } from "template/config";
import { detectBasePath } from "utils/detect-base-path";
import { detectNextVersion } from "utils/detect-next-version";

export async function init() {
  const version = detectNextVersion();

  if (!version) {
    console.log("Next.js not detected.");
    process.exit(1);
  }

  const basePath = detectBasePath();
  const root = process.cwd();

  const configPath = join(root, "proxy.config.ts");

  if (existsSync(configPath)) {
    console.log("⚠ proxy.config.ts already exists. Skipping.");
  } else {
    writeFileSync(configPath, configTemplate);
    console.log("✔ Created proxy.config.ts");
  }

  const fileName = version >= 16 ? "proxy.ts" : "middleware.ts";

  const targetPath =
    basePath === "."
      ? join(root, fileName)
      : join(root, basePath, fileName);

  if (existsSync(targetPath)) {
    console.log(`⚠ ${fileName} already exists. Skipping.`);
  } else {
    writeFileSync(targetPath, "");
    console.log(`✔ Created ${fileName}`);
  }


  console.log("✨ next-proxy initialized successfully");
}