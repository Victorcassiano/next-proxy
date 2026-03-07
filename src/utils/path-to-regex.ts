export function pathToRegex(path: string): string {
  let pattern = path;

  pattern = pattern.replace(/\[\.\.\..+?\]/g, ".*");

  pattern = pattern.replace(/\[.+?\]/g, "[^/]+");

  pattern = pattern.replace(/\//g, "\\/");

  return `^${pattern}$`;
}
