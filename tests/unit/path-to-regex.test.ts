import { describe, it, expect } from 'vitest'
import { pathToRegex } from '../../src/utils/path-to-regex.js'

describe('pathToRegex', () => {
  it('should convert simple route to regex', () => {
    const result = pathToRegex('/dashboard')
    expect(result).toBe('^\\/dashboard$')
  })

  it('should convert root route to regex', () => {
    const result = pathToRegex('/')
    expect(result).toBe('^\\/$')
  })

  it('should convert dynamic route segment to regex', () => {
    const result = pathToRegex('/users/[id]')
    expect(result).toBe('^\\/users\\/[^\\/]+$')
  })

  it('should convert catch-all route to regex', () => {
    const result = pathToRegex('/docs/[...slug]')
    expect(result).toBe('^\\/docs\\/.*$')
  })

  it('should handle multiple dynamic segments', () => {
    const result = pathToRegex('/users/[userId]/posts/[postId]')
    expect(result).toBe('^\\/users\\/[^\\/]+\\/posts\\/[^\\/]+$')
  })

  it('should match root path correctly', () => {
    const regex = new RegExp(pathToRegex('/'))
    expect(regex.test('/')).toBe(true)
    expect(regex.test('/dashboard')).toBe(false)
  })

  it('should match dynamic segment correctly', () => {
    const regex = new RegExp(pathToRegex('/users/[id]'))
    expect(regex.test('/users/123')).toBe(true)
    expect(regex.test('/users/abc')).toBe(true)
    expect(regex.test('/users/123/posts')).toBe(false)
  })

  it('should match catch-all correctly', () => {
    const regex = new RegExp(pathToRegex('/docs/[...slug]'))
    expect(regex.test('/docs/a')).toBe(true)
    expect(regex.test('/docs/a/b/c')).toBe(true)
    expect(regex.test('/docs')).toBe(false)
  })

  it('should convert glob star * to single-segment regex', () => {
    const result = pathToRegex('/admin/*')
    expect(result).toBe('^\\/admin\\/[^\\/]+$')
  })

  it('should match glob star correctly', () => {
    const regex = new RegExp(pathToRegex('/admin/*'))
    expect(regex.test('/admin/users')).toBe(true)
    expect(regex.test('/admin/users/list')).toBe(false)
    expect(regex.test('/admin')).toBe(false)
  })

  it('should convert globstar ** to multi-segment regex', () => {
    const result = pathToRegex('/docs/**')
    expect(result).toBe('^\\/docs\\/.*$')
  })

  it('should match globstar correctly', () => {
    const regex = new RegExp(pathToRegex('/docs/**'))
    expect(regex.test('/docs/a')).toBe(true)
    expect(regex.test('/docs/a/b/c')).toBe(true)
    expect(regex.test('/docs/')).toBe(true)
    expect(regex.test('/docs')).toBe(false)
  })

  it('should convert named param :param to regex', () => {
    const result = pathToRegex('/users/:id')
    expect(result).toBe('^\\/users\\/[^\\/]+$')
  })

  it('should match named param correctly', () => {
    const regex = new RegExp(pathToRegex('/users/:id'))
    expect(regex.test('/users/123')).toBe(true)
    expect(regex.test('/users/abc')).toBe(true)
    expect(regex.test('/users/123/posts')).toBe(false)
  })

  it('should handle mixed Next.js params and glob patterns', () => {
    const regex = new RegExp(pathToRegex('/api/:version/users/[id]'))
    expect(regex.test('/api/v2/users/42')).toBe(true)
    expect(regex.test('/api/v2/users/abc')).toBe(true)
    expect(regex.test('/api/v2')).toBe(false)
  })
})