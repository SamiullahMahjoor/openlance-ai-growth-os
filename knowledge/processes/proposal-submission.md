---
id: OL-KNOW-PROCESSES-PROPOSAL-SUBMISSION
document: knowledge/processes/proposal-submission.md

title: Open Lance Proposal Submission Process

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
  - Any AI Agent that executes the Proposal Submission process
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/processes/README.md, knowledge/processes/processes.md, knowledge/product/workflows.md, and the Open Lance product

loading_priority: Required

summary: >
  How the Proposal Submission process executes: how a participant in the
  Freelancer role offers to perform available work and brings a Proposal
  into the Submitted state. It owns execution only and references entities,
  permissions, states, business rules, and its workflow by canonical path.
---

# Open Lance Proposal Submission Process

This document owns the execution of the Proposal Submission process. It records how a business activity runs from beginning to end, and nothing more.

It does not own the existence of the Proposal Submission workflow, the identity of the Proposal Submission process, or any entity, permission, state, business rule, feature, relationship, or policy. Those are owned by the documents named in each section and are referenced here by canonical repository path, never redefined. This document follows the Process Structure Standard defined in knowledge/processes/README.md and the repository constitution in knowledge/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

This document executes the canonical process Proposal Submission, whose identity is owned by knowledge/processes/processes.md, and it carries out the Proposal Submission workflow, whose existence is owned by knowledge/product/workflows.md. It redefines neither.

# Purpose

The Proposal Submission process lets a freelancer offer to perform available work. Its outcome is a Proposal (knowledge/product/entities.md) that has entered the Submitted state (knowledge/product/states.md) against an Open Job (knowledge/product/entities.md), so the business can consider it. This process describes how that outcome is reached. It carries out the Proposal Submission workflow (knowledge/product/workflows.md) and owns none of the concepts it references.

# Trigger

The process starts when a participant acting in the Freelancer role (knowledge/product/roles.md) chooses to pursue an Open job and begins submitting a proposal. The trigger is a business decision by an authorized participant; the interface by which the decision is registered lives in the codebase and is out of scope here.

# Participants

- A participant (knowledge/product/entities.md) acting in the Freelancer role (knowledge/product/roles.md). This participant prepares and submits the proposal and is the primary actor throughout the process.

The business that posted the job is the recipient of the proposal. The business does not take part in this process; it considers the proposal later through the Engagement Formation process (knowledge/processes/engagement-formation.md).

# Inputs

- The participant's intent to pursue available work.
- The Open Job (knowledge/product/entities.md) the participant is pursuing.
- The content of the offer to perform the work, which becomes the Proposal (knowledge/product/entities.md). The attributes of a proposal are owned by that entity's detail document and are not defined here.
- Available proposal capacity, drawn from a Bid Pack (knowledge/product/entities.md) or a membership allowance.

# Outputs

- A Proposal (knowledge/product/entities.md) in the Submitted state (knowledge/product/states.md), available for the business to consider.
- A Notification (knowledge/product/entities.md) may be produced to inform the business that a proposal was received. How the notification is delivered is out of scope for this process; the Notification entity is owned by knowledge/product/entities.md.

# Preconditions

- The participant holds the Submit Proposal permission (knowledge/product/permissions.md).
- The participant is in good standing: in the Active state and not in the Suspended or Banned state (knowledge/product/states.md).
- The target Job is in the Open state (knowledge/product/states.md).
- The participant has available proposal capacity, as governed by the Proposal Limit Constraint business rule (knowledge/product/business-rules.md).
- Whether the participant is eligible, and the conditions under which the permission applies, are owned by knowledge/product/permissions.md and knowledge/product/business-rules.md and are referenced, not decided, here.

# Business Rules Referenced

- Proposal Eligibility (knowledge/product/business-rules.md). Governs whether a participant may submit a proposal.
- Proposal Validation (knowledge/product/business-rules.md). Governs whether a proposal is acceptable to submit.
- Proposal Limit Constraint (knowledge/product/business-rules.md). Governs the number of proposals available to a participant.

The logic, conditions, thresholds, and values of these rules are owned by knowledge/product/business-rules.md and the codebase. This process references them and never states their content.

# Permissions Referenced

- Submit Proposal (knowledge/product/permissions.md). Authorizes submitting the proposal. Required for the main flow.

Who holds this permission and how authorization is evaluated are owned by knowledge/product/permissions.md and the codebase.

# States Referenced

