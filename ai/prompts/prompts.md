---
id: OL-AI-PROMPTS-PROMPTS
document: ai/prompts/prompts.md

title: Open Lance AIOS Prompts Inventory

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
  - ai/prompts/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Prompts namespace

provenance:
  - Derived from ai/prompts/README.md and the AI prompts namespace

loading_priority: Required

summary: >
  The canonical inventory of the AI layer's prompt concerns. It owns the
  identity and existence of each prompt concern, and the prompt determinism,
  repeatability, and scalability properties. It owns no prompt model, no
  business truth, no governance rule, and no prompt content.
---

# Open Lance AIOS Prompts Inventory

This document is the canonical inventory of the AI layer's prompt concerns. It owns the identity of the Prompts namespace and the list of prompt concerns the namespace owns, so that any human or AI agent can determine, from one place, which prompt concerns exist and which document owns each. It also owns the namespace-wide properties of determinism, repeatability, and scalability. It is a reference document and follows the inventory pattern, not the Prompt Document Standard.

This inventory owns only identity, existence, and those namespace-wide properties. It states no prompt model, no business truth, and no governance rule, and it holds no prompt. How prompt architecture is documented is owned by ai/prompts/README.md. Each prompt concern is owned by its own document. On any matter of business truth, the knowledge repository governs, and a prompt points to knowledge and never embeds it.

# Purpose

This document exists so that the set of the AI layer's prompt concerns has a single canonical list, and so that the prompt properties that hold across the whole namespace have one owner. It answers which prompt concerns the namespace owns, which document owns each, and why prompt composition is deterministic, repeatable, and scalable.

# Scope

This inventory lists every prompt concern the namespace owns, and states the determinism, repeatability, and scalability of prompt composition. Each concern is represented exactly once and has exactly one canonical entry, and the model of each concern is owned by that concern's own document. This is the prompt ownership matrix in its canonical form.

# Prompt Role

Prompts are the expression layer of the AI Operating System. They sit at the Specification authority level, below the constitution and the governance mandates, expressing the governed conclusions reasoning produces, composing the context retrieval determines and the runtime assembles, and consumed by the providers that execute them. A prompt is a transient instruction that points to knowledge and never becomes it, and it owns none of the truth, rules, reasoning, retrieval, execution, or persistence around it.

# Determinism

Prompt composition is deterministic: the same intent, the same referenced context, the same governing rules, and the same base prompts and templates compose the same prompt. This holds because a prompt is a function of fixed inputs alone, the intent expressed, the context the retrieval determined and the runtime assembled, the rules owned by ai/governance/, and the base prompts and templates it derives from, applied through defined layering, composition, and assembly, with no randomness and no hidden step. Because a prompt embeds no truth and invents nothing, and because every layer and inherited part is explicit and validated, two compositions over the same inputs produce the same prompt, and prompt determinism upholds the determinism of the AI layer that the prompt expresses.

# Repeatability

Prompt composition is repeatable: because it is deterministic and every layer, template, and inherited part is explicit and traceable, the same inputs reproduce the same prompt, and it can be followed from its parts to its assembled form. Repeatability is the reproducibility of a deterministic, non-inventing composition; it is owned here as a property of the namespace, and it never depends on a provider, model, framework, or language.

# Scalability

Prompt composition scales without redesign. The prompt model composes a bounded prompt from a bounded set of layers, templates, inherited parts, and referenced context, so it applies the same way whether the AI composes one prompt or tens of thousands, and whether the namespace defines a handful of templates or many thousands. Because prompt architecture is provider-neutral, the same prompt model is portable across any provider, model, or runtime without change. Growth in the number of prompts, templates, base prompts, or agents is absorbed additively, without changing the prompt model.

# The Prompt Concerns

The Prompts namespace owns the following concerns. Each is owned by exactly one document. This list owns the identity of each concern; the model is owned by the named document.

## Prompt Architecture

- Document. ai/prompts/prompt-architecture.md.
- Owns. The prompt layering model: the ordered architectural layers and sections a single prompt is organized into.
- Out of scope. How the layers are combined, owned by ai/prompts/prompt-composition.md; how one prompt derives from another, owned by ai/prompts/prompt-inheritance.md.

