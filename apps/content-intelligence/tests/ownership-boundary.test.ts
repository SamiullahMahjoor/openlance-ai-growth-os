import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { isOk } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import {
  CONTENT_CAPABILITIES,
  ContentFramer,
  ContentHash,
  isContentCapability,
} from '../src/index';

/**
 * Architectural ownership boundary (ADR-0050): Content Intelligence owns the content-creation behavior only. It consumes
 * a Marketing Intelligence output by reference, but must NEVER produce a MarketingBrief, a marketing strategy artifact,
 * or any marketing output, and must never re-export the marketing output contract. These are permanent boundary tests
 * that fail the build on ownership drift.
 */
const indexPath = fileURLToPath(new URL('../src/index.ts', import.meta.url));

describe('ownership boundary: Content owns content behavior only (ADR-0050)', () => {
  it('produces and re-exports no marketing artifact (it only consumes one by reference)', () => {
    const index = readFileSync(indexPath, 'utf8').toLowerCase();
    // Content may import the MarketingBrief type internally (integration.ts) as input, but the public API must not
    // re-export it or the marketing capability set, so Content produces no marketing output.
    expect(index.includes('marketingbrief')).toBe(false);
    expect(index.includes('marketing_capabilities')).toBe(false);
    expect(index.includes('marketingintelligence')).toBe(false);
  });

  it('produces a ContentPlan (a content artifact), never a marketing artifact', () => {
    const result = new ContentFramer(new ContentHash()).frame({
      capability: 'blog',
      objective: 'explain fair fees',
      agent: 'content-intelligence',
      marketing: 'marketing-brief-1',
      brandVoice: 'knowledge/brand/voice.md',
    });
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const plan = result.value;
    expect(CONTENT_CAPABILITIES).toContain(plan.capability);
    // A content plan carries the content fields (brandVoice, a consumed marketing reference).
    expect('brandVoice' in plan && 'marketing' in plan).toBe(true);
  });

  it('does not own any marketing capability', () => {
    for (const marketingCapability of [
      'positioning',
      'messaging',
      'funnel-strategy',
      'gtm-planning',
    ]) {
      expect(isContentCapability(marketingCapability)).toBe(false);
    }
  });
});
