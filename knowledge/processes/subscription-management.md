---
id: OL-KNOW-PROCESSES-SUBSCRIPTION-MANAGEMENT
document: knowledge/processes/subscription-management.md

title: Open Lance Subscription Management Process

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
  - Any AI Agent that executes the Subscription Management process
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/processes/README.md, knowledge/processes/processes.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  How the Subscription Management process executes: how a participant
  establishes, renews, changes, or ends a membership, moving a Subscription
  through Active, Cancelled, or Expired. It owns execution only and
  references entities, permissions, states, business rules, and its workflow
  by canonical path.
---

# Open Lance Subscription Management Process

This document owns the execution of the Subscription Management process. It records how a business activity runs from beginning to end, and nothing more.

It does not own the existence of the Subscription Management workflow, the identity of the Subscription Management process, or any entity, permission, state, business rule, feature, relationship, or policy. Those are owned by the documents named in each section and are referenced here by canonical repository path, never redefined. This document follows the Process Structure Standard defined in knowledge/processes/README.md and the repository constitution in knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

This document executes the canonical process Subscription Management, whose identity is owned by knowledge/processes/processes.md, and it carries out the Subscription Management workflow, whose existence is owned by knowledge/product/workflows.md. It redefines neither.

# Purpose

The Subscription Management process lets a participant establish, renew, change, or end a membership. Its outcome is a Subscription (knowledge/product/entities.md) in the Active state on establishment or renewal, or in the Cancelled or Expired state when ended or lapsed (knowledge/product/states.md). This process describes how those outcomes are reached. It carries out the Subscription Management workflow (knowledge/product/workflows.md) and owns none of the concepts it references.

# Trigger

The process starts when a participant (knowledge/product/entities.md) chooses to start, change, renew, or end a membership. The trigger is a business decision by an authorized participant, or the arrival of a renewal point; the interface by which it is registered lives in the codebase and is out of scope here.

# Participants

- A participant (knowledge/product/entities.md), acting in any role (knowledge/product/roles.md), who holds or seeks a membership. This participant is the primary actor throughout the process.

# Inputs

- The membership the participant chooses to hold.
- The participant seeking or holding the membership.
- The source of funds, drawn from the participant's Wallet (knowledge/product/entities.md) and any remainder collected as a Payment (knowledge/product/entities.md).

# Outputs

- A Subscription (knowledge/product/entities.md) in the Active state on establishment or renewal, or in the Cancelled or Expired state when ended or lapsed (knowledge/product/states.md).
- A Payment (knowledge/product/entities.md) that moves from Pending to Paid, and a Transaction (knowledge/product/entities.md) recorded, where a charge applies.
- A Notification (knowledge/product/entities.md) may be produced to inform the participant of the outcome. How the notification is delivered is out of scope for this process; the Notification entity is owned by knowledge/product/entities.md.

# Preconditions

- The participant holds the Manage Subscription permission and, where a charge applies, the Make Payment permission (knowledge/product/permissions.md).
- The participant is in good standing: in the Active state and not in the Suspended or Banned state (knowledge/product/states.md).
- Whether the participant may hold a subscription is governed by the Subscription Eligibility business rule, and when a subscription renews or lapses by the Subscription Renewal Constraint business rule (knowledge/product/business-rules.md), which are referenced, not decided, here.

# Business Rules Referenced

- Subscription Eligibility (knowledge/product/business-rules.md). Governs whether a participant may hold a subscription.
- Subscription Renewal Constraint (knowledge/product/business-rules.md). Governs when a subscription renews or lapses.
- Payment Validation (knowledge/product/business-rules.md). Governs whether a payment is acceptable to process.
- Fee Calculation (knowledge/product/business-rules.md). Governs how a charge is derived.

The logic, conditions, thresholds, and values of these rules are owned by knowledge/product/business-rules.md and the codebase. This process references them and never states their content.

# Permissions Referenced

- Manage Subscription (knowledge/product/permissions.md). Authorizes managing a subscription.
- Make Payment (knowledge/product/permissions.md). Authorizes making the payment for a membership charge.

Who holds these permissions and how authorization is evaluated are owned by knowledge/product/permissions.md and the codebase.

# States Referenced

