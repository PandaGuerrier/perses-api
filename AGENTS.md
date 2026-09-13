# Agent instructions

## Meta-rule

**ALWAYS look for the existing pattern before writing anything new.** This repo is highly consistent; new code should mirror the closest existing example, not invent shape. Search first, code second.

## Scope

- **Minimal diff.** Prefer the smallest change that satisfies the request — don't refactor unrelated code, rename identifiers "on the way", or restructure imports beyond the diff.
- If the task drifts, ask before expanding scope.

## Stack

AdonisJS 7 (session auth + Bouncer + Lucid), Inertia + React 19, Tailwind 4 + shadcn/Radix, Postgres 16, pnpm monorepo (Turbo).

## Commands

- `pnpm dev` — dev server
- `pnpm test` — full suite
- `pnpm typecheck && pnpm lint` — before saying "done"
- `pnpm infra:up` — Postgres + Mailpit via compose
- `pnpm ace <cmd>` — Adonis CLI from the repo root (shortcut for `pnpm --filter web exec node ace <cmd>`)
- `pnpm ace make:module <name> [--db] [--i18n] [--events]` — scaffold a module and wire every touchpoint (alias, preload, migration path, tsconfig include, i18n loader)

## Done criteria

Before reporting completion:

- Run `pnpm typecheck && pnpm lint`.
- Run the narrowest relevant test first (module functional spec) before falling back to `pnpm test`.
- If a required command failed to run (missing infra, no network, etc.), stop and report the failure with the relevant output — do not claim completion.

## Architecture — module per bounded context

Every bounded context lives at `app/<mod>/` as a self-contained module. A module owns the ubiquitous language of one context and may hold multiple aggregates inside — modules are **not** 1:1 with aggregates. Existing modules: `auth`, `users`, `schools`, `exam`, `dashboard`, `public`, `internal`, `common`, `core`. Each module dir is aliased as `#<mod>/*` in `apps/web/package.json` → `"imports"` — see the `module-scaffolding` skill to add one.

```
app/<module>/
  actions/            # single-purpose class with .handle(input)
  controllers/        # thin: validate → action → redirect/render
  queries/            # read-only Lucid query classes
  policies/           # extend BasePolicy, one per resource
  models/, mixins/, services/, exceptions/, enums/
  middleware/         # singular — HTTP middleware (registered in start/kernel.ts)
  transformers/
  validators/         # one file per entity — validators/users.ts, validators/tokens.ts
  database/{factories,migrations,seeders}/
  resources/lang/     # i18n JSON, per module per locale
  ui/                 # Inertia pages + React components
  mails/              # BaseMail classes — *_notification.ts (see the mail skill)
  notifications/      # Notification classes (if the module emits)
  types/events.ts     # EventsList declaration merge (if the module emits)
  start/{events,view}.ts
  routes.ts
  tests/{unit,functional}/
```

### Dependency direction

Feature modules depend only on `common`, `core`, and themselves. `core` and `common` may import `User`: that's the assumed cost of typed shared props. Don't introduce a new feature→feature dependency without adding it here first.

Sanctioned exceptions:

- `auth → users`, `auth → schools` — auth is behavior over the identity aggregate `users` owns, and the OIDC callback consumes a pending school invitation.
- `schools → users` — a school's members and its custom roles are `users` rows.
- `exam → schools`, `exam → users` — an exam belongs to a school and targets students directly.
- `dashboard → *` — the dashboard is a read-only composition over every other module.

### Roles are bundles of permissions

`super_admin`, `admin`, `teacher` and `student` are seeded rows (`is_system`, `school_uuid = null`), not an enum the code branches on — **no policy ever tests a role name**. A school admin widens what their staff can do by authoring a school-scoped custom role, which is why `teacher` ships without `exams.create`. Policies combine a capability with school membership through `sameSchool` / `scopedTo` in `app/users/policies/scope.ts`; `schools.view_any` is the super-admin's escape hatch. `GlobalPermissions` in `app/users/services/global_permissions.ts` projects the catalogue into the `can` shared prop, which gates both `useCan()` and every nav item.

