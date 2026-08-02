---
id: OL-KNOW-PROCESSES-CONTRACT-EXECUTION
document: knowledge/processes/contract-execution.md

title: Open Lance Contract Execution Process

version: 1.0
status: Frozen

document_type: normative
authority: Process

owner: Product Manager
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - knowledge/processes/README.md
  - knowledge/processes/processes.md
  - knowledge/product/workflows.md
  - knowledge/product/entities.md
  - knowledge/product/roles.md
  - knowledge/product/permissions.md
  - knowledge/product/states.md
  - knowledge/product/business-rules.md

used_by:
  - Product Manager
  - Operations Manager
  - Customer Support Agent
  - Employer Acquisition Specialist
  - Freelancer Growth Specialist
  - Any AI Agent that executes the Contract Execution process
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/processes/README.md, knowledge/processes/processes.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  How the Contract Execution process executes: how an active engagement is
  carried out through milestone delivery and approval until the Contract is
  Completed. It owns execution only and references entities, permissions,
  states, business rules, and its workflow by canonical path.
---

# Open Lance Contract Execution Process

This document owns the execution of the Contract Execution process. It records how a business activity runs from beginning to end, and nothing more.

It does not own the existence of the Contract Execution workflow, the identity of the Contract Execution process, or any entity, permission, state, business rule, feature, relationship, or policy. Those are owned by the documents named in each section and are referenced here by canonical repository path, never redefined. This document follows the Process Structure Standard defined in knowledge/processes/README.md and the repository constitution in knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

This document executes the canonical process Contract Execution, whose identity is owned by knowledge/processes/processes.md, and it carries out the Contract Execution workflow, whose existence is owned by knowledge/product/workflows.md. It redefines neither.

# Purpose

The Contract Execution process carries out an agreed engagement to completion. Its outcome is a Contract (knowledge/product/entities.md) that reaches the Completed state (knowledge/product/states.md) through the delivery and approval of its Milestones. This process describes how that outcome is reached. It carries out the Contract Execution workflow (knowledge/product/workflows.md) and owns none of the concepts it references.

# Trigger

The process starts when a Contract is in the Active state (knowledge/product/states.md) with funded work, and the freelancer begins delivering. The trigger is the readiness of funded work under an active engagement; the interface by which delivery is registered lives in the codebase and is out of scope here.

# Participants

- A participant (knowledge/product/entities.md) acting in the Freelancer role (knowledge/product/roles.md). This participant produces and submits the work.
- A participant (knowledge/product/entities.md) acting in the Business role (knowledge/product/roles.md). This participant reviews and approves the work.

# Inputs

- The Contract (knowledge/product/entities.md) in the Active state.
- The Milestones (knowledge/product/entities.md) in the Funded state.
- The work to be produced for each milestone.

# Outputs

- Deliverables (knowledge/product/entities.md) that move from Submitted to Approved (knowledge/product/states.md).
- Milestones (knowledge/product/entities.md) that reach the Approved and Completed states.
- A Contract (knowledge/product/entities.md) that reaches the Completed state, with payment released through the Escrow Release process.
- A Notification (knowledge/product/entities.md) may be produced at each delivery and approval. How the notification is delivered is out of scope for this process; the Notification entity is owned by knowledge/product/entities.md.

# Preconditions

- The Contract is in the Active state and the Milestone being worked is in the Funded state (knowledge/product/states.md).
- The freelancer holds the Submit Work permission and the business holds the Approve Work permission (knowledge/product/permissions.md).
- Both parties are in good standing: in the Active state and not in the Suspended or Banned state (knowledge/product/states.md).

# Business Rules Referenced

- Document Validation (knowledge/product/business-rules.md). Governs whether a submitted deliverable is acceptable.
- Milestone Approval Constraint (knowledge/product/business-rules.md). Governs when a milestone may be approved.

The logic, conditions, thresholds, and values of these rules are owned by knowledge/product/business-rules.md and the codebase. This process references them and never states their content.

# Permissions Referenced

- Submit Work (knowledge/product/permissions.md). Authorizes submitting work for approval.
- Approve Work (knowledge/product/permissions.md). Authorizes approving submitted work.

Who holds these permissions and how authorization is evaluated are owned by knowledge/product/permissions.md and the codebase.

# States Referenced

