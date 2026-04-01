import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { join, resolve } from 'path'
import { mkdtemp, rm, writeFile, mkdir, readFile, symlink, copyFile } from 'fs/promises'
import { tmpdir } from 'os'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import { build } from '../../src/cli/build.js'
import { init } from '../../src/cli/init.js'

describe('CLI Integration Tests', () => {
  let tempDir: string
  let originalCwd: string

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'next-proxy-test-'))
    originalCwd = process.cwd()
    process.chdir(tempDir)
  })

  afterEach(async () => {
    process.chdir(originalCwd)
    await rm(tempDir, { recursive: true, force: true })
  })

  async function createMockProject(options: {
    nextVersion?: string
    hasSrc?: boolean
    configContent?: string
  } = {}) {
    const { nextVersion = '^15.0.0', hasSrc = false, configContent } = options

    const pkg: any = {
      name: 'test-project',
      version: '1.0.0',
      type: 'module',
      dependencies: {
        next: nextVersion,
      },
    }

    await writeFile(
      join(tempDir, 'package.json'),
      JSON.stringify(pkg, null, 2)
    )

    if (hasSrc) {
      await mkdir(join(tempDir, 'src'), { recursive: true })
    }

    if (configContent) {
      await writeFile(
        join(tempDir, 'proxy.config.ts'),
        configContent
      )
    }
  }

  describe('init command', () => {
    it('should create proxy.config.ts and proxy.ts for Next.js 16+', async () => {
      await createMockProject({ nextVersion: '^16.0.0' })

      await init()

      expect(existsSync(join(tempDir, 'proxy.config.ts'))).toBe(true)
      expect(existsSync(join(tempDir, 'proxy.ts'))).toBe(true)
    })

    it('should create proxy.config.ts and middleware.ts for Next.js 15', async () => {
      await createMockProject({ nextVersion: '^15.0.0' })

      await init()

      expect(existsSync(join(tempDir, 'proxy.config.ts'))).toBe(true)
      expect(existsSync(join(tempDir, 'middleware.ts'))).toBe(true)
    })

    it('should create files in src/ directory when it exists', async () => {
      await createMockProject({ nextVersion: '^16.0.0', hasSrc: true })

      await init()

      expect(existsSync(join(tempDir, 'src', 'proxy.ts'))).toBe(true)
    })

    it('should skip creation if files already exist', async () => {
      await createMockProject({ nextVersion: '^16.0.0' })

      await writeFile(join(tempDir, 'proxy.config.ts'), 'existing')
      await writeFile(join(tempDir, 'proxy.ts'), 'existing')

      await init()

      const content = await readFile(join(tempDir, 'proxy.config.ts'), 'utf-8')
      expect(content).toBe('existing')
    })
  })

  describe('build command', () => {
    const validConfig = `
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
  },
  fallback: "/",
};
`

    it('should generate proxy.ts for Next.js 16+', async () => {
      await createMockProject({
        nextVersion: '^16.0.0',
        configContent: validConfig,
      })

      await build({ force: true })

      expect(existsSync(join(tempDir, 'proxy.ts'))).toBe(true)

      const content = await readFile(join(tempDir, 'proxy.ts'), 'utf-8')
      expect(content).toContain('export async function proxy')
      expect(content).toContain('request.cookies.get("auth_token")')
      expect(content).toContain('routeMatchers')
    })

    it('should generate middleware.ts for Next.js 15', async () => {
      await createMockProject({
        nextVersion: '^15.0.0',
        configContent: validConfig,
      })

      await build({ force: true })

      expect(existsSync(join(tempDir, 'middleware.ts'))).toBe(true)

      const content = await readFile(join(tempDir, 'middleware.ts'), 'utf-8')
      expect(content).toContain('export async function middleware')
    })

    it('should fail silently if proxy.config.ts is missing', async () => {
      await createMockProject({ nextVersion: '^16.0.0' })

      await build()

      expect(existsSync(join(tempDir, 'proxy.ts'))).toBe(false)
    })

    it('should fail with invalid config (missing auth)', async () => {
      const invalidConfig = `
export default {
  routes: { "/": "public" },
  redirects: { unauthenticated: "/login" },
};
`
      await createMockProject({
        nextVersion: '^16.0.0',
        configContent: invalidConfig,
      })

      await build()

      expect(existsSync(join(tempDir, 'proxy.ts'))).toBe(false)
    })

    it('should fail with invalid config (missing routes)', async () => {
      const invalidConfig = `
export default {
  auth: { strategy: "cookie", key: "token" },
  redirects: { unauthenticated: "/login" },
};
`
      await createMockProject({
        nextVersion: '^16.0.0',
        configContent: invalidConfig,
      })

      await build()

      expect(existsSync(join(tempDir, 'proxy.ts'))).toBe(false)
    })

    it('should fail with invalid config (missing redirects)', async () => {
      const invalidConfig = `
export default {
  auth: { strategy: "cookie", key: "token" },
  routes: { "/": "public" },
};
`
      await createMockProject({
        nextVersion: '^16.0.0',
        configContent: invalidConfig,
      })

      await build()

      expect(existsSync(join(tempDir, 'proxy.ts'))).toBe(false)
    })

    it('should skip build if file already exists without --force', async () => {
      await createMockProject({
        nextVersion: '^16.0.0',
        configContent: validConfig,
      })

      await writeFile(join(tempDir, 'proxy.ts'), 'existing content')

      await build()

      const content = await readFile(join(tempDir, 'proxy.ts'), 'utf-8')
      expect(content).toBe('existing content')
    })

    it('should overwrite file with --force flag', async () => {
      await createMockProject({
        nextVersion: '^16.0.0',
        configContent: validConfig,
      })

      await writeFile(join(tempDir, 'proxy.ts'), 'existing content')

      await build({ force: true })

      const content = await readFile(join(tempDir, 'proxy.ts'), 'utf-8')
      expect(content).not.toBe('existing content')
      expect(content).toContain('export async function proxy')
    })

    it('should generate correct matcher config', async () => {
      await createMockProject({
        nextVersion: '^16.0.0',
        configContent: validConfig,
      })

      await build({ force: true })

      const content = await readFile(join(tempDir, 'proxy.ts'), 'utf-8')
      expect(content).toContain('export const config = {')
      expect(content).toContain('matcher:')
    })

    it('should generate correct redirect URL', async () => {
      await createMockProject({
        nextVersion: '^16.0.0',
        configContent: validConfig,
      })

      await build({ force: true })

      const content = await readFile(join(tempDir, 'proxy.ts'), 'utf-8')
      expect(content).toContain('/login')
      expect(content).toContain('NextResponse.redirect')
    })
  })
})
