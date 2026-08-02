# @openlance/aios-kernel

The zero-dependency root of the implementation substrate. Every other package depends on the kernel; the kernel depends on nothing.

## Owned concern

Universal engineering primitives, and nothing else. If a primitive is not required across the whole repository, it does not belong here.

- **Value types.** `Result<T, E>` for deterministic, value-based failure handling, and `Option<T>` for explicit presence or absence, each with a total set of combinators.
- **Nominal typing.** `Brand<T, B>` and the `brand` helper, plus the canonical identifiers `CorrelationId` and `TraceId` and their constructors.
- **Determinism seams.** The `Clock` and `IdGenerator` interfaces, and `SystemClock`, the single sanctioned wrapper around real time. Time and identity enter the system only through these seams, so logic is reproducible under identical inputs.
- **Lifecycle.** The `Disposable` teardown contract, synchronous or asynchronous.

## What the kernel does not own

No AI concept, no business concept, and no engineering-subsystem behavior: no dependency injection, configuration, logging, events, plugins, providers, tools, or runtime. Those are owned by their respective packages, which depend on the kernel, never the reverse.

## Constitutional traceability

The kernel realizes no single constitutional document; it owns no namespace concept. Its `aios.constitution` field is therefore intentionally empty. What it provides is the code-level determinism seams (`Clock`, `IdGenerator`) and value-based failure handling (`Result`) that realize the determinism invariant expressed across `ai/reasoning`, `ai/memory`, and `ai/providers` (see the design analysis in [docs/implementation/01-core-framework.md](../../docs/implementation/01-core-framework.md)). The kernel restates no constitutional text; it only makes the invariant mechanically achievable. `Result` ownership is fixed by [ADR-0006](../../docs/implementation/adr/0006-result-error-handling.md); the combinator export strategy by [ADR-0008](../../docs/implementation/adr/0008-kernel-combinator-exports.md).

## Public API

The single supported surface is the package barrel (`@openlance/aios-kernel`). Deep imports into internal modules are prohibited and fail CI (Engineering Rule 1).

```ts
import { ok, err, isOk, map, andThen, unwrapOr } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

const parsePort = (raw: string): Result<number, string> => {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? ok(n) : err(`invalid port: ${raw}`);
};

const doubled = map(parsePort('8080'), (p) => p * 2);
const port = unwrapOr(doubled, 0);
```

`Option` combinators carry an `Option` suffix (`mapOption`, `andThenOption`, `unwrapOrOption`) so the flat `Result` surface is preserved without a name collision in the barrel (ADR-0008).

```ts
import { fromNullable, mapOption, unwrapOrOption } from '@openlance/aios-kernel';

const findHeader = (headers: Map<string, string>, name: string) =>
  fromNullable(headers.get(name)); // Option<string>

const length = unwrapOrOption(
  mapOption(findHeader(headers, 'x-trace'), (h) => h.length),
  0,
);
```

Time and identity are received by injection; only the composition edge constructs a `SystemClock` or a concrete `IdGenerator`.

```ts
import { SystemClock } from '@openlance/aios-kernel';
import type { Clock } from '@openlance/aios-kernel';

const clock: Clock = new SystemClock(); // real time, at the edge only
```

## Stability

`Very High` (Engineering Rule 4). The kernel is the foundation of the whole graph; a breaking change to its public surface requires an ADR and a generation bump.
