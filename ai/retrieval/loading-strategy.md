---
id: OL-AI-RETRIEVAL-LOADING-STRATEGY
document: ai/retrieval/loading-strategy.md

title: Open Lance AIOS Retrieval Loading Strategy

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
  - knowledge/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Retrieval namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Required

summary: >
  Owns the architectural principles by which retrieval determines the minimum
  sufficient set to load, applying the knowledge loading strategy. It owns the
  retrieval loading principles only, and defers the loading tiers, the
  task-to-knowledge guidance, and the loading itself to their owners.
---

# Open Lance AIOS Retrieval Loading Strategy

This document owns the architectural principles by which retrieval determines what to load. It is a retrieval document at the Specification authority level defined in ai/README.md, and it follows the Retrieval Document Standard in ai/retrieval/README.md. It instantiates the retrieval invariants, operates under the governance mandates at ai/governance/, and applies the knowledge loading strategy owned by knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the retrieval loading principles only. It never owns the loading tiers or the task-to-knowledge guidance, which are owned by knowledge/README.md and knowledge/architecture/loading-map.md and which this document applies and never redefines, and it never loads knowledge, which is owned by ai/runtime/knowledge-resolution.md.

# Purpose

This document owns one retrieval concern: the enduring principles that govern how retrieval determines the minimum sufficient set of knowledge for a task. It exists so that any human or AI agent can determine why a retrieval loads exactly what it loads, independent of any implementation.

# Principles

These are the enduring loading principles of retrieval. Each instantiates a retrieval invariant owned by ai/retrieval/README.md and applies the knowledge loading strategy owned by knowledge/README.md.

- Minimum sufficient knowledge. Retrieval determines the least knowledge that is sufficient for the task, plus the sources that govern it, and no more. Availability is never a reason to load.
- Authority precedence. The higher-authority knowledge that governs a task is always included with the lower-authority knowledge it governs, from the top of the Knowledge Hierarchy downward.
- Ownership precision. Every piece is drawn from its single canonical owner, so the set contains no duplicate and no restated source.
- Dependency expansion. The set includes the declared dependencies of everything in it, so it is complete without being enlarged by anything undeclared.
- Context minimization. The determined set is kept as small as sufficiency allows, so an execution is never burdened with knowledge it does not require.
- Relevance. Knowledge is included because the task requires the concern it owns, judged against the task, never by a variable score.
- Determinism. The same task against the same repository state determines the same set, because the strategy is a fixed function of the task and the repository's own metadata, with no randomness and no heuristic ranking.

# Specification

Retrieval applies the following strategy to determine the set to load. This document owns the strategy; the tiers and the task guidance it applies are owned by the knowledge repository, and the loading itself is owned by the runtime.

- Apply the loading tiers. The tiers owned by knowledge/README.md, Critical, Required, Optional, and Contextual, and the task-to-knowledge guidance in knowledge/architecture/loading-map.md, determine which knowledge a task requires and which its situation merely triggers. Retrieval applies these; it never redefines them.
- Determine the minimum sufficient set. From the required and triggered knowledge, retrieval selects the smallest set sufficient for the task, adds the governing higher-authority sources, and adds the declared dependencies, and stops there.
- Keep it deterministic. Because the strategy is a fixed function of the task and the repository's own frozen metadata, two identical executions determine the same set.
- Hand the set to determination. The strategy governs discovery, selection, dependency resolution, and prioritization; those documents carry it out, and this document owns the principles they follow.

The strategy determines the same way whether the repository holds ten documents or millions, because it selects by a task's requirements and the repository's per-document metadata rather than by the repository's size.

# Invariants

- The determined set is the minimum sufficient set, plus governing and dependency sources, and nothing more.
- The set always includes the higher-authority knowledge that governs it and the declared dependencies of everything in it.
- The strategy applies the knowledge loading tiers and never redefines them.
- The strategy is deterministic over the same task and repository state.
- Applying the strategy never loads knowledge and never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the retrieval loading principles only. It owns none of the following, and references each by its canonical owner.

- The loading tiers and the AI Loading Strategy: knowledge/README.md.
- The task-to-knowledge guidance: knowledge/architecture/loading-map.md.
- The discovery, selection, dependency resolution, and prioritization the strategy governs: their retrieval documents.
- The loading of the determined set: ai/runtime/knowledge-resolution.md.
- Any caching, indexing, or loading mechanism: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/retrieval/README.md
- ai/retrieval/retrieval.md
- ai/retrieval/knowledge-selection.md
- ai/retrieval/dependency-resolution.md
- ai/retrieval/context-prioritization.md
- knowledge/README.md
- knowledge/architecture/loading-map.md
