# Logging performance baselines

Observational only (Engineering Rule 5). Phase 2A records baselines; it does not
gate on them. Measurement runs outside `src`, never on a runtime path, and never
changes behavior. Micro-benchmarks are defined in `logging.bench.ts` and reproduced
with `pnpm --filter @openlance/aios-logging run bench`.

- **Recorded:** 2026-08-03
- **Environment:** Node.js 22.x, pnpm 11.5, Vitest 2.1.9, single local developer machine (Windows). Absolute numbers are machine-specific and indicative; the committed harness is the reproducible artifact, not these values.

## Applicable areas

| Area | Metric | Baseline |
|---|---|---|
| Log creation | `info` with fields, redactor, sink write | ~805K ops/s |
| Context merge | log within a `context.run` (id attach) | ~1.6M ops/s |
| Filtering | below-threshold call (dropped) | ~4.7M ops/s |
| Child logger creation | `child(fields)` | ~2.3M ops/s |
| Serialization | `JSON.stringify(record)` | ~1.1M ops/s |
| Test execution | Full `vitest run --coverage` wall time (4 files, 29 tests) | ~2.2 s |
| Build | `tsup` bundle + rolled-up `.d.ts` wall time | JS ~0.06 s, dts ~1 s |
| Typecheck | `tsc --noEmit` wall time (after dependency build) | < 1 s |

## Not applicable to the logging package

These Rule 5 areas belong to packages the logging package does not own; they are measured where that concern lives.

- Startup / container build and DI resolution (DI, subsystem 03)
- Configuration merge + validate (Config, subsystem 04)
- Event dispatch per publish (Events, subsystem 06)
- Plugin discovery + validate + load (Plugins, subsystem 07)

## Explicitly out of scope (owned by Operations)

Observability signals, monitoring, health, diagnostics, and incident metrics are owned by the constitutional Operations namespace and are not measured or implemented here.
