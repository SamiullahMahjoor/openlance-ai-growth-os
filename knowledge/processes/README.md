---
id: OL-KNOW-PROCESSES-README
document: knowledge/processes/README.md

title: Open Lance Process Namespace Guide

version: 1.0
status: Frozen

document_type: normative
authority: Process

owner: Founder
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - knowledge/README.md
  - knowledge/CONTRIBUTING.md
  - knowledge/product/workflows.md

used_by:
  - Product Manager
  - Operations Manager
  - Customer Support Agent
  - CMO Agent
  - Any AI Agent that authors or executes a process
  - Any contributor to the Process namespace

provenance:
  - Derived from knowledge/README.md and knowledge/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how business processes are documented in the repository. It
  establishes the standard structure, documentation rules, and boundaries
  that every process document under knowledge/processes/ must follow. It
  owns no process itself.
---

# Open Lance Process Namespace Guide

This document is the guide for the Process namespace at knowledge/processes/. It establishes the constitutional architecture that every process document must follow. It defines how business processes are documented; it does not own any business process.

This guide derives its authority from the repository constitution in knowledge/README.md and the contribution process in knowledge/CONTRIBUTING.md, and applies them to the Process namespace. It does not create constitutional authority of its own, and it governs only the organization and documentation standards of the namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns exactly one thing: how business processes are documented within the repository. It is the single guide for the Process namespace, and every process document follows it.

It does not own business processes themselves. Each process document owns the execution of one process. It also does not own workflows, features, entities, relationships, roles, states, permissions, business rules, policies, or implementation, all of which are owned elsewhere and are only referenced by process documents.

# Scope

This guide governs the Process namespace. It defines the standard structure a process document uses, the rules for writing one, the boundaries a process document must respect, and how the namespace grows.

It does not define any specific process, and it does not define or redefine any concept owned by the Company layer or the Product ontology. Those are referenced by canonical repository path and never restated.

# Architectural Identity

A process is its own kind of concept and is not any of the following.

- A process is not a Feature. Features are owned by knowledge/product/features.md.
- A process is not an Entity. Entities are owned by knowledge/product/entities.md.
- A process is not a Relationship. Relationships are owned by knowledge/product/relationships.md.
- A process is not a Workflow. Workflows are owned by knowledge/product/workflows.md.
- A process is not a Permission. Permissions are owned by knowledge/product/permissions.md.
- A process is not a State. States are owned by knowledge/product/states.md.
- A process is not a Business Rule. Business rules are owned by knowledge/product/business-rules.md.
- A process is not a Policy. Policies are owned by the policy documents in their owning folders.
- A process is not a technical implementation, an API, a database model, or a user-interface flow. Those live in the codebase, not in the knowledge repository.

A process answers only how a business activity executes from beginning to end. Its identity is independent of implementation, technology, automation, and interface, and it remains the same process whether it is executed by a human, by an AI agent, or by both.

# Definitions

These definitions are repository-wide and timeless. Each references the document that owns the concept where one applies.

- Process. A documented execution of a business activity from beginning to end.
- Business Activity. A unit of business work that a process carries out. The inventory of the activities that exist is owned by knowledge/product/workflows.md.
- Process Step. A single unit of action within a process.
- Decision Point. A point in a process where the path taken depends on a condition. The condition itself is a business rule, owned by knowledge/product/business-rules.md.
- Input. Something a process requires in order to begin or to proceed.
- Output. Something a process produces.
- Participant. A role or an entity that takes part in a process. Roles are owned by knowledge/product/roles.md and entities by knowledge/product/entities.md; a process references them and never redefines them.
- Trigger. The event or condition that starts a process.
- Completion. The condition under which a process is finished. The conditions themselves are states and business rules, owned by knowledge/product/states.md and knowledge/product/business-rules.md.
- Exception. A deviation from the normal execution of a process.
- Escalation. The referral of a process matter to a higher authority for handling. Where an escalation is routed is not defined here.

# Process Principles

