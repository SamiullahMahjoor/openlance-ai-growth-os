# Prompts Namespace, Freeze Declaration

**Status:** FROZEN (all ten prompt concerns implemented, validated, and independently audited twice).
**Package:** `@openlance/aios-prompts` (`packages/namespaces/prompts`).
**Scope:** the Prompts namespace domain model, the seventh namespace of Phase 2B, built on top of the
immutable Phase 2A substrate, the frozen Governance, Providers, Memory, Retrieval, Safety, and Reasoning
namespaces, and the frozen `ai/` and `knowledge/` constitution.

The Prompts namespace is **immutable**. It states the expression model of the AI layer: how a prompt is
layered, composed, assembled, structured, validated, inherited, versioned, and consumed, so that reasoning
can be expressed as a governed, transient instruction. It owns none of the truth, rules, reasoning,
retrieval, execution, or persistence around it; it never writes a prompt (it holds no prompt text), never
determines the knowledge a prompt points to, never reasons, never executes, and never becomes a template
language, a syntax, a format, a provider, a model, a framework, or code. A prompt points to knowledge and
never embeds, restates, stores, or becomes it.

## What was built (the ten concerns + namespace)

Each concern is one source module, tracing verbatim to its frozen `ai/prompts/<file>.md` document. Each
models the two normative sections of the Prompt Document Standard (Principles, Invariants) and, where the
Specification enumerates a genuine closed domain set, that classification.

| Module | Concern | Specification classification | Predicate |
|---|---|---|---|
| `namespace.ts` | namespace-wide | `PROMPT_INVARIANTS` (8), `PROMPT_CONCERNS` (10) | none |
| `prompt-architecture.ts` | Prompt Architecture | `PromptLayer` (5, ordered) | `promptLayerAtOrAfter` |
| `prompt-lifecycle.ts` | Prompt Lifecycle | `PromptLifecyclePhase` (5, ordered) | `promptPhaseAtOrAfter` |
| `prompt-composition.ts` | Prompt Composition | none (process facets) | none |
| `prompt-assembly.ts` | Prompt Assembly | `PromptAssemblyStage` (6, ordered) | `assemblyStageAtOrAfter` |
| `prompt-templates.ts` | Prompt Templates | none (model + properties) | none |
| `prompt-context.ts` | Prompt Context | none (separation facets) | none |
| `prompt-validation.ts` | Prompt Validation | `PromptValidationCheck` (4, ordered) | `validationCheckAtOrAfter` |
| `prompt-inheritance.ts` | Prompt Inheritance | none (hierarchy + precedence prose) | none |
| `prompt-boundaries.ts` | Prompt Boundaries | `PromptBoundary` (6) | none |
| `prompt-versioning.ts` | Prompt Versioning | none (versioning facets) | none |

The ten concerns match the ten concerns in the inventory `ai/prompts/prompts.md` exactly.

## Category and purity

ADR-0024 does not enumerate Prompts among its examples; per ADR-0024 §42 its category is declared here (no
new ADR). Prompts owns the prompt **model** (truth about how a prompt is structured), not an integration,
orchestration, or composition, so it is declared **category 1 (Pure Domain Model)**, the same shape as
Governance and Safety. Category 1 explicitly "contains domain models, classifications, immutable
definitions, and pure predicates," and Governance (category 1) itself exposes ordering predicates; the four
prompt predicates are the constitution's own orderings, not computation. See
`docs/implementation/16-prompts.md` sections 2 and 3.

## The four predicates and the ordered-validation distinction (recorded for the freeze)

Each predicate expresses a constitutional ordering verbatim over prompt-owned classifications, via a private
rank map and `>=`: `promptLayerAtOrAfter` (governing to task), `promptPhaseAtOrAfter` (definition to
retirement), `assemblyStageAtOrAfter` (resolve-inheritance to finalize-for-validation), and
`validationCheckAtOrAfter` (governance-conformance to grounding-and-separation). Prompt validation is
modeled with an ordering predicate - unlike the conjunctive-but-unordered validation dimensions of Retrieval
and Reasoning - because `prompt-validation.md` explicitly owns "prompt validation ordering" and states the
checks are "applied in a fixed order, governance conformance first and grounding last." The ordering is the
distinct, explicitly-owned relation the predicate expresses.

