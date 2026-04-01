import { describe, it, expect } from 'vitest'
import { normalizeRoutes } from '../../src/utils/normalize-routes.js'

describe('normalizeRoutes', () => {
  it('should normalize a single public route', () => {
    const routes = { '/': 'public' as const }
    const result = normalizeRoutes(routes)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      path: '/',
      regex: '^\\/$',
      access: 'public',
    })
  })

  it('should normalize multiple routes', () => {
    const routes = {
      '/': 'public' as const,
      '/dashboard': 'private' as const,
      '/login': 'public' as const,
    }
    const result = normalizeRoutes(routes)

    expect(result).toHaveLength(3)
    expect(result.map(r => r.path)).toContain('/')
    expect(result.map(r => r.path)).toContain('/dashboard')
    expect(result.map(r => r.path)).toContain('/login')
  })

  it('should generate correct regex for each route', () => {
    const routes = {
      '/users/[id]': 'private' as const,
      '/docs/[...slug]': 'public' as const,
    }
    const result = normalizeRoutes(routes)

    const usersRoute = result.find(r => r.path === '/users/[id]')
    const docsRoute = result.find(r => r.path === '/docs/[...slug]')

    expect(usersRoute?.regex).toBe('^\\/users\\/[^\\/]+$')
    expect(docsRoute?.regex).toBe('^\\/docs\\/.*$')
  })

  it('should handle empty routes object', () => {
    const result = normalizeRoutes({})
    expect(result).toHaveLength(0)
  })

  it('should preserve access type for each route', () => {
    const routes = {
      '/public': 'public' as const,
      '/private': 'private' as const,
    }
    const result = normalizeRoutes(routes)

    const publicRoute = result.find(r => r.path === '/public')
    const privateRoute = result.find(r => r.path === '/private')

    expect(publicRoute?.access).toBe('public')
    expect(privateRoute?.access).toBe('private')
  })
})