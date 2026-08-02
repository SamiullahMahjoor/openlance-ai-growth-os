---
title: Knowledge Repository Contribution Guide
id: knowledge-contributing
document: knowledge/CONTRIBUTING.md
document_type: normative
authority: Process
version: 1.0
status: Frozen
owner: Knowledge Architect
reviewed_by: Independent AI Architecture Reviewer
provenance: Executive Decision; operationalizes knowledge/README.md
last_updated: 2026-08-02
depends_on:
  - knowledge/README.md
used_by:
  - All human contributors
  - All AI contributors
loading_priority: Required
---

# Knowledge Repository Contribution Guide

This is the operational contribution guide for the knowledge repository. It complements the repository constitution at knowledge/README.md. The constitution defines what the repository is and the rules it obeys. This guide defines how contributors create, review, approve, update, and maintain documents within those rules.

Definitions of the document lifecycle, metadata standard, knowledge hierarchy, authority, and cross-reference rules live in knowledge/README.md and are not repeated here. This guide references them and tells contributors how to act on them. Where this guide and the constitution ever appear to differ, knowledge/README.md governs.

# Purpose

This document defines the official contribution process for the knowledge repository. Every contributor, human or AI, must read and follow it before adding or modifying any knowledge in the repository.

It exists so that contributions are consistent, reviewed, and safe no matter who or what produces them. A human contributor and an AI contributor performing the same task should follow the same steps and reach a repository in the same healthy state.

This guide is operational. It tells contributors what to do. It does not redefine the architecture. For the underlying rules, consult knowledge/README.md.

# Core Principles

These are the operating commitments every contributor accepts. They restate, in contribution terms, the philosophy defined in knowledge/README.md.

- Knowledge before prompts. Durable knowledge belongs in the repository, not inside prompts or an agent's memory. Contribute the knowledge, then let prompts point to it.
- Single source of truth. Each fact has exactly one owning document. Add to or reference that document rather than creating a competing source.
- One responsibility per document. A document covers a single subject. If a contribution spans two subjects, it belongs in two documents.
- Quality over speed. A correct, reviewed, well-scoped document is the goal. A fast but unreviewed or duplicated one is a defect.
- Never duplicate knowledge. Do not copy content between documents. Duplication guarantees future drift.
- Cross-reference instead of copy. When another document owns a fact, link to it by canonical repository path.
- Never invent facts. If information is unknown, mark it as requiring confirmation. Do not guess, and do not fabricate provenance.
- Prefer timeless documentation. Capture durable truth. Keep temporary or operational information out of foundational documents.
- Repository consistency over personal preference. When a personal style or opinion conflicts with the repository's standards, the standards win.

# Contribution Workflow

Every contribution follows this mandatory workflow. It applies the document lifecycle from knowledge/README.md and adds the contributor actions around it.

1. Identify whether a document already exists. Before writing anything, determine whether the topic is already owned by an existing document. If it is, contribute there or reference it. This prevents duplication at the source.
2. Create a draft. If a new document is genuinely needed, create it in Draft status with complete metadata and a single clear responsibility. A draft is not yet authoritative and agents must not rely on it for decisions.
3. Perform a critical review. Review the draft adversarially against the Review Standards below. Surface every inaccuracy, ambiguity, duplication, and inconsistency with higher-authority documents. For any normative document, the reviewer must be independent of the author: the contributor who wrote the draft may not be its sole reviewer.
4. Apply only targeted fixes. Apply the specific corrections identified in review. Do not rewrite content that was already correct, and preserve approved wording.
5. Re-review the fixes. After the targeted fixes, review the document again to confirm that every issue is resolved and that the fixes introduced no new problems. Repeat fix and re-review until the review passes with no unresolved issues. No document may be frozen until a re-review has passed.
6. Freeze Version 1.0. When the document meets the Freeze Criteria, mark it Frozen and set its version. From this point it is authoritative and changes only through the Amendment Policy and the Amendment Workflow.
7. Commit to version control. Record the frozen document in version control so its history, authorship, and changes are traceable. Nothing is considered final until it is committed.
8. Update related documents if required. If the contribution changes something other documents depend on, update those documents or open follow-up work for them, so the repository stays internally consistent.

# Before Creating a New Document

Creating a document is the last resort, not the first move. Work through this checklist first, and create a new document only if every answer supports it.

- Does this document already exist under a different name or path?
- Does another document already own this topic or fact?
- Can this information be referenced from an existing document instead of created?
- Is a new document actually necessary, or is this a section that belongs in an existing one?
- If it is necessary, what is its single responsibility? A document that needs the word "and" to describe its scope is probably two documents.
- What authority level and document_type will it declare, and does that placement make sense in the hierarchy?
- Does it belong in an existing folder, or does it require a genuinely new single-responsibility folder?

