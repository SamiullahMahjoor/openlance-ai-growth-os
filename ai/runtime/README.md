---
id: OL-AI-RUNTIME-README
document: ai/runtime/README.md

title: Open Lance AIOS Runtime Namespace Guide

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
  - Any contributor to the Runtime namespace

provenance:
  - Derived from ai/README.md and ai/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how the AI runtime is documented. It establishes the standard
  structure, derivation rules, invariants, and boundaries every runtime
  document under ai/runtime/ must follow. It owns how execution is
  documented, and owns no governance rule, no business truth, no operational
  behavior, and no implementation.
---

# Open Lance AIOS Runtime Namespace Guide

This document is the guide for the Runtime namespace at ai/runtime/. The Runtime namespace owns execution: how an AI task is initialized, loaded, validated, run, monitored, recovered, and finalized. It is the kernel of the AI Operating System. It owns only how execution happens, and owns no governance rule, no business truth, no operational behavior, and no implementation.

This guide derives its authority from the AI constitution at ai/README.md and the contribution process at ai/CONTRIBUTING.md, and it operates under the governance mandates at ai/governance/. Runtime sits at the Specification authority level defined in ai/README.md: its documents define the technology-neutral execution model every runtime must satisfy. Where this guide and a higher-authority document differ, the higher-authority document governs. Governance mandates bind execution, and on any matter of business truth the knowledge repository governs.

# Purpose

This document owns exactly one thing: how the runtime is documented within the AI layer. It is the single guide for the Runtime namespace, and every runtime document follows it.

The Runtime namespace exists so that every AI execution follows one defined, governed, technology-neutral model, from initialization to finalization, independent of any provider, model, framework, or runtime system. It defines the execution model; it never carries it out, and it never decides the rules that bound it.

This guide owns no execution model itself, no governance rule, and no business truth. The execution model is owned by the member documents of this namespace; the rules that govern execution are owned by ai/governance/; business truth is owned by the knowledge repository.

# Scope

This guide governs the Runtime namespace. It defines the standard structure a runtime document uses, the rules for writing one, the invariants every runtime document upholds, the boundaries a runtime document must respect, and how the namespace grows.

The namespace owns the execution model of the AI layer: the execution and session lifecycles, the execution states and transitions, the execution workflow and its order, context assembly, knowledge-loading orchestration, the validation sequence, execution boundaries, failure and recovery, and the lifecycle events. Each concern is owned by its own document, created under this guide.

# Runtime Identity

Runtime is the execution kernel of the AI layer, and it is not any of the following.

- Runtime is not governance. The rules that bound execution, including validation rules, permissions, policies, risk, escalation, and autonomy, are owned by ai/governance/. Runtime enforces those rules in a defined order; it never defines them and never invents them.
- Runtime is not knowledge. Business truth is owned by the knowledge repository. Runtime orchestrates the loading of knowledge and assembles it into context; it never owns, restates, or decides truth.
- Runtime is not architecture. The maps of the AI layer are owned by ai/architecture/. Runtime is mapped by them; it does not own a map.
- Runtime is not operational behavior. Reasoning, agent behavior, memory persistence, retrieval, prompt construction, provider abstraction, model selection, and tool execution are owned by their namespaces. Runtime sequences and combines their results; it never performs their work.
- Runtime is not implementation. It defines the execution model, never a provider, model, framework, language, runtime system, protocol, interface, or code.

A runtime document answers only how one aspect of execution happens. Its knowledge is durable, technology-neutral, and independent of any provider, model, or system, so it remains valid as those change.

# Runtime Invariants

These invariants are permanent. Every runtime document upholds them, and no execution may violate them.

- Governance precedes execution. Every significant action is validated against governance before it runs, in the order the runtime defines and the rules governance owns.
- Every execution has a defined lifecycle. An execution has a defined beginning and end, and it always reaches a terminal state and releases its resources.
- Execution owns no truth, rule, or behavior. Execution consumes rules from governance, truth from the knowledge repository, and behavior from the operational namespaces, and owns none of them.
- Execution stays within its grant. An execution acts only within the permissions and autonomy granted to it, as owned by ai/governance/, and never expands them.
- Failure is handled safely. Every failure resolves to a defined outcome of retry, recovery, or termination, and whether execution may continue, escalate, or refuse is decided by governance.
- Execution is observable. Every execution emits the defined lifecycle events, so it can be followed and reviewed.
- Runtime changes nothing at execution time. Execution never changes ownership, authority, governance, or the knowledge repository.
- Execution scales independently. One execution and many millions of concurrent executions follow the same model, without redesign.

