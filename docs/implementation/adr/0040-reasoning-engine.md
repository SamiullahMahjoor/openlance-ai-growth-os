---
id: ADR-0040
title: The Reasoning Engine is the Runtime's operational reasoning subsystem; it consumes only the frozen reasoning model and the substrate, performs deterministic structural reasoning over provided knowledge, and produces a governed reasoning plan without invoking any provider or executing
status: Accepted
date: 2026-08-05
supersedes: []
superseded_by: null
---

# ADR-0040: The Reasoning Engine is the Runtime's operational reasoning subsystem; it consumes only the frozen reasoning model and the substrate, performs deterministic structural reasoning over provided knowledge, and produces a governed reasoning plan without invoking any provider or executing

## Status

**Accepted** (Phase 4, Stage 6). It follows the operational-layer pattern established by ADR-0035, introduces no
duplicate constitutional or engineering truth, changes no frozen work, supersedes nothing, and preserves ADR-0005,
ADR-0006, ADR-0007, ADR-0020, ADR-0021, ADR-0024, ADR-0026 to ADR-0034, and ADR-0035 to ADR-0039.

## Context

Phase 4 builds the operational layer as `apps/`-layer services that register through the frozen composition-root seam
(ADR-0026) and consume frozen models, re-owning none (ADR-0035 Provider Engine, ADR-0036 Prompt Engine, ADR-0037 Memory
Engine, ADR-0038 Retrieval Engine, ADR-0039 Tool Engine). Stage 6 is the Reasoning Engine. A full source reading (the
`ai/reasoning/` guide and the frozen `@openlance/aios-reasoning` concern models for lifecycle, workflow, stages,
strategies, validation, consistency, uncertainty, conclusion-formation, quality, and boundaries) fixes the facts this
ADR must honor. Unlike Stages 3 to 5, no Ambiguity Gate fired: the Stage 6 mandate is aligned with the frozen model
(reason only, execute nothing, produce plans, consume only permitted dependencies, no illegal `app -> app` edges). One
architectural clarification is nonetheless genuine and must be recorded, because a naive reading of "Reasoning Engine"
(a service that calls a model to think) would violate the constitution:

- **Reasoning is a model of cognition, and the reasoning mechanism is the runtime's, expressed through providers.** The
  frozen `@openlance/aios-reasoning` barrel: "It performs no reasoning and no IO ... the mechanism that carries a
  concrete reasoning along its stages is the runtime's; the namespace defines no algorithm, chain of thought, ...
  provider, model, protocol, or code." `reasoning-boundaries` `expression`: "A reasoning is expressed as prompts and
  executed by providers, and applied by agents, owned by their namespaces; it never constructs a prompt, selects a
  model, or acts." So invoking an LLM is **not** reasoning's operational work; it is the runtime's, through the Provider
  Engine, driven by an agent.
- **Reasoning consumes provided knowledge; it never retrieves.** `reasoning-boundaries` `knowledge`: "A reasoning
  reasons over retrieved knowledge and never discovers, selects, loads, or owns it." The retrieved knowledge is provided
  input; the engine reaches into no Retrieval Engine.
- **Reasoning applies governance; it never defines or mints it.** `reasoning-boundaries` `governance`: "A reasoning
  applies the governing rules and never defines them ... it escalates rather than conclude outside the rules."
- **The frozen model is deterministic and structural.** Its executable surface is three pure predicates
  (`transitionAllowed`, `reasoningPhaseAtOrAfter`, `reasoningStepAtOrAfter`) over frozen classifications (lifecycle
  phases, workflow steps, the ten-stage state machine, four strategies, four validation dimensions, uncertainty kinds,
  quality properties). "The same task, retrieved knowledge, and governing rules produce the same outcome; there is no
  randomness."

## Decision

1. **Stage 6 is a new `apps/`-layer package, `@openlance/aios-reasoning-engine`, the operational realization of the
   frozen Reasoning namespace.** It carries out operational reasoning over the frozen model: it registers the retrieved
   knowledge (premises) a reasoning consumes, and, for a request, it **frames** the task, **decomposes** it into parts
   under the frozen strategies, **validates** it through the frozen conjunctive dimensions (assumption identification,
   grounding, evidence sufficiency, governed validation), and **produces** a governed reasoning plan whose terminal
   stage is `concluded`, `inconclusive`, or `escalated`, driving the frozen `REASONING_WORKFLOW_STEPS`,
   `REASONING_LIFECYCLE_PHASES`, `REASONING_STAGES` / `transitionAllowed`, `REASONING_STRATEGIES`, and
   `REASONING_VALIDATION_DIMENSIONS`. It follows the ADR-0035 operational-layer pattern.

2. **The Reasoning Engine reasons deterministically and structurally; it invokes no provider and performs no inference.**
   A naive "Reasoning Engine" that calls an LLM would violate the frozen `expression` boundary (reasoning is expressed
   as prompts and executed by providers, owned by their namespaces) and the "no randomness" determinism invariant. So
   the engine performs the deterministic, structural part of reasoning the frozen model owns: it structures the
   reasoning (framing, decomposition), applies the validation dimensions, classifies uncertainty, and determines a
   governed disposition, producing a **reasoning plan**. The actual inference (running the plan through a prompt and a
   provider) is a later execution stage, driven by an agent. The engine holds no vendor knowledge and no model, enforced
   by a guard test.

