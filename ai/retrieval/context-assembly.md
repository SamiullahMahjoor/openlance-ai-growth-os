---
id: OL-AI-RETRIEVAL-CONTEXT-ASSEMBLY
document: ai/retrieval/context-assembly.md

title: Open Lance AIOS Context Assembly

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
  Owns how the selected, dependency-complete, prioritized knowledge is
  assembled into the coherent retrieval result the runtime loads. It owns the
  assembly of the retrieval result only, and defers the assembly of the
  execution context to the runtime.
---

# Open Lance AIOS Context Assembly

This document owns how the retrieved knowledge is assembled into the retrieval result. It is a retrieval document at the Specification authority level defined in ai/README.md, and it follows the Retrieval Document Standard in ai/retrieval/README.md. It instantiates the retrieval invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the assembly of the retrieval result only. It never assembles the execution context, which combines loaded knowledge, memory, and the task and is owned by ai/runtime/context-loading.md. Retrieval assembles the knowledge to load; the runtime loads it and assembles the execution context.

# Purpose

This document owns one retrieval concern: how the prioritized knowledge set is assembled into the single, coherent retrieval result that the runtime loads. It exists so that any human or AI agent can determine the form of the retrieval result, independent of how it is loaded or held.

# Principles

These are the enduring principles for assembly. Each instantiates a retrieval invariant owned by ai/retrieval/README.md.

- Assembly produces a determination, not truth. The retrieval result names the knowledge to load and its order; it never contains, restates, or alters the truth itself.
- Assembly preserves authority and order. The result carries the priority order established by prioritization, so the runtime loads foundational and governing knowledge first.
- Assembly preserves completeness. The result contains the whole dependency-complete, minimum sufficient set, and nothing beyond it.
- Assembly is by canonical reference. The result names each piece by its single canonical owner, never by a copy.

# Specification

For the ordered set produced under ai/retrieval/context-prioritization.md, assembly forms the retrieval result. This document owns the retrieval result; the execution context is owned by the runtime.

- Compose the result. The prioritized, dependency-complete, minimum sufficient set is composed into a single retrieval result, ordered as prioritized, with each piece named by its canonical owner.
- Preserve authority framing. The result presents higher-authority knowledge together with the lower-authority knowledge it governs, so the set is coherent and self-governing.
- Hand off for loading. The retrieval result is validated under ai/retrieval/retrieval-validation.md and then handed to the runtime, which loads it under ai/runtime/knowledge-resolution.md and assembles the execution context under ai/runtime/context-loading.md.

Retrieval assembles only the knowledge to be loaded. Combining that loaded knowledge with memory and the task into the execution context is the runtime's concern, not this document's. Assembly is deterministic and the same at any repository scale, because it composes a fixed, ordered set.

# Invariants

- The retrieval result contains exactly the prioritized, dependency-complete, minimum sufficient set, in priority order.
- Each piece in the result is named by its single canonical owner, never restated.
- The result names the knowledge to load; it never contains the truth or the execution context.
- Assembling the result never loads knowledge, never assembles the execution context, and never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the assembly of the retrieval result only. It owns none of the following, and references each by its canonical owner.

- The prioritization the result carries: ai/retrieval/context-prioritization.md.
- The validation of the result before handoff: ai/retrieval/retrieval-validation.md.
- The loading of the result: ai/runtime/knowledge-resolution.md.
- The assembly of the execution context from loaded knowledge, memory, and the task: ai/runtime/context-loading.md.
- The truth the result names: the knowledge repository.
- Any store, window, format, or mechanism that holds the result: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/retrieval/README.md
- ai/retrieval/retrieval.md
- ai/retrieval/context-prioritization.md
- ai/retrieval/retrieval-validation.md
- ai/runtime/knowledge-resolution.md
- ai/runtime/context-loading.md