## Prompt Lifecycle

- Document. ai/prompts/prompt-lifecycle.md.
- Owns. The phases of a prompt, from definition through expression to retirement.
- Out of scope. The ordered assembly stages, owned by ai/prompts/prompt-assembly.md; the execution lifecycle, owned by ai/runtime/.

## Prompt Composition

- Document. ai/prompts/prompt-composition.md.
- Owns. The composition model: how the layers, template, inherited parts, and referenced context are combined into one prompt.
- Out of scope. The ordered stages that produce the final prompt, owned by ai/prompts/prompt-assembly.md; the resolution of conflicts among parts, owned by ai/prompts/prompt-inheritance.md.

## Prompt Assembly

- Document. ai/prompts/prompt-assembly.md.
- Owns. The ordered assembly stages that produce the final prompt, including prompt normalization.
- Out of scope. The composition model the stages apply, owned by ai/prompts/prompt-composition.md; the assembly of the execution context, owned by ai/runtime/context-loading.md.

## Prompt Templates

- Document. ai/prompts/prompt-templates.md.
- Owns. The template model: the reusable structural forms a prompt is built from, and prompt reuse and consistency.
- Out of scope. Any template language, syntax, or format, which is implementation; the layers a template organizes, owned by ai/prompts/prompt-architecture.md.

## Prompt Context

- Document. ai/prompts/prompt-context.md.
- Owns. Prompt context separation: how referenced context is held in a prompt, separated from instruction, so a prompt points to knowledge and never embeds it.
- Out of scope. The determination of knowledge, owned by ai/retrieval/; the retained context and its persistence, owned by ai/memory/.

## Prompt Validation

- Document. ai/prompts/prompt-validation.md.
- Owns. Validation before a prompt is expressed, and prompt validation ordering.
- Out of scope. The governance validation rules, owned by ai/governance/constitutional-validation.md; the evaluation of output, owned by the Evaluation namespace.

## Prompt Inheritance

- Document. ai/prompts/prompt-inheritance.md.
- Owns. The inheritance hierarchy and dependency model of prompts, and prompt conflict resolution.
- Out of scope. The composition of a single prompt, owned by ai/prompts/prompt-composition.md; the Authority Hierarchy conflicts resolve by, owned by ai/README.md.

## Prompt Boundaries

- Document. ai/prompts/prompt-boundaries.md.
- Owns. What prompts never own, and where prompts stop.
- Out of scope. The governance rules that bound prompts, owned by ai/governance/; the runtime boundaries, owned by ai/runtime/execution-boundaries.md.

## Prompt Versioning

- Document. ai/prompts/prompt-versioning.md.
- Owns. Prompt versioning, evolution, change governance consumption, and version compatibility.
- Out of scope. The document amendment workflow, owned by ai/CONTRIBUTING.md; the repository evolution map, owned by ai/architecture/repository-evolution.md.

# Boundaries

This inventory owns the identity and existence of the prompt concerns, and the determinism, repeatability, and scalability of prompt composition, only. It owns none of the following.

- How prompt architecture is documented: ai/prompts/README.md.
- The model of any prompt concern: that concern's own document.
- Business truth: the knowledge repository.
- The rules that govern prompts: ai/governance/.
- The determination of knowledge, the execution context, the reasoning expressed, and the retained context: ai/retrieval/, ai/runtime/, ai/reasoning/, and ai/memory/.
- The execution of a prompt: ai/runtime/ and the Providers namespace.
- The maps of the AI layer: ai/architecture/.
- Any prompt content: an operational output produced at runtime, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/prompts/README.md
- ai/architecture/ownership-map.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Growth of the inventory. As the AI layer comes to own a genuinely new and distinct prompt concern, a new document is added under ai/prompts/ following ai/prompts/README.md, and this inventory gains an entry for it. The inventory grows additively and its structure does not change.
- New layers and templates. The architectural layers of a prompt and the library of templates may grow over time under ai/prompts/prompt-architecture.md and ai/prompts/prompt-templates.md, additively and without redesign, and this inventory records only that the concern exists.
