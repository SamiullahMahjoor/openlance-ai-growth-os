import { isOk } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import {
  CANONICAL_CHAIN,
  GrowthWorkflowFramer,
  GrowthWorkflowHash,
  WORKFLOW_DEFINITIONS,
  WORKFLOW_TYPES,
  isWorkflowType,
} from '../src/index';
import type {
  GrowthWorkflowRequest,
  PlannerStage,
  WorkflowCategory,
  WorkflowType,
} from '../src/index';

/**
 * Constitutional workflow-catalogue integrity guard (ADR-0055). It validates the entire WORKFLOW_DEFINITIONS catalogue as
 * a permanent CI invariant: every workflow type is unique and defined exactly once; every sequence is a valid ordered
 * subsequence of the canonical planner chain (no duplicate planner, no backward skip, only valid planners); every
 * category is valid; the catalogue is exactly fifteen; and every workflow id is deterministic (pinned golden values). A
 * future edit that violates any of these fails CI immediately.
 */
const EXPECTED_CATALOGUE_SIZE = 15;

const VALID_CATEGORIES: readonly WorkflowCategory[] = [
  'acquisition',
  'activation',
  'retention',
  'growth',
  'launch',
  'campaign',
  'optimization',
];

const CHAIN_INDEX = new Map<PlannerStage, number>(
  CANONICAL_CHAIN.map((stage, index) => [stage, index]),
);

/** The pinned, deterministic id for each workflow type under a fixed reference set (recorded golden values). */
const GOLDEN_IDS: Record<WorkflowType, string> = {
  'freelancer-acquisition': 'dea48c2b',
  'employer-acquisition': '22859e0b',
  'founder-campaign': 'c84853dd',
  'marketplace-liquidity': '4ec0a67b',
  'freelancer-activation': '08a5d8af',
  'employer-activation': '0504d633',
  'user-onboarding': '45c47d1b',
  reactivation: '8732058b',
  'referral-growth': 'e7e3ddc3',
  'product-launch': '7f7e16b3',
  'feature-announcement': '5b658d35',
  'seasonal-promotion': '34bf0155',
  'email-nurture': '14c7a0d7',
  retention: '55a5bcdf',
  'conversion-optimization': 'eb6913b7',
};

const goldenRequest = (type: WorkflowType): GrowthWorkflowRequest => ({
  type,
  objective: 'o',
  agent: 'a',
  marketing: 'm',
  content: 'c',
  seo: 's',
  social: 'so',
  analytics: 'an',
  campaign: 'cp',
  knowledge: ['knowledge/x.md'],
});

describe('workflow catalogue integrity guard (constitutional, ADR-0055)', () => {
  it('the catalogue is exactly the expected size (15) and every type is unique', () => {
    expect(WORKFLOW_TYPES).toHaveLength(EXPECTED_CATALOGUE_SIZE);
    expect(new Set(WORKFLOW_TYPES).size).toBe(EXPECTED_CATALOGUE_SIZE);
    expect(Object.keys(WORKFLOW_DEFINITIONS)).toHaveLength(EXPECTED_CATALOGUE_SIZE);
  });

  it('every workflow definition exists exactly once and matches the type set', () => {
    // Each declared type has a definition, and every definition key is a known type (bijection, no strays/duplicates).
    expect(Object.keys(WORKFLOW_DEFINITIONS).sort()).toEqual([...WORKFLOW_TYPES].sort());
    for (const type of WORKFLOW_TYPES) {
      expect(WORKFLOW_DEFINITIONS[type], `${type} must have a definition`).toBeDefined();
      expect(isWorkflowType(type)).toBe(true);
    }
  });

  it('every workflow category is one of the valid categories', () => {
    for (const type of WORKFLOW_TYPES) {
      expect(VALID_CATEGORIES, `${type} has an invalid category`).toContain(
        WORKFLOW_DEFINITIONS[type].category,
      );
    }
  });

  it('every sequence is a valid ordered subsequence: valid planners, strictly increasing, no duplicate, no backward skip', () => {
    for (const type of WORKFLOW_TYPES) {
      const sequence = WORKFLOW_DEFINITIONS[type].sequence;
      expect(sequence.length, `${type} sequence must be non-empty`).toBeGreaterThan(0);
      let previous = -1;
      for (const stage of sequence) {
        const index = CHAIN_INDEX.get(stage);
        // Every planner referenced is valid (present in the canonical chain).
        expect(index, `${type} references an invalid planner '${stage}'`).not.toBeUndefined();
        // Strictly increasing index proves no backward skip AND no planner appears twice.
        expect(
          index,
          `${type} sequence is out of order or has a duplicate at '${stage}'`,
        ).toBeGreaterThan(previous);
        previous = index as number;
      }
      // Every workflow spans the chain from the root planner to the terminal planner.
      expect(sequence[0]).toBe('marketing');
      expect(sequence[sequence.length - 1]).toBe('campaign');
    }
  });

  it('every workflow id is deterministic and matches its pinned golden value', () => {
    const framer = new GrowthWorkflowFramer(new GrowthWorkflowHash());
    for (const type of WORKFLOW_TYPES) {
      const first = framer.frame(goldenRequest(type));
      const second = framer.frame(goldenRequest(type));
      expect(isOk(first) && isOk(second)).toBe(true);
      if (!isOk(first) || !isOk(second)) continue;
      // Deterministic: the same request yields the same id.
      expect(first.value.id).toBe(second.value.id);
      // Stable: the id matches its recorded golden value (any drift in id computation fails CI).
      expect(first.value.id, `${type} golden id drift`).toBe(GOLDEN_IDS[type]);
    }
  });
});
