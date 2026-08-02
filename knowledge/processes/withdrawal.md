---
id: OL-KNOW-PROCESSES-WITHDRAWAL
document: knowledge/processes/withdrawal.md

title: Open Lance Withdrawal Process

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
  - Freelancer Growth Specialist
  - Any AI Agent that executes the Withdrawal process
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/processes/README.md, knowledge/processes/processes.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  How the Withdrawal process executes: how a freelancer moves available
  funds from a Wallet out of the platform to an external destination. It
  owns execution only and references entities, permissions, states,
  business rules, and its workflow by canonical path.
---

# Open Lance Withdrawal Process

This document owns the execution of the Withdrawal process. It records how a business activity runs from beginning to end, and nothing more.

It does not own the existence of the Withdrawal workflow, the identity of the Withdrawal process, or any entity, permission, state, business rule, feature, relationship, or policy. Those are owned by the documents named in each section and are referenced here by canonical repository path, never redefined. This document follows the Process Structure Standard defined in knowledge/processes/README.md and the repository constitution in knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

This document executes the canonical process Withdrawal, whose identity is owned by knowledge/processes/processes.md, and it carries out the Withdrawal workflow, whose existence is owned by knowledge/product/workflows.md. It redefines neither.

# Purpose

The Withdrawal process lets a freelancer move available funds from a Wallet (knowledge/product/entities.md) out of the platform to an external destination. Its outcome is funds moved out of the Wallet and a completed Payment (knowledge/product/entities.md). This process describes how that outcome is reached. It carries out the Withdrawal workflow (knowledge/product/workflows.md) and owns none of the concepts it references.

# Trigger

The process starts when a participant acting in the Freelancer role (knowledge/product/roles.md), holding available funds in a Wallet, chooses to withdraw and begins a withdrawal. The trigger is a business decision by an authorized participant; the interface by which it is registered lives in the codebase and is out of scope here.

# Participants

- A participant (knowledge/product/entities.md) acting in the Freelancer role (knowledge/product/roles.md). This participant requests and receives the withdrawal.
- A participant (knowledge/product/entities.md) acting in the Administrator role (knowledge/product/roles.md), only where a payout destination or a withdrawal requires review.

# Inputs

- The Wallet (knowledge/product/entities.md) and its available balance.
- The amount to withdraw. The amount and any commercial values are owned elsewhere and are not defined here.
- The external payout destination. The details of the destination are owned elsewhere and are not defined here.

# Outputs

- Funds moved out of the Wallet (knowledge/product/entities.md), with the external destination credited.
- A Payment (knowledge/product/entities.md) that moves from Pending to Paid, and a Transaction (knowledge/product/entities.md) recorded.
- A Notification (knowledge/product/entities.md) may be produced to inform the freelancer of the outcome. How the notification is delivered is out of scope for this process; the Notification entity is owned by knowledge/product/entities.md.

# Preconditions

- The participant holds the Withdraw Funds and View Wallet permissions (knowledge/product/permissions.md).
- The participant is in good standing: in the Active state and not in the Suspended or Banned state (knowledge/product/states.md).
- The Wallet holds an available balance sufficient for the requested amount.
- Whether funds may be withdrawn is governed by the Withdrawal Constraint business rule, and what verification is required by the Verification Requirement business rule (knowledge/product/business-rules.md), which are referenced, not decided, here.

# Business Rules Referenced

- Withdrawal Constraint (knowledge/product/business-rules.md). Governs when funds may be withdrawn.
- Verification Requirement (knowledge/product/business-rules.md). Governs what verification is required.
- Fee Calculation (knowledge/product/business-rules.md). Governs how a fee is derived.

The logic, conditions, thresholds, and values of these rules are owned by knowledge/product/business-rules.md and the codebase. This process references them and never states their content.

# Permissions Referenced

- Withdraw Funds (knowledge/product/permissions.md). Authorizes withdrawing funds.
- View Wallet (knowledge/product/permissions.md). Authorizes viewing the wallet balance.

