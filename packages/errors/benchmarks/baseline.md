# Errors performance baselines

Observational only (Engineering Rule 5). Phase 2A records baselines; it does not
gate on them. Measurement runs outside `src`, never on a runtime path, and never
changes behavior. Micro-benchmarks are defined in `errors.bench.ts` and reproduced
with `pnpm --filter @openlance/aios-errors run bench`.

- **Recorded:** 2026-08-03
- **Environment:** Node.js 22.x, pnpm 11.5, Vitest 2.1.9, single local developer machine (Windows). Absolute numbers are machine-specific and indicative; the committed harness is the reproducible artifact, not these values.

## Applicable areas

| Area | Metric | Baseline |
|---|---|---|
| Test execution | Full `vitest run --coverage` wall time (4 files, 24 tests) | ~2.0 s |
| Build | `tsup` bundle + rolled-up `.d.ts` wall time | JS ~0.06 s, dts ~1.1 s |
| Typecheck | `tsc --noEmit` wall time (after kernel build) | < 1 s |

## Primitive micro-baselines (throughput)

From `errors.bench.ts`. Error construction is dominated by the native `Error`
stack capture in `super(message)`; this is inherent to extending `Error` and is
observational, not a target for optimization.

| Operation | Throughput (ops/s, indicative) |
|---|---|
| `BaseError.toJSON` | ~8.0M |
| `fromThrowable` (return path) | ~4.0M |
| construct `ValidationError` | ~44K |
| construct `DomainError` | ~40K |
| `fromThrowable` (throw path) | ~21K |

## Not applicable to the errors package

These Rule 5 areas belong to packages the errors package does not own; they are measured where that concern lives.

- Startup / container build and module registration (DI, subsystem 03)
- DI resolution per lifetime (DI, subsystem 03)
- Configuration merge + validate (Config, subsystem 04)
- Logging overhead per record (Logging, subsystem 05)
- Event dispatch per publish (Events, subsystem 06)
- Plugin discovery + validate + load (Plugins, subsystem 07)
