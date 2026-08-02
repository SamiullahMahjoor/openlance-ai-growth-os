---
id: OL-AI-OPERATIONS-INCIDENT-MANAGEMENT
document: ai/operations/incident-management.md

title: Open Lance AIOS Incident Management

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
  Owns the incident lifecycle, incident classification, and incident response
  architecture. It owns incident management only, and defers the diagnosis of a
  cause and the protective response to their owners.
---

# Open Lance AIOS Incident Management

This document owns the incident model. It is an operations document at the Specification authority level defined in ai/README.md, and it follows the Operations Document Standard in ai/operations/README.md. It instantiates the operational invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns incident management only. It never defines the diagnosis of an incident's cause, owned by ai/operations/diagnostics.md, and it never defines the protective response, owned by ai/safety/.

# Purpose

This document owns one operational concern: how an operational incident, a discrete disruption in the running of the layer, is recognized, classified, and responded to across its lifecycle. It exists so that any human or AI agent can determine how a disruption in operation is handled, independent of how its cause is diagnosed and of any protective response.

# Principles

These are the enduring principles for incident management. Each instantiates an operational invariant owned by ai/operations/README.md.

- An incident is a discrete operational disruption. An incident is a defined disruption in the running of the layer, distinct from the ongoing health state owned by ai/operations/health-management.md.
- An incident is classified. Every incident is classified by a defined classification, so its severity and kind are explicit, never ad hoc.
- Response restores operation; it never changes behavior. An incident response restores the running of the layer and never changes the behavior of any namespace.
- An incident is not a safety hazard. An operational incident is handled here; a hazard, risk, or protective response is owned by ai/safety/, to which an incident defers when safety is implied.

# Specification

An operational incident is managed in the following way. This document owns the incident lifecycle, classification, and response architecture; the diagnosis of the cause is owned by ai/operations/diagnostics.md, and the protective response is owned by ai/safety/.

- Incident lifecycle. An incident passes through a defined lifecycle: it is recognized from a monitored deviation under ai/operations/monitoring.md or a degraded health state under ai/operations/health-management.md, classified, responded to, and resolved, then closed. Each incident has a defined beginning and end, so no incident is left open unattended.
- Incident classification. An incident is classified by a defined classification of its severity and kind, so that its handling is proportionate and consistent. Classification describes the incident; it never decides a matter reserved to governance and never assesses a hazard, which is owned by ai/safety/.
- Incident response architecture. A response is a defined set of operational steps that restore the running of the layer, drawing on diagnosis under ai/operations/diagnostics.md and maintenance under ai/operations/maintenance.md. A response restores operation; it never changes the behavior of a namespace, and where a hazard is implied it defers a protective response to ai/safety/.
- Defer, do not protect or decide. Incident management restores operation and records the incident; the protective response to a hazard is owned by ai/safety/, and any decision reserved to governance is owned by ai/governance/. Incident management never itself protects or decides.

Incident management recognizes, classifies, and responds to an operational disruption across its lifecycle; the diagnosis of its cause and any protective response are owned elsewhere. Incident handling is deterministic in its classification and the same at any scale.

# Invariants

- An incident is a discrete operational disruption with a defined lifecycle from recognition to closure.
- Every incident is classified by a defined classification of severity and kind.
- An incident response restores operation and never changes the behavior of a namespace.
- An incident that implies a hazard defers a protective response to ai/safety/, and any governed decision to ai/governance/.
- Managing an incident never reasons, executes runtime behavior, decides, changes behavior, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns incident management only. It owns none of the following, and references each by its canonical owner.

- The diagnosis of an incident's cause: ai/operations/diagnostics.md.
- The maintenance that a response applies: ai/operations/maintenance.md.
- The ongoing health state an incident is recognized from: ai/operations/health-management.md.
- The protective response, hazard, and safe degradation: ai/safety/.
- The governed decision an incident may require: ai/governance/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/operations/README.md
- ai/operations/operations.md
- ai/operations/monitoring.md
- ai/operations/health-management.md
- ai/operations/diagnostics.md
- ai/operations/maintenance.md
- ai/safety/README.md
- ai/governance/escalation.md
