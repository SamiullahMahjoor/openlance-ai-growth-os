---
id: OL-KNOW-PROCESSES-ESCROW-RELEASE
document: knowledge/processes/escrow-release.md

title: Open Lance Escrow Release Process

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
  - Any AI Agent that executes the Escrow Release process
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/processes/README.md, knowledge/processes/processes.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  How the Escrow Release process executes: how funds held in escrow for
  approved work are released to a freelancer, moving the Escrow to Released.
  It owns execution only and references entities, permissions, states,
  business rules, and its workflow by canonical path.
---

# Open Lance Escrow Release Process

This document owns the execution of the Escrow Release process. It records how a business activity runs from beginning to end, and nothing more.

It does not own the existence of the Escrow Release workflow, the identity of the Escrow Release process, or any entity, permission, state, business rule, feature, relationship, or policy. Those are owned by the documents named in each section and are referenced here by canonical repository path, never redefined. This document follows the Process Structure Standard defined in knowledge/processes/README.md and the repository constitution in knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

This document executes the canonical process Escrow Release, whose identity is owned by knowledge/processes/processes.md, and it carries out the Escrow Release workflow, whose existence is owned by knowledge/product/workflows.md. It redefines neither.

# Purpose

The Escrow Release process lets funds held in escrow for approved work be released to the freelancer. Its outcome is an Escrow (knowledge/product/entities.md) in the Released state (knowledge/product/states.md), with the freelancer's Wallet (knowledge/product/entities.md) credited. This process describes how that outcome is reached. It carries out the Escrow Release workflow (knowledge/product/workflows.md) and owns none of the concepts it references.

# Trigger

The process starts when a milestone's work is approved, or another release condition is met, and release of the held escrow begins. The trigger is the readiness of a release condition; the interface by which it is registered lives in the codebase and is out of scope here.

# Participants

- A participant (knowledge/product/entities.md) acting in the Business role (knowledge/product/roles.md). This participant may release escrow on approval of the work.
- A participant (knowledge/product/entities.md) acting in the Freelancer role (knowledge/product/roles.md). This participant is the recipient of the released funds.
- A participant (knowledge/product/entities.md) acting in the Administrator role (knowledge/product/roles.md), only where a release is directed by a resolved dispute.

# Inputs

- The Escrow (knowledge/product/entities.md) in the Held state.
- The approved Milestone (knowledge/product/entities.md) or another met release condition.
- The freelancer's Wallet (knowledge/product/entities.md) that receives the funds.

# Outputs

- An Escrow (knowledge/product/entities.md) in the Released state (knowledge/product/states.md).
- The freelancer's Wallet (knowledge/product/entities.md) credited with the net amount, and a Payment (knowledge/product/entities.md) and Transaction (knowledge/product/entities.md) recorded.
- A Milestone (knowledge/product/entities.md) that reaches the Completed state.
- A Notification (knowledge/product/entities.md) may be produced to inform the parties. How the notification is delivered is out of scope for this process; the Notification entity is owned by knowledge/product/entities.md.

# Preconditions

- The Escrow is in the Held state and the associated Milestone is in the Approved state, or another release condition is otherwise met (knowledge/product/states.md).
- The releasing participant holds the Release Escrow permission (knowledge/product/permissions.md).
- Whether escrow may be released is governed by the Escrow Release Constraint business rule (knowledge/product/business-rules.md), which is referenced, not decided, here.

# Business Rules Referenced

- Escrow Release Constraint (knowledge/product/business-rules.md). Governs when escrow may be released.
- Milestone Approval Constraint (knowledge/product/business-rules.md). Governs when a milestone may be approved, which precedes release on approval.
- Fee Calculation (knowledge/product/business-rules.md). Governs how a platform fee is derived.

The logic, conditions, thresholds, and values of these rules are owned by knowledge/product/business-rules.md and the codebase. This process references them and never states their content.

# Permissions Referenced

- Release Escrow (knowledge/product/permissions.md). Authorizes releasing funds from escrow.

Who holds this permission and how authorization is evaluated are owned by knowledge/product/permissions.md and the codebase.

# States Referenced

- Held (knowledge/product/states.md). The condition of the Escrow before release, referenced as a precondition.
- Released (knowledge/product/states.md). The condition of the Escrow once funds are paid out. This is the state the process brings the escrow into.
- Approved (knowledge/product/states.md). The condition of the Milestone that permits release on approval.
- Completed (knowledge/product/states.md). The condition of the Milestone once its work is finished as agreed.
- Paid (knowledge/product/states.md). The condition of the Payment once it has completed.
- Suspended, Banned (knowledge/product/states.md). Referenced as the participant standing that governs taking part.

