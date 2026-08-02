/**
 * Canonical shared value types reused across the substrate. These are the
 * "canonical id types re-used downstream" named in the design
 * (docs/implementation/01-core-framework.md, section 6). They own no AI or
 * business concept; they are engineering identifiers with a nominal brand so a
 * correlation id can never be passed where a trace id is expected.
 */

import { brand, type Brand } from './brand.js';

/** Correlates all work triggered by a single inbound request or operation. */
export type CorrelationId = Brand<string, 'CorrelationId'>;

/** Identifies a single distributed trace across components. */
export type TraceId = Brand<string, 'TraceId'>;

/** Canonical constructor for a {@link CorrelationId}. */
export const correlationId = (value: string): CorrelationId =>
  brand<string, 'CorrelationId'>(value);

/** Canonical constructor for a {@link TraceId}. */
export const traceId = (value: string): TraceId => brand<string, 'TraceId'>(value);
