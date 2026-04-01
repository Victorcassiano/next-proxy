import { expectType, expectError } from 'tsd'
import { defineNextProxyConfig, NextProxyConfig, AuthConfig } from '../../src/index.js'

// ✅ Valid minimal config
expectType<NextProxyConfig>(
  defineNextProxyConfig({
    auth: { strategy: 'cookie', key: 'auth_token' },
    routes: { '/': 'public' },
    redirects: { unauthenticated: '/login' },
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
    redirects: { unauthenticated: '/login' },
    fallback: '/',
    output: { basePath: 'src' },
  })
)

// ✅ AuthConfig type
expectType<AuthConfig>({
  strategy: 'cookie',
  key: 'auth_token',
})

// ❌ Missing auth
expectError(
  defineNextProxyConfig({
    routes: { '/': 'public' },
    redirects: { unauthenticated: '/login' },
  })
)

// ❌ Missing routes
expectError(
  defineNextProxyConfig({
    auth: { strategy: 'cookie', key: 'token' },
    redirects: { unauthenticated: '/login' },
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
    redirects: { unauthenticated: '/login' },
  })
)

// ❌ Invalid strategy
expectError(
  defineNextProxyConfig({
    auth: { strategy: 'jwt', key: 'token' },
    routes: { '/': 'public' },
    redirects: { unauthenticated: '/login' },
  })
)

// ❌ Invalid route type
expectError(
  defineNextProxyConfig({
    auth: { strategy: 'cookie', key: 'token' },
    routes: { '/': 'invalid' },
    redirects: { unauthenticated: '/login' },
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
