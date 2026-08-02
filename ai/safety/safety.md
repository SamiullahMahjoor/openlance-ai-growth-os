---
id: OL-AI-SAFETY-SAFETY
document: ai/safety/safety.md

title: Open Lance AIOS Safety Inventory

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
  - ai/safety/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Safety namespace

provenance:
  - Derived from ai/safety/README.md and the AI safety namespace

loading_priority: Required

summary: >
  The canonical inventory of the AI layer's safety concerns. It owns the identity
  and existence of each safety concern, and the safety determinism and
  scalability properties. It owns no safety model, no governance rule, and no
  business truth.
---

# Open Lance AIOS Safety Inventory

This document is the canonical inventory of the AI layer's safety concerns. It owns the identity of the Safety namespace and the list of safety concerns the namespace owns, so that any human or AI agent can determine, from one place, which safety concerns exist and which document owns each. It also owns the namespace-wide properties of determinism and scalability. It is a reference document and follows the inventory pattern, not the Safety Document Standard.

This inventory owns only identity, existence, and those namespace-wide properties. It states no safety model, no governance rule, and no business truth. How safety architecture is documented is owned by ai/safety/README.md. Each safety concern is owned by its own document. On any matter of business truth, the knowledge repository governs.

# Purpose

This document exists so that the set of the AI layer's safety concerns has a single canonical list, and so that the safety properties that hold across the whole namespace have one owner. It answers which safety concerns the namespace owns, which document owns each, and why protection is deterministic and scalable.

# Scope

This inventory lists every safety concern the namespace owns, and states the determinism and scalability of safety. Each concern is represented exactly once and has exactly one canonical entry, and the model of each concern is owned by that concern's own document.

# Safety Role

Safety is the protective layer of the AI Operating System. It is a foundational service at the Specification authority level, below the constitution and the governance mandates, that other namespaces build on: it applies the rules governance sets, references the business truth the knowledge repository owns, and is consumed by the runtime, agents, tools, and other namespaces to keep action within safe limits. Safety identifies hazards, classifies risk, assesses impact, enforces boundaries, and refuses, escalates, or degrades to stay safe, and owns none of the rules, truth, execution, or behavior it protects.

# Determinism

Safety is deterministic: the same hazard, the same context, and the same governing rules produce the same protective response, the same classification, the same enforcement, and the same refusal, escalation, or degradation. This holds because a safety response is a function of fixed inputs alone, the hazard identified, the impact and risk assessed, the rules owned by ai/governance/, and the truth referenced from the knowledge repository, with no randomness and no hidden step. Because safety fails closed, the same unconfirmed action yields the same protective outcome every time, so protection never varies between two identical situations.

# Scalability

Safety scales without redesign. The safety model protects a single action through a bounded, layered set of protective concerns, so it applies the same way whether the AI protects one action or every action of an enterprise of tens of thousands of agents. Because safety architecture is provider-neutral, the same safety model is portable across any provider, runtime, or orchestration system. Growth in the number of actions, agents, hazard categories, or protective responses is absorbed additively, without changing the safety model.

# Repository Ownership

The Safety namespace owns the protective architecture of the AI layer and nothing else. It owns the safety concerns listed below, each in exactly one document. It owns no governance rule, which is owned by ai/governance/; no business truth, which is owned by the knowledge repository; and no execution or behavior of another namespace, which each namespace owns. Every other namespace consumes safety; safety consumes only the constitution, the governance mandates, and the business truth it references.

# The Safety Concerns

The Safety namespace owns the following concerns. Each is owned by exactly one document. This list owns the identity of each concern; the model is owned by the named document.

## Safety Principles

- Document. ai/safety/safety-principles.md.
- Owns. The safety philosophy and principles: constitutional safety, least harm, defense in depth, safe failure, fail closed, and the other enduring principles of protection.
- Out of scope. The risk model, owned by ai/safety/risk-classification.md; the governance rules the principles apply, owned by ai/governance/.

## Risk Classification

