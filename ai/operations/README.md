---
id: OL-AI-OPERATIONS-README
document: ai/operations/README.md

title: Open Lance AIOS Operations Namespace Guide

version: 1.0
status: Frozen

document_type: normative
authority: Process

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/governance/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that operates the layer
  - Any contributor to the Operations namespace

provenance:
  - Derived from ai/README.md and ai/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how operations is documented. It establishes the standard structure,
  derivation rules, invariants, and boundaries every operations document under
  ai/operations/ must follow, and it owns operational extensibility and
  neutrality. It owns how running the layer is documented, and owns no
  governance rule, no runtime behavior, no reasoning, no subject behavior, and
  no implementation.
---

# Open Lance AIOS Operations Namespace Guide

This document is the guide for the Operations namespace at ai/operations/. The Operations namespace owns one thing: the architectural model for operating the AI Operating System. It defines how the running of the layer is observed, monitored, kept healthy, diagnosed, maintained, and evolved, so that the layer runs reliably without its behavior ever being changed by the act of operating it. It owns no governance rule, no runtime execution, no reasoning, no retrieval, no memory, no prompt, no agent behavior, no provider, no tool, no safety rule, no evaluation, no evolution of the layer, and no business truth. Operations governs the operation of the layer; it never changes what the layer does.

This guide derives its authority from the AI constitution at ai/README.md and the contribution process at ai/CONTRIBUTING.md, and it operates under the governance mandates at ai/governance/. Operations sits at the Specification authority level defined in ai/README.md, operating the Runtime namespace it runs, observing the Evaluation namespace for operational awareness, and deferring protection to the Safety namespace. Where this guide and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

# Purpose

This document owns exactly one thing: how operating the layer is documented within the AI layer. It is the single guide for the Operations namespace, and every operations document follows it.

The Operations namespace exists so that running the layer is a defined, governed, deterministic, technology-neutral discipline, rather than an ad hoc or opaque practice. It defines how the layer is operated; it never reasons, never executes runtime behavior, never decides a matter reserved to governance, and never changes the behavior of any namespace. Operating the layer keeps it running well; it never alters what it does.

This guide owns no operational model itself, no governance rule, and no business truth. The operational model is owned by the member documents of this namespace; the rules that govern the AI are owned by ai/governance/; the behavior operated is owned by the namespace that defines it; business truth is owned by the knowledge repository.

# Scope

This guide governs the Operations namespace. It defines the standard structure an operations document uses, the rules for writing one, the invariants every operations document upholds, the boundaries an operations document must respect, and how the namespace grows. It owns operational extensibility, the additive way the operational model gains new concerns over time, and operational neutrality, the permanent independence of the operational model from any monitoring tool, dashboard, infrastructure, deployment system, provider, framework, runtime, or language.

The namespace owns the operational model of the AI layer: the operational architecture and identity, lifecycle, observability, monitoring, incident management, health management, diagnostics, maintenance, boundaries, and versioning. Each concern is owned by its own document, created under this guide.

# Operational Identity

Operations is the running discipline of the AI layer, and it is not any of the following.

- Operations is not the runtime. The runtime executes, orchestrates, and schedules; operations observes and keeps that execution running well. Operations never executes, orchestrates, or schedules, and never changes runtime behavior; those are owned by ai/runtime/.
- Operations is not governance. Governance owns the rules and the decisions; operations runs the layer within them. Operations never defines or changes a rule, and never makes a governed decision; those are owned by ai/governance/.
- Operations is not the behavior it operates. Reasoning, retrieval, memory, prompts, agents, providers, and tools own their behavior; operations keeps the layer that runs them healthy. Operations performs none of their behavior and changes none of it.
- Operations is not safety. Safety protects and owns hazard, risk, refusal, and degradation; operations observes the running layer and defers a protective response to safety. An operational incident is not a safety hazard, and operations never refuses, escalates as protection, or degrades; those are owned by ai/safety/.
- Operations is not evaluation. Evaluation judges output quality; operations observes the running of the layer. Operations references an evaluation result as an operational signal and never judges output itself; that is owned by ai/evaluation/.
- Operations is not knowledge. Business truth is owned by the knowledge repository. Operations carries no business truth and never owns, restates, or becomes it.
- Operations is not implementation. It defines the operational model, never a monitoring tool, a dashboard, a log, an alerting platform, a deployment system, an infrastructure product, a provider, a framework, or code.

An operations document answers only how one aspect of operating the layer works. Its knowledge is durable, technology-neutral, and independent of any tool, infrastructure, provider, or runtime, so it remains valid as those change.

# Operational Invariants

These invariants are permanent. Every operations document upholds them, and no operation may violate them.

- Operations operates the layer; it never changes its behavior. Operating observes, monitors, and maintains the running of the layer, and never reasons, executes runtime behavior, or alters what a namespace does.
- Operations observes; it owns no behavior. The behavior operated is owned by its namespace, and operations owns the operational model only.
- Operations is deterministic. The same operational state, the same signals, and the same rules yield the same operational assessment, health state, incident classification, and maintenance determination, with no randomness.
- Operations changes no governance and no constitutional behavior. Operations runs the layer within the rules owned by ai/governance/, and never amends a rule or a behavior.
- Operations defers protection and judgment. A protective response is owned by ai/safety/, and output judgment by ai/evaluation/; operations observes their signals and defers to them.
- Operations is technology-neutral. It owns no monitoring tool, log, dashboard, infrastructure, deployment system, or operational software.
- Operations is single-owned and scalable. Each operational concern has exactly one owning document, and the operational model holds for a single agent or a whole enterprise.

