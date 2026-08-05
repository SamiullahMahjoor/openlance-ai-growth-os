---
id: ADR-0041
title: The Agent Engine is the Runtime's operational agent subsystem and the first orchestration engine; it composes the six foundational engines' contracts into an immutable execution plan through legal app-to-app edges, and never executes, orchestrates, schedules, or selects a provider
status: Accepted
date: 2026-08-05
supersedes: []
superseded_by: null
---

# ADR-0041: The Agent Engine is the Runtime's operational agent subsystem and the first orchestration engine; it composes the six foundational engines' contracts into an immutable execution plan through legal app-to-app edges, and never executes, orchestrates, schedules, or selects a provider

## Status

**Accepted** (Phase 4, Stage 7). It follows the operational-layer pattern established by ADR-0035, introduces no
duplicate constitutional or engineering truth, changes no frozen work, supersedes nothing, and preserves ADR-0005,
ADR-0006, ADR-0007, ADR-0020, ADR-0021, ADR-0024, ADR-0026 to ADR-0034, and ADR-0035 to ADR-0040.

## Context

Phase 4 built six operational engines (ADR-0035 Provider, ADR-0036 Prompt, ADR-0037 Memory, ADR-0038 Retrieval,
ADR-0039 Tool, ADR-0040 Reasoning). Five are **foundational** (Provider, Memory, Retrieval, Tool, Reasoning), each
consuming only its frozen namespace model plus the substrate, with no `app -> app` edge; the Prompt Engine additionally
consumes the Provider Engine's request contract (a single-direction `prompt-engine -> provider-engine` `app -> app`
edge, ADR-0036). None of the six is an orchestration engine composing multiple foundational engines. Stage 7 is the
Agent Engine, the operational realization of the frozen `@openlance/aios-agents` namespace. A full source reading (the
`ai/agents/` guide and the frozen `@openlance/aios-agents` concern models for architecture, lifecycle, capabilities,
permissions, coordination, delegation, specialization, and boundaries; the six engine public barrels;
`.dependency-cruiser.cjs` and `scripts/arch-regression.mjs`; ADR-0035 and ADR-0036) fixes the facts this ADR honors. No
Ambiguity Gate fired: the mandate is aligned with the frozen model, but two genuine architectural decisions must be
recorded, because the Agent Engine is the first **orchestration** engine, composing all six foundational engines:

- **An agent composes the six operational namespaces and owns none; it never executes.** The frozen
  `@openlance/aios-agents` barrel: "an agent is a composition of the operational namespaces under governance, and the
  runtime orchestrates and executes it." `agent-boundaries` `composition`: "An agent composes reasoning, retrieval,
  memory, and prompts, and, in future, tools and providers, and owns none of them." `agent-boundaries` `execution`: "An
  agent is orchestrated, scheduled, and executed by ai/runtime/; an agent never orchestrates, schedules, or executes,
  and it never selects a provider or model, which is owned by the Providers namespace." Invariant
  `never-orchestrates-schedules-executes-or-selects-provider-or-model`.
- **The runtime, not the agent, sequences and combines results.** ADR-0035 (from `ai/runtime/README.md`): "Runtime
  sequences and combines their results." So the Agent Engine must produce a **static plan** (a blueprint of what to
  invoke), never gather-and-combine the engines' outputs itself, which would be the runtime's orchestration.
- **The `app -> app` edges are legal.** `.dependency-cruiser.cjs` restricts only substrate-among-substrate and
  namespace-among-namespace edges; there is no `apps/` layer rule, and `scripts/arch-regression.mjs` encodes no
  `app -> app` prohibition. The frozen `ai/architecture/dependency-map.md` (`NAMESPACE_DEPS.agents`) records that the
  Agents namespace depends on exactly `governance, reasoning, retrieval, memory, prompts, tools, providers`; the Agent
  Engine's dependency on the six engines realizes that composition at the operational layer.

## Decision

1. **Stage 7 is a new `apps/`-layer package, `@openlance/aios-agent-engine`, the operational realization of the frozen
   Agents namespace and the first orchestration engine.** It registers agent definitions (identity, capabilities,
   permissions, specialization), and, for a request, it **composes** the agent's steps over the six operational engines
   (each step a typed request for one engine), **validates** them against the agent's capabilities and permissions,
   **coordinates** any multi-agent topology (directed and acyclic), and produces an immutable `AgentExecutionPlan`. It
   follows the ADR-0035 operational-layer pattern (`apps/*`, composition-root seam, no vendor knowledge).

2. **The Agent Engine is the composition owner; it consumes the six foundational engines and re-owns none.** Its `src`
   edge set is `{ agents, provider-engine, prompt-engine, memory-engine, retrieval-engine, tool-engine, reasoning-engine,
   di, events, plugins, errors, kernel }` (twelve): `app -> namespace` (agents), `app -> app` (the six engines), and
   `app -> substrate` (the rest). It consumes each engine's public **request contract** (`ReasoningRequest`,
   `RetrievalRequest`, `MemoryRequest`, `CompositionInput`, `ToolRequest`, `ProviderNeed`) to type the plan's steps; it
   imports each engine only through its public barrel, recreates none of them, and each engine remains independently
   replaceable. These are the first `app -> app` edges from an engine composing multiple foundational engines (the
   single-direction `prompt-engine -> provider-engine` edge of ADR-0036 preceded them), and are legal (no
   dependency-cruiser rule and no
   architectural-regression scenario forbids an `apps/` edge; the graph stays acyclic because none of the six engines
   depends on the agent-engine, and the pre-existing `prompt-engine -> provider-engine` edge points to a foundational
   engine, never back to an orchestration engine).