- Submitted (knowledge/product/states.md). The condition of the Proposal once it has been put forward for the business to consider. This is the state the process brings the proposal into.
- Open (knowledge/product/states.md). The condition of the Job that the proposal is submitted against, referenced as a precondition.
- Accepted, Declined (knowledge/product/states.md). The conditions a submitted proposal may later reach. These are reached by the Engagement Formation process (knowledge/processes/engagement-formation.md), not here.
- Active, Suspended, Banned (knowledge/product/states.md). Referenced as the participant standing evaluated in the preconditions.

This process references these states and never defines them, their transitions, or the order in which they are entered.

# Entities Involved

- Proposal (knowledge/product/entities.md). The offer to perform work made available for consideration.
- Participant (knowledge/product/entities.md). The actor submitting the proposal, acting in the Freelancer role.
- Job (knowledge/product/entities.md). The unit of work the proposal is submitted against.
- Bid Pack (knowledge/product/entities.md). The source of the proposal capacity a submission consumes.
- Notification (knowledge/product/entities.md). The signal that may inform the business a proposal was received.

This process acts upon these entities and never redefines them.

# Workflow Mapping

This process carries out exactly one workflow: Proposal Submission, whose existence is owned by knowledge/product/workflows.md. The workflow records that the sequence exists; this document records how it executes. Neither owns the other.

# Main Flow

1. A participant in the Freelancer role, holding the Submit Proposal permission and in good standing, selects an Open job to pursue.
2. The participant prepares the offer to perform the work, which becomes the Proposal.
3. The proposal's acceptability to submit is evaluated under the Proposal Validation business rule.
4. The participant's available proposal capacity is evaluated under the Proposal Limit Constraint business rule, drawing on a Bid Pack or a membership allowance.
5. When the proposal is acceptable and capacity is available, the proposal enters the Submitted state.
6. The business is informed that a proposal was received.

# Alternate Flows

- Preparation across sessions. The participant may prepare the proposal over more than one session before submitting. The proposal does not enter the Submitted state until submission completes; until then there is no submitted proposal.
- Revision before submission. The participant changes the content of the offer before it is submitted.
- Resubmission. Where a submitted proposal reaches the Declined state through the Engagement Formation process, the participant may prepare and submit a new proposal for an Open job, subject to the same preconditions.

# Exception Flows

- Proposal not acceptable to submit. Where the proposal does not satisfy the Proposal Validation business rule, it does not enter the Submitted state. The participant is informed and may revise and submit again.
- No available capacity. Where the participant has no available proposal capacity under the Proposal Limit Constraint business rule, the proposal cannot be submitted until capacity is obtained.
- Job no longer available. Where the target Job is no longer in the Open state, the proposal cannot be submitted.
- Authorization lost during submission. Where the participant ceases to be authorized, for example by entering the Suspended or Banned state, submission cannot complete.
- Escalation. Where a matter arising during submission requires a higher authority, for example a proposal that needs oversight, the matter is escalated to the Moderation Review process (knowledge/processes/moderation-review.md), which is handled by a participant in the Administrator role. Where an escalation is routed beyond that is owned by the Moderation Review process, not here.

# Completion Conditions

The process is complete when either of the following holds.

- The proposal has entered the Submitted state (knowledge/product/states.md) and is available for the business to consider. This is successful completion.
- Submission ends without the proposal entering the Submitted state, because the participant abandons it or because it does not satisfy the Proposal Validation business rule or lacks available capacity and is not submitted. This is completion without a submitted proposal.

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
- knowledge/processes/moderation-review.md

# Identity Independence

This process remains the same process regardless of how it is carried out. Its identity does not change if the user interface changes, if the implementation changes, if the application programming interfaces change, if automation changes, if the underlying technology changes, if the databases change, or if the payment providers change. The Proposal Submission process is defined at the level of business execution, and it stays the same process whether it is executed by a human, by an AI agent, or by both. Changes to how the process is executed never change what the process is.

# Repository Growth

- This process has exactly one canonical document, which is this document. No other document owns the execution of the Proposal Submission process.
- Other documents reference this process; they do not restate its execution.
- Future refinements to how the Proposal Submission process executes are made in this document only.
- A change to how the process executes never changes the identity of the process, which is owned by knowledge/processes/processes.md, or the existence of its workflow, which is owned by knowledge/product/workflows.md.
- Changes to this document require approval and follow the repository amendment process defined in knowledge/CONTRIBUTING.md.
