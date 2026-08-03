# Tools Namespace, Freeze Declaration

**Status:** FROZEN (all ten tool concerns implemented, validated, and independently audited twice).
**Package:** `@openlance/aios-tools` (`packages/namespaces/tools`).
**Scope:** the Tools namespace domain model, the eighth namespace of Phase 2B, built on top of the immutable
Phase 2A substrate, the frozen Governance, Providers, Memory, Retrieval, Safety, Reasoning, and Prompts
namespaces, and the frozen `ai/` and `knowledge/` constitution.

The Tools namespace is **immutable**. It states the external-interaction model of the AI layer: what a tool
is as an architectural capability through which an agent interacts with something outside its own reasoning,
and how a tool is identified, declared, selected, executed, validated, composed, and evolved. It performs no
reasoning, makes no decision, holds no permission, owns no intelligence, never orchestrates, schedules, or
executes itself, and never defines a provider, model, framework, protocol, interface, network, or code, and
it names no outside system. It is permitted by governance, bounded by safety, executed by the runtime, and
composed by an agent.

## What was built (the ten concerns + namespace)

Each concern is one source module, tracing verbatim to its frozen `ai/tools/<file>.md` document. Each models
the two normative sections of the Tool Document Standard (Principles, Invariants) and, where the
Specification enumerates a genuine closed domain set, that classification.

| Module | Concern | Specification classification | Predicate |
|---|---|---|---|
| `namespace.ts` | namespace-wide | `TOOL_INVARIANTS` (8), `TOOL_CONCERNS` (10) | none |
| `tool-architecture.ts` | Tool Architecture | `ToolPart` (2: identity, capabilities) | none |
| `tool-lifecycle.ts` | Tool Lifecycle | `ToolLifecyclePhase` (5, ordered) | `toolPhaseAtOrAfter` |
| `tool-capabilities.ts` | Tool Capabilities | none (process facets) | none |
| `tool-selection.ts` | Tool Selection | none (process facets) | none |
| `tool-execution.ts` | Tool Execution | none (ordered-but-unnamed steps) | none |
| `tool-validation.ts` | Tool Validation | `ToolValidationCheck` (4, ordered) | `toolValidationCheckAtOrAfter` |
| `tool-composition.ts` | Tool Composition | none (process facets) | none |
| `tool-compatibility.ts` | Tool Compatibility | `ToolCompatibilityKind` (2: capability, version) | none |
| `tool-boundaries.ts` | Tool Boundaries | `ToolBoundary` (6) | none |
| `tool-versioning.ts` | Tool Versioning | `ToolVersioningAspect` (4) | none |

The ten concerns match the ten concerns in the inventory `ai/tools/tools.md` exactly.

## Category and purity

ADR-0024 names **"Tool adapters"** among its category 4 (Infrastructure Adapter) examples, so Tools is
category 4 by enumeration (no §42 declaration needed), in the same group as Providers and Memory: the AI
layer's boundary to external interaction. Realized per ADR-0020 as an immutable, stateless domain model with
no IO; the actual tool interaction over a real outside system is the runtime's, and the effect on that system
is the system's own. The design and classification set are a structural twin of the frozen Providers
namespace. See `docs/implementation/17-tools.md` sections 2 and 4.

## The two predicates and the two ordered-but-unnamed non-inventions (recorded for the freeze)

Each predicate expresses a constitutional ordering verbatim over tool-owned classifications, via a private
rank map and `>=`: `toolPhaseAtOrAfter` (registration to retirement) and `toolValidationCheckAtOrAfter`
(permission and safety first to compatibility). Tool validation is modeled with an ordering predicate because
`tool-validation.md` explicitly owns "validation ordering" (parallel to prompt-validation). Two
non-inventions are recorded:

- **Execution ordering, no predicate.** `tool-execution.md` owns "execution ordering" and states the steps
  "follow a defined, acyclic order," but it does not enumerate the steps. With no named ordered set, no
  classification and no predicate are grounded; the acyclicity is stated as prose. This mirrors Safety's
  ordered-but-unnamed risk levels.
- **Capability-inheritance precedence, no predicate.** `tool-capabilities.md` resolves overlapping inherited
  capabilities by authority, then owner, then specificity, applying the Authority Hierarchy (`ai/README.md`)
  and the ownership map (`ai/architecture/`). Its inputs are not tool-owned, so the precedence is stated as
  prose, with no tier enum and no predicate (referenced-model non-restatement; mirrors Governance Stage 6 and
  prompt-inheritance).

## Final surface and purity confirmation

- A single explicit barrel (`src/index.ts`), no wildcard `export *`: **28 exported types** and **58 exported
  runtime values** (56 frozen catalogs and description records + 2 predicate functions).
- The only executable logic is the two pure deterministic ordering predicates; there is no IO. Every exported
  catalog is `Object.freeze`d, and each ordering predicate reads a private (non-exported) rank map. All
  descriptions are plain string literals.
- No runtime, mutable state, lifecycle, events, IO, DI, or services (ADR-0020). The namespace imports
  nothing: its dependency edge is `[]` (it references the constitution, the Governance mandates, the Safety
  architecture, and the reasoning/runtime/providers/agents models, the Authority Hierarchy, and the knowledge
  repository but uses no foreign type and imports no package; ADR-0021). `NAMESPACE_DEPS.tools =
  ['governance', 'safety']` (permitted edges, unchanged).
- 100% coverage on all modules; full validation green end to end; two independent audits CLEAN, zero findings
  at every severity (no correction cycle needed).

## What "frozen" means

The namespace's concerns, identities, classifications, principles, invariants, the two orderings, public API,
ownership, and constitutional traceability are settled. Every runtime evaluation the concerns imply
(registering, discovering, activating, selecting, validating, executing, composing, or versioning a concrete
tool) is deferred to the runtime and the operational namespaces, which consume this model and do not modify
it. Governance rules, safety limits, the Authority Hierarchy, reasoning, execution, provider abstraction, and
the outside system are referenced, never recreated. This namespace names no outside system.

## Allowed changes (no architecture review required)

Only these categories may change a frozen tool file without an architecture change process, each still
running the full validation pipeline: **compiler compatibility**, **security vulnerabilities**, **dependency
updates**, and **critical bug fixes** (a genuine defect in existing behavior, for example a description,
ordering, or classification member that does not trace verbatim to its frozen document).

## Any architectural modification requires all of

- a **new ADR** (an Accepted ADR is superseded, never edited in place),
- an **architecture review**,
- an **independent audit**, and
- **full validation** (green end to end).

"Architectural modification" includes any change to a concern's public API or export, an identity,
classification, principle, invariant, or ordering; the introduction of a new predicate or the enumeration of
the execution steps or the capability-inheritance tiers; the reproduction of a referenced model owned by
another owner; a change of purity category (ADR-0024); the dependency graph; or the constitutional
traceability.

## Constitutional layers remain immutable

`ai/` and `knowledge/` remain immutable; no implementation change may modify them (CI constitutional guard).
This freeze adds nothing to the constitution; it conforms to it.

## Downstream work is additive

The next namespace (Agents), the Runtime, and the operational layers consume this model and do not modify it.
Agents compose tools; the runtime carries out tool interactions and bounds them with safety. They may not
modify any frozen tool file except under the allowed-changes policy above with full validation.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
