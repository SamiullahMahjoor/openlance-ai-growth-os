---
id: OL-AI-RETRIEVAL-RETRIEVAL-WORKFLOW
document: ai/retrieval/retrieval-workflow.md

title: Open Lance AIOS Retrieval Workflow

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
  - ai/retrieval/README.md
  - ai/retrieval/retrieval.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Retrieval namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Required

summary: >
  Owns the required order of a retrieval: the ordered sequence from discovery
  through validated result. It owns the retrieval order only, and defers the
  model of each step and the execution workflow to their owners.
---

# Open Lance AIOS Retrieval Workflow

This document owns the required order of a retrieval. It is a retrieval document at the Specification authority level defined in ai/README.md, and it follows the Retrieval Document Standard in ai/retrieval/README.md. It instantiates the retrieval invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the ordered retrieval sequence only. It never defines the model of any step, which is owned by that step's document, and it never defines the execution workflow, owned by ai/runtime/execution-workflow.md.

# Purpose

This document owns one retrieval concern: the required order in which the steps of a retrieval occur. It exists so that any human or AI agent can determine the sequence every retrieval follows, and that a result is validated before it is handed off, independent of how any step is carried out.

# Principles

These are the enduring principles for the retrieval order. Each instantiates a retrieval invariant owned by ai/retrieval/README.md.

- The order is fixed and deterministic. Every retrieval follows the same required order, so the same task and repository state yield the same result.
- Discovery precedes selection. Candidates are discovered before eligible knowledge is selected.
- Dependencies are resolved before prioritization. The set is made dependency-complete before it is ordered.
- Assembly precedes validation, and validation precedes handoff. The result is assembled, then validated, then handed to the runtime.
- The order holds at any scale. One task against ten documents and against millions follows the same order.

# Specification

Every retrieval follows this required order. This document owns the order; each step defers its model to the owner named. The order is architectural: it defines what happens before what, never how any step is carried out.

- Receive request. A retrieval is requested for a resolved task, establishing its scope.
- Discover. The candidate knowledge relevant to the task is discovered from its canonical owners, under ai/retrieval/knowledge-discovery.md.
- Select. The eligible, required, governance-permitted knowledge is selected from the candidates, under ai/retrieval/knowledge-selection.md.
- Resolve dependencies. The selected knowledge is expanded to include its declared dependencies, under ai/retrieval/dependency-resolution.md, so the set is dependency-complete.
- Prioritize. The dependency-complete set is ordered by authority and relevance within the loading tiers, under ai/retrieval/context-prioritization.md.
- Assemble. The prioritized set is assembled into the coherent retrieval result, under ai/retrieval/context-assembly.md.
- Validate. The retrieval result is validated for authority, ownership, dependency completeness, boundaries, and governance permission, under ai/retrieval/retrieval-validation.md.
- Produce result. The validated retrieval result is handed to the runtime, which loads it under ai/runtime/knowledge-resolution.md.

The whole order is governed by the loading strategy in ai/retrieval/loading-strategy.md, which keeps the determined set minimum and sufficient. A step never runs before a step that must precede it, validation always precedes handoff, and the order is the same regardless of provider, model, technology, or scale.

# Invariants

- Discover precedes Select, which precedes Resolve dependencies, which precedes Prioritize, which precedes Assemble, which precedes Validate, which precedes Produce result.
- No retrieval result is handed off before it passes Validate.
- The same task and repository state always produce the same ordered result.
- The order never loads knowledge, assembles the execution context, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the retrieval order only. It owns none of the following, and references each by its canonical owner.

- The model of each step: knowledge-discovery, knowledge-selection, dependency-resolution, context-prioritization, context-assembly, and retrieval-validation.
- The strategy that keeps the set minimal: ai/retrieval/loading-strategy.md.
- The execution workflow the retrieval serves: ai/runtime/execution-workflow.md.
- The loading of the result: ai/runtime/knowledge-resolution.md.
- The rules validated at each step: ai/governance/ and the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/retrieval/README.md
- ai/retrieval/retrieval.md
- ai/retrieval/knowledge-discovery.md
- ai/retrieval/knowledge-selection.md
- ai/retrieval/dependency-resolution.md
- ai/retrieval/context-prioritization.md
- ai/retrieval/context-assembly.md
- ai/retrieval/retrieval-validation.md
- ai/retrieval/loading-strategy.md
- ai/runtime/execution-workflow.md
