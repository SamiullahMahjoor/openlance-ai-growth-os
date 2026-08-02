---
id: OL-AI-REASONING-UNCERTAINTY-HANDLING
document: ai/reasoning/uncertainty-handling.md

title: Open Lance AIOS Uncertainty Handling

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
  - ai/reasoning/README.md
  - ai/reasoning/reasoning.md
  - ai/governance/escalation.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Reasoning namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Required

summary: >
  Owns how uncertainty in reasoning is classified. It owns uncertainty
  classification only, and defers any probability, statistic, or confidence
  measure to implementation, and the decision to escalate on uncertainty to
  governance.
---

# Open Lance AIOS Uncertainty Handling

This document owns how uncertainty in reasoning is classified. It is a reasoning document at the Specification authority level defined in ai/README.md, and it follows the Reasoning Document Standard in ai/reasoning/README.md. It instantiates the reasoning invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns uncertainty classification only. It never defines a probability, a statistic, a confidence measure, or any mathematics, which are implementation, and it never decides whether uncertainty requires escalation, which is owned by ai/governance/escalation.md.

# Purpose

This document owns one reasoning concern: how the uncertainty a reasoning encounters is classified, so it can be handled consistently. It exists so that any human or AI agent can determine the kind of uncertainty a reasoning faces, independent of any probability model or measure.

# Principles

These are the enduring principles for uncertainty classification. Each instantiates a reasoning invariant owned by ai/reasoning/README.md.

- Uncertainty is classified, not scored. Uncertainty is described by architectural kind, never by a probability, statistic, or confidence value.
- Uncertainty is surfaced, not hidden. Uncertainty a reasoning encounters is made explicit, so it is handled rather than buried in a confident-looking conclusion.
- Uncertainty defaults to caution. When uncertainty cannot be resolved within the reasoning, the reasoning yields no conclusion, or escalates, rather than invent one.
- Classification is deterministic. The same uncertainty over the same inputs is classified the same way.

# Specification

Uncertainty a reasoning encounters is classified by architectural kind. This document owns the classification; the response to a classified uncertainty is owned by governance. The kinds below describe the source and nature of uncertainty, never its magnitude.

- Uncertainty of knowledge. The retrieved knowledge is incomplete or silent on what the reasoning requires. This is a sufficiency gap, related to the evidence sufficiency owned by ai/reasoning/reasoning-validation.md.
- Uncertainty of interpretation. The retrieved knowledge admits more than one coherent interpretation, so the reasoning cannot settle on one without more.
- Uncertainty of conflict. The retrieved knowledge or the reasoning holds a tension or contradiction, related to the contradiction detection owned by ai/reasoning/reasoning-consistency.md.
- Uncertainty of applicability. It is unclear whether the retrieved knowledge or a governing rule applies to the case at hand.
- Uncertainty of authority. It is unclear which of two sources or rules governs, a question resolved by the authority owned by the knowledge repository and ai/README.md, not invented here.

A reasoning classifies the uncertainty it encounters into one or more of these kinds and makes it explicit. Whether a classified uncertainty is resolved within the reasoning, yields no conclusion, or requires escalation to a human is owned by ai/governance/escalation.md and ai/governance/risk-management.md, which this document defers to and never restates. Classification is deterministic and the same at any scale.

# Invariants

- Uncertainty is described by architectural kind, never by a probability, statistic, or confidence value.
- Uncertainty a reasoning encounters is made explicit, never hidden in a conclusion.
- Unresolvable uncertainty yields no conclusion or an escalation, never an invented conclusion.
- Classification is deterministic over the same uncertainty and inputs.
- Classifying uncertainty never executes, loads, retrieves, expresses, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns uncertainty classification only. It owns none of the following, and references each by its canonical owner.

- Any probability, statistic, confidence measure, or mathematics: implementation, outside every knowledge document.
- The decision to escalate on uncertainty: ai/governance/escalation.md.
- The treatment of uncertainty as risk: ai/governance/risk-management.md.
- The evidence sufficiency a knowledge gap relates to: ai/reasoning/reasoning-validation.md.
- The contradiction detection a conflict relates to: ai/reasoning/reasoning-consistency.md.
- The formation of a conclusion under uncertainty: ai/reasoning/conclusion-formation.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/reasoning/README.md
- ai/reasoning/reasoning.md
- ai/reasoning/reasoning-validation.md
- ai/reasoning/reasoning-consistency.md
- ai/reasoning/conclusion-formation.md
- ai/governance/escalation.md
- ai/governance/risk-management.md
