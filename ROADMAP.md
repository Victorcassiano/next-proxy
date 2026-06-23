# Roadmap

🇺🇸 **English** | [🇧🇷 Português](#roadmap-1)

---

## Project Overview

**@victorcassiano/next-proxy** automatically generates route-protection middleware for Next.js from a declarative config file. Zero dependencies, TypeScript-first, CLI-driven.

- **Current version:** v1.1.0
- **License:** MIT
- **Repository:** [github.com/Victorcassiano/next-proxy](https://github.com/Victorcassiano/next-proxy)

---

## ✅ Current Status (v1.1.0)

### Route Protection
- Three access types: `public`, `private`, `public-only`
- Fallback redirect for unmatched routes
- Optional catch-all routes (`[[...slug]]`)

### Auth Strategies
- `cookie` — checks `request.cookies.get(key)`
- `header` — checks `request.headers.get(key)`
- `jwt` — validates JWT from `Authorization: Bearer` via `jose`

### Path Patterns
- Next.js bracket params (`[id]`, `[...slug]`, `[[...slug]]`)
- Glob wildcards: `*` (single segment), `**` (multi-segment)
- Named params: `:param`

### CLI
- `init` — scaffold `proxy.config.ts` + middleware
- `build` — generate middleware file
- `validate` — validate config without generating
- `dev` — watch mode with auto-regeneration

### Quality
- Runtime config validation (shared between `validate` and `build`)
- Shadowed route detection
- 97 tests: 64 unit, 20 integration, 13 E2E
- Type tests with `tsd`
- CI/CD via GitHub Actions (Node 18, 20, 22)

### Next.js Support
- Next.js 14 — generates `middleware.ts`
- Next.js 15 — generates `middleware.ts`
- Next.js 16+ — generates `proxy.ts`
- Auto-detects `src/` vs root `app/` directory

---

## 🗺️ Roadmap

### 🔧 Short-term — High Impact, Low Effort

These are great for first-time contributors. Each can be tackled independently.

| Area | What | Why | Files |
|---|---|---|---|
| **Lint & Format** | Add ESLint + Prettier config | Enforce consistent code style across contributions | `package.json`, new config files |
| **Test Coverage** | Set up `c8` or `vitest --coverage` | Goal: 80%+ coverage, identify untested paths | `package.json`, `vitest.config.ts` |
| **Pages Router** | Support Next.js `/pages` directory | Not all projects use the App Router | `src/utils/detect-base-path.ts` |
| **More Examples** | Add JWT + header strategy examples | Help users adopt non-cookie strategies | `examples/` |
| **Custom Templates** | Allow user-provided template overrides | Power users need flexibility | `src/template/config.ts`, `src/cli/init.ts` |
| **Verbose Flag** | Add `--verbose` to CLI commands | Debugging config issues | `src/cli/*.ts` |
| **Edge Cases** | Handle empty routes, trailing slashes | Robustness improvements | `src/utils/normalize-routes.ts` |

**How to start:** Look for issues labeled `good first issue` or `help wanted`. Each item above touches a small surface — perfect for focused PRs.

---

### 🚀 Medium-term — Significant Features

These require deeper understanding of the codebase. Coordination via issues + discussions.

| Area | What | Why |
|---|---|---|
| **RBAC** | Role-based access control per route | Was present in v0.0.5 but removed during simplification. Re-add with proper typing |
| **Per-route Redirects** | Override `redirects.unauthenticated` / `redirects.authenticated` per route | Different pages may redirect to different login URLs |
| **Plugin System** | Allow custom auth providers and hooks | Third-party integrations (Auth0, Clerk, NextAuth) |
| **Documentation Site** | Dedicated docs with VitePress or Docusaurus | README is too limited for advanced usage |
| **Config Schema** | JSON Schema for `proxy.config.ts` | IDE autocomplete without needing to import types |
| **Benchmarks** | Performance comparison vs hand-written middleware | Prove the generated code is efficient |

**How to start:** Open a discussion or issue first. These features benefit from design feedback before implementation.

---

### 🌟 Long-term — Project Vision

Big ideas that shape the future of the project.

| Area | What |
|---|---|
| **Rate Limiting** | Built-in rate limiting middleware generation |
| **Debug Mode** | `--debug` flag with structured logs |
| **VS Code Extension** | Syntax highlighting, validation, and code actions for `proxy.config.ts` |
| **Web UI** | Visual config editor (optional, Electron or web-based) |
| **Docker Dev** | Containerized development environment |
| **i18n Middleware** | Generate locale-aware redirects |
| **Monorepo** | Split into `core`, `cli`, and `plugin-*` packages |

---

## 🤝 How to Contribute

Every contribution counts — code, docs, tests, issues, discussions.

1. **Read** [`CONTRIBUTING.md`](./CONTRIBUTING.md)
2. **Pick** an area from the roadmap above
3. **Check** for existing issues or open a new one
4. **Fork** the repo, create a branch, make changes
5. **Ensure** tests pass: `npm run test:all`
6. **Open** a Pull Request

**Not sure where to start?** Look for `good first issue` labels or ask in the repository discussions.

---

## 💡 Proposing New Ideas

If you have an idea not listed here:

1. Search existing issues to avoid duplicates
2. Open a feature request with:
   - **Problem** — what gap does this fill?
   - **Proposed solution** — how would it work?
   - **Alternatives** — what else did you consider?
   - **Implementation notes** — any technical constraints?

All ideas are welcome. The project grows through community input.

---

## 📊 Test Stats (Current)

| Suite | Count |
|---|---|
| Unit tests | 64 |
| Integration tests | 20 |
| E2E tests | 13 |
| Type tests | ~20 (tsd) |
| **Total** | **~97** |

---

---

# Roadmap

[🇺🇸 English](#roadmap) | 🇧🇷 **Português**

---

## Visão Geral do Projeto

**@victorcassiano/next-proxy** gera automaticamente middleware de proteção de rotas para Next.js a partir de um arquivo de configuração declarativo. Zero dependências, TypeScript-first, via CLI.

- **Versão atual:** v1.1.0
- **Licença:** MIT
- **Repositório:** [github.com/Victorcassiano/next-proxy](https://github.com/Victorcassiano/next-proxy)

---

## ✅ Status Atual (v1.1.0)

### Proteção de Rotas
- Três tipos de acesso: `public`, `private`, `public-only`
- Redirect fallback para rotas não configuradas
- Rotas catch-all opcionais (`[[...slug]]`)

### Estratégias de Autenticação
- `cookie` — verifica `request.cookies.get(key)`
- `header` — verifica `request.headers.get(key)`
- `jwt` — valida JWT do header `Authorization: Bearer` via `jose`

### Padrões de Rota
- Bracket params do Next.js (`[id]`, `[...slug]`, `[[...slug]]`)
- Glob wildcards: `*` (segmento único), `**` (multi-segmento)
- Parâmetros nomeados: `:param`

### CLI
- `init` — cria `proxy.config.ts` + middleware
- `build` — gera o arquivo de middleware
- `validate` — valida a configuração sem gerar
- `dev` — modo observação com regeneração automática

### Qualidade
- Validação runtime de configuração (compartilhada entre `validate` e `build`)
- Detecção de rotas sombreadas (shadowed routes)
- 97 testes: 64 unitários, 20 integração, 13 E2E
- Testes de tipo com `tsd`
- CI/CD via GitHub Actions (Node 18, 20, 22)

### Suporte a Next.js
- Next.js 14 — gera `middleware.ts`
- Next.js 15 — gera `middleware.ts`
- Next.js 16+ — gera `proxy.ts`
- Detecção automática de diretório `src/` vs `app/` raiz

---

## 🗺️ Roadmap

### 🔧 Curto Prazo — Alto Impacto, Baixo Esforço

Ideais para primeiras contribuições. Cada item pode ser feito de forma independente.

| Área | O que | Por quê | Arquivos |
|---|---|---|---|
| **Lint & Format** | Adicionar ESLint + Prettier | Padronizar estilo de código entre contribuições | `package.json`, novos config files |
| **Cobertura** | Configurar `c8` ou `vitest --coverage` | Meta: 80%+, identificar caminhos não testados | `package.json`, `vitest.config.ts` |
| **Pages Router** | Suportar diretório `/pages` do Next.js | Nem todo projeto usa App Router | `src/utils/detect-base-path.ts` |
| **Mais Exemplos** | Adicionar exemplos com JWT e header | Ajudar usuários a adotar as novas estratégias | `examples/` |
| **Templates Customizados** | Permitir templates fornecidos pelo usuário | Usuários avançados precisam de flexibilidade | `src/template/config.ts`, `src/cli/init.ts` |
| **Modo Verboso** | Adicionar `--verbose` nos comandos CLI | Depurar problemas de configuração | `src/cli/*.ts` |
| **Casos de Borda** | Rotas vazias, trailing slashes | Melhorar robustez | `src/utils/normalize-routes.ts` |

**Como começar:** Procure issues com a label `good first issue` ou `help wanted`. Cada item acima toca uma superfície pequena — perfeito para PRs focados.

---

### 🚀 Médio Prazo — Funcionalidades Relevantes

Exigem entendimento mais profundo do código. Coordenação via issues + discussões.

| Área | O que | Por quê |
|---|---|---|
| **RBAC** | Controle de acesso baseado em papéis por rota | Esteve no v0.0.5 mas foi removido na simplificação. Re-adicionar com tipagem adequada |
| **Redirect por Rota** | Sobrescrever `redirects.unauthenticated` / `redirects.authenticated` por rota | Páginas diferentes podem redirecionar para logins diferentes |
| **Sistema de Plugins** | Permitir providers de auth e hooks customizados | Integrações de terceiros (Auth0, Clerk, NextAuth) |
| **Site de Documentação** | Docs dedicados com VitePress ou Docusaurus | README é limitado para usos avançados |
| **Schema de Config** | JSON Schema para `proxy.config.ts` | Autocomplete na IDE sem precisar importar tipos |
| **Benchmarks** | Comparação de performance vs middleware manual | Provar que o código gerado é eficiente |

**Como começar:** Abra uma discussão ou issue primeiro. Essas funcionalidades se beneficiam de feedback sobre o design antes da implementação.

---

### 🌟 Longo Prazo — Visão do Projeto

Ideias grandes que moldam o futuro do projeto.

| Área | O que |
|---|---|
| **Rate Limiting** | Geração de middleware de limite de taxa integrado |
| **Modo Debug** | Flag `--debug` com logs estruturados |
| **Extensão VS Code** | Syntax highlighting, validação e code actions para `proxy.config.ts` |
| **Interface Web** | Editor visual de configuração (opcional, Electron ou web) |
| **Docker Dev** | Ambiente de desenvolvimento containerizado |
| **Middleware i18n** | Gerar redirects com consciência de localidade |
| **Monorepo** | Dividir em pacotes `core`, `cli` e `plugin-*` |

---

## 🤝 Como Contribuir

Toda contribuição conta — código, docs, testes, issues, discussões.

1. **Leia** o [`CONTRIBUTING.md`](./CONTRIBUTING.md)
2. **Escolha** uma área do roadmap acima
3. **Verifique** issues existentes ou abra uma nova
4. **Fork** o repositório, crie uma branch, faça as alterações
5. **Garanta** que os testes passem: `npm run test:all`
6. **Abra** um Pull Request

**Não sabe por onde começar?** Procure labels `good first issue` ou pergunte nas discussões do repositório.

---

## 💡 Propondo Novas Ideias

Se você tem uma ideia que não está listada aqui:

1. Pesquise issues existentes para evitar duplicatas
2. Abra uma solicitação de funcionalidade com:
   - **Problema** — que lacuna isso preenche?
   - **Solução proposta** — como funcionaria?
   - **Alternativas** — o que mais você considerou?
   - **Notas de implementação** — alguma restrição técnica?

Todas as ideias são bem-vindas. O projeto cresce através da contribuição da comunidade.

---

## 📊 Estatísticas de Testes (Atuais)

| Suíte | Quantidade |
|---|---|
| Testes unitários | 64 |
| Testes de integração | 20 |
| Testes E2E | 13 |
| Testes de tipo | ~20 (tsd) |
| **Total** | **~97** |
