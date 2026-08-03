# 18. Agents namespace implementation design

The implementation design for `@openlance/aios-agents`, the package that conforms to the frozen `ai/agents/`
constitutional namespace. It follows the namespace development lifecycle (ADR-0023): constitution read in
full, design recorded here, no architecture invented. Like the seven prior Phase 2B namespaces, Agents was
implemented as one cohesive cycle at explicit request; the design and discipline are identical.

## 1. Ownership

Agents owns the **actor model of the AI layer**: what an agent is as an actor within the AI Operating System,
and how an agent is composed, identified, capable, permitted, specialized, coordinated, communicating,
delegating, and evolved (`ai/agents/README.md`, `ai/agents/agents.md`; ownership-map.md assigns Agents
"Actors. Performing work as governed, bounded, composed actors"). It owns the agent model only. An agent
composes the operational namespaces (reasoning, retrieval, memory, prompts, and, in future, tools and
providers) under governance and owns none of them; it never orchestrates, schedules, or executes
(`ai/runtime/`), never defines the rules that bound it (`ai/governance/`), and never becomes an orchestration
system, a framework, a protocol, a provider, a model, or code.

## 2. Category (ADR-0024) and the purity reconciliation

ADR-0024 does **not** enumerate Agents among its examples, but ADR-0024 §42 requires each namespace's category
to be **declared in its implementation design when it is designed** - so this declaration needs no new ADR.
Agents owns the actor **model** (truth about what an agent is), not an external integration, not orchestration
or execution, and not application composition. It is therefore declared **category 1, Pure Domain Model**, the
same shape as Governance, Safety, and Prompts. The reconciliation with ADR-0020 is the standard one, and it
accommodates the single predicate:

- **ADR-0020** fixes how every technology-neutral constitutional namespace is realized in code: an "immutable,
  stateless domain model... a set of types, frozen data, and pure predicates... no IO".
- **ADR-0024 category 1** "contains domain models, classifications, immutable definitions, and **pure
  predicates**," and its example, Governance, itself exposes ordering predicates.
- The constitution independently forbids this namespace from orchestrating, scheduling, or executing, and from
  being an orchestration system or code (`ai/agents/README.md`; `agent-boundaries.md` Execution and
  Implementation boundaries), and is supreme over any ADR.

Category 3 (Runtime Service) is explicitly wrong: an agent "never orchestrates, schedules, or executes," which
are owned by `ai/runtime/`; coordination is *structure*, not execution. Category 5 (Composition Root) is the
Operations namespace, which builds the application and performs DI composition; an agent "composes the
operational namespaces" only as a model concept. The package is thus **types, frozen data, and one pure
ordering predicate**, with every runtime evaluation (resolving, orchestrating, executing a concrete agent)
deferred to the runtime.

## 3. The one predicate

`agentPhaseAtOrAfter(a, b)` - the **lifecycle-phase order** (`agent-lifecycle.md`): registration < discovery <
activation < operation < retirement ("each phase precedes the next"), realized via a private rank map and
`>=`, over agent-owned inputs and outputs (the boundary rule inherited from Governance,
`docs/implementation/10-governance.md` section 7a). The unordered classifications (`AgentPart`,
`AgentBoundary`) carry no predicate. Agents has no validation concern (validation of an agent's tool use is
owned by `ai/tools/tool-validation.md`), so there is no validation-ordering predicate; and versioning is
definitions only (see below), so there is no versioning aspect. The lifecycle ordering is the namespace's only
constitutional ordering, so there is exactly one predicate.

## 4. Public API and module layout

One module per concern, plus a namespace-root module, all re-exported through a single explicit barrel
(`src/index.ts`, no wildcard). Each concern models the two normative sections of the Agent Document Standard -
**Principles** and **Invariants** - and, where the **Specification** enumerates a genuine closed domain set,
that classification.

- `namespace.ts` - `AgentInvariant` (8), `AgentConcern` (10).
- `agent-architecture.ts` - principles (4), `AgentPart` (4), invariants (5).
- `agent-lifecycle.ts` - principles (4), `AgentLifecyclePhase` (5, ordered), invariants (5), predicate
  `agentPhaseAtOrAfter`.
- `agent-capabilities.ts` - principles (4), invariants (5). Definitions only.
- `agent-permissions.ts` - principles (4), invariants (5). Definitions only.
- `agent-coordination.ts` - principles (4), invariants (5). Definitions only.
- `agent-communication.ts` - principles (4), invariants (5). Definitions only.
- `agent-delegation.ts` - principles (4), invariants (5). Definitions only.
- `agent-specialization.ts` - principles (4), invariants (5). Definitions only.
- `agent-boundaries.ts` - principles (4), `AgentBoundary` (6), invariants (5).
- `agent-versioning.ts` - principles (4), invariants (5). Definitions only.

