---
title: AI Operating System Contribution Guide
id: ai-contributing
document: ai/CONTRIBUTING.md
document_type: normative
authority: Process
version: 1.0
status: Frozen
owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer
provenance: Executive Decision; operationalizes ai/README.md
last_updated: 2026-08-02
depends_on:
  - ai/README.md
used_by:
  - All human contributors
  - All AI contributors
loading_priority: Required
---

# AI Operating System Contribution Guide

This is the operational contribution guide for the AI Operating System. It complements the AI constitution at ai/README.md. The constitution defines what the AI layer is and the rules it obeys. This guide defines how contributors create, review, approve, update, certify, and maintain AI documents within those rules.

Definitions of the document lifecycle, metadata standard, authority hierarchy, boundary, and cross-reference rules live in ai/README.md and are not repeated here. This guide references them and tells contributors how to act on them. Where this guide and the constitution ever appear to differ, ai/README.md governs. Where any AI document touches business truth, the knowledge repository and its constitution at knowledge/README.md govern.

# Purpose

This document defines the official contribution process for the AI layer. Every contributor, human or AI, must read and follow it before adding or modifying any document in `ai/`.

It exists so that contributions are consistent, reviewed, governed, and safe no matter who or what produces them. A human contributor and an AI contributor performing the same task follow the same steps and leave the layer in the same healthy state.

This guide is operational. It tells contributors what to do. It does not redefine the architecture. For the underlying rules, consult ai/README.md.

# Core Principles

These are the operating commitments every contributor accepts. They restate, in contribution terms, the philosophy in ai/README.md.

- Behavior before prompts and code. Durable behavior belongs in the AI layer, not inside prompts, model memory, framework defaults, or code. Contribute the behavior, then let the runtime apply it.
- Knowledge before behavior. Business truth is consumed from the knowledge repository, never restated in the AI layer.
- Single owner per concern. Each behavior has exactly one owning document. Add to or reference that document rather than creating a competing source.
- One responsibility per document. A document defines a single behavior. If a contribution spans two behaviors, it belongs in two documents.
- Quality over speed. A correct, reviewed, well-scoped document is the goal. A fast but unreviewed or duplicated one is a defect.
- Never duplicate behavior or knowledge. Do not copy behavior between AI documents, and do not copy business truth out of the knowledge repository.
- Cross-reference instead of copy. When another document owns a behavior, or a knowledge document owns a fact, link to it by canonical path.
- Never invent behavior or facts. If a behavior or a fact is unknown, mark it as requiring definition or confirmation. Do not guess, and do not fabricate provenance.
- Technology neutrality over convenience. Never encode a provider, model, framework, language, runtime, or implementation into a document.
- Layer consistency over personal preference. When a personal style or opinion conflicts with the layer's standards, the standards win.

# Contribution Workflow

Every contribution follows this mandatory workflow. It applies the document lifecycle from ai/README.md and adds the contributor actions around it.

1. Identify whether a document already exists. Before writing anything, determine whether the behavior is already owned by an existing document. If it is, contribute there or reference it. This prevents duplication at the source.
2. Confirm the boundary. Confirm the contribution defines AI behavior only, and consumes any business truth from the knowledge repository by canonical reference rather than restating it.
3. Create a draft. If a new document is genuinely needed, create it in Draft status with complete metadata and a single clear responsibility. A draft is not authoritative and agents must not rely on it.
4. Perform a critical review. Review the draft adversarially against the Review Standards below. Surface every inaccuracy, ambiguity, duplication, boundary violation, technology leakage, and inconsistency with higher-authority documents. For any normative document, the reviewer must be independent of the author.
5. Apply only targeted fixes. Apply the specific corrections identified in review. Do not rewrite content that was already correct, and preserve approved wording.
6. Re-review the fixes. After the targeted fixes, review the document again to confirm every issue is resolved and no new problem was introduced. Repeat fix and re-review until the review passes with no unresolved issues. No document is frozen until a re-review has passed.
7. Freeze Version 1.0. When the document meets the Freeze Criteria, mark it Frozen and set its version. From this point it is authoritative and changes only through the Amendment Policy and Amendment Workflow.
8. Commit to version control. Record the frozen document so its history, authorship, and changes are traceable.
9. Update related documents if required. If the contribution changes something other documents depend on, update those documents or open follow-up work, so the layer stays internally consistent.

