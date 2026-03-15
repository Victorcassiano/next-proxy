# next-proxy

A simple and powerful routing proxy for Next.js.

---

## What is next-proxy?

next-proxy is a library that **automatically generates middleware** for route protection in Next.js applications. It handles authentication via JWT tokens stored in cookies and provides built-in support for role-based access control (RBAC).

## Problem it solves

Building authentication and authorization in Next.js often requires:
- Writing repetitive middleware logic for each protected route
- Scattering authentication checks across multiple files
- Manually managing redirects for unauthenticated/unauthorized users
- Implementing role-based access control from scratch

next-proxy solves these problems by generating optimized middleware code based on a simple configuration file.

## Installation

```bash
# npm
npm install next-proxy

# yarn
yarn add next-proxy

# pnpm
pnpm add next-proxy

# bun
bun add next-proxy
```

## Quick Start

1. **Initialize** your project:
```bash
npx next-proxy init
```

2. **Configure** your routes in `proxy.config.ts`

3. **Build** the middleware:
```bash
npx next-proxy build
```

## Configuration

### auth (required)

Authentication configuration:
```typescript
auth: {
  strategy: "cookie" | "jwt",  // Authentication strategy
  cookie: {
    name: "auth_token",        // Cookie name to read the token from
    secret: "JWT_SECRET",     // Environment variable name containing the JWT secret
  },
}
```

### routes (required)

Define access rules for your routes:
```typescript
routes: {
  "/": "public",           // Accessible to everyone
  "/dashboard": "private", // Requires authentication
  "/login": "publicOnly",  // Redirects authenticated users (ideal for login pages)
}
```

- `"public"` - Accessible to everyone, no authentication required
- `"private"` - Requires valid JWT token
- `"publicOnly"` - Redirects authenticated users (use for login/register pages)

### roles (optional)

Role-based access control:
```typescript
roles: [
  { name: "admin", navigations: ["/admin", "/dashboard"] },
  { name: "user", navigations: ["/dashboard"] },
]
```

Each role defines which paths are accessible by users with that role.

### redirects (required)

Define redirect behavior:
```typescript
redirects: {
  unauthenticated: "/login",    // Where to redirect users who are not logged in
  authenticated: "/dashboard",  // Where to redirect authenticated users trying to access publicOnly routes
  unauthorized: "/dashboard",    // Where to redirect users who don't have the required role
}
```

### fallback (optional)

Default redirect for routes that don't match any configured rule:
```typescript
fallback: "/",  // Defaults to NextResponse.next() if not specified
```

### output.basePath (optional)

Custom base path for the generated middleware file:
```typescript
output: {
  basePath: "src/middleware",  // Default: detected from Next.js config
}
```

## Environment Variables

Create a `.env` file in your project root with your JWT secret:

```bash
JWT_SECRET=your-super-secret-jwt-key-here
```

The variable name must match the one configured in `auth.cookie.secret`.

## Full Example

```typescript
import { defineNextProxyConfig } from "@victorcassiano/next-proxy";

export default defineNextProxyConfig({
  auth: {
    strategy: "cookie",
    cookie: {
      name: "auth_token",
      secret: "JWT_SECRET",
    },
  },
  routes: {
    "/": "public",
    "/login": "publicOnly",
    "/register": "publicOnly",
    "/dashboard": "private",
    "/admin": "private",
    "/profile": "private",
  },
  redirects: {
    unauthenticated: "/login",
    authenticated: "/dashboard",
    unauthorized: "/403",
  },
  roles: [
    { name: "admin", navigations: ["/admin", "/dashboard"] },
    { name: "user", navigations: ["/dashboard", "/profile"] },
  ],
  fallback: "/",
});
```

---

# next-proxy

Um proxy de roteamento simples e poderoso para Next.js.

---

## O que é o next-proxy?

