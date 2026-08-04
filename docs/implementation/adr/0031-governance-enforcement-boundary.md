---
id: ADR-0031
title: The Phase 3 descriptive chain is complete at Stage 5; Governance Enforcement is an operational Phase 4 capability
status: Accepted
date: 2026-08-04
supersedes: []
superseded_by: null
---

# ADR-0031: The Phase 3 descriptive chain is complete at Stage 5; Governance Enforcement is an operational Phase 4 capability

## Status

**Accepted** (Phase 3, Stage 6 checkpoint). This ADR raised an Ambiguity Gate and reassessed the Phase 3/Phase 4
boundary: the Stage 6 mandate, read against the frozen surface, would in every construction duplicate Governance,
Runtime, and Execution Pipeline ownership, or invent enforcement logic and execute the runtime. The gate was
resolved by approval of **Option B**: the Phase 3 runtime-integration chain is complete at Stage 5, no Stage 6
package is built, and Governance Enforcement is recorded as an operational Phase 4 capability. It introduces no
duplicate constitutional truth, changes no frozen work, and preserves ADR-0005, ADR-0020, ADR-0021, and ADR-0026 to
ADR-0030. See `docs/implementation/28-governance-enforcement.md`.

## Context

Phase 3 built five immutable, descriptive, non-executing `apps/`-layer packages, each consuming the prior and each
binding a genuinely new frozen model into the chain: the composition root (ADR-0026, the DI object graph), the
namespace wiring (ADR-0027, the namespace manifest), the DI integration (ADR-0028, the injectable substrate
surface), the runtime lifecycle plan (ADR-0029, the lifecycle states and admission path), and the execution
pipeline plan (ADR-0030, the workflow order, validation stages, context inputs, and events).

Stage 6 is asked to build Governance Enforcement. A full constitutional review from source establishes three facts:

- **Governance owns the rules, not their enforcement, and the rules are frozen.** `ai/governance/`: "It defines the
  rules; it never carries them out ... It states the rule, never the mechanism." Every governing document assigns
  the performing, checking, applying, and enforcing to "the operational namespaces and the runtime." The frozen
  `@openlance/aios-governance` namespace models the entire rule set and "performs no validation, enforcement,
  scoring, or runtime work."
- **The validation order is a frozen runtime-model concern, already in the Stage 5 plan.** `@openlance/aios-runtime`
  exports `VALIDATION_STAGES` and the validate workflow steps, and the Stage 5 `ExecutionPipelinePlan` already holds
  them.
- **Enforcement is runtime execution, absolute.** ADR-0020: "Governance provides truth. Runtime performs
  enforcement. This boundary is absolute." Carrying it out needs a governance evaluator and a live runtime context,
  neither of which exists.

So "governance enforcement" decomposes exhaustively into rules (frozen governance) + order (frozen runtime model,
already referenced by Stage 5) + carrying-it-out (runtime execution). No residual, novel ownership remains for a new
descriptive package; and an executing package would invent evaluation and execute, against ADR-0020. This is the
Phase 3/Phase 4 boundary.

## Decision

The decision is **Option B**: the Phase 3 runtime-integration chain is **complete at Stage 5**.

1. The five frozen Phase 3 packages (composition root, namespace wiring, DI integration, runtime lifecycle plan,
   execution pipeline plan) are the immutable, descriptive, non-executing integration surface Phase 3 set out to
   deliver. Each bound a new frozen model into the chain; the chain has delivered its unique ownership.
2. **Governance Enforcement introduces no new descriptive constitutional ownership.** Its referable parts (the
   governance rules and the validation order) are already frozen and, for the order, already present in the Stage 5
   plan; re-owning them violates the governance invariants "one owner per concern" and "nothing is duplicated," and
   duplicates Runtime and Execution Pipeline ownership.
3. **Real Governance Enforcement is an operational capability that begins Phase 4** (operational implementations):
   the runtime enforcement engine that evaluates the frozen governance rules against a live execution's context,
   designed and approved on its own terms, and dependent on the operational namespace services and a governance
   evaluator that are themselves Phase 4 stages.
4. **No Stage 6 package is built now.** Phase 4 is a separate, design-first phase requiring its own review and, for
   each concept the constitution does not already define, its own ADR.

## Alternatives considered

- **Option A, a thin descriptive governance enforcement plan.** A package composing the Stage 5 plan with references
  to the frozen governance validation stages and mandates. Rejected as recommended: it is a near-pure wrapper that
  re-owns the enforcement order the Stage 5 plan already carries and adds no constitutionally assigned concern; it
  sits at the edge of the duplication gate.
- **Option C, a pure governance readiness verifier.** Verifies a plan's validation stages against the frozen
  governance validation order. Thinner than A; still references only already-frozen parts and owns no new concern.
- **Literal implementation of the mandate** (a governance enforcement engine). Rejected: it evaluates permissions
  and policies against a live context, inventing enforcement logic and executing the runtime, against ADR-0020 and
  the execution ban, and depends on an operational layer that does not exist.

## Consequences

- No new package is created. `ai/`, `knowledge/`, the substrate, the namespaces, and the five frozen Phase 3
  packages are unchanged. No dependency edge, rule, or snapshot entry changes.
- Phase 3 is recorded complete at Stage 5. The next work is Phase 4, operational implementations, beginning
  design-first with the governance enforcement engine and the operational namespace services it requires.
- No frozen namespace, no constitution document, no prior ADR's decision changes. ADR-0005, ADR-0020, ADR-0021, and
  ADR-0026 to ADR-0030 are preserved.

## Related constitutional references

`ai/governance/` (owns the rules, not their enforcement; "one owner per concern," "nothing is duplicated"),
`ai/runtime/` (owns the validation order and execution), and the ADR-0020 boundary ("Governance provides truth.
Runtime performs enforcement"). This ADR records an engineering scope decision; it realizes no constitutional
concept and changes no constitutional ownership.

## Related ADRs

Builds on ADR-0030 (execution pipeline plan), ADR-0029 (runtime lifecycle plan), ADR-0028 (DI integration),
ADR-0027 (namespace wiring), ADR-0026 (composition root), ADR-0020 (namespace model; the enforcement boundary), and
ADR-0007 (design-first cadence). Relates to ADR-0017 (deferral reasoning).
