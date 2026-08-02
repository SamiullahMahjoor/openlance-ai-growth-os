---
id: ADR-0011
title: Logging ships abstractions only; the development ConsoleSink is deferred
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0011: Logging ships abstractions only; the development ConsoleSink is deferred

## Status

Accepted

## Context

The logging design (`docs/implementation/05-logging.md`, sections 2, 6, and 7) says the package "ships a `ConsoleSink` for development only". The Stage 6 implementation mandate, by contrast, requires abstractions and neutral engineering mechanisms only and explicitly forbids a concrete transport: "No console logging implementation", "No runtime transports", "No concrete logging vendors". A `ConsoleSink` is a concrete runtime transport, so the two instructions conflict on this single, peripheral, development-only element. The design itself frames the sink as optional and dev-only, and the section 8 acceptance criteria require only the `LogSink` abstraction (no vendor), not a `ConsoleSink`.

## Decision

The logging package ships the `LogSink` abstraction and no concrete sink, including no `ConsoleSink`. Tests exercise the logger through an in-memory sink double rather than a shipped sink. Concrete sinks (a development console sink, a file sink, or a vendor transport) are provided later, behind `LogSink`, when a stage authorizes concrete transports.

## Rationale

Following the stage mandate keeps the package free of any runtime transport and any vendor coupling, which is the stronger and explicitly stated constraint; it also preserves the design's core intent (the `LogSink` abstraction and vendor neutrality of section 8). Omitting a development-only sink breaks nothing: the abstraction is complete and testable through a double. Shipping a `ConsoleSink` would directly violate the stage's "no console logging implementation" instruction for a convenience that is out of scope here.

## Consequences

The delivered package differs from the design's `console-sink.ts` module by omitting it. When a later stage authorizes concrete sinks, a `ConsoleSink` (and production sinks) can be added behind `LogSink` without changing the abstraction. Any consumer needing output before then supplies its own `LogSink`.

## Related constitutional references

None. Logging is an engineering mechanism; the observability, monitoring, and operational concerns remain owned by the Operations namespace and are unaffected by this decision.

## Related ADRs

Relates to subsystem 05 (Logging Framework).
