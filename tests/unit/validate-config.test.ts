import { describe, it, expect } from 'vitest'
import { validateConfig } from '../../src/utils/validate-config.js'

describe('validateConfig', () => {
  it('returns no errors for valid config', () => {
    const config = {
      auth: { strategy: 'cookie', key: 'token' },
      routes: { '/': 'public' },
      redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
    }
    expect(validateConfig(config)).toHaveLength(0)
  })

  it('returns error when routes is missing', () => {
    const config = {
      auth: { strategy: 'cookie', key: 'token' },
      redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
    }
    const errors = validateConfig(config)
    expect(errors.some(e => e.field === 'routes')).toBe(true)
  })

  it('returns error when route path does not start with /', () => {
    const config = {
      auth: { strategy: 'cookie', key: 'token' },
      routes: { invalid: 'public' },
      redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
    }
    const errors = validateConfig(config)
    expect(errors.some(e => e.field.includes('invalid'))).toBe(true)
  })

  it('returns error when route has invalid access type', () => {
    const config = {
      auth: { strategy: 'cookie', key: 'token' },
      routes: { '/': 'forbidden' },
      redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
    }
    const errors = validateConfig(config)
    expect(errors.some(e => e.message.includes('forbidden'))).toBe(true)
  })

  it('returns error when auth is missing', () => {
    const config = {
      routes: { '/': 'public' },
      redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
    }
    const errors = validateConfig(config)
    expect(errors.some(e => e.field === 'auth')).toBe(true)
  })

  it('returns error when auth.strategy is invalid', () => {
    const config = {
      auth: { strategy: 'invalid', key: 'token' },
      routes: { '/': 'public' },
      redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
    }
    const errors = validateConfig(config)
    expect(errors.some(e => e.field === 'auth.strategy')).toBe(true)
  })

  it('returns error when auth.key is empty string', () => {
    const config = {
      auth: { strategy: 'cookie', key: '' },
      routes: { '/': 'public' },
      redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
    }
    const errors = validateConfig(config)
    expect(errors.some(e => e.field === 'auth.key')).toBe(true)
  })

  it('returns error when auth.key is missing', () => {
    const config = {
      auth: { strategy: 'cookie' },
      routes: { '/': 'public' },
      redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
    }
    const errors = validateConfig(config)
    expect(errors.some(e => e.field === 'auth.key')).toBe(true)
  })

  it('returns error when redirects is missing', () => {
    const config = {
      auth: { strategy: 'cookie', key: 'token' },
      routes: { '/': 'public' },
    }
    const errors = validateConfig(config)
    expect(errors.some(e => e.field === 'redirects')).toBe(true)
  })

  it('returns error when redirects.unauthenticated is missing', () => {
    const config = {
      auth: { strategy: 'cookie', key: 'token' },
      routes: { '/': 'public' },
      redirects: { authenticated: '/dashboard' },
    }
    const errors = validateConfig(config)
    expect(errors.some(e => e.field === 'redirects.unauthenticated')).toBe(true)
  })

  it('returns error when redirects.authenticated is missing', () => {
    const config = {
      auth: { strategy: 'cookie', key: 'token' },
      routes: { '/': 'public' },
      redirects: { unauthenticated: '/login' },
    }
    const errors = validateConfig(config)
    expect(errors.some(e => e.field === 'redirects.authenticated')).toBe(true)
  })

  it('returns multiple errors simultaneously', () => {
    const errors = validateConfig({})
    expect(errors.length).toBeGreaterThanOrEqual(3)
  })

  it('accepts header strategy', () => {
    const config = {
      auth: { strategy: 'header', key: 'x-token' },
      routes: { '/': 'public' },
      redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
    }
    expect(validateConfig(config)).toHaveLength(0)
  })

  it('accepts jwt strategy', () => {
    const config = {
      auth: { strategy: 'jwt', key: 'unused' },
      routes: { '/': 'public' },
      redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
    }
    expect(validateConfig(config)).toHaveLength(0)
  })
})
