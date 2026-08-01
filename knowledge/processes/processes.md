---
id: OL-KNOW-PROCESSES-PROCESSES
document: knowledge/processes/processes.md

title: Open Lance Process Inventory

version: 1.0
status: Frozen

document_type: reference
authority: Reference

owner: Product Manager
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - knowledge/README.md
  - knowledge/CONTRIBUTING.md
  - knowledge/processes/README.md
  - knowledge/product/workflows.md

used_by:
  - Product Manager
  - Operations Manager
  - CMO Agent
  - Customer Support Agent
  - Any AI Agent that discovers business processes
  - Any AI Agent that authors a process document
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/processes/README.md and knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  The single canonical inventory of the business processes Open Lance
  recognizes. It records only that each process exists and its identity,
  not its behavior, sequencing, rules, permissions, states, or
  implementation, which are owned elsewhere.
---

# Open Lance Process Inventory

This document is the single canonical inventory of the business processes that exist within Open Lance. It records only that each process exists and what its identity is. It does not define process behavior, sequencing, steps, inputs, outputs, business rules, permissions, states, or implementation, which are owned by the individual process documents under knowledge/processes/ and by the ontology owners in the Product namespace.

This is a reference document within the Process namespace. It follows the namespace guide in knowledge/processes/README.md, the repository constitution in knowledge/README.md, and the contribution process in knowledge/CONTRIBUTING.md, and it does not restate the content of any document it references. Where this document and a higher-authority document differ, the higher-authority document governs.

Processes in this inventory are technology-neutral and implementation-independent. A process continues to exist even if databases, APIs, interfaces, automation, or payment providers change. New processes are added by extending this inventory; the structure of this document does not change as Open Lance grows.

# Purpose

This document owns the existence and identity of business processes. It is the single place where the presence of a process is recorded. No other document may add a process to the inventory, and other documents may only reference the processes recorded here.

Its purpose is discovery and shared meaning: any human or AI contributor can find, in one place, which business processes Open Lance recognizes, and then follow a canonical reference to the document that owns each process's execution.

# Scope

This inventory lists every major business process that currently exists in Open Lance, grouped into logical process groups. Each process is represented exactly once and has exactly one canonical entry.

Each entry records identity only. It does not describe how a process runs. The execution of a process is owned by that process's own document under knowledge/processes/, and the concepts a process depends on are owned by the ontology documents in the Product namespace.

# Processes and Workflows

A process and a workflow are a matched pair, and neither owns the other.

- A workflow records that a repeatable sequence of business activity exists. Workflows are owned by knowledge/product/workflows.md.
- A process records how that business activity executes. Its existence and identity are owned here; its execution is owned by its own document under knowledge/processes/.

Because each process carries out one workflow, a process and its workflow share the same name by design. This correspondence is intentional and is defined in knowledge/processes/README.md. It is not a duplication and must not be treated as one. The workflow answers that the sequence exists; the process answers how it executes.

# Every Process Entry

Every process in this inventory uses the same thin structure. The structure records identity only.

- Name. The canonical name of the process.
- Description. A single statement of what the process is at the level of identity.
- Applies To. The roles or context the process applies to, referenced to their owners.
- Out of Scope. What this entry does not record, deferred to its owner.
- Related Knowledge. Canonical repository paths to the workflow the process carries out and to the document that owns the process's execution.

An entry contains no behavior, no sequencing, no steps, no rules, no permissions, no states, no implementation, and no technical detail. It records identity only.

# Definitions

These definitions are repository-wide and timeless. Each defers ownership where the concept is owned elsewhere.

- Process. The concept of a process is defined in knowledge/processes/README.md. This inventory owns only the existence and identity of each process, not the definition of the term and not any process's execution.
- Process Group. A named grouping of related processes used to organize this inventory. A process group is an organizational convenience only. It carries no behavior, confers no shared identity, and grants no authority. This inventory owns the process groups it uses here.
- Process Step. Defined in knowledge/processes/README.md. Not owned or redefined here.
- Trigger. Defined in knowledge/processes/README.md. Not owned or redefined here.
- Input. Defined in knowledge/processes/README.md. Not owned or redefined here.
- Output. Defined in knowledge/processes/README.md. Not owned or redefined here.
- Exception. Defined in knowledge/processes/README.md. Not owned or redefined here.
- Escalation. Defined in knowledge/processes/README.md. Not owned or redefined here.

# Architectural Identity

This inventory reinforces, and does not replace, the process identity defined in knowledge/processes/README.md.

A process represents only how a business activity executes. It never represents any of the following, each of which is owned elsewhere.

