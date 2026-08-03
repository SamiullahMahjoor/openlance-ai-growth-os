# 17. Tools namespace implementation design

The implementation design for `@openlance/aios-tools`, the package that conforms to the frozen `ai/tools/`
constitutional namespace. It follows the namespace development lifecycle (ADR-0023): constitution read in
full, design recorded here, no architecture invented. Like Providers, Memory, Retrieval, Safety, Reasoning,
and Prompts, Tools was implemented as one cohesive cycle at explicit request; the design and discipline are
identical, and it is closely parallel to Providers.

## 1. Ownership

Tools owns the **external-interaction model of the AI layer**: what a tool is as an architectural capability
through which an agent interacts with something outside its own reasoning, and how a tool is identified,
declared, selected, executed, validated, composed, and evolved (`ai/tools/README.md`, `ai/tools/tools.md`;
ownership-map.md assigns Tools "Action. Interacting with something outside the agent's reasoning"). It owns
the tool model only. It performs no reasoning, makes no decision, holds no permission, owns no intelligence,
never orchestrates, schedules, or executes itself (`ai/runtime/`), never defines the rules that permit or
protect it (`ai/governance/`, `ai/safety/`), and never names the outside system a tool interacts with.

## 2. Category (ADR-0024) and the purity reconciliation

ADR-0024 names **"Tool adapters"** among its category 4 (Infrastructure Adapter) examples, so Tools is
category 4 by enumeration (no §42 declaration needed), in the same group as Providers and Memory. The
reconciliation with ADR-0020 is identical to those:

- **ADR-0020** (foundational to, and cited by, ADR-0024) fixes how *every* technology-neutral constitutional
  namespace is realized in code: an "immutable, stateless domain model... a set of types, frozen data, and
  pure predicates... no IO," and adds "the category a namespace belongs to is fixed by ADR-0024."
- The constitution independently forbids Tools from executing, networking, defining a protocol or interface,
  or containing code (`ai/tools/README.md`; `tool-boundaries.md` Implementation boundary), and is supreme
  over any ADR.
- So Tools owns the external-interaction boundary **as an immutable specification model**; the actual tool
  interaction over a real outside system is the runtime's, and the effect on that system is the system's own.

The package is thus **types, frozen data, and two pure ordering predicates**, with every runtime evaluation
(registering, selecting, validating, executing, composing a concrete tool) deferred to the runtime.

## 3. The two predicates

Every executable predicate expresses a constitutional ordering verbatim, over tool-owned inputs and outputs
(the boundary rule inherited from Governance, `docs/implementation/10-governance.md` section 7a), realized
via a private rank map and `>=`:

- `toolPhaseAtOrAfter(a, b)` - the **lifecycle-phase order** (`tool-lifecycle.md`): registration < discovery
  < activation < execution-lifecycle < retirement ("each phase precedes the next").
- `toolValidationCheckAtOrAfter(a, b)` - the **validation-check order** (`tool-validation.md`):
  permission-validation < safety-validation < constitutional-validation < compatibility-validation. The
  concern **explicitly owns "validation ordering"** and states the checks are "applied in a fixed order,
  permission and safety first"; the checks are also conjunctive (a tool that fails any does not execute), and
  the ordering is the distinct, explicitly-owned relation the predicate expresses. This parallels
  prompt-validation exactly.

**No execution-ordering predicate.** `tool-execution.md` owns "execution ordering" and states the steps
within a tool execution "follow a defined, acyclic order," but it does **not** enumerate those steps. With no
named ordered set, no classification and no predicate are grounded - modeling step names would invent them.
The acyclicity is stated as prose in the execution principles and invariants. This mirrors Safety's
ordered-but-unnamed risk levels exactly.

The unordered classifications (`ToolPart`, `ToolCompatibilityKind`, `ToolBoundary`, `ToolVersioningAspect`)
carry no predicate, exactly as the parallel Providers classifications do.

## 4. Public API and module layout

One module per concern, plus a namespace-root module, all re-exported through a single explicit barrel
(`src/index.ts`, no wildcard). Each concern models the two normative sections of the Tool Document Standard -
**Principles** and **Invariants** - and, where the **Specification** enumerates a genuine closed domain set,
that classification.

- `namespace.ts` - `ToolInvariant` (8), `ToolConcern` (10).
- `tool-architecture.ts` - principles (4), `ToolPart` (2), invariants (5).
- `tool-lifecycle.ts` - principles (4), `ToolLifecyclePhase` (5, ordered), invariants (5), predicate
  `toolPhaseAtOrAfter`.