next-proxy é uma biblioteca que **gera automaticamente middleware** para proteção de rotas em aplicações Next.js. Ela lida com autenticação via tokens JWT armazenados em cookies e oferece suporte integrado para controle de acesso baseado em funções (RBAC).

## Problema que resolve

Construir autenticação e autorização no Next.js frequentemente requer:
- Escrever lógica de middleware repetitiva para cada rota protegida
- Espalhar verificações de autenticação por vários arquivos
- Gerenciar manualmente redirecionamentos para usuários não autenticados/não autorizados
- Implementar controle de acesso baseado em funções do zero

next-proxy resolve esses problemas gerando código de middleware otimizado baseado em um arquivo de configuração simples.

## Instalação

```bash
# npm
npm install next-proxy

# yarn
yarn add next-proxy

# pnpm
pnpm add next-proxy

# bun
bun add next-proxy
```

## Quick Start

1. **Inicialize** seu projeto:
```bash
npx next-proxy init
```

2. **Configure** suas rotas no `proxy.config.ts`

3. **Build** o middleware:
```bash
npx next-proxy build
```

## Configuração

### auth (obrigatório)

Configuração de autenticação:
```typescript
auth: {
  strategy: "cookie" | "jwt",  // Estratégia de autenticação
  cookie: {
    name: "auth_token",         // Nome do cookie para ler o token
    secret: "JWT_SECRET",       // Nome da variável de ambiente contendo o segredo JWT
  },
}
```

### routes (obrigatório)

Defina regras de acesso para suas rotas:
```typescript
routes: {
  "/": "public",           // Acessível para todos
  "/dashboard": "private", // Requer autenticação
  "/login": "publicOnly",  // Redireciona usuários autenticados (ideal para páginas de login)
}
```

- `"public"` - Acessível para todos, sem necessidade de autenticação
- `"private"` - Requer token JWT válido
- `"publicOnly"` - Redireciona usuários autenticados (use para páginas de login/cadastro)

### roles (opcional)

Controle de acesso baseado em funções:
```typescript
roles: [
  { name: "admin", navigations: ["/admin", "/dashboard"] },
  { name: "user", navigations: ["/dashboard"] },
]
```

Cada função define quais caminhos são acessíveis por usuários com aquela função.

### redirects (obrigatório)

Defina o comportamento de redirecionamento:
```typescript
redirects: {
  unauthenticated: "/login",    // Para onde redirecionar usuários não logados
  authenticated: "/dashboard",  // Para onde redirecionar usuários autenticados tentando acessar rotas publicOnly
  unauthorized: "/dashboard",    // Para onde redirecionar usuários que não têm a função necessária
}
```

### fallback (opcional)

Redirecionamento padrão para rotas que não correspondem a nenhuma regra configurada:
```typescript
fallback: "/",  // Padrão: NextResponse.next() se não especificado
```

### output.basePath (opcional)

Caminho base personalizado para o arquivo de middleware gerado:
```typescript
output: {
  basePath: "src/middleware",  // Padrão: detectado a partir da configuração do Next.js
}
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do seu projeto com seu segredo JWT:

```bash
JWT_SECRET=sua-chave-secreta-jwt-aqui
```

O nome da variável deve corresponder ao configurado em `auth.cookie.secret`.

## Exemplo Completo

```typescript
import { defineNextProxyConfig } from "@victorcassiano/next-proxy";

export default defineNextProxyConfig({
  auth: {
    strategy: "cookie",
    cookie: {
      name: "auth_token",
      secret: "JWT_SECRET",
    },
  },
  routes: {
    "/": "public",
    "/login": "publicOnly",
    "/register": "publicOnly",
    "/dashboard": "private",
    "/admin": "private",
    "/profile": "private",
  },
  redirects: {
    unauthenticated: "/login",
    authenticated: "/dashboard",
    unauthorized: "/403",
  },
  roles: [
    { name: "admin", navigations: ["/admin", "/dashboard"] },
    { name: "user", navigations: ["/dashboard", "/profile"] },
  ],
  fallback: "/",
});
```
