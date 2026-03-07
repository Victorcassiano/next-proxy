# Changelog

All notable changes to this project will be documented in this file.

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