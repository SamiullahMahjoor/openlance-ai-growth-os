---
id: OL-AI-GOVERNANCE-README
document: ai/governance/README.md

title: Open Lance AIOS Governance Namespace Guide

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

used_by:
  - AI Systems Architect
  - Every AI agent
  - All human governors
  - Any contributor to the Governance namespace

provenance:
  - Derived from ai/README.md and ai/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how AI governance is documented. It establishes the standard
  structure, derivation rules, invariants, and boundaries every governance
  document under ai/governance/ must follow. It owns how governance is
  documented, and owns no operational behavior, no runtime execution, no
  business knowledge, and no implementation.
---

# Open Lance AIOS Governance Namespace Guide

This document is the guide for the Governance namespace at ai/governance/. The Governance namespace defines the permanent governing rules every operational AI namespace must obey. It owns governance: the mandates, principles, and constraints that bound how the AI Operating System reasons, decides, and acts. It owns no operational behavior, no runtime execution, no prompts, no models, no business knowledge, and no implementation.

This guide derives its authority from the AI constitution at ai/README.md and the contribution process at ai/CONTRIBUTING.md, and applies them to the Governance namespace. Governance sits at the Mandate authority level defined in ai/README.md: its documents are the absolute constraints every AI action must satisfy, above every operational namespace and below only the Charter and the Principles. Where this guide and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs both layers.

# Purpose

This document owns exactly one thing: how AI governance is documented within the AI layer. It is the single guide for the Governance namespace, and every governance document follows it.

The Governance namespace exists so that every AI action derives from a single, consistent set of governing rules, and so that no operational namespace, agent, or runtime can act outside them. It defines the rules; it never carries them out.

This guide owns no governance rule itself, no operational behavior, and no business knowledge. The governance mandates are owned by the member documents of this namespace; operational behavior is owned by the operational namespaces; business truth is owned by the knowledge repository.

# Scope

This guide governs the Governance namespace. It defines the standard structure a governance document uses, the rules for writing one, the invariants every governance document upholds, the boundaries a governance document must respect, and how the namespace grows.

The namespace owns the governing rules of the AI layer: how decisions are governed, how actions are validated before execution, when and how work escalates, how humans oversee and remain accountable, how risk is governed, how permissions and autonomy are bounded, how policies are enforced, and how AI behavior is allowed to change. Each concern is owned by its own document, created under this guide.

# Governance Identity

Governance is the rule layer of the AI Operating System, and it is not any of the following.

- Governance is not the constitution. The Authority Hierarchy, the Metadata Standard, the boundary, the principles, and the lifecycle are owned by ai/README.md. Governance instantiates and enforces those rules; it never restates or overrides them.
- Governance is not operational behavior. Reasoning, planning, decision execution, orchestration, agents, memory, prompts, tools, providers, retrieval, and evaluation are owned by the operational namespaces. Governance sets the rules those namespaces obey; it never performs their work.
- Governance is not runtime execution. The runtime carries out actions; governance defines what actions are permitted and how they are validated. Documenting a rule is not executing it, and executing the runtime never grants any namespace the ability to change a rule.
- Governance is not business knowledge. Company, product, pricing, policy, brand, marketing, legal, customer, competitor, and process knowledge are owned by the knowledge repository. Governance consumes business truth by reference where a rule depends on it, and never restates it.
- Governance is not architecture. The maps of the AI layer are owned by ai/architecture/. Governance is mapped by them; it does not own a map.
- Governance is not implementation. It states rules and principles, never a provider, model, framework, language, runtime, protocol, interface, or code.

A governance document answers only what rule governs one concern. Its knowledge is durable, technology-neutral, and independent of any provider, model, runtime, or implementation, so it remains valid as those change.

# Relationship to the Constitution and Architecture

Governance derives downward and is mapped from the side. It derives its authority and its principles from the constitution at ai/README.md, and it operationalizes the constitution's governance principles as binding mandates. It is classified, positioned, and connected by the Architecture namespace at ai/architecture/, which records where governance sits and what it owns without owning any rule itself. Governance never depends on the Architecture namespace; the Architecture namespace references governance as data. The contribution, review, amendment, and certification of governance documents follow ai/CONTRIBUTING.md.

# Governance Invariants

These invariants are permanent. Every governance document upholds them, no operational namespace may weaken them, and no runtime behavior may change them.

- Human accountability never disappears. Every significant action traces to an accountable human, and automation never removes that accountability.
- Governance precedes execution. No significant action is taken before it is validated against governance.
- Policies precede runtime. The rules are defined before they are carried out, never discovered at execution time.
- Ownership never changes at runtime. What the runtime does never alters which namespace owns a concern or which document owns a rule.
- Authority cannot be bypassed. No namespace, agent, or runtime may act above or around the authority that governs it.
- Escalation is always valid. Halting and escalating to a human is always a permitted action and is never overridden by a goal.
- Nothing bypasses governance. Every operational namespace derives from governance, and no path exists that reaches execution without passing through it.

