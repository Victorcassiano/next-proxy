import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { join } from 'path'
import { tmpdir } from 'os'
import { rmSync, readFile, existsSync, writeFileSync, mkdtempSync, mkdirSync, readFileSync } from 'fs'
import { execa } from 'execa'
import { init } from '../../src/cli/init.js'
import { build } from '../../src/cli/build.js'

function scaffoldMinimalProject(dir: string, nextVersion: string) {
  const pkg = {
    name: 'e2e-test-project',
    version: '1.0.0',
    type: 'module',
    dependencies: {
      next: nextVersion,
      react: '^19.0.0',
      'react-dom': '^19.0.0',
    },
    devDependencies: {
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      typescript: '^5.0.0',
    },
  }
  writeFileSync(join(dir, 'package.json'), JSON.stringify(pkg, null, 2))

  const tsconfig = {
    compilerOptions: {
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: { '@/*': ['./src/*'] },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
    exclude: ['node_modules'],
  }
  writeFileSync(join(dir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2))

  mkdirSync(join(dir, 'app'), { recursive: true })

  const layout = `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`
  writeFileSync(join(dir, 'app', 'layout.tsx'), layout)

  const page = `export default function Page() {
  return <h1>Hello</h1>;
}`
  writeFileSync(join(dir, 'app', 'page.tsx'), page)
}

async function runTsc(dir: string) {
  const result = await execa('bunx', ['tsc', '--noEmit'], {
    cwd: dir,
    reject: false,
  })
  if (result.exitCode !== 0 && result.exitCode !== undefined) {
    console.log('tsc stdout:', result.stdout)
    console.log('tsc stderr:', result.stderr)
  }
  return result
}

describe('E2E — Real Next.js Project', () => {
  let tempDir: string
  let originalCwd: string

  beforeEach(async () => {
    tempDir = mkdtempSync(join(tmpdir(), 'next-proxy-e2e-'))
    originalCwd = process.cwd()
    process.chdir(tempDir)
  })

  afterEach(async () => {
    process.chdir(originalCwd)
    rmSync(tempDir, { recursive: true, force: true })
  })

  const baseConfig = `
export default {
  auth: {
    strategy: "cookie",
    key: "auth_token",
  },
  routes: {
    "/": "public",
    "/dashboard": "private",
    "/login": "public",
  },
  redirects: {
    unauthenticated: "/login",
    authenticated: "/dashboard",
  },
  fallback: "/",
};
`

  it('should generate compilable middleware.ts for Next.js 14', async () => {
    scaffoldMinimalProject(tempDir, '^14.0.0')
    writeFileSync(join(tempDir, 'proxy.config.ts'), baseConfig)

    await execa('bun', ['install'], { cwd: tempDir })
    await init()
    await build({ force: true })

    expect(existsSync(join(tempDir, 'middleware.ts'))).toBe(true)

    const result = await runTsc(tempDir)
    expect(result.failed).toBe(false)
  }, 120000)

  it('should generate compilable middleware.ts for Next.js 15', async () => {
    scaffoldMinimalProject(tempDir, '^15.0.0')
    writeFileSync(join(tempDir, 'proxy.config.ts'), baseConfig)

    await execa('bun', ['install'], { cwd: tempDir })
    await init()
    await build({ force: true })

    expect(existsSync(join(tempDir, 'middleware.ts'))).toBe(true)

    const result = await runTsc(tempDir)
    expect(result.failed).toBe(false)
  }, 120000)

  it('should generate compilable proxy.ts for Next.js 16+', async () => {
    scaffoldMinimalProject(tempDir, '^16.0.0')
    writeFileSync(join(tempDir, 'proxy.config.ts'), baseConfig)

    await execa('bun', ['install'], { cwd: tempDir })
    await init()
    await build({ force: true })

    expect(existsSync(join(tempDir, 'proxy.ts'))).toBe(true)

    const result = await runTsc(tempDir)
    expect(result.failed).toBe(false)
  }, 120000)

  it('should generate proxy.ts inside src/ when src/app/ exists', async () => {
    scaffoldMinimalProject(tempDir, '^16.0.0')
    mkdirSync(join(tempDir, 'src', 'app'), { recursive: true })
    rmSync(join(tempDir, 'app'), { recursive: true, force: true })

    const layout = `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}`
    writeFileSync(join(tempDir, 'src', 'app', 'layout.tsx'), layout)
    const page = `export default function Page() { return <h1>Hi</h1>; }`
    writeFileSync(join(tempDir, 'src', 'app', 'page.tsx'), page)
    writeFileSync(join(tempDir, 'proxy.config.ts'), baseConfig)

    await execa('bun', ['install'], { cwd: tempDir })
    await init()
    await build({ force: true })

    expect(existsSync(join(tempDir, 'src', 'proxy.ts'))).toBe(true)
    expect(existsSync(join(tempDir, 'proxy.ts'))).toBe(false)

    const result = await runTsc(tempDir)
    expect(result.failed).toBe(false)
  }, 120000)

  it('should handle dynamic route segments correctly', async () => {
    scaffoldMinimalProject(tempDir, '^16.0.0')

    const configWithDynamicRoutes = `
export default {
  auth: { strategy: "cookie", key: "auth_token" },
  routes: {
    "/": "public",
    "/users/[id]": "private",
    "/docs/[...slug]": "public",
    "/login": "public",
  },
  redirects: {
    unauthenticated: "/login",
    authenticated: "/dashboard",
  },
};
`
    writeFileSync(join(tempDir, 'proxy.config.ts'), configWithDynamicRoutes)

    await execa('bun', ['install'], { cwd: tempDir })
    await init()
    await build({ force: true })

    const content = readFileSync(join(tempDir, 'proxy.ts'), 'utf-8')
    expect(content).toContain('routeMatchers')

    const result = await runTsc(tempDir)
    expect(result.failed).toBe(false)
  }, 120000)

  it('should handle all 3 access types (public, private, public-only)', async () => {
    scaffoldMinimalProject(tempDir, '^16.0.0')

    const configAllTypes = `
export default {
  auth: { strategy: "cookie", key: "session_id" },
  routes: {
    "/": "public",
    "/dashboard": "private",
    "/login": "public-only",
    "/register": "public-only",
    "/admin": "private",
  },
  redirects: {
    unauthenticated: "/login",
    authenticated: "/dashboard",
  },
  fallback: "/",
};
`
    writeFileSync(join(tempDir, 'proxy.config.ts'), configAllTypes)

    await execa('bun', ['install'], { cwd: tempDir })
    await init()
    await build({ force: true })

    const content = readFileSync(join(tempDir, 'proxy.ts'), 'utf-8')
    expect(content).toContain('access: "public"')
    expect(content).toContain('access: "private"')
    expect(content).toContain('access: "public-only"')
    expect(content).toContain('session_id')

    const result = await runTsc(tempDir)
    expect(result.failed).toBe(false)
  }, 120000)

  it('should redirect authenticated users from public-only routes', async () => {
    scaffoldMinimalProject(tempDir, '^16.0.0')

    const configPublicOnly = `
export default {
  auth: { strategy: "cookie", key: "auth_token" },
  routes: {
    "/login": "public-only",
    "/register": "public-only",
    "/": "public",
    "/dashboard": "private",
  },
  redirects: {
    unauthenticated: "/login",
    authenticated: "/dashboard",
  },
};
`
    writeFileSync(join(tempDir, 'proxy.config.ts'), configPublicOnly)

    await execa('bun', ['install'], { cwd: tempDir })
    await build({ force: true })

    const content = readFileSync(join(tempDir, 'proxy.ts'), 'utf-8')
    expect(content).toContain('/dashboard')
    expect(content).toContain('route.access === "public-only"')
    expect(content).toContain('isAuthenticated')

    const result = await runTsc(tempDir)
    expect(result.failed).toBe(false)
  }, 120000)

  it('should use custom cookie key in generated code', async () => {
    scaffoldMinimalProject(tempDir, '^16.0.0')

    const configCustomCookie = `
export default {
  auth: { strategy: "cookie", key: "my_custom_session_token_v2" },
  routes: {
    "/": "public",
    "/dashboard": "private",
  },
  redirects: {
    unauthenticated: "/login",
    authenticated: "/dashboard",
  },
};
`
    writeFileSync(join(tempDir, 'proxy.config.ts'), configCustomCookie)

    await execa('bun', ['install'], { cwd: tempDir })
    await build({ force: true })

    const content = readFileSync(join(tempDir, 'proxy.ts'), 'utf-8')
    expect(content).toContain('my_custom_session_token_v2')
    expect(content).toContain('request.cookies.get("my_custom_session_token_v2")')

    const result = await runTsc(tempDir)
    expect(result.failed).toBe(false)
  }, 120000)

  it('should handle fallback redirect for unmatched routes', async () => {
    scaffoldMinimalProject(tempDir, '^16.0.0')

    const configWithFallback = `
export default {
  auth: { strategy: "cookie", key: "auth_token" },
  routes: {
    "/": "public",
    "/dashboard": "private",
  },
  redirects: {
    unauthenticated: "/login",
    authenticated: "/dashboard",
  },
  fallback: "/login",
};
`
    writeFileSync(join(tempDir, 'proxy.config.ts'), configWithFallback)

    await execa('bun', ['install'], { cwd: tempDir })
    await build({ force: true })

    const content = readFileSync(join(tempDir, 'proxy.ts'), 'utf-8')
    expect(content).toContain('/login')
    expect(content).toContain('NextResponse.redirect')

    const result = await runTsc(tempDir)
    expect(result.failed).toBe(false)
  }, 120000)

  it('should generate compilable proxy.ts with header strategy', async () => {
    scaffoldMinimalProject(tempDir, '^16.0.0')

    const configHeader = `
export default {
  auth: { strategy: "header", key: "x-user-token" },
  routes: {
    "/": "public",
    "/dashboard": "private",
  },
  redirects: {
    unauthenticated: "/login",
    authenticated: "/dashboard",
  },
};
`
    writeFileSync(join(tempDir, 'proxy.config.ts'), configHeader)

    await execa('bun', ['install'], { cwd: tempDir })
    await build({ force: true })

    const content = readFileSync(join(tempDir, 'proxy.ts'), 'utf-8')
    expect(content).toContain('request.headers.get("x-user-token")')

    const result = await runTsc(tempDir)
    expect(result.failed).toBe(false)
  }, 120000)

  it('should generate compilable proxy.ts with jwt strategy', async () => {
    scaffoldMinimalProject(tempDir, '^16.0.0')

    const configJwt = `
export default {
  auth: { strategy: "jwt", key: "unused" },
  routes: {
    "/": "public",
    "/dashboard": "private",
  },
  redirects: {
    unauthenticated: "/login",
    authenticated: "/dashboard",
  },
};
`
    writeFileSync(join(tempDir, 'proxy.config.ts'), configJwt)

    await execa('bun', ['install'], { cwd: tempDir })
    await build({ force: true })

    const content = readFileSync(join(tempDir, 'proxy.ts'), 'utf-8')
    expect(content).toContain('request.headers.get("Authorization")')
    expect(content).toContain('startsWith("Bearer ")')

    const result = await runTsc(tempDir)
    expect(result.failed).toBe(false)
  }, 120000)

  it('should generate compilable proxy.ts with glob patterns', async () => {
    scaffoldMinimalProject(tempDir, '^16.0.0')

    const configGlob = `
export default {
  auth: { strategy: "cookie", key: "auth_token" },
  routes: {
    "/": "public",
    "/admin/*": "private",
    "/docs/**": "public",
    "/users/:id": "private",
  },
  redirects: {
    unauthenticated: "/login",
    authenticated: "/dashboard",
  },
};
`
    writeFileSync(join(tempDir, 'proxy.config.ts'), configGlob)

    await execa('bun', ['install'], { cwd: tempDir })
    await build({ force: true })

    const content = readFileSync(join(tempDir, 'proxy.ts'), 'utf-8')
    expect(content).toContain('routeMatchers')
    expect(content).toContain('admin')
    expect(content).toContain('docs')
    expect(content).toContain('users')

    const result = await runTsc(tempDir)
    expect(result.failed).toBe(false)
  }, 120000)

  it('should handle mixed Next.js params and glob patterns', async () => {
    scaffoldMinimalProject(tempDir, '^16.0.0')

    const configMixed = `
export default {
  auth: { strategy: "cookie", key: "auth_token" },
  routes: {
    "/api/:version/users/[id]": "private",
    "/": "public",
  },
  redirects: {
    unauthenticated: "/login",
    authenticated: "/dashboard",
  },
};
`
    writeFileSync(join(tempDir, 'proxy.config.ts'), configMixed)

    await execa('bun', ['install'], { cwd: tempDir })
    await build({ force: true })

    const result = await runTsc(tempDir)
    expect(result.failed).toBe(false)
  }, 120000)
})
