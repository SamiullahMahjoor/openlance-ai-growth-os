---
id: ADR-0039
title: The Tool Engine is the Runtime's operational tool subsystem; it consumes only the frozen tools model and the substrate, prepares a validated, governed tool execution over provided tools, and never executes, reaches into a provider or prompt engine, or composes tools with providers
status: Accepted
date: 2026-08-05
supersedes: []
superseded_by: null
---

# ADR-0039: The Tool Engine is the Runtime's operational tool subsystem; it consumes only the frozen tools model and the substrate, prepares a validated, governed tool execution over provided tools, and never executes, reaches into a provider or prompt engine, or composes tools with providers

## Status

**Accepted** (Phase 4, Stage 5). It follows the operational-layer pattern established by ADR-0035, introduces no
duplicate constitutional or engineering truth, changes no frozen work, supersedes nothing, and preserves ADR-0005,
ADR-0006, ADR-0007, ADR-0020, ADR-0021, ADR-0024, ADR-0026 to ADR-0034, ADR-0035, ADR-0036, ADR-0037, and ADR-0038.

## Context

Phase 4 builds the operational layer as `apps/`-layer services that register through the frozen composition-root seam
(ADR-0026) and consume frozen models, re-owning none (ADR-0035 Provider Engine, ADR-0036 Prompt Engine, ADR-0037
Memory Engine, ADR-0038 Retrieval Engine). Stage 5 is the Tool Engine. A full source reading (the `ai/tools/` guide and
the frozen `@openlance/aios-tools` concern models for architecture, lifecycle, capabilities, selection, execution,
validation, composition, boundaries; `ai/agents/agent-architecture.md`, `agent-boundaries.md`, `agent-capabilities.md`;
`ai/providers/README.md`; ADR-0035) fixes the facts this ADR honors, one of which required an Ambiguity Gate decision:

- **A tool is executed by the Runtime, not by the tool subsystem, and not by a provider.** `namespace.ts` tool
  invariant `executed-by-runtime-owns-no-intelligence`: "A tool is executed by the runtime; it never orchestrates,
  schedules, or executes itself, and it owns no intelligence." `ai/tools/tool-execution.md`: "the scheduling,
  orchestration, and carrying out are owned by ai/runtime/." `tool-lifecycle` `execution-lifecycle` phase: validated
  "then executed under ai/tools/tool-execution.md and **carried out by ai/runtime/**."
- **A tool is not a provider; an agent composes both (the gate).** `tool-boundaries` `provider-and-intelligence`
  boundary: "A tool is **not a provider** and produces no intelligence. The abstraction over a source of intelligence
  is owned by ai/providers/; a tool abstracts an external interaction, and **an agent composes both**." The Agents
  namespace is the canonical owner of that composition, and marks it future: `ai/agents/agent-architecture.md`: "To act,
  an agent composes the operational namespaces ... and, **in future, acts through the Tools namespace and executes
  through the Providers namespace**." `ai/agents/agent-boundaries.md`: "an agent composes ... and, in future, tools and
  providers." Prompts are likewise an abstraction around a tool owned by ai/prompts/ (`tool-boundaries.md`, Boundaries).
- **Validation precedes execution, in a fixed order, applying rules it never restates.** `tool-validation`: the four
  ordered, conjunctive checks are `permission-validation`, `safety-validation`, `constitutional-validation`,
  `compatibility-validation`; "Validation defines what is checked and in what order, never the governance rule or the
  hazard, which are owned by ai/governance/ and ai/safety/." Governance precedes execution (ADR-0035).

## Decision

1. **Stage 5 is a new `apps/`-layer package, `@openlance/aios-tool-engine`, the operational realization of the frozen
   Tools namespace.** It carries out operational tool preparation over the frozen tool model: registration, lifecycle,
   discovery, capability matching, deterministic selection, single-and-acyclic capability-inheritance resolution, the
   four frozen ordered validation checks, argument normalization, and the preparation of a validated, governed
   `ToolExecution`. It drives the frozen `TOOL_LIFECYCLE_PHASES` and `TOOL_VALIDATION_CHECKS` and their ordering
   predicates (`toolPhaseAtOrAfter`, `toolValidationCheckAtOrAfter`). It follows the ADR-0035 operational-layer pattern
   (`apps/*`, composition-root seam, no vendor knowledge).

2. **The Tool Engine consumes no provider engine, prompt engine, or other operational service (the Ambiguity Gate
   resolution).** The Stage 5 mandate listed the Provider Engine and Prompt Engine as dependencies and directed that
   "tool execution must delegate through the frozen Provider Engine." That contradicts three frozen invariants: a tool
   is not a provider and an agent (not the tool) composes tool with provider (`tool-boundaries`
   `provider-and-intelligence`); a tool is carried out by ai/runtime/, not by a provider (`executed-by-runtime`
   invariant, `tool-execution.md`); and prompts are an abstraction around a tool owned by ai/prompts/. Since a frozen
   constitutional invariant is never violated, the Tool Engine consumes **no** operational service (not the Provider
   Engine, not the Prompt Engine, not the Memory or Retrieval Engine, not the runtime). It consumes only the frozen
   `@openlance/aios-tools` model and the substrate (`di`, `events`, `errors`, `plugins`, `kernel`). Composing a tool
   with a provider and a prompt is the Agent Engine's concern (Stage 6), in the constitutionally-correct direction
   (the agent composes the tool, provider, and prompt subsystems; none composes another).

