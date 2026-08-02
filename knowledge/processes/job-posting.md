---
id: OL-KNOW-PROCESSES-JOB-POSTING
document: knowledge/processes/job-posting.md

title: Open Lance Job Posting Process

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
  - Any AI Agent that executes the Job Posting process
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/processes/README.md, knowledge/processes/processes.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  How the Job Posting process executes: how a participant in the Business
  role makes a unit of work available in the marketplace and brings a Job
  into the Open state. It owns execution only and references entities,
  permissions, states, business rules, and its workflow by canonical path.
---

# Open Lance Job Posting Process

This document owns the execution of the Job Posting process. It records how a business activity runs from beginning to end, and nothing more.

It does not own the existence of the Job Posting workflow, the identity of the Job Posting process, or any entity, permission, state, business rule, feature, relationship, or policy. Those are owned by the documents named in each section and are referenced here by canonical repository path, never redefined. This document follows the Process Structure Standard defined in knowledge/processes/README.md and the repository constitution in knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

This document executes the canonical process Job Posting, whose identity is owned by knowledge/processes/processes.md, and it carries out the Job Posting workflow, whose existence is owned by knowledge/product/workflows.md. It redefines neither.

# Purpose

The Job Posting process makes a unit of work available in the marketplace so that freelancers can discover it and offer to perform it. Its outcome is a Job (knowledge/product/entities.md) that has entered the Open state (knowledge/product/states.md) and is available to receive proposals. This process describes how that outcome is reached. It carries out the Job Posting workflow (knowledge/product/workflows.md) and owns none of the concepts it references.

# Trigger

The process starts when a participant acting in the Business role (knowledge/product/roles.md) chooses to make work available and begins posting a job. The trigger is a business decision by an authorized participant; the interface and mechanism by which the decision is registered live in the codebase and are out of scope here.

# Participants

- A participant (knowledge/product/entities.md) acting in the Business role (knowledge/product/roles.md). This participant posts the job and is the primary actor throughout the process.

Where the platform requires review before a job becomes available, that review is carried out by the separate Moderation Review process (knowledge/processes/moderation-review.md), which involves a participant in the Administrator role (knowledge/product/roles.md). The Administrator's participation belongs to that process and is only referenced here. Freelancers do not take part in this process; they take part later through the Proposal Submission process (knowledge/processes/proposal-submission.md).

# Inputs

- The participant's intent to make work available.
- The description of the work to be done, which becomes the Job (knowledge/product/entities.md). The attributes of a job are owned by that entity's detail document and are not defined here.
- The Category (knowledge/product/entities.md) under which the work is classified.

# Outputs

- A Job (knowledge/product/entities.md) in the Open state (knowledge/product/states.md), available in the marketplace and able to receive proposals.
- The Open job becomes eligible to be matched under the Matching Eligibility business rule (knowledge/product/business-rules.md) and discoverable in search under the Search Visibility business rule (knowledge/product/business-rules.md).
- A Notification (knowledge/product/entities.md) may be produced to inform the business that the job is live. How the notification is delivered is out of scope for this process; the Notification entity is owned by knowledge/product/entities.md.

# Preconditions

- The participant holds the Post Job permission (knowledge/product/permissions.md).
- The participant is in good standing: in the Active state and not in the Suspended or Banned state (knowledge/product/states.md).
- Whether the participant is authorized, and the conditions under which the permission applies, are owned by knowledge/product/permissions.md and knowledge/product/business-rules.md and are referenced, not decided, here.

# Business Rules Referenced

- Job Validation (knowledge/product/business-rules.md). Governs whether a job is acceptable to publish.
- Matching Eligibility (knowledge/product/business-rules.md). Governs whether the posted work is eligible to be matched with talent.
- Search Visibility (knowledge/product/business-rules.md). Governs whether and how the posted job appears in search results.

The logic, conditions, thresholds, and values of these rules are owned by knowledge/product/business-rules.md and the codebase. This process references them and never states their content.

# Permissions Referenced

- Post Job (knowledge/product/permissions.md). Authorizes posting the job. Required for the main flow.
- Manage Job (knowledge/product/permissions.md). Authorizes managing a posted job. Referenced in the alternate flows where the business revises or closes a job that has already entered the Open state.

Who holds these permissions and how authorization is evaluated are owned by knowledge/product/permissions.md and the codebase.

# States Referenced

