import { readFileSync } from "fs";
import { join } from "path";

export function detectNextVersion(): number | null {
  try {
    const pkgPath = join(process.cwd(), "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

    const version =
      pkg.dependencies?.next || pkg.devDependencies?.next;

    if (!version) return null;

    const clean = version.replace(/[^0-9.]/g, "");
    return parseInt(clean.split(".")[0], 10);
  } catch {
    return null;
  }
}