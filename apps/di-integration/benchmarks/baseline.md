# DI-integration baseline

Observational micro-baseline (Engineering Rule 5, ADR-0022). Measurement only: it joins the composition root and
the namespace wiring into an immutable integration handle; it executes nothing, registers no service, activates
nothing, and holds no runtime state. The one executable path is `integrate`, which:

- delegates dependency-graph validation to the frozen `di` container (`wired.application.container.validate()`),
  failing closed on any problem,
- references the injectable substrate surface from the composition root
  (`wired.application.diagnostics.services`), re-registering nothing,
- records each wired namespace's injection readiness over 13 nodes (with an empty binding set today), and
- returns an immutable `IntegratedApplication`.

The measured cost is a delegated graph validation plus a bounded readiness projection over 13 nodes and a shallow
freeze; it recreates no container/registry/resolver and re-encodes no constitutional dependency map.

Run with `pnpm --filter @openlance/aios-di-integration bench`. `integrate` is deterministic over the fixed frozen
inputs, so throughput is high and the number is recorded here only as an observational baseline, not a threshold.
