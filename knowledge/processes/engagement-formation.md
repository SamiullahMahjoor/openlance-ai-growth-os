---
id: OL-KNOW-PROCESSES-ENGAGEMENT-FORMATION
document: knowledge/processes/engagement-formation.md

title: Open Lance Engagement Formation Process

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
  - Any AI Agent that executes the Engagement Formation process
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/processes/README.md, knowledge/processes/processes.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  How the Engagement Formation process executes: how a business and a
  freelancer reach an agreed engagement and form a Contract in the Active
  state. It owns execution only and references entities, permissions,
  states, business rules, and its workflow by canonical path.
---

# Open Lance Engagement Formation Process

This document owns the execution of the Engagement Formation process. It records how a business activity runs from beginning to end, and nothing more.

It does not own the existence of the Engagement Formation workflow, the identity of the Engagement Formation process, or any entity, permission, state, business rule, feature, relationship, or policy. Those are owned by the documents named in each section and are referenced here by canonical repository path, never redefined. This document follows the Process Structure Standard defined in knowledge/processes/README.md and the repository constitution in knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

This document executes the canonical process Engagement Formation, whose identity is owned by knowledge/processes/processes.md, and it carries out the Engagement Formation workflow, whose existence is owned by knowledge/product/workflows.md. It redefines neither.

# Purpose

The Engagement Formation process lets a business and a freelancer reach an agreed engagement. Its outcome is a Contract (knowledge/product/entities.md) in the Active state (knowledge/product/states.md), formed from an offer that the freelancer accepts. This process describes how that agreement is reached. It carries out the Engagement Formation workflow (knowledge/product/workflows.md) and owns none of the concepts it references.

# Trigger

The process starts when a participant acting in the Business role (knowledge/product/roles.md), having considered proposals or identified a freelancer, chooses to engage that freelancer and begins forming an engagement. The trigger is a business decision by an authorized participant; the interface by which it is registered lives in the codebase and is out of scope here.

# Participants

- A participant (knowledge/product/entities.md) acting in the Business role (knowledge/product/roles.md). This participant considers proposals and sends the offer of engagement.
- A participant (knowledge/product/entities.md) acting in the Freelancer role (knowledge/product/roles.md). This participant considers the offer and accepts or declines it.

# Inputs

- The Proposals (knowledge/product/entities.md) the business is considering.
- The terms of the offer of engagement, which the parties agree upon.
- The two parties: the business and the freelancer.

# Outputs

- A Contract (knowledge/product/entities.md) in the Active state (knowledge/product/states.md).
- The accepted Proposal (knowledge/product/entities.md) in the Accepted state, and any other considered Proposals in the Declined state (knowledge/product/states.md).
- A Notification (knowledge/product/entities.md) may be produced to inform the parties of the outcome. How the notification is delivered is out of scope for this process; the Notification entity is owned by knowledge/product/entities.md.

# Preconditions

- The business participant holds the Review Proposals and Send Offer permissions (knowledge/product/permissions.md).
- Both parties are in good standing: in the Active state and not in the Suspended or Banned state (knowledge/product/states.md).
- Whether the business may engage the freelancer is governed by the Hiring Eligibility business rule, and whether a contract may be formed by the Contract Formation Constraint business rule (knowledge/product/business-rules.md), which are referenced, not decided, here.

# Business Rules Referenced

- Hiring Eligibility (knowledge/product/business-rules.md). Governs whether a participant may engage a freelancer.
- Contract Formation Constraint (knowledge/product/business-rules.md). Governs when a contract may be formed.
- Matching Eligibility (knowledge/product/business-rules.md). Governs whether the work and the talent are eligible to be matched.

The logic, conditions, thresholds, and values of these rules are owned by knowledge/product/business-rules.md and the codebase. This process references them and never states their content.

# Permissions Referenced

- Review Proposals (knowledge/product/permissions.md). Authorizes considering received proposals.
- Send Offer (knowledge/product/permissions.md). Authorizes sending an offer of engagement.

Who holds these permissions and how authorization is evaluated are owned by knowledge/product/permissions.md and the codebase.

# States Referenced

- Accepted (knowledge/product/states.md). The condition of the Proposal that the parties agree upon.
- Declined (knowledge/product/states.md). The condition of a Proposal that is not agreed upon.
- Active (knowledge/product/states.md). The condition of the Contract once the engagement is agreed. This is the state the process brings the contract into.
- Suspended, Banned (knowledge/product/states.md). Referenced as party standing evaluated in the preconditions.