# Operations Document Standard

Every operations document under ai/operations/ uses the following standard structure. This section defines the template only. It defines no actual operational model. The inventory at ai/operations/operations.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The operational concern the document owns.
- Principles. The enduring principles for the concern, instantiating ai/README.md and the operational invariants.
- Specification. The technology-neutral operational model itself: the architecture, lifecycle, observability, monitoring, incident management, health management, diagnostics, maintenance, boundaries, or versioning the document owns.
- Invariants. The operational invariants that always hold for the concern.
- Boundaries. What the document does not own, with each excluded concern referenced to its canonical owner.
- Related Knowledge. Canonical repository paths the document references, within ai/ and, for consumption, into knowledge/.

An operations document may add a section only when a genuine operational concern requires it, following ai/CONTRIBUTING.md, and never to move a governance rule, runtime behavior, a subject's behavior, or business truth into this namespace.

# Documentation Rules

An operations document records one aspect of the operational model, and nothing more.

- An operations document never restates a governance rule, a runtime behavior, a subject's behavior, a safety rule, an evaluation model, or business truth. It references ai/governance/, ai/runtime/, the subject namespaces, ai/safety/, ai/evaluation/, and the knowledge repository by canonical path.
- An operations document never names a monitoring tool, a dashboard, a log, an alerting platform, a deployment system, an infrastructure product, a cloud service, a provider, a framework, a language, or a runtime, and never contains code.
- An operations document defines the operational model, never how operations is implemented, tooled, or deployed, and never the behavior it operates.
- Everything an operations document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Consumption of the knowledge repository is one-directional. Relative links are never used.

# Boundaries

Each concern has exactly one owner. Operations owns running the layer. The runtime executes. Governance owns rules and decisions. Reasoning reasons. Retrieval determines knowledge. Memory retains context. Prompts express. Agents act. Providers abstract intelligence. Tools interact externally. Safety protects. Evaluation judges output. Evolution grows the layer. The knowledge repository owns truth. An operations document owns only its own aspect of the operational model. It owns none of the following.

- The Authority Hierarchy, boundary, principles, and lifecycle rules: ai/README.md.
- The contribution, amendment, and certification process: ai/CONTRIBUTING.md.
- The mandates, decisions, and change governance: ai/governance/.
- Execution, orchestration, scheduling, and runtime behavior: ai/runtime/.
- The behavior operated: the subject namespaces.
- Protection, and the judgment of output: ai/safety/ and ai/evaluation/.
- The evolution of the layer: the Evolution namespace.
- Business truth: the knowledge repository.
- The maps of the AI layer: ai/architecture/.

An operations document references all of the above and owns none of it. It records only the durable, technology-neutral operational model.

# Loading Guidance

Operations is loaded at the Optional tier defined in ai/README.md, because operating the layer is a rare task, and it is elevated to the Required tier when the layer is being operated, as recorded in ai/architecture/loading-map.md. This guide and the inventory are loaded first, for navigation; the member documents are loaded when an operating task calls for them. The applied, task-level loading guidance is owned by ai/architecture/loading-map.md; this section states intent only and defines no runtime loading behavior.

# Repository Growth

New operational knowledge is added by creating new operations documents under ai/operations/, each following the Operations Document Standard and owning a single concern. The namespace grows only when a genuinely new operational concern arises. The structure defined by this guide never changes as the namespace grows, existing documents never change identity, and growth is always additive. This operational extensibility lets the operational model gain new observability, incident, or maintenance concerns over decades, and scale across an enterprise, without redesign, and it is owned here.

# Document Governance

- This is a normative document, at the Process authority level defined in ai/README.md, and it governs the Operations namespace only.
- It does not create constitutional authority. It derives its authority from ai/README.md and ai/CONTRIBUTING.md and operates under the mandates at ai/governance/. Where this guide and a higher-authority document differ, the higher-authority document governs.
- The inventory at ai/operations/operations.md declares the Reference authority level. Every operational-model member document declares the Specification authority level.
- Operations documents follow the standard and rules defined here, conform to the governance mandates, and consume business truth by reference. An operations document that conflicts with any of these is corrected to conform.
- Changes to this guide require approval and must follow the amendment process defined in ai/CONTRIBUTING.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/governance/README.md
- ai/runtime/README.md
- ai/evaluation/README.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Operations documents. The operational-model member documents of this namespace are created together with this guide, following it and ai/CONTRIBUTING.md.
- Position in the layer. Operations operates the runtime it runs, observes the evaluation signals it draws on, and defers protection to safety, all within governance. It owns the operational model only, and never the behavior it operates nor the rules it runs within.
- Maturity. When this namespace is complete and frozen, its maturity in ai/architecture/repository-evolution.md advances from Planned to Complete, recorded there through the amendment process.