- Workflow. Owned by knowledge/product/workflows.md.
- Feature. Owned by knowledge/product/features.md.
- Entity. Owned by knowledge/product/entities.md.
- Relationship. Owned by knowledge/product/relationships.md.
- Role. Owned by knowledge/product/roles.md.
- State. Owned by knowledge/product/states.md.
- Permission. Owned by knowledge/product/permissions.md.
- Business Rule. Owned by knowledge/product/business-rules.md.
- Policy. Owned by the policy documents in their owning folders.
- Configuration, technical process, automation, background job, queue, API, database, interface, and implementation. These live in the codebase, not in the knowledge repository.

A process identity remains unchanged even if workflows change, permissions change, business rules change, states change, technology changes, automation changes, interfaces change, databases change, or payment providers change. The identity of a process is independent of how it is implemented and of who or what executes it.

# Ownership

- Each process has exactly one canonical entry, which lives in this document.
- No other document may add a process to the inventory or redefine a process's existence or identity.
- Other documents reference the processes recorded here and never restate them.
- The execution of a process is owned by that process's own document under knowledge/processes/, not by this inventory.
- Business rules are owned by knowledge/product/business-rules.md.
- Workflows are owned by knowledge/product/workflows.md.
- Permissions are owned by knowledge/product/permissions.md.
- States are owned by knowledge/product/states.md.
- Entities are owned by knowledge/product/entities.md.
- Implementation belongs outside this inventory, in the codebase.

# Reuse

Existing processes are reused. A duplicate process is never created. When a contributor needs a process that already exists, they reference the existing identity recorded here rather than creating a new one. Before adding a process, a contributor confirms that no existing entry already records it, following the contribution process in knowledge/CONTRIBUTING.md.

# Repository Growth

New processes are added by extending this inventory. Each new process is a new entry under the appropriate process group, using the same thin structure, and it carries out exactly one workflow recorded in knowledge/product/workflows.md. The structure of this document does not change as the number of processes grows, existing process identities never change, and growth is always additive. The namespace supports an unlimited number of processes.

# Process Inventory

Each process below states what it is, who it applies to, its scope as an inventory entry, and the documents that own the workflow it carries out and its own execution. No entry defines behavior, sequencing, steps, rules, permissions, states, or implementation.

## Hiring Processes

**Job Posting**
- Name. Job Posting.
- Description. The end-to-end execution by which a business makes work available in the marketplace.
- Applies To. Participants in the Business role, owned by knowledge/product/roles.md.
- Out of Scope. Process behavior, steps, sequencing, business rules, permissions, states, and implementation.
- Related Knowledge. Workflow carried out: knowledge/product/workflows.md. Execution owner: knowledge/processes/job-posting.md.

**Proposal Submission**
- Name. Proposal Submission.
- Description. The end-to-end execution by which a freelancer offers to perform available work.
- Applies To. Participants in the Freelancer role, owned by knowledge/product/roles.md.
- Out of Scope. Process behavior, steps, sequencing, business rules, permissions, states, and implementation.
- Related Knowledge. Workflow carried out: knowledge/product/workflows.md. Execution owner: knowledge/processes/proposal-submission.md.

**Engagement Formation**
- Name. Engagement Formation.
- Description. The end-to-end execution by which a business and a freelancer reach an agreed engagement.
- Applies To. Participants in the Business role and participants in the Freelancer role, owned by knowledge/product/roles.md.
- Out of Scope. Process behavior, steps, sequencing, business rules, permissions, states, and implementation.
- Related Knowledge. Workflow carried out: knowledge/product/workflows.md. Execution owner: knowledge/processes/engagement-formation.md.

**Drop-In Purchase**
- Name. Drop-In Purchase.
- Description. The end-to-end execution by which a business obtains a productized service.
- Applies To. Participants in the Business role, owned by knowledge/product/roles.md.
- Out of Scope. Process behavior, steps, sequencing, business rules, permissions, states, and implementation.
- Related Knowledge. Workflow carried out: knowledge/product/workflows.md. Execution owner: knowledge/processes/drop-in-purchase.md.

## Engagement Processes

**Contract Execution**
- Name. Contract Execution.
- Description. The end-to-end execution by which an agreed engagement is carried out to completion.
- Applies To. Participants in the Business role and participants in the Freelancer role, owned by knowledge/product/roles.md.
- Out of Scope. Process behavior, steps, sequencing, business rules, permissions, states, and implementation.
- Related Knowledge. Workflow carried out: knowledge/product/workflows.md. Execution owner: knowledge/processes/contract-execution.md.

## Financial Processes

**Escrow Funding**
- Name. Escrow Funding.
- Description. The end-to-end execution by which a business places funds into escrow for work.
- Applies To. Participants in the Business role, owned by knowledge/product/roles.md.
- Out of Scope. Process behavior, steps, sequencing, business rules, permissions, states, and implementation.
- Related Knowledge. Workflow carried out: knowledge/product/workflows.md. Execution owner: knowledge/processes/escrow-funding.md.

