---
id: OL-KNOW-PROCESSES-ESCROW-FUNDING
document: knowledge/processes/escrow-funding.md

title: Open Lance Escrow Funding Process

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
  - Any AI Agent that executes the Escrow Funding process
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/processes/README.md, knowledge/processes/processes.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  How the Escrow Funding process executes: how a business places funds into
  escrow for work, moving the Escrow to Held and the Milestone to Funded. It
  owns execution only and references entities, permissions, states, business
  rules, and its workflow by canonical path.
---

# Open Lance Escrow Funding Process

This document owns the execution of the Escrow Funding process. It records how a business activity runs from beginning to end, and nothing more.

It does not own the existence of the Escrow Funding workflow, the identity of the Escrow Funding process, or any entity, permission, state, business rule, feature, relationship, or policy. Those are owned by the documents named in each section and are referenced here by canonical repository path, never redefined. This document follows the Process Structure Standard defined in knowledge/processes/README.md and the repository constitution in knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

This document executes the canonical process Escrow Funding, whose identity is owned by knowledge/processes/processes.md, and it carries out the Escrow Funding workflow, whose existence is owned by knowledge/product/workflows.md. It redefines neither.

# Purpose

The Escrow Funding process lets a business place funds into escrow for work before it begins. Its outcome is an Escrow (knowledge/product/entities.md) in the Held state (knowledge/product/states.md) and a Milestone (knowledge/product/entities.md) in the Funded state, so the work is secured. This process describes how that outcome is reached. It carries out the Escrow Funding workflow (knowledge/product/workflows.md) and owns none of the concepts it references.

# Trigger

The process starts when a participant acting in the Business role (knowledge/product/roles.md) commits to funding work for a milestone and begins funding escrow. The trigger is a business decision by an authorized participant; the interface by which it is registered lives in the codebase and is out of scope here.

# Participants

- A participant (knowledge/product/entities.md) acting in the Business role (knowledge/product/roles.md). This participant funds the escrow and is the primary actor throughout the process.

The freelancer whose work is being secured is informed of the outcome but does not take part in funding.

# Inputs

- The Contract (knowledge/product/entities.md) and the Milestone (knowledge/product/entities.md) to be funded.
- The funding amount for the milestone. The amount and any commercial values are owned elsewhere and are not defined here.
- The source of funds, drawn from the business's Wallet (knowledge/product/entities.md) and any remainder collected as a Payment (knowledge/product/entities.md).

# Outputs

- An Escrow (knowledge/product/entities.md) in the Held state (knowledge/product/states.md).
- A Milestone (knowledge/product/entities.md) in the Funded state (knowledge/product/states.md).
- A Payment (knowledge/product/entities.md) that moves from Pending to Paid, and a Transaction (knowledge/product/entities.md) recorded.
- A Notification (knowledge/product/entities.md) may be produced to inform the freelancer that the work is secured. How the notification is delivered is out of scope for this process; the Notification entity is owned by knowledge/product/entities.md.

# Preconditions

- The business participant holds the Fund Escrow and Make Payment permissions (knowledge/product/permissions.md).
- The business participant is in good standing: in the Active state and not in the Suspended or Banned state (knowledge/product/states.md).
- Whether escrow may be funded is governed by the Escrow Funding Constraint business rule, and whether a payment is acceptable by the Payment Validation business rule (knowledge/product/business-rules.md), which are referenced, not decided, here.

# Business Rules Referenced

- Escrow Funding Constraint (knowledge/product/business-rules.md). Governs when escrow may be funded.
- Payment Validation (knowledge/product/business-rules.md). Governs whether a payment is acceptable to process.
- Fee Calculation (knowledge/product/business-rules.md). Governs how a platform fee is derived.

The logic, conditions, thresholds, and values of these rules are owned by knowledge/product/business-rules.md and the codebase. This process references them and never states their content.

# Permissions Referenced

- Fund Escrow (knowledge/product/permissions.md). Authorizes funding escrow for the work.
- Make Payment (knowledge/product/permissions.md). Authorizes making the payment that funds the escrow.

Who holds these permissions and how authorization is evaluated are owned by knowledge/product/permissions.md and the codebase.

# States Referenced

