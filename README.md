# next-proxy

A simple routing proxy for Next.js.

---

## What is next-proxy?

next-proxy is a library that **automatically generates middleware** for route protection in Next.js applications. It checks for the presence of an authentication cookie and redirects unauthenticated users from private routes.

## Problem it solves

Building route protection in Next.js often requires:
- Writing repetitive middleware logic for each protected route
- Manually managing redirects for unauthenticated users
- Scattering authentication checks across multiple files

next-proxy solves these problems by generating optimized middleware code based on a simple configuration file.

## Installation

```bash
# npm
npm install @victorcassiano/next-proxy

# yarn
yarn add @victorcassiano/next-proxy

# pnpm
pnpm add @victorcassiano/next-proxy

# bun
bun add @victorcassiano/next-proxy
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
  strategy: "cookie",  // Authentication strategy
  key: "auth_token",   // Cookie name to check for authentication
}
```

### routes (required)

Define access rules for your routes:
```typescript
routes: {
  "/": "public",           // Accessible to everyone
  "/dashboard": "private", // Redirects to unauthenticated URL if no cookie
  "/login": "public",      // Accessible to everyone
}
```

- `"public"` - Accessible to everyone, no authentication required
- `"private"` - Redirects to `redirects.unauthenticated` if cookie is not present

### redirects (required)

Define redirect behavior:
```typescript
redirects: {
  unauthenticated: "/login",  // Where to redirect users without auth cookie
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

## Full Example

```typescript
import { defineNextProxyConfig } from "@victorcassiano/next-proxy";

export default defineNextProxyConfig({
  auth: {
    strategy: "cookie",
    key: "auth_token",
  },
  routes: {
    "/": "public",
    "/login": "public",
    "/register": "public",
    "/dashboard": "private",
    "/admin": "private",
    "/profile": "private",
  },
  redirects: {
    unauthenticated: "/login",
  },
  fallback: "/",
});
```

---

# next-proxy

Um proxy de roteamento simples para Next.js.

---

## O que é o next-proxy?

next-proxy é uma biblioteca que **gera automaticamente middleware** para proteção de rotas em aplicações Next.js. Ela verifica a presença de um cookie de autenticação e redireciona usuários não autenticados de rotas privadas.

## Problema que resolve

Construir proteção de rotas no Next.js frequentemente requer:
- Escrever lógica de middleware repetitiva para cada rota protegida
- Gerenciar manualmente redirecionamentos para usuários não autenticados
- Espalhar verificações de autenticação por vários arquivos

next-proxy resolve esses problemas gerando código de middleware otimizado baseado em um arquivo de configuração simples.

## Instalação

```bash
# npm
npm install @victorcassiano/next-proxy

# yarn
yarn add @victorcassiano/next-proxy

# pnpm
pnpm add @victorcassiano/next-proxy

# bun
bun add @victorcassiano/next-proxy
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
  strategy: "cookie",  // Estratégia de autenticação
  key: "auth_token",   // Nome do cookie para verificar autenticação
}
```

### routes (obrigatório)

Defina regras de acesso para suas rotas:
```typescript
routes: {
  "/": "public",           // Acessível para todos
  "/dashboard": "private", // Redireciona para URL de não autenticado se não houver cookie
  "/login": "public",      // Acessível para todos
}
```

- `"public"` - Acessível para todos, sem necessidade de autenticação
- `"private"` - Redireciona para `redirects.unauthenticated` se o cookie não estiver presente

### redirects (obrigatório)

Defina o comportamento de redirecionamento:
```typescript
redirects: {
  unauthenticated: "/login",  // Para onde redirecionar usuários sem cookie de auth
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

## Exemplo Completo

```typescript
import { defineNextProxyConfig } from "@victorcassiano/next-proxy";

export default defineNextProxyConfig({
  auth: {
    strategy: "cookie",
    key: "auth_token",
  },
  routes: {
    "/": "public",
    "/login": "public",
    "/register": "public",
    "/dashboard": "private",
    "/admin": "private",
    "/profile": "private",
  },
  redirects: {
    unauthenticated: "/login",
  },
  fallback: "/",
});
```
