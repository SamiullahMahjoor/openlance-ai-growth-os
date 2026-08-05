---
id: ADR-0038
title: The Retrieval Engine is the Runtime's operational knowledge-determination subsystem; it consumes only the frozen retrieval model and the substrate, determines over provided candidates deterministically, and never reaches into memory or any operational service
status: Accepted
date: 2026-08-05
supersedes: []
superseded_by: null
---

# ADR-0038: The Retrieval Engine is the Runtime's operational knowledge-determination subsystem; it consumes only the frozen retrieval model and the substrate, determines over provided candidates deterministically, and never reaches into memory or any operational service

## Status

**Accepted** (Phase 4, Stage 4). It follows the operational-layer pattern established by ADR-0035, introduces no
duplicate constitutional or engineering truth, changes no frozen work, supersedes nothing, and preserves ADR-0005,
ADR-0006, ADR-0007, ADR-0020, ADR-0021, ADR-0024, ADR-0026 to ADR-0034, ADR-0035, ADR-0036, and ADR-0037.

## Context

Phase 4 builds the operational layer as `apps/`-layer services that register through the frozen composition-root seam
(ADR-0026) and consume frozen models, re-owning none (ADR-0035 Provider Engine, ADR-0036 Prompt Engine, ADR-0037
Memory Engine). Stage 4 is the Retrieval Engine. A full source reading (the `ai/retrieval/` guide and the frozen
`@openlance/aios-retrieval` concern models for lifecycle, workflow, knowledge-discovery, boundaries, and validation;
`ai/memory/README.md`; the three prior engines and ADR-0035/0036/0037) fixes the facts this ADR honors, one of which
required an Ambiguity Gate decision:

- **Retrieval owns knowledge determination, and produces a validated result; it never loads.** `ai/retrieval/README.md`:
  it determines "the minimum sufficient, dependency-complete, authority-correct set of knowledge the task requires ...
  it never loads it, never assembles the execution context." The frozen `@openlance/aios-retrieval` exports only types,
  ordered arrays (`RETRIEVAL_LIFECYCLE_PHASES`, `RETRIEVAL_WORKFLOW_STEPS`, `RETRIEVAL_VALIDATION_DIMENSIONS`,
  `RETRIEVAL_BOUNDARIES`), and pure predicates (`retrievalPhaseAtOrAfter`, `retrievalStepAtOrAfter`); it performs no
  execution, search, loading, or IO (ADR-0020). There is no operational search engine in the frozen model to duplicate.
