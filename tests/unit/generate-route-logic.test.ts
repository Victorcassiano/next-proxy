import { describe, it, expect } from 'vitest'
import { generateRouteLogic } from '../../src/utils/generate-route-logic.js'

describe('generateRouteLogic', () => {
  it('should generate route logic with private route redirect', () => {
    const routes = [
      { path: '/dashboard', regex: '^\\/dashboard$', access: 'private' as const },
    ]
    const redirects = { unauthenticated: '/login' }
    const result = generateRouteLogic(routes, redirects)

    expect(result).toContain('route.access === "private"')
    expect(result).toContain('!isAuthenticated')
    expect(result).toContain('/login')
  })

  it('should generate route logic with public route', () => {
    const routes = [
      { path: '/', regex: '^\\/$', access: 'public' as const },
    ]
    const redirects = { unauthenticated: '/login' }
    const result = generateRouteLogic(routes, redirects)

    expect(result).toContain('access: "public"')
    expect(result).toContain('NextResponse.next()')
  })

  it('should include fallback redirect when specified', () => {
    const routes = [
      { path: '/', regex: '^\\/$', access: 'public' as const },
    ]
    const redirects = { unauthenticated: '/login' }
    const result = generateRouteLogic(routes, redirects, '/')

    expect(result).toContain('new URL("/", request.url)')
  })

  it('should include NextResponse.next() fallback when not specified', () => {
    const routes = [
      { path: '/', regex: '^\\/$', access: 'public' as const },
    ]
    const redirects = { unauthenticated: '/login' }
    const result = generateRouteLogic(routes, redirects)

    expect(result).toContain('NextResponse.next()')
  })

  it('should generate correct regex patterns in output', () => {
    const routes = [
      { path: '/dashboard', regex: '^\\/dashboard$', access: 'private' as const },
      { path: '/login', regex: '^\\/login$', access: 'public' as const },
    ]
    const redirects = { unauthenticated: '/login' }
    const result = generateRouteLogic(routes, redirects)

    expect(result).toContain('new RegExp("^\\\\/dashboard$")')
    expect(result).toContain('new RegExp("^\\\\/login$")')
  })

  it('should handle multiple private routes with same redirect', () => {
    const routes = [
      { path: '/dashboard', regex: '^\\/dashboard$', access: 'private' as const },
      { path: '/admin', regex: '^\\/admin$', access: 'private' as const },
    ]
    const redirects = { unauthenticated: '/login' }
    const result = generateRouteLogic(routes, redirects)

    expect(result).toContain('/login')
    expect(result).toContain('access: "private"')
  })
})