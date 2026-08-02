---
id: OL-AI-ARCHITECTURE-AUTHORITY-MAP
document: ai/architecture/authority-map.md

title: Open Lance AIOS Authority Map

version: 1.0
status: Frozen

document_type: reference
authority: Reference

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/architecture/README.md
  - ai/architecture/architecture.md

used_by:
  - AI Systems Architect
  - Any AI agent that navigates or loads the AI layer
  - Any AI agent that maintains or extends the AI layer
  - Any contributor to the Architecture namespace

provenance:
  - Derived from ai/README.md and the authority metadata across the AI layer

loading_priority: Contextual

summary: >
  The derived map of which authority level each namespace and document
  occupies in the AI layer. It owns the authority map only, and defers the
  Authority Hierarchy and conflict resolution to the constitution.
---

# Open Lance AIOS Authority Map

This document owns the Authority Map for the AI layer: which authority level each namespace and document occupies. It is an architecture document within the Architecture namespace, and it follows the Architecture Document Standard defined in ai/architecture/README.md. Its identity in the inventory is owned by ai/architecture/architecture.md; this document owns the map only. The Authority Hierarchy that defines the levels, and the rule that conflicts are resolved by authority, are owned by ai/README.md. Where this document and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns the derived map of authority assignments. Its purpose is that an agent can see, in one place, where each namespace and document sits in the AI Authority Hierarchy, so that precedence in a conflict is clear.

# Scope

This map covers authority at the namespace level, and the pattern of authority within each namespace. It does not define the Authority Hierarchy or the conflict-resolution rule, which are owned by ai/README.md, and it does not override any document's own authority declaration, which stays authoritative. It classifies the levels defined by the constitution; it never adds a level.

# Derivation

This map is derived from, and references, the following authoritative sources, which it never restates.

- The Authority Hierarchy, the authority field, and the rule that conflicts are resolved by declared authority: ai/README.md.
- Each document's own authority declaration.

# Map

Authority is assigned by each document's authority field, not by its folder. The AI Authority Hierarchy defined in ai/README.md has seven levels, from most governing to most operational: Charter, Principle, Mandate, Policy, Specification, Process, and Reference. The pattern across the AI layer is as follows.

- The constitution holds the highest authority. ai/README.md declares Charter, the supreme authority of the AI layer, and ai/CONTRIBUTING.md declares Process, operationalizing it. The constitutional principles are owned within the Charter until, if ever, a dedicated Principle document is created.
- The Governance namespace declares the Mandate level. Its documents are the absolute constraints every action must satisfy, above the operational layers.
- Normative behavioral decisions declare the Policy level: the standing decisions in Reasoning, Agents, Retrieval, Providers, Tools, Evaluation, and Safety, such as reasoning governance, agent coordination, and selection and routing policy.
- Component and behavior definitions declare the Specification level: the technology-neutral definitions in Runtime, Retrieval, Reasoning, Prompts, Memory, Agents, Providers, Tools, and Safety.
- Every namespace guide, the README of each namespace, declares the Process authority level and governs its namespace, alongside the lifecycles and flows such as the task lifecycle in Runtime, and the Operations and Evolution processes.
- Every inventory and every map declares the Reference authority level and carries no precedence over normative documents. The Architecture namespace's documents, and the reference documents in Operations, are reference documents.

A namespace may hold documents at more than one level; a document's authority is always its own declaration. When two documents conflict, the higher authority in the AI Authority Hierarchy prevails, as owned by ai/README.md. On any matter of business truth, the knowledge repository prevails over every AI level. This map records the assignments; the constitution owns the resolution rule.

# Application

To resolve a conflict or judge precedence within the AI layer, an agent consults this map to see each document's authority level, then applies the conflict-resolution rule owned by ai/README.md. A contributor placing a new document consults this map for the pattern its namespace follows. Where a conflict concerns business truth, the knowledge repository governs, and the agent consults knowledge/architecture/authority-map.md.

# Boundaries

This document owns the authority map only. It owns none of the following.

- The Authority Hierarchy, the authority levels, and the conflict-resolution rule: ai/README.md.
- Each document's own authority declaration: that document's front matter.
- How namespaces depend on one another: ai/architecture/dependency-map.md.
- The build state of any namespace: ai/architecture/repository-evolution.md.
- The approval authority for freezing and amendment: ai/CONTRIBUTING.md.
- The authority classification of the knowledge repository: knowledge/architecture/authority-map.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/architecture/README.md
- ai/architecture/architecture.md
- ai/architecture/dependency-map.md
- ai/architecture/repository-evolution.md
