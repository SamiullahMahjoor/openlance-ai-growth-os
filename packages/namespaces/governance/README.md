# @openlance/aios-governance

The immutable, technology-neutral **domain model** of the AI layer's governing rules.

- **Constitution:** `ai/governance/` (id `OL-AI-GOVERNANCE-README`), the **Mandate** authority layer.
- **Category:** Pure Domain Model (ADR-0024, category 1). **Model:** immutable, stateless (ADR-0020).
- **Stability:** Experimental (Engineering Rule 4). **Design:** [docs/implementation/10-governance.md](../../../docs/implementation/10-governance.md).

## What this package is

It states governance truth as strongly-typed classifications, immutable definitions, and pure
deterministic predicates that express a constitutional rule verbatim. It provides the truth every
operational namespace and the runtime consume; **it never enforces, checks, scores, validates, or
executes** anything (those are operational, owned by the operational namespaces and the runtime, per
`ai/governance/` and ADR-0020). It owns no runtime, no mutable state, no lifecycle, no events, no IO,
and no services.

## Public API (single barrel, Engineering Rule 1)

Implemented incrementally, one governance concern per stage (see the design's stage plan). Current
surface:

- **Risk and trust** (`ai/governance/risk-management.md`): `TrustLevel` and `TRUST_LEVELS` (the four
  governance trust levels in order), `OversightRequirement`, and the predicates `requiredOversight`,
  `requiresHumanApproval`, `trustAtLeast`, and `higherTrust`.
- **Autonomy boundaries** (`ai/governance/autonomy-boundaries.md`): `AutonomyLevel` and
  `AUTONOMY_LEVELS` (the four governance autonomy levels in order), the predicates `autonomyAtLeast`
  and `higherAutonomy`, and `AutonomyBound` and `AUTONOMY_BOUNDS` (the four bounds of autonomous
  action). The relationship between an autonomy level and the trust levels it may act on
  autonomously is deferred pending an architectural decision (the Supervised level is
  constitutionally underspecified); it is not exported until decided.
- **Permission governance** (`ai/governance/permission-governance.md`): **immutable definitions
  only** (ADR-0020, ADR-0025). `PermissionPrinciple` + `PERMISSION_PRINCIPLES` (the five principles
  in order) with `PERMISSION_PRINCIPLE_DESCRIPTIONS`; `PermissionMandate` + `PERMISSION_MANDATES`
  (the seven mandates in order) with `PERMISSION_MANDATE_DESCRIPTIONS`. **No predicates.** Permission
  rules constrain "authority" (owned by the constitution root, `ai/README.md`) and grants and
  specific permissions (owned by the Agents namespace), which governance does not own; grant,
  delegation, authority, and revocation predicates are therefore not exposed and are enforced later
  by the runtime.
- **Constitutional validation** (`ai/governance/constitutional-validation.md`): **immutable
  definitions only** (ADR-0020, ADR-0025). `ValidationPrinciple` + `VALIDATION_PRINCIPLES` (the four
  principles in order) with descriptions; `ValidationMandate` + `VALIDATION_MANDATES` (the eight
  absolute mandates in order) with descriptions; `ValidationDimension` + `VALIDATION_DIMENSIONS` (the
  six canonical sources an action is validated against, in order) with descriptions. **No
  predicates.** A per-action validation result (whether an action satisfied the mandates, in what
  order, with what outcome) is a runtime evaluation over an `Action`/`ValidationResult` that
  governance does not own; it is deferred to the runtime, exactly as the Authority model was in
  Permission Governance. Governance defines what validation means; the runtime performs it.
- **Escalation** (`ai/governance/escalation.md`): **immutable definitions only** (ADR-0020,
  ADR-0025). `EscalationPrinciple` + `ESCALATION_PRINCIPLES` (the four principles in order) with
  descriptions; `EscalationTrigger` + `ESCALATION_TRIGGERS` (the eight absolute escalation triggers,
  in order, named the escalation triggers by the document summary and the governance inventory) with
  descriptions. **No predicates.** Whether a specific action meets a trigger is a runtime evaluation
  over an `Action`/`RuntimeState` that governance does not own, so it is deferred to the runtime;
  triggers reference other dimensions (authority, autonomy, risk and trust, validation) but derive no
  relationship to them (ADR-0025), because `escalation.md` defers each such determination to its
  owner. Governance defines when escalation is required; the runtime performs it.

Every exported symbol traces directly to a frozen `ai/governance/` document. No runtime-context
evaluator (`validate`, `evaluate`, `authorize`, `checkPermission`, `executePolicy`) is exported; that
boundary is absolute (ADR-0020).

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, Governance depends only on the constitution and
on no other namespace (dependency-cruiser `NAMESPACE_DEPS.governance = []`). As a pure domain model
it requires no substrate package and declares no runtime dependency (ADR-0021).

## Non-responsibilities

It owns no provider, memory, retrieval, reasoning, prompt, tool, agent, or runtime behavior, and no
business truth. It governs by stating rules; it does not execute them. Enforcement of these rules is
performed by the runtime and the operational namespaces, which consume this model.
