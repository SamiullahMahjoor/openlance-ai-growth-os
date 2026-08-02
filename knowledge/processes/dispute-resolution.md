---
id: OL-KNOW-PROCESSES-DISPUTE-RESOLUTION
document: knowledge/processes/dispute-resolution.md

title: Open Lance Dispute Resolution Process

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
  - Any AI Agent that executes the Dispute Resolution process
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/processes/README.md, knowledge/processes/processes.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  How the Dispute Resolution process executes: how a disagreement over work
  or payment is brought to a resolution, moving a Dispute through In
  Mediation to Resolved. It owns execution only and references entities,
  permissions, states, business rules, and its workflow by canonical path.
---

# Open Lance Dispute Resolution Process

This document owns the execution of the Dispute Resolution process. It records how a business activity runs from beginning to end, and nothing more.

It does not own the existence of the Dispute Resolution workflow, the identity of the Dispute Resolution process, or any entity, permission, state, business rule, feature, relationship, or policy. Those are owned by the documents named in each section and are referenced here by canonical repository path, never redefined. This document follows the Process Structure Standard defined in knowledge/processes/README.md and the repository constitution in knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

This document executes the canonical process Dispute Resolution, whose identity is owned by knowledge/processes/processes.md, and it carries out the Dispute Resolution workflow, whose existence is owned by knowledge/product/workflows.md. It redefines neither.

# Purpose

The Dispute Resolution process brings a disagreement over work or payment to a resolution. Its outcome is a Dispute (knowledge/product/entities.md) that moves through the In Mediation state to the Resolved state (knowledge/product/states.md), with any escrow outcome directed. This process describes how that outcome is reached. It carries out the Dispute Resolution workflow (knowledge/product/workflows.md) and owns none of the concepts it references.

# Trigger

The process starts when a party raises a Dispute over work or payment. The trigger is a business decision by an eligible party; the interface by which it is registered lives in the codebase and is out of scope here.

# Participants

- A participant (knowledge/product/entities.md) acting in the Business role (knowledge/product/roles.md) and a participant acting in the Freelancer role (knowledge/product/roles.md). These are the parties to the dispute.
- A participant (knowledge/product/entities.md) acting in the Administrator role (knowledge/product/roles.md). This participant mediates and resolves the dispute.

# Inputs

- The Dispute (knowledge/product/entities.md) raised by a party.
- The Contract (knowledge/product/entities.md), Milestone (knowledge/product/entities.md), and Escrow (knowledge/product/entities.md) the dispute concerns.
- The positions and evidence of the parties.

# Outputs

- A Dispute (knowledge/product/entities.md) in the Resolved state (knowledge/product/states.md).
- A directed escrow outcome, with the Escrow (knowledge/product/entities.md) moving to the Released or Refunded state through the Escrow Release or Escrow Funding processes.
- A Notification (knowledge/product/entities.md) may be produced to inform the parties of the outcome. How the notification is delivered is out of scope for this process; the Notification entity is owned by knowledge/product/entities.md.

# Preconditions

- A dispute is eligible to be raised under the Dispute Eligibility business rule (knowledge/product/business-rules.md).
- The raising party holds the Raise Dispute permission and the mediating participant holds the Resolve Dispute permission (knowledge/product/permissions.md).
- The contested work or payment exists under a contract.

# Business Rules Referenced

- Dispute Eligibility (knowledge/product/business-rules.md). Governs whether a dispute may be raised.
- Dispute Resolution Decision (knowledge/product/business-rules.md). Governs how a dispute outcome is decided.
- Escrow Release Constraint (knowledge/product/business-rules.md). Governs when escrow may be released, which the directed outcome respects.

The logic, conditions, thresholds, and values of these rules are owned by knowledge/product/business-rules.md and the codebase. This process references them and never states their content.

# Permissions Referenced

- Raise Dispute (knowledge/product/permissions.md). Authorizes raising a dispute.
- Resolve Dispute (knowledge/product/permissions.md). Authorizes resolving a dispute.

Who holds these permissions and how authorization is evaluated are owned by knowledge/product/permissions.md and the codebase.

# States Referenced

