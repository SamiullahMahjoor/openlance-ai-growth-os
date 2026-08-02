---
id: OL-AI-SAFETY-README
document: ai/safety/README.md

title: Open Lance AIOS Safety Namespace Guide

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
  - Any AI agent that executes a task
  - Any contributor to the Safety namespace

provenance:
  - Derived from ai/README.md and ai/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how safety is documented. It establishes the standard structure,
  derivation rules, invariants, and boundaries every safety document under
  ai/safety/ must follow, and it owns safety extensibility and provider
  neutrality. It owns how safety architecture is documented, and owns no
  governance rule, no runtime execution, no reasoning, no retrieval, no memory,
  no prompt, and no implementation.
---

# Open Lance AIOS Safety Namespace Guide

This document is the guide for the Safety namespace at ai/safety/. The Safety namespace owns one thing: the protective architecture of the AI Operating System. It defines how hazards are identified, how risk is classified, how impact is assessed, how boundaries are enforced, and how the AI refuses, escalates, or degrades to stay safe, so that the AI acts only within safe limits. It owns no governance rule, no runtime execution, no reasoning, no retrieval, no memory, no prompt, no provider, no model, no tool, no evaluation, no operations, and no business truth.

This guide derives its authority from the AI constitution at ai/README.md and the contribution process at ai/CONTRIBUTING.md, and it operates under the governance mandates at ai/governance/. Safety is a foundational service of the AI layer that other namespaces build on: it sits at the Specification authority level defined in ai/README.md, applying the rules governance sets, referencing the business truth the knowledge repository owns, and consumed by the runtime, agents, tools, and other namespaces to keep action safe. Where this guide and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

# Purpose

This document owns exactly one thing: how safety architecture is documented within the AI layer. It is the single guide for the Safety namespace, and every safety document follows it.

The Safety namespace exists so that protection is a defined, governed, deterministic, technology-neutral architecture, rather than an emergent or ad hoc behavior. It defines what safety means and how the AI stays safe; it never executes, never reasons, never retrieves, never composes a prompt, and never owns the rules it applies or the truth it references. Safety is protective architecture that other namespaces consume; it performs none of their work.

This guide owns no safety model itself, no governance rule, and no business truth. The safety model is owned by the member documents of this namespace; the rules that govern the AI are owned by ai/governance/; business truth is owned by the knowledge repository.

# Mission

The mission of the Safety namespace is to define, once and permanently, the protective architecture that keeps every AI action within safe limits: identifying hazards before they cause harm, classifying and assessing their risk and impact, enforcing the boundaries that contain them, and refusing, escalating, or degrading safely when an action cannot be confirmed safe. Safety fails closed, so that when safety is uncertain, the AI protects rather than proceeds.

# Scope

This guide governs the Safety namespace. It defines the standard structure a safety document uses, the rules for writing one, the invariants every safety document upholds, the boundaries a safety document must respect, and how the namespace grows. It owns safety extensibility, the additive way the safety model gains new concerns over time, and safety provider neutrality, the permanent independence of safety architecture from any provider, model, framework, runtime, or language.

The namespace owns the safety model of the AI layer: the safety principles, risk classification, hazard identification, boundary enforcement, refusal, escalation, impact assessment, uncertainty management, safe degradation, and safety versioning. Each concern is owned by its own document, created under this guide.

# Safety Philosophy

Safety is protective architecture, layered and deterministic. Its philosophy is constant across the life of the AI layer.

- Protection before action. No action proceeds where safety cannot confirm it is within safe limits.
- Fail closed. When safety is uncertain, the AI refuses, escalates, or degrades, never proceeds by default.
- Defense in depth. Protection is layered across hazard identification, risk classification, impact assessment, boundary enforcement, refusal, escalation, and degradation, so that no single failure removes protection.
- Least harm. Where harm cannot be wholly avoided, the safest available course, causing the least harm, is taken.
- Uncertainty first. Uncertainty is surfaced and treated as a safety signal, never hidden inside a confident action.
- Human accountability. Safety escalates to accountable humans for the matters the constitution reserves to them, and never substitutes its own judgment for theirs.

# Design Principles

- One protective concern per document, with exactly one owner.
- Safety defines protection; it never performs the work of the namespace it protects.
- Safety applies governance rules and references business truth, and owns neither.
- Safety is deterministic: the same hazard and context yield the same protective response.
- Safety is stated independently of any provider, model, framework, runtime, or language, so it endures as those change.

