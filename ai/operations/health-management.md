---
id: OL-AI-OPERATIONS-HEALTH-MANAGEMENT
document: ai/operations/health-management.md

title: Open Lance AIOS Health Management

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
  Owns the health model, health states, and operational health assessment. It
  owns health management only, and defers the monitoring that feeds health and
  the incident raised on ill health to their owners.
---

# Open Lance AIOS Health Management

This document owns the operational health model. It is an operations document at the Specification authority level defined in ai/README.md, and it follows the Operations Document Standard in ai/operations/README.md. It instantiates the operational invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns health management only. It never defines the monitoring that feeds health, owned by ai/operations/monitoring.md, and it never defines the incident raised on ill health, owned by ai/operations/incident-management.md.

# Purpose

This document owns one operational concern: the operational health of the running layer, expressed as a health model with defined health states, and how that health is assessed. It exists so that any human or AI agent can determine how well the layer is running, independent of how it is monitored and of the incident raised when it is unhealthy.

# Principles

These are the enduring principles for health management. Each instantiates an operational invariant owned by ai/operations/README.md.

- Health is an operational state, not a behavior. Health describes how well the layer is running; it is never the behavior of the layer, which is owned by the subject namespaces.
- Health is assessed from monitored signals. Health is derived from what monitoring recognizes under ai/operations/monitoring.md, never from an unfounded impression.
- Health states are defined. The layer holds one defined health state at a time, so its condition is explicit and never ambiguous.
- Assessing health observes; it never changes. Assessing health observes the running layer and never alters the behavior it assesses.

# Specification

The operational health of the layer is managed in the following way. This document owns the health model, states, and assessment; the monitoring that feeds health is owned by ai/operations/monitoring.md, and the incident raised on ill health is owned by ai/operations/incident-management.md.

- The health model. Health is a defined measure of how well the layer, or a part of it, is running, derived from the deviations monitoring recognizes under ai/operations/monitoring.md. This document owns the health model; it never owns the signals or the monitoring that feed it.
- Health states. The layer holds one of a set of defined health states at a time, ordered from healthy to degraded to failed, so that its operational condition is explicit and comparable over time. A health state describes operational condition only; it is not a safety state, which is owned by ai/safety/.
- Operational health assessment. Health is assessed by mapping the monitored deviations to a health state, deterministically, so the same monitored state yields the same health state. Assessment observes and reports the health state; it never changes the behavior assessed and never itself protects or decides.
- Reporting, not protecting or deciding. Health assessment reports the operational health state, and where health is degraded or failed, it raises an incident under ai/operations/incident-management.md and, where a hazard is implied, defers a protective response to ai/safety/. Health management reports; it never refuses, degrades, or decides.

Health management assesses and reports how well the layer is running; the monitoring that feeds it and the incident it raises are owned elsewhere. Health assessment is deterministic and the same at any scale.

# Invariants

- Health is an operational state describing how well the layer runs, never the behavior of the layer.
- The layer holds one defined health state at a time, from healthy to failed.
- Health is assessed deterministically from monitored deviations; the same monitored state yields the same health state.
- Health management reports and raises an incident, and never itself protects, degrades, or decides.
- Assessing health never reasons, executes, changes behavior, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns health management only. It owns none of the following, and references each by its canonical owner.

- The monitoring that feeds health: ai/operations/monitoring.md.
- The incident raised on degraded or failed health: ai/operations/incident-management.md.
- The diagnosis of the cause of ill health: ai/operations/diagnostics.md.
- The protective response and safe degradation a hazard implies: ai/safety/.
- The behavior whose running is assessed: the subject namespaces and ai/runtime/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/operations/README.md
- ai/operations/operations.md
- ai/operations/monitoring.md
- ai/operations/incident-management.md
- ai/operations/diagnostics.md
- ai/safety/README.md
