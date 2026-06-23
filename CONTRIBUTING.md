# Contributing to @victorcassiano/next-proxy

🇺🇸 **English** | [🇧🇷 Versão em Português](#contribuindo-para-victorcassianonext-proxy)

---

## Welcome 🎉

Thank you for considering contributing to **next-proxy**! We're building a zero-dependency, TypeScript-first middleware generator for Next.js, and every contribution — code, docs, tests, issues, discussions — makes the project better.

This guide will help you get started quickly and effectively.

---

## Code of Conduct

This project adheres to the [Contributor Covenant](https://www.contributor-covenant.org/). By participating, you agree to maintain a respectful and inclusive environment for everyone.

---

## How Can I Contribute?

### 🐛 Reporting Bugs

If you find a bug, please open an issue with the following template:

```
**Bug Report Template:**
- Description: [Clear description of the bug]
- Steps to Reproduce:
  1. [First Step]
  2. [Second Step]
  3. [and so on...]
- Expected Behavior: [What you expected to happen]
- Actual Behavior: [What actually happened]
- Environment:
  - Node.js version:
  - npm/yarn version:
  - Next.js version:
  - OS:
- Additional Context: [Add any other context about the problem here]
```

### ✨ Suggesting Enhancements

Have an idea? Open a feature request issue with:
- **Problem** — what gap does this fill?
- **Proposed solution** — how would it work?
- **Alternatives** — what else did you consider?
- **Implementation notes** — any technical constraints?

### 💻 Contributing Code

See the [Roadmap & Areas Needing Help](#-roadmap--areas-needing-help) section for ideas, or pick an issue labeled `good first issue` / `help wanted`.

---

## Development Setup

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Git

### Installation

```bash
git clone https://github.com/Victorcassiano/next-proxy.git
cd next-proxy
npm install
```

### Project Structure

```
next-proxy/
├── src/
│   ├── cli/           # CLI commands (init, build, validate, dev)
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Core logic (path-to-regex, validate-config, etc.)
│   ├── template/      # Config template for `init`
│   └── index.ts       # Main entry point (defineNextProxyConfig)
├── tests/
│   ├── unit/          # Unit tests (vitest)
│   ├── integration/   # CLI integration tests
│   ├── e2e/           # Real Next.js project E2E tests
│   └── types/         # Type tests (tsd)
├── examples/
│   └── basic/         # Playground example
├── package.json
├── tsconfig.json
└── CHANGELOG.md
```

### Available Commands

```bash
npm run build          # Compile TypeScript with tsc
npm run typecheck      # Type-check without emitting (tsc --noEmit)
npm run test           # Run all unit + integration tests (vitest)
npm run test:watch     # Run tests in watch mode
npm run test:types     # Run tsd type tests
npm run test:integration # Run integration tests only
npm run test:e2e       # Run E2E tests (requires network)
npm run test:all       # Run everything: unit + integration + e2e + types
```

There is no ESLint or Prettier config yet — PRs to add them are welcome (see roadmap).

---

## Code Style

- **Language:** TypeScript with strict mode enabled
- **Modules:** Native ESM (`import`/`export`, `.js` extensions in imports)
- **Naming:** camelCase for variables/functions, PascalCase for types/interfaces
- **Exports:** Named exports preferred; default only for main config function
- **Comments:** JSDoc for public APIs, minimal inline comments for logic
- **Formatting:** Follow the existing style in the file you're editing

---

## Testing

Tests are the backbone of this project. Every feature must include tests.

```bash
# Run the suite relevant to your change
npm run test:unit          # Unit tests
npm run test:integration   # CLI integration tests
npm run test:e2e           # E2E in a real Next.js project
npm run test:types         # Type-level tests (tsd)

# Run everything before submitting a PR
npm run test:all
```

**Coverage goal:** 80%+ (not enforced yet — see roadmap to help set it up).

---

## Pull Request Process

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feat/my-feature`
3. **Make changes** with clear, atomic commits (see commit convention below)
4. **Run tests**: `npm run test:all`
5. **Push** to your fork: `git push origin feat/my-feature`
6. **Open a Pull Request** with a clear title and description
7. **Address feedback** if any — the PR will be reviewed as soon as possible

---

## Pull Request Guidelines

- ✅ Keep PRs **small and focused** — one feature or fix per PR
- ✅ Include **tests** for new code
- ✅ Update **documentation** if needed (README, CHANGELOG)
- ✅ Ensure **all tests pass** before requesting review
- ✅ Use a **descriptive title** that follows commit conventions
- ❌ Avoid unrelated changes (formatting, refactoring not related to the feature)

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

Real examples from this project's history:

```
feat(cli): add watch mode for automatic middleware regeneration
feat(core): add auth strategies (cookie, header, jwt)
feat(utils): add glob pattern support to path-to-regex
fix(core): handle missing basePath in middleware generation
fix(utils): fix shadowed route detection for wildcard patterns
docs(readme): update auth strategy documentation
docs(changelog): add 1.1.0 release notes
refactor(cli): extract validateConfig to shared module
test(e2e): add E2E tests for header and jwt strategies
test(types): update tsd tests for new auth strategies
chore(release): bump version to 1.1.0
```

**Types:** `feat` | `fix` | `docs` | `refactor` | `test` | `chore` | `style`
**Scopes:** `cli`, `core`, `utils`, `types`, `template`, `e2e`, `integration`, `docs`, `release`

---

## 🗺️ Roadmap & Areas Needing Help

### ✅ Current Status (v1.1.0)

| Area | What's implemented |
|---|---|
| Route Protection | `public`, `private`, `public-only`, catch-all `[[...slug]]` |
| Auth Strategies | `cookie`, `header`, `jwt` |
| Path Patterns | `[param]`, `[...slug]`, `[[...slug]]`, `*`, `**`, `:param` |
| CLI | `init`, `build`, `validate`, `dev` (watch mode) |
| Validation | Runtime config validation, shadowed route detection |
| Testing | 97 tests: 64 unit, 20 integration, 13 E2E, ~20 type (tsd) |
| Next.js | 14 / 15 / 16+, auto base path detection |
| CI/CD | GitHub Actions (Node 18, 20, 22), auto-publish on tags |
| Docs | README (EN/PT-BR), CHANGELOG |

---

### 🔧 Short-term — High Impact, Low Effort

Great for first-time contributors. Each can be tackled independently.

| Area | What | Why | Files |
|---|---|---|---|
| **Lint & Format** | Add ESLint + Prettier config | Enforce consistent code style | `package.json`, new config files |
| **Test Coverage** | Set up `vitest --coverage` | Goal: 80%+, identify untested paths | `package.json`, `vitest.config.ts` |
| **Pages Router** | Support `/pages` directory | Not all projects use App Router | `src/utils/detect-base-path.ts` |
| **More Examples** | JWT + header strategy examples | Help users adopt non-cookie strategies | `examples/` |
| **Custom Templates** | Allow user-provided template overrides | Power users need flexibility | `src/template/config.ts`, `src/cli/init.ts` |
| **Verbose Flag** | Add `--verbose` to CLI commands | Debugging config issues | `src/cli/*.ts` |
| **Edge Cases** | Empty routes, trailing slashes | Robustness improvements | `src/utils/normalize-routes.ts` |

---

### 🚀 Medium-term — Significant Features

Require deeper codebase knowledge. Open a discussion first.

| Area | What | Why |
|---|---|---|
| **RBAC** | Role-based access control per route | Was in v0.0.5 but removed during simplification |
| **Per-route Redirects** | Override redirects per route | Different pages → different login URLs |
| **Plugin System** | Custom auth providers and hooks | Third-party integrations (Auth0, Clerk, NextAuth) |
| **Documentation Site** | VitePress or Docusaurus | README is too limited for advanced usage |
| **JSON Schema** | Schema for `proxy.config.ts` | IDE autocomplete without importing types |
| **Benchmarks** | Performance vs hand-written middleware | Prove generated code is efficient |

---

### 🌟 Long-term — Project Vision

| Area | What |
|---|---|
| **Rate Limiting** | Built-in rate limiting middleware |
| **Debug Mode** | `--debug` flag with structured logs |
| **VS Code Extension** | Syntax highlighting + validation for `proxy.config.ts` |
| **Web UI** | Visual config editor |
| **Docker Dev** | Containerized development environment |
| **i18n Middleware** | Locale-aware redirects |
| **Monorepo** | Split into `core`, `cli`, `plugin-*` packages |

---

## Questions?

- Open a [discussion](https://github.com/Victorcassiano/next-proxy/discussions)
- Create an [issue](https://github.com/Victorcassiano/next-proxy/issues)
- Reach out to the maintainer via the repository's GitHub profile

---

## Acknowledgments

Every contributor who takes the time to improve this project is deeply appreciated.  
If you're reading this — **thank you** ❤️

---

---

# Contribuindo para @victorcassiano/next-proxy

[🇺🇸 English Version](#contributing-to-victorcassianonext-proxy) | 🇧🇷 **Português**

---

## Bem-vindo(a) 🎉

Obrigado por considerar contribuir com o **next-proxy**! Estamos construindo um gerador de middleware zero-dependências e TypeScript-first para Next.js, e toda contribuição — código, docs, testes, issues, discussões — torna o projeto melhor.

Este guia vai ajudar você a começar de forma rápida e eficaz.

---

## Código de Conduta

Este projeto adota o [Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, você concorda em manter um ambiente respeitoso e inclusivo para todos.

---

## Como Posso Contribuir?

### 🐛 Reportando Bugs

Se encontrou um bug, abra uma issue com o seguinte template:

```
**Template de Bug Report:**
- Descrição: [Descrição clara do bug]
- Passos para Reproduzir:
  1. [Primeiro passo]
  2. [Segundo passo]
  3. [e assim por diante...]
- Comportamento Esperado: [O que você esperava que acontecesse]
- Comportamento Real: [O que realmente aconteceu]
- Ambiente:
  - Versão do Node.js:
  - Versão do npm/yarn:
  - Versão do Next.js:
  - SO:
- Contexto Adicional: [Adicione qualquer outro contexto sobre o problema]
```

### ✨ Sugerindo Melhorias

Tem uma ideia? Abra uma issue de solicitação de funcionalidade com:
- **Problema** — que lacuna isso preenche?
- **Solução proposta** — como funcionaria?
- **Alternativas** — o que mais você considerou?
- **Notas de implementação** — alguma restrição técnica?

### 💻 Contribuindo com Código

Veja a seção [Roadmap e Áreas que Precisam de Ajuda](#-roadmap-e-áreas-que-precisam-de-ajuda) para ideias, ou escolha uma issue com label `good first issue` / `help wanted`.

---

## Configurando o Ambiente de Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm, yarn, pnpm, ou bun
- Git

### Instalação

```bash
git clone https://github.com/Victorcassiano/next-proxy.git
cd next-proxy
npm install
```

### Estrutura do Projeto

```
next-proxy/
├── src/
│   ├── cli/           # Comandos CLI (init, build, validate, dev)
│   ├── types/         # Definições de tipos TypeScript
│   ├── utils/         # Lógica central (path-to-regex, validate-config, etc.)
│   ├── template/      # Template de config para o comando `init`
│   └── index.ts       # Ponto de entrada principal (defineNextProxyConfig)
├── tests/
│   ├── unit/          # Testes unitários (vitest)
│   ├── integration/   # Testes de integração CLI
│   ├── e2e/           # Testes E2E com projeto Next.js real
│   └── types/         # Testes de tipo (tsd)
├── examples/
│   └── basic/         # Exemplo de playground
├── package.json
├── tsconfig.json
└── CHANGELOG.md
```

### Comandos Disponíveis

```bash
npm run build          # Compilar TypeScript com tsc
npm run typecheck      # Type-check sem emitir (tsc --noEmit)
npm run test           # Rodar testes unitários + integração (vitest)
npm run test:watch     # Rodar testes em modo watch
npm run test:types     # Rodar testes de tipo (tsd)
npm run test:integration # Rodar apenas testes de integração
npm run test:e2e       # Rodar testes E2E (requer rede)
npm run test:all       # Rodar tudo: unit + integration + e2e + types
```

Ainda não temos config de ESLint ou Prettier — PRs para adicionar são bem-vindos (veja roadmap).

---

## Estilo de Código

- **Linguagem:** TypeScript com strict mode ativado
- **Módulos:** ESM nativo (`import`/`export`, extensões `.js` nos imports)
- **Nomenclatura:** camelCase para variáveis/funções, PascalCase para tipos/interfaces
- **Exports:** Named exports preferidos; default apenas para função de config principal
- **Comentários:** JSDoc para APIs públicas, comentários inline mínimos para lógica
- **Formatação:** Siga o estilo existente no arquivo que você está editando

---

## Testes

Testes são a espinha dorsal deste projeto. Toda funcionalidade deve incluir testes.

```bash
# Rode a suíte relevante para sua mudança
npm run test:unit          # Testes unitários
npm run test:integration   # Testes de integração CLI
npm run test:e2e           # Testes E2E em projeto Next.js real
npm run test:types         # Testes de nível de tipo (tsd)

# Rode tudo antes de enviar um PR
npm run test:all
```

**Meta de cobertura:** 80%+ (ainda não configurada — veja o roadmap para ajudar a implementar).

---

## Processo de Pull Request

1. **Fork** o repositório
2. **Crie uma branch**: `git checkout -b feat/minha-feature`
3. **Faça as alterações** com commits claros e atômicos (veja convenção abaixo)
4. **Rode os testes**: `npm run test:all`
5. **Push** para seu fork: `git push origin feat/minha-feature`
6. **Abra um Pull Request** com título e descrição claros
7. **Responda aos feedbacks** se houver — o PR será revisado assim que possível

---

## Diretrizes para Pull Requests

- ✅ Mantenha PRs **pequenos e focados** — uma funcionalidade ou correção por PR
- ✅ Inclua **testes** para código novo
- ✅ Atualize a **documentação** se necessário (README, CHANGELOG)
- ✅ Garanta que **todos os testes passem** antes de solicitar revisão
- ✅ Use um **título descritivo** que siga a convenção de commits
- ❌ Evite alterações não relacionadas (formatação, refatoração sem relação com a feature)

---

## Convenção de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <descrição>
```

Exemplos reais do histórico deste projeto:

```
feat(cli): add watch mode for automatic middleware regeneration
feat(core): add auth strategies (cookie, header, jwt)
feat(utils): add glob pattern support to path-to-regex
fix(core): handle missing basePath in middleware generation
fix(utils): fix shadowed route detection for wildcard patterns
docs(readme): update auth strategy documentation
docs(changelog): add 1.1.0 release notes
refactor(cli): extract validateConfig to shared module
test(e2e): add E2E tests for header and jwt strategies
test(types): update tsd tests for new auth strategies
chore(release): bump version to 1.1.0
```

**Tipos:** `feat` | `fix` | `docs` | `refactor` | `test` | `chore` | `style`
**Escopos:** `cli`, `core`, `utils`, `types`, `template`, `e2e`, `integration`, `docs`, `release`

---

## 🗺️ Roadmap e Áreas que Precisam de Ajuda

### ✅ Status Atual (v1.1.0)

| Área | O que está implementado |
|---|---|
| Proteção de Rotas | `public`, `private`, `public-only`, catch-all `[[...slug]]` |
| Estratégias de Auth | `cookie`, `header`, `jwt` |
| Padrões de Rota | `[param]`, `[...slug]`, `[[...slug]]`, `*`, `**`, `:param` |
| CLI | `init`, `build`, `validate`, `dev` (modo watch) |
| Validação | Validação runtime de config, detecção de rotas sombreadas |
| Testes | 97 testes: 64 unit, 20 integração, 13 E2E, ~20 tipo (tsd) |
| Next.js | 14 / 15 / 16+, detecção automática de base path |
| CI/CD | GitHub Actions (Node 18, 20, 22), auto-publish em tags |
| Docs | README (EN/PT-BR), CHANGELOG |

---

### 🔧 Curto Prazo — Alto Impacto, Baixo Esforço

Ótimo para primeiras contribuições. Cada item pode ser feito independentemente.

| Área | O que | Por quê | Arquivos |
|---|---|---|---|
| **Lint & Format** | Adicionar ESLint + Prettier | Padronizar estilo de código | `package.json`, novos config files |
| **Cobertura** | Configurar `vitest --coverage` | Meta: 80%+, identificar caminhos não testados | `package.json`, `vitest.config.ts` |
| **Pages Router** | Suportar diretório `/pages` | Nem todo projeto usa App Router | `src/utils/detect-base-path.ts` |
| **Mais Exemplos** | Exemplos com JWT e header | Ajudar usuários a adotar novas estratégias | `examples/` |
| **Templates Customizados** | Permitir templates fornecidos pelo usuário | Usuários avançados precisam de flexibilidade | `src/template/config.ts`, `src/cli/init.ts` |
| **Modo Verboso** | Adicionar `--verbose` nos comandos CLI | Depurar problemas de configuração | `src/cli/*.ts` |
| **Casos de Borda** | Rotas vazias, trailing slashes | Melhorar robustez | `src/utils/normalize-routes.ts` |

---

### 🚀 Médio Prazo — Funcionalidades Relevantes

Exigem conhecimento mais profundo do código. Abra uma discussão primeiro.

| Área | O que | Por quê |
|---|---|---|
| **RBAC** | Controle de acesso baseado em papéis por rota | Esteve no v0.0.5 mas foi removido |
| **Redirect por Rota** | Sobrescrever redirects por rota | Páginas diferentes → URLs de login diferentes |
| **Sistema de Plugins** | Providers de auth e hooks customizados | Integrações de terceiros (Auth0, Clerk, NextAuth) |
| **Site de Documentação** | VitePress ou Docusaurus | README é limitado para usos avançados |
| **JSON Schema** | Schema para `proxy.config.ts` | Autocomplete na IDE sem importar tipos |
| **Benchmarks** | Performance vs middleware manual | Provar que o código gerado é eficiente |

---

### 🌟 Longo Prazo — Visão do Projeto

| Área | O que |
|---|---|
| **Rate Limiting** | Middleware de limite de taxa integrado |
| **Modo Debug** | Flag `--debug` com logs estruturados |
| **Extensão VS Code** | Syntax highlighting + validação para `proxy.config.ts` |
| **Interface Web** | Editor visual de configuração |
| **Docker Dev** | Ambiente de desenvolvimento containerizado |
| **Middleware i18n** | Redirects com consciência de localidade |
| **Monorepo** | Dividir em pacotes `core`, `cli`, `plugin-*` |

---

## Dúvidas?

- Abra uma [discussão](https://github.com/Victorcassiano/next-proxy/discussions)
- Crie uma [issue](https://github.com/Victorcassiano/next-proxy/issues)
- Entre em contato com o mantenedor através do perfil GitHub do repositório

---

## Agradecimentos

Todo contribuidor que dedica tempo para melhorar este projeto é profundamente apreciado.  
Se você está lendo isso — **muito obrigado** ❤️
