# Kernel performance baselines

Observational only (Engineering Rule 5). Phase 2A records baselines; it does not
gate on them. Measurement runs outside `src`, never on a runtime path, and never
changes behavior. Micro-benchmarks are defined in `kernel.bench.ts` and reproduced
with `pnpm --filter @openlance/aios-kernel run bench`.

- **Recorded:** 2026-08-03
- **Environment:** Node.js 22.x, pnpm 11.5, Vitest 2.1.9, single local developer machine (Windows). Absolute numbers are machine-specific and indicative; the committed harness is the reproducible artifact, not these values.

## Applicable areas

The kernel is pure primitives, so most Rule 5 areas do not apply to it. The areas it does have:

| Area | Metric | Baseline |
|---|---|---|
| Test execution | Full `vitest run --coverage` wall time (5 files, 23 tests) | ~2.3 s |
| Build | `tsup` bundle + rolled-up `.d.ts` wall time | JS ~0.11 s, dts ~0.85 s |
| Typecheck | `tsc --noEmit` wall time | ~2.2 s |

## Primitive micro-baselines (throughput)

From `kernel.bench.ts`. High relative-margin-of-error is expected for sub-microsecond operations under a JIT and GC; these are indicative, not gates.

| Operation | Throughput (ops/s, indicative) |
|---|---|
| `brand` | ~2.9M |
| `fromNullable` (Option) | ~2.8M |
| `SystemClock.now` | ~2.4M |
| `unwrapOr` (Result, err branch) | ~2.3M |
| `map` (Result, ok branch) | ~2.3M |
| `mapOption` (Option, some branch) | ~2.1M |
| `andThen` (Result, ok branch) | ~1.8M |

## Not applicable to the kernel

These Rule 5 areas belong to packages the kernel does not own; they are measured where that concern lives, not here.

- Startup / container build and module registration (DI, subsystem 03)
- DI resolution per lifetime (DI, subsystem 03)
- Configuration merge + validate (Config, subsystem 04)
- Logging overhead per record (Logging, subsystem 05)
- Event dispatch per publish (Events, subsystem 06)
- Plugin discovery + validate + load (Plugins, subsystem 07)
