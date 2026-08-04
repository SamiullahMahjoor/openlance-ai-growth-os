# @openlance/aios-evolution

The immutable, technology-neutral **domain model** of the AI layer's evolution abstraction. This is the
**final namespace** of the AI layer.

- **Constitution:** `ai/evolution/` (id `OL-AI-EVOLUTION-README`), the **Specification** authority layer.
- **Category:** Pure Domain Model (ADR-0024 category 1, declared per ADR-0024 §42, the same shape as
  Governance), realized per ADR-0020 as an **immutable, stateless domain model** (no IO).
  **Design:** [docs/implementation/22-evolution.md](../../../docs/implementation/22-evolution.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

It states evolution truth as strongly-typed classifications, immutable definitions and invariants, and two
pure deterministic algorithms that express the evolution specification verbatim. Evolution is the growth
discipline of the AI layer: this package defines how the architecture of the AI Operating System itself
changes over time, proposed, reviewed, approved, introduced, stabilized, and retired, with compatibility
preserved, migration and deprecation controlled, and growth additive, so the layer advances over years while
its constitution stays stable. It **defines how the architecture changes; it never performs behavior**: it
never executes, reasons, retrieves, stores truth, evaluates, operates, or governs, and it **defines no
deployment, migration tool, version-control system, provider, framework, language, or code**
(`ai/evolution/README.md`, ADR-0020). It owns no mutable state, no lifecycle, no events, no IO, and no
services.

### Why a Pure Domain Model, declared per ADR-0024 §42

ADR-0024 does not enumerate Evolution among its five worked examples. ADR-0024 §42 provides for exactly this:
when a namespace is not enumerated, its purity category is declared in the design document, with no new ADR.
Evolution is declared **category 1 (Pure Domain Model)** because it owns a model of *truth about how the
architecture changes*, not an integration, an orchestration or runtime service, or a composition root. The
frozen `ai/evolution/` documents are technology-neutral specifications that "define the evolution model, never
how a change is implemented, deployed, or executed" (`ai/evolution/README.md`). So the package that conforms to
that spec owns the evolution model **as an immutable specification model**; the carrying out of a concrete
change is the amendment workflow's (`ai/CONTRIBUTING.md`) and the runtime's, built later, outside this
constitutional-conformance package. Category 1 and ADR-0020 coincide: a Pure Domain Model realized exactly as
ADR-0020 prescribes.

## Public API (single barrel, Engineering Rule 1)

All ten evolution concerns from `ai/evolution/`, plus the namespace-wide truth, are implemented as an immutable
model. Each concern exposes its **Principles** and **Invariants** (the two normative sections of the Evolution
Document Standard), and, where the **Specification** enumerates a genuine closed domain set, that
classification too.

- **Namespace** (`README.md`, `evolution.md`): `EvolutionInvariant` + `EVOLUTION_INVARIANTS` (8);
  `EvolutionConcern` + `EVOLUTION_CONCERNS` (10).
- **Architecture** (`evolution-architecture.md`): `EvolutionPart` + `EVOLUTION_PARTS` (7: planning, lifecycle,
  change, compatibility, migration, deprecation, growth) - the parts the evolution model is composed of.
- **Lifecycle** (`evolution-lifecycle.md`): `EvolutionLifecyclePhase` + `EVOLUTION_LIFECYCLE_PHASES` (6 ordered:
  proposal, review, approval, introduction, stabilization, retirement), with `evolutionPhaseAtOrAfter`.
- **Change management** (`change-management.md`): `ChangeCategory` + `CHANGE_CATEGORIES` (3 by scope: additive,
  amending, superseding).
- **Deprecation model** (`deprecation-model.md`): `DeprecationState` + `DEPRECATION_STATES` (3 ordered: active,
  deprecated, retired), with `deprecationStateAtOrAfter` - the document "owns the deprecation states and their
  order".
- **Boundaries** (`evolution-boundaries.md`): `EvolutionBoundary` + `EVOLUTION_BOUNDARIES` (6: behavior,
  runtime-and-operations, governance, workflow-and-map, knowledge, implementation).
- **Planning, compatibility management, migration model, repository growth, evolution versioning**
  (`evolution-planning.md`, `compatibility-management.md`, `migration-model.md`, `repository-growth.md`,
  `evolution-versioning.md`): principles and invariants only; their Specification sections narrate heterogeneous
  facets of one model, not closed taxonomies the model refers to by identity (the modeling rule recorded in
  [docs/implementation/13-retrieval.md](../../../docs/implementation/13-retrieval.md) section 4). The migration
  phases are narrated and partly defer to deprecation and the lifecycle's retirement; evolution versioning
  narrates a core model plus two deferrals (compatibility, governance) and a property (behavior-preserving),
  unlike the clean version-rules / evolution / migration / deprecation aspect sets of `ai/evaluation/` and
  `ai/operations/` versioning, so neither yields a classification.

Every exported symbol traces directly to a frozen `ai/evolution/` document. No deployment, migration tool,
version-control system, or change engine (`migrate(...)`, `deprecate(...)`, `applyChange(...)`) is exported;
that boundary is absolute (ADR-0020).

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, Evolution depends on nothing (dependency-cruiser
`NAMESPACE_DEPS.evolution = []`). As a pure domain model it imports no package - it references the amendment
workflow (`ai/CONTRIBUTING.md`), the change rules (`ai/governance/`), the maturity map
(`ai/architecture/repository-evolution.md`), operations, the runtime, and the knowledge repository in prose and
never restates or imports them (ADR-0021, import only what you use; referenced-model non-restatement) - so it
imports nothing and its dependency edges are `[]`. Evolution advances the architecture and never cycles, so no
cycle is possible.

## Non-responsibilities

It owns no governance rule, no amendment workflow, no maturity map, no runtime behavior, no operational model,
no behavior of any namespace, and no business truth. It defines the evolution model; proposing, reviewing,
approving, introducing, migrating, deprecating, and carrying out a concrete change are the amendment workflow's
and the runtime's, which consume this model.
