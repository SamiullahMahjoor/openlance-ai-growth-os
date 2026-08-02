---
id: OL-AI-TOOLS-TOOLS
document: ai/tools/tools.md

title: Open Lance AIOS Tools Inventory

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
  - ai/tools/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Tools namespace

provenance:
  - Derived from ai/tools/README.md and the AI tools namespace

loading_priority: Required

summary: >
  The canonical inventory of the AI layer's tool concerns. It owns the identity
  and existence of each tool concern, and the tool determinism and scalability
  properties. It owns no tool model, no governance rule, no safety rule, and no
  business truth.
---

# Open Lance AIOS Tools Inventory

This document is the canonical inventory of the AI layer's tool concerns. It owns the identity of the Tools namespace and the list of tool concerns the namespace owns, so that any human or AI agent can determine, from one place, which tool concerns exist and which document owns each. It also owns the namespace-wide properties of determinism and scalability. It is a reference document and follows the inventory pattern, not the Tool Document Standard.

This inventory owns only identity, existence, and those namespace-wide properties. It states no tool model, no governance rule, no safety rule, and no business truth. How the tool system is documented is owned by ai/tools/README.md. Each tool concern is owned by its own document. On any matter of business truth, the knowledge repository governs.

# Purpose

This document exists so that the set of the AI layer's tool concerns has a single canonical list, and so that the tool properties that hold across the whole namespace have one owner. It answers which tool concerns the namespace owns, which document owns each, and why the tool model is deterministic and scalable.

# Scope

This inventory lists every tool concern the namespace owns, and states the determinism and scalability of the tool model. Each concern is represented exactly once and has exactly one canonical entry, and the model of each concern is owned by that concern's own document.

# Tool Role

A tool is the external-interaction capability of the AI Operating System. It is at the Specification authority level, below the constitution and the governance mandates, and it is composed by an agent to interact with something outside the agent's own reasoning, executed by the runtime, permitted by governance, and bounded by safety. A tool performs no reasoning, makes no decision, holds no permission, owns no intelligence, and owns none of the reasoning, execution, governance, protection, or truth around it.

# Determinism

The tool model is deterministic: the same need, the same registered tools, the same declared capabilities, and the same governing rules produce the same selection, the same composition, and the same execution ordering, with no randomness and no hidden step. This holds because the model's decisions are a function of fixed inputs alone, the need, the registered tools and their capabilities, and the rules owned by ai/governance/ and the limits owned by ai/safety/, applied through defined selection, composition, and execution ordering. The effect of a tool on the outside system it interacts with is that system's own, outside this architecture, and this namespace makes no determinism claim about it; it claims determinism only for the model that selects, composes, orders, and validates a tool interaction.

# Scalability

The tool model scales without redesign. The model describes, selects, validates, composes, and orders the execution of a bounded tool drawn from a registered set, so it applies the same way whether the layer uses one tool or many thousands of tools. Because the model is technology-neutral, adding, replacing, or retiring a tool changes no behavior of the layer, and tool churn is absorbed by the tool model rather than by any foundational document. Growth in the number of tools, capabilities, or compositions is absorbed additively, without changing the tool model.

# Repository Ownership

The Tools namespace owns the external-interaction model of the AI layer and nothing else. It owns the tool concerns listed below, each in exactly one document. It owns no governance rule, which is owned by ai/governance/; no safety rule, which is owned by ai/safety/; no execution, which is owned by ai/runtime/; no intelligence, which is owned by ai/providers/ and the source itself; and no business truth, which is owned by the knowledge repository. Agents compose tools; tools consume only the constitution, the governance mandates, and the safety architecture.

# The Tool Concerns

The Tools namespace owns the following concerns. Each is owned by exactly one document. This list owns the identity of each concern; the model is owned by the named document.

## Tool Architecture

- Document. ai/tools/tool-architecture.md.
- Owns. The architectural definition of a tool: its identity and the parts it is composed of.
- Out of scope. The lifecycle of a tool, owned by ai/tools/tool-lifecycle.md; the execution model, owned by ai/tools/tool-execution.md.