This process references these states and never defines them, their transitions, or the order in which they are entered.

# Entities Involved

- Escrow (knowledge/product/entities.md). The funds being released.
- Milestone (knowledge/product/entities.md). The portion of work whose approval permits release.
- Contract (knowledge/product/entities.md). The engagement the release concerns.
- Payment (knowledge/product/entities.md). The value paid out to the freelancer.
- Transaction (knowledge/product/entities.md). The record of the financial event.
- Wallet (knowledge/product/entities.md). The freelancer's place of funds that is credited.
- Participant (knowledge/product/entities.md). The business, the freelancer, and, on a directed release, the administrator.
- Notification (knowledge/product/entities.md). The signal that may inform the parties.

This process acts upon these entities and never redefines them.

# Workflow Mapping

This process carries out exactly one workflow: Escrow Release, whose existence is owned by knowledge/product/workflows.md. The workflow records that the sequence exists; this document records how it executes. Neither owns the other.

# Main Flow

1. A Milestone reaches the Approved state through the Contract Execution process.
2. Release of the held escrow is initiated under the Escrow Release Constraint business rule, authorized by the Release Escrow permission.
3. The platform fee is derived under the Fee Calculation business rule.
4. The Escrow moves from the Held state to the Released state.
5. The freelancer's Wallet is credited with the net amount, and the Payment reaches the Paid state.
6. The Milestone reaches the Completed state.
7. The parties are informed that the funds are released.

# Alternate Flows

- Release after an approval window. Release proceeds automatically once an approval window governed by the Escrow Release Constraint business rule has passed.
- Directed release. Release is directed by the outcome of the Dispute Resolution process (knowledge/processes/dispute-resolution.md), with an administrator authorizing it.
- Partial release. A portion of the held escrow is released, with the remainder kept Held for further work or resolution.

# Exception Flows

- Release condition not met. Where the Escrow Release Constraint business rule is not satisfied, the escrow is not released and remains Held.
- Dispute raised. Where a dispute is raised over the work or payment, release is withheld and the matter is handled by the Dispute Resolution process.
- Authorization lost during release. Where the releasing participant ceases to be authorized, for example by entering the Suspended or Banned state, release cannot complete.
- Escalation. Where a matter arising during release requires a higher authority, it is escalated to the Dispute Resolution process or the Moderation Review process (knowledge/processes/moderation-review.md), each handled by a participant in the Administrator role. Where an escalation is routed beyond that is owned by those processes, not here.

# Completion Conditions

The process is complete when either of the following holds.

- The Escrow has entered the Released state (knowledge/product/states.md) and the freelancer's Wallet is credited. This is successful completion.
- Release does not occur, because the release condition is not met or the escrow is withheld pending a dispute. This is completion without a release.

The conditions that govern release are owned by knowledge/product/business-rules.md and the Dispute Resolution process, and are referenced here, not decided here.

# Related Knowledge

- knowledge/processes/README.md
- knowledge/processes/processes.md
- knowledge/product/workflows.md
- knowledge/product/entities.md
- knowledge/product/roles.md
- knowledge/product/permissions.md
- knowledge/product/states.md
- knowledge/product/business-rules.md
- knowledge/processes/contract-execution.md
- knowledge/processes/escrow-funding.md
- knowledge/processes/dispute-resolution.md
- knowledge/processes/withdrawal.md
- knowledge/processes/moderation-review.md

# Identity Independence

This process remains the same process regardless of how it is carried out. Its identity does not change if the user interface changes, if the implementation changes, if the application programming interfaces change, if automation changes, if the underlying technology changes, if the databases change, or if the payment providers change. The Escrow Release process is defined at the level of business execution, and it stays the same process whether it is executed by a human, by an AI agent, or by both. Changes to how the process is executed never change what the process is.

# Repository Growth

- This process has exactly one canonical document, which is this document. No other document owns the execution of the Escrow Release process.
- Other documents reference this process; they do not restate its execution.
- Future refinements to how the Escrow Release process executes are made in this document only.
- A change to how the process executes never changes the identity of the process, which is owned by knowledge/processes/processes.md, or the existence of its workflow, which is owned by knowledge/product/workflows.md.
- Changes to this document require approval and follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