- Open (knowledge/product/states.md). The condition of the Job when it has been posted and is receiving proposals. This is the state the process brings the job into.
- Closed (knowledge/product/states.md). The condition of a Job no longer receiving proposals. Referenced where the business closes a job in an alternate flow.
- Active, Suspended, Banned (knowledge/product/states.md). Referenced as the participant standing evaluated in the preconditions.

This process references these states and never defines them, their transitions, or the order in which they are entered. Transitions are owned by knowledge/product/business-rules.md, and the states themselves by knowledge/product/states.md.

# Entities Involved

- Job (knowledge/product/entities.md). The unit of work made available.
- Participant (knowledge/product/entities.md). The actor posting the job, acting in the Business role.
- Category (knowledge/product/entities.md). The classification applied to the work.
- Notification (knowledge/product/entities.md). The signal that may inform the business the job is live.
- Moderation Case (knowledge/product/entities.md). Referenced only on the review path, where the separate Moderation Review process applies.

This process acts upon these entities and never redefines them.

# Workflow Mapping

This process carries out exactly one workflow: Job Posting, whose existence is owned by knowledge/product/workflows.md. The workflow records that the sequence exists; this document records how it executes. Neither owns the other.

# Main Flow

1. A participant in the Business role, holding the Post Job permission and in good standing, begins posting a job.
2. The participant provides the description of the work and classifies it under a Category.
3. The job's acceptability to publish is evaluated under the Job Validation business rule.
4. Where the platform requires review before the job becomes available, the job is carried through the Moderation Review process. The outcome of that review is owned by Moderation Review and is not decided here.
5. When the job is acceptable to publish and any required review has been passed, the job enters the Open state.
6. As an Open job, it becomes eligible to be matched under Matching Eligibility and discoverable in search under Search Visibility.
7. The business is informed that the job is live.

# Alternate Flows

- Preparation across sessions. The participant may prepare the job over more than one session before posting. The job does not enter the Open state until posting completes; until then there is no posted job.
- Revision after posting. The participant, authorized by the Manage Job permission, revises a job that has already entered the Open state. Revision does not change the identity of the process or of the job.
- Reclassification. The participant changes the Category under which the work is classified before the job is posted.
- Closing a posted job. The participant, authorized by the Manage Job permission, closes a job that has entered the Open state, moving it to the Closed state.

# Exception Flows

- Job not acceptable to publish. Where the job does not satisfy the Job Validation business rule, the job does not enter the Open state. The participant is informed and may revise and post again. No posted job exists until validation is satisfied.
- Review not passed. Where required review through the Moderation Review process does not approve the job, publication does not complete and the job does not enter the Open state. The review outcome is owned by Moderation Review.
- Authorization lost during posting. Where the participant ceases to be authorized, for example by entering the Suspended or Banned state, posting cannot complete.
- Escalation. Where a matter arising during posting requires a higher authority, for example a job that needs oversight, the matter is escalated to the Moderation Review process, which is handled by a participant in the Administrator role. Where an escalation is routed beyond that is owned by the Moderation Review process, not here.

# Completion Conditions

The process is complete when either of the following holds.

- The job has entered the Open state (knowledge/product/states.md) and is available in the marketplace to receive proposals. This is successful completion.
- Posting ends without the job entering the Open state, because the participant abandons it or because it does not satisfy the Job Validation business rule or required review and is not posted again. This is completion without a posted job.

The conditions that govern acceptability and review are owned by knowledge/product/business-rules.md and the Moderation Review process, and are referenced here, not decided here.

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
- knowledge/processes/proposal-submission.md

# Identity Independence

This process remains the same process regardless of how it is carried out. Its identity does not change if the user interface changes, if the implementation changes, if the application programming interfaces change, if automation changes, if the underlying technology changes, if the databases change, or if the payment providers change. The Job Posting process is defined at the level of business execution, and it stays the same process whether it is executed by a human, by an AI agent, or by both. Changes to how the process is executed never change what the process is.

# Repository Growth

- This process has exactly one canonical document, which is this document. No other document owns the execution of the Job Posting process.
- Other documents reference this process; they do not restate its execution.
- Future refinements to how the Job Posting process executes are made in this document only.
- A change to how the process executes never changes the identity of the process, which is owned by knowledge/processes/processes.md, or the existence of its workflow, which is owned by knowledge/product/workflows.md.
- Changes to this document require approval and follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
