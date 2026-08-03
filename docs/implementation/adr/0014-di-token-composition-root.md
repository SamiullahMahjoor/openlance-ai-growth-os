---
id: ADR-0014
title: Cross-package services are exposed as DI tokens registered by the composition root
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0014: Cross-package services are exposed as DI tokens registered by the composition root

## Status

Accepted

## Context

ADR-0010 decided how `@openlance/aios-config` realizes its declared `config -> di` edge: it
exports a `CONFIG_SERVICE` token created with `di`'s `token()` primitive, and the composition
root registers the built service under it. `@openlance/aios-logging` and `@openlance/aios-events`
have the identical situation, their design docs (05 and 06) declare a `-> di` dependency that
their interfaces never wire, and they resolve it the same way (`LOGGER`, `EVENT_BUS`). ADR-0010's
text is scoped to configuration only, so the logging and events realizations, and any future
cross-package service, rest on an ADR that does not name them. This ADR generalizes the pattern
so every such edge is traceable to a decision whose text covers it. It is a documentation-only
generalization; it changes no runtime behavior.

## Decision

A substrate package that must expose a cross-package service across its declared `-> di` edge
exposes exactly one DI token, `Token<TheService>`, created with `di`'s `token()` primitive and
named in UPPER_SNAKE with an `aios.<package>.<name>` description string. The service instance is
constructed explicitly by the owning package (for a fallible build, a `createX` that returns a
`Result`, failing closed), and the composition root registers the built instance under the token
in a container. No package ships a `di` module with registration-time failure semantics the
design does not define. This is the single pattern for `CONFIG_SERVICE` (config), `LOGGER`
(logging), `EVENT_BUS` (events), and any future cross-package substrate service.

## Rationale

It honors each declared `-> di` edge using `di`'s existing public primitive while inventing
nothing the designs do not specify, and it keeps construction failures on the `Result` channel
where they belong (the reason ADR-0010 rejected a turnkey `di` module). Stating the rule once
makes the logging and events edges traceable to covering text instead of to an ADR scoped to a
third package.

## Consequences

`config`, `logging`, and `events` each export one token and are registered by the composition
root; downstream packages resolve the service through the token. Behavior is unchanged. A future
turnkey `di` module for any of these services would be added by a superseding ADR that defines
its registration semantics.

## Related constitutional references

None. This is an engineering composition decision; it realizes no constitutional concept and
changes no constitutional ownership.

## Related ADRs

Generalizes ADR-0010 (configuration composition via a DI token). Relates to ADR-0005 (custom
dependency-injection container) and subsystems 04 (Configuration), 05 (Logging), 06 (Events).
