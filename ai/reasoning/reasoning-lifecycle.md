---
id: OL-AI-REASONING-REASONING-LIFECYCLE
document: ai/reasoning/reasoning-lifecycle.md

title: Open Lance AIOS Reasoning Lifecycle

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

loading_priority: Contextual

summary: >
  Owns the phases of reasoning, from framing to validated conclusion. It owns
  the reasoning lifecycle only, and defers the ordered steps, the state model,
  and the layers around reasoning to their owners.
---

# Open Lance AIOS Reasoning Lifecycle

This document owns the phases of a single reasoning. It is a reasoning document at the Specification authority level defined in ai/README.md, and it follows the Reasoning Document Standard in ai/reasoning/README.md. It instantiates the reasoning invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the reasoning lifecycle only. It defers the ordered steps within it to ai/reasoning/reasoning-workflow.md and the named states to ai/reasoning/reasoning-stages.md.

# Purpose

This document owns one reasoning concern: the phases a reasoning passes through, from framing the inputs to a validated governed conclusion. It exists so that any human or AI agent can determine the shape of a reasoning's life, independent of how it is carried out.

# Principles

These are the enduring principles for the reasoning lifecycle. Each instantiates a reasoning invariant owned by ai/reasoning/README.md.

- Reasoning has a defined beginning and end. It begins with framing and ends with a validated conclusion or a governed absence of one; it never runs unbounded.
- Framing precedes transformation. Reasoning establishes its basis before it transforms the knowledge.
- Conclusion precedes validation. A conclusion is formed before it is validated, and validation may return the reasoning for revision.
- Every reasoning terminates. Reasoning always reaches a validated conclusion, an escalation, or a governed absence of a conclusion.

# Specification

A reasoning passes through the following ordered phases. This document owns the phases; the ordered steps within them are owned by ai/reasoning/reasoning-workflow.md, and the states are owned by ai/reasoning/reasoning-stages.md.

- Framing. The reasoning is framed on the task, the retrieved knowledge determined under ai/retrieval/, and the governing rules owned by ai/governance/. Framing establishes what is being reasoned about and the basis it rests on.
- Transformation. The framed knowledge is transformed toward a conclusion, applying the categories of reasoning owned by ai/reasoning/reasoning-strategies.md, surfacing assumptions and detecting contradictions, and classifying any uncertainty under ai/reasoning/uncertainty-handling.md.
- Conclusion. A governed conclusion is formed, under ai/reasoning/conclusion-formation.md, only when the reasoning and its evidence are sufficient; otherwise the reasoning yields uncertainty or no conclusion.
- Validation. The reasoning and its conclusion are validated for grounding and sufficiency, internal consistency, and quality, under ai/reasoning/reasoning-validation.md, ai/reasoning/reasoning-consistency.md, and ai/reasoning/reasoning-quality.md, before the conclusion is accepted.

Each phase completes before the next begins, except where validation returns the reasoning to an earlier phase for revision. The lifecycle is the same for one conclusion and for millions, and it never changes as providers, models, or methods change.

# Invariants

- A reasoning holds exactly one lifecycle, from one framing to one terminal outcome.
- The Framing phase precedes Transformation, which precedes Conclusion, which precedes Validation.
- A reasoning always terminates in a validated conclusion, an escalation, or a governed absence of a conclusion.
- The lifecycle never executes, loads, retrieves, expresses, or alters ownership, authority, governance, or business truth.

# Boundaries

This document owns the reasoning lifecycle only. It owns none of the following, and references each by its canonical owner.

- The ordered steps of a reasoning: ai/reasoning/reasoning-workflow.md.
- The named states and transitions: ai/reasoning/reasoning-stages.md.
- The categories applied during transformation: ai/reasoning/reasoning-strategies.md.
- The formation and validation of a conclusion: ai/reasoning/conclusion-formation.md, ai/reasoning/reasoning-validation.md, ai/reasoning/reasoning-consistency.md, and ai/reasoning/reasoning-quality.md.
- The retrieval that provides the knowledge and the execution that carries the reasoning: ai/retrieval/ and ai/runtime/.
- The rules that govern reasoning: ai/governance/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/reasoning/README.md
- ai/reasoning/reasoning.md
- ai/reasoning/reasoning-workflow.md
- ai/reasoning/reasoning-stages.md
- ai/reasoning/conclusion-formation.md
- ai/retrieval/README.md
