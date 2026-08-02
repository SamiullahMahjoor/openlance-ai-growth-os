# @openlance/aios-errors

The deterministic engineering error taxonomy. It sits directly above the kernel and below dependency injection, so any package can model failure the same way.

## Owned concern

Engineering error modeling, and nothing else.

- **Error hierarchy.** `BaseError` (abstract) and its three categories: `DomainError` (a rule or expectation was violated), `InfrastructureError` (a dependency failed), and `ValidationError` (input did not conform, carrying structured `issues`).
- **Stable, structured failure.** Every error has a stable `code`, a frozen `context`, and an optional `cause`. `toJSON` is deterministic: it emits exactly `code`, `category`, `message`, and `context`, and never the stack or any timestamp, so identical failures serialize identically.
- **Code registry.** `ErrorCodeRegistry` and `InMemoryErrorCodeRegistry` enforce that codes, namespaced per package (`CONFIG.*`, `DI.*`, ...), are globally unique; `assertUnique` is run by the build wiring.
- **Result bridges.** `fromThrowable` and `toResult` convert throwing code into the value-based `Result` channel owned by `@openlance/aios-kernel`.

## What the errors package does not own

Logging, configuration, dependency injection, events, plugins, runtime behavior, retry, recovery, monitoring, observability, and incident handling are each owned elsewhere. It is not a utility package; it models errors and nothing more.

Crucially, this is an **engineering** taxonomy. The constitutional refusal, escalation, and safe-failure models (owned by Safety and Governance) are distinct and deferred; they map onto this taxonomy later but are not implemented here (ADR-0006).

## Constitutional traceability

Like the kernel, this package owns no constitutional concept, so its `aios.constitution` field is intentionally empty. It realizes the determinism invariant at the level of failure: deterministic, inspectable, value-based errors (design [docs/implementation/02-error-framework.md](../../docs/implementation/02-error-framework.md); `Result` ownership fixed by [ADR-0006](../../docs/implementation/adr/0006-result-error-handling.md)). It restates no constitutional text.

## Public API

The single supported surface is the barrel (`@openlance/aios-errors`); deep imports fail CI (Engineering Rule 1).

```ts
import { DomainError, ValidationError, fromThrowable } from '@openlance/aios-errors';
import type { Result } from '@openlance/aios-kernel';

// Expected failures are returned as Result, not thrown.
const parse = (raw: string): Result<number, DomainError> =>
  fromThrowable(
    () => {
      const n = Number(raw);
      if (!Number.isInteger(n)) throw new DomainError('D.NOT_INT', `not an integer: ${raw}`);
      return n;
    },
    (e) => (e instanceof DomainError ? e : new DomainError('D.NOT_INT', 'parse failed', {}, e)),
  );

const invalid = new ValidationError('V.SIGNUP', 'invalid signup', [
  { path: 'email', message: 'must be an email' },
]);
```

## Serialization note

`toJSON` is defined once, on `BaseError`, and returns `code`, `category`, `message`, and `context` only. `ValidationError.issues` is a first-class, inspectable property but is intentionally not added to `toJSON`; the design specifies a single base projection and no per-subclass serialization, and this package does not extend serialization beyond it.

## Stability

`Very High` (Engineering Rule 4). Foundational failure contracts; a breaking change to the public surface requires an ADR and a generation bump.
