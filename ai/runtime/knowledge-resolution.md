---
id: OL-AI-RUNTIME-KNOWLEDGE-RESOLUTION
document: ai/runtime/knowledge-resolution.md

title: Open Lance AIOS Knowledge Resolution

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
  - knowledge/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Runtime namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Critical

summary: >
  Owns how the runtime orchestrates the loading of knowledge into an
  execution, in the order the loading strategy requires. It owns loading
  orchestration only, and defers which knowledge is selected, the knowledge
  itself and its strategy, and context assembly to their owners.
---

# Open Lance AIOS Knowledge Resolution

This document owns how the runtime orchestrates the loading of knowledge into an execution. It is a runtime document at the Specification authority level defined in ai/README.md, and it follows the Runtime Document Standard in ai/runtime/README.md. It instantiates the runtime invariants, operates under the governance mandates at ai/governance/, and consumes the loading strategy owned by knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns loading orchestration only. It never selects or finds knowledge, which is owned by the Retrieval namespace, never owns the knowledge or its loading strategy, which are owned by the knowledge repository, and never assembles the context, which is owned by ai/runtime/context-loading.md.

# Purpose

This document owns one execution concern: how the runtime drives the loading of the knowledge an execution requires, in the correct order, from its canonical owners. It exists so that any human or AI agent can determine how knowledge is brought into an execution, independent of how it is found or where it lives.

# Principles

These are the enduring principles for knowledge resolution. Each instantiates a runtime invariant owned by ai/runtime/README.md.

- The runtime orchestrates; it does not own knowledge. The runtime drives the load and owns none of the truth it loads.
- Loading follows the knowledge loading strategy. The order and tiers of loading follow the strategy owned by knowledge/README.md, which the runtime applies and never redefines.
- Top of the hierarchy downward. The higher-authority knowledge that governs a task is loaded before the lower-authority knowledge it governs.
- Required before contextual. The knowledge a task requires is loaded before the knowledge its situation merely triggers.
- Loading is one-directional. The runtime reads knowledge from the knowledge repository and never writes, amends, or promotes state into it.

# Specification

The runtime resolves and loads the knowledge an execution requires by orchestrating the following, each from its canonical owner. This document owns the orchestration; the selection and the truth are owned elsewhere.

- Determine what is required. The knowledge a resolved task requires, and the higher-authority knowledge that governs it, is identified through the Retrieval namespace and the loading strategy owned by knowledge/README.md and applied by knowledge/architecture/loading-map.md.
- Load in order. The runtime loads the identified knowledge from the top of the Knowledge Hierarchy downward, and loads the required knowledge before the contextual knowledge, so a governing source is always present with the source it governs.
- Load from canonical owners. Each piece is loaded from the single canonical owner that holds it, by canonical path, never from a restated copy.
- Hand off for assembly. The loaded knowledge is handed to ai/runtime/context-loading.md, which assembles it into the execution context.

The runtime resolves the least the task requires plus the higher-authority sources that govern it, and no more. The same orchestration holds for one execution and for millions of concurrent executions, and never changes as providers, models, or runtimes change.

# Invariants

- Knowledge is always loaded from its canonical owner, never restated or invented.
- Higher-authority knowledge is loaded before the lower-authority knowledge it governs.
- Required knowledge is loaded before contextual knowledge.
- Loading is read-only across the layer boundary; the runtime never writes to the knowledge repository.
- Resolving knowledge never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns loading orchestration only. It owns none of the following, and references each by its canonical owner.

- Which knowledge is selected and found: the Retrieval namespace, once created.
- The knowledge itself and its truth: the knowledge repository.
- The loading strategy and tiers: knowledge/README.md, applied by knowledge/architecture/loading-map.md.
- The assembly of loaded knowledge into context: ai/runtime/context-loading.md.
- Any cache, index, store, or mechanism that holds or fetches knowledge: the Retrieval namespace and the runtime, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/runtime/README.md
- ai/runtime/runtime.md
- ai/runtime/context-loading.md
- ai/runtime/execution-workflow.md
- knowledge/README.md
- knowledge/architecture/loading-map.md
