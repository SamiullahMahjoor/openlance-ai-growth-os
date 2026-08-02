import { ValidationError } from '@openlance/aios-errors';
import type { Schema } from '@openlance/aios-config';
import { err, ok } from '@openlance/aios-kernel';

/** Log severities, from least to most severe. */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

const LEVELS: readonly LogLevel[] = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

const ORDER: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

/** Internal: true when `level` is at least as severe as `threshold`. */
export const meetsThreshold = (level: LogLevel, threshold: LogLevel): boolean =>
  ORDER[level] >= ORDER[threshold];

const isLogLevel = (value: string): value is LogLevel =>
  (LEVELS as readonly string[]).includes(value);

/**
 * A configuration schema that validates a value into a `LogLevel`. This is the
 * configuration integration: a composition root reads the logging threshold from
 * configuration through this schema (for example `config.getSection('logLevel',
 * logLevelSchema)`) and injects it into the logger.
 */
export const logLevelSchema: Schema<LogLevel> = {
  parse: (input) =>
    typeof input === 'string' && isLogLevel(input)
      ? ok(input)
      : err(
          new ValidationError('LOG.INVALID_LEVEL', 'invalid log level', [
            { path: 'level', message: `must be one of: ${LEVELS.join(', ')}` },
          ]),
        ),
};
