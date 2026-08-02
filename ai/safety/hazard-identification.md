---
id: OL-AI-SAFETY-HAZARD-IDENTIFICATION
document: ai/safety/hazard-identification.md

title: Open Lance AIOS Hazard Identification

version: 1.0
status: Frozen

document_type: normative
authority: Specification

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/safety/README.md
  - ai/safety/safety.md
  - knowledge/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Safety namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the hazard model: hazard discovery and hazard categories across
  capability, knowledge, permission, reasoning, runtime, prompt, agent, and
  compound hazards. It owns the hazard model only, and defers the classification
  of a hazard's risk and the business truth it concerns to their owners.
---

# Open Lance AIOS Hazard Identification

This document owns the hazard model. It is a safety document at the Specification authority level defined in ai/README.md, and it follows the Safety Document Standard in ai/safety/README.md. It instantiates the safety invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the hazard model only. It never defines the classification of a hazard's risk, owned by ai/safety/risk-classification.md, and it never defines the business truth a knowledge hazard concerns, owned by the knowledge repository.

# Purpose

This document owns one safety concern: how the AI identifies the hazards that could cause harm, and the categories they fall into. It exists so that any human or AI agent can determine what could go wrong before it does, independent of how the resulting risk is classified.

# Principles

These are the enduring principles for hazard identification. Each instantiates a safety invariant owned by ai/safety/README.md.

- Hazards are identified before they cause harm. The AI surfaces what could cause harm ahead of an action, so protection precedes it.
- Hazards are categorized. Every hazard falls into a defined category, so it can be reasoned about and classified consistently.
- No hazard is hidden. An identified hazard is made explicit and never suppressed, so protection is not silently removed.
- Hazards compound. Hazards that combine into a greater hazard are identified as such, so compound harm is not missed.

# Specification

Hazards are identified and categorized in the following way. This document owns the hazard model; the classification of a hazard's risk is owned by ai/safety/risk-classification.md, and the business truth a knowledge hazard concerns is owned by the knowledge repository.

- Hazard discovery. Before and during an action, the AI surfaces the ways it could cause harm, drawing on the impact model owned by ai/safety/impact-assessment.md. Discovery makes hazards explicit; it never classifies their risk or enforces a boundary.
- Hazard categories. Every hazard falls into one of the following architectural categories, each naming a source of potential harm within the AI layer.
  - Capability hazard. A hazard arising from what an agent is able to do, defined by the capabilities owned by ai/agents/agent-capabilities.md.
  - Knowledge hazard. A hazard arising from the business truth an action concerns, including sensitive, private, or consequential knowledge, whose definition is owned by the knowledge repository and never restated here.
  - Permission hazard. A hazard arising from the authority an agent holds, including excess or misused authority, defined by the permissions owned by ai/agents/agent-permissions.md and the rules owned by ai/governance/permission-governance.md.
  - Reasoning hazard. A hazard arising from a flaw or uncertainty in reasoning, whose cognitive uncertainty is owned by ai/reasoning/uncertainty-handling.md.
  - Runtime hazard. A hazard arising from execution, orchestration, or failure, whose execution is owned by ai/runtime/.
  - Prompt hazard. A hazard arising from a composed instruction, including one that would embed truth or exceed bounds, whose composition is owned by ai/prompts/.
  - Agent hazard. A hazard arising from an agent as an actor, including coordination or delegation, whose model is owned by ai/agents/.
  - Compound hazard. A hazard formed when two or more hazards combine into a greater one, which this document identifies as a distinct hazard so that combined harm is not missed.
- Categorization, not classification. This document places a hazard into a category; how much risk it carries is classified by ai/safety/risk-classification.md, and how it is contained is owned by ai/safety/boundary-enforcement.md.

Hazard identification surfaces and categorizes what could cause harm; the risk it carries and its containment are owned elsewhere. Identification is deterministic and the same at any scale, and the categories may be extended additively under this document as the AI layer grows.

# Invariants

- Every identified hazard falls into exactly one category, and compound hazards are identified as distinct hazards.
- A hazard is surfaced before an action proceeds and is never hidden or suppressed.
- Hazard identification categorizes a hazard and never classifies its risk or enforces a boundary.
- A knowledge hazard references business truth by its canonical owner and never restates it.
- Identifying a hazard never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the hazard model only. It owns none of the following, and references each by its canonical owner.

- The classification of a hazard's risk: ai/safety/risk-classification.md.
- The assessment of a hazard's impact: ai/safety/impact-assessment.md.
- The containment or isolation of a hazard: ai/safety/boundary-enforcement.md.
- The capabilities, permissions, reasoning, runtime, prompts, and agents the hazard categories concern: their namespaces.
- The business truth a knowledge hazard concerns: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/safety/README.md
- ai/safety/safety.md
- ai/safety/risk-classification.md
- ai/safety/impact-assessment.md
- ai/safety/boundary-enforcement.md
- ai/agents/agent-capabilities.md
- ai/agents/agent-permissions.md
- knowledge/README.md
