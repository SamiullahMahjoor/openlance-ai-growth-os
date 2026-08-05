import { bench, describe } from 'vitest';

import { ContentFramer, ContentHash, ContentIntelligence } from '../src/index';
import type { ContentRequest } from '../src/index';

/**
 * Observational micro-baselines for Content Intelligence (Engineering Rule 5, ADR-0022): a full plan (framing) cycle and
 * the framer in isolation. Measurement only; deterministic over fixed inputs. Recorded results live in
 * benchmarks/baseline.md.
 */
const request: ContentRequest = {
  capability: 'blog',
  objective: 'explain fair fees',
  agent: 'content-intelligence',
  marketing: 'marketing-brief-1',
  brandVoice: 'knowledge/brand/voice.md',
  knowledge: ['knowledge/product/features.md'],
};

const engine = new ContentIntelligence();
const framer = new ContentFramer(new ContentHash());

describe('content-intelligence benchmarks', () => {
  bench('plan (full framing cycle)', () => {
    engine.plan(request);
  });
  bench('frame', () => {
    framer.frame(request);
  });
});