- Active (knowledge/product/states.md). The condition of the Contract while it is carried out.
- Paused (knowledge/product/states.md). The condition of the Contract while temporarily halted.
- Funded (knowledge/product/states.md). The condition of a Milestone with money committed for its work.
- Submitted (knowledge/product/states.md). The condition of a Deliverable put forward for review.
- Approved (knowledge/product/states.md). The condition of a Deliverable and a Milestone once submitted work is accepted.
- Completed (knowledge/product/states.md). The condition of a Milestone and of the Contract once the work is finished as agreed.
- Suspended, Banned (knowledge/product/states.md). Referenced as the participant standing that governs taking part.

This process references these states and never defines them, their transitions, or the order in which they are entered.

# Entities Involved

- Contract (knowledge/product/entities.md). The engagement being carried out.
- Milestone (knowledge/product/entities.md). The portion of work delivered and approved.
- Deliverable (knowledge/product/entities.md). The produced unit of work submitted for review.
- Participant (knowledge/product/entities.md). The freelancer and the business.
- Conversation (knowledge/product/entities.md). The thread in which delivery and review are discussed.
- Notification (knowledge/product/entities.md). The signal that may accompany delivery and approval.

This process acts upon these entities and never redefines them.

# Workflow Mapping

This process carries out exactly one workflow: Contract Execution, whose existence is owned by knowledge/product/workflows.md. The workflow records that the sequence exists; this document records how it executes. Neither owns the other.

# Main Flow

1. For a Milestone in the Funded state, the freelancer produces the work and submits it as a Deliverable, authorized by the Submit Work permission.
2. The Deliverable enters the Submitted state.
3. The business reviews the submitted work under the Document Validation business rule.
4. The business approves the work, authorized by the Approve Work permission, under the Milestone Approval Constraint business rule.
5. The Deliverable and the Milestone enter the Approved state.
6. Payment for the approved milestone is released through the Escrow Release process (knowledge/processes/escrow-release.md), and the Milestone reaches the Completed state.
7. When every milestone is Completed, the Contract enters the Completed state and the parties are informed.

# Alternate Flows

- Revision request. The business requests changes to a submitted deliverable; the freelancer revises and submits it again for review.
- Scope expansion. The parties add further Milestones to the active contract, each delivered and approved through the same flow.
- Pause and resume. The Contract enters the Paused state while temporarily halted and returns to the Active state when work resumes.

# Exception Flows

- Deliverable not acceptable. Where a deliverable does not satisfy the Document Validation business rule, it is not approved; the business requests a revision.
- Milestone not approvable. Where the Milestone Approval Constraint business rule is not satisfied, the milestone is not approved.
- Disagreement over work or payment. Where a disagreement arises, it is handled by the Dispute Resolution process (knowledge/processes/dispute-resolution.md).
- Authorization lost during execution. Where a party ceases to be authorized, for example by entering the Suspended or Banned state, execution cannot continue.
- Escalation. Where a matter arising during execution requires a higher authority, it is escalated to the Dispute Resolution process or the Moderation Review process (knowledge/processes/moderation-review.md), each handled by a participant in the Administrator role. Where an escalation is routed beyond that is owned by those processes, not here.

# Completion Conditions

The process is complete when either of the following holds.

- The Contract has reached the Completed state (knowledge/product/states.md), with every milestone delivered, approved, and paid. This is successful completion.
- Execution ends without completion, because the Contract is cancelled or an outcome is directed by the Dispute Resolution process. This is completion without a finished contract.

The conditions that govern approval and release are owned by knowledge/product/business-rules.md and the Escrow Release process, and are referenced here, not decided here.

# Related Knowledge

- knowledge/processes/README.md
- knowledge/processes/processes.md
- knowledge/product/workflows.md
- knowledge/product/entities.md
- knowledge/product/roles.md
- knowledge/product/permissions.md
- knowledge/product/states.md
- knowledge/product/business-rules.md
- knowledge/processes/escrow-release.md
- knowledge/processes/dispute-resolution.md
- knowledge/processes/review-submission.md
- knowledge/processes/moderation-review.md

# Identity Independence

This process remains the same process regardless of how it is carried out. Its identity does not change if the user interface changes, if the implementation changes, if the application programming interfaces change, if automation changes, if the underlying technology changes, if the databases change, or if the payment providers change. The Contract Execution process is defined at the level of business execution, and it stays the same process whether it is executed by a human, by an AI agent, or by both. Changes to how the process is executed never change what the process is.

# Repository Growth

- This process has exactly one canonical document, which is this document. No other document owns the execution of the Contract Execution process.
- Other documents reference this process; they do not restate its execution.
- Future refinements to how the Contract Execution process executes are made in this document only.
- A change to how the process executes never changes the identity of the process, which is owned by knowledge/processes/processes.md, or the existence of its workflow, which is owned by knowledge/product/workflows.md.
- Changes to this document require approval and follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
