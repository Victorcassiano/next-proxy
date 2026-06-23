import { expectType, expectError, expectAssignable } from 'tsd'
import { defineNextProxyConfig, NextProxyConfig, AuthConfig } from '../../src/index.js'

// ✅ Valid minimal config
expectType<NextProxyConfig>(
  defineNextProxyConfig({
    auth: { strategy: 'cookie', key: 'auth_token' },
    routes: { '/': 'public' },
    redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
  })
)

// ✅ Valid header strategy
expectType<NextProxyConfig>(
  defineNextProxyConfig({
    auth: { strategy: 'header', key: 'x-auth-token' },
    routes: { '/': 'public' },
    redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
  })
)

// ✅ Valid jwt strategy
expectType<NextProxyConfig>(
  defineNextProxyConfig({
    auth: { strategy: 'jwt', key: 'token' },
    routes: { '/': 'public' },
    redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
  })
)

// ✅ Valid full config
expectType<NextProxyConfig>(
  defineNextProxyConfig({
    auth: { strategy: 'cookie', key: 'my_token' },
    routes: {
      '/': 'public',
      '/dashboard': 'private',
      '/login': 'public',
    },
    redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
    fallback: '/',
    output: { basePath: 'src' },
  })
)

// ✅ AuthConfig type
expectAssignable<AuthConfig>({
  strategy: 'cookie',
  key: 'auth_token',
})

// ❌ Missing auth
expectError(
  defineNextProxyConfig({
    routes: { '/': 'public' },
    redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
  })
)

// ❌ Missing routes
expectError(
  defineNextProxyConfig({
    auth: { strategy: 'cookie', key: 'token' },
    redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
  })
)

// ❌ Missing redirects
expectError(
  defineNextProxyConfig({
    auth: { strategy: 'cookie', key: 'token' },
    routes: { '/': 'public' },
  })
)

// ❌ Auth without key
expectError(
  defineNextProxyConfig({
    auth: { strategy: 'cookie' },
    routes: { '/': 'public' },
    redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
  })
)

// ❌ Invalid strategy
expectError(
  defineNextProxyConfig({
    auth: { strategy: 'oauth', key: 'token' },
    routes: { '/': 'public' },
    redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
  })
)

// ❌ Invalid route type
expectError(
  defineNextProxyConfig({
    auth: { strategy: 'cookie', key: 'token' },
    routes: { '/': 'invalid' },
    redirects: { unauthenticated: '/login', authenticated: '/dashboard' },
  })
)

// ❌ Missing unauthenticated redirect
expectError(
  defineNextProxyConfig({
    auth: { strategy: 'cookie', key: 'token' },
    routes: { '/': 'public' },
    redirects: {},
  })
)
