---
id: OL-AI-REASONING-REASONING-WORKFLOW
document: ai/reasoning/reasoning-workflow.md

title: Open Lance AIOS Reasoning Workflow

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
  - ai/retrieval/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Reasoning namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Required

summary: >
  Owns the required order of reasoning: the ordered sequence from framing to
  governed conclusion. It owns the reasoning order only, and defers the model
  of each step, the states it moves through, and the execution workflow to
  their owners.
---

# Open Lance AIOS Reasoning Workflow

This document owns the required order of a reasoning. It is a reasoning document at the Specification authority level defined in ai/README.md, and it follows the Reasoning Document Standard in ai/reasoning/README.md. It instantiates the reasoning invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the ordered reasoning sequence only. It never defines the model of any step, which is owned by that step's document, and it never defines the execution workflow, owned by ai/runtime/execution-workflow.md.

# Purpose

This document owns one reasoning concern: the required order in which the steps of a reasoning occur. It exists so that any human or AI agent can determine the sequence every reasoning follows, and that a conclusion is validated before it is accepted, independent of how any step is carried out.

# Principles

These are the enduring principles for the reasoning order. Each instantiates a reasoning invariant owned by ai/reasoning/README.md.

- The order is fixed and deterministic. Every reasoning follows the same required order, so the same inputs yield the same outcome.
- Framing precedes transformation. The basis is established before the knowledge is transformed.
- Sufficiency precedes conclusion. A conclusion is formed only after the reasoning and its evidence are found sufficient.
- Validation precedes acceptance. A conclusion is validated before it is accepted, and an invalid reasoning is revised or does not conclude.
- The order holds at any scale. One conclusion and millions follow the same order.

# Specification

Every reasoning follows this required order. This document owns the order; each step defers its model to the owner named. The order is architectural: it defines what happens before what, never how any step is carried out, and it defines no algorithm and no chain of thought.

- Receive request. A reasoning is requested for a task, with the retrieved knowledge determined under ai/retrieval/ and the governing rules owned by ai/governance/.
- Frame. The reasoning is framed on the task, the retrieved knowledge, and the governing rules.
- Decompose. The problem is broken into its parts, under the categories owned by ai/reasoning/reasoning-strategies.md.
- Analyze. The parts are examined, applying comparison and trade-off analysis under ai/reasoning/reasoning-strategies.md, surfacing assumptions and checking evidence sufficiency under ai/reasoning/reasoning-validation.md, and detecting contradictions under ai/reasoning/reasoning-consistency.md.
- Synthesize. The parts are integrated into a coherent basis for a conclusion, under ai/reasoning/reasoning-strategies.md.
- Handle uncertainty. Any uncertainty is classified under ai/reasoning/uncertainty-handling.md, and where it cannot be resolved within the rules, the reasoning escalates under ai/governance/escalation.md.
- Form conclusion. A governed conclusion is formed under ai/reasoning/conclusion-formation.md, only when the reasoning and its evidence are sufficient.
- Validate. The reasoning and conclusion are validated for grounding and sufficiency, internal consistency, and quality, under ai/reasoning/reasoning-validation.md, ai/reasoning/reasoning-consistency.md, and ai/reasoning/reasoning-quality.md.
- Produce outcome. The validated governed conclusion is produced, or, where none can be formed within the rules, the reasoning yields a classified uncertainty or escalates rather than conclude.

A step never runs before a step that must precede it, and validation always precedes acceptance of a conclusion. The order is the same regardless of provider, model, method, or scale.

# Invariants

- Frame precedes Decompose, Analyze, and Synthesize, which precede Form conclusion, which precedes Validate.
- No conclusion is accepted before it passes Validate.
- The same task, retrieved knowledge, and governing rules always produce the same ordered outcome.
- The order never executes, loads, retrieves, expresses, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the reasoning order only. It owns none of the following, and references each by its canonical owner.

- The model of each step: reasoning-strategies, reasoning-validation, reasoning-consistency, uncertainty-handling, and conclusion-formation.
- The states the order moves through: ai/reasoning/reasoning-stages.md.
- The execution workflow the reasoning serves: ai/runtime/execution-workflow.md.
- The retrieval that provides the knowledge: ai/retrieval/.
- The escalation of an unresolved reasoning: ai/governance/escalation.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/reasoning/README.md
- ai/reasoning/reasoning.md
- ai/reasoning/reasoning-strategies.md
- ai/reasoning/reasoning-validation.md
- ai/reasoning/reasoning-consistency.md
- ai/reasoning/uncertainty-handling.md
- ai/reasoning/conclusion-formation.md
- ai/reasoning/reasoning-stages.md
- ai/runtime/execution-workflow.md
- ai/governance/escalation.md
