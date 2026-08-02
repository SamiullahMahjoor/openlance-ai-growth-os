# @openlance/aios-logging

The logging substrate. It sits above the kernel, errors, DI, and config, and below events, plugins, and the namespace packages.

## Architecture

Logging turns program activity into structured, correlated, immutable records. Timestamps come from an injected `Clock` (never `Date.now()`), correlation ids from an ambient `CorrelationContext`, and records leave the process through a vendor-neutral `LogSink` seam. Given a fixed clock and context, identical inputs produce identical records.

## Ownership and constitutional boundaries

This package owns only the engineering logging mechanism: the abstraction through which logging may occur. It emits records and nothing else. It classifies nothing, raises nothing, and decides nothing.

It explicitly does **not** own observability, monitoring, health, diagnostics, incident management, runtime events, telemetry analysis, log storage, log shipping, log aggregation, dashboards, or operational policy. Those belong to the constitutional **Operations** namespace (`ai/operations`) and are built later. Operations will consume these records to form signals and awareness; this package sits below that model.

## Provider neutrality

No logging vendor is named anywhere. Only the `LogSink` abstraction is public; concrete sinks (console, file, or a vendor transport) are supplied outside this package, behind the seam. Per this stage's scope, **no concrete sink is shipped** (not even a development console sink); tests use an in-memory sink double. See the limitations note.

## Dependency rules

Depends only on `@openlance/aios-kernel` (`Clock`), `@openlance/aios-errors` (`ValidationError`), `@openlance/aios-di` (the `LOGGER` token), and `@openlance/aios-config` (the level schema and the `SecretRef` redaction convention). It introduces no reverse dependency and stays within the substrate ordering.

## Public API

The single supported surface is the barrel (`@openlance/aios-logging`); deep imports fail CI (Engineering Rule 1). The `Logger` and `CorrelationContext` implementations are internal and are created through `createLogger` and `createCorrelationContext`.

`LogLevel` · `LogRecord` · `LogSink` · `Logger` · `LoggerOptions` · `createLogger` · `LOGGER` · `CorrelationContext` · `createCorrelationContext` · `Redactor` · `createRedactor` · `logLevelSchema`.

## Structured logging model

- **Levels.** `trace < debug < info < warn < error < fatal`. A record below the logger's configured threshold is dropped.
- **Records.** Each record carries `level`, `message`, an injected `timestamp`, optional `correlationId` / `traceId` / `spanId`, and a frozen `fields` object. Records are immutable.
- **Context.** `CorrelationContext.run(ids, fn)` establishes ids for a scope (including async continuations); a logger reads `current()` and attaches the ids present.
- **Child loggers.** `logger.child(fields)` binds fields for a scope; a child's records include the parent's bound fields merged with its own (child overrides), with no new state.
- **Redaction.** A `Redactor` removes secret-shaped values before they reach a record: any `SecretRef` value (the configuration secret convention) and any field whose key is configured sensitive.

## Configuration integration

The logging threshold is read from configuration and injected: a composition root validates the configured level through `logLevelSchema` (a `@openlance/aios-config` `Schema<LogLevel>`) and passes it to `createLogger`. The logger itself reads no configuration directly.

```ts
import { createLogger, logLevelSchema } from '@openlance/aios-logging';
import { SystemClock } from '@openlance/aios-kernel';

const level = config.getSection('logLevel', logLevelSchema); // Result<LogLevel, ConfigError>
if (level.ok) {
  const logger = createLogger({ level: level.value, clock: new SystemClock(), sinks: [mySink] });
}
```

## Constitutional traceability

Owns no constitutional concept; `aios.constitution` is intentionally empty. It provides the record-emitting substrate below the Operations observability model, restating no constitutional text. The Operations deferral above is the constitutional boundary this package honors.

## Limitations

- **No concrete sinks are shipped.** Only the `LogSink` abstraction is provided this stage; the design's development-only `ConsoleSink` is deferred (see ADR-0011), in line with the mandate to ship abstractions and neutral mechanisms only.
- No observability, monitoring, health, or incident logic (Operations deferral).
- `CorrelationContext` is backed by async-local storage; correlation ids are supplied by the caller through `run`, never generated here.
- Redaction is key- and `SecretRef`-based; it does not deep-scan nested structures.

## Stability

`Medium` (Engineering Rule 4). Widely used but additive by nature; a public-surface change requires review.
