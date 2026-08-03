# Testing-infrastructure performance baselines

Observational only (Engineering Rule 5). Phase 2A records baselines; it does not
gate on them. Measurement runs outside `src`, never on a runtime path, and never
changes behavior. Micro-benchmarks are defined in `testing.bench.ts` and reproduced
with `pnpm --filter @openlance/aios-testing run bench`.

- **Recorded:** 2026-08-03
- **Environment:** Node.js 22.x, pnpm 11.5, Vitest 2.1.9, single local developer machine (Windows). Absolute numbers are machine-specific and indicative; the committed harness is the reproducible artifact, not these values.

## Applicable areas

| Utility | Metric | Baseline |
|---|---|---|
| `FixedClock.now` | read fixed time | ~7.7M ops/s |
| `SequentialId.next` | next deterministic id | ~6.2M ops/s |
| `mock` | build a partial double | ~5.1M ops/s |
| `spy` | build + one recorded call | ~2.5M ops/s |
| `CapturingSink.write` | capture a record (fresh sink) | ~4.2M ops/s |
| `InMemoryEventBus.publish` | capture + deliver (fresh bus, no subscribers) | ~1.6M ops/s |
| `createTestContainer` | fresh isolated container | ~3.1M ops/s |
| `createHarness` | boot the deterministic seams | ~1.1M ops/s |
| Test execution | Full `vitest run --coverage` wall time (6 files, 28 tests) | ~2.3 s |
| Build | `tsup` bundle + rolled-up `.d.ts` wall time | JS ~0.06 s, dts ~1 s |
| Typecheck | `tsc --noEmit` wall time (after dependency build) | < 1 s |

## Not applicable

This package is development tooling. The subsystem performance areas (startup, DI
resolution, config, logging, events, plugin discovery) are measured in the packages
that own those concerns; this package only provides deterministic seams for those
measurements. It is a runtime dependency of no package and is never on a production
path.
