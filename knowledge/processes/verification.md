---
id: OL-KNOW-PROCESSES-VERIFICATION
document: knowledge/processes/verification.md

title: Open Lance Verification Process

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
  - Any AI Agent that executes the Verification process
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/processes/README.md, knowledge/processes/processes.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  How the Verification process executes: how a participant's identity or
  credentials are confirmed, moving the participant from Unverified to
  Verified. It owns execution only and references entities, permissions,
  states, business rules, and its workflow by canonical path.
---

# Open Lance Verification Process

This document owns the execution of the Verification process. It records how a business activity runs from beginning to end, and nothing more.

It does not own the existence of the Verification workflow, the identity of the Verification process, or any entity, permission, state, business rule, feature, relationship, or policy. Those are owned by the documents named in each section and are referenced here by canonical repository path, never redefined. This document follows the Process Structure Standard defined in knowledge/processes/README.md and the repository constitution in knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

This document executes the canonical process Verification, whose identity is owned by knowledge/processes/processes.md, and it carries out the Verification workflow, whose existence is owned by knowledge/product/workflows.md. It redefines neither.

# Purpose

The Verification process confirms a participant's identity or credentials. Its outcome is a Participant (knowledge/product/entities.md) that moves from the Unverified state to the Verified state (knowledge/product/states.md). This process describes how that outcome is reached. It carries out the Verification workflow (knowledge/product/workflows.md) and owns none of the concepts it references.

# Trigger

The process starts when a participant submits identity or credential information for confirmation, or when a verification requirement calls for it. The trigger is the presence of information to confirm or a requirement to meet; the interface by which it is registered lives in the codebase and is out of scope here.

# Participants

- A participant (knowledge/product/entities.md) who is the subject of verification.
- A participant (knowledge/product/entities.md) acting in the Administrator role (knowledge/product/roles.md). This participant reviews and confirms the verification.

# Inputs

- The participant's identity or credential information. The details of that information are owned elsewhere and are not defined here.
- The verification requirement that applies to the participant.

# Outputs

- A Participant (knowledge/product/entities.md) in the Verified state on success, or remaining in the Unverified state on failure (knowledge/product/states.md).
- A record of the verification outcome.
- A Notification (knowledge/product/entities.md) may be produced to inform the participant of the outcome. How the notification is delivered is out of scope for this process; the Notification entity is owned by knowledge/product/entities.md.

# Preconditions

- The subject participant is in the Unverified state, or is re-confirming an existing verification (knowledge/product/states.md).
- The reviewing participant holds the Verify Participant permission (knowledge/product/permissions.md).
- What verification is required is governed by the Verification Requirement business rule, and whether the information is acceptable by the Identity Validation and Document Validation business rules (knowledge/product/business-rules.md), which are referenced, not decided, here.

# Business Rules Referenced

- Verification Requirement (knowledge/product/business-rules.md). Governs what verification is required.
- Identity Validation (knowledge/product/business-rules.md). Governs whether identity information is acceptable.
- Document Validation (knowledge/product/business-rules.md). Governs whether a submitted document is acceptable.

The logic, conditions, thresholds, and values of these rules are owned by knowledge/product/business-rules.md and the codebase. This process references them and never states their content.

# Permissions Referenced

- Verify Participant (knowledge/product/permissions.md). Authorizes verifying a participant.

Who holds this permission and how authorization is evaluated are owned by knowledge/product/permissions.md and the codebase.

# States Referenced

- Unverified (knowledge/product/states.md). The condition of a participant who has not completed verification, referenced as a precondition.
- Verified (knowledge/product/states.md). The condition of a participant who has completed verification. This is the state the process brings the participant into on success.
- Suspended, Banned (knowledge/product/states.md). Referenced as participant standing that prevents taking part.

This process references these states and never defines them, their transitions, or the order in which they are entered.

# Entities Involved

- Participant (knowledge/product/entities.md). The subject of verification.
- Profile (knowledge/product/entities.md). The presented identity that verification supports.
- Notification (knowledge/product/entities.md). The signal that may inform the participant of the outcome.

This process acts upon these entities and never redefines them.

# Workflow Mapping

This process carries out exactly one workflow: Verification, whose existence is owned by knowledge/product/workflows.md. The workflow records that the sequence exists; this document records how it executes. Neither owns the other.

# Main Flow

1. A participant submits identity or credential information for confirmation.
2. The information is evaluated under the Identity Validation and Document Validation business rules.
3. A participant in the Administrator role reviews the information and confirms it, authorized by the Verify Participant permission, under the Verification Requirement business rule.
4. The subject participant moves from the Unverified state to the Verified state.
5. The participant is informed of the outcome.

# Alternate Flows

- Re-verification. A verified participant re-confirms identity or credentials when a requirement calls for it.
- Different subjects of verification. The required verification differs for a business and for a freelancer, as governed by the Verification Requirement business rule.
- Credential-level verification. A higher level of verification is confirmed where the Verification Requirement business rule calls for it.

# Exception Flows

- Information not acceptable. Where the information does not satisfy the Identity Validation or Document Validation business rule, the participant remains Unverified and may submit again.
- Requirement not met. Where the Verification Requirement business rule is not satisfied, the participant is not Verified.
- Standing prevents participation. Where the participant is in the Suspended or Banned state, verification does not enable participation.
- Escalation. Where a matter arising during verification requires a higher authority, for example a suspected fraudulent identity, it is escalated to the Moderation Review process (knowledge/processes/moderation-review.md), which is handled by a participant in the Administrator role. Where an escalation is routed beyond that is owned by the Moderation Review process, not here.

# Completion Conditions

The process is complete when either of the following holds.

- The participant has entered the Verified state (knowledge/product/states.md). This is successful completion.
- The participant remains in the Unverified state, because the information is not acceptable or the requirement is not met. This is completion without verification.

# Related Knowledge

- knowledge/processes/README.md
- knowledge/processes/processes.md
- knowledge/product/workflows.md
- knowledge/product/entities.md
- knowledge/product/roles.md
- knowledge/product/permissions.md
- knowledge/product/states.md
- knowledge/product/business-rules.md
- knowledge/processes/onboarding.md
- knowledge/processes/moderation-review.md

# Identity Independence

This process remains the same process regardless of how it is carried out. Its identity does not change if the user interface changes, if the implementation changes, if the application programming interfaces change, if automation changes, if the underlying technology changes, if the databases change, or if the payment providers change. The Verification process is defined at the level of business execution, and it stays the same process whether it is executed by a human, by an AI agent, or by both. Changes to how the process is executed never change what the process is.

# Repository Growth

- This process has exactly one canonical document, which is this document. No other document owns the execution of the Verification process.
- Other documents reference this process; they do not restate its execution.
- Future refinements to how the Verification process executes are made in this document only.
- A change to how the process executes never changes the identity of the process, which is owned by knowledge/processes/processes.md, or the existence of its workflow, which is owned by knowledge/product/workflows.md.
- Changes to this document require approval and follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
