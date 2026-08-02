---
id: OL-AI-RUNTIME-CONTEXT-LOADING
document: ai/runtime/context-loading.md

title: Open Lance AIOS Context Loading

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
  - ai/runtime/README.md
  - ai/runtime/runtime.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Runtime namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Critical

summary: >
  Owns how the runtime assembles the execution context by combining loaded
  knowledge, memory, and the task into the working context an execution runs
  with. It owns context assembly only, and defers finding knowledge, the
  truth itself, memory, and knowledge orchestration to their owners.
---

# Open Lance AIOS Context Loading

This document owns how the runtime assembles the execution context. It is a runtime document at the Specification authority level defined in ai/README.md, and it follows the Runtime Document Standard in ai/runtime/README.md. It instantiates the runtime invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns context assembly only. Retrieval finds knowledge, the knowledge repository owns the truth, the Memory namespace provides memory, and ai/runtime/knowledge-resolution.md orchestrates the load. This document owns only how the runtime combines them into the context an execution runs with.

# Purpose

This document owns one execution concern: how the runtime combines already-loaded knowledge, memory, and the task into the single execution context. It exists so that any human or AI agent can determine how an execution's working context is composed, independent of how the pieces are found or stored.

# Principles

These are the enduring principles for context assembly. Each instantiates a runtime invariant owned by ai/runtime/README.md.

- The runtime assembles; it does not source. The runtime combines what others provide, and never finds, stores, or authors the pieces.
- Context is composed from canonical sources. Every piece of knowledge in the context is loaded from its canonical owner, never restated or invented.
- Higher authority frames the context. Foundational and higher-authority knowledge is assembled together with the knowledge it governs, so an execution never acts on a lower source without the higher one that governs it.
- Context is assembled after loading and before execution. The context is complete before the task runs.
- Assembly is technology-neutral. It describes how the context is composed, never a store, format, or mechanism.

# Specification

The runtime assembles the execution context by combining four kinds of input, each provided by its owner, into the single context an execution runs with. This document owns the combination only.

- Loaded knowledge. The required and contextual knowledge already loaded under ai/runtime/knowledge-resolution.md, sourced from the knowledge repository through the Retrieval namespace.
- Memory. The relevant memory provided by the Memory namespace for the session and execution.
- The task. The resolved task and its inputs, admitted during the execution workflow.
- Governing context. The governance and higher-authority documents that bind the execution, so the context carries the rules and foundations the task is governed by.

The runtime composes these into one coherent context, preserving the authority of each piece, so that the execution acts on a complete and governed context. It assembles the least the task requires together with the higher-authority sources that govern it, and never adds a source the task does not require. The assembled context is what the Execution phase runs with, and the same assembly holds at any scale of concurrent executions.

# Invariants

- Every piece of knowledge in the context is loaded from its canonical owner, never restated.
- The context is complete before the Execution phase begins.
- A lower-authority source is never assembled without the higher-authority source that governs it.
- Assembling context never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns context assembly only. It owns none of the following, and references each by its canonical owner.

- Finding and selecting knowledge: the Retrieval namespace, once created.
- The truth that the knowledge carries: the knowledge repository.
- The orchestration of the knowledge load: ai/runtime/knowledge-resolution.md.
- Memory and its persistence: the Memory namespace, once created.
- The prompt built from the context: the Prompts namespace, once created.
- Any store, format, window, or mechanism that holds the context: the runtime and the operational namespaces, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/runtime/README.md
- ai/runtime/runtime.md
- ai/runtime/knowledge-resolution.md
- ai/runtime/execution-workflow.md