3. **The Agent Engine composes a static plan and stops; it never executes, orchestrates, schedules, or combines
   results.** It produces an immutable `AgentExecutionPlan` (the agent, the task, the validated steps, and the validated
   coordination) and stops. It invokes no engine, sequences and combines no results, opens no network, and mints no
   clearance; executing the plan (invoking each engine, sequencing and combining their results, selecting a provider) is
   the runtime's, a later Phase 4 stage. This makes "an agent never orchestrates, schedules, or executes" structural: the
   engine has no path to execution.

4. **The Agent Engine never selects a provider or model.** A provider step carries a provider-neutral `ProviderNeed`,
   never a selected provider; selection is owned by the Providers namespace and performed by the Provider Engine at
   execution time. The Agent Engine likewise constructs no prompt, reasons nothing, retrieves nothing, and manages no
   memory: it composes those engines' contracts and performs none of their internal work.

5. **Governance is applied, never defined or minted.** An agent acts only within its capabilities (what it can do) and
   its permissions (what it may do, least privilege), and its coordination is directed and acyclic; a step outside the
   agent's capabilities or permissions, or a coordination that would form a cycle, is refused. The engine applies these
   bounds structurally and mints no clearance and defines no governance rule; the autonomy and escalation rules remain
   ai/governance/'s.

6. **No vendor knowledge (the ADR-0035 invariant carries forward).** The engine holds no vendor client library, model,
   URL, or auth, and it never executes; both are enforced by guard tests.

7. **Design-first cadence (ADR-0007).** This ADR and `docs/implementation/38-agent-engine.md` are the Stage 7 artifacts.
   A new ADR is warranted not because a stage completed, but because Stage 7 makes two genuinely new architectural
   decisions: the first orchestration engine composing multiple foundational engines through `app -> app` edges, and the
   compose-a-static-plan-never-execute boundary that distinguishes agent composition from runtime orchestration.

## Rationale

Naming the operational realization of the Agents namespace as the composition owner is what the constitution
anticipates. The two genuine decisions are forced by the frozen model: the `composition` boundary and
`NAMESPACE_DEPS.agents` require consuming the six engines (legal `app -> app` edges), and the `execution` boundary plus
ADR-0035's "Runtime sequences and combines their results" require producing a static plan rather than executing or
combining. Alternatives rejected: executing the plan in-engine (violates the `execution` boundary; the runtime's);
gathering and combining the engines' outputs (that is the runtime's orchestration); selecting a provider or model
(violates the boundary; the Providers namespace's); re-owning any engine (would duplicate a frozen realization and break
independent replaceability); and refusing the `app -> app` edges (would contradict `NAMESPACE_DEPS.agents` and make the
composition owner impossible).

## Consequences

- The `apps/` layer gains its first **orchestration** service, composing all six foundational engines. The Agent Engine depends
  on the six foundational engines; none of them depends on the agent-engine, so the graph stays acyclic and each engine stays independently
  replaceable.
- Executing an `AgentExecutionPlan` (invoking the engines, sequencing and combining their results, selecting providers,
  minting clearances) is deferred to the Runtime Execution Engine (a later Phase 4 stage), in the constitutionally
  correct direction: the agent composes, the runtime executes.
- The engine remains non-executing, provider-neutral, and deterministic; a later runtime carries out the plan it
  composes.
- Changing any of these decisions requires a superseding ADR, an architecture review, and full validation. No frozen
  namespace, substrate package, constitution document, dependency rule, or prior ADR's decision changes.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/agents/README.md` and the frozen
`ai/agents/agent-architecture.md`, `agent-lifecycle.md`, `agent-capabilities.md`, `agent-permissions.md`,
`agent-coordination.md`, `agent-delegation.md`, `agent-specialization.md`, and `agent-boundaries.md` (the agent model,
parts, phases, capabilities, permissions, coordination, and boundaries), `ai/runtime/README.md` (the runtime
orchestrates, sequences, combines, and executes an agent), `ai/providers/README.md` (a provider is selected and executed
by the Providers namespace and the runtime), `ai/governance/` (owns the autonomy and escalation rules the agent
applies), `ai/architecture/dependency-map.md` (`NAMESPACE_DEPS.agents`), and ADR-0020.

## Related ADRs

Supersedes none. Builds on ADR-0035 (the Phase 4 operational layer), ADR-0026 (the composition-root seam), ADR-0005
(frozen DI), ADR-0006 (Result), ADR-0007 (design-first), and ADR-0020 / ADR-0021 / ADR-0024. Consumes the frozen Phase
2B `@openlance/aios-agents` model and the six Phase 4 engines (ADR-0035 to ADR-0040), whose public contracts it composes.
Anticipates the Stage 8 Runtime Execution Engine, which executes the plans it composes.
