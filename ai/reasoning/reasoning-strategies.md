---
id: OL-AI-REASONING-REASONING-STRATEGIES
document: ai/reasoning/reasoning-strategies.md

title: Open Lance AIOS Reasoning Strategies

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
  Owns the architectural categories of reasoning: decomposition, synthesis,
  comparison, and trade-off analysis. It owns the categories only, and defers
  any algorithm, method, prompt, or chain of thought that performs a category
  to their owners.
---

# Open Lance AIOS Reasoning Strategies

This document owns the architectural categories of reasoning. It is a reasoning document at the Specification authority level defined in ai/README.md, and it follows the Reasoning Document Standard in ai/reasoning/README.md. It instantiates the reasoning invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the categories only. It never defines an algorithm, a method, a prompt, or a chain of thought that performs a category, which are implementation or expression owned outside this namespace.

# Purpose

This document owns one reasoning concern: the architectural categories into which reasoning transformations fall. It exists so that any human or AI agent can determine what kinds of reasoning exist as architecture, independent of how any of them is performed.

# Principles

These are the enduring principles for the categories of reasoning. Each instantiates a reasoning invariant owned by ai/reasoning/README.md.

- Categories are architectural, not methods. A category names a kind of reasoning transformation; it is never an algorithm, a technique, a prompt, or a chain of thought.
- Categories are explicit. Which category a reasoning applies is defined and traceable, never hidden.
- Categories are governed and grounded. Every category operates only on retrieved knowledge and stated assumptions, within the governing rules, and never invents facts.
- Categories are extensible. New architectural categories may be added over time, additively, without changing the ones defined here.

# Specification

Reasoning transformations fall into the following architectural categories. This document owns the categories; how any is performed is owned elsewhere. A single reasoning may apply several categories, in the order owned by ai/reasoning/reasoning-workflow.md.

- Decomposition. The category of reasoning that breaks a problem, question, or body of knowledge into its constituent parts, so each part can be reasoned about on its own. It owns that the category exists and what it is, never how a problem is broken down.
- Synthesis. The category of reasoning that integrates parts, findings, or sources into a coherent whole, so a conclusion can rest on the combined basis. It owns that the category exists and what it is, never how integration is performed.
- Comparison. The category of reasoning that examines two or more options, sources, or interpretations against defined considerations, so their similarities and differences are established. It owns that the category exists and what it is, never how comparison is performed.
- Trade-off analysis. The category of reasoning that weighs the competing considerations among options, so the reasoning can account for what is gained and given up by each. It owns that the category exists and what it is, never how weighing is performed, and never a score, weight, or formula.

Each category is a way of transforming retrieved knowledge toward a conclusion, applied explicitly and traceably. The categories are the same regardless of provider, model, method, or scale, and they may be extended additively under this document as the reasoning model grows.

# Invariants

- A category names a kind of reasoning transformation, never an algorithm, method, prompt, or chain of thought.
- Which category a reasoning applies is explicit and traceable, never hidden.
- A category operates only on retrieved knowledge and stated assumptions, within the governing rules, and never invents facts.
- Applying a category never executes, loads, retrieves, expresses, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the categories of reasoning only. It owns none of the following, and references each by its canonical owner.

- Any algorithm, method, technique, or chain of thought that performs a category: implementation, outside every knowledge document.
- The expression of a category as a prompt: the Prompts namespace, once created.
- The order in which categories are applied: ai/reasoning/reasoning-workflow.md.
- The detection of contradictions among parts: ai/reasoning/reasoning-consistency.md.
- The surfacing of assumptions and the sufficiency of evidence: ai/reasoning/reasoning-validation.md.
- Any score, weight, probability, or measure: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/reasoning/README.md
- ai/reasoning/reasoning.md
- ai/reasoning/reasoning-workflow.md
- ai/reasoning/reasoning-consistency.md
- ai/reasoning/reasoning-validation.md