- `tool-capabilities.ts` - principles (4), invariants (5). Definitions only.
- `tool-selection.ts` - principles (4), invariants (5). Definitions only.
- `tool-execution.ts` - principles (4), invariants (5). Definitions only.
- `tool-validation.ts` - principles (4), `ToolValidationCheck` (4, ordered), invariants (5), predicate
  `toolValidationCheckAtOrAfter`.
- `tool-composition.ts` - principles (4), invariants (5). Definitions only.
- `tool-compatibility.ts` - principles (4), `ToolCompatibilityKind` (2), invariants (5).
- `tool-boundaries.ts` - principles (4), `ToolBoundary` (6), invariants (5).
- `tool-versioning.ts` - principles (4), `ToolVersioningAspect` (4), invariants (5).

**Classification vs. definitions-only.** The modeling rule is the one recorded in
`docs/implementation/13-retrieval.md` section 4, and the classification decisions are calibrated directly
against the frozen, structurally-parallel Providers namespace: `ToolPart` (2: identity, capabilities)
mirrors `ProviderPart` (3); `ToolLifecyclePhase` (5, ordered, with predicate) mirrors `ProviderLifecyclePhase`
(5, ordered); `ToolCompatibilityKind` (2: capability, version) mirrors `CompatibilityKind` (2); `ToolBoundary`
(6) mirrors `ProviderBoundary` (6); and `ToolVersioningAspect` (4: version-rules, evolution, migration,
deprecation) mirrors `ProviderVersioningAspect` (4) verbatim. `ToolValidationCheck` (4, ordered, with
predicate) parallels `PromptValidationCheck`. The capabilities, selection, execution, and composition concerns
narrate heterogeneous process facets and are definitions only.

**Referenced models.** The governance mandates, permissions, escalation, change governance (`ai/governance/`,
`ai/agents/agent-permissions.md`); the safety hazards, risk, boundaries, refusal, and degradation
(`ai/safety/`); the reasoning that forms a need (`ai/reasoning/`); the scheduling and execution boundaries
(`ai/runtime/`); the provider abstraction (`ai/providers/`); the agent that composes a tool (`ai/agents/`);
the Authority Hierarchy (`ai/README.md`) and ownership map (`ai/architecture/`); business truth and the
outside system (the knowledge repository and that system) are all referenced in prose and never recreated as
a tool classification (referenced-model non-restatement rule). In particular, the capability-inheritance
conflict precedence (authority, then owner, then specificity) is recorded as prose only, with no tier enum and
no predicate, because its inputs are not tool-owned - the same discipline as Governance Stage 6 and
prompt-inheritance.

## 5. Dependency usage

`NAMESPACE_DEPS.tools = ['governance', 'safety']` permits edges to Governance and Safety. No tool concern's
model uses a governance-owned or safety-owned type - both, and the reasoning/runtime/providers/agents models,
the Authority Hierarchy, and the knowledge repository, are referenced in prose, never restated or imported
(referenced-model non-restatement; ADR-0021) - so the package imports nothing and its dependency-graph edge is
`[]`. It uses no substrate package.

## 6. Lifecycle, state, error, and event ownership

By ADR-0020 all four are empty for Tools: **lifecycle** none (the five lifecycle phases, four validation
checks, and the other classifications are modeled *data*, not a package lifecycle; the package does not boot,
run, or shut down); **state** none (the model is immutable/frozen); **errors** none (it performs no
execution); **events** none. These empty sections are the correct shape of an Infrastructure-Adapter domain
model realized per ADR-0020, not gaps.

## 7. Testing strategy (ADR-0022)

One test file per module. Every classification's members, count, and constitutional order are asserted against
the constitution (`toEqual` on the full array); every description is asserted non-empty; immutability is
asserted (`Object.isFrozen`); and the two ordering predicates are proven total and deterministic across their
whole matrices (`toolPhaseAtOrAfter` 5x5, `toolValidationCheckAtOrAfter` 4x4, each against the declared order)
plus explicit true/false cases. Executable code is at 100% coverage; there is no pure-data-only module to
exclude. Benchmarks measure the two predicates only (Rule 5). No integration tests yet (no downstream consumer
exists).

## 8. Acceptance criteria

- Every exported symbol traces directly to a frozen `ai/tools/` document, and no tool engine, runtime
  evaluator, network, protocol, or outside-system name is exported.
- Full validation green: build, typecheck, lint, format, depcruise, arch:check, graph:check, docs-check, test
  (100% on executable code), bench, docs.
- Zero regression; `ai/`, `knowledge/`, the frozen substrate, and the frozen Governance, Providers, Memory,
  Retrieval, Safety, Reasoning, and Prompts namespaces unchanged; the dependency graph unchanged (`tools: []`).
