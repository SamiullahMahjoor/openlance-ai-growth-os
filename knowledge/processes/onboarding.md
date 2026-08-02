---
id: OL-KNOW-PROCESSES-ONBOARDING
document: knowledge/processes/onboarding.md

title: Open Lance Onboarding Process

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
  - Any AI Agent that executes the Onboarding process
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/processes/README.md, knowledge/processes/processes.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  How the Onboarding process executes: how a new participant joins and
  becomes ready to take part, establishing a Participant and Profile in the
  Active state. It owns execution only and references entities, permissions,
  states, business rules, and its workflow by canonical path.
---

# Open Lance Onboarding Process

This document owns the execution of the Onboarding process. It records how a business activity runs from beginning to end, and nothing more.

It does not own the existence of the Onboarding workflow, the identity of the Onboarding process, or any entity, permission, state, business rule, feature, relationship, or policy. Those are owned by the documents named in each section and are referenced here by canonical repository path, never redefined. This document follows the Process Structure Standard defined in knowledge/processes/README.md and the repository constitution in knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

This document executes the canonical process Onboarding, whose identity is owned by knowledge/processes/processes.md, and it carries out the Onboarding workflow, whose existence is owned by knowledge/product/workflows.md. It redefines neither.

# Purpose

The Onboarding process lets a new participant join Open Lance and become ready to take part. Its outcome is a Participant (knowledge/product/entities.md) in the Active state with a Profile (knowledge/product/entities.md), ready to act in the marketplace. This process describes how that outcome is reached. It carries out the Onboarding workflow (knowledge/product/workflows.md) and owns none of the concepts it references.

# Trigger

The process starts when a new participant begins joining the marketplace. The trigger is the arrival of a new participant; the interface by which it is registered lives in the codebase and is out of scope here.

# Participants

- A new participant (knowledge/product/entities.md), who joins and establishes their presence.
- A participant (knowledge/product/entities.md) acting in the Administrator role (knowledge/product/roles.md), only where verification or oversight of the new participant is required.

# Inputs

- The new participant's registration and identity information. The details of that information are owned elsewhere and are not defined here.
- The role or roles the participant intends to act in (knowledge/product/roles.md).
- Profile and Category (knowledge/product/entities.md) information the participant provides.

# Outputs

- A Participant (knowledge/product/entities.md) in the Active state, initially in the Unverified state (knowledge/product/states.md).
- A Profile (knowledge/product/entities.md) that presents the participant in the marketplace.
- Readiness to take part in the marketplace.
- A Notification (knowledge/product/entities.md) may be produced to welcome the participant. How the notification is delivered is out of scope for this process; the Notification entity is owned by knowledge/product/entities.md.

# Preconditions

- The participant holds the Manage Account permission (knowledge/product/permissions.md).
- The participant is not in the Banned state (knowledge/product/states.md).
- Whether the identity information is acceptable is governed by the Identity Validation business rule, and what verification is required by the Verification Requirement business rule (knowledge/product/business-rules.md), which are referenced, not decided, here.

# Business Rules Referenced

- Identity Validation (knowledge/product/business-rules.md). Governs whether identity information is acceptable.
- Verification Requirement (knowledge/product/business-rules.md). Governs what verification is required to take part.

The logic, conditions, thresholds, and values of these rules are owned by knowledge/product/business-rules.md and the codebase. This process references them and never states their content.

# Permissions Referenced

- Manage Account (knowledge/product/permissions.md). Authorizes managing the new account.

Who holds this permission and how authorization is evaluated are owned by knowledge/product/permissions.md and the codebase.

# States Referenced

- Active (knowledge/product/states.md). The condition of the Participant once the account is established and in effect. This is the state the process brings the participant into.
- Unverified (knowledge/product/states.md). The initial condition of the Participant before verification.
- Verified (knowledge/product/states.md). The condition a participant reaches through the Verification process where required.
- Banned (knowledge/product/states.md). Referenced as the standing that prevents joining.

This process references these states and never defines them, their transitions, or the order in which they are entered.

# Entities Involved

- Participant (knowledge/product/entities.md). The new actor joining the marketplace.
- Profile (knowledge/product/entities.md). The presented identity established for the participant.
- Category (knowledge/product/entities.md). The classification a freelancer selects for their field of work.
- Notification (knowledge/product/entities.md). The signal that may welcome the participant.

This process acts upon these entities and never redefines them.

# Workflow Mapping

This process carries out exactly one workflow: Onboarding, whose existence is owned by knowledge/product/workflows.md. The workflow records that the sequence exists; this document records how it executes. Neither owns the other.

# Main Flow

1. A new participant registers with identity information, authorized to manage the account by the Manage Account permission.
2. The identity information is evaluated under the Identity Validation business rule.
3. A Participant and a Profile are established, with the Participant in the Active state and initially in the Unverified state.
4. The participant provides Profile and Category information, a freelancer selecting the Category for their field of work.
5. Verification is carried out through the Verification process (knowledge/processes/verification.md) where the Verification Requirement business rule calls for it.
6. The participant becomes ready to take part and is welcomed.

# Alternate Flows

- Onboarding by role. The readiness steps differ for a participant intending to act in the Business role and one intending to act in the Freelancer role.
- Category selection. A freelancer selects the Category and its subcategory for their field of work as part of becoming ready.
- Joining by referral. A new participant joins on the referral of an existing participant, following the same steps.

# Exception Flows

- Identity information not acceptable. Where the identity information does not satisfy the Identity Validation business rule, the account is not established and the participant does not become ready.
- Required verification not completed. Where the Verification Requirement business rule is not satisfied, participation is limited until the participant reaches the Verified state.
- Standing prevents joining. Where the participant is in the Banned state, they cannot join.
- Escalation. Where a matter arising during onboarding requires a higher authority, for example a suspected fraudulent registration, it is escalated to the Moderation Review process (knowledge/processes/moderation-review.md), which is handled by a participant in the Administrator role. Where an escalation is routed beyond that is owned by the Moderation Review process, not here.

# Completion Conditions

The process is complete when either of the following holds.

- The Participant is in the Active state with a Profile and is ready to take part (knowledge/product/states.md). This is successful completion.
- Onboarding does not complete, because the identity information is not acceptable, the standing prevents joining, or the participant abandons it. This is completion without a ready participant.

# Related Knowledge

- knowledge/processes/README.md
- knowledge/processes/processes.md
- knowledge/product/workflows.md
- knowledge/product/entities.md
- knowledge/product/roles.md
- knowledge/product/permissions.md
- knowledge/product/states.md
- knowledge/product/business-rules.md
- knowledge/processes/verification.md
- knowledge/processes/moderation-review.md

# Identity Independence

This process remains the same process regardless of how it is carried out. Its identity does not change if the user interface changes, if the implementation changes, if the application programming interfaces change, if automation changes, if the underlying technology changes, if the databases change, or if the payment providers change. The Onboarding process is defined at the level of business execution, and it stays the same process whether it is executed by a human, by an AI agent, or by both. Changes to how the process is executed never change what the process is.

# Repository Growth

- This process has exactly one canonical document, which is this document. No other document owns the execution of the Onboarding process.
- Other documents reference this process; they do not restate its execution.
- Future refinements to how the Onboarding process executes are made in this document only.
- A change to how the process executes never changes the identity of the process, which is owned by knowledge/processes/processes.md, or the existence of its workflow, which is owned by knowledge/product/workflows.md.
- Changes to this document require approval and follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
