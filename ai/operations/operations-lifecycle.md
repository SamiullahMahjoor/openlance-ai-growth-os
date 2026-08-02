---
id: OL-AI-OPERATIONS-OPERATIONS-LIFECYCLE
document: ai/operations/operations-lifecycle.md

title: Open Lance AIOS Operations Lifecycle

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
  Owns the operational lifecycle: startup, steady-state, maintenance, and
  retirement of the layer's operation. It owns the operational lifecycle only,
  and defers the maintenance model within the maintenance phase and the
  versioning of a definition to their owners.
---

# Open Lance AIOS Operations Lifecycle

This document owns the phases of operating the layer. It is an operations document at the Specification authority level defined in ai/README.md, and it follows the Operations Document Standard in ai/operations/README.md. It instantiates the operational invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the operational lifecycle only. It never defines the maintenance model within the maintenance phase, owned by ai/operations/maintenance.md, and it never defines the versioning of an operational definition, owned by ai/operations/operations-versioning.md.

# Purpose

This document owns one operational concern: the phases the operation of the layer passes through, from startup to retirement. It exists so that any human or AI agent can determine the shape of the layer's operation over time, independent of how any phase is carried out and of the runtime it operates.

# Principles

These are the enduring principles for the operational lifecycle. Each instantiates an operational invariant owned by ai/operations/README.md.

- Operation has a defined beginning and end. The operation of the layer begins with startup and ends with retirement; it never runs without a defined operational state.
- Startup precedes steady-state. The layer is brought into a running state before it is operated in steady-state.
- Steady-state is observed and kept healthy. In steady-state, the layer is observed, monitored, and kept healthy without its behavior being changed.
- Retirement is orderly. The operation of the layer, or a part of it, is brought down in an orderly way that changes no behavior and leaves nothing running unattended.

# Specification

The operation of the layer passes through the following phases. This document owns the phases; the maintenance model within the maintenance phase is owned by ai/operations/maintenance.md, and the change of an operational definition over time is owned by ai/operations/operations-versioning.md.

- Startup. The layer, or a part of it, is brought into a running state, and its operation begins: observability under ai/operations/observability.md and monitoring under ai/operations/monitoring.md are established, so the running layer is visible from the start. Startup begins operation; it never changes the behavior of the layer.
- Steady-state. In steady-state, the layer is operated continuously: it is observed, monitored, and its health assessed under ai/operations/health-management.md, and incidents are handled under ai/operations/incident-management.md as they arise. Steady-state keeps the running layer well without changing what it does.
- Maintenance. When maintenance is called for, the operation enters a maintenance phase in which maintenance activities are carried out under ai/operations/maintenance.md. This document owns that maintenance is a phase of the operation; the model of a maintenance activity is owned by ai/operations/maintenance.md.
- Retirement. The operation of the layer, or a part of it, is retired: it is brought down in an orderly way, its observation is concluded, and nothing is left running unattended. Retirement ends operation and changes no behavior.

Each phase precedes the next, and the operation returns from a maintenance phase to steady-state. The lifecycle is the same regardless of any tool or technology, and it is the same for a single agent or a whole enterprise.

# Invariants

- The operation of the layer begins at Startup and ends at Retirement.
- Startup precedes Steady-state, and the operation returns from Maintenance to Steady-state.
- Every phase observes and maintains the running layer without changing its behavior.
- Retirement is orderly and leaves nothing running unattended.
- A phase transition never reasons, executes runtime behavior, decides, changes behavior, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the operational lifecycle only. It owns none of the following, and references each by its canonical owner.

- The maintenance model within the maintenance phase: ai/operations/maintenance.md.
- The observability, monitoring, health, and incident handling within the phases: their documents.
- The runtime execution and its own session and execution lifecycles: ai/runtime/.
- The versioning of an operational definition over time: ai/operations/operations-versioning.md.
- The rules the operation runs within: ai/governance/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/operations/README.md
- ai/operations/operations.md
- ai/operations/observability.md
- ai/operations/monitoring.md
- ai/operations/health-management.md
- ai/operations/incident-management.md
- ai/operations/maintenance.md
- ai/operations/operations-versioning.md
