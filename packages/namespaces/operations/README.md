# @openlance/aios-operations

The immutable, technology-neutral **domain model** of the AI layer's operations abstraction.

- **Constitution:** `ai/operations/` (id `OL-AI-OPERATIONS-README`), the **Specification** authority layer.
- **Category:** Composition Root (ADR-0024 category 5) - it owns the constitutional role of building the
  application, creating the dependency graph, and performing dependency-injection composition; realized at this
  layer per ADR-0020 as an **immutable, stateless domain model** (no IO, no DI).
  **Design:** [docs/implementation/21-operations.md](../../../docs/implementation/21-operations.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

It states operations truth as strongly-typed classifications, immutable definitions and invariants, and two
pure deterministic algorithms that express the operations specification verbatim. Operations is the running
discipline of the AI layer: this package defines how the running of the layer is observed, monitored, kept
healthy, diagnosed, maintained, and evolved, so the layer runs reliably. It **operates the layer; it never
changes its behavior**: it never reasons, executes runtime behavior, decides a matter reserved to governance, or
changes what a namespace does, and it **defines no monitoring tool, dashboard, log, alerting platform,
deployment system, infrastructure product, provider, framework, language, runtime, protocol, interface, or
code** (`ai/operations/README.md`, ADR-0020). It owns no mutable state, no lifecycle, no events, no IO, and no
services.

### Why a Pure Domain Model for a "Composition Root"

ADR-0024 classifies Operations as **category 5 (Composition Root)** - "builds the complete application, creates
the dependency graph, and performs dependency-injection composition." That names the operational **role** in the
AI Operating System. ADR-0020 - foundational to and cited by ADR-0024 - fixes how *every* technology-neutral
constitutional namespace is realized in code: "a set of types, frozen data, and pure predicates... no IO," and a
namespace package "must never own: runtime, orchestration, execution, ... dependency injection, events,
services, or mutable state." ADR-0024's Consequences say the category constrains the package "in addition to
ADR-0020," not instead of it. The frozen `ai/operations/` documents are technology-neutral specifications that
"define the operational model, never how operations is implemented, tooled, or deployed" and "never... code"
(`ai/operations/README.md`). So the package that conforms to that spec owns the operational model **as an
immutable specification model**; the actual composition-root wiring (building the application, creating the
dependency graph, performing DI composition) is the operational implementation's, built later, outside this
constitutional-conformance package. This is the same reconciliation as the category-3 Runtime and the category-4
adapters (Providers, Memory, Tools).

## Public API (single barrel, Engineering Rule 1)

All ten operational concerns from `ai/operations/`, plus the namespace-wide truth, are implemented as an
immutable model. Each concern exposes its **Principles** and **Invariants** (the two normative sections of the
Operations Document Standard), and, where the **Specification** enumerates a genuine closed domain set, that
classification too.

- **Namespace** (`README.md`, `operations.md`): `OperationsInvariant` + `OPERATIONS_INVARIANTS` (7);
  `OperationsConcern` + `OPERATIONS_CONCERNS` (10).
- **Architecture** (`operations-architecture.md`): `OperationsPart` + `OPERATIONS_PARTS` (6: observability,
  monitoring, health, incident, diagnostic, maintenance) - the parts the operational model is composed of.
- **Lifecycle** (`operations-lifecycle.md`): `OperationsLifecyclePhase` + `OPERATIONS_LIFECYCLE_PHASES`
  (4 ordered: startup, steady-state, maintenance, retirement), with `operationsPhaseAtOrAfter`. The operation
  returns from maintenance to steady-state, a described transition recorded in the descriptions, not a
  transition map.
- **Health management** (`health-management.md`): `HealthState` + `HEALTH_STATES` (3 ordered: healthy, degraded,
  failed), with `healthStateAtOrAfter`.
- **Maintenance** (`maintenance.md`): `MaintenanceCategory` + `MAINTENANCE_CATEGORIES` (3: corrective,
  preventive, adaptive).
- **Boundaries** (`operations-boundaries.md`): `OperationsBoundary` + `OPERATIONS_BOUNDARIES` (6: behavior,
  runtime, governance, safety-and-evaluation, evolution, implementation).
- **Versioning** (`operations-versioning.md`): `OperationsVersioningAspect` + `OPERATIONS_VERSIONING_ASPECTS`
  (4: version-rules, evolution, migration, compatibility-and-deprecation).
- **Observability, monitoring, incident management, diagnostics** (`observability.md`, `monitoring.md`,
  `incident-management.md`, `diagnostics.md`): principles and invariants only; their Specification sections
  narrate heterogeneous facets of one model, not closed taxonomies the model refers to by identity (the modeling
  rule recorded in [docs/implementation/13-retrieval.md](../../../docs/implementation/13-retrieval.md)
  section 4). The incident lifecycle is narrated and bounded only by its endpoints, and the incident
  classification's severity levels and kinds are not enumerated (as with the ordered-but-unnamed risk levels of
  `ai/safety/`), so neither is invented.

Every exported symbol traces directly to a frozen `ai/operations/` document. No monitoring tool, dashboard,
alerting platform, deployment system, DI container, or composition engine (`monitor(...)`, `wireApp(...)`,
`compose(...)`) is exported; that boundary is absolute (ADR-0020).

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, Operations depends on the constitution, Governance, and
Runtime (dependency-cruiser `NAMESPACE_DEPS.operations = ['governance', 'runtime']`). As a pure domain model it
uses no type owned by either and imports no package - it references the runtime it operates, the rules it runs
within, and the evaluation and safety signals it observes in prose and never restates or imports them (ADR-0021,
import only what you use; referenced-model non-restatement) - so it imports nothing and its dependency edges are
`[]`. Operations observes evaluation and safety without depending on them, so no cycle is possible.

## Non-responsibilities

It owns no governance rule, no runtime behavior, no business truth, no subject behavior (reasoning, retrieval,
memory, prompts, agents, providers, tools), no protection or output judgment, no evolution of the layer, and no
implementation. It defines the operational model; observing, monitoring, maintaining, and composing a concrete
running layer are the operational implementation's, which consumes this model.