# Safety Identity

Safety is the protective layer of the AI layer, and it is not any of the following.

- Safety is not governance. Governance owns the mandates, permissions, autonomy bounds, and escalation triggers; safety applies them as protective architecture and never defines them. The rules are owned by ai/governance/.
- Safety is not the runtime. The runtime executes and enforces at run time; safety defines the protective model the runtime applies. Safety never executes, orchestrates, or schedules; those are owned by ai/runtime/.
- Safety is not reasoning, retrieval, memory, or prompts. Those namespaces reason, determine knowledge, retain context, and express instructions; safety protects the actions they inform. Safety performs none of their work.
- Safety is not agents, providers, or tools. Agents act, providers abstract models, and tools act externally; safety bounds them. Safety never acts, abstracts a model, or performs a tool action.
- Safety is not evaluation or operations. Evaluation judges output and operations runs the layer; safety protects action. Those are owned by the Evaluation and Operations namespaces.
- Safety is not knowledge. Business truth, including what is sensitive, private, or legally significant, is owned by the knowledge repository. Safety references it and never owns, restates, or defines it.
- Safety is not implementation. It defines the protective model, never a mechanism, a framework, a provider, a model, or code.

# Namespace Relationships

Safety relates to the rest of the AI layer as a foundational protective service that consumes rules and truth and is consumed for protection.

- Governance. Safety applies the mandates, risk governance, permissions, autonomy bounds, and escalation triggers owned by ai/governance/, and never defines them. Governance is the higher authority; safety is its protective application.
- Runtime. The runtime consumes safety to keep execution within safe limits and enforces safety at run time; safety defines the protective model and never executes.
- Agents. Agents are bounded by safety: their capabilities, permissions, and autonomy are protected by safety, which never defines an agent.
- Reasoning, Retrieval, Memory, Prompts. Safety protects the actions these namespaces inform, identifying the hazards each can introduce, and owns none of their behavior.
- Providers and Tools. Providers abstract models and tools act externally; both are bounded and, for Tools, built on safety, which they consume and safety never performs.
- Evaluation and Operations. Evaluation judges output and operations runs the layer; safety protects action and is referenced by both, owning neither.
- Knowledge. Safety references the knowledge repository for what is sensitive, private, and consequential, consuming it one-directionally and never owning or restating it.

# Safety Invariants

These invariants are permanent. Every safety document upholds them, and no safety may violate them.

- Safety fails closed. Where safety cannot confirm an action is within safe limits, the AI refuses, escalates, or degrades, never proceeds by default.
- Safety is deterministic. The same hazard, the same context, and the same governing rules yield the same protective response, with no randomness.
- Safety is layered. Protection is defense in depth across identification, classification, impact, enforcement, refusal, escalation, and degradation, so no single failure removes protection.
- Safety protects; it never performs. Safety identifies, classifies, bounds, refuses, escalates, and degrades, and never executes, reasons, retrieves, composes, or persists.
- Safety consumes rules and truth; it owns neither. Safety applies the rules owned by ai/governance/ and references the truth owned by the knowledge repository.
- Safety surfaces uncertainty. Uncertainty is made explicit and treated as a protective signal, never hidden.
- Safety escalation is bounded and acyclic. No infinite escalation and no circular escalation are possible.
- Safety is single-owned, provider-neutral, and scalable. Each safety concern has exactly one owning document, and the model holds for one action or an entire enterprise of agents.

# Safety Document Standard

Every safety document under ai/safety/ uses the following standard structure. This section defines the template only. It defines no actual safety model. The inventory at ai/safety/safety.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The safety concern the document owns.
- Principles. The enduring principles for the concern, instantiating ai/README.md and the safety invariants.
- Specification. The technology-neutral safety model itself: the principles, risk classification, hazard identification, boundary enforcement, refusal, escalation, impact assessment, uncertainty management, degradation, or versioning the document owns.
- Invariants. The safety invariants that always hold for the concern.
- Boundaries. What the document does not own, with each excluded concern referenced to its canonical owner.
- Related Knowledge. Canonical repository paths the document references, within ai/ and, for consumption, into knowledge/.

