---
id: OL-AI-TOOLS-TOOL-VALIDATION
document: ai/tools/tool-validation.md

title: Open Lance AIOS Tool Validation

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
  - ai/tools/README.md
  - ai/tools/tools.md
  - ai/governance/constitutional-validation.md
  - ai/safety/hazard-identification.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Tools namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns pre-execution validation of a tool, and validation ordering. It owns tool
  validation only, and defers the governance validation rules and the hazards a
  validation checks for to their owners.
---

# Open Lance AIOS Tool Validation

This document owns how a tool is validated before it executes. It is a tool document at the Specification authority level defined in ai/README.md, and it follows the Tool Document Standard in ai/tools/README.md. It instantiates the tool invariants and operates under the governance mandates at ai/governance/ and the safety architecture at ai/safety/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns tool validation only. It never defines a governance validation rule, owned by ai/governance/constitutional-validation.md, and it never defines the hazards a validation checks for, owned by ai/safety/hazard-identification.md.

# Purpose

This document owns one tool concern: how a chosen tool is validated, and in what order, before it executes, so that only a permitted, safe, compatible tool executes. It exists so that any human or AI agent can determine whether a tool is fit to execute, independent of how the rules and hazards it checks are defined.

# Principles

These are the enduring principles for tool validation. Each instantiates a tool invariant owned by ai/tools/README.md.

- Validation precedes execution. A tool is validated before it executes, and a tool that fails validation never executes.
- Validation is ordered. The checks are applied in a fixed order, so the same tool is validated the same way.
- Permission and safety are checked first. A tool is checked for permission and safety before narrower checks, so an impermissible or unsafe tool is rejected early.
- Failure is safe. A tool that fails validation is not executed; it is refused or an alternate is chosen, and no unvalidated tool ever acts.

# Specification

A chosen tool is validated in the following ordered checks. This document owns what is validated and in what order; the governance rules it applies are owned by ai/governance/, and the hazards it checks for are owned by ai/safety/.

- Permission validation. The tool is validated to be one the acting agent is permitted to use, under the permissions owned by ai/agents/agent-permissions.md and the rules owned by ai/governance/. This check is first, so an impermissible tool does not proceed.
- Safety validation. The tool is validated to be safe to execute for the case at hand: the hazards it could introduce are identified under ai/safety/hazard-identification.md and its risk classified under ai/safety/risk-classification.md, and a tool whose use would exceed the limits owned by ai/safety/ fails validation. This document owns that the check occurs and its order; the hazards and limits are owned by ai/safety/.
- Constitutional validation. The tool conforms to the constitutional validation owned by ai/governance/constitutional-validation.md, which this validation applies and never restates.
- Compatibility validation. The tool is validated to be compatible with the need under ai/tools/tool-compatibility.md, so a tool that cannot satisfy the need does not execute.

The checks are applied in this order, from permission and safety to compatibility, and a tool that fails any check does not execute; it is refused under ai/safety/refusal-model.md or an alternate is chosen under ai/tools/tool-selection.md. Tool validation confirms that a tool is fit to execute; the execution that follows is owned by ai/tools/tool-execution.md. Validation is deterministic and the same at any scale.

# Invariants

- A tool is validated before it executes, and a tool that fails validation never executes.
- The checks are applied in a fixed order, permission and safety first.
- Validation defines what is checked and in what order, never the governance rule or the hazard, which are owned by ai/governance/ and ai/safety/.
- A tool that fails validation is refused or replaced, and no unvalidated tool ever acts.
- Validating a tool never reasons, decides, executes, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns tool validation only. It owns none of the following, and references each by its canonical owner.

- The governance validation rules and permissions: ai/governance/constitutional-validation.md and ai/agents/agent-permissions.md.
- The hazards, risk, and limits a validation checks: ai/safety/hazard-identification.md, ai/safety/risk-classification.md, and ai/safety/.
- The compatibility a validation confirms: ai/tools/tool-compatibility.md.
- The execution that follows a passed validation: ai/tools/tool-execution.md.
- The refusal of a tool that fails validation: ai/safety/refusal-model.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/tools/README.md
- ai/tools/tools.md
- ai/tools/tool-compatibility.md
- ai/tools/tool-execution.md
- ai/tools/tool-selection.md
- ai/agents/agent-permissions.md
- ai/governance/constitutional-validation.md
- ai/safety/hazard-identification.md
- ai/safety/risk-classification.md
- ai/safety/refusal-model.md