If an existing document can own the knowledge, extend or reference that document instead of creating a new one.

# Before Editing an Existing Document

Editing carries its own risks. A careless edit can break downstream documents or erase reviewed knowledge.

- Preserve stable knowledge. Change only what needs to change. Treat existing frozen content as correct until proven otherwise.
- Avoid unnecessary rewrites. Prefer small, targeted edits over wholesale rewrites. A rewrite must be justified, not a default.
- Maintain backwards compatibility. Do not break the meaning that other documents depend on, and do not invalidate inbound references without updating them.
- Keep document identifiers unchanged. The id is immutable. Renaming, moving, or re-versioning a document never changes its id.
- Update provenance if facts change. When a factual claim changes, update the document's provenance so the new information remains traceable to its source.
- Update version and last_updated. Follow the versioning policy in knowledge/README.md, and record the change in metadata.
- If the document is frozen, follow the Amendment Policy below before editing.

# Writing Standards

Every contribution must satisfy the Document Standards defined in knowledge/README.md. That list is canonical and is not duplicated here, so the two documents cannot drift apart. Contributors write to those standards, and reviewers check against them.

If a contributor is unsure what a standard requires, the constitution is the single source. Where this guide ever appears to differ from it, knowledge/README.md governs.

# Review Standards

A review verifies that a document meets the canonical Document Standards defined in knowledge/README.md. Those standards are not restated here; the reviewer checks the document against the constitution directly.

In addition to the canonical standards, a review confirms the process requirements this guide adds:

- Reviewer independence. For a normative document, the reviewer is not the author, as set out in the Approval Matrix.
- Hierarchy consistency. The document contradicts no higher-authority document, per the knowledge hierarchy in knowledge/README.md.
- Metadata and lifecycle. Metadata is complete and accurate, including authority and document_type, and the required lifecycle has been followed.
- Resolution. The document contains no unresolved ambiguity, and every issue raised has been fixed and re-reviewed.

A document passes only when the canonical standards and these process requirements are all satisfied. Otherwise the reviewer returns specific, targeted fixes.

# Freeze Criteria

A document is frozen only when all of the following are true.

- Its architecture and scope are approved.
- Its critical review, and the re-review of its fixes, are complete with no unresolved issues, and the review met the reviewer-independence requirement for its authority level.
- Its freeze is approved by the authority required in the Approval Matrix.
- It contains no unresolved ambiguity.
- Its metadata is complete and accurate.
- It is ready for production use by agents and contributors.
- It is committed to version control.

On freeze, the document's status becomes Frozen and its version is set. After freezing, it may change only through the Amendment Policy and the Amendment Workflow.

# Approval Matrix

This matrix maps a document's authority level, declared in its authority metadata, to who must review it and who may approve its freeze or amendment. For every normative document the reviewer must be independent of the author, and independence is also the default for reference documents. No document is frozen or amended until an independent review and a re-review have both passed.

| Authority level | Independent reviewer | Freeze or amendment approval |
| --- | --- | --- |
| Company, Vision, Mission, Principles, Legal | Independent human reviewer | Human authority (the document owner or a designated human) |
| Policy, Process, Campaign, Output | Independent reviewer, human or AI | Human approval required, because these levels are normative |
| Reference | Independent reviewer, human or AI | Human, or a designated agent acting under human accountability |

Where a level requires human approval, an agent may prepare and review the change but may not be the approver. When a document could sit at more than one level, the stricter rule applies.

# Amendment Policy

A frozen document is stable by default. It may be amended only for a substantive reason.

- Company strategy changes in a way the document must reflect.
- Legal or regulatory requirements change.
- The document is found to contain incorrect information.
- A new governance decision supersedes part of the document.

Every amendment goes through the same review discipline as a new document and updates the metadata, including version, last_updated, and provenance when facts change.

Feature requests, marketing campaigns, temporary initiatives, and personal preference are explicitly not sufficient reasons to amend a frozen foundational document. Fast-changing and operational information belongs in lower-level or dedicated documents, as defined by the versioning policy in knowledge/README.md. If such information is pressuring a foundational document to change, it is stored in the wrong place.

# Amendment Workflow

This workflow carries out a change to a frozen document. It applies only after the Amendment Policy above permits the change. A frozen document is never edited outside this workflow.

