---
id: OL-AI-RETRIEVAL-CONTEXT-PRIORITIZATION
document: ai/retrieval/context-prioritization.md

title: Open Lance AIOS Context Prioritization

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
  Owns how the knowledge in the retrieval result is prioritized and ordered,
  by authority and by relevance, within the loading tiers. It owns
  prioritization only, and defers the loading tiers and the runtime load order
  to their owners.
---

# Open Lance AIOS Context Prioritization

This document owns how the retrieved knowledge is prioritized. It is a retrieval document at the Specification authority level defined in ai/README.md, and it follows the Retrieval Document Standard in ai/retrieval/README.md. It instantiates the retrieval invariants, operates under the governance mandates at ai/governance/, and consumes the loading tiers and authority owned by the knowledge repository. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns prioritization only. It never owns the loading tiers, which are owned by knowledge/README.md, and it never orders the runtime load, which is owned by ai/runtime/knowledge-resolution.md.

# Purpose

This document owns one retrieval concern: how the knowledge in the dependency-complete set is prioritized and ordered so the most foundational and most relevant knowledge is placed first. It exists so that any human or AI agent can determine the priority order of the retrieval result, independent of any ranking technology.

# Principles

These are the enduring principles for prioritization. Each instantiates a retrieval invariant owned by ai/retrieval/README.md.

- Authority orders first. Higher-authority knowledge is prioritized above the lower-authority knowledge it governs, so a governing source is never placed below what it governs.
- Loading tiers frame priority. The tiers owned by knowledge/README.md, Critical, Required, Optional, and Contextual, frame the priority, and prioritization applies them and never redefines them.
- Relevance orders within a level. Among knowledge of the same authority and tier, the knowledge most relevant to the task is prioritized higher.
- Prioritization is deterministic. The same set for the same task and repository state is ordered identically, by defined criteria, with no heuristic scoring.

# Specification

For the dependency-complete set produced under ai/retrieval/dependency-resolution.md, prioritization determines the order of the retrieval result. This document owns the ordering; the tiers and authority it applies are owned by the knowledge repository.

- Order by authority. Knowledge is ordered from the top of the Knowledge Hierarchy downward, using the authority owned by knowledge/architecture/authority-map.md, so foundational and governing knowledge is placed before the knowledge it governs.
- Frame by loading tier. Within authority, knowledge is grouped by its loading tier, owned by knowledge/README.md, so Critical and Required knowledge is prioritized ahead of Optional and Contextual knowledge.
- Order by relevance within a level. Among knowledge of equal authority and tier, the more relevant to the task is placed higher, by defined relevance, never by a variable score.
- Preserve completeness. Prioritization orders the set; it never removes a required or dependency source to shorten it. Minimization is owned by ai/retrieval/loading-strategy.md, not here.

Prioritization yields the ordered set, which is assembled into the retrieval result under ai/retrieval/context-assembly.md. It is deterministic and the same at any repository scale, because it applies the fixed authority and tiers of the repository.

# Invariants

- Higher-authority knowledge is ordered above the lower-authority knowledge it governs.
- Prioritization applies the loading tiers owned by the knowledge repository and never redefines them.
- Prioritization is deterministic over the same set, task, and repository state.
- Prioritization orders the set only; it never adds, removes, loads, or alters knowledge, and never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns prioritization only. It owns none of the following, and references each by its canonical owner.

- The loading tiers: knowledge/README.md.
- The authority the order follows: knowledge/architecture/authority-map.md.
- The dependency-complete set that is ordered: ai/retrieval/dependency-resolution.md.
- The minimization of the set: ai/retrieval/loading-strategy.md.
- The assembly of the ordered set into the result: ai/retrieval/context-assembly.md.
- The order in which the runtime loads the result: ai/runtime/knowledge-resolution.md.
- Any ranking or scoring algorithm: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/retrieval/README.md
- ai/retrieval/retrieval.md
- ai/retrieval/dependency-resolution.md
- ai/retrieval/context-assembly.md
- ai/retrieval/loading-strategy.md
- knowledge/README.md
- knowledge/architecture/authority-map.md
