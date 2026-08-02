---
id: OL-AI-PROMPTS-PROMPT-LIFECYCLE
document: ai/prompts/prompt-lifecycle.md

title: Open Lance AIOS Prompt Lifecycle

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
  - ai/prompts/README.md
  - ai/prompts/prompts.md
  - ai/retrieval/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Prompts namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the phases of a prompt, from definition through expression to retirement.
  It owns the prompt lifecycle only, and defers the ordered assembly stages, the
  execution lifecycle, and the layers around prompts to their owners.
---

# Open Lance AIOS Prompt Lifecycle

This document owns the phases of a prompt. It is a prompt document at the Specification authority level defined in ai/README.md, and it follows the Prompt Document Standard in ai/prompts/README.md. It instantiates the prompt invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs, and a prompt points to knowledge and never embeds it.

This document owns the prompt lifecycle only. It defers the ordered assembly stages within composition to ai/prompts/prompt-assembly.md, and the execution lifecycle the prompt serves to ai/runtime/.

# Purpose

This document owns one prompt concern: the phases a prompt passes through, from being defined to being expressed and retired. It exists so that any human or AI agent can determine the shape of a prompt's life, independent of how any phase is carried out.

# Principles

These are the enduring principles for the prompt lifecycle. Each instantiates a prompt invariant owned by ai/prompts/README.md.

- A prompt has a defined beginning and end. It begins as a definition and ends when it is expressed and retired; a prompt is transient and is never stored as truth.
- Definition precedes composition. A prompt's structure and derivation are established before it is composed for an execution.
- Validation precedes expression. A prompt is validated before it is expressed, and an invalid prompt is not expressed.
- Every prompt is transient. A composed prompt exists for its execution and is retired afterward, never promoted into the knowledge repository.

# Specification

A prompt passes through the following ordered phases. This document owns the phases; the ordered stages within composition are owned by ai/prompts/prompt-assembly.md, and the execution the prompt serves is owned by ai/runtime/.

- Definition. The prompt's architecture is defined: its layers under ai/prompts/prompt-architecture.md, the template it uses under ai/prompts/prompt-templates.md, and the base prompts it derives from under ai/prompts/prompt-inheritance.md. Definition establishes the durable structure a prompt is composed from, and holds no execution-specific content.
- Composition. For an execution, the defined structure is composed with the governed intent and the referenced context into a prompt, under ai/prompts/prompt-composition.md and ai/prompts/prompt-assembly.md. The context is referenced under ai/prompts/prompt-context.md and never embedded.
- Validation. The composed prompt is validated under ai/prompts/prompt-validation.md for governance conformance, boundary conformance, completeness, and grounding, before it is expressed.
- Expression. The validated prompt is expressed as a transient instruction, carried by ai/runtime/ and executed by the Providers namespace. This namespace owns the prompt up to expression and never executes it.
- Retirement. After the execution, the composed prompt is retired. It is transient and is never stored as truth or promoted into the knowledge repository; a durable definition, template, or base prompt persists as architecture, not as a prompt.

Each phase completes before the next begins, except where validation returns a prompt to composition for correction. The lifecycle is the same for one prompt and for tens of thousands, and it never changes as providers, models, or frameworks change.

# Invariants

- A prompt holds exactly one lifecycle, from one definition to expression and retirement.
- The Definition phase precedes Composition, which precedes Validation, which precedes Expression.
- A prompt is validated before it is expressed, and an invalid prompt is not expressed.
- A composed prompt is transient and is retired after its execution, never stored as truth or promoted into the knowledge repository.
- The lifecycle never executes, reasons, retrieves knowledge, persists, or alters ownership, authority, governance, or business truth.

# Boundaries

This document owns the prompt lifecycle only. It owns none of the following, and references each by its canonical owner.

- The ordered assembly stages within composition: ai/prompts/prompt-assembly.md.
- The composition model and the layers composed: ai/prompts/prompt-composition.md and ai/prompts/prompt-architecture.md.
- The validation that gates expression: ai/prompts/prompt-validation.md.
- The versioning and evolution of a prompt definition over time: ai/prompts/prompt-versioning.md.
- The execution lifecycle the prompt serves, and the execution of the prompt: ai/runtime/ and the Providers namespace.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/prompts/README.md
- ai/prompts/prompts.md
- ai/prompts/prompt-composition.md
- ai/prompts/prompt-assembly.md
- ai/prompts/prompt-validation.md
- ai/prompts/prompt-versioning.md
- ai/retrieval/README.md
- ai/runtime/execution-lifecycle.md