**Escrow Release**
- Name. Escrow Release.
- Description. The end-to-end execution by which funds held in escrow are released to a freelancer.
- Applies To. Participants in the Business role and participants in the Freelancer role, owned by knowledge/product/roles.md.
- Out of Scope. Process behavior, steps, sequencing, business rules, permissions, states, and implementation.
- Related Knowledge. Workflow carried out: knowledge/product/workflows.md. Execution owner: knowledge/processes/escrow-release.md.

**Withdrawal**
- Name. Withdrawal.
- Description. The end-to-end execution by which a freelancer moves earnings out of the platform.
- Applies To. Participants in the Freelancer role, owned by knowledge/product/roles.md.
- Out of Scope. Process behavior, steps, sequencing, business rules, permissions, states, and implementation.
- Related Knowledge. Workflow carried out: knowledge/product/workflows.md. Execution owner: knowledge/processes/withdrawal.md.

**Subscription Management**
- Name. Subscription Management.
- Description. The end-to-end execution by which a participant establishes or renews a membership.
- Applies To. Participants, owned by knowledge/product/roles.md.
- Out of Scope. Process behavior, steps, sequencing, business rules, permissions, states, and implementation.
- Related Knowledge. Workflow carried out: knowledge/product/workflows.md. Execution owner: knowledge/processes/subscription-management.md.

## Trust and Safety Processes

**Verification**
- Name. Verification.
- Description. The end-to-end execution by which a participant's identity or credentials are confirmed.
- Applies To. Participants, owned by knowledge/product/roles.md.
- Out of Scope. Process behavior, steps, sequencing, business rules, permissions, states, and implementation.
- Related Knowledge. Workflow carried out: knowledge/product/workflows.md. Execution owner: knowledge/processes/verification.md.

**Review Submission**
- Name. Review Submission.
- Description. The end-to-end execution by which a participant records feedback for completed work.
- Applies To. Participants in the Business role and participants in the Freelancer role, owned by knowledge/product/roles.md.
- Out of Scope. Process behavior, steps, sequencing, business rules, permissions, states, and implementation.
- Related Knowledge. Workflow carried out: knowledge/product/workflows.md. Execution owner: knowledge/processes/review-submission.md.

**Dispute Resolution**
- Name. Dispute Resolution.
- Description. The end-to-end execution by which a disagreement over work or payment is brought to a resolution.
- Applies To. Participants in the Business role, participants in the Freelancer role, and participants in the Administrator role, owned by knowledge/product/roles.md.
- Out of Scope. Process behavior, steps, sequencing, business rules, permissions, states, and implementation.
- Related Knowledge. Workflow carried out: knowledge/product/workflows.md. Execution owner: knowledge/processes/dispute-resolution.md.

## Identity Processes

**Onboarding**
- Name. Onboarding.
- Description. The end-to-end execution by which a new participant joins and becomes ready to take part.
- Applies To. New participants, owned by knowledge/product/roles.md.
- Out of Scope. Process behavior, steps, sequencing, business rules, permissions, states, and implementation.
- Related Knowledge. Workflow carried out: knowledge/product/workflows.md. Execution owner: knowledge/processes/onboarding.md.

## Administration Processes

**Moderation Review**
- Name. Moderation Review.
- Description. The end-to-end execution by which the platform reviews a flagged matter.
- Applies To. Participants in the Administrator role, owned by knowledge/product/roles.md.
- Out of Scope. Process behavior, steps, sequencing, business rules, permissions, states, and implementation.
- Related Knowledge. Workflow carried out: knowledge/product/workflows.md. Execution owner: knowledge/processes/moderation-review.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/processes/README.md
- knowledge/product/workflows.md
- knowledge/product/roles.md
- knowledge/product/states.md
- knowledge/product/permissions.md
- knowledge/product/business-rules.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now and describe no defect.

- Owning process documents. Each entry references a process document under knowledge/processes/ that owns its execution. Those documents are created over time, following knowledge/processes/README.md and knowledge/CONTRIBUTING.md. Until each exists, the reference to it is an intentional forward reference.
- Process to workflow correspondence. This inventory holds one process per workflow recorded in knowledge/product/workflows.md, matching the forward references made by that document. If Open Lance ever recognizes that a single workflow is carried out by more than one distinct process, the additional processes are added here as new entries, each carrying out the same workflow, without changing this document's structure.
- Operational procedures without a workflow. Some operational activities, for example account recovery, account closure, and notification delivery, are not currently recorded as workflows in knowledge/product/workflows.md and therefore have no process entry here. If any becomes a recognized business workflow, it is first added to knowledge/product/workflows.md, and a matching process is then added here. No process is added without a workflow to carry out.
- Process granularity. The granularity of this inventory follows the workflow inventory. If finer-grained business activities such as milestone delivery, deliverable review, or payment release are ever recognized as workflows in their own right, matching processes are added here at that time.