This process references these states and never defines them, their transitions, or the order in which they are entered.

# Entities Involved

- Proposal (knowledge/product/entities.md). The offer to perform work that is considered and accepted or declined.
- Contract (knowledge/product/entities.md). The agreement formed from the accepted offer.
- Participant (knowledge/product/entities.md). The business and the freelancer forming the engagement.
- Job (knowledge/product/entities.md). The unit of work the engagement concerns, where the engagement arises from a posted job.
- Conversation (knowledge/product/entities.md). The thread in which the offer is discussed and agreed.
- Notification (knowledge/product/entities.md). The signal that may inform the parties of the outcome.

This process acts upon these entities and never redefines them.

# Workflow Mapping

This process carries out exactly one workflow: Engagement Formation, whose existence is owned by knowledge/product/workflows.md. The workflow records that the sequence exists; this document records how it executes. Neither owns the other.

# Main Flow

1. A participant in the Business role, holding the Review Proposals permission, considers the proposals received or identifies a freelancer to engage.
2. The business selects a freelancer and sends an offer of engagement, authorized by the Send Offer permission, under the Hiring Eligibility and Matching Eligibility business rules.
3. The two parties agree the terms of the offer.
4. The freelancer accepts the offer.
5. The accepted Proposal enters the Accepted state, and any other considered Proposals may enter the Declined state.
6. A Contract is formed under the Contract Formation Constraint business rule and enters the Active state.
7. The parties are informed that the engagement is formed. Funding of the work is carried out through the Escrow Funding process (knowledge/processes/escrow-funding.md).

# Alternate Flows

- Negotiation before acceptance. The parties revise the terms of the offer within the Conversation before the freelancer accepts.
- Direct offer. The business sends an offer based on a proposal raised in a conversation rather than from a posted job.
- No engagement formed. The business declines the proposals it considered, which enter the Declined state, and no contract is formed.

# Exception Flows

- Offer declined. Where the freelancer declines the offer, no contract is formed and the considered Proposal may enter the Declined state.
- Contract may not be formed. Where the Contract Formation Constraint business rule is not satisfied, no contract is formed.
- Authorization lost during formation. Where a party ceases to be authorized, for example by entering the Suspended or Banned state, the engagement cannot be formed.
- Escalation. Where a matter arising during formation requires a higher authority, the matter is escalated to the Moderation Review process (knowledge/processes/moderation-review.md), which is handled by a participant in the Administrator role. Where an escalation is routed beyond that is owned by the Moderation Review process, not here.

# Completion Conditions

The process is complete when either of the following holds.

- A Contract has entered the Active state (knowledge/product/states.md) and the parties are engaged. This is successful completion.
- Formation ends without a contract, because the offer is declined, the Contract Formation Constraint is not satisfied, or a party abandons the engagement. This is completion without an engagement.

The conditions that govern hiring and contract formation are owned by knowledge/product/business-rules.md and are referenced here, not decided here.

# Related Knowledge

- knowledge/processes/README.md
- knowledge/processes/processes.md
- knowledge/product/workflows.md
- knowledge/product/entities.md
- knowledge/product/roles.md
- knowledge/product/permissions.md
- knowledge/product/states.md
- knowledge/product/business-rules.md
- knowledge/processes/proposal-submission.md
- knowledge/processes/escrow-funding.md
- knowledge/processes/contract-execution.md
- knowledge/processes/moderation-review.md

# Identity Independence

This process remains the same process regardless of how it is carried out. Its identity does not change if the user interface changes, if the implementation changes, if the application programming interfaces change, if automation changes, if the underlying technology changes, if the databases change, or if the payment providers change. The Engagement Formation process is defined at the level of business execution, and it stays the same process whether it is executed by a human, by an AI agent, or by both. Changes to how the process is executed never change what the process is.

# Repository Growth

- This process has exactly one canonical document, which is this document. No other document owns the execution of the Engagement Formation process.
- Other documents reference this process; they do not restate its execution.
- Future refinements to how the Engagement Formation process executes are made in this document only.
- A change to how the process executes never changes the identity of the process, which is owned by knowledge/processes/processes.md, or the existence of its workflow, which is owned by knowledge/product/workflows.md.
- Changes to this document require approval and follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