# Runtime Document Standard

Every runtime document under ai/runtime/ uses the following standard structure. This section defines the template only. It defines no actual model. The inventory at ai/runtime/runtime.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The execution concern the document owns.
- Principles. The enduring principles for the concern, instantiating ai/README.md and the runtime invariants.
- Specification. The technology-neutral execution model itself: the lifecycle, states, order, assembly, sequence, boundaries, recovery, or events the document owns.
- Invariants. The execution invariants that always hold for the concern.
- Boundaries. What the document does not own, with each excluded concern referenced to its canonical owner.
- Related Knowledge. Canonical repository paths the document references, within ai/ and, for consumption, into knowledge/.

A runtime document may add a section only when a genuine execution concern requires it, following ai/CONTRIBUTING.md, and never to move a governance rule, business truth, or operational behavior into this namespace.

# Documentation Rules

A runtime document records one aspect of the execution model, and nothing more.

- A runtime document never restates a governance rule, a business fact, an architecture map, or an operational behavior. It references ai/governance/, the knowledge repository, ai/architecture/, and the operational namespaces by canonical path.
- A runtime document never specifies a provider, model, framework, language, runtime system, protocol, interface, or code.
- A runtime document never defines a governance rule, a decision, a policy, a risk threshold, a permission, a reasoning method, a prompt, or a tool. It defines only the execution model.
- Everything a runtime document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Consumption of the knowledge repository is one-directional. Relative links are never used.

# Boundaries

Each concern has exactly one owner, and the layers never overlap. Runtime owns execution. Governance owns rules. Knowledge owns truth. Architecture owns maps. Agents own behavior. Memory owns persistence. Retrieval owns finding knowledge. Prompts own prompt construction. Reasoning owns reasoning. Providers own provider abstraction. Tools own tool execution. A runtime document owns only its own aspect of the execution model. It owns none of the following.

- The Authority Hierarchy, boundary, principles, and lifecycle rules: ai/README.md.
- The contribution, amendment, and certification process: ai/CONTRIBUTING.md.
- The rules that govern execution: ai/governance/.
- The maps of the AI layer: ai/architecture/.
- Business truth: the knowledge repository.
- Reasoning, agents, memory, retrieval, prompts, providers, and tools: their operational namespaces, once created.

A runtime document references all of the above and owns none of it. It records only the durable, technology-neutral execution model.

# Loading Guidance

The core execution model, including the lifecycles, the workflow, context loading, knowledge resolution, and the validation pipeline, is loaded at the Critical tier defined in ai/README.md, because every execution follows it. The states and execution boundaries are loaded at the Required tier, and failure recovery and the event lifecycle at the Contextual tier. This guide and the inventory are loaded at the Required tier for navigation. The applied, task-level loading guidance is owned by ai/architecture/loading-map.md; this section states intent only and defines no runtime loading behavior.

# Repository Growth

New runtime knowledge is added by creating new runtime documents under ai/runtime/, each following the Runtime Document Standard and owning a single concern. The namespace grows only when a genuinely new execution concern arises. The structure defined by this guide never changes as the namespace grows, existing documents never change identity, and growth is always additive.

# Document Governance

- This is a normative document, at the Process authority level defined in ai/README.md, and it governs the Runtime namespace only.
- It does not create constitutional authority. It derives its authority from ai/README.md and ai/CONTRIBUTING.md and operates under the mandates at ai/governance/. Where this guide and a higher-authority document differ, the higher-authority document governs.
- The inventory at ai/runtime/runtime.md declares the Reference authority level. Every execution-model member document declares the Specification authority level, because it defines a technology-neutral contract every runtime must satisfy.
- Runtime documents follow the standard and rules defined here, conform to the governance mandates, and consume business truth by reference. A runtime document that conflicts with any of these is corrected to conform.
- Changes to this guide require approval and must follow the amendment process defined in ai/CONTRIBUTING.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/governance/README.md
- ai/architecture/README.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Runtime documents. The execution-model member documents of this namespace are created together with this guide, following it and ai/CONTRIBUTING.md.
- Operational namespaces it orchestrates. Runtime sequences and combines the results of the Reasoning, Agents, Memory, Retrieval, Prompts, Providers, and Tools namespaces, which are created later. Until then, references to them are intentional forward references, and runtime owns none of their behavior.
- Maturity. When this namespace is complete and frozen, its maturity in ai/architecture/repository-evolution.md advances from Planned to Complete, recorded there through the amendment process.
