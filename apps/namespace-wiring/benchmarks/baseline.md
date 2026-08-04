# Namespace-wiring baseline

Observational micro-baseline (Engineering Rule 5, ADR-0022). Measurement only: it builds the namespace manifest
and extends a Stage 1 Application; it executes nothing, registers no service, and holds no runtime state. The one
executable path is `wireNamespaces`, which:

- builds the canonical 13-namespace source set from the frozen namespace barrels (each paired with its slug,
  constitution README id, and a stable exported catalog referenced for availability),
- validates it structurally (blank slug, blank constitution, empty catalog, duplicate slug, dangling
  dependency), failing closed, and
- returns an immutable `WiredApplication` (the Stage 1 Application, the validated manifest, and diagnostics).

The measured cost is a bounded structural validation over 13 nodes with empty edges plus a shallow freeze; it
recreates no container/registry/resolver and re-encodes no constitutional dependency map.

Run with `pnpm --filter @openlance/aios-namespace-wiring bench`. `wireNamespaces` is deterministic over the
fixed frozen namespaces, so throughput is high and the number is recorded here only as an observational
baseline, not a threshold.
