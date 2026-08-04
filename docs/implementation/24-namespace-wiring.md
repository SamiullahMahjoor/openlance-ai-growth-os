# 24. Namespace wiring implementation design (Phase 3, Stage 2)

**Status: IMPLEMENTED and frozen (Phase 3, Stage 2).** Built after design-review approval (with additional
constraints, folded in below) per ADR-0007. [ADR-0027](adr/0027-namespace-manifest-layer.md) is Accepted.
Package: `apps/namespace-wiring` (`@openlance/aios-namespace-wiring`).

## 1. Scope and ownership

Phase 3, Stage 2 builds the **static namespace wiring**: an immutable, validated **namespace manifest** that
declares the 13 frozen namespaces to the application and extends the Stage 1 Application graph. It owns namespace
registration, descriptors, the namespace graph, structural validation, availability verification, manifests,
metadata, and diagnostics.

It **describes, never owns**: the manifest is descriptive metadata, not runtime state. It is not, and never
becomes, a runtime registry, a service locator, an execution registry, a dependency resolver, a scheduler, or an
orchestrator. It **declares, validates, and wires** only: it executes nothing, starts no runtime, performs no AI
behavior, registers no service, resolves no dependency, and holds no runtime state. It **consumes** the frozen
namespace packages, the Stage 1 Composition Root (the `Application` type), and the kernel/errors substrate; it
recreates none of them.

## 2. The non-duplication principle (the core constraint)

The inter-namespace dependency topology is **constitutional truth** owned by `ai/architecture/dependency-map.md`
(Frozen, Reference authority) and already encoded once in `.dependency-cruiser.cjs` `NAMESPACE_DEPS`. This stage
does not **copy, serialize, transform, cache, or recreate** it. The manifest instead:

- declares each namespace's **actual** package dependency edges, which are empty: every frozen namespace is a
  pure ADR-0020 domain model with dependency edge `[]` (imports nothing, no service, no DI token), so its runtime
  dependency set is genuinely `[]` (verified, not assumed); and
- **references** `ai/architecture/dependency-map.md` as the owner of the allowed-edge topology (in prose and in
  ADR-0027), and merely **records** that the manifest passed structural validation (among its checks, that every
  declared dependency edge references a registered namespace). The manifest's `validated: true` flag is that
  record; the map itself is never stored.

Registering runtime dependency edges (services under those allowed edges) is a later phase's concern, once
namespaces have operational services (ADR-0021). Stage 2 wires the static topology that exists today: the
namespaces, their identity, and their availability.

## 3. Category and relationship to Stage 1

A second `apps/`-layer package (layer `app`), the manifest counterpart to the Stage 1 composition root. Per
ADR-0027 it consumes the frozen namespace packages (a legal app -> namespace edge) and the Stage 1
`Application`; it declares no container, registry, application, bootstrap, namespace model, or runtime model. Its
executable surface is a pure validator and a pure wiring function; there is no IO.

## 4. Public API and package layout

Package `apps/namespace-wiring`, name `@openlance/aios-namespace-wiring`, `aios.layer: "app"`. Single explicit
barrel (`src/index.ts`, no wildcard). Modules: `manifest.ts` (types, the canonical namespace sources,
`validateNamespaces`, `wireNamespaces`), `errors.ts` (`NamespaceWiringError`).

```ts
// The input to validation: a namespace's identity, availability catalog, and actual dependency edges.
export interface NamespaceSource {
  readonly namespace: string;                // stable slug, e.g. 'governance'
  readonly constitution: string;             // its constitution README id, e.g. 'OL-AI-GOVERNANCE-README'
  readonly catalog: readonly unknown[];       // a stable exported catalog from its barrel (availability probe)
  readonly dependencies?: readonly string[];  // actual package edges on other namespaces (empty today)
}

// A read-only descriptor of one validated namespace. Descriptive metadata only.
export interface NamespaceDescriptor {
  readonly namespace: string;              // stable slug
  readonly constitution: string;           // constitution README id (constitution identity)
  readonly available: true;                // barrel importable and catalog non-empty
  readonly conceptCount: number;           // catalog size - a DIAGNOSTIC only; never drives logic
  readonly dependencies: readonly string[]; // actual (empty) edges; see section 2
}

// The immutable, validated namespace manifest: descriptive metadata, not runtime state.
export interface NamespaceManifest {
  readonly namespaces: readonly NamespaceDescriptor[]; // one per namespace, in canonical order
  readonly validated: true;                             // records that structural validation passed
}

// A read-only report over the manifest.
export interface NamespaceDiagnostics {
  readonly names: readonly string[]; // registered slugs, in order
  readonly count: number;            // number of namespaces
  readonly edgeCount: number;        // total actual inter-namespace edges (0 today)
}

// The Stage 1 Application extended with the manifest and diagnostics; immutable.
export interface WiredApplication {
  readonly application: Application;       // the Stage 1 Application, consumed and unchanged
  readonly namespaces: NamespaceManifest;  // the validated manifest
  readonly diagnostics: NamespaceDiagnostics;
}

// Validate an explicit namespace-source set into a manifest, failing closed. Pure; no IO.
export function validateNamespaces(
  sources: readonly NamespaceSource[],
): Result<NamespaceManifest, NamespaceWiringError[]>;

// Wire the canonical 13 frozen namespaces and extend the Stage 1 Application, failing closed.
export function wireNamespaces(application: Application): Result<WiredApplication, NamespaceWiringError[]>;
```

