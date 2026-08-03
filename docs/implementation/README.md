# Phase 2A, Repository & Framework · Design Package

**Status:** Built. The Phase 2A substrate is implemented and green (with the post-audit hardening pass applied); the 13 AI namespace packages are reserved, not implemented.
**Cadence:** All subsystem designs first → one approval → build in dependency order.

This directory holds the complete Phase 2A engineering design. It builds the **substrate beneath the 14 frozen AI namespaces** and implements **none** of their behavior. The constitutional documents under `ai/` and `knowledge/` are immutable specifications; this design conforms to them and never redesigns, merges, or reinterprets them.

## Locked platform decisions

| Dimension | Decision |
|---|---|
| Language / runtime | TypeScript (strict, ESM) on Node.js LTS |
| Framework posture | Custom, framework-neutral core (no framework inside packages) |
| Monorepo + tasks | pnpm workspaces + Turborepo |
| Compilation | `tsup` bundle + rolled-up `.d.ts`, with per-package `tsc --noEmit` type checking under Turborepo build ordering (ADR-0016; `composite` remains available, but a `tsc -b` reference graph is not wired in Phase 2A) |
| Tests | Vitest |
| Boundary enforcement | dependency-cruiser (encodes the frozen dependency graph) |
| Lint / format / docs / codegen | ESLint (flat) · Prettier · TypeDoc · Plop |
| Versioning | Changesets; package MAJOR tied to constitutional generation |

## Design documents

| # | Subsystem | Doc |
|---|---|---|
| 00 | Repository Architecture | [00-repository-architecture.md](00-repository-architecture.md) |
| 01 | Core Framework (kernel) | [01-core-framework.md](01-core-framework.md) |
| 02 | Error Framework | [02-error-framework.md](02-error-framework.md) |
| 03 | Dependency Injection | [03-dependency-injection.md](03-dependency-injection.md) |
| 04 | Configuration System | [04-configuration.md](04-configuration.md) |
| 05 | Logging Framework | [05-logging.md](05-logging.md) |
| 06 | Event Framework | [06-event-framework.md](06-event-framework.md) |
| 07 | Plugin Framework | [07-plugin-framework.md](07-plugin-framework.md) |
| 08 | Testing Infrastructure | [08-testing-infrastructure.md](08-testing-infrastructure.md) |
| 09 | Build & Dev Infrastructure | [09-build-dev-infrastructure.md](09-build-dev-infrastructure.md) |

> Note: the task lists Error Framework as subsystem 6; in this package it is documented at 02 because it is foundational (errors precede DI in the dependency order). The subsystem identity is unchanged.

## Engineering governance (permanent implementation rules)

Six permanent implementation-governance rules bind every package and every later phase. They add no AI concept, no business logic, and no runtime behavior; they keep implementation aligned with the immutable constitution.

| | Governance document |
|---|---|
| Rules 1 to 6 | [ENGINEERING-RULES.md](ENGINEERING-RULES.md) (Public API Boundary · Dependency Graph Enforcement · ADR · Stability Classification · Performance Baseline · Definition of Done) |
| Definition of Done | [DEFINITION-OF-DONE.md](DEFINITION-OF-DONE.md) (Rule 6, the twelve mandatory completion gates) |
| Decisions | [adr/](adr/) (Architecture Decision Records: process, template, and the accepted decisions) |

Summary: (1) each package exposes exactly one barrel; deep imports are prohibited and CI-blocked. (2) the frozen dependency graph is enforced by dependency-cruiser as a non-overridable required check. (3) every non-constitutional engineering decision is an immutable ADR that never redefines constitutional ownership. (4) every package carries a stability class that sets its review bar. (5) every subsystem defines observational performance baselines that become regression gates in later phases. (6) nothing is complete until it passes all twelve Definition-of-Done gates, enforced in CI and non-overridable.

## Package map (substrate, Phase 2A builds these)

```
@openlance/aios-kernel     primitives, Result/Option, Clock/Id seams
@openlance/aios-errors     error hierarchy, Result helpers
@openlance/aios-di         container, lifetimes, modules, startup validation
@openlance/aios-config     providers, env, typed+validated config, secrets
@openlance/aios-logging    structured logging, correlation, tracing, sinks
@openlance/aios-events     event contracts, in-process bus, subscriptions
@openlance/aios-plugins    module discovery, registration, compat, lifecycle
@openlance/aios-testing    unit+integration harness, mocks, fixtures
```

## Reserved namespace packages (Phase 2A does NOT build)

One package per frozen namespace, names reserved and dependency edges pre-declared to match `ai/architecture/dependency-map.md`:
`@openlance/aios-governance · -runtime · -retrieval · -reasoning · -memory · -prompts · -agents · -safety · -providers · -tools · -evaluation · -operations · -evolution`.
Phase 2A writes zero namespace behavior; it only reserves names and encodes the enforced graph.

## Global dependency direction (strictly acyclic)

```
kernel ─▶ errors ─▶ di ─▶ config ─▶ logging ─▶ events ─▶ plugins
testing ─▶ kernel, errors            (dev-only on the rest)
apps/dev-harness ─▶ di, config, logging, events, plugins   (composition root; deferred to Runtime, ADR-0017)
```

Every edge points toward a more-foundational package. This mirrors the shape of the frozen AI dependency graph and is enforced in CI.

## Build order

`kernel → errors → di → config → logging → events → plugins`; `testing` is developed alongside every package; `build/dev infra` brackets the work, and `dev-harness` is deferred to the Runtime phase (ADR-0017).

## Cross-cutting conventions (apply to every package)

- **Determinism seams.** No ambient `Date.now()`/`Math.random()`/`process.env` reads inside packages. Time comes from `Clock`, ids from `IdGenerator`, environment from `ConfigProvider`, all injected. This realizes the constitution's determinism mandate in code.
- **Result over throw.** Expected/domain failures return `Result<T, E>`; only unrecoverable infrastructure faults throw.
- **One public surface.** Each package exposes exactly one barrel (`src/index.ts`); deep imports are forbidden and CI-enforced.
- **No constitutional ownership in substrate.** Framework packages own only engineering concerns; none owns a namespace concept.
- **Traceability, not duplication.** Where a package realizes a constitutional invariant, it references the frozen doc `id` in a comment; it never restates constitutional text.

## Phase-2A global acceptance criteria

Deterministic monorepo build; every package independently unit-tested; package graph acyclic and CI-enforced against the frozen map; DI complete (all lifetimes + registration + startup validation); config centralized/typed/validated/secret-abstracted; logging vendor-abstracted; errors standardized (hierarchy + Result); events standardized (in-process bus); plugin discovery/registration/compat/lifecycle working; zero AI behavior; zero forbidden technology; zero constitutional ownership moved/merged/duplicated.

Additionally, the six engineering-governance rules are satisfied: (1) every package has a single barrel and no deep import passes CI; (2) the dependency graph is enforced against the frozen map as a non-overridable check; (3) every non-constitutional decision is an Accepted ADR; (4) every package declares a stability class matching the authoritative table; (5) every subsystem has defined, reproducible performance baselines ready to gate later phases; (6) every package, subsystem, milestone, and phase passes all twelve Definition-of-Done gates before it is considered complete. See [ENGINEERING-RULES.md](ENGINEERING-RULES.md) and [DEFINITION-OF-DONE.md](DEFINITION-OF-DONE.md).
