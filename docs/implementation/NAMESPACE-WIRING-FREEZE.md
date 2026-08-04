# Namespace Wiring, Freeze Declaration (Phase 3, Stage 2)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-namespace-wiring` (`apps/namespace-wiring`).
**Scope:** Phase 3, Stage 2: the static namespace wiring, the second `apps/`-layer package, built on top of the
frozen Phase 2A substrate, the 13 frozen Phase 2B namespaces, and the frozen Stage 1 composition root. Decision:
ADR-0027 (Accepted). Design: `docs/implementation/24-namespace-wiring.md`.

## What this stage owns

An immutable, validated **namespace manifest** that declares the 13 frozen namespaces to the application and
extends the Stage 1 Application graph. It owns namespace registration, descriptors, the namespace graph,
structural validation, availability verification, manifests, metadata, and diagnostics. The manifest
**describes, never owns**: it is descriptive metadata, not runtime state, and never a runtime registry, service
locator, execution registry, dependency resolver, scheduler, or orchestrator. It **declares, validates, and
wires only**: it executes nothing, registers no service, resolves no dependency, starts no runtime, and holds no
runtime state.

## What was built

| Module | Owns |
|---|---|
| `src/manifest.ts` | the public types, the canonical 13-namespace sources, `validateNamespaces`, `wireNamespaces` |
| `src/errors.ts` | `NamespaceWiringError` (a `BaseError` subtype, `infrastructure`) |
| `src/index.ts` | the single explicit barrel (no wildcard) |

## Public API

- `wireNamespaces(application: Application): Result<WiredApplication, NamespaceWiringError[]>` - wire the
  canonical 13 frozen namespaces and extend the Stage 1 Application.
- `validateNamespaces(sources: readonly NamespaceSource[]): Result<NamespaceManifest, NamespaceWiringError[]>` -
  the reusable structural validator.
- `NamespaceSource`, `NamespaceDescriptor`, `NamespaceManifest`, `NamespaceDiagnostics`, `WiredApplication`,
  `NamespaceWiringError`.

`WiredApplication = { application, namespaces, diagnostics }` (immutable). Each `NamespaceDescriptor` records
identity (`namespace` slug, `constitution` README id), `available: true` (importable barrel, non-empty catalog),
a `conceptCount` **diagnostic** (catalog size; it never drives logic), and the actual (empty) `dependencies`.

## Consume, never recreate; never duplicate the constitution (recorded for the freeze)

It consumes the 13 frozen namespace packages and the Stage 1 `Application`, and recreates no container,
registry, application, bootstrap, namespace model, or runtime model. The inter-namespace dependency topology is
constitutional truth owned by `ai/architecture/dependency-map.md` (already encoded once in
`.dependency-cruiser.cjs`); this package does **not copy, serialize, transform, cache, or recreate** it. Each
descriptor declares only the namespace's **actual** dependency edges, which are empty (every frozen namespace is
a pure ADR-0020 domain model that imports nothing; `edgeCount` is 0); the manifest's `validated: true` merely
records that structural validation passed, and the allowed-edge topology is referenced to the constitution.
Registering runtime dependency edges (services under those allowed edges) is a later phase, once namespaces have
operational services (ADR-0021). Both audits verified no re-encoding of the dependency map.

## Validation (structural only, fail closed)

`validateNamespaces` fails closed with no partial manifest on exactly five structural checks: a blank slug
(`NAMESPACE_WIRING.INVALID_PACKAGE`), a blank constitution reference (`MISSING_CONSTITUTION`), an empty catalog
(`UNAVAILABLE`), a duplicate slug (`DUPLICATE`), or a declared dependency on an unregistered namespace
(`MISSING_NAMESPACE`). The checks are structural only; runtime, execution, provider, and service compatibility
are later phases. No throw for expected failures (Result channel, ADR-0006).

## Immutability

The `WiredApplication` and, deeply, its manifest, the namespaces array, each descriptor, each
`descriptor.dependencies`, the diagnostics, and `diagnostics.names` are all `Object.freeze`d. `wireNamespaces`
builds a fresh graph each call and retains no mutable builder. Both audits verified the deep freeze empirically.

## Dependency graph and layer wiring

`@openlance/aios-namespace-wiring -> { <13 namespaces>, @openlance/aios-composition-root, kernel, errors }` (its
`src/` edges, recorded in `dependency-graph.snapshot.json`; config and logging are test-only devDependencies and
are not in the graph). The `app -> namespace` and `app -> app` edges are legal (no frozen rule forbids them;
ADR-0027); no dependency-cruiser rule or namespace edge changed. The `apps/` layer was already covered by the
gates (extended in Stage 1), so the package participates automatically; the graph snapshot was regenerated.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10,
  graph:check, docs-check 26 packages, test, bench, docs, build).
- 100% statements/branches/functions/lines coverage; 9 tests; benchmark recorded; no `.only`/`.skip`.
- Two independent source audits, both CLEAN. One Medium doc-fidelity finding (the design doc and ADR-0027
  referenced a cycle/acyclicity check the code does not ship, per the structural-only constraint) was fixed by
  aligning the docs to the shipped five-check validator, and both audits re-run CLEAN. Deep immutability and the
  no-duplication constraint were verified empirically.

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate, all 13 frozen Phase 2B namespaces, and the
frozen Stage 1 composition root unchanged; no ADR decision changed except the new ADR-0027 (Accepted);
`.dependency-cruiser.cjs` and `scripts/` unchanged. The complete change set is the namespace-wiring package, its
design doc, ADR-0027, the ADR index row, the graph snapshot, and `pnpm-lock.yaml`.

## What "frozen" means

The namespace manifest's public API, behavior (fail-closed structural validation, immutable `WiredApplication`,
descriptive-only manifest), consume-not-recreate boundary, non-duplication of the constitution, and dependency
edges are settled for Stage 2. DI integration, namespace service registration, namespace activation, runtime
lifecycle, and the execution pipeline are **not** part of this stage.

## Allowed changes (no architecture review required)

Only compiler compatibility, security vulnerabilities, dependency updates, and critical bug fixes may change a
frozen namespace-wiring file without an architecture change process, each still running the full validation
pipeline. Any change to the public API, the describe-never-own boundary, the fail-closed contract, the
immutable-`WiredApplication` shape, the structural-only validation, or the non-duplication of the dependency map
is an architectural modification requiring a new or superseding ADR, an architecture review, an independent
audit, and full validation.

## Constitutional and prior-phase layers remain immutable

`ai/` and `knowledge/` remain immutable (CI constitutional guard). The frozen substrate, namespaces, and Stage 1
composition root are unchanged; this stage consumes them and modifies none.

## Do not begin Stage 3

Phase 3 Stage 3 (Dependency Injection Integration) is not started. It is a separate, design-first stage.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
