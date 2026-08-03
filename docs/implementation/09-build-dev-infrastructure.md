# Subsystem 09, Build & Development Infrastructure

> **Classification:** Engineering tooling. Owns no AI concept. Its one constitutional tie is that it **enforces** `ai/architecture/dependency-map.md` in CI, realizing an existing property, never inventing one.

## 1. Architectural analysis

The build system makes the whole repository deterministic, boundary-safe, and reproducible, and it is the guardian that keeps implementation honest against the constitution: dependency-cruiser encodes the frozen dependency graph so any cyclic or cross-boundary import fails CI before merge. Builds are content-hash cached and run on a pinned toolchain so the same inputs yield the same outputs.

## 2. Package/tooling design

Not a runtime package. Delivered as repo-root config plus two `tools/*` config packages:
- `tools/tsconfig`, shared `tsconfig.base.json` (strict, composite, ESM, project references).
- `tools/eslint-config`, flat ESLint config (strict TS rules, import boundaries, barrel-only, banned globals `Date.now`/`Math.random`/`process.env` outside sanctioned edges).
- Root: `turbo.json`, `.dependency-cruiser.cjs`, `.prettierrc`, `vitest.config.ts`, `.changeset/`, `.github/workflows/ci.yml`, `tools/scaffold` (Plop).

## 3. Interface design (pipeline contracts)

```
turbo tasks (each cached by content hash) + repo-level gates:
  build      -> tsup (bundle + rolled-up .d.ts via tsconfig.build.json)   depends on ^build
  typecheck  -> tsc --noEmit (per package; ordered by ^build; ADR-0016)
  test       -> vitest run --coverage (all of src, 100 thresholds; ADR-0015)
  bench      -> vitest bench --run (Rule 5, record-only)
  docs       -> typedoc --out docs-api
  lint       -> eslint (//#lint root task)
  depcruise  -> dependency-cruiser (fails on cycle / boundary / deep-import; //#depcruise)
  graph:check-> resolved package-graph snapshot diff (Rule 2; scripts/graph-snapshot.mjs)
  docs-check -> ADR + metadata + stability + constitution-id + README + .only/.skip (Rules 3/4; scripts/docs-check.mjs)

dependency-cruiser ruleset (conceptual):
  - no-circular                     (severity: error)
  - substrate-layering              kernel<errors<di<config<logging<events<plugins
  - namespace-graph                 edges mirror ai/architecture/dependency-map.md
  - not-to-deep-import              only package barrels may be imported; covers packages/<pkg>/src and packages/namespaces/<ns>/src
  - substrate-not-to-namespace      a substrate package must not import a namespace package
  - testing-not-runtime-dep         no runtime dependency on @openlance/aios-testing

Plop generators (ADR-0018):
  package          -> packages/<name>/{package.json (ADR-0009 build + coverage + bench scripts), tsconfig.json,
                      tsconfig.build.json, vitest.config.ts (inherits root policy), src/index.ts + src/<name>.ts,
                      tests/<name>.test.ts, benchmarks/<name>.bench.ts + baseline.md, README.md + constitution trace}
  namespace-package-> packages/namespaces/<ns>/{package.json,README.md}  (NO src; reserved only)
```

## 4. Dependency graph

Tooling wraps all packages; it introduces no runtime dependency and no cycle. `tools/*` are config packages consumed only by build tooling.

## 5. Folder structure

```
/  turbo.json  tsconfig.base.json  .dependency-cruiser.cjs  .prettierrc  vitest.config.ts
   .changeset/  .github/workflows/ci.yml  .editorconfig  .nvmrc
tools/
  tsconfig/      (base + package presets)
  eslint-config/ (flat config package)
  scaffold/      (Plop generators + templates)
```

## 6. Implementation plan

1. Pin toolchain: `.nvmrc`, root `packageManager` + `engines`, committed `pnpm-lock.yaml`.
2. `tools/tsconfig` + `tsconfig.base.json`; per-package `tsconfig.json` extends the preset, plus a `tsconfig.build.json` (`composite: false`) for the tsup declaration build (ADR-0009). Type checking is per-package `tsc --noEmit` under Turborepo ordering; a `tsc -b` reference graph is not wired (ADR-0016).
3. `tools/eslint-config` (flat, strict, boundary + banned-globals rules) + Prettier.
4. `turbo.json` pipeline (build/typecheck/lint/test/depcruise/docs), content-hash cached.
5. `.dependency-cruiser.cjs`: substrate layering + reserved namespace graph from the frozen map.
6. Changesets; TypeDoc; `tools/scaffold` Plop generators; CI workflow running the full pipeline.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Toolchain drift breaks reproducibility | Pin Node/pnpm; commit lockfile; Turbo hashing; CI uses the pinned toolchain. |
| Dependency-cruiser rules lag the frozen map | The ruleset is the single source; a checklist ties any map reading to a rule; CI gate. |
| Slow cold builds | Turbo remote/local cache; project references for incremental `tsc`. |
| Generator output drifts from conventions | Golden-file test: scaffold a package in CI and assert it builds + passes depcruise. |

## 8. Acceptance criteria

- Clean-checkout `pnpm install && pnpm turbo run build typecheck lint test depcruise docs` passes deterministically.
- dependency-cruiser reports zero cycles/boundary/deep-import violations with substrate + reserved-namespace rules loaded.
- Banned globals (`Date.now`, `Math.random`, `process.env`) fail lint outside sanctioned edges.
- Scaffolding a package/namespace produces a compiling, graph-valid artifact with a constitution trace and no manual edits.
- Toolchain is pinned; lockfile committed; builds reproducible across machines.