`wireNamespaces` builds the canonical source set (each of the 13 frozen namespaces paired with its slug,
constitution id, and a stable exported catalog: `<X>_CONCERNS` for the twelve that publish one, `TRUST_LEVELS`
for governance, which has no unified concerns inventory), calls `validateNamespaces`, and on success returns a
frozen `WiredApplication` pairing the consumed Stage 1 `Application` with the validated manifest and derived
diagnostics. `validateNamespaces` is the reusable "namespace validation" surface. `NamespaceWiringError` is an
`@openlance/aios-errors` `BaseError` subtype (`infrastructure`) with `NAMESPACE_WIRING.*` codes; failures stay on
the `Result` channel (ADR-0006).

## 5. What it composes

The 13 frozen namespaces, in constitutional inventory order (governance, providers, memory, retrieval, safety,
reasoning, prompts, tools, agents, runtime, evaluation, operations, evolution). Each is consumed by importing its
barrel and referencing a stable exported catalog to record `conceptCount` (a diagnostic) and confirm
availability; the model is never restated. `conceptCount` is diagnostic-only: no validation or wiring logic
branches on catalog size, exported type count, or exported value count. Each descriptor's `dependencies` is the
empty set (section 2). The manifest and diagnostics extend the Stage 1 Application as an immutable
`WiredApplication`.

## 6. Validation (structural only, fail closed)

`validateNamespaces` returns `err(NamespaceWiringError[])` and produces no partial manifest on any structural
failure. The checks are structural only (never runtime, execution, provider, or service compatibility, which are
later phases):

- **invalid package**: a source has a blank slug (`NAMESPACE_WIRING.INVALID_PACKAGE`).
- **missing constitution reference**: a source has a blank constitution id (`NAMESPACE_WIRING.MISSING_CONSTITUTION`).
- **unavailable**: a source's catalog is empty (`NAMESPACE_WIRING.UNAVAILABLE`).
- **duplicate**: a namespace slug appears more than once (`NAMESPACE_WIRING.DUPLICATE`).
- **missing namespace**: a declared dependency references a slug not in the set (`NAMESPACE_WIRING.MISSING_NAMESPACE`).

For the canonical 13 (unique, available, non-blank identity, empty edges) the wiring succeeds. The failure
branches are reachable and exercised by `validateNamespaces` unit tests with crafted adverse source sets.

## 7. Deliverable reconciliation

| Owned item | Disposition |
|---|---|
| Namespace registration, descriptors, manifests, metadata | `NamespaceDescriptor` / `NamespaceManifest` from the 13 frozen packages (descriptive metadata) |
| Namespace dependency declarations | each descriptor's `dependencies` = the actual (empty) edges; allowed topology referenced to `ai/architecture/dependency-map.md`, not re-encoded (section 2) |
| Namespace graph, static namespace wiring | the validated node set + edges attached to the immutable Application as `WiredApplication` |
| Namespace validation | `validateNamespaces` (section 6), structural, fail closed |
| Namespace availability verification | availability (importable barrel, non-empty catalog) |
| Namespace diagnostics | `NamespaceDiagnostics` (names, count, edgeCount) |

Out of scope (Strict Boundaries, stop boundary): dependency injection integration, namespace service
registration, namespace activation, runtime lifecycle, execution pipeline, and everything after it. Runtime,
execution, provider, and service compatibility are later phases; only structural validation is done here.

## 8. Dependency graph and layer wiring

`@openlance/aios-namespace-wiring -> { <13 namespaces>, @openlance/aios-composition-root, kernel, errors }`. The
app -> namespace and app -> app edges are legal (no frozen rule forbids them; ADR-0027). No namespace edge or
rule changes. The workspace, `depcruise`, Turborepo, `scripts/graph-snapshot.mjs`, and `scripts/docs-check.mjs`
already cover the `apps/` layer, so the package participates in every gate automatically; the graph snapshot is
regenerated to record its edges (a reviewable diff).

## 9. Testing strategy (ADR-0022 / Rule 6)

100% statements/branches/functions/lines. `validateNamespaces` is tested with the canonical valid set (ok,
correct manifest), a valid set with a satisfied dependency, and one adverse set per failure code (blank slug,
blank constitution, empty catalog, duplicate slug, dangling dependency) - each asserting the exact code and no
partial manifest. `wireNamespaces`
is tested end to end (a frozen `WiredApplication` whose manifest lists the 13 namespaces with `conceptCount > 0`
and empty dependencies, whose diagnostics report count 13 and edgeCount 0, and whose `application` is the
passed-in Stage 1 Application unchanged). Immutability (`Object.isFrozen`) is asserted on the manifest,
descriptors, diagnostics, and `WiredApplication`. Benchmark: the `wireNamespaces` build path (Rule 5 baseline).

## 10. Acceptance criteria (met)

- Consumes the frozen namespaces + the Stage 1 Application; recreates no container/registry/application/
  bootstrap/namespace-model/runtime-model; re-encodes no constitutional dependency map; the manifest describes,
  never owns.
- `wireNamespaces` returns an immutable, validated `WiredApplication` or a `Result` error, failing closed with no
  partial manifest; it executes nothing.
- Full validation green; 100% coverage; benchmark recorded; two independent source audits CLEAN.
- Zero regression: `ai/`, `knowledge/`, the frozen substrate, all 13 frozen namespaces, the frozen Stage 1
  composition root, and every other ADR's decision unchanged.
