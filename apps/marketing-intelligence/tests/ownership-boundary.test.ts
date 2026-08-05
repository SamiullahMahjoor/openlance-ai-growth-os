import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isOk } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import {
  MARKETING_CAPABILITIES,
  MarketingFramer,
  MarketingHash,
  isMarketingCapability,
} from '../src/index';

/**
 * Architectural ownership boundary (ADR-0049): Marketing Intelligence owns the marketing-intelligence behavior only. It
 * must NEVER produce a ContentPlan, a content artifact, or any content output, and must never drift into content
 * creation. These are permanent boundary tests that fail the build on ownership drift.
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const CONTENT_TOKENS = [
  'content-intelligence',
  'contentintelligence',
  'contentplan',
  'contentrequest',
  'contentframer',
];

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('ownership boundary: Marketing owns marketing behavior only (ADR-0049)', () => {
  it('never references, imports, or produces content', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8').toLowerCase();
      for (const token of CONTENT_TOKENS) {
        expect(text.includes(token), `${file} references the content token '${token}'`).toBe(false);
      }
    }
  });

  it('produces a MarketingBrief (a marketing artifact), never a content artifact', () => {
    const result = new MarketingFramer(new MarketingHash()).frame({
      capability: 'positioning',
      objective: 'win the mid-market',
      agent: 'marketing-intelligence',
      knowledge: ['knowledge/marketing/positioning.md'],
    });
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const brief = result.value;
    expect(MARKETING_CAPABILITIES).toContain(brief.capability);
    expect('deliverable' in brief && 'request' in brief).toBe(true);
    // A content artifact carries a brandVoice; a marketing brief never does.
    expect('brandVoice' in brief).toBe(false);
  });

  it('does not own any content capability', () => {
    for (const contentCapability of ['blog', 'landing-page', 'email-campaign', 'newsletter']) {
      expect(isMarketingCapability(contentCapability)).toBe(false);
    }
  });
});
