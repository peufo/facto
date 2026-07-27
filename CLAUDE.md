# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Facto is a prototype "Universal Process Graph" engine — a generic modeling core for ERP/MES/PLM (industrial processes) where machines, parts, orders, and invoices are all represented by the same graph-relational primitive instead of domain-specific tables. It is early-stage / brainstorming-phase (see `doc/roadmap.md` for current priorities and `readme.md` for the full data-model spec — read both before making architectural changes).

Stack: SvelteKit 5 (Svelte 5 runes) + TypeScript, Prisma 7 against MariaDB/MySQL via `@prisma/adapter-mariadb`, Zod 4 for all validation, Tailwind 4 + DaisyUI.

## Commands

Package manager is pnpm (see `pnpm-workspace.yaml`, `.npmrc`).

- `pnpm dev` — start the dev server. Requires `DATABASE_URL` in `.env` (MariaDB/MySQL) and migrations applied — see `.env.example`.
- `pnpm build` / `pnpm preview` — production build / preview.
- `pnpm check` — `svelte-kit sync` + `svelte-check` (type checking). Use this, not raw `tsc`.
- `pnpm lint` — `prettier --check .` + `eslint .`. `pnpm format` applies prettier fixes.
- `pnpm test` — runs vitest once (`vitest --run`). `pnpm test:unit` runs vitest in watch mode. To target one file: `pnpm test -- path/to/file.test.ts`. No test files exist yet (vitest is configured — `src/**/*.{test,spec}.{js,ts}` — but unused).
- `pnpm migrate` — `prisma migrate dev` (create/apply a migration in dev).
- `pnpm generate` — `prisma generate` (regenerate the Prisma client; needed after editing `prisma/schema.prisma`).
- `pnpm seed` — `prisma db seed`, runs `prisma/seed.ts`, which calls `system.seed()` to upsert every module's `Attribute` definitions into the DB. Re-run after adding/changing attributes in a module.
- `pnpm studio` — Prisma Studio.
- `pnpm reset-hard` — **destructive**: deletes `prisma/migrations`, resets the DB, re-migrates, regenerates, kills tsserver. Only run this if the user explicitly asks for a full reset.
- `postinstall` runs `prisma migrate deploy && prisma generate` automatically.

## Architecture

### Core data model (see `readme.md` for full spec, `prisma/schema.prisma` for the schema)

Everything is one of four primitives:
- **Process** — a stable identity (a machine, an order, an operator...).
- **Commit** — an immutable event on a Process: `changes` (JSON delta) + optional cached `snapshot` (JSON, the reconstructed state).
- **Connection** — a typed graph edge between two Commits (`fromId`/`toId`), typed by an `attributeKey`. Replaces foreign keys.
- **Attribute** — the global semantic dictionary. Every key used anywhere in the system is registered here with an `AttributeType` (the Prisma enum) that dictates how the engine treats it.

`AttributeType` splits into two categories that behave completely differently:
- **Scalar types** (`LENGTH`, `MASS`, `TIME`, `TEMPERATURE`, `PRESSURE`, `SPEED`, `CURRENCY`, `COUNT`, `CUSTOM`) — stored inline in `Commit.changes`.
- **Structural types** (`DEPENDENCY`, `REFERENCE`) — stored as `Connection` edges instead. `DEPENDENCY` means composition/fusion: the engine merges the target's snapshot into the parent's, prefixed by the attribute key (or an explicit `namespace`). `REFERENCE` means a weak pointer: only the target id is stored, no fusion.

Important semantic detail: a `DEPENDENCY` connection points to a specific **Commit**, not to "whatever the Process currently is" — composition is pinned at commit time (like a Git submodule pin), not live-following. This matters a lot for anything modeling high-frequency/live data.

### Module & attribute system (`src/lib/modules/`)

Modules (`defineModule` in `src/lib/modules/defineModule.ts`) declare a namespaced set of attributes (`moduleId:attributeName`), each validated against `AttributeType` via three parallel Zod maps in that file (`parserValue`, `parserUnit`, `options`), enforced at compile time with `satisfies Record<AttributeType, ZodType>`. **Adding a new `AttributeType` to the Prisma enum requires updating all three maps** or the build breaks (by design). Existing modules: `core` (`src/lib/modules/core`) and `location` (`src/lib/modules/location`, spatial position/dimension/parent attributes). Register a module by adding it to the `modules` array in `src/lib/server/system.ts`, then run `pnpm seed`.

### Snapshot/fusion engine (`src/lib/server/system.ts`)

`createSystem(modules)` builds the runtime `system` singleton (exported from `src/lib/server/system.ts`). Key functions:
- `createCommit` — validates `changes` against each attribute's Zod schema, creates the `Commit`, and creates incoming `Connection`s for any `DEPENDENCY` values.
- `computeSnapshot` — lazily and recursively reconstructs a Commit's `snapshot` by walking its `DEPENDENCY` changes and merging child snapshots (recursing via `computeSnapshot` on the dependency's target Commit). `REFERENCE` resolution is **not implemented yet** (stubbed with a `console.warn`). No batching — one DB round-trip per dependency, sequential.
- `saveSnapshot` — persists the computed snapshot back onto the Commit (the cache is otherwise never invalidated; Commits are immutable so this is safe as long as "update" always means "create a new Commit").

### Server & API layer

- `src/lib/server/db/index.ts` — singleton Prisma client using the MariaDB driver adapter (not the default Prisma engine).
- `src/routes/+page.server.ts` — SvelteKit form actions (`process_create`, `commit_create`, `commit_snapshot`, `commit_snapshot_delete`) built with `formAction` from the `fuma` package.
- `src/routes/api/+server.ts` — a single generic `/api?resource=...` GET endpoint, typed end-to-end via the `API` type map in `src/lib/api.ts`; add a new resource by adding an entry to both `apiServer` (server) and `API` (client type).
- The current UI (`src/routes/Process.svelte`, `Processes.svelte`, `Hierarchy.svelte`) is a raw debug/admin view (JSON dumps, manual snapshot compute/save buttons), not a product UI.

### Frontend conventions

- Svelte 5 runes throughout (`$state`, `$derived`, `$props`) — see `src/lib/components/map/view.svelte.ts` for a class-based runes pattern.
- `devalue` (not `JSON.stringify`) is used to serialize richer values (e.g. Dates) between server and client — see `src/routes/api/+server.ts` and `src/lib/api.ts`.
- `fuma` (external package) provides shared form/query-string/URL-state helpers (`useForm`, `urlParam`, `parseQuery`, `formAction`, `tip`) used across routes — check its usage in existing routes before reinventing form or query-param handling.

### Map/visualization subsystem (`src/lib/components/map/`)

A pan/zoom 2D scene system with **two parallel renderer backends** — Canvas (`map/canvas/`) and SVG (`map/svg/`) — sharing the same `View` state class (`view.svelte.ts`). Not yet wired to real `Process`/`Commit` data (this is the current top priority per `doc/roadmap.md`); intended to render Processes spatially using the `location` module's `position_x`/`position_y`/`dimension_x`/`dimension_y`/`parent` attributes.