3. **The Reasoning Engine produces a plan and stops; it executes nothing.** Per the `transformation` boundary, "A
   reasoning ... stops at a validated governed conclusion or a governed absence of one; it never executes, orchestrates,
   or schedules, which are owned by ai/runtime/." The engine loads nothing, retrieves nothing, expresses nothing,
   schedules nothing, persists nothing, and mints no governance clearance.

4. **The Reasoning Engine consumes no operational service (foundational).** It reasons over **provided** knowledge
   (premises registered as input, exactly as the Retrieval Engine determines over provided candidates and the Tool
   Engine prepares over provided tools), applies a **provided** governance verdict, and composes no other engine.
   Composing retrieval, reasoning, prompts, and providers into an executed thought is the agent's and the runtime's, a
   later stage. It consumes only the frozen `@openlance/aios-reasoning` model and the substrate (`di`, `events`,
   `errors`, `plugins`, `kernel`); its `src` edge set is `{ reasoning, di, events, errors, plugins, kernel }` (six),
   with no `app -> app` edge.

5. **Governance precedes conclusion, applied not defined (and never minted).** The four frozen validation dimensions run
   in order and are conjunctive. Grounding and evidence sufficiency are structural (the reasoning rests on at least one
   registered premise or stated assumption, and on sufficient premises); where they do not hold, the engine yields a
   governed absence (`inconclusive`, with a classified uncertainty), never an invented conclusion
   ("no-conclusion-is-preferable-to-an-unsound-one"). The governed-validation dimension applies the request's governance
   verdict; a denied verdict `escalates`. The engine restates no governance rule and mints no clearance.

6. **Design-first cadence (ADR-0007).** This ADR and `docs/implementation/37-reasoning-engine.md` are the Stage 6
   artifacts. A new ADR is warranted not because a stage completed, but because the operational realization of a
   category-2 "Pure Algorithms" namespace introduces a genuine architectural clarification: a "Reasoning Engine" that
   deliberately performs **no inference and invokes no provider**, producing a deterministic governed reasoning plan and
   deferring the cognition to a later execution stage. Recording it prevents the naive misreading (as ADR-0035 did for
   the Provider Engine).

## Rationale

Naming the operational realization of the Reasoning namespace is what the constitution anticipates and what ADR-0035
generalized. The one genuine decision, that the engine reasons deterministically and structurally without a provider and
produces a plan, is forced by the frozen `expression` and `transformation` boundaries and the determinism invariant.
Alternatives rejected: invoking an LLM to "reason" (violates the `expression` boundary, introduces vendor knowledge, and
breaks determinism); retrieving its own knowledge (violates the `knowledge` boundary; the Retrieval Engine determines
knowledge, provided here as input); defining or minting governance (violates the `governance` boundary and ADR-0031);
executing or scheduling the reasoning (the runtime's, per `transformation`); and re-owning the reasoning model (would
duplicate the frozen model).

## Consequences

- The `apps/` layer gains a sixth operational service and its fourth **foundational** one (with the Memory, Retrieval,
  and Tool Engines): it consumes no operational service. Its `src` edge set is `{ reasoning, di, events, errors,
  plugins, kernel }` (six), with no `app -> app` edge.
- Composing retrieval, reasoning, prompts, and providers into an executed thought (running a reasoning plan through a
  provider) is deferred to the agent and runtime execution stages, in the constitutionally-correct direction.
- The engine remains deterministic, non-executing, and provider-free; a later stage performs the inference the plan
  frames, and the governance enforcement engine (a later Phase 4 stage) owns any clearance.
- Changing any of these decisions requires a superseding ADR, an architecture review, and full validation. No frozen
  namespace, substrate package, constitution document, dependency rule, or prior ADR's decision changes.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/reasoning/README.md` and the frozen
`ai/reasoning/reasoning-lifecycle.md`, `reasoning-workflow.md`, `reasoning-stages.md`, `reasoning-strategies.md`,
`reasoning-validation.md`, `reasoning-consistency.md`, `uncertainty-handling.md`, `conclusion-formation.md`,
`reasoning-quality.md`, and `reasoning-boundaries.md` (the reasoning model, phases, steps, stages, strategies,
dimensions, and boundaries), `ai/retrieval/README.md` (the knowledge a reasoning consumes is determined there, provided
as input), `ai/providers/README.md` and `ai/prompts/README.md` (a reasoning is expressed as prompts and executed by
providers, owned there), `ai/governance/` (owns the rules a reasoning applies), `ai/runtime/README.md` (the runtime
carries a reasoning along its stages), and ADR-0020.

## Related ADRs

Supersedes none. Builds on ADR-0035 (the Phase 4 operational layer), ADR-0026 (the composition-root seam), ADR-0005
(frozen DI), ADR-0006 (Result), ADR-0007 (design-first), and ADR-0020 / ADR-0021 / ADR-0024. Consumes the frozen Phase
2B `@openlance/aios-reasoning` model. Relates to ADR-0038 (the Retrieval Engine, whose determined knowledge a reasoning
consumes) and ADR-0036 / ADR-0035 (the Prompt and Provider Engines, through which a reasoning is later expressed and
executed).
