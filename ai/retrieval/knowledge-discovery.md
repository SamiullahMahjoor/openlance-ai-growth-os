---
id: OL-AI-RETRIEVAL-KNOWLEDGE-DISCOVERY
document: ai/retrieval/knowledge-discovery.md

title: Open Lance AIOS Knowledge Discovery

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
  Owns how the candidate knowledge relevant to a task is discovered from the
  canonical owners in the knowledge repository. It owns discovery only, and
  defers the truth itself, selection, and any search technology to their
  owners.
---

# Open Lance AIOS Knowledge Discovery

This document owns how candidate knowledge is discovered for a task. It is a retrieval document at the Specification authority level defined in ai/README.md, and it follows the Retrieval Document Standard in ai/retrieval/README.md. It instantiates the retrieval invariants, operates under the governance mandates at ai/governance/, and consumes the ownership and metadata of the knowledge repository. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns discovery only. It never owns the truth it discovers, which is owned by the knowledge repository, never selects among candidates, which is owned by ai/retrieval/knowledge-selection.md, and never defines any search engine, index, or discovery mechanism, which is implementation.

# Purpose

This document owns one retrieval concern: how the knowledge that could be relevant to a task is discovered from its canonical owners. It exists so that any human or AI agent can determine how candidate knowledge is found, independent of any search technology.

# Principles

These are the enduring principles for discovery. Each instantiates a retrieval invariant owned by ai/retrieval/README.md.

- Discovery is by ownership. Candidate knowledge is discovered through its canonical owners, so every candidate is traceable to the one document that owns it.
- Discovery reads; it never authors. Discovery finds what exists in the knowledge repository and never creates, restates, or infers knowledge that is not there.
- Discovery is authority-aware. Discovery finds not only the knowledge a task names but the higher-authority knowledge that governs it, so nothing relevant is missed.
- Discovery is complete over the canonical sources. Discovery draws only from the canonical knowledge repository, never from a copy, a cache treated as truth, or invented content.

# Specification

For a resolved task, discovery identifies the candidate knowledge that could be relevant, drawn from the canonical owners in the knowledge repository. This document owns discovery; the selection among the candidates is owned by ai/retrieval/knowledge-selection.md.

- Discover by concern. The concerns a task touches are matched to the documents that own them, using the ownership recorded by knowledge/architecture/ownership-map.md and each document's own metadata.
- Discover the governing sources. For each candidate, the higher-authority documents that govern it are also discovered, using the authority recorded by knowledge/architecture/authority-map.md, so a governing source is never overlooked.
- Discover from canonical owners only. Every candidate is the single canonical document that owns its concern; discovery never yields a duplicate or a restated source.
- Produce candidates, not a result. Discovery yields the set of candidate documents. Whether each candidate is required, eligible, and permitted is decided by ai/retrieval/knowledge-selection.md, not here.

Discovery is the same whether the repository holds ten documents or millions, because it matches a task's concerns to their owners rather than scanning the whole repository, and it names candidates without regard to any index or search technology.

# Invariants

- Every candidate is a single canonical owner of a concern, never a duplicate or a restatement.
- Discovery yields candidates only; it never selects, loads, or alters them.
- Discovery is read-only across the layer boundary and never writes to the knowledge repository.
- Discovering candidates never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns discovery only. It owns none of the following, and references each by its canonical owner.

- The truth the candidates carry: the knowledge repository.
- The ownership and authority discovery reads: knowledge/architecture/ownership-map.md and knowledge/architecture/authority-map.md.
- The selection of candidates: ai/retrieval/knowledge-selection.md.
- The dependencies of a candidate: ai/retrieval/dependency-resolution.md.
- Any search engine, index, embedding, or discovery mechanism: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/retrieval/README.md
- ai/retrieval/retrieval.md
- ai/retrieval/knowledge-selection.md
- knowledge/README.md
- knowledge/architecture/ownership-map.md
- knowledge/architecture/authority-map.md
