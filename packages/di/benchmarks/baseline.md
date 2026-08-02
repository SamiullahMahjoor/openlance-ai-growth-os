# DI performance baselines

Observational only (Engineering Rule 5). Phase 2A records baselines; it does not
gate on them. Measurement runs outside `src`, never on a runtime path, and never
changes behavior. Micro-benchmarks are defined in `di.bench.ts` and reproduced with
`pnpm --filter @openlance/aios-di run bench`.

- **Recorded:** 2026-08-03
- **Environment:** Node.js 22.x, pnpm 11.5, Vitest 2.1.9, single local developer machine (Windows). Absolute numbers are machine-specific and indicative; the committed harness is the reproducible artifact, not these values.

## Applicable areas

| Area | Metric | Baseline |
|---|---|---|
| Registration | `register` a service | ~2.4M ops/s |
| Resolution | resolve a cached singleton | ~4.2M ops/s |
| Resolution | resolve a transient | ~3.1M ops/s |
| Startup validation | `validate()` a small graph | ~715K ops/s |
| Graph build | `ModuleHost.build()` a single module (order + validate) | ~617K ops/s |
| Test execution | Full `vitest run --coverage` wall time (4 files, 36 tests) | ~1.8 s |
| Build | `tsup` bundle + rolled-up `.d.ts` wall time | JS ~0.06 s, dts ~1 s |
| Typecheck | `tsc --noEmit` wall time (after dependency build) | < 1 s |

## Not applicable to the DI package

These Rule 5 areas belong to packages the DI package does not own; they are measured where that concern lives.

- Configuration merge + validate (Config, subsystem 04)
- Logging overhead per record (Logging, subsystem 05)
- Event dispatch per publish (Events, subsystem 06)
- Plugin discovery + validate + load (Plugins, subsystem 07)
