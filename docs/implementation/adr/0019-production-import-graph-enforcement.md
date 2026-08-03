---
id: ADR-0019
title: Enforce the dependency graph against production bare-specifier imports
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0019: Enforce the dependency graph against production bare-specifier imports

## Status

Accepted

## Context

Engineering Rule 2 encodes the frozen constitutional dependency graph as dependency-cruiser
rules whose `to` matchers target a workspace source path (`^packages/<pkg>/`) or the
slash-wrapped node_modules path (`/@openlance/aios-<pkg>/`). A Principal Architect audit proved
those rules fired for relative cross-package imports but **not** for the bare workspace
specifiers (`@openlance/aios-*`) the entire codebase actually uses.

Root cause (the exact resolution pipeline): dependency-cruiser was configured with
`tsConfig.fileName: 'tsconfig.base.json'`, which has no `paths` and uses `moduleResolution:
NodeNext`. A bare `import '@openlance/aios-errors'` was therefore resolved through node/exports
resolution to the package's `exports["."].import` target, `./dist/index.js` (or left unresolved
when `dist` was absent at cruise time). Either outcome defeats the rules: the config excludes
`dist/` (the graph is a property of source, not build output), so a `dist` target is dropped;
and an unresolved specifier stays the bare string `@openlance/aios-errors`, which matches neither
`^packages/errors/` nor the slash-wrapped `/@openlance/aios-errors/`. With no `packages/<pkg>/`
edge recorded, `no-circular`, `substrate-layer-*`, `namespace-*`, and `substrate-not-to-namespace`
never fired. A relative `../../errors/src/index` resolved straight to `packages/errors/src/index.ts`,
matched `^packages/errors/`, and fired -- which is why the gap was invisible: enforcement worked
for the one import style the codebase never uses.

Concretely proven: appending `import '@openlance/aios-errors'` to the kernel barrel (a layer
inversion and a cycle) produced `no dependency violations found`, exit 0.

## Decision

Resolve bare workspace specifiers, in dependency-cruiser only, to each package's **source barrel**,
via a dedicated `tsconfig.depcruise.json`:

```jsonc
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@openlance/aios-*": ["packages/*/src/index.ts", "packages/namespaces/*/src/index.ts"] }
  }
}
```

`.dependency-cruiser.cjs` points `options.tsConfig.fileName` at this file. With it, `@openlance/aios-errors`
resolves to `packages/errors/src/index.ts`, so every Rule 2 matcher fires against the production
bare-import syntax exactly as it already did for relative imports. This is a cruiser-only config; it
does not participate in compilation, so production module resolution and the tsup-build + per-package
`tsc --noEmit` strategy (ADR-0016) are unchanged. Resolving to source (not `dist`) is deliberate:
the dependency graph is a property of source, matching the source-derived graph snapshot (Rule 2)
and keeping build output out of the cruise.

A permanent architectural regression suite (`scripts/arch-regression.mjs`, wired into `validate`
and CI) constructs each forbidden and each legal scenario using production bare specifiers and
asserts the exact rule fires (or that a legal import passes), so this gap cannot silently return.

## Rationale

The fix is at the resolver level (the true root cause), not a symptom patch. It makes the cruiser
resolve bare specifiers the way a source-aware TypeScript project would, which is what the rules
were always written to match. It is isolated to a single new config file plus a one-line pointer
change, touches no package manifest, no public surface, and no production build behavior.

## Consequences

- Rule 2 now hard-rejects forbidden **production** imports (layer inversion, cycle,
  substrate -> namespace, illegal inter-namespace edge) in addition to relative and deep imports.
- The resolved cross-package edge count rises (previously-dropped edges are now counted); the legal
  graph remains at zero violations.
- Once namespace packages gain source, their bare inter-namespace imports resolve through the same
  `paths` and are enforced with no further change.
- A new architectural rule must add its own regression scenarios (see the Constitutional Rule in
  ENGINEERING-RULES.md).

## Alternatives considered and rejected

- **Add `paths` to the shared `tsconfig.base.json`.** Rejected: it would change production `tsc`
  resolution for every package to source, contradicting ADR-0016's build-then-typecheck strategy.
- **Add a `source`/`development` export condition to every package.json and prepend it to the
  cruiser's `conditionNames`.** Rejected: it edits 21+ package manifests and the scaffold template
  for a cruiser-only concern, a larger and manifest-touching surface than a single cruiser config.
- **Stop excluding `dist/` so bare specifiers resolve to the built bundle.** Rejected: it would
  cruise the tsup bundle (which re-exports workspace specifiers), reintroduce orphan noise, and make
  the graph a property of build output rather than source.

## Tradeoffs

`tsconfig.depcruise.json` is a second, cruiser-only TypeScript config to keep in step with the base
config (mitigated by `extends`). The regression suite mutates the working tree transiently (probe
files under real package `src/`) and must run as its own step, never concurrently with build/test;
it restores the tree unconditionally.

## Related constitutional references

None. This is an engineering enforcement-tooling decision; it realizes no constitutional concept and
changes no constitutional ownership. It makes the enforcement of the frozen `ai/architecture/dependency-map.md`
correct against production syntax.

## Related ADRs

Relates to ADR-0016 (realized compilation strategy, unchanged by this decision) and to Engineering
Rule 2 (Dependency Graph Enforcement) and the Constitutional Rule (Production Import Enforcement).
