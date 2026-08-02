---
id: OL-AI-OPERATIONS-DIAGNOSTICS
document: ai/operations/diagnostics.md

title: Open Lance AIOS Diagnostics

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
  - ai/operations/README.md
  - ai/operations/operations.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that operates the layer
  - Any contributor to the Operations namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the diagnostic model, investigation architecture, and diagnostic
  relationships. It owns diagnostics only, and defers the incident lifecycle a
  diagnosis serves and the maintenance it leads to to their owners.
---

# Open Lance AIOS Diagnostics

This document owns the diagnostic model. It is an operations document at the Specification authority level defined in ai/README.md, and it follows the Operations Document Standard in ai/operations/README.md. It instantiates the operational invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns diagnostics only. It never defines the incident lifecycle a diagnosis serves, owned by ai/operations/incident-management.md, and it never defines the maintenance a diagnosis leads to, owned by ai/operations/maintenance.md.

# Purpose

This document owns one operational concern: how the cause of an operational problem is investigated, expressed as a diagnostic model, an investigation architecture, and the relationships a diagnosis holds to what it investigates. It exists so that any human or AI agent can determine how an operational problem is investigated, independent of the incident it serves and of the maintenance it leads to.

# Principles

These are the enduring principles for diagnostics. Each instantiates an operational invariant owned by ai/operations/README.md.

- Diagnosis investigates a cause; it does not change behavior. A diagnosis establishes why an operational problem occurred and never alters the behavior it investigates.
- Diagnosis rests on observed signals. A diagnosis rests on the signals owned by ai/operations/observability.md and what monitoring recognized, never on an unfounded guess.
- Diagnosis is grounded and traceable. A diagnosis is traceable from the observed signals to the cause it establishes, so it can be followed and never rests on a hidden judgment.
- Diagnosis observes; it never reasons about the task. A diagnosis investigates operational cause; the reasoning of the AI about its task is owned by ai/reasoning/, and a diagnosis never performs it.

# Specification

An operational problem is diagnosed in the following way. This document owns the diagnostic model, investigation architecture, and diagnostic relationships; the incident a diagnosis serves is owned by ai/operations/incident-management.md, and the maintenance it leads to is owned by ai/operations/maintenance.md.

- The diagnostic model. A diagnosis is a defined investigation of the cause of an operational problem, resting on the signals owned by ai/operations/observability.md and the deviations recognized by ai/operations/monitoring.md. This document owns how a cause is investigated; it never owns the signals, and it never changes the behavior investigated.
- Investigation architecture. The architecture defines how an investigation proceeds from observed signals toward a cause: gathering the relevant signals, relating them, and establishing the cause, as a technology-neutral structure, not a tool or a procedure bound to any technology. The investigation is traceable from signals to cause.
- Diagnostic relationships. A diagnosis holds a defined relationship to what it investigates: it investigates a defined part of the running layer using its signals, and it relates a cause to the deviation and health state that surfaced it, so that what is diagnosed, and on what basis, is explicit.
- Establishing cause, not fixing or judging. A diagnosis establishes the cause and passes it to maintenance under ai/operations/maintenance.md and to the incident under ai/operations/incident-management.md. Diagnosis never itself fixes the problem, judges output, which is owned by ai/evaluation/, or assesses a hazard, which is owned by ai/safety/.

Diagnostics investigates and establishes the cause of an operational problem, traceably; the incident it serves and the maintenance it leads to are owned elsewhere. Diagnosis is deterministic over the same signals and the same at any scale.

# Invariants

- A diagnosis investigates and establishes an operational cause and never changes the behavior it investigates.
- A diagnosis rests on observed signals and is traceable from signals to cause.
- A diagnosis passes its cause to maintenance and the incident, and never itself fixes, judges, or protects.
- A diagnosis investigates operational cause and never performs the AI's reasoning about its task.
- Diagnosing a problem never reasons about the task, executes, decides, changes behavior, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns diagnostics only. It owns none of the following, and references each by its canonical owner.

- The incident lifecycle a diagnosis serves: ai/operations/incident-management.md.
- The maintenance a diagnosis leads to: ai/operations/maintenance.md.
- The signals and monitored deviations a diagnosis rests on: ai/operations/observability.md and ai/operations/monitoring.md.
- The reasoning of the AI about its task: ai/reasoning/.
- The judgment of output and the assessment of hazard: ai/evaluation/ and ai/safety/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/operations/README.md
- ai/operations/operations.md
- ai/operations/observability.md
- ai/operations/monitoring.md
- ai/operations/incident-management.md
- ai/operations/maintenance.md
- ai/reasoning/README.md
