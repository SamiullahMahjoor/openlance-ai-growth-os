---
id: ADR-0036
title: The Prompt Engine is the Runtime's operational prompt subsystem; it consumes the frozen prompt model and the Provider Engine, preparing execution-ready payloads without re-owning prompt semantics or execution
status: Accepted
date: 2026-08-05
supersedes: []
superseded_by: null
---

# ADR-0036: The Prompt Engine is the Runtime's operational prompt subsystem; it consumes the frozen prompt model and the Provider Engine, preparing execution-ready payloads without re-owning prompt semantics or execution

## Status

**Accepted** (Phase 4, Stage 2). It follows the operational-layer pattern established by ADR-0035, introduces no
duplicate constitutional or engineering truth, changes no frozen work, supersedes nothing, and preserves ADR-0005,
ADR-0006, ADR-0007, ADR-0020, ADR-0021, ADR-0024, ADR-0026 to ADR-0034, and ADR-0035.

## Context

Phase 4 opened the operational layer with the Provider Engine (ADR-0035): operational services are `apps/`-layer
packages that register through the frozen composition-root seam (ADR-0026) and execute behind a governance-cleared
seam, consuming frozen models and re-owning none of them. Stage 2 is the Prompt Engine. A full source reading (the
`ai/prompts/` guide and the frozen `@openlance/aios-prompts` concern models for architecture, assembly, validation,
and lifecycle; `ai/runtime/README.md`; the Stage 1 Provider Engine and ADR-0035) fixes the facts this ADR honors:

- **The Prompts namespace owns the prompt model, not prompt content or execution.** `ai/prompts/README.md`: the
  namespace "owns one thing: the architectural model of prompts ... it never writes a prompt ... never contains a
  prompt," and "prompt content is an operational output produced at runtime." The frozen `@openlance/aios-prompts`
  exports only strongly-typed classifications, immutable ordered arrays (`PROMPT_LAYERS`, `PROMPT_ASSEMBLY_STAGES`,
  `PROMPT_VALIDATION_CHECKS`, `PROMPT_LIFECYCLE_PHASES`), and pure ordering predicates (`promptLayerAtOrAfter`,
  `assemblyStageAtOrAfter`, `validationCheckAtOrAfter`, `promptPhaseAtOrAfter`); it performs no execution and no IO
  (ADR-0020; ADR-0024 category 1). There is no operational compiler in the frozen model to duplicate.
- **The runtime carries and executes; Prompts define how the prompt is built.** `ai/prompts/README.md`: "The runtime
  orchestrates execution, assembles the execution context, and carries and executes the prompt; Prompts define how the
  prompt is built from that context." Boundary: "the determination of knowledge and the assembly of the execution
  context: ai/retrieval/ and ai/runtime/"; "execution, orchestration, and the carrying and executing of a prompt:
  ai/runtime/ and the Providers namespace." So the operational prompt composition is the Prompts namespace's own
  realization, sequenced by the runtime, exactly as provider invocation is the Provider Engine's realization.
- **A composed prompt is transient; a definition is durable architecture.** Prompt invariants: "a prompt is a
  transient instruction, never a source of truth ... never stored"; "never copies, caches, or paraphrases" knowledge.
  Prompt-lifecycle retirement: the composed prompt is retired, "though a durable definition, template, or base prompt
  persists as architecture, not as a prompt."
- **Governance is applied, never restated, and enforced at execution.** Prompt-validation: the first check is
  governance-conformance, which "applies the constitutional validation owned by ai/governance/ ... and never restates"
  it; "validation defines what and order, never the rule." Real governance enforcement is the runtime's, gated in
  Phase 4 by the Provider Engine's clearance seam (ADR-0035).

## Decision

1. **Stage 2 is a new `apps/`-layer package, `@openlance/aios-prompt-engine`, the operational realization of the frozen
   Prompts namespace.** It carries out operational prompt preparation up to expression: definition registration,
   template and inheritance resolution, variable resolution, assembly in the frozen layer order, normalization, and
   validation, driving the frozen `PROMPT_ASSEMBLY_STAGES`, `PROMPT_VALIDATION_CHECKS`, `PROMPT_LAYERS`, and
   `PROMPT_LIFECYCLE_PHASES` and their ordering predicates. It follows the ADR-0035 operational-layer pattern
   (`apps/*`, composition-root seam, no vendor knowledge).