- Held (knowledge/product/states.md). The condition of the Escrow while funds are kept for the work. This is the state the process brings the escrow into.
- Funded (knowledge/product/states.md). The condition of the Milestone once money is committed for its work.
- Pending (knowledge/product/states.md). The condition of the Payment while it awaits completion.
- Paid (knowledge/product/states.md). The condition of the Payment once it has completed.
- Active, Suspended, Banned (knowledge/product/states.md). Referenced as the participant standing evaluated in the preconditions.

This process references these states and never defines them, their transitions, or the order in which they are entered.

# Entities Involved

- Escrow (knowledge/product/entities.md). The funds held for the work.
- Milestone (knowledge/product/entities.md). The portion of work being funded.
- Contract (knowledge/product/entities.md). The engagement the funding secures.
- Payment (knowledge/product/entities.md). The value transferred to fund the escrow.
- Transaction (knowledge/product/entities.md). The record of the financial event.
- Wallet (knowledge/product/entities.md). The place the business's available funds are drawn from.
- Participant (knowledge/product/entities.md). The business funding the work.
- Notification (knowledge/product/entities.md). The signal that may inform the freelancer the work is secured.

This process acts upon these entities and never redefines them.

# Workflow Mapping

This process carries out exactly one workflow: Escrow Funding, whose existence is owned by knowledge/product/workflows.md. The workflow records that the sequence exists; this document records how it executes. Neither owns the other.

# Main Flow

1. A participant in the Business role, holding the Fund Escrow permission and in good standing, selects the milestone to fund.
2. The funding amount for the milestone is determined. The amount is owned elsewhere and is referenced, not set, here.
3. Funding proceeds under the Escrow Funding Constraint business rule, with the platform fee derived under the Fee Calculation business rule.
4. The payment is taken, authorized by the Make Payment permission, drawing first on the business's Wallet and collecting any remainder as a Payment, under the Payment Validation business rule.
5. The Payment moves from Pending to Paid.
6. The funds enter the Escrow in the Held state and the Milestone enters the Funded state.
7. The freelancer is informed that the work is secured.

# Alternate Flows

- Wallet-only funding. The full amount is drawn from the business's Wallet balance, with no additional payment collected.
- Funding multiple milestones. The business funds more than one milestone, each entering the Funded state with its own escrow Held.
- Additional funding. The business funds further work added to the contract through scope expansion.

# Exception Flows

- Payment not acceptable. Where the payment does not satisfy the Payment Validation business rule, the escrow is not Held and the milestone is not Funded.
- Funding not permitted. Where the Escrow Funding Constraint business rule is not satisfied, the funding does not proceed.
- Authorization lost during funding. Where the participant ceases to be authorized, for example by entering the Suspended or Banned state, funding cannot complete.
- Escalation. Where a matter arising during funding requires a higher authority, it is escalated to the Moderation Review process (knowledge/processes/moderation-review.md), which is handled by a participant in the Administrator role. Where an escalation is routed beyond that is owned by the Moderation Review process, not here.

# Completion Conditions

The process is complete when either of the following holds.

- The Escrow has entered the Held state and the Milestone has entered the Funded state (knowledge/product/states.md), with the Payment Paid. This is successful completion.
- Funding ends without escrow held, because the payment is not acceptable, the funding constraint is not satisfied, or the participant abandons it. This is completion without secured work.

# Related Knowledge

- knowledge/processes/README.md
- knowledge/processes/processes.md
- knowledge/product/workflows.md
- knowledge/product/entities.md
- knowledge/product/roles.md
- knowledge/product/permissions.md
- knowledge/product/states.md
- knowledge/product/business-rules.md
- knowledge/processes/engagement-formation.md
- knowledge/processes/contract-execution.md
- knowledge/processes/escrow-release.md
- knowledge/processes/moderation-review.md

# Identity Independence

This process remains the same process regardless of how it is carried out. Its identity does not change if the user interface changes, if the implementation changes, if the application programming interfaces change, if automation changes, if the underlying technology changes, if the databases change, or if the payment providers change. The Escrow Funding process is defined at the level of business execution, and it stays the same process whether it is executed by a human, by an AI agent, or by both. Changes to how the process is executed never change what the process is.

# Repository Growth

- This process has exactly one canonical document, which is this document. No other document owns the execution of the Escrow Funding process.
- Other documents reference this process; they do not restate its execution.
- Future refinements to how the Escrow Funding process executes are made in this document only.
- A change to how the process executes never changes the identity of the process, which is owned by knowledge/processes/processes.md, or the existence of its workflow, which is owned by knowledge/product/workflows.md.
- Changes to this document require approval and follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
