# Subsystem 02, Error Framework (`@openlance/aios-errors`)

## 1. Architectural analysis

Errors are standardized so failure is **deterministic and inspectable**, never stack-shaped or ad hoc. The kernel owns the `Result` type; this package owns the **error hierarchy** and the helpers that bridge exceptions to `Result`. Three categories match how the constitution reasons about failure: domain (a rule/expectation was violated), infrastructure (a dependency failed), validation (input did not conform). Every error carries a **stable code** and structured context so the same failure is identical across runs, the code-level form of the determinism invariant.

## 2. Package design

`@openlance/aios-errors`, depends on `kernel` only. Modules: `base`, `domain`, `infrastructure`, `validation`, `codes`, `result-interop`. Foundational: it sits below DI so any package can use standardized errors.

## 3. Interface design

```ts
export type ErrorCategory = 'domain' | 'infrastructure' | 'validation';

export abstract class BaseError extends Error {
  abstract readonly category: ErrorCategory;
  readonly code: string;                 // stable, registry-checked, e.g. "CONFIG.MISSING_KEY"
  readonly context: Readonly<Record<string, unknown>>;
  readonly cause?: unknown;
  constructor(code: string, message: string, context?: Record<string, unknown>, cause?: unknown);
  toJSON(): { code: string; category: ErrorCategory; message: string; context: object };
}

export class DomainError         extends BaseError { readonly category = 'domain' }
export class InfrastructureError extends BaseError { readonly category = 'infrastructure' }
export class ValidationError     extends BaseError {
  readonly category = 'validation';
  readonly issues: ReadonlyArray<{ path: string; message: string }>;
}

// result-interop.ts
export const fromThrowable: <T>(fn: () => T, map: (e: unknown) => BaseError) => Result<T, BaseError>;
export const toResult:      <T>(p: Promise<T>, map: (e: unknown) => BaseError) => Promise<Result<T, BaseError>>;

// codes.ts, codes are registered per package; duplicates fail a build-time check
export interface ErrorCodeRegistry { register(code: string): void; assertUnique(): void }
```

Rule: expected failures return `Result<T, BaseError>`; only genuinely unrecoverable faults throw a `BaseError`. Codes are namespaced by package (`CONFIG.*`, `DI.*`, `PLUGIN.*`) and validated for uniqueness at build time.

## 4. Dependency graph

`errors ◀ kernel`. Depended on by di, config, logging, events, plugins, testing.

## 5. Folder structure

```
packages/errors/
  src/ index.ts base.ts domain.ts infrastructure.ts validation.ts codes.ts result-interop.ts
  tests/ base.test.ts validation.test.ts result-interop.test.ts
  package.json tsconfig.json README.md
```

## 6. Implementation plan

1. `BaseError` with stable `code`, structured `context`, `cause`, JSON serialization (no stack in serialized form → deterministic).
2. Three category subclasses; `ValidationError` carries structured issues.
3. `result-interop` bridges (`fromThrowable`, `toResult`).
4. `codes` registry + build-time uniqueness assertion.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Code collisions across packages | Build-time uniqueness check over all registered codes. |
| Non-deterministic serialization (stack, timestamps) | `toJSON` excludes stack; timestamps come from injected `Clock` at the logging edge, not the error. |
| Category misuse | ADR + review checklist mapping failure kinds to categories. |

## 8. Acceptance criteria

- Every thrown/returned error is a `BaseError` subclass with a registered, unique code.
- `toJSON` output is deterministic for identical inputs (no stack, no ambient time).
- `Result` interop helpers covered by tests including the throwing path.