## Tool Lifecycle

- Document. ai/tools/tool-lifecycle.md.
- Owns. The phases of a tool, including registration, discovery, activation, the execution lifecycle, and retirement.
- Out of scope. The execution model within the operation phase, owned by ai/tools/tool-execution.md; the versioning of a tool definition, owned by ai/tools/tool-versioning.md.

## Tool Capabilities

- Document. ai/tools/tool-capabilities.md.
- Owns. The capability model: capability declaration and capability inheritance.
- Out of scope. Whether a capability matches a need, owned by ai/tools/tool-compatibility.md; the agent capability that composes a tool, owned by ai/agents/agent-capabilities.md.

## Tool Selection

- Document. ai/tools/tool-selection.md.
- Owns. The selection model: how a tool is chosen for a need, deterministically.
- Out of scope. The execution of the chosen tool, owned by ai/tools/tool-execution.md; the compatibility a selection rests on, owned by ai/tools/tool-compatibility.md.

## Tool Execution

- Document. ai/tools/tool-execution.md.
- Owns. The execution model: how a tool interaction is structured, execution ordering within a tool interaction, and execution boundaries.
- Out of scope. The scheduling and orchestration of a tool interaction, owned by ai/runtime/; the chaining of tools, owned by ai/tools/tool-composition.md.

## Tool Validation

- Document. ai/tools/tool-validation.md.
- Owns. Pre-execution validation of a tool, and validation ordering.
- Out of scope. The governance validation rules, owned by ai/governance/constitutional-validation.md; the hazards a validation checks for, owned by ai/safety/hazard-identification.md.

## Tool Composition

- Document. ai/tools/tool-composition.md.
- Owns. The composition model: chaining of tools and reusable compositions.
- Out of scope. The execution ordering within a single tool interaction, owned by ai/tools/tool-execution.md; the coordination of agents, owned by ai/agents/agent-coordination.md.

## Tool Compatibility

- Document. ai/tools/tool-compatibility.md.
- Owns. The compatibility model: whether a tool is compatible with a need, and whether a tool version is compatible with a consumer.
- Out of scope. The evolution and version rules, owned by ai/tools/tool-versioning.md; the declaration of capabilities, owned by ai/tools/tool-capabilities.md.

## Tool Boundaries

- Document. ai/tools/tool-boundaries.md.
- Owns. What tools never own, and where a tool stops.
- Out of scope. The governance and safety rules that bound tools, owned by ai/governance/ and ai/safety/; the runtime boundaries, owned by ai/runtime/execution-boundaries.md.

## Tool Versioning

- Document. ai/tools/tool-versioning.md.
- Owns. Tool versioning, evolution, migration, and deprecation.
- Out of scope. The compatibility a version preserves, owned by ai/tools/tool-compatibility.md; the document amendment workflow, owned by ai/CONTRIBUTING.md.

# Boundaries

This inventory owns the identity and existence of the tool concerns, and the determinism and scalability of the tool model, only. It owns none of the following.

- How the tool system is documented: ai/tools/README.md.
- The model of any tool concern: that concern's own document.
- The rules that govern the AI, and the protective architecture: ai/governance/ and ai/safety/.
- Business truth: the knowledge repository.
- The reasoning, execution, expression, retention, retrieval, and intelligence around a tool: ai/reasoning/, ai/runtime/, ai/prompts/, ai/memory/, ai/retrieval/, and ai/providers/.
- The outside system a tool interacts with: that system itself.
- The maps of the AI layer: ai/architecture/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/tools/README.md
- ai/architecture/ownership-map.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Growth of the inventory. As the AI layer comes to own a genuinely new and distinct tool concern, a new document is added under ai/tools/ following ai/tools/README.md, and this inventory gains an entry for it. The inventory grows additively and its structure does not change.
- Absorbing tools. New tools, capabilities, and compositions are absorbed additively under the member documents, without redesign, and this inventory records only that the concern exists.