- Every process has exactly one canonical document, which owns that process.
- Every process document owns execution only. It records how a business activity runs, nothing else.
- Features enable processes. A process references the features it uses and never redefines them.
- Workflows identify processes. A process references the workflow it carries out and never redefines it.
- States record conditions. A process references the states it moves through and never redefines them.
- Permissions authorize actions. A process references the permissions its actions require and never redefines them.
- Business rules constrain execution. A process references the business rules that govern it and never redefines them.
- Entities participate in processes. A process references the entities involved and never redefines them.
- Relationships connect entities. A process references relationships and never redefines them.
- Processes are implementation-independent.
- Processes are technology-independent.
- Growth is additive only. New processes extend the namespace without changing this guide.
- Existing process identities never change.
- Common concepts are reused by reference rather than duplicated.

# Process Structure Standard

Every process document under knowledge/processes/ uses the following standard structure. This section defines the template only. It does not define any actual process.

- Purpose. What the process accomplishes.
- Trigger. What starts the process.
- Participants. The roles and entities that take part, referenced to knowledge/product/roles.md and knowledge/product/entities.md.
- Inputs. What the process requires.
- Outputs. What the process produces.
- Preconditions. What must already be true before the process runs.
- Business Rules Referenced. The business rules that govern the process, referenced to knowledge/product/business-rules.md.
- Permissions Referenced. The permissions the process requires, referenced to knowledge/product/permissions.md.
- States Referenced. The states the process moves through, referenced to knowledge/product/states.md.
- Entities Involved. The entities the process acts upon, referenced to knowledge/product/entities.md.
- Workflow Mapping. The workflow the process carries out, referenced to knowledge/product/workflows.md.
- Main Flow. The normal path of execution from beginning to end.
- Alternate Flows. Valid variations from the main path.
- Exception Flows. How deviations and errors are handled.
- Completion Conditions. When the process is considered finished.
- Related Knowledge. Canonical repository paths to the documents the process references.

# Documentation Rules

A process document describes execution. It records how a business activity runs, and nothing more.

- A process document never redefines any concept in the ontology. It references entities, relationships, roles, workflows, states, permissions, business rules, and features by canonical repository path.
- A process document never redefines permissions, business rules, states, entities, workflows, or features.
- Everything a process depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Relative links are never used.

# Boundaries

Each concept has exactly one owner. A process owns only its own execution. It owns none of the following.

- Capabilities and features: knowledge/product/features.md.
- Entities: knowledge/product/entities.md.
- Relationships: knowledge/product/relationships.md.
- Roles: knowledge/product/roles.md.
- Workflows: knowledge/product/workflows.md.
- Permissions: knowledge/product/permissions.md.
- States: knowledge/product/states.md.
- Business rules: knowledge/product/business-rules.md.
- Pricing and commercial values: knowledge/product/pricing.md.
- Policies: the policy documents in their owning folders.
- Implementation, APIs, user interfaces, databases, and infrastructure: the codebase, not the knowledge repository.

A process references all of the above and owns none of it. It records only how a business activity executes.

# Repository Growth

New processes are added by creating new process documents under knowledge/processes/, each following the Process Structure Standard. The structure defined by this guide never changes as the namespace grows, existing process identities never change, and growth is always additive. The namespace supports an unlimited number of processes.

# Document Governance

- This is a normative document, at the Process authority level defined in knowledge/README.md, and it governs the Process namespace only.
- It does not create constitutional authority. It derives its authority from knowledge/README.md and knowledge/CONTRIBUTING.md and applies their rules to this namespace. Where this guide and a higher-authority document differ, the higher-authority document governs.
- Process documents follow the standard and rules defined here. A process document that conflicts with them is corrected to conform, which does not change that document's ownership of its own execution.
- Changes to this guide require approval and must follow the repository amendment process defined in knowledge/CONTRIBUTING.md.

# Related Knowledge

- knowledge/README.md
- knowledge/CONTRIBUTING.md
- knowledge/product/README.md
- knowledge/product/workflows.md
- knowledge/product/entities.md
- knowledge/product/states.md
- knowledge/product/permissions.md
- knowledge/product/business-rules.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Process documents. The individual process documents governed by this guide are created over time under knowledge/processes/, following this guide and knowledge/CONTRIBUTING.md. Until then, references to specific process documents elsewhere in the repository are intentional forward references.
- Escalation routing. This guide defines escalation as a concept but not where an escalation is routed. If a durable, repository-level statement of escalation routing is ever wanted, it would be added to its owning document without changing this guide.
