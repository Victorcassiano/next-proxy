import { existsSync } from "fs";
import { join } from "path";

export function detectBasePath(): string {
  const root = process.cwd();

  const hasRootRouter =
    existsSync(join(root, "app")) ||
    existsSync(join(root, "pages"));

  if (hasRootRouter) {
    return ".";
  }

  const hasSrcRouter =
    existsSync(join(root, "src", "app")) ||
    existsSync(join(root, "src", "pages"));

  if (hasSrcRouter) {
    return "src";
  }

  return ".";
}
