# @openlance/aios-tools

The immutable, technology-neutral **domain model** of the AI layer's tool abstraction.

- **Constitution:** `ai/tools/` (id `OL-AI-TOOLS-README`), the **Specification** authority layer.
- **Category:** Infrastructure Adapter (ADR-0024, category 4 - its "Tool adapters" example) - it owns the
  AI layer's boundary to external interaction; realized at this layer per ADR-0020 as an **immutable,
  stateless domain model** (no IO). **Design:**
  [docs/implementation/17-tools.md](../../../docs/implementation/17-tools.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

It states tool truth as strongly-typed classifications, immutable definitions and invariants, and pure
ordering predicates that express the tool specification verbatim. A tool is the external-interaction
capability of the AI layer: this package defines what a tool is as an architectural capability through which
an agent interacts with something outside its own reasoning, and how a tool is identified, declared,
selected, executed, validated, composed, and evolved. It **performs no reasoning, makes no decision, holds
no permission, owns no intelligence, never orchestrates, schedules, or executes itself, and defines no
provider, model, framework, protocol, interface, network, or code, and it names no outside system**
(`ai/tools/README.md`, ADR-0020): a tool is selected, validated, and composed as a model, and the runtime
carries out the interaction. It owns no runtime, no mutable state, no lifecycle, no events, no IO, and no
services.

### Why a Pure Domain Model for an "Infrastructure Adapter"

ADR-0024 names "Tool adapters" as a category 4 (Infrastructure Adapter) example - the AI layer's boundary to
external interaction, in the same group as Providers (boundary to intelligence sources) and Memory (boundary
to retained state). ADR-0020 - foundational to and cited by ADR-0024 - fixes how *every* technology-neutral
constitutional namespace is realized in code: "a set of types, frozen data, and pure predicates... no IO,"
while "the category a namespace belongs to is fixed by ADR-0024." The constitution independently forbids this
namespace from executing, networking, defining a protocol or interface, or containing code. So Tools owns the
external-interaction boundary **as an immutable specification model**; the actual tool interaction over a real
outside system is the runtime's, and the effect on that system is the system's own.

## Public API (single barrel, Engineering Rule 1)

All ten tool concerns from `ai/tools/`, plus the namespace-wide truth, are implemented as an immutable model.
Each concern exposes its **Principles** and **Invariants** (the two normative sections of the Tool Document
Standard), and, where the **Specification** enumerates a genuine closed domain set, that classification too.

- **Namespace** (`README.md`, `tools.md`): `ToolInvariant` + `TOOL_INVARIANTS` (the eight tool invariants
  every concern instantiates); `ToolConcern` + `TOOL_CONCERNS` (the ten concerns). The tool model is
  deterministic and scalable.
- **Tool architecture** (`tool-architecture.md`): principles, invariants, and `ToolPart` + `TOOL_PARTS` (the
  two parts a tool is composed of: identity, capabilities).
- **Tool lifecycle** (`tool-lifecycle.md`): principles, invariants, and `ToolLifecyclePhase` +
  `TOOL_LIFECYCLE_PHASES` (the five ordered phases: registration, discovery, activation, execution-lifecycle,
  retirement), with the pure predicate `toolPhaseAtOrAfter`.
- **Tool validation** (`tool-validation.md`): principles, invariants, and `ToolValidationCheck` +
  `TOOL_VALIDATION_CHECKS` (the four ordered checks: permission-validation, safety-validation,
  constitutional-validation, compatibility-validation), with the pure predicate `toolValidationCheckAtOrAfter`;
  the concern explicitly owns "validation ordering", so the order is a grounded predicate.
- **Tool compatibility** (`tool-compatibility.md`): principles, invariants, and `ToolCompatibilityKind` +
  `TOOL_COMPATIBILITY_KINDS` (the two kinds: capability, version).
- **Tool boundaries** (`tool-boundaries.md`): principles, invariants, and `ToolBoundary` + `TOOL_BOUNDARIES`
  (the six architectural boundaries: reasoning-and-decision, authority, execution, provider-and-intelligence,
  truth, implementation).
- **Tool versioning** (`tool-versioning.md`): principles, invariants, and `ToolVersioningAspect` +
  `TOOL_VERSIONING_ASPECTS` (the four aspects: version-rules, evolution, migration, deprecation).
- **Tool capabilities, selection, execution, composition** (`tool-capabilities.md`, `tool-selection.md`,
  `tool-execution.md`, `tool-composition.md`): principles and invariants; their Specification sections narrate
  heterogeneous process facets, not closed taxonomies the model refers to by identity, so they are definitions
  only (the modeling rule recorded in
  [docs/implementation/13-retrieval.md](../../../docs/implementation/13-retrieval.md) section 4). In particular,
  tool-execution owns "execution ordering" but the constitution does not enumerate the steps within a tool
  execution, so there is no named ordered set and no predicate (as with Safety's ordered-but-unnamed risk
  levels); and capability inheritance resolves overlaps by authority, then owner, then specificity - applying
  the Authority Hierarchy (`ai/README.md`) and ownership map (`ai/architecture/`) - stated as prose, never
  recreated as an executable precedence (referenced-model non-restatement; ADR-0025).

Every exported symbol traces directly to a frozen `ai/tools/` document. No tool engine, runtime evaluator,
network, or protocol (`select(need)`, `execute(tool)`) is exported, and no outside system is named; that
boundary is absolute (ADR-0020).

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, Tools depends on the constitution, the Governance
namespace, and the Safety namespace (dependency-cruiser `NAMESPACE_DEPS.tools = ['governance', 'safety']`). As
a pure domain model it uses no governance-owned or safety-owned type and imports no package - it references
those models, the reasoning/runtime/providers/agents models, the Authority Hierarchy, and the knowledge
repository in prose and never restates or imports them (ADR-0021, import only what you use; referenced-model
non-restatement) - so it imports nothing and its dependency edges are `[]`.

## Non-responsibilities

It owns no reasoning, agent, runtime execution, provider, prompt, retrieval, memory, evaluation, or operations
behavior, no governance rule, no safety rule, no business truth, and no intelligence. It defines what a tool
is and how it is chosen, executed, validated, and composed; performing the interaction, and the effect on the
outside system, are the runtime's and that system's own.
