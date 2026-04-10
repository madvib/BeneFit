# Agent Instructions for the BeneFit Monorepo

## Overview

AI-native fitness app. TypeScript monorepo managed with **pnpm** + **Nx**. Cloudflare Workers as deployment target.

### Architecture

```
apps/
  gateway/              Hono API gateway (Cloudflare Worker)
  web/                  TanStack Start + React frontend (Cloudflare Pages via Vite)
  actors/
    user-hub/           Durable Object — per-user state (SQLite), facade pattern
    workout-session/    Durable Object — live workout tracking
  services/
    ai/                 AI service (Cloudflare Workers AI, Anthropic, OpenAI)
    event-bus/          Queue-based event bus (stub)
    integrations/       Strava OAuth + sync
    discovery-index/    Content discovery (stub)

packages/
  domain/
    training/core/      Training entities, value objects, factories
    training/application/ Use cases (plan generation, workouts, profile)
    coach/              Coach conversation aggregate, check-ins, AI coaching
    integrations/       Connected services, sync
  shared/               Result pattern, base classes, domain types
  react-api-client/     Typed React hooks (Hono RPC client), MSW handlers
  persistence/          D1 migrations, drizzle helpers
```

### Key Patterns

- **DDD**: Entities, VOs, aggregates with Zod schemas + `.brand<'DOMAIN'>()`
- **Result pattern**: All use cases return `Result<T>`, no thrown exceptions in domain
- **Hono RPC contract**: Gateway exports `AppType`, frontend uses `hc<AppType>` for typed client
- **Type boundary**: Frontend imports from `@bene/react-api-client` only (never domain packages directly). Hooks use `InferResponseType`/`InferRequestType` from `hono/client`
- **Auth**: better-auth with D1, Google OAuth, Strava OAuth
- **Billing**: Stripe checkout + customer portal, Resend for email

## Tech Stack

- **Package Manager**: pnpm 10.x
- **Build System**: Nx 22.x
- **Runtime**: Cloudflare Workers + Durable Objects
- **Web Framework**: TanStack Start (React 19, Vite 7)
- **API Framework**: Hono
- **Database**: D1 (auth), DO SQLite (per-user data)
- **ORM**: Drizzle
- **Validation**: Zod 4.x
- **Testing**: Vitest (unit/integration), Playwright (e2e)
- **Styling**: Tailwind CSS 4.x

## Commands

Run from repo root:

```bash
pnpm install                          # Install deps
pnpm dev                              # Start all dev servers
pnpm -w run test:domain               # Run domain unit tests (618 tests)
pnpm nx run @bene/gateway:test        # Run gateway API tests (29 tests)
pnpm e2e                              # Run Playwright e2e tests (17 tests)
pnpm build                            # Build all
pnpm lint                             # Lint all
pnpm typecheck                        # Typecheck all
pnpm nx affected -t test              # Test only what changed
```

## Testing

- **Domain tests**: 83 test files, 618 tests (packages/domain/*)
- **Gateway API tests**: 6 test files, 29 tests using Hono `app.request()` with mocked DOs
- **Actor tests**: 15 test files using `@cloudflare/vitest-pool-workers` + Miniflare
- **React hook tests**: 5 test files with MSW handlers
- **E2E tests**: 3 Playwright spec files, 17 tests (auth, dashboard, coach flows)

## Guidelines

1. **Do only what is asked.** No unsolicited refactoring or "improvements."
2. **Respect the type boundary.** Frontend → `@bene/react-api-client` → Hono RPC types. Never import domain packages in web app code.
3. **Run tests before committing.** `pnpm -w run test:domain` must pass.
4. **Small, targeted changes.** Avoid 400+ file commits.
5. **No eslint-disable.** Fix the issue or document why you can't.
6. **Use Nx for tasks.** `nx run`, `nx run-many`, `nx affected` — not raw tool commands.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks, always prefer running through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`)
- Use the `nx_workspace` tool to understand workspace architecture
- Use `nx_project_details` to analyze specific project structure and dependencies
- Use `nx_docs` for configuration questions instead of assuming

<!-- nx configuration end-->
