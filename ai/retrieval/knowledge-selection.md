---
id: OL-AI-RETRIEVAL-KNOWLEDGE-SELECTION
document: ai/retrieval/knowledge-selection.md

title: Open Lance AIOS Knowledge Selection

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
  Owns how discovered knowledge is judged eligible and selected as required
  for a task, by relevance and by governance permission. It owns selection
  only, and defers the permission rules and the dependencies of the selected
  set to their owners.
---

# Open Lance AIOS Knowledge Selection

This document owns how discovered knowledge is selected for a task. It is a retrieval document at the Specification authority level defined in ai/README.md, and it follows the Retrieval Document Standard in ai/retrieval/README.md. It instantiates the retrieval invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns selection only. It never defines the permission rules that make knowledge eligible, which are owned by ai/governance/, and it never resolves the dependencies of the selected set, which are owned by ai/retrieval/dependency-resolution.md.

# Purpose

This document owns one retrieval concern: how the candidate knowledge discovered for a task is judged eligible and selected as required. It exists so that any human or AI agent can determine which discovered knowledge is chosen, and why, independent of any ranking technology.

# Principles

These are the enduring principles for selection. Each instantiates a retrieval invariant owned by ai/retrieval/README.md.

- Selection is by relevance and eligibility. A candidate is selected only if it is relevant to the task and eligible under governance.
- Selection is minimal. Only the knowledge a task requires is selected; knowledge that is merely available is not.
- Governance permits or denies. Whether a candidate may be selected is subject to the permissions owned by ai/governance/, which selection applies and never redefines.
- Selection is deterministic. The same candidates for the same task and repository state are selected identically, by defined criteria, with no heuristic ranking.

# Specification

From the candidates discovered under ai/retrieval/knowledge-discovery.md, selection determines the required, eligible, permitted set. This document owns selection; the criteria it applies are drawn from the sources named.

- Judge relevance. A candidate is judged relevant when the task genuinely requires the concern it owns. Relevance is determined against the task, not against the candidate's availability.
- Apply eligibility. A candidate is eligible only if governance permits the execution to consume it, under ai/governance/permission-governance.md and ai/governance/constitutional-validation.md, which selection applies and never restates.
- Prefer the required over the contextual. The knowledge a task requires is selected; contextual knowledge is selected only when the task's situation triggers it, per the tiers owned by knowledge/README.md.
- Select the minimum. The result is the smallest set of relevant, eligible knowledge sufficient for the task, before its dependencies are resolved.

Selection yields the required set, not the final result: its dependencies are resolved by ai/retrieval/dependency-resolution.md and it is prioritized and assembled afterward. Selection is deterministic and the same at any repository scale, because it judges each candidate against the task and the fixed rules, never against a variable score.

# Invariants

- Only relevant, eligible, governance-permitted knowledge is selected.
- Selection is minimal; knowledge that is not required is not selected.
- Selection is deterministic over the same candidates, task, and repository state.
- Selecting knowledge never loads it, never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns selection only. It owns none of the following, and references each by its canonical owner.

- The discovery of candidates: ai/retrieval/knowledge-discovery.md.
- The permission and eligibility rules: ai/governance/permission-governance.md and ai/governance/constitutional-validation.md.
- The loading tiers that distinguish required from contextual: knowledge/README.md.
- The dependencies of the selected set: ai/retrieval/dependency-resolution.md.
- The prioritization and assembly of the selected set: ai/retrieval/context-prioritization.md and ai/retrieval/context-assembly.md.
- Any ranking, scoring, or relevance algorithm: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/retrieval/README.md
- ai/retrieval/retrieval.md
- ai/retrieval/knowledge-discovery.md
- ai/retrieval/dependency-resolution.md
- ai/governance/permission-governance.md
- ai/governance/constitutional-validation.md
- knowledge/README.md
