---
id: OL-AI-OPERATIONS-MONITORING
document: ai/operations/monitoring.md

title: Open Lance AIOS Monitoring

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
  Owns the monitoring model, monitoring relationships, and monitoring boundaries:
  how signals are watched against expectations. It owns monitoring only, and
  defers the signals watched and the health state derived to their owners.
---

# Open Lance AIOS Monitoring

This document owns the monitoring model. It is an operations document at the Specification authority level defined in ai/README.md, and it follows the Operations Document Standard in ai/operations/README.md. It instantiates the operational invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the monitoring model only. It never defines the signals it watches, owned by ai/operations/observability.md, and it never defines the health state derived from monitoring, owned by ai/operations/health-management.md.

# Purpose

This document owns one operational concern: how the signals of the running layer are watched against expectations over time, the relationships a monitor holds to what it watches, and the boundaries of monitoring. It exists so that any human or AI agent can determine how the running layer is watched, independent of what the signals are and of what health is derived from them.

# Principles

These are the enduring principles for monitoring. Each instantiates an operational invariant owned by ai/operations/README.md.

- Monitoring watches; it does not produce signals. Monitoring watches the signals owned by ai/operations/observability.md against expectations; it never produces a signal or changes the behavior that emits it.
- Monitoring is against a defined expectation. A monitor watches a signal against a defined expectation, so a deviation is defined, never a matter of opinion.
- Monitoring observes; it never changes. Watching the running layer observes it and never alters the behavior watched.
- Monitoring is bounded. A monitor watches defined signals within defined boundaries, and never reaches into the behavior it watches.

# Specification

The running layer is monitored in the following way. This document owns the monitoring model, relationships, and boundaries; the signals it watches are owned by ai/operations/observability.md, and the health derived is owned by ai/operations/health-management.md.

- The monitoring model. Monitoring watches the signals owned by ai/operations/observability.md against defined expectations over time, so that a deviation from the expected operational state is recognized. This document owns how a signal is watched; it never owns the signal, and it never changes the behavior that emits it.
- Monitoring relationships. A monitor holds a defined relationship to what it watches: it watches a defined set of signals of a defined part of the running layer, so that what is monitored, and what is not, is explicit. A monitoring relationship observes; it never controls or changes the monitored part.
- Monitoring boundaries. Monitoring watches defined signals within defined boundaries and never reaches into the behavior it watches, which is owned by the subject namespaces and by ai/runtime/. A deviation is recognized and passed to health assessment under ai/operations/health-management.md or to incident management under ai/operations/incident-management.md; monitoring never itself protects or decides.
- Recognizing, not judging or protecting. Monitoring recognizes a deviation from an expectation; judging output quality is owned by ai/evaluation/, and a protective response is owned by ai/safety/. Monitoring passes what it recognizes to health and incident management and never judges or protects.

Monitoring watches signals against expectations within bounds; the signals watched and the health derived are owned elsewhere. Monitoring is deterministic and the same at any scale.

# Invariants

- Monitoring watches the signals owned by observability against defined expectations and never produces a signal.
- A deviation is defined against an expectation, never a matter of opinion.
- Monitoring observes within defined boundaries and never reaches into or changes the behavior it watches.
- A recognized deviation is passed to health or incident management, and monitoring never itself protects or decides.
- Monitoring never reasons, executes, decides, changes behavior, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the monitoring model only. It owns none of the following, and references each by its canonical owner.

- The signals monitoring watches: ai/operations/observability.md.
- The health state derived from monitoring: ai/operations/health-management.md.
- The incident raised on a deviation: ai/operations/incident-management.md.
- The behavior watched: the subject namespaces and ai/runtime/.
- The judgment of output and the protective response: ai/evaluation/ and ai/safety/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/operations/README.md
- ai/operations/operations.md
- ai/operations/observability.md
- ai/operations/health-management.md
- ai/operations/incident-management.md
- ai/evaluation/README.md
- ai/safety/README.md