# Before Creating a New Document

Creating a document is the last resort, not the first move. Work through this checklist first, and create a new document only if every answer supports it.

- Does this document already exist under a different name or path?
- Does another AI document already own this behavior?
- Is this business truth that the knowledge repository already owns, and that should be consumed rather than defined here?
- Can this behavior be referenced from an existing document instead of created?
- Is a new document actually necessary, or is this a section that belongs in an existing one?
- If it is necessary, what is its single responsibility? A document that needs the word "and" to describe its scope is probably two documents.
- What authority level and document_type will it declare, and does that placement make sense in the AI Authority Hierarchy?
- Does it belong in an existing folder, or does it require a genuinely new single-responsibility folder?

If an existing document can own the behavior, extend or reference it instead of creating a new one.

# Before Editing an Existing Document

Editing carries its own risks. A careless edit can break downstream documents or erase reviewed behavior.

- Preserve stable behavior. Change only what needs to change. Treat existing frozen content as correct until proven otherwise.
- Avoid unnecessary rewrites. Prefer small, targeted edits over wholesale rewrites. A rewrite must be justified, not a default.
- Maintain compatibility. Do not break the behavior that other documents depend on, and do not invalidate inbound references without updating them.
- Keep document identifiers unchanged. The id is immutable. Renaming, moving, or re-versioning a document never changes its id.
- Update provenance when the source of a decision changes. Keep the definition traceable.
- Update version and last_updated. Follow the versioning policy in ai/README.md, and record the change in metadata.
- If the document is frozen, follow the Amendment Policy below before editing.

# Writing Standards

Every contribution must satisfy the Document Standards defined in ai/README.md. That list is canonical and is not duplicated here, so the two documents cannot drift apart. Contributors write to those standards, and reviewers check against them.

If a contributor is unsure what a standard requires, the constitution is the single source. Where this guide ever appears to differ from it, ai/README.md governs.

# Metadata Validation

Before review, every document's metadata is validated against the Metadata Standard in ai/README.md.

- All required fields are present and non-empty.
- id is unique across the layer, correctly formatted, and unchanged from creation.
- document matches the document's actual repository path.
- document_type is exactly `normative` or `reference`, and is consistent with the declared authority.
- authority is exactly one level from the AI Authority Hierarchy.
- loading_priority is one of the defined tiers.
- depends_on targets exist, or are declared forward references, and reference only `ai/` documents or, for consumption, `knowledge/` documents, never the reverse direction.
- No metadata field contains behavior, and no behavior is omitted into prose that a field should carry.

A document with invalid metadata does not proceed to freeze.

# Review Standards

A review verifies that a document meets the canonical Document Standards in ai/README.md. Those standards are not restated here; the reviewer checks the document against the constitution directly.

In addition to the canonical standards, a review confirms the process requirements this guide adds:

- Reviewer independence. For a normative document, the reviewer is not the author, as set out in the Approval Matrix.
- Boundary integrity. The document defines AI behavior only, states no business truth, and consumes any business fact by canonical reference to the knowledge repository.
- Technology neutrality. The document names no provider, model, framework, language, runtime, protocol, or implementation.
- Ownership. The document owns exactly one concern, and no other document owns it.
- Hierarchy consistency. The document contradicts no higher-authority AI document and no knowledge document it consumes.
- Determinism. The document is written so that two agents applying it reach the same governed behavior.
- Metadata and lifecycle. Metadata validation has passed and the required lifecycle has been followed.
- Resolution. The document contains no unresolved ambiguity, and every issue raised has been fixed and re-reviewed.

A document passes only when the canonical standards and these process requirements are all satisfied. Otherwise the reviewer returns specific, targeted fixes.

# Architectural Review

Beyond the review of a single document, an architectural review confirms the document fits the AI architecture as a whole.

- Ownership fit. The concern has exactly one owner, and the document does not overlap any existing owner.
- Authority fit. The declared authority level is correct for the concern and consistent with the documents above and below it.
- Dependency fit. The document's dependencies are acyclic within the AI layer, and any consumption of knowledge is one-directional.
- Boundary fit. Nothing in the document belongs to the knowledge repository or to implementation.
- Placement fit. The document sits in the folder that matches its single responsibility.