**Classification vs. definitions-only.** The modeling rule is the one recorded in
`docs/implementation/13-retrieval.md` section 4: a Specification section becomes a classification only where it
enumerates a genuine closed domain set - a homogeneous taxonomy of named members the model refers to by
identity, restated in the invariants. `AgentPart` (4: identity, capabilities, permissions, specialization,
restated in the "composed of..." invariant) mirrors `ProviderPart`/`ToolPart`; `AgentLifecyclePhase` (5,
ordered, with predicate) mirrors the other lifecycle concerns; `AgentBoundary` (6) mirrors the other boundary
concerns. Two deliberate non-inventions:

- **Coordination and communication topologies are not modeled.** `agent-coordination.md` describes two
  topologies across separate bullets (a supervisor-and-worker hierarchy with supervisor/worker roles, and a
  peer topology) rather than enumerating one closed set of named topologies or roles, and the invariants state
  acyclicity and direction-follows-authority rather than a `{supervisor, worker, peer}` taxonomy. Choosing a
  specific enumeration (2 topologies vs 3 roles, and the collective noun) is not dictated by the text, so - as
  with tool-execution's ordered-but-unnamed steps - it would be invention; the concern is definitions only,
  and the topologies are stated as prose in the principles and invariants. `agent-communication.md` likewise
  describes its topology as a range ("from direct exchange between two agents to broadcast among many"), not a
  closed set, so it too is definitions only.
- **Versioning is definitions only**, matching the parallel prompt-versioning concern: the agent-versioning
  Specification narrates heterogeneous facets (versioning, evolution, version compatibility, change governance
  and conflict), not the clean `{version-rules, evolution, migration, deprecation}` aspect set that the
  provider/tool versioning concerns enumerate (which those namespaces modeled as a `VersioningAspect`).

**Referenced models.** The governance mandates, permission-governance, autonomy bounds, escalation, change
governance (`ai/governance/`); the reasoning, retrieval, memory, prompts, tools, and providers an agent
composes (their namespaces); the orchestration and execution (`ai/runtime/`); the agent-category map
(`ai/architecture/agent-map.md`); the Authority Hierarchy (`ai/README.md`); and business truth (the knowledge
repository) are all referenced in prose and never recreated as an agent classification (referenced-model
non-restatement rule). The capability/permission/role-composition inheritance precedence (authority, then
owner, then specificity/narrower-scope) is stated as prose only, with no tier enum and no predicate, because
its inputs are not agent-owned - the same discipline as Governance Stage 6, prompt-inheritance, and
tool-capabilities.

## 5. Dependency usage

`NAMESPACE_DEPS.agents = ['governance', 'reasoning', 'retrieval', 'memory', 'prompts', 'tools', 'providers']`
permits edges to all seven composed/foundational namespaces - the broadest allow-set in the layer. No agent
concern's model uses a type owned by any of them; all, plus the runtime, the Authority Hierarchy, and the
knowledge repository, are referenced in prose, never restated or imported (referenced-model non-restatement;
ADR-0021) - so the package imports nothing and its dependency-graph edge is `[]`. It uses no substrate package.

## 6. Lifecycle, state, error, and event ownership

By ADR-0020 all four are empty for Agents: **lifecycle** none (the five lifecycle phases and the other
classifications are modeled *data*, not a package lifecycle; the package does not boot, run, or shut down);
**state** none (the model is immutable/frozen); **errors** none (it performs no execution); **events** none.
These empty sections are the correct shape of a Pure Domain Model, not gaps.

## 7. Testing strategy (ADR-0022)

One test file per module. Every classification's members, count, and constitutional order are asserted against
the constitution (`toEqual` on the full array); every description is asserted non-empty; immutability is
asserted (`Object.isFrozen`); and the one ordering predicate is proven total and deterministic across its
whole matrix (`agentPhaseAtOrAfter` 5x5, against the declared order) plus explicit true/false cases. Executable
code is at 100% coverage; there is no pure-data-only module to exclude. The benchmark measures the one
predicate only (Rule 5). No integration tests yet (no downstream consumer exists).

## 8. Acceptance criteria

- Every exported symbol traces directly to a frozen `ai/agents/` document, and no agent runtime, orchestrator,
  or executor is exported.
- Full validation green: build, typecheck, lint, format, depcruise, arch:check, graph:check, docs-check, test
  (100% on executable code), bench, docs.
- Zero regression; `ai/`, `knowledge/`, the frozen substrate, and the frozen Governance, Providers, Memory,
  Retrieval, Safety, Reasoning, Prompts, and Tools namespaces unchanged; the dependency graph unchanged
  (`agents: []`).
