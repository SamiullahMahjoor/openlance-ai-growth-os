# Events performance baselines

Observational only (Engineering Rule 5). Phase 2A records baselines; it does not
gate on them. Measurement runs outside `src`, never on a runtime path, and never
changes behavior. Micro-benchmarks are defined in `events.bench.ts` and reproduced
with `pnpm --filter @openlance/aios-events run bench`.

- **Recorded:** 2026-08-03
- **Environment:** Node.js 22.x, pnpm 11.5, Vitest 2.1.9, single local developer machine (Windows). Absolute numbers are machine-specific and indicative; the committed harness is the reproducible artifact, not these values.

## Applicable areas

| Area | Metric | Baseline |
|---|---|---|
| Envelope creation | `createEvent` (stamp + freeze) | ~3.3M ops/s |
| Publish | `publish` to 2 handlers | ~925K ops/s |
| Dispatch | `publish` to 5 handlers | ~604K ops/s |
| Handler lookup | `publish` to a type with no handlers | ~1.1M ops/s |
| Subscription | `subscribe` + `dispose` | ~3.5M ops/s |
| Test execution | Full `vitest run --coverage` wall time (4 files, 21 tests) | ~3.9 s |
| Build | `tsup` bundle + rolled-up `.d.ts` wall time | JS ~0.06 s, dts ~1 s |
| Typecheck | `tsc --noEmit` wall time (after dependency build) | < 1 s |

Publish/dispatch throughput is measured as full `await`ed round-trips (the bus awaits every handler in order); async round-trip overhead dominates these numbers.

## Not applicable to the events package

These Rule 5 areas belong to packages the events package does not own; they are measured where that concern lives.

- Startup / container build and DI resolution (DI, subsystem 03)
- Configuration merge + validate (Config, subsystem 04)
- Logging overhead per record (Logging, subsystem 05)
- Plugin discovery + validate + load (Plugins, subsystem 07)

## Explicitly out of scope

Distributed messaging, persistence, replay, retries, scheduling, and the runtime AI event-lifecycle are not implemented here (owned by other namespaces) and are not measured.
