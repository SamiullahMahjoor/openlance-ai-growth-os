---
id: OL-AI-TOOLS-README
document: ai/tools/README.md

title: Open Lance AIOS Tools Namespace Guide

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
  - Any contributor to the Tools namespace

provenance:
  - Derived from ai/README.md and ai/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how tools are documented. It establishes the standard structure,
  derivation rules, invariants, and boundaries every tool document under
  ai/tools/ must follow, and it owns tool extensibility and provider neutrality.
  It owns how the tool system is documented, and owns no reasoning, no
  governance rule, no safety rule, no runtime execution, no provider, and no
  implementation.
---

# Open Lance AIOS Tools Namespace Guide

This document is the guide for the Tools namespace at ai/tools/. The Tools namespace owns one thing: the architectural model of the tool system. It defines what a tool is as an architectural capability through which an agent interacts with something outside its own reasoning, how a tool is identified, declared, selected, executed, validated, composed, and evolved, so that acting through a tool is defined, governed, deterministic, and bounded. It owns no reasoning, no prompt, no retrieval, no memory, no provider, no runtime execution, no governance rule, no safety rule, no evaluation, no operations, no evolution of the layer, and no business truth. A tool performs no reasoning, makes no decision, holds no permission, and owns no intelligence.

This guide derives its authority from the AI constitution at ai/README.md and the contribution process at ai/CONTRIBUTING.md, and it operates under the governance mandates at ai/governance/ and the protective architecture at ai/safety/. A tool sits at the Specification authority level defined in ai/README.md, composed by an agent to act, executed by the runtime, permitted by governance, and bounded by safety. Where this guide and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

# Purpose

This document owns exactly one thing: how the tool system is documented within the AI layer. It is the single guide for the Tools namespace, and every tool document follows it.

The Tools namespace exists so that acting through a tool is a defined, governed, deterministic, technology-neutral capability, rather than an ad hoc or unbounded action. It defines what a tool is and how a tool is chosen, executed, validated, and composed; it never reasons, never decides, never orchestrates, never schedules, and never owns the rules it obeys or the intelligence behind an action. A tool is the boundary at which the AI reaches outside its own reasoning, and it does so only within governance and safety.

This guide owns no tool model itself, no governance rule, no safety rule, and no business truth. The tool model is owned by the member documents of this namespace; the rules that govern the AI are owned by ai/governance/; protection is owned by ai/safety/; business truth is owned by the knowledge repository.

# Scope

This guide governs the Tools namespace. It defines the standard structure a tool document uses, the rules for writing one, the invariants every tool document upholds, the boundaries a tool document must respect, and how the namespace grows. It owns tool extensibility, the additive way the tool model gains new concerns over time, and tool provider neutrality, the permanent independence of the tool model from any provider, model, framework, runtime, protocol, or language.

The namespace owns the tool model of the AI layer: the tool architecture and identity, lifecycle, capabilities, selection, execution, validation, composition, compatibility, boundaries, and versioning. Each concern is owned by its own document, created under this guide.

# Tool Identity

A tool is the external-interaction capability of the AI layer, and it is not any of the following.

- A tool is not reasoning. Reasoning transforms retrieved knowledge into conclusions; a tool is invoked to interact with something outside that reasoning. A tool performs no reasoning and makes no decision; those are owned by ai/reasoning/.
- A tool is not an agent. An agent composes a tool as a capability to act; a tool is composed, never an actor. Agents are owned by ai/agents/.
- A tool is not the runtime. The runtime orchestrates, schedules, and executes; a tool defines what an external interaction is, and is carried out by the runtime. A tool never orchestrates, schedules, or executes itself; those are owned by ai/runtime/.
- A tool is not a provider. A provider is the abstraction over a source of intelligence; a tool is the abstraction over an external interaction. An agent composes both, and neither is the other; providers are owned by ai/providers/.
- A tool is not prompts, memory, or retrieval. Those express, retain, and determine knowledge; a tool acts outside them. A tool performs none of their work.
- A tool is not governance or safety. Governance owns the rules and safety owns protection; a tool is permitted, validated, and bounded by them, and defines neither. A tool holds no permission and no policy.
- A tool is not knowledge. Business truth is owned by the knowledge repository. A tool carries no truth and never owns, restates, or becomes it, and it produces no intelligence of its own.
- A tool is not implementation. It defines the tool model, never a provider, a model, a framework, a protocol, an interface, a network, or code.

A tool document answers only how one aspect of the tool model works. Its knowledge is durable, technology-neutral, and independent of any provider, model, framework, runtime, or protocol, so it remains valid as those change.

# Tool Invariants

These invariants are permanent. Every tool document upholds them, and no tool may violate them.

- A tool is an architectural capability for external interaction, never an actor, a reasoner, or an implementation.
- A tool is uniquely identified and declares its capabilities, so it can be selected, composed, and validated deterministically.
- A tool performs no reasoning and makes no decision; it interacts with something outside reasoning.
- A tool holds no permission and no policy. A tool is used only where an agent is permitted under ai/governance/ and within the limits owned by ai/safety/.
- A tool is validated before execution, and it never executes when validation fails.
- Tool selection, composition, and execution ordering are deterministic and bounded. No unbounded composition and no execution cycle are possible.
- A tool is executed by the runtime; it never orchestrates, schedules, or executes itself, and it owns no intelligence.
- A tool is single-owned, technology-neutral, and scalable. Each tool concern has exactly one owning document, and the model holds for one tool or many thousands.