# Freeze Criteria

A document is frozen only when all of the following are true.

- Its architecture and scope are approved.
- Its critical review, and the re-review of its fixes, are complete with no unresolved issues, and the review met the reviewer-independence requirement for its authority level.
- Its freeze is approved by the authority required in the Approval Matrix.
- It contains no unresolved ambiguity, no boundary violation, and no technology leakage.
- Its metadata validation has passed.
- It is ready for production use by agents and contributors.
- It is committed to version control.

On freeze, the document's status becomes Frozen and its version is set. After freezing, it may change only through the Amendment Policy and Amendment Workflow.

# Approval Matrix

This matrix maps a document's authority level to who must review it and who may approve its freeze or amendment. For every normative document the reviewer must be independent of the author, and independence is also the default for reference documents. No document is frozen or amended until an independent review and a re-review have both passed.

| Authority level | Independent reviewer | Freeze or amendment approval |
| --- | --- | --- |
| Charter, Principle, Mandate | Independent human reviewer | Human authority (the document owner or a designated human) |
| Policy, Specification, Process | Independent reviewer, human or AI | Human approval required, because these levels are normative |
| Reference | Independent reviewer, human or AI | Human, or a designated agent acting under human accountability |

Where a level requires human approval, an agent may prepare and review the change but may not be the approver. When a document could sit at more than one level, the stricter rule applies.

# Amendment Policy

A frozen document is stable by default. It may be amended only for a substantive reason.

- The behavior it defines genuinely changes.
- A governance, safety, or human-oversight decision supersedes part of it.
- It is found to contain incorrect, ambiguous, or contradictory content.
- A change in the knowledge boundary requires it to consume differently.

Every amendment goes through the same review discipline as a new document and updates the metadata, including version, last_updated, and provenance when the source of a decision changes.

Provider changes, model changes, framework changes, and other operational churn are explicitly not sufficient reasons to amend a foundational AI document. Such change is absorbed by the provider, operations, and configuration layers, never by the constitution or the principles. If operational change is pressuring a foundational document, the behavior is defined at the wrong level.

# Amendment Workflow

This workflow carries out a change to a frozen document. It applies only after the Amendment Policy permits the change. A frozen document is never edited outside this workflow.

1. Confirm the reason. Verify the change qualifies under the Amendment Policy. If it does not, it does not proceed.
2. Assess impact. Identify the documents that depend on this one and the knowledge it consumes, so the change does not silently break them.
3. Draft the amendment. Make targeted edits only. Preserve the immutable id, and keep all content that is not part of the change.
4. Independent review. Review the amendment against the Review Standards. For a normative document, the reviewer is independent of the contributor who made the amendment.
5. Re-review after fixes. Apply only the corrections identified, then re-review until the review passes with no unresolved issues.
6. Approve and re-freeze. With the approval required by the Approval Matrix, increment the version, update last_updated, and update provenance if the source of a decision changed. The document returns to Frozen status.
7. Commit and propagate. Commit the amended document, then update or open follow-up work for the dependent documents identified in step 2.

# Repository Consistency Review

Before a related group of documents is frozen, or after any amendment that affects more than one document, a consistency review confirms the AI layer as a whole is coherent.

- Ownership. No concern has two owners, and no referenced concern is unowned.
- Authority. Every document's authority is valid and consistent with the hierarchy.
- Dependencies. The dependency graph is acyclic within the AI layer, and consumption of knowledge is one-directional.
- References. Every reference is a canonical path that resolves, or is a declared forward reference.
- Inventories and maps. Any inventory matches the documents it lists, and the architecture maps describe the layer as it actually is.
- Boundary. No document has drifted into owning business truth or implementation.

Any inconsistency is corrected through the appropriate workflow before freeze.

# Certification Workflow

A namespace, or the layer as a whole, is certified only through an independent, adversarial review whose purpose is to prove it wrong.

1. Adversarial review. An independent reviewer attempts to prove the target inconsistent across ownership, authority, boundaries, dependencies, determinism, metadata, references, and scalability.
2. Classify findings. Each surviving finding is classified: Tier 1, a layer inconsistency; Tier 2, an architectural inconsistency; Tier 3, a non-blocking evolution recommendation.
3. Resolve. Every Tier 1 and Tier 2 finding is corrected through the appropriate workflow. Tier 3 findings are recorded and do not block certification.
4. Repeat until clean. The review repeats until no Tier 1 and no Tier 2 finding remains.
5. Certify and freeze. With human approval, the target is certified and its documents are frozen. Certification is recorded so it is traceable.

