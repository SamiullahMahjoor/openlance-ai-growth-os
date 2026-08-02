---
id: OL-AI-REASONING-REASONING-STAGES
document: ai/reasoning/reasoning-stages.md

title: Open Lance AIOS Reasoning Stages

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

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Reasoning namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Required

summary: >
  Owns the reasoning state model: the named states reasoning may hold and the
  permitted transitions between them. It owns the state model only, and defers
  the ordered workflow that drives transitions and the lifecycle framing to
  their owners.
---

# Open Lance AIOS Reasoning Stages

This document owns the reasoning state model. It is a reasoning document at the Specification authority level defined in ai/README.md, and it follows the Reasoning Document Standard in ai/reasoning/README.md. It instantiates the reasoning invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the state model only. It defers the ordered workflow that drives transitions to ai/reasoning/reasoning-workflow.md and the lifecycle framing to ai/reasoning/reasoning-lifecycle.md.

# Purpose

This document owns one reasoning concern: the named states a reasoning may hold and the permitted transitions between them. It exists so that any human or AI agent can determine the condition a reasoning is in and where it may move next, independent of how transitions are carried out.

# Principles

These are the enduring principles for the state model. Each instantiates a reasoning invariant owned by ai/reasoning/README.md.

- A reasoning is always in exactly one stage. Its condition is defined at every point in its life.
- Transitions are defined, not arbitrary. A reasoning moves only along a permitted transition, never to an undefined stage.
- Every reasoning reaches a terminal stage. The model always leads to a concluded, inconclusive, or escalated outcome.
- The state model is technology-neutral. It describes conditions and transitions, never a mechanism, algorithm, or chain of thought that implements them.

# Specification

A reasoning holds one of the following named stages. This document owns the stages and the permitted transitions; the order that drives them is owned by ai/reasoning/reasoning-workflow.md.

- Initiated. The reasoning has begun but has not been framed.
- Framed. The task, retrieved knowledge, and governing rules have been established as the basis.
- Reasoning. The knowledge is being transformed, applying the categories of reasoning, surfacing assumptions, and detecting contradictions.
- Uncertain. Uncertainty has been encountered and is being classified under ai/reasoning/uncertainty-handling.md.
- Concluding. A governed conclusion is being formed under ai/reasoning/conclusion-formation.md.
- Validating. The reasoning and conclusion are being validated for grounding, consistency, and quality.
- Concluded. A validated governed conclusion has been reached.
- Inconclusive. The reasoning could not reach a sufficient conclusion and produced a governed absence of one.
- Escalated. The reasoning could not proceed within the rules and was escalated under ai/governance/escalation.md.
- Complete. The reasoning is finished, in a terminal condition.

Permitted transitions follow the reasoning. A reasoning moves from Initiated through Framed into Reasoning. From Reasoning it may move to Uncertain and back, to Concluding when sufficient, to Escalated when it cannot proceed within the rules, or to Inconclusive when no sufficient conclusion is reachable. Concluding moves to Validating; Validating moves to Concluded on success or back to Reasoning for revision. The terminal stages Concluded, Inconclusive, and Escalated each transition to Complete, and no transition leads out of Complete. This model holds identically at any scale.

# Invariants

- A reasoning is in exactly one stage at all times.
- Concluded is entered only from Validating, which is entered only from Concluding.
- Every path through the model reaches Complete, through Concluded, Inconclusive, or Escalated.
- Complete is terminal; no reasoning leaves it.
- A stage change never executes, loads, retrieves, expresses, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the state model only. It owns none of the following, and references each by its canonical owner.

- The ordered workflow that drives transitions: ai/reasoning/reasoning-workflow.md.
- The lifecycle phases the stages group under: ai/reasoning/reasoning-lifecycle.md.
- The classification of uncertainty behind the Uncertain stage: ai/reasoning/uncertainty-handling.md.
- The formation and validation behind Concluding and Validating: ai/reasoning/conclusion-formation.md and ai/reasoning/reasoning-validation.md.
- The escalation behind the Escalated stage: ai/governance/escalation.md.
- Any mechanism that implements a stage or transition: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/reasoning/README.md
- ai/reasoning/reasoning.md
- ai/reasoning/reasoning-workflow.md
- ai/reasoning/reasoning-lifecycle.md
- ai/reasoning/uncertainty-handling.md
- ai/governance/escalation.md