# Tool Document Standard

Every tool document under ai/tools/ uses the following standard structure. This section defines the template only. It defines no actual tool model. The inventory at ai/tools/tools.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The tool concern the document owns.
- Principles. The enduring principles for the concern, instantiating ai/README.md and the tool invariants.
- Specification. The technology-neutral tool model itself: the architecture, lifecycle, capabilities, selection, execution, validation, composition, compatibility, boundaries, or versioning the document owns.
- Invariants. The tool invariants that always hold for the concern.
- Boundaries. What the document does not own, with each excluded concern referenced to its canonical owner.
- Related Knowledge. Canonical repository paths the document references, within ai/ and, for consumption, into knowledge/.

A tool document may add a section only when a genuine tool concern requires it, following ai/CONTRIBUTING.md, and never to move reasoning, a governance rule, a safety rule, runtime execution, a provider, or business truth into this namespace.

# Documentation Rules

A tool document records one aspect of the tool model, and nothing more.

- A tool document never restates reasoning, a governance rule, a safety rule, a runtime behavior, a provider model, a prompt, a retrieval model, or a memory model. It references ai/reasoning/, ai/governance/, ai/safety/, ai/runtime/, ai/providers/, ai/prompts/, ai/retrieval/, and ai/memory/ by canonical path.
- A tool document never names a provider, a model, a framework, a language, a runtime, a protocol, an interface, or a network, and never contains code.
- A tool document defines the tool model, never how a tool is implemented, networked, or executed, and never the intelligence or the outside system behind an interaction.
- Everything a tool document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Consumption of the knowledge repository is one-directional. Relative links are never used.

# Boundaries

Each concern has exactly one owner. Tools own the external-interaction capability. Reasoning reasons. Agents act. The runtime executes. Governance owns rules. Safety protects. Providers abstract intelligence. Prompts express. Retrieval determines knowledge. Memory retains context. Evaluation judges output. Operations runs the layer. The knowledge repository owns truth. A tool document owns only its own aspect of the tool model. It owns none of the following.

- The Authority Hierarchy, boundary, principles, and lifecycle rules: ai/README.md.
- The contribution, amendment, and certification process: ai/CONTRIBUTING.md.
- The mandates, permissions, and change governance: ai/governance/.
- The protective architecture, hazards, boundaries, and refusal: ai/safety/.
- Business truth: the knowledge repository.
- Execution, orchestration, scheduling, and run-time invocation of a tool: ai/runtime/.
- Reasoning, prompts, retrieval, memory, providers, agents, evaluation, and operations: their namespaces.
- The maps of the AI layer: ai/architecture/.

A tool document references all of the above and owns none of it. It records only the durable, technology-neutral tool model.

# Loading Guidance

Tools are loaded at the Contextual tier defined in ai/README.md, when a task uses a tool, and are elevated to the Required tier when a task acts through a tool, as recorded in ai/architecture/loading-map.md. This guide and the inventory are loaded first, for navigation; the member documents are loaded when the situation calls for them. The applied, task-level loading guidance is owned by ai/architecture/loading-map.md; this section states intent only and defines no runtime loading behavior.

# Repository Growth

New tool knowledge is added by creating new tool documents under ai/tools/, each following the Tool Document Standard and owning a single concern. The namespace grows only when a genuinely new tool concern arises. The structure defined by this guide never changes as the namespace grows, existing documents never change identity, and growth is always additive. This tool extensibility lets the tool model gain new capability, composition, or compatibility concerns over decades, and scale across many thousands of tools, without redesign, and it is owned here.

# Document Governance

- This is a normative document, at the Process authority level defined in ai/README.md, and it governs the Tools namespace only.
- It does not create constitutional authority. It derives its authority from ai/README.md and ai/CONTRIBUTING.md and operates under the mandates at ai/governance/ and the protection at ai/safety/. Where this guide and a higher-authority document differ, the higher-authority document governs.
- The inventory at ai/tools/tools.md declares the Reference authority level. Every tool-model member document declares the Specification authority level.
- Tool documents follow the standard and rules defined here, conform to the governance mandates and the safety architecture, and consume business truth by reference. A tool document that conflicts with any of these is corrected to conform.
- Changes to this guide require approval and must follow the amendment process defined in ai/CONTRIBUTING.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/governance/README.md
- ai/safety/README.md
- ai/agents/README.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Tool documents. The tool-model member documents of this namespace are created together with this guide, following it and ai/CONTRIBUTING.md.
- Position in the layer. A tool is composed by an agent to interact with something outside its reasoning, executed by the runtime, permitted by governance, and bounded by safety. It owns the external-interaction model only, and never the layers around it, nor the outside system behind an interaction.
- Distinction from providers. A tool abstracts an external interaction; a provider abstracts a source of intelligence. An agent composes both, and this namespace owns neither the other's concern.
- Maturity. When this namespace is complete and frozen, its maturity in ai/architecture/repository-evolution.md advances from Planned to Complete, recorded there through the amendment process.
