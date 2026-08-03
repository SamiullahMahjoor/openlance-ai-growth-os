# Subsystem 00, Repository Architecture

## 1. Architectural analysis

The repository must host, side by side, two immutable constitutional layers (`ai/`, `knowledge/`) and a growing implementation that conforms to them. The implementation is a **production monorepo** whose package graph is a strict, acyclic mirror of the frozen `ai/architecture/dependency-map.md`. Phase 2A delivers only the substrate packages plus the tooling that makes the graph enforceable; the 13 namespace packages are named and graphed but not implemented.

Key forces:
- **Conformance, not coupling.** Code depends on the constitution (as spec); the constitution never depends on code (`ai/README.md` line 36). We encode this as: no build artifact is imported by any `ai/` or `knowledge/` document, and every implementation package carries a `constitution` traceability field.
- **Acyclicity is a first-class, enforced property**, not a convention. dependency-cruiser rules derived from the frozen map fail CI on any violation.
- **Additive growth.** New packages are added; existing ones keep identity (mirrors `ai/evolution/repository-growth.md`).

## 2. Package design

Three package classes:

1. **Substrate** (`packages/*`): kernel, errors, di, config, logging, events, plugins, testing. Built in Phase 2A.
2. **Namespace** (`packages/namespaces/*`, reserved): one per frozen namespace. Not built in 2A.
3. **Shared tooling** (`tools/*`): `eslint-config`, `tsconfig`, `scaffold` (Plop). Configuration packages, no runtime code.

Apps (`apps/*`): composition roots. A `dev-harness` app that boots the substrate to prove wiring is **deferred to the start of the Runtime phase** (ADR-0017); in Phase 2A the composed wiring is exercised by the `@openlance/aios-testing` harness (`createHarness`) and the package test suites. `apps/` remains a reserved location and contains no AI behavior.

Every substrate package: `src/` (barrel `index.ts`), `tests/`, `benchmarks/` (Rule 5 baseline), `package.json`, `tsconfig.json` (extends base) plus `tsconfig.build.json` (the composite-off declaration build, ADR-0009), `README.md` (purpose + owned concern + constitution trace). Packages are built with tsup and type-checked per package with `tsc --noEmit` under Turborepo build ordering; `composite` remains available for a project-reference graph but Phase 2A does not wire `tsc -b` (ADR-0016).

## 3. Interface design (repository-level contracts)

```ts
// Every implementation package.json carries a machine-readable metadata block:
// "aios": {
//   "layer": "substrate" | "namespace" | "app" | "tools",
//   "constitution": string[],  // frozen doc ids, e.g. ["OL-AI-RUNTIME-README"];
//                               // [] where the package realizes an engineering seam, not a constitutional concept
//   "stability": "Very High" | "High" | "Medium" | "Low" | "Experimental",  // Engineering Rule 4; must match the authoritative table
//   "apiVersion": string,      // the package's logical public-API contract version,
//                              // distinct from the release "version" (0.0.0, unpublished);
//                              // bumped when the supported public surface changes incompatibly
//   "generation": number       // structural generation; bumped on a breaking regeneration of the package
// }
// docs-check (Rules 3 and 4) validates the block's presence, the stability class and its
// match against the authoritative table, and that every constitution id resolves.

// Shared tsconfig.base.json (conceptual): strict, noUncheckedIndexedAccess,
// exactOptionalPropertyTypes, verbatimModuleSyntax, composite, declaration, ESM.
```

Package public surface rule: consumers import only `@openlance/aios-<name>` (the barrel). `import '@openlance/aios-di/src/internal/...'` is a lint error.

## 4. Dependency graph

Substrate (built): `kernel ◀ errors ◀ di ◀ config ◀ logging ◀ events ◀ plugins`; `testing ◀ {kernel, errors}` runtime, dev-only on the rest.

Namespace graph (reserved, from the frozen map): Governance◀constitution; Providers/Memory/Retrieval/Safety◀{constitution, governance}; Reasoning/Prompts◀Retrieval; Tools◀Safety; Agents◀{Reasoning,Retrieval,Memory,Prompts,Tools,Providers}; Runtime◀{Agents,Reasoning,Retrieval}; Evaluation◀{constitution,governance} (observes, not depended upon); Operations◀Runtime; Evolution◀{constitution, architecture map}. These edges are pre-registered in dependency-cruiser so a future violation fails CI even before the packages have code.

## 5. Folder structure

```
/
  package.json  pnpm-workspace.yaml  turbo.json
  tsconfig.base.json  eslint.config.mjs  .prettierrc  .dependency-cruiser.cjs
  vitest.config.ts  .changeset/  .github/workflows/ci.yml
  dependency-graph.snapshot.json  scripts/            # graph snapshot + docs-check
  ai/  knowledge/  agents/  prompts/  templates/       # frozen, untouched
  docs/implementation/                                 # this design package
  packages/
    kernel/ errors/ di/ config/ logging/ events/ plugins/ testing/
    namespaces/                                        # reserved, empty in 2A
  apps/                                                # dev-harness deferred to Runtime (ADR-0017)
  tools/
    eslint-config/ tsconfig/ scaffold/
```

## 6. Implementation plan

1. Root workspace: `pnpm-workspace.yaml`, root `package.json` (pins Node + pnpm via `packageManager`, `engines`), `.gitignore`, `.editorconfig`.
2. `tools/tsconfig` + `tsconfig.base.json`; `tools/eslint-config` (flat, strict, import/boundary rules).
3. `turbo.json` pipeline: `build → typecheck → lint → test → depcruise`, cached by content hash.
4. `.dependency-cruiser.cjs`: substrate rules + reserved namespace rules from the frozen map; `no-circular`, `no-orphans`, `not-to-deep-import`.
5. Changesets config; CI workflow running the pipeline on a pinned toolchain.
6. `tools/scaffold`: Plop generators `package` and `namespace-package` that emit the standard skeleton + constitution trace.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Graph drift as packages grow | dependency-cruiser rules are the single source; CI gate. |
| Reserved namespace packages tempt premature behavior | 2A generator emits only README + package.json (no `src`) for namespaces. |
| Toolchain nondeterminism | Pin Node + pnpm; commit lockfile; Turbo content hashing. |
| Deep imports erode boundaries | Barrel-only lint rule + depcruise `not-to-deep-import`. |

## 8. Acceptance criteria

- `pnpm install && pnpm turbo run build typecheck lint test depcruise` passes deterministically on a clean checkout.
- dependency-cruiser reports zero cycles and zero boundary violations, with the reserved namespace graph loaded.
- Every package has a barrel, a README with a constitution trace, and an independent test target.
- Scaffolding a new package via Plop produces a compiling, testable, graph-valid package with no manual edits.
