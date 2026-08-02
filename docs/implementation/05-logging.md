# Subsystem 05, Logging Framework (`@openlance/aios-logging`)

> **Classification:** Engineering mechanism. Owns no AI concept.
> **Adjacent architecture (deferred, not implemented in 2A):** Observability, `ai/operations/observability.md` (signals, operational awareness) and monitoring/health, `ai/operations/`. This package emits log records; it does **not** define what a signal means, operational awareness, monitoring, or health. Those remain owned by Operations and are built later.

## 1. Architectural analysis

Logging is the substrate that turns program activity into structured, correlated records. It is deliberately *below* the Operations observability model: Operations, when implemented, will consume these records to form signals and awareness, but this package neither classifies health, raises incidents, nor decides anything, it only records. Timestamps come from the injected `Clock` and correlation from an ambient context seam, so the same run produces the same records (determinism in code). The sink is abstracted so no logging vendor is named anywhere.

## 2. Package design

`@openlance/aios-logging`, depends on `kernel`, `errors`, `di`, `config`. Modules: `level`, `record`, `logger`, `sink`, `context`, `redaction`. Ships a `ConsoleSink` for development only; production sinks are provided later behind the same abstraction.

## 3. Interface design

```ts
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogRecord {
  readonly level: LogLevel;
  readonly message: string;
  readonly timestamp: number;                 // from injected Clock, not Date.now()
  readonly correlationId?: string;
  readonly traceId?: string;
  readonly spanId?: string;
  readonly fields: Readonly<Record<string, unknown>>;   // structured, redacted
}

export interface Logger {
  log(level: LogLevel, message: string, fields?: Record<string, unknown>): void;
  trace(m: string, f?: Record<string, unknown>): void;
  debug(m: string, f?: Record<string, unknown>): void;
  info(m: string, f?: Record<string, unknown>): void;
  warn(m: string, f?: Record<string, unknown>): void;
  error(m: string, f?: Record<string, unknown>): void;
  fatal(m: string, f?: Record<string, unknown>): void;
  child(fields: Record<string, unknown>): Logger;        // bound context
}

export interface LogSink { write(record: LogRecord): void }          // vendor-neutral seam

export interface CorrelationContext {                                // AsyncLocalStorage seam
  run<T>(ids: { correlationId: string; traceId?: string; spanId?: string }, fn: () => T): T;
  current(): { correlationId?: string; traceId?: string; spanId?: string };
}

export interface Redactor { redact(fields: Record<string, unknown>): Record<string, unknown> }
```

`Logger` composes level threshold (from `config`), the `CorrelationContext` (auto-attaches ids), `Redactor` (drops secret-shaped fields; pairs with subsystem 04), and one or more `LogSink`s. `child()` binds fields for a scope without new state.

## 4. Dependency graph

`logging ◀ {kernel, errors, di, config}`. Depended on by events, plugins, namespace packages.

## 5. Folder structure

```
packages/logging/
  src/ index.ts level.ts record.ts logger.ts sink.ts console-sink.ts context.ts redaction.ts
  tests/ logger.test.ts context.test.ts redaction.test.ts
  package.json tsconfig.json README.md
```

## 6. Implementation plan

1. `LogLevel` + threshold (level from `config`).
2. `LogRecord` (timestamp from `Clock`); `Logger` + `child()`.
3. `LogSink` abstraction + `ConsoleSink` (dev only).
4. `CorrelationContext` via AsyncLocalStorage seam; auto-attach ids.
5. `Redactor` for secret-shaped fields; integrate with config secret conventions.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Drifting into observability (health/incidents) | Hard scope: records only; no classification/decision; README states the Operations deferral. |
| Secret leakage into logs | `Redactor` + `SecretRef` opacity from subsystem 04; test asserts redaction. |
| Non-deterministic timestamps | Timestamp always from injected `Clock`; lint bans `Date.now()`. |
| Vendor lock-in | Only `LogSink` is public; no vendor named; `ConsoleSink` is dev-only. |

## 8. Acceptance criteria

- Records are structured, correlated, and carry an injected timestamp; identical inputs under a `FixedClock` produce identical records.
- No logging vendor appears anywhere; sinks are pluggable behind `LogSink`.
- Secret-shaped fields are redacted (tested).
- Package emits records only, it performs no health, monitoring, or incident logic (Operations deferral honored).
