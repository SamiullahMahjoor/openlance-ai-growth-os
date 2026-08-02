---
id: OL-KNOW-PROCESSES-MODERATION-REVIEW
document: knowledge/processes/moderation-review.md

title: Open Lance Moderation Review Process

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
  - Any AI Agent that executes the Moderation Review process
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/processes/README.md, knowledge/processes/processes.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  How the Moderation Review process executes: how the platform reviews a
  flagged matter as a Moderation Case, moving it through Under Review to
  Resolved. It owns execution only and references entities, permissions,
  states, business rules, and its workflow by canonical path.
---

# Open Lance Moderation Review Process

This document owns the execution of the Moderation Review process. It records how a business activity runs from beginning to end, and nothing more.

It does not own the existence of the Moderation Review workflow, the identity of the Moderation Review process, or any entity, permission, state, business rule, feature, relationship, or policy. Those are owned by the documents named in each section and are referenced here by canonical repository path, never redefined. This document follows the Process Structure Standard defined in knowledge/processes/README.md and the repository constitution in knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

This document executes the canonical process Moderation Review, whose identity is owned by knowledge/processes/processes.md, and it carries out the Moderation Review workflow, whose existence is owned by knowledge/product/workflows.md. It redefines neither.

# Purpose

The Moderation Review process lets the platform review a flagged matter. Its outcome is a Moderation Case (knowledge/product/entities.md) that moves through the Under Review state to the Resolved state (knowledge/product/states.md), with any resulting action directed. This process describes how that outcome is reached. It carries out the Moderation Review workflow (knowledge/product/workflows.md) and owns none of the concepts it references.

# Trigger

The process starts when a matter is flagged for oversight, for example reported content, a job that needs approval, or a risk signal, opening a Moderation Case. The trigger is the presence of a flagged matter; the interface by which it is registered lives in the codebase and is out of scope here.

# Participants

- A participant (knowledge/product/entities.md) acting in the Administrator role (knowledge/product/roles.md). This participant reviews the matter and directs the outcome.

The participants whose content or conduct is the subject of the review are referenced by the case but do not conduct the review.

# Inputs

- The flagged matter, recorded as a Moderation Case (knowledge/product/entities.md).
- The subject of the matter, which may be a Participant, a Job, or other flagged content (knowledge/product/entities.md).
- The evidence and context available for the review.

# Outputs

- A Moderation Case (knowledge/product/entities.md) in the Resolved state (knowledge/product/states.md).
- Any directed action, such as a Job moving to the Open state after approval, or a Participant moving to the Suspended or Banned state (knowledge/product/states.md).
- A Notification (knowledge/product/entities.md) may be produced to inform the affected parties. How the notification is delivered is out of scope for this process; the Notification entity is owned by knowledge/product/entities.md.

# Preconditions

- A Moderation Case exists because a matter has been flagged.
- The reviewing participant holds the Moderate Content permission and, where an action affects a participant, the Suspend Participant permission (knowledge/product/permissions.md).
- How the matter is decided is governed by the Moderation Decision business rule (knowledge/product/business-rules.md), which is referenced, not decided, here.

# Business Rules Referenced

- Moderation Decision (knowledge/product/business-rules.md). Governs how a flagged matter is decided.
- Job Validation (knowledge/product/business-rules.md). Governs whether a job is acceptable to publish, where the flagged matter is a job.

The logic, conditions, thresholds, and values of these rules are owned by knowledge/product/business-rules.md and the codebase. This process references them and never states their content.

# Permissions Referenced

- Moderate Content (knowledge/product/permissions.md). Authorizes moderating content.
- Suspend Participant (knowledge/product/permissions.md). Authorizes suspending a participant, where an action affects a participant.

Who holds these permissions and how authorization is evaluated are owned by knowledge/product/permissions.md and the codebase.

# States Referenced

