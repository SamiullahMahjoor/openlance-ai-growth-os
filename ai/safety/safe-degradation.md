---
id: OL-AI-SAFETY-SAFE-DEGRADATION
document: ai/safety/safe-degradation.md

title: Open Lance AIOS Safe Degradation

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
  - ai/safety/README.md
  - ai/safety/safety.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Safety namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns graceful degradation: restricted operation, safe mode, capability
  reduction, controlled shutdown, and recovery compatibility. It owns the
  degradation model only, and defers the refusal of an action and the run-time
  that carries a degradation to their owners.
---

# Open Lance AIOS Safe Degradation

This document owns the safe degradation model. It is a safety document at the Specification authority level defined in ai/README.md, and it follows the Safety Document Standard in ai/safety/README.md. It instantiates the safety invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the degradation model only. It never defines the refusal of an action, owned by ai/safety/refusal-model.md, and it never performs the run-time that carries a degradation, owned by ai/runtime/.

# Purpose

This document owns one safety concern: how the AI reduces its own operation safely when it cannot operate fully, so that it stays within safe limits rather than failing open. It exists so that any human or AI agent can determine how the AI steps down and recovers safely, independent of how a degradation is carried out at run time.

# Principles

These are the enduring principles for safe degradation. Each instantiates a safety invariant owned by ai/safety/README.md.

- Degradation reduces capability, never protection. When the AI steps down, it does less, but it is never less protected.
- Degradation is graceful and controlled. A reduction is orderly and defined, never an abrupt or uncontrolled loss of function.
- A safe state is always reachable. The AI can always step down to a safe mode, and, if needed, to a controlled stop, rather than proceed unsafely.
- Degradation is recoverable. The AI returns from a degraded state to fuller operation only when it is safe to do so, without loss of protection.

# Specification

The AI degrades safely in the following way. This document owns the degradation model; the refusal of a specific action is owned by ai/safety/refusal-model.md, and the run-time that carries a degradation is owned by ai/runtime/.

- Restricted operation. The AI narrows what it will do to the actions it can still take safely, so it continues to operate within reduced, safe limits rather than stopping entirely.
- Safe mode. The AI enters a defined safe mode in which only low-risk, well-understood actions proceed, classified under ai/safety/risk-classification.md, so that under adverse conditions it does only what is clearly safe.
- Capability reduction. The AI reduces the capabilities in use, drawn from the capabilities owned by ai/agents/agent-capabilities.md, so that a hazardous capability is stepped down without removing protection. This document owns the safety decision to reduce; the capability itself is owned by ai/agents/.
- Controlled shutdown. Where no operation can be confirmed safe, the AI stops in a controlled way, reaching a safe stopped state in which no unsafe action proceeds. A controlled shutdown is orderly and never leaves the AI in an unsafe state.
- Recovery compatibility. The AI returns from restricted operation, safe mode, or a controlled stop to fuller operation only when it is safe, and a return restores capability without lowering protection. A change to the degradation model preserves compatibility with existing recovery, or is issued as a new version under ai/safety/safety-versioning.md, so recovery is never silently broken.

Safe degradation lets the AI step down and recover within safe limits; the refusal of a specific action and the run-time that carries a degradation are owned elsewhere. Degradation is deterministic: the same condition produces the same safe reduction.

# Invariants

- A degradation reduces capability and never reduces protection.
- The AI can always reach a safe mode, and a controlled stop, rather than proceed unsafely.
- A degradation is graceful and controlled, never an abrupt or uncontrolled loss of function.
- The AI returns to fuller operation only when it is safe, without lowering protection.
- Degrading operation never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the degradation model only. It owns none of the following, and references each by its canonical owner.

- The refusal of a specific action: ai/safety/refusal-model.md.
- The risk classification that determines what is safe in a reduced mode: ai/safety/risk-classification.md.
- The capabilities that are reduced: ai/agents/agent-capabilities.md.
- The run-time that carries a degradation or a shutdown: ai/runtime/.
- The escalation that may accompany a degradation: ai/safety/escalation-model.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/safety/README.md
- ai/safety/safety.md
- ai/safety/refusal-model.md
- ai/safety/risk-classification.md
- ai/safety/escalation-model.md
- ai/safety/safety-versioning.md
- ai/agents/agent-capabilities.md
- ai/runtime/failure-recovery.md
