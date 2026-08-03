# OpenLance AI Growth OS

A constitutional AI Operating System: an immutable specification layer, plus an engineering implementation that conforms to it exactly.

## Layers

- **`knowledge/`** and **`ai/`** are the frozen constitutional architecture (255 documents). They are immutable specifications and are never modified by implementation work.
- **`docs/implementation/`** is the approved implementation design and the permanent engineering governance (six rules and the Definition of Done).
- **`packages/`, `apps/`, `tools/`** are the implementation: a TypeScript monorepo whose package graph mirrors the frozen dependency map.

## Implementation status

Phase 2A (Repository and Framework) implements the engineering substrate only (dependency injection, configuration, logging, errors, events, plugins, testing, build); it implements no AI behavior. The 13 AI namespace packages are reserved and graphed but not implemented.

## Toolchain

TypeScript (strict, ESM) on Node.js, pnpm workspaces, Turborepo, Vitest, ESLint, Prettier, dependency-cruiser, TypeDoc, Changesets. See [docs/implementation/](docs/implementation/).

## Working in this repository

```
pnpm install                 # install the workspace
pnpm run validate            # typecheck, lint, format, depcruise, arch:check, graph snapshot, docs-check, test, bench, docs, build
pnpm run scaffold            # generate a new package or reserved namespace package
```

Implementation must never modify any document under `ai/` or `knowledge/`. The dependency graph, public API boundaries, stability classes, performance baselines, and Definition of Done are enforced automatically in CI and cannot be manually overridden. See [docs/implementation/ENGINEERING-RULES.md](docs/implementation/ENGINEERING-RULES.md).
