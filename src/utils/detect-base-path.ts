import { existsSync } from "fs";
import { join } from "path";

export function detectBasePath(): string {
  const srcPath = join(process.cwd(), "src");

  if (existsSync(srcPath)) {
    return "src";
  }

  return ".";
}