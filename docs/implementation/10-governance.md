# Subsystem 10, Governance Namespace (Phase 2B)

> **Constitution:** `ai/governance/` (11 frozen documents; id `OL-AI-GOVERNANCE-README`).
> **Category:** Pure Domain Model (ADR-0024, category 1). **Model:** immutable, stateless domain
> model (ADR-0020). **Quality:** ADR-0022. **Dependencies:** ADR-0021. **Lifecycle:** ADR-0023.

## 1. Constitutional grounding

Governance is the **Mandate**-authority rule layer of the AI layer. It *"defines the permanent
governing rules every operational AI namespace must obey… and owns no operational behavior, no
runtime execution, no business knowledge, and no implementation"* (`ai/governance/README.md`). Every
governance document states rules, never mechanism: *"never defines an algorithm, a score, a
workflow, or any executable procedure. It states the rule, never the mechanism"* (README line 120).
Enforcement, checking, and scoring are explicitly operational and runtime, not governance.

Per the frozen `ai/architecture/dependency-map.md`, Governance depends only on the constitution; it
depends on no other namespace (depcruise `NAMESPACE_DEPS.governance = []`).

## 2. Ownership and responsibilities

The package `@openlance/aios-governance` is the **immutable, technology-neutral domain model** of the
nine governance concerns (`ai/governance/governance.md`): decision-making, constitutional
validation, escalation, human oversight, risk management, permission governance, policy enforcement,
autonomy boundaries, and change governance. For each concern it owns only the elements the
constitution states concretely and technology-neutrally: classifications, ordered levels, the
identity of mandate/invariant/trigger sets, precedence orderings, and pure predicates that express a
written rule verbatim.

It **never owns** (each has a canonical owner, and none appears in the package): validation,
permission, or policy enforcement/checking (runtime, operational); risk scoring or measurement
(operational); an agent's specific permissions (Agents namespace); risk-category, role, or legal
values (knowledge repository); the Approval Matrix or amendment workflow (`ai/CONTRIBUTING.md`); and
any runtime, mutable state, event transport, IO, logging, configuration, or service.

## 3. Public API (explicit barrel only)

The barrel `src/index.ts` re-exports, per concern, the constitutional truth as strongly-typed,
immutable definitions plus verbatim-rule predicates. Illustrative (final surface grows one concern
per stage): `TrustLevel` + `requiredOversight` (risk); `AutonomyLevel` + `maximumAutonomy` (autonomy);
the permission-grant model + its invariants (permissions); the ordered validation-concern set
(validation); the escalation-trigger set (escalation); policy precedence + `higherAuthorityWins`
(policy). Only ADR-0020-permitted predicate shapes appear (`requiredOversight(level)`,
`trustAllows(level)`, `higherAuthorityWins(a, b)`); no runtime-context evaluator
(`validate`/`evaluate`/`authorize`/`checkPermission`) ever appears.

## 4. Internal architecture, modules, package layout

One module per owned concern under `src/`, plus the barrel; no cross-module runtime coupling and no
shared state. Planned modules: `risk`, `autonomy`, `permissions`, `validation`, `escalation`,
`policy`, `decision`, `human-oversight`, `change`. Layout mirrors the substrate package convention:
`package.json`, `tsconfig.json` + `tsconfig.build.json` (ADR-0009), `vitest.config.ts` (root policy,
ADR-0015/0022), `src/`, `tests/`, `benchmarks/`, `README.md`.

## 5. Dependency usage and integration points

**Dependency usage (ADR-0021):** Governance imports only what it actually requires. As a pure domain
model of classifications and predicates, it requires no substrate package for the current stages and
declares no runtime dependency; it never imports another namespace (graph = `[]`). If a later stage
genuinely needs a value type (for example a `Brand`), it may import `@openlance/aios-kernel` only.

**Integration points:** Governance is consumed later by the runtime (whose validation pipeline
enforces these rules) and by every operational namespace (all derive from governance). Governance is
implemented first precisely because everything below consumes it and it consumes nothing.

## 6. Lifecycle, state, error, and event ownership

By constitutional design (ADR-0020), all four are empty for governance: **lifecycle** none (it does
not boot, run, or shut down; that is the runtime); **state** none (the model is immutable/frozen; no
mutable runtime state); **errors** none (it performs no execution, so it raises no runtime error);
**events** none (it owns no event transport or lifecycle events). These empty sections are the
correct shape of a Pure Domain Model, not gaps.

## 7. Testing strategy (ADR-0022)

Per module: every predicate is proven total and deterministic (same inputs -> same outputs, no time,
random, or IO); every classification's completeness and ordering is asserted against the constitution
(for example exactly four trust levels; `requiredOversight('critical')` yields human approval);
immutability is asserted; and boundary tests confirm no enforcement/scoring surface is exported.
Executable code is at 100% coverage; any pure-data module is excluded per ADR-0022 with a comment.
Benchmarks measure predicates only (Rule 5). No integration tests yet (no downstream consumer exists).

