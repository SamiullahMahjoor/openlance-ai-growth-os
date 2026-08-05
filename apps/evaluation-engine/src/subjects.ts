import type { EvaluationSubjectKind } from './types.js';

/**
 * The subject namespaces whose output an evaluation may assess (the constitution names exactly these). Evaluation
 * observes their outputs one-directionally and owns none of their behavior. Frozen.
 */
export const SUBJECT_KINDS: readonly EvaluationSubjectKind[] = Object.freeze([
  'agent',
  'reasoning',
  'retrieval',
  'prompt',
  'provider',
  'tool',
  'memory',
]);

/** Whether a value names a known subject namespace. Zero-trust: an unrecognized subject is never assessed. */
export const isSubjectKind = (value: string): value is EvaluationSubjectKind =>
  (SUBJECT_KINDS as readonly string[]).includes(value);
