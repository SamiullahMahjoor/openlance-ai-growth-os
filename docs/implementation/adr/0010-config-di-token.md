---
id: ADR-0010
title: Configuration composition via a dependency-injection token
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0010: Configuration composition via a dependency-injection token

## Status

Accepted

## Context

The configuration design (`docs/implementation/04-configuration.md`) declares that `@openlance/aios-config` depends on `@openlance/aios-di` (sections 2 and 4), but its interfaces (section 3) and implementation plan (section 6) never use `di`. The core configuration functionality (providers, hierarchy, schema seam, `ConfigService`, secrets, and the startup helper) is pure and uses explicit constructor injection. How config realizes the declared `config -> di` edge is therefore undefined by the design and must be decided rather than invented.

## Decision

`@openlance/aios-config` exports a `CONFIG_SERVICE` token, `Token<ConfigService>`, created with `di`'s `token()` primitive. A `ConfigService` is built from providers with `createConfigService` (which returns a `Result`, failing closed on a load failure); the composition root registers the built service under `CONFIG_SERVICE` in a container. Config does not ship a `di` module and defines no registration-time failure semantics.

## Rationale

This honors the declared `config -> di` dependency and the "dependency injected" principle using `di`'s existing public primitive, while inventing nothing the design does not specify. A full `di` module (`configModule`) was rejected for this stage because `module.register` returns `void`, so a load or validation failure during registration would need failure semantics the design does not define; keeping the build explicit (`createConfigService`) leaves that failure on the `Result` channel where it belongs.

## Consequences

Config depends on `di` for the token only. Downstream packages resolve `ConfigService` through `CONFIG_SERVICE`. If a turnkey `di` module for configuration is wanted later, it can be added by a related or superseding ADR that defines its registration semantics.

## Related constitutional references

None. This is an engineering composition decision; it realizes no constitutional concept and changes no constitutional ownership.

## Related ADRs

Relates to ADR-0005 (custom dependency-injection container) and subsystem 04 (Configuration System).
