import type { LogRecord } from './record.js';

/**
 * The vendor-neutral seam through which records leave the process. A sink only
 * receives finished, immutable records; it never classifies, decides, or shapes
 * them. Concrete sinks (console, file, or a vendor transport) are provided outside
 * this package, behind this interface, so no logging vendor is named here.
 */
export interface LogSink {
  write(record: LogRecord): void;
}
