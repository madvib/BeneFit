# BeneFit <-> Ship: Cross-Project Synergy Research

## Executive Summary

BeneFit is an AI fitness coaching app built on Cloudflare Workers with a mature TypeScript/Drizzle/React stack. Ship is an agent configuration compiler and workspace manager with a Rust core and a lighter TypeScript UI layer (TanStack Start). Despite different domains, there are concrete patterns each project can adopt from the other.

**Key finding**: BeneFit's TypeScript patterns (Drizzle, Durable Object facades, TanStack Query state management, Result types) are directly applicable to Ship's growing TypeScript surface. Ship's architectural patterns (event sourcing, WASM compilation, workspace lifecycle) offer ideas BeneFit could use to improve its own state tracking and extensibility.

---

## Patterns Ship Can Adopt from BeneFit

### 1. Drizzle ORM for Ship Studio's Database Layer

**BeneFit pattern**: Uses Drizzle ORM across multiple database targets (Cloudflare D1, Durable Object SQLite, R2 metadata) with type-safe schemas, `$inferSelect`/`$inferInsert` types, and `onConflictDoUpdate` upserts.

**Ship opportunity**: Ship Studio (`apps/web/`) currently has no server-side persistence layer. As it grows beyond a single-page compiler UI into a full config management platform (auth, project storage, preset registry), it will need a database. BeneFit's Drizzle setup provides a ready template:

- **Schema organization**: BeneFit splits schemas by domain (`coach/`, `workouts/`, `integrations/`). Ship could mirror this with `presets/`, `workspaces/`, `users/`.
- **D1 integration**: Both projects deploy to Cloudflare. BeneFit already has `better-auth` wired to D1 via Drizzle—Ship has `better-auth` stubbed but no DB adapter yet.
- **Migration tooling**: BeneFit's `drizzle-config.factory.ts` generates configs per database target. Ship could reuse this for its planned D1 tables.
- **Type inference from schema**: `typeof table.$inferSelect` eliminates manual type duplication between DB and app layers—a pattern Ship's TS layer currently lacks.

**Concrete action**: Copy BeneFit's `tools/drizzle/` config factory and `packages/persistence/` structure into Ship's `packages/` for the Studio backend.

### 2. Durable Object Facade Pattern

**BeneFit pattern**: Each Durable Object (UserHub, WorkoutSession) exposes functionality through lazy-loaded `RpcTarget` facades (`CoachFacade`, `WorkoutsFacade`, `ProfileFacade`). The DO itself is a thin shell—facades own the use-case orchestration.

```
UserHub DO
  ├── .coach()     → CoachFacade (extends RpcTarget)
  ├── .workouts()  → WorkoutsFacade
  ├── .profile()   → ProfileFacade
  └── .planning()  → PlanningFacade
```

**Ship opportunity**: Ship's architecture document mentions eventual Durable Object support for persistent workspace state. When that happens, the facade pattern is directly applicable:

- **WorkspaceHub DO** could expose `sessions()`, `environment()`, `compiler()` facades
- Lazy initialization keeps cold-start cost low (only load what's needed per request)
- Type-safe RPC from gateway routes to DO methods

Even before DOs, the facade pattern works as a general code organization strategy for Ship's MCP tool handlers, which currently live in a flat `server.rs`. Grouping tools into logical facades (WorkspaceFacade, SessionFacade, PlanningFacade) would improve maintainability.

### 3. TanStack Query State Management Patterns

**BeneFit pattern**: Structured query key factories, mutation hooks with targeted cache invalidation, and a clean provider hierarchy.

```typescript
// BeneFit's query key factory pattern
export const coachKeys = {
  all: ['coach'] as const,
  summary: (userId: string) => [...coachKeys.all, userId, 'summary'] as const,
  history: () => [...coachKeys.all, 'history'] as const,
} as const;

// Mutations invalidate specific query keys
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: coachKeys.history() });
}
```

**Ship opportunity**: Ship Studio uses TanStack Query but in a minimal way. As it adds features (preset browsing, workspace management, compilation history), it needs the same patterns:

- **Query key factories** for `presets`, `workspaces`, `compilations`, `skills`
- **Optimistic updates** when editing presets (compile in background, show result immediately)
- **Cache invalidation** after compilation (invalidate provider-specific outputs)
- **Retry logic**: BeneFit's query client skips retries on 401s—Ship should do the same for auth failures

**Concrete action**: Create a `packages/react-api-client/` in Ship mirroring BeneFit's hook structure, with query key factories per domain.

### 4. Result Type / Railway-Oriented Error Handling

**BeneFit pattern**: Uses a `Result<T>` monad throughout the domain and application layers:

```typescript
export class Result<T> {
  static ok(value: T): Result<T>
  static fail(error: Error): Result<never>
  isSuccess: boolean
  value: T
  error: Error
}
```

**Ship opportunity**: Ship's TypeScript layer currently uses `try/catch` with loose error typing. The `useCompiler` hook catches errors as `e instanceof Error ? e.message : String(e)`—no structured error types. Adopting Result types would:

- Make WASM compilation errors typed and recoverable
- Enable chaining: `loadWasm().andThen(compile).andThen(write)`
- Align with the Rust core's `Result<T, E>` pattern (developers think the same way in both languages)

### 5. Zod Validation at API Boundaries

**BeneFit pattern**: Hono routes validate with `zValidator('json', Schema)`, and request/response contracts use Zod schemas throughout.

**Ship opportunity**: Ship Studio's server functions (TanStack Start) have no input validation yet. As it adds API routes for preset management and GitHub import, Zod validation prevents bad data from reaching the compiler or database.

### 6. Use Case Pattern for Business Logic

**BeneFit pattern**: `BaseUseCase<TRequest, TResponse>` abstract class encapsulates each business operation with typed input/output and Result-based error handling.

**Ship opportunity**: Ship's MCP tool handlers mix business logic with I/O. Extracting use cases would make the logic testable and reusable across MCP tools *and* the Studio web UI.

---

## Patterns BeneFit Can Adopt from Ship

### 1. Event Sourcing / Append-Only Audit Trail

**Ship pattern**: All state changes are recorded as immutable events in an append-only log (`.ship/events.ndjson`). Current state is derived from the event stream. Drift detection works by diffing event versions.

**BeneFit opportunity**: The coaching domain would benefit enormously from event sourcing:

- **Coaching conversation history** is already partially event-like (messages are appended), but mutations to `coaching_conversation` metadata are destructive updates
- **Workout plan adjustments** made by the AI coach could be tracked as events, enabling "undo" and audit trails
- **Integration sync** could use events to track what was synced, when, and what changed

An append-only `coach_events` table in the UserHub DO SQLite would give BeneFit a complete audit trail of all AI coaching actions, useful for debugging AI behavior and building user-facing "what changed and why" views.

### 2. WASM for Shared Logic

**Ship pattern**: The compiler runs identically in the browser (Ship Studio) and on the server/CLI (native binary or WASM). One Rust codebase, multiple deployment targets.

**BeneFit opportunity**: BeneFit's AI prompt construction, fitness plan validation, and workout scoring logic currently live in TypeScript packages. If any of this becomes computationally expensive or needs to run offline (e.g., in a future mobile app), compiling shared logic to WASM provides:

- Identical behavior across web, worker, and potential native clients
- Performance gains for complex calculations (plan optimization, periodization math)
- A single source of truth for domain rules

This is a longer-term opportunity, but Ship's `crates/core/compiler` + `packages/compiler` (WASM bridge) provides a working reference.

### 3. Workspace / Session Lifecycle Model

**Ship pattern**: Workspaces have explicit lifecycles (created → active → completed/abandoned) with branch binding and session tracking. Each session has a goal, progress log, and handoff document.

**BeneFit opportunity**: BeneFit's coaching sessions are implicit—a conversation exists or it doesn't. Adding explicit session lifecycle would enable:

- **Goal-oriented coaching blocks**: "This week's focus is improving squat form" as a workspace-like session
- **Session summaries**: Auto-generated handoff when a coaching topic concludes
- **Progress tracking**: Append-only progress log within a coaching session

### 4. Multi-Provider / Multi-Target Compilation

**Ship pattern**: One configuration compiles to multiple provider formats (CLAUDE.md, GEMINI.md, .mcp.json, etc.).

**BeneFit opportunity**: BeneFit already has multi-provider AI support (Anthropic, OpenAI, Cloudflare AI). But the AI system prompts and coaching strategies are currently provider-agnostic strings. A compilation step that optimizes prompts per provider (e.g., using Claude's XML tag preferences vs. GPT's markdown preferences) could improve coaching quality.

### 5. Preset / Configuration System

**Ship pattern**: Declarative presets in TOML + Markdown define complete agent configurations. `ship use <preset>` activates everything at once.

**BeneFit opportunity**: BeneFit could use a similar pattern for coaching presets:
- **Beginner preset**: conservative progression, frequent check-ins, detailed explanations
- **Advanced preset**: aggressive periodization, minimal check-ins, data-focused
- **Rehabilitation preset**: strict form emphasis, limited intensity, medical integration

Currently these behaviors are hardcoded in prompt templates. Making them declarative presets would let users customize their coaching experience.

---

## Shared Infrastructure Opportunities

### 1. Better Auth Setup
Both projects use `better-auth` for authentication. BeneFit has a working D1 + Drizzle integration; Ship has the library installed but not fully configured. Ship can directly reference BeneFit's auth setup.

### 2. TanStack Start + Cloudflare Workers
Both deploy React apps to Cloudflare via TanStack Start. Sharing deployment configs, vite plugins, and worker bindings would reduce duplication.

### 3. UI Component Library
Ship's `@ship/primitives` package has rich components (Markdown editor, file tree, prompt input) that BeneFit could use for its coaching chat interface. Conversely, BeneFit likely has fitness-specific UI components (progress charts, workout cards) that demonstrate patterns Ship's UI could adopt.

### 4. MCP Server Integration
Ship builds MCP servers for agent tooling. BeneFit could expose its coaching API as an MCP server, letting AI agents interact with the coaching system directly. Ship's `mcp-framework` crate provides the lifecycle model.

---

## Priority Recommendations

| Priority | Action | From → To | Effort |
|----------|--------|-----------|--------|
| **High** | Adopt Drizzle ORM for Ship Studio backend | BeneFit → Ship | Medium |
| **High** | Adopt query key factory pattern | BeneFit → Ship | Low |
| **High** | Add Result types to Ship TS layer | BeneFit → Ship | Low |
| **Medium** | Add event sourcing to coaching domain | Ship → BeneFit | Medium |
| **Medium** | Share better-auth D1 integration | BeneFit → Ship | Low |
| **Medium** | Adopt Zod validation on Ship API routes | BeneFit → Ship | Low |
| **Medium** | Extract use cases from Ship MCP handlers | BeneFit → Ship | Medium |
| **Low** | DO facade pattern for Ship (when DOs added) | BeneFit → Ship | Medium |
| **Low** | WASM for BeneFit shared logic | Ship → BeneFit | High |
| **Low** | Coaching presets system | Ship → BeneFit | Medium |