1. Confirm the reason. Verify that the change qualifies under the Amendment Policy. If it does not, the change does not proceed.
2. Assess impact. Identify the documents that depend on this one and the knowledge that could be affected, so the change does not silently break them.
3. Draft the amendment. Make targeted edits only. Preserve the document's immutable id, and keep all content that is not part of the change.
4. Independent review. Review the amendment against the Review Standards. For a normative document, the reviewer must be independent of the contributor who made the amendment.
5. Re-review after fixes. Apply only the corrections identified, then re-review until the review passes with no unresolved issues.
6. Approve and re-freeze. With the approval required by the Approval Matrix, increment the version, update last_updated, and update provenance if any fact changed. The document then returns to Frozen status.
7. Commit and propagate. Commit the amended document to version control, then update or open follow-up work for the dependent documents identified in step 2.

# AI Contributor Responsibilities

AI contributors operate under stricter defaults because they act quickly and at scale.

- Never assume. When information is missing, state that confirmation is required rather than filling the gap.
- Ask for clarification when a task is ambiguous, or when a change would affect a higher-authority document.
- Respect document authority and the knowledge hierarchy when deciding what may change what.
- Never overwrite or contradict canonical knowledge. Frozen and higher-authority documents are not to be silently changed.
- Preserve metadata. Never drop, alter, or reassign a document's immutable id, and keep all required metadata intact.
- Follow the repository hierarchy for conflict resolution. When a conflict cannot be resolved confidently, halt and escalate to a human rather than guessing.
- Use canonical repository paths for every reference.
- Make targeted edits, never unrequested rewrites, and never invent facts or provenance.

# Human Contributor Responsibilities

Human contributors hold final accountability for the repository.

- Review AI output before it is committed or frozen.
- Validate factual accuracy and confirm provenance.
- Approve strategic and higher-authority changes. Normative and strategic changes require human approval, not agent judgment alone.
- Protect repository quality and consistency over time.
- Own freeze and amendment decisions.
- Resolve conflicts that agents escalate, and record the decision so it becomes durable knowledge.

# Common Anti-Patterns

These are the recurring mistakes that degrade the repository. Every contribution should be checked against them.

- Creating a duplicate document instead of referencing the existing owner of a topic.
- Rewriting stable or frozen documents when a targeted edit, or no edit, was enough.
- Mixing strategy and operations in a single document.
- Hardcoding temporary information, such as metrics, campaigns, or fast-changing figures, into foundational documents.
- Ignoring the authority hierarchy, or inferring authority from a document's folder instead of its authority metadata.
- Bypassing review, or freezing a document that was never critically reviewed.
- Changing or reusing a document identifier.
- Copying content instead of cross-referencing it.

# Repository Evolution

The repository is meant to grow for years without losing consistency. Growth is always additive and always follows this guide and the constitution.

New knowledge arrives as new single-responsibility documents and, when needed, new single-responsibility folders, rather than by enlarging existing documents. Every new document passes through the same workflow, review, and freeze, so scale does not dilute quality.

Higher-authority documents change rarely and carry the repository's stable foundations. Operational documents carry the churn. This separation lets the repository absorb many contributors and many agents while its foundations stay steady.

When growth would require changing the architecture itself rather than adding within it, that is a change to the constitution and must be reviewed against knowledge/README.md, not worked around. Capabilities deliberately deferred for the future are recorded in the Future Architecture Roadmap in knowledge/README.md. The goal is a repository that scales to many documents, contributors, and agents while preserving its single source of truth.

# Future Process Roadmap

The following process capabilities are deliberately out of scope for this version of the contribution process. They are recorded here as future enhancements, to be designed and adopted only through an amendment to this guide, reviewed against knowledge/README.md. Listing them keeps the current process simple and prevents them from being improvised.

- Ownership transfer. A defined process for reassigning a document's owner role.
- Draft retirement. A lifecycle for drafts that are abandoned before freeze.
- Review cadence. Periodic re-validation of frozen documents to catch silent staleness.
- Rollback. A defined path to revert a document to a previous frozen version.
- Emergency amendments. An expedited amendment path for urgent corrections, with review applied after the fact.
- Exception handling. A sanctioned, recorded way to deviate from this process in a specific case.
- Concurrency. Rules for coordinating simultaneous contributions to the same document.
- Review teams. Routing of reviews to domain-specific or authority-specific reviewer groups.
- Repository indexing. A catalog that lets contributors reliably discover existing documents and dependents.
- Escalation routing. A defined recipient and path for escalations raised during contribution.

Until each capability is adopted through an amendment to this guide, contributors operate within the process defined above and must not assume these capabilities exist.