# Governance Principles

These principles bound every governance document. Lower documents instantiate them and never weaken them.

- Constitutional compliance. Every operational namespace derives from governance, and every significant action conforms to the AI constitution and the knowledge constitution before it proceeds.
- Safe failure. When an action is uncertain, unresolved, or unsupported by governance, the AI defaults toward refusal or escalation, never toward inventing a rule, a fact, or an outcome.
- Auditability. Every significant action remains explainable, traceable to its governing rule and its accountable owner, reviewable, and accountable, without this namespace defining any logging or recording system.
- Future-proofing. Governance remains valid regardless of provider, model, framework, runtime, language, or orchestration system, because it states rules, never implementations.
- Determinism. Two agents governed by the same rules reach the same governed outcome; governance is defined, never left to a model's tendencies.
- One owner per concern. Each governance concern is owned by exactly one document; no two governance documents own the same concern.

# Governance Document Standard

Every governance document under ai/governance/ uses the following standard structure. This section defines the template only. It defines no actual rule. The inventory at ai/governance/governance.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The governance concern the document owns.
- Principles. The enduring governance principles for the concern, instantiating ai/README.md.
- Mandates. The absolute rules every action must satisfy for the concern. These are binding.
- Responsibilities. The duties the concern assigns, by role, referencing human accountability.
- Boundaries. What the document does not own, with each excluded concern referenced to its canonical owner.
- Related Knowledge. Canonical repository paths the document references, within ai/ and, for consumption, into knowledge/.

A governance document may add a section only when a genuine governance concern requires it, following ai/CONTRIBUTING.md, and never to move operational behavior or business knowledge into this namespace.

# Documentation Rules

A governance document records one governing rule set, and nothing more.

- A governance document never restates a constitution rule, an operational behavior, an architecture map, or a business fact. It references ai/README.md, the operational namespaces, ai/architecture/, and the knowledge repository by canonical path.
- A governance document never specifies a provider, model, framework, language, runtime, protocol, interface, or code.
- A governance document never defines an algorithm, a score, a workflow, a prompt, or any executable procedure. It states the rule, never the mechanism.
- Everything a governance document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Consumption of the knowledge repository is one-directional. Relative links are never used.

# Boundaries

Each concern has exactly one owner, and the four layers never overlap. The knowledge repository owns truth. Governance owns the rules of AI behavior. The Architecture namespace owns the maps. The runtime and the operational namespaces own execution. A governance document owns only its own rule set. It owns none of the following.

- The Authority Hierarchy, Metadata Standard, boundary, principles, and lifecycle: ai/README.md.
- The contribution, amendment, and certification process: ai/CONTRIBUTING.md.
- The maps of the AI layer: ai/architecture/.
- All operational behavior, execution, and implementation: the operational namespaces and the runtime.
- All business knowledge: the knowledge repository.

A governance document references all of the above and owns none of it. It records only durable, technology-neutral governing rules.

# Loading Guidance

Governance is loaded before any significant action, at the Critical tier defined in ai/README.md, because its mandates bind every action. This guide and the inventory are loaded at the Required tier for navigation. The applied, task-level loading guidance is owned by ai/architecture/loading-map.md; this section states intent only and defines no runtime loading behavior.

# Repository Growth

New governance is added by creating new governance documents under ai/governance/, each following the Governance Document Standard and owning a single concern. The namespace grows only when a genuinely new governance concern arises. The structure defined by this guide never changes as the namespace grows, existing documents never change identity, and growth is always additive.

# Document Governance

- This is a normative document, at the Process authority level defined in ai/README.md, and it governs the Governance namespace only.
- It does not create constitutional authority. It derives its authority from ai/README.md and ai/CONTRIBUTING.md. Where this guide and a higher-authority document differ, the higher-authority document governs.
- The inventory at ai/governance/governance.md declares the Reference authority level. Every governing member document declares the Mandate authority level, because a governance mandate is an absolute constraint every action must satisfy.
- Governance documents follow the standard and rules defined here. A governance document that conflicts with them, or with the constitution, is corrected to conform.
- Changes to this guide require approval and must follow the amendment process defined in ai/CONTRIBUTING.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/architecture/README.md
- knowledge/company/legal.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Governance documents. The governing member documents of this namespace are created together with this guide, following it and ai/CONTRIBUTING.md.
- Dedicated audit and traceability documents. Auditability is upheld as a principle across the governance mandates, and the audit and traceability specifications anticipated in the AI ownership map at ai/architecture/ownership-map.md may be added later as additive governance documents, without changing this guide.
- Parallel to the knowledge legal namespace. This namespace holds for the AI layer the role that knowledge/legal/ holds for business truth: the enduring rules that bound what everything below may do. The two are independent, and governance consumes the knowledge repository by reference, never the reverse.