- In Mediation (knowledge/product/states.md). The condition of the Dispute while it is being mediated.
- Resolved (knowledge/product/states.md). The condition of the Dispute once it reaches an outcome. This is the state the process brings the dispute into.
- Held (knowledge/product/states.md). The condition of the Escrow while it is kept during the dispute.
- Released (knowledge/product/states.md). The condition of the Escrow when funds are paid out by the outcome.
- Refunded (knowledge/product/states.md). The condition of the Escrow when funds are returned by the outcome.
- Suspended, Banned (knowledge/product/states.md). Referenced as the participant standing that governs taking part.

This process references these states and never defines them, their transitions, or the order in which they are entered.

# Entities Involved

- Dispute (knowledge/product/entities.md). The disagreement being resolved.
- Contract (knowledge/product/entities.md). The engagement the dispute concerns.
- Milestone (knowledge/product/entities.md). The portion of work in question.
- Escrow (knowledge/product/entities.md). The funds directed by the outcome.
- Participant (knowledge/product/entities.md). The parties and the administrator.
- Conversation (knowledge/product/entities.md). The thread in which positions are exchanged.
- Notification (knowledge/product/entities.md). The signal that may inform the parties.

This process acts upon these entities and never redefines them.

# Workflow Mapping

This process carries out exactly one workflow: Dispute Resolution, whose existence is owned by knowledge/product/workflows.md. The workflow records that the sequence exists; this document records how it executes. Neither owns the other.

# Main Flow

1. A party raises a Dispute over work or payment, authorized by the Raise Dispute permission, under the Dispute Eligibility business rule.
2. The contested escrow is kept in the Held state while the dispute proceeds.
3. The Dispute enters the In Mediation state.
4. A participant in the Administrator role gathers the positions and evidence of the parties.
5. The outcome is decided under the Dispute Resolution Decision business rule, authorized by the Resolve Dispute permission.
6. The escrow is directed accordingly, moving to the Released state for the freelancer or the Refunded state for the business, or split between them, through the Escrow Release or Escrow Funding processes and under the Escrow Release Constraint business rule.
7. The Dispute enters the Resolved state and the parties are informed.

# Alternate Flows

- Mutual settlement. The parties agree an outcome before mediation concludes, and the agreed outcome is directed.
- Split outcome. The outcome divides the escrow between the parties.
- Administrative decision. Where the parties do not agree, the administrator decides the outcome under the Dispute Resolution Decision business rule.

# Exception Flows

- Dispute not eligible. Where the Dispute Eligibility business rule is not satisfied, no dispute is raised.
- No agreement in mediation. Where the parties do not agree, the outcome is decided by the administrator under the Dispute Resolution Decision business rule.
- Standing prevents participation. Where a party is in the Suspended or Banned state, participation in the dispute is limited to the extent the process allows.
- Escalation. Where a matter arising during resolution requires a higher authority, it is escalated to the Moderation Review process (knowledge/processes/moderation-review.md), which is handled by a participant in the Administrator role. Where an escalation is routed beyond that is owned by the Moderation Review process, not here.

# Completion Conditions

The process is complete when either of the following holds.

- The Dispute has entered the Resolved state (knowledge/product/states.md) and any escrow outcome is directed. This is successful completion.
- The dispute is withdrawn or closed without a directed outcome. This is completion without a resolution.

The conditions that govern the outcome and the escrow direction are owned by knowledge/product/business-rules.md and the Escrow Release process, and are referenced here, not decided here.

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
- knowledge/processes/escrow-release.md
- knowledge/processes/escrow-funding.md
- knowledge/processes/moderation-review.md

# Identity Independence

This process remains the same process regardless of how it is carried out. Its identity does not change if the user interface changes, if the implementation changes, if the application programming interfaces change, if automation changes, if the underlying technology changes, if the databases change, or if the payment providers change. The Dispute Resolution process is defined at the level of business execution, and it stays the same process whether it is executed by a human, by an AI agent, or by both. Changes to how the process is executed never change what the process is.

# Repository Growth

- This process has exactly one canonical document, which is this document. No other document owns the execution of the Dispute Resolution process.
- Other documents reference this process; they do not restate its execution.
- Future refinements to how the Dispute Resolution process executes are made in this document only.
- A change to how the process executes never changes the identity of the process, which is owned by knowledge/processes/processes.md, or the existence of its workflow, which is owned by knowledge/product/workflows.md.
- Changes to this document require approval and follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