Certification never lowers any standard. It is the same discipline applied to a group of documents that the review discipline applies to one.

# AI Contributor Responsibilities

AI contributors operate under stricter defaults because they act quickly and at scale.

- Never assume. When a behavior or fact is missing, state that definition or confirmation is required rather than filling the gap.
- Ask for clarification when a task is ambiguous, or when a change would affect a higher-authority document or the knowledge boundary.
- Respect document authority and the AI Authority Hierarchy when deciding what may change what.
- Never overwrite or contradict canonical behavior or knowledge. Frozen and higher-authority documents, and all knowledge documents, are not silently changed.
- Never write business truth into the AI layer, and never write behavior into the knowledge repository.
- Preserve metadata. Never drop, alter, or reassign an immutable id, and keep all required metadata intact.
- Follow the hierarchy for conflict resolution. When a conflict cannot be resolved confidently, halt and escalate to a human rather than guessing.
- Use canonical repository paths for every reference, and consume knowledge one-directionally.
- Make targeted edits, never unrequested rewrites, and never invent behavior, facts, or provenance.

# Human Contributor Responsibilities

Human contributors hold final accountability for the AI layer.

- Review AI output before it is committed, frozen, or certified.
- Validate that behavior is correct, deterministic, and within the boundary.
- Approve normative and higher-authority changes. These require human approval, not agent judgment alone.
- Own freeze, amendment, and certification decisions.
- Protect the layer's quality, boundary, and consistency over time.
- Resolve conflicts that agents escalate, and record the decision so it becomes durable behavior.

# Common Anti-Patterns

These are the recurring mistakes that degrade the layer. Every contribution is checked against them.

- Restating business truth in the AI layer instead of consuming it from the knowledge repository.
- Encoding a provider, model, framework, language, runtime, or code into a document.
- Creating a duplicate document instead of referencing the existing owner of a behavior.
- Rewriting stable or frozen documents when a targeted edit, or no edit, was enough.
- Mixing two behaviors in a single document.
- Promoting runtime state, memory, or output into the knowledge repository.
- Inferring authority from a document's folder instead of its authority metadata.
- Bypassing review or certification, or freezing a document that was never critically reviewed.
- Changing or reusing a document identifier.
- Copying content instead of cross-referencing it.

# Repository Evolution

The AI layer is meant to grow for years without losing consistency. Growth is always additive and always follows this guide and the constitution.

New behavior arrives as new single-responsibility documents and, when needed, new single-responsibility folders, rather than by enlarging existing documents. Every new document passes through the same workflow, review, certification, and freeze, so scale does not dilute quality.

Higher-authority documents change rarely and carry the layer's stable foundations. Operational documents carry the churn from providers, models, and runtimes. This separation lets the layer absorb many contributors, many agents, and many technologies while its foundations stay steady.

When growth would require changing the architecture itself rather than adding within it, that is a change to the constitution and is reviewed against ai/README.md, not worked around. Capabilities deliberately deferred are recorded in the Future Architecture Roadmap in ai/README.md.

# Future Process Roadmap

The following process capabilities are deliberately out of scope for this version of the contribution process. They are recorded as future enhancements, adopted only through an amendment to this guide, reviewed against ai/README.md.

- Automated metadata and reference validation. Tooling that checks metadata, references, and cycles without a manual pass.
- Continuous certification. Periodic re-certification of frozen namespaces to catch silent drift.
- Consumption pinning. Recording the exact knowledge versions a document consumed, so it can detect when an upstream fact changes in meaning.
- Rollback. A defined path to revert a document to a previous frozen version.
- Emergency amendment. An expedited amendment path for urgent safety corrections, with review applied after the fact.
- Ownership transfer. A defined process for reassigning a document's owner role.
- Review routing. Routing of reviews to domain-specific or authority-specific reviewer groups.
- Escalation routing. A defined recipient and path for escalations raised during contribution.

Until each capability is adopted through an amendment to this guide, contributors operate within the process defined above and must not assume these capabilities exist.