- Document. ai/safety/risk-classification.md.
- Owns. The safety risk model: risk levels, categorization, confidence, escalation thresholds, risk boundaries, risk inheritance, and risk compatibility.
- Out of scope. The risk governance, categories, and tolerance, owned by ai/governance/risk-management.md; the impact dimensions, owned by ai/safety/impact-assessment.md.

## Hazard Identification

- Document. ai/safety/hazard-identification.md.
- Owns. The hazard model: hazard discovery and hazard categories across capability, knowledge, permission, reasoning, runtime, prompt, agent, and compound hazards.
- Out of scope. The classification of a hazard's risk, owned by ai/safety/risk-classification.md; the business truth a knowledge hazard concerns, owned by the knowledge repository.

## Boundary Enforcement

- Document. ai/safety/boundary-enforcement.md.
- Owns. The boundary enforcement model: constraint, policy, permission, and execution boundary application, cross-layer boundary protection, isolation, and containment.
- Out of scope. The boundaries themselves, owned by ai/governance/, ai/agents/, and ai/runtime/; the run-time enforcement, owned by ai/runtime/.

## Refusal Model

- Document. ai/safety/refusal-model.md.
- Owns. The refusal architecture: refusal categories, graceful, protective, constitutional, and escalation refusal, and recovery after refusal.
- Out of scope. The governed conditions that require refusal, owned by ai/governance/autonomy-boundaries.md; the escalation routing, owned by ai/safety/escalation-model.md.

## Escalation Model

- Document. ai/safety/escalation-model.md.
- Owns. The safety escalation model: escalation routing, priority, hierarchy, and compatibility.
- Out of scope. The escalation triggers and human-review conditions, owned by ai/governance/escalation.md.

## Impact Assessment

- Document. ai/safety/impact-assessment.md.
- Owns. The impact model: severity, likelihood, reversibility, propagation, scope, and human, organizational, and long-term impact.
- Out of scope. The classification of risk from impact, owned by ai/safety/risk-classification.md; the real-world consequences that define impact, owned by the knowledge repository.

## Uncertainty Management

- Document. ai/safety/uncertainty-management.md.
- Owns. The safety uncertainty model: confidence, unknowns, ambiguity, incomplete knowledge, conflict detection, safe handling, and escalation under uncertainty.
- Out of scope. The classification of uncertainty in reasoning, owned by ai/reasoning/uncertainty-handling.md; the escalation triggers, owned by ai/governance/escalation.md.

## Safe Degradation

- Document. ai/safety/safe-degradation.md.
- Owns. Graceful degradation: restricted operation, safe mode, capability reduction, controlled shutdown, and recovery compatibility.
- Out of scope. The refusal of an action, owned by ai/safety/refusal-model.md; the run-time that carries a degradation, owned by ai/runtime/.

## Safety Versioning

- Document. ai/safety/safety-versioning.md.
- Owns. Safety evolution, compatibility, migration, version rules, backward compatibility, deprecation, and constitutional amendment of safety.
- Out of scope. The document amendment workflow, owned by ai/CONTRIBUTING.md; the repository evolution map, owned by ai/architecture/repository-evolution.md.

# Boundaries

This inventory owns the identity and existence of the safety concerns, and the determinism and scalability of safety, only. It owns none of the following.

- How safety architecture is documented: ai/safety/README.md.
- The model of any safety concern: that concern's own document.
- The rules that govern the AI: ai/governance/.
- Business truth: the knowledge repository.
- The execution, reasoning, retrieval, expression, persistence, and behavior safety protects: ai/runtime/, ai/reasoning/, ai/retrieval/, ai/prompts/, ai/memory/, ai/agents/, and the Providers and Tools namespaces.
- The maps of the AI layer: ai/architecture/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/safety/README.md
- ai/architecture/ownership-map.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Growth of the inventory. As the AI layer comes to own a genuinely new and distinct safety concern, a new document is added under ai/safety/ following ai/safety/README.md, and this inventory gains an entry for it. The inventory grows additively and its structure does not change.
- New hazard categories and protective responses. The hazard categories and the protective responses may grow over time under ai/safety/hazard-identification.md and the response documents, additively and without redesign, and this inventory records only that the concern exists.
