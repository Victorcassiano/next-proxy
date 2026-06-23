# Basic Example

This example demonstrates a complete `proxy.config.ts` setup with all route types and a custom matcher.

## Usage

```bash
# 1. Install dependencies
bun install

# 2. Initialize (creates proxy.config.ts if missing)
npx next-proxy init

# 3. Build the middleware
npx next-proxy build

# 4. (Optional) Watch for changes
npx next-proxy dev

# 5. Validate configuration
npx next-proxy validate
```

## Route Types

| Route          | Type         | Behavior                                    |
|----------------|--------------|---------------------------------------------|
| `/`            | `public`     | Accessible to everyone                      |
| `/about`       | `public`     | Accessible to everyone                      |
| `/dashboard`   | `private`    | Redirects to `/login` if unauthenticated    |
| `/admin/*`     | `private`    | All admin sub-routes require auth           |
| `/login`       | `public-only`| Redirects to `/dashboard` if authenticated  |
| `/register`    | `public-only`| Redirects to `/dashboard` if authenticated  |