- Under Review (knowledge/product/states.md). The condition of the Moderation Case while the matter is reviewed. This is the state the process brings the case into.
- Resolved (knowledge/product/states.md). The condition of the Moderation Case once the matter reaches an outcome.
- Suspended (knowledge/product/states.md). The condition a participant may be moved to by a directed action.
- Banned (knowledge/product/states.md). The condition a participant may be moved to by a directed action.
- Open (knowledge/product/states.md). The condition a job may reach where the review approves its publication.

This process references these states and never defines them, their transitions, or the order in which they are entered.

# Entities Involved

- Moderation Case (knowledge/product/entities.md). The recorded matter of oversight.
- Participant (knowledge/product/entities.md). The administrator conducting the review and any participant who is the subject of the matter.
- Job (knowledge/product/entities.md). The subject of the matter where a posted job is reviewed.
- Notification (knowledge/product/entities.md). The signal that may inform the affected parties.

This process acts upon these entities and never redefines them.

# Workflow Mapping

This process carries out exactly one workflow: Moderation Review, whose existence is owned by knowledge/product/workflows.md. The workflow records that the sequence exists; this document records how it executes. Neither owns the other.

# Main Flow

1. A matter is flagged and a Moderation Case is opened.
2. The Moderation Case enters the Under Review state.
3. A participant in the Administrator role reviews the matter and its evidence, authorized by the Moderate Content permission.
4. The outcome is decided under the Moderation Decision business rule.
5. Any resulting action is directed: a reviewed Job may reach the Open state under the Job Validation business rule or be rejected; a Participant may be moved to the Suspended or Banned state under the Suspend Participant permission; flagged content may be removed.
6. The Moderation Case enters the Resolved state and the affected parties are informed.

# Alternate Flows

- Proactive review. The platform reviews a matter it identifies, rather than one that is reported.
- Reported review. The platform reviews a matter reported by a participant.
- Appeal. A resolved matter is appealed and re-reviewed under the Moderation Decision business rule, opening the case for review again.

# Exception Flows

- Insufficient basis. Where the review finds no basis for action, the Moderation Case enters the Resolved state with no action directed.
- Related dispute. Where the matter involves a disagreement over work or payment, it is handled by the Dispute Resolution process (knowledge/processes/dispute-resolution.md).
- Authorization limited to administrators. Where a participant without the Moderate Content permission attempts the review, it cannot proceed.
- Escalation. Where a matter requires a higher administrative authority, for example a severe action, it is escalated within the administration under the Moderation Decision business rule. Where an escalation is routed beyond that is owned by the administration, not here.

# Completion Conditions

The process is complete when the following holds.

- The Moderation Case has entered the Resolved state (knowledge/product/states.md), with any resulting action directed. This is successful completion.

Where the review is reopened on appeal, the process runs again for the reopened case.

# Related Knowledge

- knowledge/processes/README.md
- knowledge/processes/processes.md
- knowledge/product/workflows.md
- knowledge/product/entities.md
- knowledge/product/roles.md
- knowledge/product/permissions.md
- knowledge/product/states.md
- knowledge/product/business-rules.md
- knowledge/processes/job-posting.md
- knowledge/processes/dispute-resolution.md

# Identity Independence

This process remains the same process regardless of how it is carried out. Its identity does not change if the user interface changes, if the implementation changes, if the application programming interfaces change, if automation changes, if the underlying technology changes, if the databases change, or if the payment providers change. The Moderation Review process is defined at the level of business execution, and it stays the same process whether it is executed by a human, by an AI agent, or by both. Changes to how the process is executed never change what the process is.

# Repository Growth

- This process has exactly one canonical document, which is this document. No other document owns the execution of the Moderation Review process.
- Other documents reference this process; they do not restate its execution.
- Future refinements to how the Moderation Review process executes are made in this document only.
- A change to how the process executes never changes the identity of the process, which is owned by knowledge/processes/processes.md, or the existence of its workflow, which is owned by knowledge/product/workflows.md.
- Changes to this document require approval and follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
