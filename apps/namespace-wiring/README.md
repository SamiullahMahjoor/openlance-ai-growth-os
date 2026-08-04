# @openlance/aios-namespace-wiring

The AIOS namespace wiring (Phase 3, Stage 2). It declares the 13 frozen namespaces to the application as an
immutable, validated **namespace manifest** and extends the Stage 1 Application graph.

- **Layer:** `app` (the manifest counterpart to the Stage 1 composition root; `apps/*`).
- **Design:** [docs/implementation/24-namespace-wiring.md](../../docs/implementation/24-namespace-wiring.md).
  **Decision:** [ADR-0027](../../docs/implementation/adr/0027-namespace-manifest-layer.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

A thin application layer that **consumes** the 13 frozen namespace packages and the Stage 1 `Application`, and
declares an immutable namespace manifest. `wireNamespaces(application)` imports each frozen namespace barrel,
builds a validated `NamespaceManifest` of descriptors, and returns an immutable `WiredApplication` (the Stage 1
`Application`, the manifest, and diagnostics), or fails closed with `NamespaceWiringError[]`.

The manifest is **descriptive metadata, not runtime state**. It is never a runtime registry, service locator,
execution registry, dependency resolver, scheduler, or orchestrator. This stage **declares, validates, and wires
only**: it executes nothing, registers no service, resolves no dependency, starts no runtime, and holds no
runtime state.

### Consume, never recreate; never duplicate the constitution

It recreates no container, registry, application, bootstrap, namespace model, or runtime model. The
inter-namespace dependency topology is constitutional truth owned by `ai/architecture/dependency-map.md` (already
encoded once in `.dependency-cruiser.cjs`); this package does **not copy, serialize, transform, cache, or
recreate** it. Each descriptor declares only the namespace's **actual** dependency edges, which are empty (every
frozen namespace is a pure ADR-0020 domain model that imports nothing); the manifest's `validated: true` merely
records that structural validation passed, and the allowed-edge topology is referenced to the constitution.
Registering runtime dependency edges (services under those allowed edges) is a later phase, once namespaces have
operational services (ADR-0021).

## Public API (single barrel, Engineering Rule 1)

- `wireNamespaces(application: Application): Result<WiredApplication, NamespaceWiringError[]>` - wire the
  canonical 13 frozen namespaces and extend the Stage 1 Application.
- `validateNamespaces(sources: readonly NamespaceSource[]): Result<NamespaceManifest, NamespaceWiringError[]>` -
  the reusable structural validator.
- `NamespaceSource`, `NamespaceDescriptor`, `NamespaceManifest`, `NamespaceDiagnostics`, `WiredApplication` -
  the read-only manifest types.
- `NamespaceWiringError` is a `BaseError` subtype (`infrastructure`) with `NAMESPACE_WIRING.*` codes.

Each `NamespaceDescriptor` records identity (`namespace` slug, `constitution` README id), `available: true`
(the barrel is importable and its catalog non-empty), a `conceptCount` **diagnostic** (catalog size; it never
drives logic), and the actual (empty) `dependencies`.

## Validation (structural only, fail closed)

`validateNamespaces` fails closed with no partial manifest on: a blank slug (`INVALID_PACKAGE`), a blank
constitution reference (`MISSING_CONSTITUTION`), an empty catalog (`UNAVAILABLE`), a duplicate slug
(`DUPLICATE`), or a declared dependency on an unregistered namespace (`MISSING_NAMESPACE`). The checks are
structural only; runtime, execution, provider, and service compatibility are later phases.

## Dependency direction

`@openlance/aios-namespace-wiring -> { <13 namespaces>, @openlance/aios-composition-root, kernel, errors }` (its
`src/` edges, recorded in `dependency-graph.snapshot.json`). The `app -> namespace` and `app -> app` edges are
legal (ADR-0027); no namespace edge or rule changes.

## Non-responsibilities

No dependency injection integration, no namespace service registration, no namespace activation, no runtime
lifecycle, no execution pipeline (those are later Phase 3 stages). It declares and validates the static
namespace manifest and extends the immutable Application; running the layer is a later stage's concern.