- **Candidates come only from canonical owners.** `knowledge-discovery.ts`: `by-ownership` ("through its canonical
  owners"), `complete-over-canonical-sources` ("draws only from the canonical knowledge repository, never from a copy,
  a cache treated as truth"), invariant `candidate-is-canonical-owner`.
- **A retrieval never reaches into memory (the gate).** `retrieval-boundaries.ts`, boundary `layer`: "A retrieval
  consumes the knowledge repository one-directionally; ... and a retrieval never reaches into reasoning, **memory**,
  prompts, providers, tools, agents, ..., and owns none of their concerns." Memory holds retained runtime state, not
  canonical knowledge; the frozen namespace graph makes retrieval and memory independent siblings (both depend only on
  governance).

## Decision

1. **Stage 4 is a new `apps/`-layer package, `@openlance/aios-retrieval-engine`, the operational realization of the
   frozen Retrieval namespace.** It carries out operational knowledge determination over the frozen retrieval workflow
   (receive-request, discover, select, resolve-dependencies, prioritize, assemble, validate, produce-result), driving
   the frozen `RETRIEVAL_WORKFLOW_STEPS`, `RETRIEVAL_LIFECYCLE_PHASES`, and `RETRIEVAL_VALIDATION_DIMENSIONS` and their
   ordering predicates, and produces a validated `RetrievalResult`. It follows the ADR-0035 operational-layer pattern
   (`apps/*`, composition-root seam, no vendor knowledge).

2. **The Retrieval Engine never reaches into memory or any operational service (the Ambiguity Gate resolution).** The
   Stage 4 mandate listed the Memory Engine as a legal dependency, but that directly contradicts the frozen
   `retrieval-boundaries` invariant that "a retrieval never reaches into ... memory," and the discovery invariant that
   candidates are "only from the canonical knowledge repository." Since a frozen constitutional invariant is never
   violated, the Retrieval Engine consumes **no** operational service (not the Memory Engine, not the Prompt Engine,
   not the Provider Engine, not the runtime). It consumes only the frozen `@openlance/aios-retrieval` model and the
   substrate (`di`, `events`, `errors`, `plugins`, `kernel`). Composing retrieved knowledge with retained memory is a
   later orchestration layer's concern, not the Retrieval Engine's.

3. **Candidates are provided input, from canonical owners.** The engine determines over the candidates supplied in the
   `RetrievalRequest` (or registered as canonical-owner records), exactly as prior engines operate over provided
   providers, prompts, and records. It performs no IO, loads nothing, and reads no external repository; the caller
   supplies the canonical candidates.

4. **Determination is deterministic; no search technology.** Discovery, selection, dependency resolution,
   prioritization, assembly, and validation are deterministic and structural (by topic, ownership, authority, and
   declared dependencies), never a search engine, index, embedding, vector search, semantic ranking, or any algorithmic
   search technology (`retrieval-boundaries` `technology`). Enforced structurally by a guard test.

5. **No vendor knowledge (the ADR-0035 invariant carries forward), and it never loads or executes.** The engine holds
   no vendor client library, model, URL, or auth; enforced by a guard test. It produces a validated result and stops
   ("determines-not-load-or-execute"); loading and execution are the runtime's. Governance permission is applied to the
   provided permission set, never restated ("defines-check-not-rule").

6. **Design-first cadence (ADR-0007).** This ADR and `docs/implementation/35-retrieval-engine.md` are the Stage 4
   artifacts. A new ADR is warranted because Stage 4 makes a genuinely new architectural decision: declining an
   explicitly-listed dependency (the Memory Engine) to honor a frozen constitutional boundary.

## Rationale

Naming the operational realization of the Retrieval namespace is what the constitution anticipates and what ADR-0035
generalized. The one genuine decision, the memory dependency, is resolved by the frozen invariant "a retrieval never
reaches into ... memory": consuming the Memory Engine would make a retrieval reach into memory and treat retained
runtime state as a candidate source, violating both the boundary and the "candidates from canonical owners" discovery
invariant. Alternatives rejected: consuming the Memory Engine as the mandate listed (violates a frozen invariant, not
permissible); performing search / embeddings / semantic ranking (forbidden by the `technology` boundary); loading or
assembling the execution context (the runtime's, per the `determination` boundary); and re-owning the retrieval model
(would duplicate the frozen model).

## Consequences

- The `apps/` layer gains a fourth operational service and its second **foundational** one: like the Memory Engine, it
  consumes no operational service. Its `src` edge set is `{ retrieval, di, events, errors, plugins, kernel }` (six),
  with no `app -> app` edge.
- Composing retrieved knowledge with retained memory (both feeding a prompt or an execution) is deferred to a later
  orchestration layer, in the constitutionally-correct direction (higher layers consume retrieval and memory; neither
  consumes the other).
- The engine remains non-loading, non-executing, and deterministic; a later runtime loads what it determines.
- Changing any of these decisions requires a superseding ADR, an architecture review, and full validation. No frozen
  namespace, substrate package, constitution document, dependency rule, or prior ADR's decision changes.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/retrieval/README.md` and the frozen
`ai/retrieval/retrieval-lifecycle.md`, `retrieval-workflow.md`, `knowledge-discovery.md`, `knowledge-selection.md`,
`dependency-resolution.md`, `context-prioritization.md`, `context-assembly.md`, `retrieval-validation.md`, and
`retrieval-boundaries.md` (the retrieval model, phases, steps, dimensions, and boundaries), `ai/memory/README.md` (the
retrieval-versus-memory boundary), `ai/runtime/README.md` (the runtime loads what retrieval determines), `ai/governance/`
(owns the permission rules retrieval applies), and ADR-0020.

## Related ADRs

Supersedes none. Builds on ADR-0035 (the Phase 4 operational layer), ADR-0026 (the composition-root seam), ADR-0005
(frozen DI), ADR-0006 (Result), ADR-0007 (design-first), and ADR-0020 / ADR-0021 / ADR-0024. Consumes the frozen Phase
2B `@openlance/aios-retrieval` model. Relates to ADR-0037 (the Memory Engine, into which retrieval must never reach).