## 7a. Governance implementation boundary rule (permanent)

A direct consequence of ADR-0020 and ADR-0025, recorded here rather than as a further ADR, and
binding on every remaining governance concern:

- If the constitution defines **classifications, ordered concepts, or bounded concepts**, the concern
  exposes an immutable domain model **plus pure predicates** (as Risk and Autonomy do).
- If the constitution defines **rules, mandates, principles, or obligations that operate on models
  owned elsewhere**, the concern exposes **immutable definitions only**.
- Governance exposes executable logic only when **every input type is governance-owned, every output
  is governance-owned, and the logic expresses constitutional truth verbatim**; otherwise it exposes
  immutable definitions only.
- The missing models are **never invented** to create executable logic.

**Referenced-model non-restatement rule (permanent corollary).** When a governance concern references
a classification, ordering, or relationship owned by another constitutional owner, governance records
only the reference and the governing rule. It must not recreate, restate, or derive the referenced
model in executable code. This is why the authority ordering stays in the Charter (`ai/README.md`),
risk levels stay in Risk Management, autonomy levels stay in Autonomy Boundaries, escalation
evaluation stays in the runtime, and policy precedence *references* the Authority Hierarchy instead of
reimplementing it. A governance concern may still state the referenced rule as constitutional prose
(for example, "policy precedence follows the Authority Hierarchy owned by `ai/README.md`"); it may not
turn the referenced model into an enum, an ordered array, a map, or a predicate.

**Permission Governance (Stage 3)** is the first concern of the second kind. It owns rules
(principles and mandates) that constrain "authority" (owned by the constitution root, `ai/README.md`),
grants, and specific permissions (owned by the Agents namespace) - none of which governance owns.
There is intentionally **no Authority domain model** today; authority is constitution-owned above
governance and receives an executable representation only if and when the constitution later requires
one. Therefore Stage 3 exposes the named principles and mandates as immutable definitions only, and
defers every grant/delegation/authority/revocation predicate (for example `grantWithinBounds`,
`delegationAllowed`, `revocableGrant`) - implementing them today would require inventing an Authority
model and a grant schema, which ADR-0020, ADR-0025, and the never-invent gate forbid.

**Constitutional Validation (Stage 4)** is the second concern of the second kind and applies the
same rule. Its principles, mandates, and canonical validation dimensions are governance-owned
constitutional truth and are exposed as immutable definitions. Its mandates are conjunctive (every
significant action satisfies all of them), not a ranked scale, so there is no ordering predicate.
The one predicate the concern could suggest - whether a specific action satisfied the mandates, in
what order, with what outcome - is a runtime evaluation over an `Action` and a `ValidationResult`
that governance does not own; it is deferred to the runtime exactly as the Authority model was in
Stage 3. Governance defines what validation means; the runtime performs it.

**Escalation (Stage 5)** is the third concern of the second kind. Its principles and its eight
escalation triggers are governance-owned constitutional truth and are exposed as immutable
definitions; the triggers are disjunctive (an agent escalates whenever any one holds), not a ranked
scale, so there is no ordering predicate. Whether a specific action meets a trigger is a runtime
evaluation over an `Action` and a `RuntimeState` that governance does not own, deferred to the
runtime exactly as ValidationResult was in Stage 4. Several triggers reference other governance
dimensions (authority, autonomy, risk and trust, validation), but the module derives no relationship
to them (ADR-0025): `escalation.md` defers each such determination to that dimension's owner rather
than defining it, so Escalation references the owner and encodes no cross-dimension predicate or map.

**Policy Enforcement (Stage 6)** is the fourth concern of the second kind and the first to exercise
the referenced-model non-restatement rule directly. Its four principles and six absolute mandates are
governance-owned constitutional truth and are exposed as immutable definitions. The precedence rule
"precedence follows authority" is itself governance-owned (Principle 2 and Mandate 2) and is stated
verbatim; but the authority *ordering* it draws on (`Charter -> Principle -> Mandate -> Policy ->
Specification -> Process -> Reference`) is owned by `ai/README.md`, and `policy-enforcement.md` Mandate
2 and Boundaries attribute it there ("the higher authority level owned by `ai/README.md`"). So the
module states the precedence rule and references its owner but defines no `PrecedenceLevel`
classification, no authority-level enum, and no `prevailsOver` predicate - reproducing the ordering in
executable code would restate a Charter-owned rule and would fail the boundary rule (its input type
would not be governance-owned). Resolving which of two real policies prevails is a runtime evaluation
over a `Policy` and a `PolicyConflict` that governance does not own, deferred to the runtime exactly
as prior stages deferred Authority, ValidationResult, and the escalation evaluation.

