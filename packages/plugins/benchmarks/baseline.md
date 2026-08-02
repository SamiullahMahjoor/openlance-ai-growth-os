# Plugins performance baselines

Observational only (Engineering Rule 5). Phase 2A records baselines; it does not
gate on them. Measurement runs outside `src`, never on a runtime path, and never
changes behavior. Micro-benchmarks are defined in `plugins.bench.ts` and reproduced
with `pnpm --filter @openlance/aios-plugins run bench`.

- **Recorded:** 2026-08-03
- **Environment:** Node.js 22.x, pnpm 11.5, Vitest 2.1.9, single local developer machine (Windows). Absolute numbers are machine-specific and indicative; the committed harness is the reproducible artifact, not these values.

## Applicable areas

| Area | Metric | Baseline |
|---|---|---|
| Compatibility validation | `validateCompatibility` over two manifests with a dependency | ~535K ops/s |
| Registration | `load` a manifest into a fresh host | ~2.4M ops/s |
| Registry lookup | `load` two manifests (name lookups) | ~2.2M ops/s |
| Activation | `load` + `start` (register, init, start) | ~325K ops/s |
| Deactivation | `start` + `stop` (full up-and-down cycle) | ~160K ops/s |
| Test execution | Full `vitest run --coverage` wall time (4 files, 32 tests) | ~1.9 s |
| Build | `tsup` bundle + rolled-up `.d.ts` wall time | JS ~0.06 s, dts ~1 s |
| Typecheck | `tsc --noEmit` wall time (after dependency build) | < 1 s |

Activation and deactivation are measured as full `await`ed cycles (each lifecycle
transition also publishes a `framework.plugin.*` event through the bus); async
round-trip and event dispatch dominate those numbers.

## Not applicable to the plugins package

These Rule 5 areas belong to packages the plugins package does not own; they are measured where that concern lives.

- Startup / container build and DI resolution (DI, subsystem 03)
- Configuration merge + validate (Config, subsystem 04)
- Logging overhead per record (Logging, subsystem 05)
- Event dispatch per publish (Events, subsystem 06)

## Explicitly out of scope

Runtime discovery, filesystem/package scanning, dynamic loading, deployment, and any provider/tool/namespace module are not implemented here (owned by other namespaces) and are not measured.
