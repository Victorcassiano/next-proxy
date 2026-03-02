import { existsSync, writeFileSync, readFileSync, mkdirSync } from "fs";
import { dirname, join, relative } from "path";
import { detectNextVersion } from "utils/detect-next-version";
import { detectBasePath } from "utils/detect-base-path";
import type { RouteRule } from "../types/route-rule.js";
import type { RoleConfig } from "../types/role-config.js";
import type { AccessType } from "../types/acess-type.js";
import type { NextProxyConfig } from "../types/next-proxy-config.js";


/* ======================================================
   🔄 Converter rota App Router → Regex
====================================================== */
function pathToRegex(path: string): string {
  let pattern = path;

  // Catch-all [...slug]
  pattern = pattern.replace(/\[\.\.\..+?\]/g, ".*");

  // Segmentos dinâmicos [id]
  pattern = pattern.replace(/\[.+?\]/g, "[^/]+");

  // Escapar barras
  pattern = pattern.replace(/\//g, "\\/");

  return `^${pattern}$`;
}

/* ======================================================
   📑 Normalizar rotas
====================================================== */
function normalizeRoutes(routes: Record<string, RouteRule>, globalRoles: RoleConfig[] = []) {
  const normalized: Record<string, any> = {};

  // 1. Process explicit routes
  for (const [path, rule] of Object.entries(routes)) {
    const base = typeof rule === "string"
      ? { access: rule as AccessType, roles: [] }
      : { access: rule.access as AccessType, roles: rule.roles ?? [] };

    normalized[path] = {
      path,
      regex: pathToRegex(path),
      access: base.access,
      roles: base.roles,
    };
  }

  // 2. Process global roles (navigations define which paths are accessible by which roles)
  for (const roleDef of globalRoles) {
    for (const navPath of roleDef.navigations) {
      if (!normalized[navPath]) {
        // Paths defined in roles but not in routes default to private
        normalized[navPath] = {
          path: navPath,
          regex: pathToRegex(navPath),
          access: "private",
          roles: [roleDef.name],
        };
      } else if (normalized[navPath].access === "private") {
        // If it's already private, add this role to the list of allowed roles
        if (!normalized[navPath].roles.includes(roleDef.name)) {
          normalized[navPath].roles.push(roleDef.name);
        }
      }
    }
  }

  return Object.values(normalized);
}

/* ======================================================
   🧠 Gerar lógica de rotas
====================================================== */
function generateRouteLogic(
  routes: ReturnType<typeof normalizeRoutes>,
  redirects: NextProxyConfig["redirects"],
  fallback?: string
) {
  let code = `
  const routeMatchers: RouteMatcher[] = [
`;

  for (const route of routes) {
    code += `
    {
      regex: new RegExp(${JSON.stringify(route.regex)}),
      access: "${route.access}",
      roles: ${JSON.stringify(route.roles)}
    },
`;
  }

  code += `
  ];

  for (const route of routeMatchers) {
    if (route.regex.test(pathname)) {

      if (route.access === "publicOnly") {
        if (isAuthenticated) {
          return NextResponse.redirect(
            new URL("${redirects.authenticated}", request.url)
          );
        }
        return NextResponse.next();
      }

      if (route.access === "private") {
        if (!isAuthenticated) {
          return NextResponse.redirect(
            new URL("${redirects.unauthenticated}", request.url)
          );
        }

        if (route.roles.length > 0) {
          if (!route.roles.includes(userRole)) {
            return NextResponse.redirect(
              new URL("${redirects.unauthorized}", request.url)
            );
          }
        }
      }

      return NextResponse.next();
    }
  }
${fallback ? `
  return NextResponse.redirect(
    new URL("${fallback}", request.url)
  );
` : `
  return NextResponse.next();
`}
`;

  return code;
}

/* ======================================================
   📄 Gerar conteúdo final do arquivo
====================================================== */
function generateFileContent(config: NextProxyConfig, fileName: string) {
  const routes = normalizeRoutes(config.routes, config.roles);
  const routeLogic = generateRouteLogic(
    routes,
    config.redirects,
    config.fallback
  );

  const functionName = fileName.startsWith("proxy") ? "proxy" : "middleware";

  return `
import "dotenv/config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validateAuthToken, type RouteMatcher } from "next-proxy";

export async function ${functionName}(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("${config.auth.cookie.name}")?.value;
  const result = await validateAuthToken(token, process.env.${config.auth.cookie.secret} || "");
  
  const isAuthenticated = result.authenticated;
  const userRole = result.authenticated ? (result.payload?.role || "user") : null;

  ${routeLogic}
}

export const config = {
  matcher: ["/((?!_next|fonts|examples|[\\\\w-]+\\\\.\\\\w+).*)"],
};
`;
}

/* ======================================================
   🚀 BUILD
====================================================== */
export async function build() {
  const root = process.cwd();
  const configPath = join(root, "proxy.config.ts");

  try {
    // 1️⃣ Verifica antes de importar
    if (!existsSync(configPath)) {
      throw new Error("❌ proxy.config.ts not found.");
    }

    const { default: config } = await import(configPath);

    const nextVersion = detectNextVersion() || 15;
    const basePath = config.output?.basePath || detectBasePath();

    const fileName =
      nextVersion >= 16 ? "proxy.ts" : "middleware.ts";

    const absolutePath = join(root, basePath, fileName);

    // 2️⃣ Garante que a pasta exista
    mkdirSync(dirname(absolutePath), { recursive: true });

    const content = generateFileContent(config, fileName);

    writeFileSync(absolutePath, content);

    // 3️⃣ Caminho relativo limpo e padronizado
    const relativePath =
      "/" + relative(root, absolutePath).replace(/\\/g, "/");

    console.log(`\n✅ ${fileName} successfully generated in:`);
    console.log(`📂 ${relativePath}`);
    console.log(`🧠 Next ${nextVersion} detected!`);
  } catch (error) {
    const nextVersion = detectNextVersion() || 15;

    const fileName =
      nextVersion >= 16 ? "proxy.ts" : "middleware.ts";

    console.error(`❌ Error generating file: ${fileName}`);
    console.error("❌ proxy.config.ts not found");
    console.log("⚠️  Run: npx next-proxy init");
  }
}