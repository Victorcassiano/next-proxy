# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1] - 2026-06-17

### Fixed
- **CI/CD workflow**: Fixed branch name from `main` to `master` in GitHub Actions
- **Test spies**: Fixed `process.exit` spy in integration tests (`vi.fn` → `vi.spyOn`)
- **Integration tests**: Updated to use `hasSrcApp`/`hasRootApp` for accurate base path testing

### Added
- **Auto-publish on tags**: npm publish triggered on `v*` tags with provenance support

## [1.0.0] - 2026-06-17

### Added
- **Optional catch-all routes**: Support for `[[...slug]]` syntax in route definitions
- **Shadowed route detection**: Build now fails when static routes are shadowed by dynamic routes (e.g., `/users/admin` shadowed by `/users/[id]`)
- **Custom matcher configuration**: `output.matcher` option to customize the middleware matcher patterns
- **`next-proxy validate` command**: Validate `proxy.config.ts` without generating the middleware file
- **`redirects.authenticated`**: Required redirect for authenticated users (e.g., redirect from `/login` when user is already logged in)
- **`public-only` access type**: Route type for pages that should only be accessible to unauthenticated users
- **Next.js 14 support**: E2E tests now cover Next.js 14, 15, and 16+
- **CI/CD pipeline**: GitHub Actions workflow running tests across Node.js 18, 20, and 22
- **Improved `detectBasePath`**: Now detects `app/` or `pages/` directories instead of just checking for `src/` folder

### Fixed
- **Build exit code**: `build` command now properly exits with code 1 on errors (important for CI/CD)
- **Config template**: `proxy.config.ts` template now includes `redirects.authenticated`
- **Type tests**: All type tests now use complete `redirects` object

### Changed
- **`redirects.authenticated` is now required**: Config without this field will fail validation
- **Version bump**: `0.0.8` → `1.0.0`

## [0.0.8] - 2026-04-13

### Added
- **`public-only` access type**: New route type for pages that should only be accessible to unauthenticated users (e.g., `/login`). Redirects to `redirects.authenticated` if user is already logged in
- **`redirects.authenticated`**: New redirect configuration for authenticated users (e.g., redirect from `/login` when user is already logged in)

### Changed
- Expanded route types from `public | private` to `public | public-only | private`
- Updated generated middleware to handle all three access types

## [0.0.7] - 2025-03-15

### Added
- **Unit Tests**: 25 tests covering core utilities
  - `path-to-regex` - Route to regex conversion
  - `normalize-routes` - Route normalization
  - `generate-route-logic` - Route logic generation
  - `generate-file-content` - File content generation
- **Type Tests**: 17 tests using tsd for type safety
  - Config validation types
  - Exported type definitions
- **Integration Tests**: 14 tests for CLI commands
  - `init` command tests
  - `build` command Tests
  - `--force` flag Tests
- Test scripts: `test`, `test:types`, `test:integration`, `test:all`

### Changed
- Simplified to cookie-based route redirection
- Removed JWT validation and token authentication
- Simplified route types to: public, private
- Build system: switched from tsdown to tsc

### Fixed
- Config validation (routes, auth, redirects)
- Windows ESM import compatibility with pathToFileURL

## [0.0.6] - 2025-03-15

### Added
- `--force` flag to overwrite generated files

### Changed
- Package name: `@victorcassiano/next-proxy`
- Build system: switched from tsdown to tsc

### Fixed
- Config validation (routes, auth, redirects)
- Improved error messages

## [0.0.5] - 2025-03-02

### Added
- `defineNextProxyConfig()` function to create configuration
- `validateAuthToken()` utility for JWT validation
- Role-based access control (RBAC) support
- Fallback route configuration for unmatched paths
- Support for Next.js 15 and 16+ (middleware.ts / proxy.ts)
- CLI commands: `init` and `build`
- `--force` flag to overwrite generated files
- Portuguese and English documentation (README)

### Changed
- Refactored `build.ts` into modular utilities:
  - `path-to-regex.ts`
  - `normalize-routes.ts`
  - `generate-route-logic.ts`
  - `generate-file-content.ts`
- Updated TypeScript compiler to use `tsc` instead of bundler
- Improved error messages in CLI

### Fixed
- File overwrite confirmation (now asks before overwriting)
- Config validation (routes, auth, redirects)

### Dependencies
- Added: `jose` (JWT validation)
- Moved: `dotenv` to peerDependencies
