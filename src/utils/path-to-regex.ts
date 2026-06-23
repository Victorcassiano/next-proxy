export function pathToRegex(path: string): string {
  let pattern = path;

  pattern = pattern.replace(/\*\*/g, "\x00STARS\x00");
  pattern = pattern.replace(/\*/g, "\x00STAR\x00");

  pattern = pattern.replace(/\[\[\.\.\..+?\]\]/g, "(?:/.*)?");
  pattern = pattern.replace(/\[\.\.\..+?\]/g, ".*");
  pattern = pattern.replace(/\[.+?\]/g, "[^/]+");
  pattern = pattern.replace(/:(\w+)/g, "[^/]+");

  pattern = pattern.replace(/\x00STARS\x00/g, ".*");
  pattern = pattern.replace(/\x00STAR\x00/g, "[^/]+");

  pattern = pattern.replace(/\//g, "\\/");

  return `^${pattern}$`;
}