## The inheritance non-invention (recorded for the freeze)

`prompt-inheritance.md` defines a conflict-resolution precedence - higher authority, then single owner, then
greater specificity - that applies the Authority Hierarchy owned by `ai/README.md` and the ownership map
owned by `ai/architecture/ownership-map.md`, and states it "mirrors the conflict resolution of the knowledge
repository and never invents a resolution." By the referenced-model non-restatement rule
(`docs/implementation/10-governance.md` section 7a) and the boundary rule, that precedence is stated as
prose in the inheritance principles and invariants and is NOT recreated as an executable ordering: its inputs
(authority, ownership) are not prompt-owned, so no conflict-tier classification and no precedence predicate
are created. This mirrors Governance Stage 6 (policy precedence follows the Authority Hierarchy, prose only,
no `PrecedenceLevel` enum) exactly.

## Final surface and purity confirmation

- A single explicit barrel (`src/index.ts`), no wildcard `export *`: **27 exported types** and **58
  exported runtime values** (54 frozen catalogs and description records + 4 predicate functions).
- The only executable logic is the four pure deterministic ordering predicates; there is no IO. Every
  exported catalog is `Object.freeze`d, and each ordering predicate reads a private (non-exported) rank map.
- No runtime, mutable state, lifecycle, events, IO, DI, or services (ADR-0020). The namespace imports
  nothing: its dependency edge is `[]` (it references the constitution, the Governance mandates, the
  Retrieval model, the reasoning/memory/runtime models, the Agents namespace, and the knowledge repository
  but uses no foreign type and imports no package; ADR-0021). `NAMESPACE_DEPS.prompts = ['governance',
  'retrieval']` (permitted edges, unchanged).
- 100% coverage on all modules; full validation green end to end; two independent audits CLEAN (one
  correction cycle applied: one invariant description was corrected to trace verbatim to its document, and
  re-audited CLEAN).

## What "frozen" means

The namespace's concerns, identities, classifications, principles, invariants, the four orderings, public
API, ownership, and constitutional traceability are settled. Every runtime evaluation the concerns imply
(defining, composing, assembling, normalizing, validating, resolving, or versioning a concrete prompt) is
deferred to the runtime and the operational namespaces, which consume this model and do not modify it.
Governance rules, reasoning, retrieval and memory determination, knowledge truth, the Authority Hierarchy,
and other namespaces' boundaries are referenced, never recreated. This namespace holds no prompt text.

## Allowed changes (no architecture review required)

Only these categories may change a frozen prompt file without an architecture change process, each still
running the full validation pipeline: **compiler compatibility**, **security vulnerabilities**, **dependency
updates**, and **critical bug fixes** (a genuine defect in existing behavior, for example a description or
ordering that does not trace verbatim to its frozen document).

## Any architectural modification requires all of

- a **new ADR** (an Accepted ADR is superseded, never edited in place),
- an **architecture review**,
- an **independent audit**, and
- **full validation** (green end to end).

"Architectural modification" includes any change to a concern's public API or export, an identity,
classification, principle, invariant, or ordering; the introduction of a new predicate or the enumeration of
the inheritance conflict-resolution tiers; the reproduction of a referenced model owned by another owner; a
change of purity category (ADR-0024); the dependency graph; or the constitutional traceability.

## Constitutional layers remain immutable

`ai/` and `knowledge/` remain immutable; no implementation change may modify them (CI constitutional guard).
This freeze adds nothing to the constitution; it conforms to it.

## Downstream work is additive

The next namespaces (Tools, Agents), the Runtime, and the operational layers consume this model and do not
modify it. Agents apply prompts; the runtime carries them and the Providers namespace executes them. They
may not modify any frozen prompt file except under the allowed-changes policy above with full validation.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