Who holds these permissions and how authorization is evaluated are owned by knowledge/product/permissions.md and the codebase.

# States Referenced

- Pending (knowledge/product/states.md). The condition of the withdrawal Payment while it awaits completion.
- Paid (knowledge/product/states.md). The condition of the withdrawal Payment once it has completed.
- Verified (knowledge/product/states.md). The participant condition that a verification requirement may call for.
- Active, Suspended, Banned (knowledge/product/states.md). Referenced as the participant standing evaluated in the preconditions.

This process references these states and never defines them, their transitions, or the order in which they are entered.

# Entities Involved

- Wallet (knowledge/product/entities.md). The place the funds are moved out of.
- Payment (knowledge/product/entities.md). The value paid out to the external destination.
- Transaction (knowledge/product/entities.md). The record of the financial event.
- Participant (knowledge/product/entities.md). The freelancer withdrawing funds.
- Notification (knowledge/product/entities.md). The signal that may inform the freelancer of the outcome.

This process acts upon these entities and never redefines them.

# Workflow Mapping

This process carries out exactly one workflow: Withdrawal, whose existence is owned by knowledge/product/workflows.md. The workflow records that the sequence exists; this document records how it executes. Neither owns the other.

# Main Flow

1. A participant in the Freelancer role, holding the View Wallet permission, views the available balance in the Wallet.
2. The participant requests a withdrawal of an amount, authorized by the Withdraw Funds permission, under the Withdrawal Constraint business rule.
3. The verification required for withdrawal is confirmed under the Verification Requirement business rule.
4. Any fee is derived under the Fee Calculation business rule.
5. A Payment for the withdrawal is created in the Pending state, and the funds leave the Wallet.
6. The external destination is credited and the Payment reaches the Paid state.
7. The participant is informed that the withdrawal is complete.

# Alternate Flows

- Partial or full withdrawal. The participant withdraws part of the available balance or the full balance.
- Alternate destination. The participant withdraws to a different payout destination among those available.

# Exception Flows

- Withdrawal not permitted. Where the Withdrawal Constraint business rule is not satisfied, the withdrawal does not proceed.
- Verification not met. Where the Verification Requirement business rule is not satisfied, the withdrawal is blocked until the participant is Verified.
- Insufficient available balance. Where the Wallet does not hold enough available funds, the requested amount cannot be withdrawn.
- Authorization lost during withdrawal. Where the participant ceases to be authorized, for example by entering the Suspended or Banned state, the withdrawal cannot complete.
- Escalation. Where a matter arising during withdrawal requires a higher authority, it is escalated to the Moderation Review process (knowledge/processes/moderation-review.md), which is handled by a participant in the Administrator role. Where an escalation is routed beyond that is owned by the Moderation Review process, not here.

# Completion Conditions

The process is complete when either of the following holds.

- The funds have moved out of the Wallet, the external destination is credited, and the Payment has reached the Paid state (knowledge/product/states.md). This is successful completion.
- The withdrawal does not complete, because a constraint or verification requirement is not satisfied, the balance is insufficient, or the participant abandons it. This is completion without a withdrawal.

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
- knowledge/processes/verification.md
- knowledge/processes/moderation-review.md

# Identity Independence

This process remains the same process regardless of how it is carried out. Its identity does not change if the user interface changes, if the implementation changes, if the application programming interfaces change, if automation changes, if the underlying technology changes, if the databases change, or if the payment providers change. The Withdrawal process is defined at the level of business execution, and it stays the same process whether it is executed by a human, by an AI agent, or by both. Changes to how the process is executed never change what the process is.

# Repository Growth

- This process has exactly one canonical document, which is this document. No other document owns the execution of the Withdrawal process.
- Other documents reference this process; they do not restate its execution.
- Future refinements to how the Withdrawal process executes are made in this document only.
- A change to how the process executes never changes the identity of the process, which is owned by knowledge/processes/processes.md, or the existence of its workflow, which is owned by knowledge/product/workflows.md.
- Changes to this document require approval and follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
