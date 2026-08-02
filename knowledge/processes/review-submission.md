---
id: OL-KNOW-PROCESSES-REVIEW-SUBMISSION
document: knowledge/processes/review-submission.md

title: Open Lance Review Submission Process

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
  - Any AI Agent that executes the Review Submission process
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/processes/README.md, knowledge/processes/processes.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  How the Review Submission process executes: how a participant records
  feedback for completed work as a Review. It owns execution only and
  references entities, permissions, states, business rules, and its workflow
  by canonical path.
---

# Open Lance Review Submission Process

This document owns the execution of the Review Submission process. It records how a business activity runs from beginning to end, and nothing more.

It does not own the existence of the Review Submission workflow, the identity of the Review Submission process, or any entity, permission, state, business rule, feature, relationship, or policy. Those are owned by the documents named in each section and are referenced here by canonical repository path, never redefined. This document follows the Process Structure Standard defined in knowledge/processes/README.md and the repository constitution in knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

This document executes the canonical process Review Submission, whose identity is owned by knowledge/processes/processes.md, and it carries out the Review Submission workflow, whose existence is owned by knowledge/product/workflows.md. It redefines neither.

# Purpose

The Review Submission process lets a participant record feedback for completed work. Its outcome is a Review (knowledge/product/entities.md) recorded for a counterparty, contributing to reputation. This process describes how that outcome is reached. It carries out the Review Submission workflow (knowledge/product/workflows.md) and owns none of the concepts it references.

# Trigger

The process starts when, on or after completion of work, a party chooses to record feedback and begins submitting a review. The trigger is a business decision by an eligible party; the interface by which it is registered lives in the codebase and is out of scope here.

# Participants

- A participant (knowledge/product/entities.md) acting in the Business role (knowledge/product/roles.md) or the Freelancer role (knowledge/product/roles.md). Either party may record feedback for the other.

# Inputs

- The Contract (knowledge/product/entities.md) whose work has completed.
- The feedback the party wishes to record.
- The counterparty the review concerns.

# Outputs

- A Review (knowledge/product/entities.md) recorded for the counterparty.
- Updated reputation, derived under the Reputation Calculation business rule, which is owned elsewhere and only referenced here.
- A Notification (knowledge/product/entities.md) may be produced to inform the counterparty. How the notification is delivered is out of scope for this process; the Notification entity is owned by knowledge/product/entities.md.

# Preconditions

- The Contract whose work is being reviewed is in the Completed state, or the review is otherwise permitted (knowledge/product/states.md).
- The participant holds the Submit Review permission (knowledge/product/permissions.md).
- Whether a review may be submitted is governed by the Review Eligibility business rule (knowledge/product/business-rules.md), which is referenced, not decided, here.

# Business Rules Referenced

- Review Eligibility (knowledge/product/business-rules.md). Governs whether a review may be submitted.
- Reputation Calculation (knowledge/product/business-rules.md). Governs how a reputation or talent level is derived.

The logic, conditions, thresholds, and values of these rules are owned by knowledge/product/business-rules.md and the codebase. This process references them and never states their content.

# Permissions Referenced

- Submit Review (knowledge/product/permissions.md). Authorizes submitting a review.

Who holds this permission and how authorization is evaluated are owned by knowledge/product/permissions.md and the codebase.

# States Referenced

- Completed (knowledge/product/states.md). The condition of the Contract whose work has finished as agreed, referenced as a precondition.
- Active, Suspended, Banned (knowledge/product/states.md). Referenced as the participant standing that governs taking part.

This process references these states and never defines them, their transitions, or the order in which they are entered.

# Entities Involved

- Review (knowledge/product/entities.md). The recorded feedback on work.
- Contract (knowledge/product/entities.md). The engagement whose completed work is reviewed.
- Participant (knowledge/product/entities.md). The party recording feedback and the counterparty it concerns.
- Profile (knowledge/product/entities.md). The presented identity that reputation attaches to.
- Notification (knowledge/product/entities.md). The signal that may inform the counterparty.

This process acts upon these entities and never redefines them.

# Workflow Mapping

This process carries out exactly one workflow: Review Submission, whose existence is owned by knowledge/product/workflows.md. The workflow records that the sequence exists; this document records how it executes. Neither owns the other.

# Main Flow

1. After a Contract reaches the Completed state, a party chooses to record feedback for the counterparty.
2. The party's eligibility to review is evaluated under the Review Eligibility business rule.
3. The party records the feedback, authorized by the Submit Review permission, and it becomes a Review.
4. Reputation is updated under the Reputation Calculation business rule.
5. The counterparty is informed that feedback was recorded.

# Alternate Flows

- Mutual reviews. Both parties record feedback for each other for the same completed engagement.
- Review within a window. The party records feedback within an eligibility window governed by the Review Eligibility business rule.

# Exception Flows

- Not eligible. Where the Review Eligibility business rule is not satisfied, no review is recorded.
- Standing prevents participation. Where the party is in the Suspended or Banned state, feedback cannot be recorded.
- Escalation. Where a review is contested or requires oversight, for example an abusive review, the matter is escalated to the Moderation Review process (knowledge/processes/moderation-review.md), which is handled by a participant in the Administrator role. Where an escalation is routed beyond that is owned by the Moderation Review process, not here.

# Completion Conditions

The process is complete when either of the following holds.

- A Review has been recorded for the counterparty and reputation is updated. This is successful completion.
- No review is recorded, because the party is not eligible or abandons it. This is completion without a review.

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
- knowledge/processes/moderation-review.md

# Identity Independence

This process remains the same process regardless of how it is carried out. Its identity does not change if the user interface changes, if the implementation changes, if the application programming interfaces change, if automation changes, if the underlying technology changes, if the databases change, or if the payment providers change. The Review Submission process is defined at the level of business execution, and it stays the same process whether it is executed by a human, by an AI agent, or by both. Changes to how the process is executed never change what the process is.

# Repository Growth

- This process has exactly one canonical document, which is this document. No other document owns the execution of the Review Submission process.
- Other documents reference this process; they do not restate its execution.
- Future refinements to how the Review Submission process executes are made in this document only.
- A change to how the process executes never changes the identity of the process, which is owned by knowledge/processes/processes.md, or the existence of its workflow, which is owned by knowledge/product/workflows.md.
- Changes to this document require approval and follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