- Active (knowledge/product/states.md). The condition of the Subscription while the membership is in effect. This is the state the process brings the subscription into on establishment or renewal.
- Cancelled (knowledge/product/states.md). The condition of the Subscription when the membership is ended before natural completion.
- Expired (knowledge/product/states.md). The condition of the Subscription when the membership ends by the passage of time.
- Pending (knowledge/product/states.md). The condition of a Payment while it awaits completion.
- Paid (knowledge/product/states.md). The condition of a Payment once it has completed.
- Suspended, Banned (knowledge/product/states.md). Referenced as the participant standing that governs taking part.

This process references these states and never defines them, their transitions, or the order in which they are entered.

# Entities Involved

- Subscription (knowledge/product/entities.md). The membership being established, renewed, changed, or ended.
- Payment (knowledge/product/entities.md). The value transferred for a membership charge.
- Transaction (knowledge/product/entities.md). The record of the financial event.
- Wallet (knowledge/product/entities.md). The place the participant's available funds are drawn from.
- Participant (knowledge/product/entities.md). The holder of the membership.
- Notification (knowledge/product/entities.md). The signal that may inform the participant of the outcome.

This process acts upon these entities and never redefines them.

# Workflow Mapping

This process carries out exactly one workflow: Subscription Management, whose existence is owned by knowledge/product/workflows.md. The workflow records that the sequence exists; this document records how it executes. Neither owns the other.

# Main Flow

1. A participant, holding the Manage Subscription permission and in good standing, selects a membership under the Subscription Eligibility business rule.
2. Where a charge applies, payment is taken, authorized by the Make Payment permission, drawing first on the participant's Wallet and collecting any remainder as a Payment, under the Payment Validation and Fee Calculation business rules.
3. The Payment moves from Pending to Paid.
4. The Subscription enters the Active state and the membership takes effect.
5. At each renewal point, the membership renews under the Subscription Renewal Constraint business rule.
6. The participant is informed of the outcome.

# Alternate Flows

- Change of membership. The participant upgrades or downgrades the membership, with the change taking effect under the Subscription Renewal Constraint business rule.
- Cancellation. The participant ends the membership, moving the Subscription to the Cancelled state at the end of the current period.
- Lapse. The membership is not renewed and moves to the Expired state under the Subscription Renewal Constraint business rule.
- Wallet-first renewal. A renewal charge is drawn first from the participant's Wallet, with any remainder collected as a Payment.

# Exception Flows

- Payment not acceptable. Where a charge does not satisfy the Payment Validation business rule, the subscription does not become Active and a renewal does not take effect.
- Not eligible. Where the Subscription Eligibility business rule is not satisfied, the participant may not hold the membership.
- Authorization lost during management. Where the participant ceases to be authorized, for example by entering the Suspended or Banned state, the change cannot complete.
- Escalation. Where a matter arising during management requires a higher authority, it is escalated to the Moderation Review process (knowledge/processes/moderation-review.md), which is handled by a participant in the Administrator role. Where an escalation is routed beyond that is owned by the Moderation Review process, not here.

# Completion Conditions

The process is complete when any of the following holds.

- A Subscription has entered the Active state (knowledge/product/states.md) on establishment or renewal. This is successful completion of an establishment or renewal.
- A Subscription has entered the Cancelled or Expired state (knowledge/product/states.md) on ending or lapse. This is successful completion of an ending.
- The change does not take effect, because a payment is not acceptable, eligibility is not satisfied, or the participant abandons it. This is completion without a change.

# Related Knowledge

- knowledge/processes/README.md
- knowledge/processes/processes.md
- knowledge/product/workflows.md
- knowledge/product/entities.md
- knowledge/product/roles.md
- knowledge/product/permissions.md
- knowledge/product/states.md
- knowledge/product/business-rules.md
- knowledge/processes/moderation-review.md

# Identity Independence

This process remains the same process regardless of how it is carried out. Its identity does not change if the user interface changes, if the implementation changes, if the application programming interfaces change, if automation changes, if the underlying technology changes, if the databases change, or if the payment providers change. The Subscription Management process is defined at the level of business execution, and it stays the same process whether it is executed by a human, by an AI agent, or by both. Changes to how the process is executed never change what the process is.

# Repository Growth

- This process has exactly one canonical document, which is this document. No other document owns the execution of the Subscription Management process.
- Other documents reference this process; they do not restate its execution.
- Future refinements to how the Subscription Management process executes are made in this document only.
- A change to how the process executes never changes the identity of the process, which is owned by knowledge/processes/processes.md, or the existence of its workflow, which is owned by knowledge/product/workflows.md.
- Changes to this document require approval and follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
