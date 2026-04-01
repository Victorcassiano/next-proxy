import { describe, it, expect } from 'vitest'
import { generateFileContent } from '../../src/utils/generate-file-content.js'

describe('generateFileContent', () => {
  it('should generate valid proxy file content', () => {
    const config = {
      auth: { strategy: 'cookie' as const, key: 'auth_token' },
      routes: { '/': 'public' as const, '/dashboard': 'private' as const },
      redirects: { unauthenticated: '/login' },
      fallback: '/',
    }
    const result = generateFileContent(config, 'proxy.ts')

    expect(result).toContain('import type { NextRequest }')
    expect(result).toContain('import { NextResponse }')
    expect(result).toContain('export async function proxy')
  })

  it('should generate middleware file content for Next.js 15', () => {
    const config = {
      auth: { strategy: 'cookie' as const, key: 'auth_token' },
      routes: { '/': 'public' as const },
      redirects: { unauthenticated: '/login' },
      fallback: '/',
    }
    const result = generateFileContent(config, 'middleware.ts')

    expect(result).toContain('export async function middleware')
  })

  it('should include cookie key in generated code', () => {
    const config = {
      auth: { strategy: 'cookie' as const, key: 'my_custom_token' },
      routes: { '/': 'public' as const },
      redirects: { unauthenticated: '/login' },
      fallback: '/',
    }
    const result = generateFileContent(config, 'proxy.ts')

    expect(result).toContain('request.cookies.get("my_custom_token")')
  })

  it('should include matcher config in generated code', () => {
    const config = {
      auth: { strategy: 'cookie' as const, key: 'auth_token' },
      routes: { '/': 'public' as const },
      redirects: { unauthenticated: '/login' },
      fallback: '/',
    }
    const result = generateFileContent(config, 'proxy.ts')

    expect(result).toContain('export const config = {')
    expect(result).toContain('matcher:')
  })

  it('should include route matchers in generated code', () => {
    const config = {
      auth: { strategy: 'cookie' as const, key: 'auth_token' },
      routes: {
        '/': 'public' as const,
        '/dashboard': 'private' as const,
      },
      redirects: { unauthenticated: '/login' },
      fallback: '/',
    }
    const result = generateFileContent(config, 'proxy.ts')

    expect(result).toContain('routeMatchers')
    expect(result).toContain('access: "public"')
    expect(result).toContain('access: "private"')
  })

  it('should include isAuthenticated check', () => {
    const config = {
      auth: { strategy: 'cookie' as const, key: 'auth_token' },
      routes: { '/dashboard': 'private' as const },
      redirects: { unauthenticated: '/login' },
      fallback: '/',
    }
    const result = generateFileContent(config, 'proxy.ts')

    expect(result).toContain('isAuthenticated')
    expect(result).toContain('request.cookies.get')
  })
})