A safety document may add a section only when a genuine safety concern requires it, following ai/CONTRIBUTING.md, and never to move a governance rule, business truth, runtime execution, or the behavior of another namespace into this namespace.

# Metadata Standard

Every safety document carries the full constitutional metadata defined in ai/CONTRIBUTING.md: a unique immutable id, document path, title, version, status, document_type, authority, owner, reviewed_by, last_updated, depends_on, used_by, provenance, loading_priority, and summary. The id follows the pattern for this namespace, and authority is Process for this guide, Reference for the inventory, and Specification for every member document.

# Documentation Rules

A safety document records one aspect of the safety model, and nothing more.

- A safety document never restates a governance rule, business truth, a runtime behavior, a reasoning model, a retrieval model, a memory model, or a prompt. It references ai/governance/, the knowledge repository, ai/runtime/, ai/reasoning/, ai/retrieval/, ai/memory/, and ai/prompts/ by canonical path.
- A safety document never specifies a mechanism, a framework, a provider, a model, or code.
- A safety document defines the protective model, never how protection is executed or implemented.
- Everything a safety document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Consumption of the knowledge repository is one-directional. Relative links are never used.

# Boundaries

Each concern has exactly one owner. Safety owns protective architecture. Governance owns rules. The runtime executes. Reasoning reasons. Retrieval determines knowledge. Memory retains context. Prompts express. Agents act. Providers abstract models. Tools act externally. Evaluation judges output. Operations runs the layer. The knowledge repository owns truth. A safety document owns only its own aspect of the safety model. It owns none of the following.

- The Authority Hierarchy, boundary, principles, and lifecycle rules: ai/README.md.
- The contribution, amendment, and certification process: ai/CONTRIBUTING.md.
- The mandates, risk governance, permissions, autonomy bounds, and escalation triggers: ai/governance/.
- Business truth, including what is sensitive, private, and consequential: the knowledge repository.
- Execution, orchestration, and run-time enforcement: ai/runtime/.
- Reasoning, retrieval, memory, prompts, agents, providers, tools, evaluation, and operations: their namespaces.
- The maps of the AI layer: ai/architecture/.

A safety document references all of the above and owns none of it. It records only the durable, technology-neutral safety model.

# Loading Guidance

Safety is loaded at the Contextual tier defined in ai/README.md, when a task touches sensitive data or a sensitive action, and it is elevated to the Required tier when an action is being governed, as recorded in ai/architecture/loading-map.md. This guide and the inventory are loaded first, for navigation; the member documents are loaded when the situation calls for them. The applied, task-level loading guidance is owned by ai/architecture/loading-map.md; this section states intent only and defines no runtime loading behavior.

# Repository Growth

New safety knowledge is added by creating new safety documents under ai/safety/, each following the Safety Document Standard and owning a single concern. The namespace grows only when a genuinely new safety concern arises. The structure defined by this guide never changes as the namespace grows, existing documents never change identity, and growth is always additive. This safety extensibility lets the safety model gain new hazard categories, protective responses, or concerns over decades, and scale across an entire enterprise of agents, without redesign, and it is owned here.

# Document Governance

- This is a normative document, at the Process authority level defined in ai/README.md, and it governs the Safety namespace only.
- It does not create constitutional authority. It derives its authority from ai/README.md and ai/CONTRIBUTING.md and operates under the mandates at ai/governance/. Where this guide and a higher-authority document differ, the higher-authority document governs.
- The inventory at ai/safety/safety.md declares the Reference authority level. Every safety-model member document declares the Specification authority level.
- Safety documents follow the standard and rules defined here, conform to the governance mandates, and consume business truth by reference. A safety document that conflicts with any of these is corrected to conform.
- Changes to this guide require approval and must follow the amendment process defined in ai/CONTRIBUTING.md, including the emergency amendment path for urgent safety corrections.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/governance/README.md
- ai/runtime/README.md
- knowledge/README.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Safety documents. The safety-model member documents of this namespace are created together with this guide, following it and ai/CONTRIBUTING.md.
- Position in the layer. Safety is a foundational service that other namespaces build on: it applies governance rules and references business truth, and it is consumed by the runtime, agents, tools, and other namespaces to keep action safe. It owns the protective model only, and never the layers it protects.
- Maturity. When this namespace is complete and frozen, its maturity in ai/architecture/repository-evolution.md advances from Planned to Complete, recorded there through the amendment process.