### Naming is wiring

Two conventions the tooling enforces silently — get the name wrong and there's no error, just a missing entry:

- **Filename globs feed the typed registries.** `*_controller.ts` and `*_transformer.ts` are indexed by `indexEntities` into `#generated/controllers` and the shared-props types. A different suffix is silently absent from the registry.
- **Transformer variants are named `for<Screen>`** — `forList`, `forEdit`, `forProfile`, `forSharedProps` — over a `toObject()` base, consumed as `Transformer.transform(x).useVariant('forEdit')`. See `app/users/transformers/user_transformer.ts`.

## Skills — where the detailed workflows live

Detailed conventions live as agent skills in `packages/skills/`, in the [Vercel Skills](https://github.com/vercel-labs/skills) format. Install with `npx skills add ./packages/skills --agent claude-code` (or `--all`). **Prefer loading the relevant skill over guessing** — every skill has repo refs to canonical examples and external doc links. Only the invariants below need to hold when a skill isn't loaded.

**Backbone**

- `module-scaffolding` — bootstrap a new `app/<mod>/` via `node ace make:module` (wires alias + preload + migration paths + tsconfig include).
- `crud` — full stack (route → controller → validator → policy → action → transformer → Inertia page).
- `routes` — resource vs. verb routes, numeric matchers, naming.
- `queries` — read side: list queries + per-concept read models composed in the controller.
- `actions-events` — action shape (`.handle(input)`) and event-driven side effects.
- `testing` — Japa functional + unit patterns (transactions, fakes, sinon, factories).

**Frontend**

- `inertia` — page resolver, shared props, `useForm`, `urlFor`, modals, provider tree.
- `i18n` — three locales, `useTranslation()`, `ctx.i18n.t()`, `User.locale` persistence.
- `layout-shells` — four coexisting shells; pages import explicitly, no runtime toggle.

**Feature**

- `authorization` — `PERMISSIONS` + `ROLES` + `WithRoles` + Bouncer policies + `useCan()` + escalation guards.
- `mail` — `BaseMail` classes + MJML via `@email.layout` + `mailContext()`.
- `notifications` — Facteur + Transmit stack, per-user SSE channel, bell + unseen count.
- `attachment` — `@jrmc/adonis-attachment` converters + model decoration + `preComputeUrls`.
- `migrations` — starter kit convention: edit existing `create_<table>` migrations + `migration:fresh` instead of layering `alter_table`.

⚠️ Migrations run **directory by directory** in the order `config/database.ts` lists, never interleaved by timestamp. A cross-module foreign key therefore constrains that order: `schools` is created from its own `migrations_bootstrap/` path because `users.school_uuid` points at it, while the rest of the schools module points back at `users` and runs after it.

**Git**

- `git-commit` — commit types, scopes, examples, safety protocol.

## Code style

- Comments only for non-obvious WHY — a hidden constraint, subtle invariant, workaround. Don't narrate what the code does.
- Don't create README / doc files unless the user asks for them.
- Prefer editing existing files over creating new ones.

## UI layers — which to import

Two tiers, by design (not duplication):

- `@workspace/ui/*` (`packages/ui`) — **headless primitives** (shadcn/Radix): `Field`, `FieldError`, `toast`, buttons, tables. No app or Inertia knowledge.
- `#common/ui/*` — **Inertia-aware composition** that wraps the primitives: `Form`/`Field`/`FieldError` bind form errors via `FormErrorsContext` + `FieldNameContext`; `useFlashToasts` pipes Inertia flash into the primitive `toast`.

Rule: inside Inertia pages/forms import from `#common/ui`; reach for `@workspace/ui` directly only for a primitive that has no app wrapper. Add new primitives to `packages/ui`, new app-composition to `#common/ui`.

## Git — non-negotiables

Full workflow: `packages/skills/git-commit/SKILL.md`. Rules every agent must respect even without the skill loaded:

- **Never** `--no-verify`, `git push --force`, `git reset --hard`, or amend a pushed commit.
- **Never** commit or push without being asked.
