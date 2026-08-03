# Agents Namespace, Freeze Declaration

**Status:** FROZEN (all ten agent concerns implemented, validated, and independently audited twice).
**Package:** `@openlance/aios-agents` (`packages/namespaces/agents`).
**Scope:** the Agents namespace domain model, the ninth namespace of Phase 2B, built on top of the immutable
Phase 2A substrate, the frozen Governance, Providers, Memory, Retrieval, Safety, Reasoning, Prompts, and
Tools namespaces, and the frozen `ai/` and `knowledge/` constitution.

The Agents namespace is **immutable**. It states the actor model of the AI layer: what an agent is as an
actor within the AI Operating System, and how an agent is composed, identified, capable, permitted,
specialized, coordinated, communicating, delegating, and evolved, so that work is performed by governed,
bounded, deterministic actors. An agent composes the operational namespaces (reasoning, retrieval, memory,
prompts, and, in future, tools and providers) under governance and owns none of them; it never orchestrates,
schedules, or executes, never reasons or retrieves or composes a prompt itself, and never defines an
orchestration system, a framework, a protocol, a provider, a model, or code.

## What was built (the ten concerns + namespace)

Each concern is one source module, tracing verbatim to its frozen `ai/agents/<file>.md` document. Each models
the two normative sections of the Agent Document Standard (Principles, Invariants) and, where the
Specification enumerates a genuine closed domain set, that classification.

| Module | Concern | Specification classification | Predicate |
|---|---|---|---|
| `namespace.ts` | namespace-wide | `AGENT_INVARIANTS` (8), `AGENT_CONCERNS` (10) | none |
| `agent-architecture.ts` | Agent Architecture | `AgentPart` (4: identity, capabilities, permissions, specialization) | none |
| `agent-lifecycle.ts` | Agent Lifecycle | `AgentLifecyclePhase` (5, ordered) | `agentPhaseAtOrAfter` |
| `agent-capabilities.ts` | Agent Capabilities | none (process facets) | none |
| `agent-permissions.ts` | Agent Permissions | none (process facets) | none |
| `agent-coordination.ts` | Agent Coordination | none (topologies described, not enumerated) | none |
| `agent-communication.ts` | Agent Communication | none (topology described as a range) | none |
| `agent-delegation.ts` | Agent Delegation | none (process facets) | none |
| `agent-specialization.ts` | Agent Specialization | none (process facets) | none |
| `agent-boundaries.ts` | Agent Boundaries | `AgentBoundary` (6) | none |
| `agent-versioning.ts` | Agent Versioning | none (heterogeneous facets, like prompt-versioning) | none |

The ten concerns match the ten concerns in the inventory `ai/agents/agents.md` exactly.

## Category and purity

ADR-0024 does not enumerate Agents among its examples; per ADR-0024 §42 its category is declared here (no new
ADR). Agents owns the actor **model** (truth about what an agent is), not orchestration or execution (owned by
ai/runtime/) and not application composition or DI (owned by the Operations namespace), so it is declared
**category 1 (Pure Domain Model)**, the same shape as Governance, Safety, and Prompts. Category 1 explicitly
"contains domain models, classifications, immutable definitions, and pure predicates," and Governance
(category 1) itself exposes ordering predicates; the one agent predicate is the constitution's own ordering,
not orchestration. Category 3 (Runtime Service) and category 5 (Composition Root) were considered and
explicitly rejected. See `docs/implementation/18-agents.md` section 2.

## The one predicate and the deliberate non-inventions (recorded for the freeze)

The single predicate `agentPhaseAtOrAfter` expresses the lifecycle-phase ordering (registration to
retirement) verbatim over agent-owned classifications, via a private rank map and `>=`. Three deliberate
non-inventions are recorded:

- **Coordination and communication topologies are not modeled.** `agent-coordination.md` describes two
  topologies across separate bullets (a supervisor-and-worker hierarchy with supervisor/worker roles, and a
  peer topology) rather than enumerating one closed set of named topologies or roles restated in the
  invariants; and `agent-communication.md` describes its topology as a range ("from direct exchange between
  two agents to broadcast among many"). Choosing a specific enumeration is not dictated by the text, so both
  concerns are definitions only, with the topologies stated as prose. This mirrors tool-execution's
  ordered-but-unnamed steps.
- **Versioning is definitions only**, matching the parallel prompt-versioning concern: the agent-versioning
  Specification narrates heterogeneous facets (versioning, evolution, version compatibility, change governance
  and conflict), not the clean `{version-rules, evolution, migration, deprecation}` aspect set the
  provider/tool versioning concerns enumerate.
- **The inheritance precedence is prose only.** Capability, permission, and role-composition inheritance
  resolve overlaps by authority, then owner, then specificity/narrower-scope, applying the Authority Hierarchy
  (`ai/README.md`) and the ownership map (`ai/architecture/`). Its inputs are not agent-owned, so no tier enum
  and no predicate are created (referenced-model non-restatement; mirrors Governance Stage 6,
  prompt-inheritance, tool-capabilities). Both independent audits confirmed all three decisions faithful.

## Final surface and purity confirmation

- A single explicit barrel (`src/index.ts`), no wildcard `export *`: **25 exported types** and **51 exported
  runtime values** (50 frozen catalogs and description records + 1 predicate function).
- The only executable logic is the one pure deterministic ordering predicate; there is no IO. Every exported
  catalog is `Object.freeze`d, and the ordering predicate reads a private (non-exported) rank map. All
  descriptions are plain string literals.
- No runtime, mutable state, lifecycle, events, IO, DI, or services (ADR-0020). The namespace imports nothing:
  its dependency edge is `[]` (it references the constitution, Governance, the six composed namespaces, the
  runtime, the Authority Hierarchy, and the knowledge repository but uses no foreign type and imports no
  package; ADR-0021). `NAMESPACE_DEPS.agents = ['governance', 'reasoning', 'retrieval', 'memory', 'prompts',
  'tools', 'providers']` (permitted edges, the broadest in the layer, unchanged).
- 100% coverage on all modules; full validation green end to end; two independent audits CLEAN, zero findings
  at every severity (no correction cycle needed).

## What "frozen" means

The namespace's concerns, identities, classifications, principles, invariants, the lifecycle ordering, public
API, ownership, and constitutional traceability are settled. Every runtime evaluation the concerns imply
(registering, discovering, activating, operating, retiring, coordinating, delegating, or versioning a concrete
agent) is deferred to the runtime and the operational namespaces, which consume this model and do not modify
it. Governance rules, autonomy bounds, the Authority Hierarchy, the composed namespaces, and the runtime are
referenced, never recreated.

## Allowed changes (no architecture review required)

Only these categories may change a frozen agent file without an architecture change process, each still
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
the coordination topologies, the versioning aspects, or the inheritance precedence tiers; the reproduction of
a referenced model owned by another owner; a change of purity category (ADR-0024); the dependency graph; or the
constitutional traceability.

## Constitutional layers remain immutable

`ai/` and `knowledge/` remain immutable; no implementation change may modify them (CI constitutional guard).
This freeze adds nothing to the constitution; it conforms to it.

## Downstream work is additive

The Runtime, the Evaluation and Operations namespaces, and the operational layers consume this model and do
not modify it. The runtime orchestrates and executes agents; Operations builds the application that wires the
namespaces together. They may not modify any frozen agent file except under the allowed-changes policy above
with full validation.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
