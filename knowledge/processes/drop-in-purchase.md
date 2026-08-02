---
id: OL-KNOW-PROCESSES-DROP-IN-PURCHASE
document: knowledge/processes/drop-in-purchase.md

title: Open Lance Drop-In Purchase Process

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
  - Any AI Agent that executes the Drop-In Purchase process
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/processes/README.md, knowledge/processes/processes.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  How the Drop-In Purchase process executes: how a business obtains a
  productized service and forms a Contract in the Active state for it. It
  owns execution only and references entities, permissions, states,
  business rules, and its workflow by canonical path.
---

# Open Lance Drop-In Purchase Process

This document owns the execution of the Drop-In Purchase process. It records how a business activity runs from beginning to end, and nothing more.

It does not own the existence of the Drop-In Purchase workflow, the identity of the Drop-In Purchase process, or any entity, permission, state, business rule, feature, relationship, or policy. Those are owned by the documents named in each section and are referenced here by canonical repository path, never redefined. This document follows the Process Structure Standard defined in knowledge/processes/README.md and the repository constitution in knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

This document executes the canonical process Drop-In Purchase, whose identity is owned by knowledge/processes/processes.md, and it carries out the Drop-In Purchase workflow, whose existence is owned by knowledge/product/workflows.md. It redefines neither.

# Purpose

The Drop-In Purchase process lets a business obtain a productized, fixed-scope service. Its outcome is a Contract (knowledge/product/entities.md) in the Active state (knowledge/product/states.md) for a Drop-In (knowledge/product/entities.md), with the work secured in escrow. This process describes how that outcome is reached. It carries out the Drop-In Purchase workflow (knowledge/product/workflows.md) and owns none of the concepts it references.

# Trigger

The process starts when a participant acting in the Business role (knowledge/product/roles.md) chooses to obtain a productized service and begins purchasing a Drop-In. The trigger is a business decision by an authorized participant; the interface by which it is registered lives in the codebase and is out of scope here.

# Participants

- A participant (knowledge/product/entities.md) acting in the Business role (knowledge/product/roles.md). This participant selects and purchases the Drop-In.
- A participant (knowledge/product/entities.md) acting in the Freelancer role (knowledge/product/roles.md). This participant provides the Drop-In and is engaged to deliver it.

# Inputs

- The Drop-In (knowledge/product/entities.md) the business selects.
- The buyer's requirements for the service.
- The two parties: the business and the provider.

# Outputs

- A Contract (knowledge/product/entities.md) in the Active state (knowledge/product/states.md) for the Drop-In.
- A Milestone (knowledge/product/entities.md) in the Funded state and Escrow (knowledge/product/entities.md) in the Held state, established through the Escrow Funding process.
- A Notification (knowledge/product/entities.md) may be produced to inform the provider that the service is purchased. How the notification is delivered is out of scope for this process; the Notification entity is owned by knowledge/product/entities.md.

# Preconditions

- The business participant holds the Fund Escrow and Make Payment permissions (knowledge/product/permissions.md).
- Both parties are in good standing: in the Active state and not in the Suspended or Banned state (knowledge/product/states.md).
- The selected Drop-In is available for purchase.
- Whether a contract may be formed is governed by the Contract Formation Constraint business rule, and whether escrow may be funded by the Escrow Funding Constraint business rule (knowledge/product/business-rules.md), which are referenced, not decided, here.

# Business Rules Referenced

- Contract Formation Constraint (knowledge/product/business-rules.md). Governs when a contract may be formed.
- Hiring Eligibility (knowledge/product/business-rules.md). Governs whether a participant may engage a freelancer.
- Escrow Funding Constraint (knowledge/product/business-rules.md). Governs when escrow may be funded.
- Payment Validation (knowledge/product/business-rules.md). Governs whether a payment is acceptable to process.
- Fee Calculation (knowledge/product/business-rules.md). Governs how a platform fee is derived.

The logic, conditions, thresholds, and values of these rules are owned by knowledge/product/business-rules.md and the codebase. This process references them and never states their content.

# Permissions Referenced

- Fund Escrow (knowledge/product/permissions.md). Authorizes funding escrow for the work.
- Make Payment (knowledge/product/permissions.md). Authorizes making the payment for the purchase.

Who holds these permissions and how authorization is evaluated are owned by knowledge/product/permissions.md and the codebase.

# States Referenced

