import { expectType, expectError, expectAssignable } from 'tsd'
import { defineNextProxyConfig, NextProxyConfig, AuthConfig, RouteRule, AccessType } from '../../src/index.js'

// ✅ AccessType accepts valid values
expectAssignable<AccessType>('public')
expectAssignable<AccessType>('private')

// ❌ AccessType rejects invalid values
expectError(
  (() => {
    const invalid: AccessType = 'hybrid'
    return invalid
  })()
)

expectError(
  (() => {
    const invalid: AccessType = 'publicOnly'
    return invalid
  })()
)

// ✅ RouteRule accepts valid string values
expectAssignable<RouteRule>('public')
expectAssignable<RouteRule>('private')

// ❌ RouteRule rejects invalid string values
expectError(
  (() => {
    const invalid: RouteRule = 'invalid'
    return invalid
  })()
)

// ✅ NextProxyConfig is correctly typed
expectAssignable<NextProxyConfig>({
  auth: { strategy: 'cookie', key: 'token' },
  routes: { '/': 'public' },
  redirects: { unauthenticated: '/login' },
})

// ✅ AuthConfig is correctly typed
expectType<AuthConfig>({
  strategy: 'cookie',
  key: 'auth_token',
})

// ✅ defineNextProxyConfig returns correct type
expectType<NextProxyConfig>(
  defineNextProxyConfig({
    auth: { strategy: 'cookie', key: 'token' },
    routes: { '/': 'public' },
    redirects: { unauthenticated: '/login' },
  })
)

// ✅ RouteRule with valid access types
expectAssignable<RouteRule>('public')
expectAssignable<RouteRule>('private')

// ❌ RouteRule with invalid access type
expectError(
  (() => {
    const invalid: RouteRule = 'hybrid'
    return invalid
  })()
)
