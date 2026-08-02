---
id: OL-AI-RUNTIME-VALIDATION-PIPELINE
document: ai/runtime/validation-pipeline.md

title: Open Lance AIOS Validation Pipeline

version: 1.0
status: Frozen

document_type: normative
authority: Specification

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/runtime/README.md
  - ai/runtime/runtime.md
  - ai/governance/constitutional-validation.md
  - ai/governance/permission-governance.md
  - ai/governance/policy-enforcement.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Runtime namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Critical

summary: >
  Owns the order in which an execution is validated against governance before
  it proceeds. It owns the validation order only, and defers the validation
  rules themselves and the decision to continue, escalate, or refuse to
  governance.
---

# Open Lance AIOS Validation Pipeline

This document owns the order in which an execution is validated before it proceeds. It is a runtime document at the Specification authority level defined in ai/README.md, and it follows the Runtime Document Standard in ai/runtime/README.md. It instantiates the runtime invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the validation order only. It never defines a validation rule, which is owned by ai/governance/, and it never decides whether an execution may continue, escalate, or refuse, which is owned by ai/governance/. The runtime sequences validation; governance owns what is validated and what the outcome means.

# Purpose

This document owns one execution concern: the order in which the required validations run before an execution proceeds. It exists so that any human or AI agent can determine the sequence of validation, and that validation completes before execution, independent of how any rule is evaluated.

# Principles

These are the enduring principles for the validation pipeline. Each instantiates a runtime invariant owned by ai/runtime/README.md.

- Validation precedes execution. Every required validation completes before the task runs.
- The runtime orders; governance rules. The runtime defines the order of validation and never the rules, thresholds, or outcomes, which are owned by ai/governance/.
- Higher validations first. An execution is validated against the more foundational constraints before the more specific ones, so a failure is caught at the highest applicable level.
- A failed validation stops execution. An execution that fails any required validation does not proceed; the outcome is decided by governance.
- The pipeline never invents a rule. Where governance does not clearly permit an action, the pipeline yields to escalation or refusal, never to an assumed rule.

# Specification

Before an execution proceeds, the runtime runs the required validations in the following order. This document owns the order; each validation defers its rules to the governance document named.

- Constitutional validation. The execution is validated against the AI constitution and the knowledge constitution, under ai/governance/constitutional-validation.md, including authority, ownership, and boundaries.
- Permission validation. The execution is validated against the permission mandates, under ai/governance/permission-governance.md, so it acts only within granted authority.
- Policy validation. The execution is validated against the applicable policies and their precedence, under ai/governance/policy-enforcement.md.

The validations run in this order because each rests on the one before it: an action must be constitutional before its permissions matter, and permitted before its policies are weighed. Constitutional validation is the initial admission gate, applied as the execution is admitted, and permission and policy validation follow after the execution context is assembled. This document owns the relative order of the validations; where each sits in the overall execution is owned by ai/runtime/execution-workflow.md. The full order completes before the Execute step of that workflow. If any validation does not pass, the runtime does not proceed to Execute, and the outcome, whether to escalate, refuse, or terminate, is owned by ai/governance/escalation.md and ai/governance/autonomy-boundaries.md. The order is the same at any scale of concurrent executions.

# Invariants

- The full validation pipeline completes before the Execute step.
- Constitutional validation runs before permission validation, which runs before policy validation.
- An execution that fails any required validation never reaches Execute.
- The pipeline defines order only; it never defines or overrides a governance rule.
- Running the pipeline never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the validation order only. It owns none of the following, and references each by its canonical owner.

- The rules of constitutional validation: ai/governance/constitutional-validation.md.
- The permission rules: ai/governance/permission-governance.md.
- The policy rules and their precedence: ai/governance/policy-enforcement.md.
- The decision to continue, escalate, or refuse on a failed validation: ai/governance/escalation.md and ai/governance/autonomy-boundaries.md.
- The step of the workflow the pipeline sits within: ai/runtime/execution-workflow.md.
- Any mechanism that evaluates a rule: the runtime and the operational namespaces, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/runtime/README.md
- ai/runtime/runtime.md
- ai/runtime/execution-workflow.md
- ai/governance/constitutional-validation.md
- ai/governance/permission-governance.md
- ai/governance/policy-enforcement.md
- ai/governance/escalation.md
