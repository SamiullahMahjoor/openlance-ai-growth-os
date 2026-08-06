import { ANALYTICS_CAPABILITIES } from '@openlance/aios-analytics-intelligence';
import { CONTENT_CAPABILITIES } from '@openlance/aios-content-intelligence';
import { MARKETING_CAPABILITIES } from '@openlance/aios-marketing-intelligence';
import { SEO_CAPABILITIES } from '@openlance/aios-seo-intelligence';
import { SOCIAL_CAPABILITIES } from '@openlance/aios-social-intelligence';
import { describe, expect, it } from 'vitest';

import { CAMPAIGN_CAPABILITIES } from '../src/index';

/**
 * Permanent constitutional guard: every capability identifier across the six AI Growth OS planner subsystems
 * (Marketing -> Content -> SEO -> Social -> Analytics -> Campaign) is globally unique, and no capability is owned by
 * more than one subsystem. This is the single repository-wide disjointness guard; it lives in the terminal Campaign
 * package, which imports each sibling capability set as a type-and-value dev dependency (a test-only import, so it adds
 * no runtime dependency edge and does not affect the ratified linear dependency chain). A future capability that
 * collides with any existing identifier fails CI immediately.
 */
const SUBSYSTEMS = [
  ['marketing', MARKETING_CAPABILITIES],
  ['content', CONTENT_CAPABILITIES],
  ['seo', SEO_CAPABILITIES],
  ['social', SOCIAL_CAPABILITIES],
  ['analytics', ANALYTICS_CAPABILITIES],
  ['campaign', CAMPAIGN_CAPABILITIES],
] as const;

/** The expected per-subsystem capability counts (the ratified architecture). */
const EXPECTED_COUNTS: Record<string, number> = {
  marketing: 11,
  content: 11,
  seo: 13,
  social: 11,
  analytics: 12,
  campaign: 10,
};
const EXPECTED_TOTAL = 68;

describe('capability disjointness guard (constitutional, all six planners)', () => {
  it('each subsystem has exactly its expected capability count', () => {
    for (const [name, set] of SUBSYSTEMS) {
      expect(set.length, `${name} capability count`).toBe(EXPECTED_COUNTS[name]);
    }
  });

  it('the total capability count matches the expected architecture', () => {
    const total = SUBSYSTEMS.reduce((sum, [, set]) => sum + set.length, 0);
    expect(total).toBe(EXPECTED_TOTAL);
  });

  it('every capability identifier is globally unique (no capability appears in more than one subsystem)', () => {
    const owners = new Map<string, string[]>();
    for (const [name, set] of SUBSYSTEMS) {
      for (const capability of set) {
        const list = owners.get(capability) ?? [];
        list.push(name);
        owners.set(capability, list);
      }
    }
    // No identifier may be owned by more than one subsystem, and none may be declared twice within a subsystem.
    const collisions = [...owners.entries()].filter(([, names]) => names.length > 1);
    expect(collisions, `capability collisions: ${JSON.stringify(collisions)}`).toEqual([]);
    // The number of distinct identifiers equals the total, proving global uniqueness.
    expect(owners.size).toBe(EXPECTED_TOTAL);
  });
});
