# 14. Safety namespace implementation design

The implementation design for `@openlance/aios-safety`, the package that conforms to the frozen
`ai/safety/` constitutional namespace. It follows the namespace development lifecycle (ADR-0023):
constitution read in full, design recorded here, no architecture invented. Like Providers, Memory, and
Retrieval, Safety was implemented as one cohesive cycle at explicit request; the design and discipline are
identical.

## 1. Ownership

Safety owns the **protective architecture of the AI layer**: how hazards are identified, how risk is
classified, how impact is assessed, how boundaries are enforced, and how the AI refuses, escalates, or
degrades to stay safe (`ai/safety/README.md`, `ai/safety/safety.md`; ownership-map.md assigns Safety
"Security posture, privacy enforcement, isolation, human review, and risk"). It owns no governance rule
(owned by `ai/governance/`), no business truth (owned by the knowledge repository), and no execution or
behavior of another namespace. It applies governance rules and references business truth, and owns neither.

## 2. Category and the purity reconciliation

ADR-0024 does **not** enumerate Safety among its examples, but ADR-0024 §42 requires each namespace's
category to be **declared in its implementation design when it is designed** - so this declaration needs no
new ADR. Safety owns *protective rules and classifications* (Governance-like) and adapts no external
system, so it is declared **category 1, Pure Domain Model** - the same shape as Governance - not category 4
(Infrastructure Adapter). Although Safety references the knowledge repository (for what is sensitive), it
does not determine, load, or adapt it the way Retrieval does; its core is protective rules. Per ADR-0020
(foundational to and cited by ADR-0024), that ownership is realized as an immutable, stateless domain model
with no IO, and the constitution independently forbids the namespace from executing or containing code.

## 3. Responsibilities

Identify, classify, bound, refuse, escalate, and degrade as an immutable protective model, and own none of
the rules, truth, execution, or behavior it protects. Provide the immutable truth the runtime, agents, and
tools consume to keep action within safe limits. It states the protective model; it never carries it out.

## 4. Public API and module layout

One module per concern, plus a namespace-root module, all re-exported through a single explicit barrel
(`src/index.ts`, no wildcard). Each concern models the two normative sections of the Safety Document
Standard - **Principles** and **Invariants** - and, where the **Specification** enumerates a genuine closed
taxonomy, that classification.

- `namespace.ts` - `SafetyInvariant` (8), `SafetyConcern` (10).
- `safety-principles.ts` - `SafetyPrinciple` (11), invariants (5).
- `risk-classification.ts` - principles (4), invariants (5). No classification (see section 5).
- `hazard-identification.ts` - principles (4), `HazardCategory` (8), invariants (5).
- `boundary-enforcement.ts` - principles (4), invariants (5).
- `refusal-model.ts` - principles (4), `RefusalCategory` (3), invariants (5).
- `escalation-model.ts` - principles (4), invariants (5).
- `impact-assessment.ts` - principles (4), `ImpactDimension` (8), invariants (5).
- `uncertainty-management.ts` - principles (4), invariants (5).
- `safe-degradation.ts` - principles (4), invariants (5).
- `safety-versioning.ts` - principles (4), invariants (5).

**Three classifications, and why only three.** A Specification classification is modeled only when the
document uses explicit taxonomy framing - "falls into one of the following categories" or "assessed along
the following dimensions" - a closed set of named values a domain object *is* or *is described by*:
`HazardCategory` (8, "Every hazard falls into one of the following architectural categories"),
`RefusalCategory` (3, "A refusal falls into one of the following architectural categories"), and
`ImpactDimension` (8, "assessed along the following dimensions"). The other concerns' Specifications
describe the *process* by which the concern operates (how risk is classified, how boundaries are enforced,
how escalation is routed, how uncertainty is managed, how the AI degrades, how safety is versioned) - process
facets, not taxonomies - so they are definitions only, exactly as Retrieval's selection/routing were.

**No predicates.** Safety exposes no executable predicate. The constitution defines no *named* ordered
classification for safety: risk levels are declared ordered but unnamed (section 5); escalation priority and
hierarchy derive from risk and reference authorities owned by other namespaces; and the three classifications
are unordered. So there is no constitutionally grounded pure predicate, no executable code, and no benchmark
(the `bench` script passes with no benchmark files).

## 5. The risk-levels non-invention (the pivotal decision)

`risk-classification.md` §66 states risk is "classified into an ordered set of levels, from the lowest risk
to the highest" that "apply, and align with, the governed risk categories owned by
`ai/governance/risk-management.md`, and never redefine them", but it **does not enumerate the level names**.
Two forbidden paths are avoided: naming the levels would invent a classification, and reusing governance's
`TrustLevel` names would recreate a model owned elsewhere (referenced-model non-restatement). The resolution
requires no invention: risk-classification is implemented definitions-only (principles + invariants), with no
`RiskLevel` enum and no ordering predicate, and the ordered-levels rule stated as prose in the principles and
invariants. This mirrors governance Stage 2 (deferred the underspecified autonomy->trust mapping) and Stage 6
(referenced, not recreated, the authority ordering). Because it is resolvable without inventing, it is not an
ambiguity-gate stop.

A second, minor decision: the refusal-model inventory wording lists "graceful, protective, constitutional,
escalation" as if four categories, but the owning document's Specification enumerates exactly three ("A
refusal falls into one of the following architectural categories": protective, constitutional, escalation)
and treats "graceful refusal" and "recovery after refusal" as separate cross-cutting properties. The document
owns the model, so `RefusalCategory` has three members; graceful/recovery are captured in the
principles/invariants.

## 6. Dependency usage

`NAMESPACE_DEPS.safety = ['governance']` permits an edge to Governance, and Safety consumes the knowledge
repository one-directionally (`knowledge/` is a document layer, not a package). No safety concern's model
uses a governance-owned type - governance and the knowledge repository are referenced in prose, never
restated or imported (referenced-model non-restatement; ADR-0021) - so the package imports nothing and its
dependency-graph edge is `[]`. It uses no substrate package.

## 7. Lifecycle, state, error, and event ownership

By ADR-0020 all four are empty for Safety: **lifecycle** none (it does not boot, run, or shut down);
**state** none (the model is immutable/frozen); **errors** none (it performs no execution); **events** none.
These empty sections are the correct shape of a Pure Domain Model, not gaps.

## 8. Testing strategy (ADR-0022)

One test file per module. Every classification's members, count, and constitutional order are asserted
against the constitution (`toEqual` on the full array); every description is asserted non-empty; immutability
is asserted (`Object.isFrozen`). Every module is pure data (types + frozen catalogs), covered at 100% by
import and assertion; there are no predicates to cover and no pure-data-only module to exclude. There are no
benchmarks, because there is no executable code.

## 9. Acceptance criteria

- Every exported symbol traces directly to a frozen `ai/safety/` document, and no engine, evaluator, or
  runtime-context evaluator is exported.
- Full validation green: build, typecheck, lint, format, depcruise, arch:check, graph:check, docs-check,
  test (100%), bench (no benchmark files), docs.
- Zero regression; `ai/`, `knowledge/`, the frozen substrate, and the frozen Governance, Providers, Memory,
  and Retrieval namespaces unchanged; the dependency graph unchanged (`safety: []`).