3. **The Tool Engine prepares a validated, governed tool execution, and stops; it never carries one out.** It produces
   a `ToolExecution` (the model of a single bounded tool interaction: the selected tool, the matched capability, the
   normalized arguments, and whether a governance clearance is required) wrapped in a validated `ToolResponse`. Per
   `tool-execution.md`, this document "owns what such an execution is as a model; **the runtime carries it out**." The
   engine performs no external interaction, opens no network, and produces no outside effect.

4. **Governance precedes execution (ADR-0035), applied not minted.** Validation runs the four frozen checks in order
   and fails closed. Permission is applied against the permission set the request supplies (`permission-validation`);
   an execution that would leave a tool's declared, bounded capability surface is refused (`safety-validation`); a tool
   whose invocation is a significant action carries a governance clearance the engine applies but never mints
   (`constitutional-validation`, the ADR-0035 cleared seam); and the arguments must satisfy the capability's required
   parameters (`compatibility-validation`). The engine restates no governance rule and no hazard.

5. **No vendor knowledge and no SDK (the ADR-0035 invariant carries forward); capabilities are technology-neutral.**
   The engine holds no vendor client library, model, URL, or auth, and names no provider (`tool-capabilities`:
   capabilities are "described in technology-neutral terms ... without naming any provider, technology, or outside
   system"). Enforced structurally by guard tests: one fails the build on any vendor or SDK token, and one fails the
   build on any import of a provider, prompt, memory, retrieval, agent, or reasoning package.

6. **Design-first cadence (ADR-0007).** This ADR and `docs/implementation/36-tool-engine.md` are the Stage 5 artifacts.
   A new ADR is warranted because Stage 5 makes a genuinely new architectural decision: declining two explicitly-listed
   dependencies (the Provider Engine and Prompt Engine) and the "delegate execution through the Provider Engine"
   directive, to honor the frozen tool-versus-provider, tool-execution-by-runtime, and agent-composes-both boundaries.

## Rationale

Naming the operational realization of the Tools namespace is what the constitution anticipates and what ADR-0035
generalized. The one genuine decision, the provider and prompt dependencies, is resolved by the frozen invariants that a
tool is not a provider, that a tool is carried out by the runtime, and that an agent (not the tool) composes a tool with
a provider and a prompt: consuming the Provider Engine or Prompt Engine would make the tool subsystem execute providers
and own a composition the Agents namespace owns, violating three boundaries at once. Alternatives rejected: building it
as mandated with provider and prompt dependencies and provider-delegated execution (violates frozen Specification
invariants under `ai/`, which an ADR cannot supersede); keeping only the Provider Engine and preparing a
provider-executable payload (still inverts the agent-owned composition and imports provider knowledge the tools model
forbids); executing the tool in-engine (the runtime's, per `tool-execution.md`); and re-owning the tool model (would
duplicate the frozen model).

## Consequences

- The `apps/` layer gains a fifth operational service and its third **foundational** one (with the Memory and Retrieval
  Engines): it consumes no operational service. Its `src` edge set is `{ tools, di, events, errors, plugins, kernel }`
  (six), with no `app -> app` edge.
- Composing a tool with a provider and a prompt (to complete a provider-driven tool call) is deferred to the Agent
  Engine (Stage 6), which the Agents namespace names as its owner "in future." The direction is permanent: the agent
  composes the tool, provider, and prompt subsystems; none composes another.
- The engine remains non-executing and deterministic; a later runtime carries out the `ToolExecution` it prepares, and
  the governance enforcement engine (a later Phase 4 stage) becomes the sole minter of the clearance the engine applies.
- Changing any of these decisions requires a superseding ADR, an architecture review, and full validation. No frozen
  namespace, substrate package, constitution document, dependency rule, or prior ADR's decision changes.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/tools/README.md` and the frozen
`ai/tools/tool-architecture.md`, `tool-lifecycle.md`, `tool-capabilities.md`, `tool-selection.md`, `tool-execution.md`,
`tool-validation.md`, `tool-composition.md`, and `tool-boundaries.md` (the tool model, phases, checks, and boundaries),
`ai/agents/agent-architecture.md` / `agent-boundaries.md` / `agent-capabilities.md` (the agent composes tools and
providers, in future), `ai/providers/README.md` (a provider is a distinct abstraction the runtime executes),
`ai/runtime/README.md` (the runtime carries out a tool interaction), `ai/governance/` and `ai/safety/` (own the rules
and hazards the validation applies), and ADR-0020.

## Related ADRs

Supersedes none. Builds on ADR-0035 (the Phase 4 operational layer and the governance-cleared seam), ADR-0026 (the
composition-root seam), ADR-0005 (frozen DI), ADR-0006 (Result), ADR-0007 (design-first), and ADR-0020 / ADR-0021 /
ADR-0024. Consumes the frozen Phase 2B `@openlance/aios-tools` model. Relates to ADR-0036 (the Prompt Engine) and
ADR-0035 (the Provider Engine), which the Tool Engine must never reach into, and anticipates the Stage 6 Agent Engine,
which composes all three.
