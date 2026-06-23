import { describe, it, expect } from 'vitest'
import { detectShadowedRoutes } from '../../src/utils/detect-shadowed-routes.js'

describe('detectShadowedRoutes', () => {
  it('returns empty when no dynamic routes', () => {
    const routes = { '/': 'public', '/about': 'public' }
    expect(detectShadowedRoutes(routes)).toHaveLength(0)
  })

  it('detects [id] shadowing static route', () => {
    const routes = { '/users/admin': 'private', '/users/[id]': 'private' }
    const shadows = detectShadowedRoutes(routes)
    expect(shadows.length).toBeGreaterThan(0)
    expect(shadows[0]).toContain('/users/admin')
  })

  it('detects glob * shadowing static route', () => {
    const routes = { '/admin/settings': 'private', '/admin/*': 'private' }
    const shadows = detectShadowedRoutes(routes)
    expect(shadows.length).toBeGreaterThan(0)
    expect(shadows[0]).toContain('/admin/settings')
  })

  it('detects named param :id shadowing static route', () => {
    const routes = { '/users/admin': 'private', '/users/:id': 'private' }
    const shadows = detectShadowedRoutes(routes)
    expect(shadows.length).toBeGreaterThan(0)
    expect(shadows[0]).toContain('/users/admin')
  })

  it('returns empty when no shadowing occurs between dynamic routes', () => {
    const routes = { '/users/[id]': 'private', '/posts/[id]': 'private' }
    expect(detectShadowedRoutes(routes)).toHaveLength(0)
  })
})
