---
id: OL-AI-EVOLUTION-EVOLUTION-LIFECYCLE
document: ai/evolution/evolution-lifecycle.md

title: Open Lance AIOS Evolution Lifecycle

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
  - ai/evolution/README.md
  - ai/evolution/evolution.md

used_by:
  - AI Systems Architect
  - Any AI agent that maintains or extends the AI layer
  - All human governors
  - Any contributor to the Evolution namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the phases of an architectural change: proposal, review, approval,
  introduction, stabilization, and retirement. It owns the evolution lifecycle
  only, and defers the document amendment workflow and the change model to their
  owners.
---

# Open Lance AIOS Evolution Lifecycle

This document owns the phases of an architectural change. It is an evolution document at the Specification authority level defined in ai/README.md, and it follows the Evolution Document Standard in ai/evolution/README.md. It instantiates the evolution invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the evolution lifecycle only. It never defines the document amendment workflow, owned by ai/CONTRIBUTING.md, and it never defines the change model, owned by ai/evolution/change-management.md.

# Purpose

This document owns one evolution concern: the phases an architectural change passes through, from being proposed to being retired. It exists so that any human or AI agent can determine the shape of an architectural change over time, independent of the workflow that amends each document and of the change model that classifies it.

# Principles

These are the enduring principles for the evolution lifecycle. Each instantiates an evolution invariant owned by ai/evolution/README.md.

- A change has a defined beginning and end. An architectural change begins with a proposal and ends when it is stabilized or retired; it never proceeds unbounded.
- Review and approval precede introduction. A change is reviewed and approved before it is introduced into the architecture, so nothing enters ungoverned.
- Introduction is additive and stabilized. A change is introduced additively and stabilized before it is relied on, so the architecture is never left in a half-changed state.
- Retirement is orderly. A superseded part is retired in an orderly way, deprecated and migrated first, so nothing is removed while it is still depended on.

# Specification

An architectural change passes through the following ordered phases. This document owns the phases; the amendment of each document within a change is owned by ai/CONTRIBUTING.md, and the change model that classifies a change is owned by ai/evolution/change-management.md.

- Proposal. An architectural change is proposed, framed on the current architecture recorded in ai/architecture/repository-evolution.md and the roadmap owned by ai/evolution/evolution-planning.md. A proposal states the intended change; it changes nothing yet.
- Review. The proposal is reviewed against the constitution, the governance change rules owned by ai/governance/change-governance.md, and the compatibility owned by ai/evolution/compatibility-management.md, so that its impact is understood before it proceeds.
- Approval. The change is approved under the governance change rules and the human governance owned by ai/governance/human-oversight.md. An unapproved change does not proceed.
- Introduction. The approved change is introduced into the architecture additively, through the amendment workflow owned by ai/CONTRIBUTING.md, and where it supersedes a part, through migration owned by ai/evolution/migration-model.md. Introduction extends the architecture and never erodes the constitution.
- Stabilization. The introduced change is stabilized: it is confirmed consistent with the architecture, its compatibility preserved, and the maturity map updated under ai/architecture/repository-evolution.md. A change is relied on only once stabilized.
- Retirement. A superseded part is retired, after it is deprecated under ai/evolution/deprecation-model.md and its dependents migrated, so nothing is removed while still depended on.

Each phase precedes the next, and a change never enters the architecture before Approval or is removed before Retirement. The lifecycle is the same regardless of any tool or technology, and it holds across decades of growth.

# Invariants

- An architectural change begins at Proposal and ends at Stabilization or Retirement.
- Review and Approval precede Introduction, and no change enters the architecture ungoverned.
- A change is introduced additively and stabilized before it is relied on.
- A part is retired only after it is deprecated and its dependents migrated.
- A phase transition never executes, reasons, operates, governs, changes behavior, or changes ownership, authority, or business truth.

# Boundaries

This document owns the evolution lifecycle only. It owns none of the following, and references each by its canonical owner.

- The document amendment, certification, and freeze workflow within a change: ai/CONTRIBUTING.md.
- The change model and change categories: ai/evolution/change-management.md.
- The planning and roadmap a proposal rests on: ai/evolution/evolution-planning.md.
- The compatibility, migration, and deprecation within the phases: ai/evolution/compatibility-management.md, ai/evolution/migration-model.md, and ai/evolution/deprecation-model.md.
- The approval rules and human governance: ai/governance/change-governance.md and ai/governance/human-oversight.md.
- The maturity map updated at stabilization: ai/architecture/repository-evolution.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/evolution/README.md
- ai/evolution/evolution.md
- ai/evolution/change-management.md
- ai/evolution/evolution-planning.md
- ai/evolution/compatibility-management.md
- ai/evolution/migration-model.md
- ai/evolution/deprecation-model.md
- ai/governance/change-governance.md
- ai/governance/human-oversight.md
- ai/architecture/repository-evolution.md
