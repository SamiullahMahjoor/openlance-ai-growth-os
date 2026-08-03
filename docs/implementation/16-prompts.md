# 16. Prompts namespace implementation design

The implementation design for `@openlance/aios-prompts`, the package that conforms to the frozen
`ai/prompts/` constitutional namespace. It follows the namespace development lifecycle (ADR-0023):
constitution read in full, design recorded here, no architecture invented. Like Providers, Memory,
Retrieval, Safety, and Reasoning, Prompts was implemented as one cohesive cycle at explicit request; the
design and discipline are identical.

## 1. Ownership

Prompts owns the **expression model of the AI layer**: how a prompt is layered, composed, assembled,
structured, validated, inherited, versioned, and consumed, so that reasoning can be expressed as a governed,
transient instruction (`ai/prompts/README.md`, `ai/prompts/prompts.md`; ownership-map.md assigns Prompts
"Expression. Turning intent into a governed, transient instruction"). It owns the prompt model only. It
never writes a prompt (this namespace holds no prompt text), never determines the knowledge a prompt points
to (`ai/retrieval/`, `ai/memory/`), never reasons (`ai/reasoning/`), never defines the governing rules
(`ai/governance/`), never executes or carries a prompt (`ai/runtime/` and the Providers namespace), and
never becomes a template language, a syntax, a format, a provider, a model, a framework, or code.

## 2. Category (ADR-0024) and the purity reconciliation

ADR-0024 does **not** enumerate Prompts among its examples, but ADR-0024 §42 requires each namespace's
category to be **declared in its implementation design when it is designed** - so this declaration needs no
new ADR. Prompts owns the prompt **model** (truth about how a prompt is structured), not an external
integration, not orchestration, and not composition of the application. It is therefore declared **category
1, Pure Domain Model**, the same shape as Governance and Safety. The reconciliation with ADR-0020 is the
standard one, and it explicitly accommodates predicates:

- **ADR-0020** fixes how every technology-neutral constitutional namespace is realized in code: an
  "immutable, stateless domain model... a set of types, frozen data, and pure predicates... no IO".
- **ADR-0024 category 1** "contains domain models, classifications, immutable definitions, and **pure
  predicates**" - and its example, Governance, itself exposes ordering predicates. So a category-1 namespace
  may carry pure predicates; the predicates here are the constitution's own **orderings** over prompt-owned
  classifications, not computation and not a prompt engine.
- The constitution independently forbids this namespace from executing, rendering, or holding a prompt
  (`ai/prompts/README.md`; `prompt-boundaries.md` Implementation boundary), and is supreme over any ADR.

The package is thus **types, frozen data, and four pure ordering predicates**, with every runtime evaluation
(composing, assembling, validating, resolving a concrete prompt) deferred to the runtime.

## 3. The four predicates

Every executable predicate expresses a constitutional ordering verbatim, over inputs and outputs that are
entirely prompt-owned (the boundary rule inherited from Governance,
`docs/implementation/10-governance.md` section 7a), realized via a private rank map and `>=`:

- `promptLayerAtOrAfter(a, b)` - the prompt **layer order** (`prompt-architecture.md`): the five layers
  governing < role < intent < context < task, "from the most authoritative to the most specific". The
  layers reference other namespaces as their *sources* (governing derives from `ai/governance/`, role from
  the Agents namespace, intent from `ai/reasoning/`) but the layer identities and their order are
  prompt-owned, so the predicate is grounded and derives no cross-dimension relationship (ADR-0025).
- `promptPhaseAtOrAfter(a, b)` - the **lifecycle-phase order** (`prompt-lifecycle.md`): definition <
  composition < validation < expression < retirement.
- `assemblyStageAtOrAfter(a, b)` - the **assembly-stage order** (`prompt-assembly.md`): resolve-inheritance
  < gather-layers-and-template < reference-context < compose < normalize < finalize-for-validation.
- `validationCheckAtOrAfter(a, b)` - the **validation-check order** (`prompt-validation.md`):
  governance-conformance < boundary-conformance < structural-completeness < grounding-and-separation. The
  concern **explicitly owns "prompt validation ordering"** and states the checks are "applied in a fixed
  order, governance conformance first and grounding last"; this is why the order is a grounded predicate
  here, whereas the conjunctive-but-unordered validation dimensions of Retrieval and Reasoning carried no
  predicate. The checks are also conjunctive (a prompt that fails any is not expressed); the ordering is the
  distinct, explicitly-owned relation the predicate expresses.

The unordered classification (`PromptBoundary`) carries no predicate.

## 4. Public API and module layout

One module per concern, plus a namespace-root module, all re-exported through a single explicit barrel
(`src/index.ts`, no wildcard). Each concern models the two normative sections of the Prompt Document
Standard - **Principles** and **Invariants** - and, where the **Specification** enumerates a genuine closed
domain set, that classification.

- `namespace.ts` - `PromptInvariant` (8), `PromptConcern` (10).
- `prompt-architecture.ts` - principles (4), `PromptLayer` (5, ordered), invariants (4), predicate
  `promptLayerAtOrAfter`.
- `prompt-lifecycle.ts` - principles (4), `PromptLifecyclePhase` (5, ordered), invariants (5), predicate
  `promptPhaseAtOrAfter`.