**Human Oversight (Stage 7)** is the fifth concern of the second kind. Its five principles and six
absolute mandates are governance-owned constitutional truth and are exposed as immutable definitions.
It defines no classification: the one candidate - the approval-triggering conditions named in the
human-approval mandate (normative, high risk, legally significant, autonomy-expanding) - is a
within-mandate phrase, not a first-class enumerated classification, and each term draws on another
owner (the authority hierarchy in `ai/README.md`, risk management, autonomy boundaries, and
`knowledge/company/legal.md`), so by the referenced-model non-restatement rule it is referenced, not
recreated. Whether a specific action requires human approval, and whether a human approved, overrode,
or reviewed it, is a runtime evaluation over an `Action`, an `ApprovalRequest`, and a `HumanActor`
that governance does not own, deferred to the runtime exactly as prior stages deferred Authority,
ValidationResult, the escalation evaluation, and the policy-conflict evaluation.

**Decision-Making (Stage 8)** is the sixth concern of the second kind. Its five principles and seven
absolute mandates are governance-owned constitutional truth and are exposed as immutable definitions;
the mandates are conjunctive (every significant decision satisfies all of them), not a ranked scale,
so there is no ordering predicate. It defines no classification: the "decision hierarchy" named in the
summary and the governance inventory is the AI Authority Hierarchy owned by `ai/README.md` (the
Authorized mandate says so explicitly), so by the referenced-model non-restatement rule it is
referenced, not reproduced. Whether a specific decision is authorized, owned, governed, reviewable,
consistent, validated, or safe is a runtime evaluation over a `Decision`, a `DecisionContext`, and an
`Action` that governance does not own, deferred to the runtime exactly as prior stages deferred
Authority, ValidationResult, the escalation evaluation, the policy-conflict evaluation, and the
human-approval workflow. How a decision is computed is owned by the Reasoning namespace.

## 8. Stage plan

Small, independently testable, constitutionally complete stages (ADR-0023). One concern per stage,
foundational first (later concerns reference the trust and autonomy classifications):

1. **Risk and Trust** - the four governance trust levels and the oversight each requires
   (`ai/governance/risk-management.md`), plus the package foundation. (This document's first stage.)
2. **Autonomy Boundaries** - the four autonomy levels and the may/must-not/must-escalate/must-refuse
   classification (`autonomy-boundaries.md`).
3. **Permission Governance** - the five principles and seven mandates as immutable definitions only
   (`permission-governance.md`); no predicates (see 7a). Grant/delegation/authority predicates deferred.
4. **Constitutional Validation** - the four validation principles, the eight absolute validation
   mandates, and the six canonical sources (dimensions) an action is validated against, as immutable
   definitions only (`constitutional-validation.md`); no predicates (see 7a). The per-action
   validation result (an evaluation over an `Action`/`ValidationResult`) is deferred to the runtime.
5. **Escalation** - the four escalation principles and the eight absolute escalation triggers, as
   immutable definitions only (`escalation.md`); no predicates (see 7a). Whether a specific action
   meets a trigger (an evaluation over an `Action`/`RuntimeState`) is deferred to the runtime.
6. **Policy Enforcement** - the four principles and six absolute mandates as immutable definitions
   only (`policy-enforcement.md`); no predicates (see 7a). Policy precedence follows the AI Authority
   Hierarchy owned by `ai/README.md`; the module states that rule and references its owner, but does
   not reproduce the ordering as an enum or a `prevailsOver` predicate. Conflict resolution deferred.
7. **Human Oversight** - the five principles and six absolute mandates as immutable definitions only
   (`human-oversight.md`); no predicates (see 7a). The approval/override/review evaluation, and the
   approval-triggering conditions (which draw on risk, autonomy, legal, and the authority hierarchy),
   are referenced to their owners and deferred to the runtime.
8. **Decision-Making** - the five principles and seven absolute mandates as immutable definitions only
   (`decision-making.md`); no predicates, no classification (see 7a). The "decision hierarchy" is the
   AI Authority Hierarchy owned by `ai/README.md` (referenced, not reproduced); the decision-governance
   evaluation is deferred to the runtime, and how a decision is computed is owned by Reasoning.
9. **Change Governance** - the change-governance model (`change-governance.md`).

Each stage passes the full validation pipeline and an independent audit before the next begins.

## 9. Acceptance criteria (per stage)

- Every exported symbol traces directly to a frozen `ai/governance/` document (constitutional
  traceability), and no enforcement/scoring/runtime surface is exported.
- Full validation green: build, typecheck, lint, format, depcruise, arch:check, graph:check,
  docs-check, test (100% on executable code), bench, docs.
- Zero Phase 2A regression; `ai/`, `knowledge/`, and the frozen substrate unchanged.
