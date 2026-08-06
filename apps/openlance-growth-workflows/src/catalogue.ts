import type { PlannerStage, WorkflowCategory, WorkflowType } from './types.js';

/**
 * The six frozen planners in canonical chain order. Every growth workflow composes an ordered subsequence of this chain
 * (never reordered, never fan-in). This is the constitutional planner order; the subsystem references it, never redefines
 * it.
 */
export const CANONICAL_CHAIN: readonly PlannerStage[] = Object.freeze([
  'marketing',
  'content',
  'seo',
  'social',
  'analytics',
  'campaign',
]);

/** A workflow definition: its structural category and the ordered planner subsequence it composes. */
interface WorkflowDefinition {
  readonly category: WorkflowCategory;
  readonly sequence: readonly PlannerStage[];
}

const DEFINITIONS: Record<WorkflowType, WorkflowDefinition> = {
  'freelancer-acquisition': {
    category: 'acquisition',
    sequence: ['marketing', 'content', 'seo', 'social', 'analytics', 'campaign'],
  },
  'employer-acquisition': {
    category: 'acquisition',
    sequence: ['marketing', 'content', 'seo', 'social', 'analytics', 'campaign'],
  },
  'founder-campaign': {
    category: 'campaign',
    sequence: ['marketing', 'content', 'social', 'analytics', 'campaign'],
  },
  'marketplace-liquidity': {
    category: 'growth',
    sequence: ['marketing', 'content', 'seo', 'social', 'analytics', 'campaign'],
  },
  'freelancer-activation': {
    category: 'activation',
    sequence: ['marketing', 'content', 'social', 'analytics', 'campaign'],
  },
  'employer-activation': {
    category: 'activation',
    sequence: ['marketing', 'content', 'social', 'analytics', 'campaign'],
  },
  'user-onboarding': {
    category: 'activation',
    sequence: ['marketing', 'content', 'analytics', 'campaign'],
  },
  reactivation: {
    category: 'retention',
    sequence: ['marketing', 'content', 'analytics', 'campaign'],
  },
  'referral-growth': {
    category: 'growth',
    sequence: ['marketing', 'content', 'social', 'analytics', 'campaign'],
  },
  'product-launch': {
    category: 'launch',
    sequence: ['marketing', 'content', 'seo', 'social', 'campaign'],
  },
  'feature-announcement': {
    category: 'launch',
    sequence: ['marketing', 'content', 'social', 'campaign'],
  },
  'seasonal-promotion': {
    category: 'campaign',
    sequence: ['marketing', 'content', 'seo', 'social', 'analytics', 'campaign'],
  },
  'email-nurture': {
    category: 'retention',
    sequence: ['marketing', 'content', 'analytics', 'campaign'],
  },
  retention: {
    category: 'retention',
    sequence: ['marketing', 'content', 'analytics', 'campaign'],
  },
  'conversion-optimization': {
    category: 'optimization',
    sequence: ['marketing', 'content', 'seo', 'social', 'analytics', 'campaign'],
  },
};

// Deep-freeze the catalogue: each definition and its sequence array are frozen, so the exported catalogue can never be
// mutated (a shallow Object.freeze would leave the nested sequence arrays writable, aliasing global state).
for (const definition of Object.values(DEFINITIONS)) {
  Object.freeze(definition.sequence);
  Object.freeze(definition);
}

/**
 * The OpenLance growth-workflow catalogue: fifteen reusable, marketplace-oriented workflows, each defined by a structural
 * category and the ordered subsequence of frozen planners it composes. Each sequence is a canonical-order subsequence of
 * {@link CANONICAL_CHAIN} that begins at `marketing` and ends at `campaign` (the terminal planner). These are workflow
 * definitions the subsystem owns; they compose planners by reference and encode no business truth. Deeply frozen, closed.
 */
export const WORKFLOW_DEFINITIONS: Readonly<Record<WorkflowType, WorkflowDefinition>> =
  Object.freeze(DEFINITIONS);

/** The closed set of OpenLance growth-workflow types, as behaviors the subsystem frames. Frozen, closed. */
export const WORKFLOW_TYPES: readonly WorkflowType[] = Object.freeze(
  Object.keys(WORKFLOW_DEFINITIONS) as WorkflowType[],
);

/** Whether a value names a known growth-workflow type. Zero-trust: an unrecognized type is never framed. */
export const isWorkflowType = (value: string): value is WorkflowType =>
  (WORKFLOW_TYPES as readonly string[]).includes(value);
