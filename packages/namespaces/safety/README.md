# @openlance/aios-safety

The immutable, technology-neutral **domain model** of the AI layer's protective architecture.

- **Constitution:** `ai/safety/` (id `OL-AI-SAFETY-README`), the **Specification** authority layer.
- **Category:** Pure Domain Model (ADR-0024, category 1, like Governance) - it owns protective rules and
  classifications and adapts no external system. ADR-0024 does not enumerate Safety among its examples;
  its category is declared here per ADR-0024 (no new ADR). **Design:** [docs/implementation/14-safety.md](../../../docs/implementation/14-safety.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

It states safety truth as strongly-typed classifications, immutable principles, and invariants that
express the safety specification verbatim. Safety is the protective architecture: this package defines how
hazards are identified, how risk is classified, how impact is assessed, how boundaries are enforced, and
how the AI refuses, escalates, or degrades to stay safe. It **never executes, reasons, retrieves,
composes, or persists, and defines no mechanism, framework, provider, model, or code**
(`ai/safety/README.md`, ADR-0020). It applies the rules owned by `ai/governance/` and references the truth
owned by the knowledge repository, and owns neither. Evaluating a concrete hazard, risk, impact, refusal,
escalation, or degradation over a concrete action is a runtime evaluation deferred to the runtime and the
operational namespaces that consume this model. It owns no runtime, no mutable state, no lifecycle, no
events, no IO, and no services.

### No predicates, and the risk-levels non-invention

Safety exposes **no executable predicate**. Unlike Governance/Providers/Memory/Retrieval - each of which
owns a constitutionally *named* ordered classification that grounds an ordering predicate - the Safety
constitution defines no named ordered classification. Risk classification declares risk is "classified
into an ordered set of levels, from the lowest risk to the highest" that "apply, and align with, the
governed risk categories owned by `ai/governance/risk-management.md`, and never redefine them"
(`risk-classification.md`), but it **does not enumerate the level names**. Naming them would invent a
classification, and mirroring governance's `TrustLevel` would recreate a model owned elsewhere
(referenced-model non-restatement). So no `RiskLevel` enum and no ordering predicate are created; the
ordered-levels rule is stated as prose in the risk-classification principles and invariants, exactly as
Governance deferred its own underspecified relationships. Consequently there is no executable code and no
benchmark.

## Public API (single barrel, Engineering Rule 1)

All ten safety concerns from `ai/safety/`, plus the namespace-wide truth, are implemented as an immutable
model. Each concern exposes its **Principles** and **Invariants** (the two normative sections of the Safety
Document Standard), and, where the **Specification** enumerates a genuine closed taxonomy, that
classification too.

- **Namespace** (`README.md`, `safety.md`): `SafetyInvariant` + `SAFETY_INVARIANTS` (the eight safety
  invariants every concern instantiates); `SafetyConcern` + `SAFETY_CONCERNS` (the ten concerns).
- **Safety principles** (`safety-principles.md`): `SafetyPrinciple` + `SAFETY_PRINCIPLES` (the eleven
  enduring principles of protection) with descriptions, and invariants.
- **Hazard identification** (`hazard-identification.md`): principles, invariants, and `HazardCategory` +
  `HAZARD_CATEGORIES` (the eight categories: capability, knowledge, permission, reasoning, runtime, prompt,
  agent, compound).
- **Refusal model** (`refusal-model.md`): principles, invariants, and `RefusalCategory` +
  `REFUSAL_CATEGORIES` (the three categories: protective, constitutional, escalation). "Graceful refusal"
  and "recovery" are cross-cutting properties in the principles/invariants, not categories.
- **Impact assessment** (`impact-assessment.md`): principles, invariants, and `ImpactDimension` +
  `IMPACT_DIMENSIONS` (the eight dimensions: severity, likelihood, reversibility, propagation, scope,
  human, organizational, long-term).
- **Risk classification, boundary enforcement, escalation model, uncertainty management, safe degradation,
  safety versioning** (`risk-classification.md`, `boundary-enforcement.md`, `escalation-model.md`,
  `uncertainty-management.md`, `safe-degradation.md`, `safety-versioning.md`): principles and invariants;
  their Specifications are process facets over runtime/governance/knowledge-owned models, so they carry no
  classification. Governance rules, knowledge truth, and other namespaces' boundaries are referenced, never
  recreated.

Every exported symbol traces directly to a frozen `ai/safety/` document. No safety engine, evaluator, or
runtime-context evaluator (`classifyRisk(hazard)`, `assess(action)`, `refuse(action)`) is exported; that
boundary is absolute (ADR-0020).

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, Safety depends on the constitution and the Governance
namespace, and consumes the knowledge repository one-directionally (dependency-cruiser
`NAMESPACE_DEPS.safety = ['governance']`; `knowledge/` is a document layer, not a package). As a pure
domain model it uses no governance-owned type and imports no package - it references governance rules and
the knowledge repository in prose and never restates or imports them (ADR-0021, import only what you use;
referenced-model non-restatement) - so it imports nothing and its dependency edges are `[]`.

## Non-responsibilities

It owns no execution, reasoning, retrieval, memory, prompt, provider, tool, agent, evaluation, or
operations behavior, no governance rule, and no business truth. It defines protection; it never performs
the work of the namespace it protects. Enforcing protection at run time is performed by the runtime, which
consumes this model.