2. **Consume, never recreate; own no prompt semantics.** It consumes the frozen prompt model and re-owns none of it. It
   does not reason (ai/reasoning/), determine or load knowledge (ai/retrieval/), assemble the execution context
   (ai/runtime/ + ai/retrieval/), retain or persist (ai/memory/), or execute (ai/runtime/ + Providers). It composes a
   prompt from context and variables supplied to it; it never fetches, retrieves, or assembles context itself.

3. **Single-direction Prompt to Provider.** The execution-ready representation the engine produces is a frozen
   Provider-Engine `ProviderRequest`. The engine consumes the Provider Engine's request contract and never invokes a
   provider (invocation is the Provider Engine's governance-cleared executor). The dependency direction is permanent:
   Prompt to Provider, never Provider to Prompt.

4. **Governance via the existing model; no second governance model.** The compiled `ProviderRequest` becomes executable
   only through the Provider Engine's governance-cleared executor (ADR-0035); the Prompt Engine neither mints nor
   requires a `GovernanceClearance` for preparation, because preparation is not execution. Its `governance-conformance`
   validation check is a structural presence check that applies, never restates, governance rules. No second governance
   model is introduced.

5. **No prompt caching, storage, versioning, or authoring.** A composed prompt is transient and is never stored or
   cached, so `PromptCache` is not built (constitutionally not owned). The registry holds durable prompt **definitions**
   (architecture, not prompts) in memory for the operational session; this is an operational registry of reusable
   architecture, not durable storage or versioning.

6. **No vendor knowledge (the ADR-0035 invariant carries forward).** The engine holds no vendor SDK, vendor-specific
   request or response model, API URL, or authentication; enforced by a source-scanning guard test. It depends only on
   the neutral `Provider` request contract; concrete adapters remain later sub-stages of the Provider Engine.

7. **Design-first cadence (ADR-0007).** This ADR and `docs/implementation/33-prompt-engine.md` are the Stage 2 design
   artifacts. The framing is the one the Stage 2 mandate specified: the Prompt Engine as the Runtime's operational
   prompt subsystem consuming the frozen prompt model and the Provider Engine without re-owning prompt semantics or
   execution.

## Rationale

Naming the operational realization of the Prompts namespace is exactly what the constitution anticipates ("prompt
content is an operational output produced at runtime") and what ADR-0035 generalized (namespace operational services).
Alternatives considered and rejected: re-owning prompt semantics (would duplicate the frozen model, against "one owner
per concern"); inventing a second governance model at prompt-prep time (against ADR-0035 and "validation ... never the
rule"); a bidirectional or Provider-to-Prompt coupling (would let the execution layer reach into prompt preparation and
break the layering); caching composed prompts (against the transience invariant); and folding prompt composition into a
runtime engine (the Prompts namespace owns composition; the runtime carries and executes, and by ADR-0035 the
operational realization is the namespace's own operational service).

## Consequences

- The `apps/` layer gains its second executable operational service and its first operational-service to
  operational-service dependency (`prompt-engine -> provider-engine`), a legal `app -> app` edge; no dependency-cruiser
  rule and no namespace edge changes.
- Subsequent Phase 4 operational stages (for example Memory) follow the ADR-0035 pattern and may consume prior
  operational services in a single direction. The Prompt Engine's absence of caching is deliberate and constitutional.
- The compiled `ProviderRequest` is inert until executed through the Provider Engine's governed executor; the Prompt
  Engine remains non-executing (it composes, validates, and normalizes only).
- Changing any of these decisions requires a superseding ADR, an architecture review, and full validation. No frozen
  namespace, substrate package, constitution document, dependency rule, or prior ADR's decision changes.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/prompts/README.md` and the frozen
`ai/prompts/prompt-architecture.md`, `prompt-assembly.md`, `prompt-validation.md`, and `prompt-lifecycle.md` (the prompt
model and its ordered stages, checks, layers, and phases), `ai/runtime/README.md` (the runtime carries and executes the
prompt and sequences the operational namespaces), `ai/governance/` (owns the rules a prompt conforms to), and ADR-0020
("Governance provides truth. Runtime performs enforcement").

## Related ADRs

Supersedes none. Builds on ADR-0035 (the Phase 4 operational layer and the governance-cleared execution seam), ADR-0026
(the composition-root seam), ADR-0005 (frozen DI), ADR-0006 (Result), ADR-0007 (design-first), and ADR-0020 / ADR-0021
/ ADR-0024 (the namespace model, dependency policy, and purity categories). Consumes the frozen Phase 2B
`@openlance/aios-prompts` model and the Phase 4 Stage 1 `@openlance/aios-provider-engine` request contract.