- Active (knowledge/product/states.md). The condition of the Contract formed for the Drop-In. This is the state the process brings the contract into.
- Funded (knowledge/product/states.md). The condition of the Milestone once money is committed for its work.
- Held (knowledge/product/states.md). The condition of the Escrow while funds are kept for the work.
- Suspended, Banned (knowledge/product/states.md). Referenced as party standing evaluated in the preconditions.

This process references these states and never defines them, their transitions, or the order in which they are entered.

# Entities Involved

- Drop-In (knowledge/product/entities.md). The productized service being obtained.
- Contract (knowledge/product/entities.md). The agreement formed for the service.
- Milestone (knowledge/product/entities.md). The portion of work funded for the service.
- Escrow (knowledge/product/entities.md). The funds held for the work.
- Payment (knowledge/product/entities.md). The value transferred for the purchase.
- Participant (knowledge/product/entities.md). The business and the provider.
- Notification (knowledge/product/entities.md). The signal that may inform the provider of the purchase.

This process acts upon these entities and never redefines them.

# Workflow Mapping

This process carries out exactly one workflow: Drop-In Purchase, whose existence is owned by knowledge/product/workflows.md. The workflow records that the sequence exists; this document records how it executes. Neither owns the other.

# Main Flow

1. A participant in the Business role, in good standing, selects an available Drop-In and provides its requirements.
2. A Contract for the Drop-In is formed under the Contract Formation Constraint and Hiring Eligibility business rules and enters the Active state.
3. Escrow for the service is funded through the Escrow Funding process, authorized by the Fund Escrow and Make Payment permissions, under the Escrow Funding Constraint business rule, with the platform fee derived under Fee Calculation.
4. The Milestone for the service enters the Funded state and the Escrow enters the Held state.
5. The provider is engaged to deliver the service.
6. The provider is informed that the service is purchased.

# Alternate Flows

- Option selection. The buyer selects among the options the offering provides before purchase.
- Repeat purchase. The buyer obtains the same Drop-In again, forming a new Contract each time.
- Requirements provided after purchase. The buyer supplies the service requirements after the Contract has entered the Active state.

# Exception Flows

- Payment or funding not completed. Where the payment does not satisfy the Payment Validation business rule (knowledge/product/business-rules.md) or the Escrow Funding Constraint is not satisfied, no active contract is formed and no work is secured.
- Offering not available. Where the selected Drop-In is not available for purchase, the process cannot proceed.
- Authorization lost during purchase. Where a party ceases to be authorized, for example by entering the Suspended or Banned state, the purchase cannot complete.
- Escalation. Where a matter arising during purchase requires a higher authority, the matter is escalated to the Moderation Review process (knowledge/processes/moderation-review.md), which is handled by a participant in the Administrator role. Where an escalation is routed beyond that is owned by the Moderation Review process, not here.

# Completion Conditions

The process is complete when either of the following holds.

- A Contract for the Drop-In has entered the Active state (knowledge/product/states.md) and the work is secured in escrow. This is successful completion.
- Purchase ends without an active contract, because payment or funding does not complete, the offering is unavailable, or the buyer abandons it. This is completion without a purchased service.

# Related Knowledge

- knowledge/processes/README.md
- knowledge/processes/processes.md
- knowledge/product/workflows.md
- knowledge/product/entities.md
- knowledge/product/roles.md
- knowledge/product/permissions.md
- knowledge/product/states.md
- knowledge/product/business-rules.md
- knowledge/processes/escrow-funding.md
- knowledge/processes/contract-execution.md
- knowledge/processes/moderation-review.md

# Identity Independence

This process remains the same process regardless of how it is carried out. Its identity does not change if the user interface changes, if the implementation changes, if the application programming interfaces change, if automation changes, if the underlying technology changes, if the databases change, or if the payment providers change. The Drop-In Purchase process is defined at the level of business execution, and it stays the same process whether it is executed by a human, by an AI agent, or by both. Changes to how the process is executed never change what the process is.

# Repository Growth

- This process has exactly one canonical document, which is this document. No other document owns the execution of the Drop-In Purchase process.
- Other documents reference this process; they do not restate its execution.
- Future refinements to how the Drop-In Purchase process executes are made in this document only.
- A change to how the process executes never changes the identity of the process, which is owned by knowledge/processes/processes.md, or the existence of its workflow, which is owned by knowledge/product/workflows.md.
- Changes to this document require approval and follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
