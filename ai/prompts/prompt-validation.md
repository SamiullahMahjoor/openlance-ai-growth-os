---
id: OL-AI-PROMPTS-PROMPT-VALIDATION
document: ai/prompts/prompt-validation.md

title: Open Lance AIOS Prompt Validation

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
  - ai/prompts/README.md
  - ai/prompts/prompts.md
  - ai/governance/constitutional-validation.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Prompts namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns validation before a prompt is expressed, and prompt validation ordering.
  It owns prompt validation only, and defers the governance validation rules and
  the evaluation of output to their owners.
---

# Open Lance AIOS Prompt Validation

This document owns how a prompt is validated before it is expressed. It is a prompt document at the Specification authority level defined in ai/README.md, and it follows the Prompt Document Standard in ai/prompts/README.md. It instantiates the prompt invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and a prompt points to knowledge and never embeds it.

This document owns prompt validation only. It never defines a governance validation rule, owned by ai/governance/constitutional-validation.md, and it never owns the evaluation of output, owned by the Evaluation namespace.

# Purpose

This document owns one prompt concern: how a composed prompt is validated, and in what order, before it is expressed, so that only a governed, bounded, complete, and grounded prompt is expressed. It exists so that any human or AI agent can determine whether a prompt is fit to express, independent of how validation is carried out.

# Principles

These are the enduring principles for prompt validation. Each instantiates a prompt invariant owned by ai/prompts/README.md.

- Validation precedes expression. A prompt is validated before it is expressed, and a prompt that fails validation is not expressed.
- Validation is ordered. The checks are applied in a fixed order, so the same prompt is validated the same way.
- Governance is checked first. A prompt is checked for governance conformance before narrower checks, so an ungoverned prompt is rejected early.
- Grounding is required. A prompt is validated to point to knowledge and never to embed or restate it, so no prompt carries business truth as content.

# Specification

A composed prompt is validated in the following ordered checks. This document owns what is validated and in what order; the governance rules it applies are owned by ai/governance/, and the evaluation of the resulting output is owned by the Evaluation namespace.

- Governance conformance. The prompt is validated to conform to the governing rules, applying the constitutional validation owned by ai/governance/constitutional-validation.md, which this validation applies and never restates. This check is first, so an ungoverned prompt does not proceed.
- Boundary conformance. The prompt is validated to stay within the prompt boundaries owned by ai/prompts/prompt-boundaries.md, so it owns nothing beyond prompt architecture.
- Structural completeness. The prompt is validated to be complete for its purpose: its required layers are present in order under ai/prompts/prompt-architecture.md, and it was assembled and normalized under ai/prompts/prompt-assembly.md.
- Grounding and separation. The prompt is validated to point to its referenced context rather than embed it, under ai/prompts/prompt-context.md, so a prompt is not a source of truth.

The checks are applied in this order, from governance to grounding, and a prompt that fails any check is not expressed; it is returned for correction or refused under ai/governance/escalation.md. Prompt validation confirms that a prompt is fit to express; the evaluation of the output the prompt produces is owned by the Evaluation namespace. Validation is deterministic and the same at any scale.

# Invariants

- A prompt is validated before it is expressed, and a prompt that fails validation is not expressed.
- The checks are applied in a fixed order, governance conformance first and grounding last.
- A prompt is validated to point to knowledge and never to embed or restate it.
- Validation defines what is checked and in what order, never the governance rule, which is owned by ai/governance/.
- Validating a prompt never executes, reasons, retrieves knowledge, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns prompt validation only. It owns none of the following, and references each by its canonical owner.

- The governance validation rules: ai/governance/constitutional-validation.md.
- The prompt boundaries a prompt is checked against: ai/prompts/prompt-boundaries.md.
- The structure and assembly a prompt is checked for: ai/prompts/prompt-architecture.md and ai/prompts/prompt-assembly.md.
- The context separation a prompt is checked for: ai/prompts/prompt-context.md.
- The evaluation of the output a prompt produces: the Evaluation namespace, once created.
- The escalation or refusal of an invalid prompt: ai/governance/escalation.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/prompts/README.md
- ai/prompts/prompts.md
- ai/prompts/prompt-boundaries.md
- ai/prompts/prompt-architecture.md
- ai/prompts/prompt-assembly.md
- ai/prompts/prompt-context.md
- ai/governance/constitutional-validation.md
- ai/governance/escalation.md