- `prompt-composition.ts` - principles (4), invariants (5). Definitions only.
- `prompt-assembly.ts` - principles (4), `PromptAssemblyStage` (6, ordered), invariants (5), predicate
  `assemblyStageAtOrAfter`.
- `prompt-templates.ts` - principles (4), invariants (5). Definitions only.
- `prompt-context.ts` - principles (4), invariants (5). Definitions only.
- `prompt-validation.ts` - principles (4), `PromptValidationCheck` (4, ordered), invariants (5), predicate
  `validationCheckAtOrAfter`.
- `prompt-inheritance.ts` - principles (4), invariants (5). Definitions only.
- `prompt-boundaries.ts` - principles (4), `PromptBoundary` (6), invariants (5).
- `prompt-versioning.ts` - principles (4), invariants (5). Definitions only.

**Classification vs. definitions-only.** The modeling rule is the one recorded in
`docs/implementation/13-retrieval.md` section 4: a Specification section becomes a classification only where
it "enumerates a genuine closed domain set" - a taxonomy of named member-kinds the model refers to by
identity. Applying it here: the four ordered classifications (layers, lifecycle phases, assembly stages,
validation checks) and the one unordered classification (boundaries) are such sets. **Composition**,
**templates**, **context**, **inheritance**, and **versioning** narrate heterogeneous process facets, model
and property descriptions, a hierarchy/dependency model, or versioning facets - not a homogeneous taxonomy
the model names by identity - so they are definitions only. In composition and assembly the "parts of a
composition" (layers, template, inherited parts, referenced context) are each owned by another concern and
referenced, never recreated as a `CompositionPart` classification.

**The key non-invention (inheritance conflict resolution).** `prompt-inheritance.md` defines a conflict
precedence: higher authority wins (applying the Authority Hierarchy owned by `ai/README.md`), then the
single owner governs (applying the ownership owned by `ai/architecture/ownership-map.md`), then the more
specific derived part governs; and it states this "mirrors the conflict resolution of the knowledge
repository and never invents a resolution." By the referenced-model non-restatement rule
(`docs/implementation/10-governance.md` section 7a) and the boundary rule, this precedence is recorded as
**prose** in the inheritance principles and invariants and is **not** recreated as an executable ordering:
its inputs (authority, ownership) are not prompt-owned, so no `ConflictResolutionTier` classification and no
`prevails` predicate are grounded. This mirrors Governance Stage 6 (policy precedence follows the Authority
Hierarchy, stated as prose, no `PrecedenceLevel` enum) exactly.

**Referenced models.** The governing rules, escalation, change governance, permission (`ai/governance/`);
the reasoning expressed (`ai/reasoning/`); the knowledge determined and the retained context (`ai/retrieval/`,
`ai/memory/`); the execution that carries a prompt (`ai/runtime/` and the Providers namespace); the agent
definition (the Agents namespace); the Authority Hierarchy (`ai/README.md`) and ownership map
(`ai/architecture/`); and business truth (the knowledge repository) are all referenced in prose and never
recreated as a prompt classification (referenced-model non-restatement rule).

## 5. Dependency usage

`NAMESPACE_DEPS.prompts = ['governance', 'retrieval']` permits edges to Governance and Retrieval. No prompt
concern's model uses a governance-owned or retrieval-owned type - both, and the reasoning/memory/runtime
models, the Agents namespace, and the knowledge repository, are referenced in prose, never restated or
imported (referenced-model non-restatement; ADR-0021) - so the package imports nothing and its
dependency-graph edge is `[]`. It uses no substrate package.

## 6. Lifecycle, state, error, and event ownership

By ADR-0020 all four are empty for Prompts: **lifecycle** none (the five lifecycle phases, six assembly
stages, five layers, and four validation checks are modeled *data*, not a package lifecycle; the package
does not boot, run, or shut down); **state** none (the model is immutable/frozen); **errors** none (it
performs no execution); **events** none. These empty sections are the correct shape of a Pure Domain Model,
not gaps.

## 7. Testing strategy (ADR-0022)

One test file per module. Every classification's members, count, and constitutional order are asserted
against the constitution (`toEqual` on the full array); every description is asserted non-empty;
immutability is asserted (`Object.isFrozen`); and the four ordering predicates are proven total and
deterministic across their whole matrices (`promptLayerAtOrAfter` 5x5, `promptPhaseAtOrAfter` 5x5,
`assemblyStageAtOrAfter` 6x6, `validationCheckAtOrAfter` 4x4, each against the declared order) plus explicit
true/false cases. Executable code is at 100% coverage; there is no pure-data-only module to exclude.
Benchmarks measure the four predicates only (Rule 5). No integration tests yet (no downstream consumer
exists).

## 8. Acceptance criteria

- Every exported symbol traces directly to a frozen `ai/prompts/` document, and no prompt engine, template
  renderer, runtime evaluator, or prompt text is exported.
- Full validation green: build, typecheck, lint, format, depcruise, arch:check, graph:check, docs-check,
  test (100% on executable code), bench, docs.
- Zero regression; `ai/`, `knowledge/`, the frozen substrate, and the frozen Governance, Providers, Memory,
  Retrieval, Safety, and Reasoning namespaces unchanged; the dependency graph unchanged (`prompts: []`).
