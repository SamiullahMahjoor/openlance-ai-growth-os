---
id: OL-AI-ARCHITECTURE-LOADING-MAP
document: ai/architecture/loading-map.md

title: Open Lance AIOS Loading Map

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
  - ai/architecture/ownership-map.md

used_by:
  - AI Systems Architect
  - Any AI agent that navigates or loads the AI layer
  - Any AI agent that maintains or extends the AI layer
  - Any contributor to the Architecture namespace

provenance:
  - Derived from ai/README.md and the loading_priority metadata across the AI layer

loading_priority: Required

summary: >
  The derived guidance for which namespaces to load, and how often, for a
  given kind of task, so agents load the least they need. It owns the loading
  map only, and defers the loading tiers to the constitution and each
  document's own loading_priority to its front matter. It documents guidance
  only and defines no runtime loading algorithm.
---

# Open Lance AIOS Loading Map

This document owns the Loading Map for the AI layer: which namespaces to load, and how often, for a given kind of task. It is an architecture document within the Architecture namespace, and it follows the Architecture Document Standard defined in ai/architecture/README.md. Its identity in the inventory is owned by ai/architecture/architecture.md; this document owns the map only. The loading tiers it applies are owned by the AI Loading Strategy in ai/README.md, and each document's own loading_priority is authoritative. Where this document and a higher-authority document differ, the higher-authority document governs.

# Purpose

This document owns the derived guidance for loading. Its purpose is that an agent retrieves the smallest set of behavior a task requires, together with the higher-authority documents that govern it, rather than loading the whole layer or guessing.

# Scope

This map covers loading guidance at the namespace level, mapped to common kinds of task. It applies the loading tiers owned by ai/README.md; it does not define them, and it does not override any document's own loading_priority. It is documentation only. It prescribes no runtime loading algorithm, ordering, cache, or capacity budget, all of which are runtime concerns owned by the operational namespaces and executed outside every knowledge document.

# Derivation

This map is derived from, and references, the following authoritative sources, which it never restates.

- The AI Loading Strategy and its tiers, Critical, Required, Optional, and Contextual: ai/README.md.
- Each document's own loading_priority declaration.
- Where each behavior lives: ai/architecture/ownership-map.md.

# Map

Two rules from ai/README.md frame all loading, and this map applies them. Load from the top of the hierarchy downward, so the constitution and the governance mandates are loaded before any action. And load only what a task requires plus the higher-authority documents that govern it.

The following describes how often each namespace is loaded, expressed in the loading tiers of ai/README.md.

- Always loaded, at the Critical tier: the constitution, ai/README.md, and the Governance namespace, ai/governance/. These shape and bound every action and are loaded before any task.
- Usually loaded, at the Required tier for most acting tasks: the Runtime namespace for orchestration, the Reasoning namespace for how to think, the Retrieval namespace for getting knowledge into context, the Providers namespace for the model and provider abstraction, and the Agents namespace for the acting agent's definition.
- Loaded contextually, at the Contextual tier, when the task triggers them: the Memory namespace when a task spans turns or sessions, the Prompts namespace when composing instructions, the Tools namespace when a task uses tools, the Safety namespace when a task touches sensitive data or actions, and the Evaluation namespace when a task judges output.
- Rarely loaded, at the Optional tier: the Architecture namespace for navigation and maintenance, the Operations namespace for running the layer, and the Evolution namespace for growth and migration.

The following names the namespaces a common kind of task requires. Within each, load the namespace's guide and inventory to navigate, then the specific documents.

- Planning a task. Required: Reasoning for planning and decision making, Retrieval for the knowledge the plan depends on, Memory for prior context. Contextual: the business knowledge the plan concerns, consumed from the knowledge repository.
- Executing a task. Required: Runtime for orchestration, Agents for the acting agents, Tools when the task acts through tools, Providers for the model in use. Contextual: Safety when the action is sensitive.
- Retrieving knowledge. Required: Retrieval for owner and dependency resolution, selection, and loading; the knowledge repository for the facts themselves, consumed from their canonical owners.
- Composing instructions. Required: Prompts for composition and governance, Retrieval for the context composed in. Contextual: Reasoning for the intent behind the instruction.
- Evaluating output. Required: Evaluation for quality and grounding, Reasoning for verification. Contextual: Governance when a finding concerns a constraint.
- Governing an action. Required: Governance for the mandates and human governance, Safety for risk. Contextual: the knowledge that defines the constraint, consumed from the knowledge repository.
- Operating the layer. Required: Operations for deployment, observability, and configuration, Runtime for what is operated. Contextual: Evolution during migration.
- Maintaining the layer. Required: the constitution, ai/README.md and ai/CONTRIBUTING.md, and the Architecture namespace, ai/architecture/. Contextual: the specific namespace being maintained.

# Application

An agent given a task loads the Always and Required knowledge above and the higher-authority documents that govern it, and adds Contextual knowledge only when the situation calls for it. When a task is not listed, the agent identifies the kind of behavior it needs through ai/architecture/ownership-map.md, then applies the two framing rules from ai/README.md. When a task requires business truth, the agent loads it from the canonical owner in the knowledge repository, following knowledge/architecture/loading-map.md.

# Boundaries

This document owns the loading map only. It owns none of the following.

- The AI Loading Strategy and its tiers: ai/README.md.
- Each document's own loading_priority: that document's front matter.
- Which namespace owns what: ai/architecture/ownership-map.md.
- Which agent category consumes what: ai/architecture/agent-map.md.
- The runtime loading algorithm, ordering, caching, and capacity: the Retrieval and Runtime namespaces, executed outside every knowledge document.
- What to load from the knowledge repository for a task: knowledge/architecture/loading-map.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/architecture/README.md
- ai/architecture/architecture.md
- ai/architecture/ownership-map.md
- ai/architecture/agent-map.md
- knowledge/architecture/loading-map.md
