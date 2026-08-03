/**
 * Hazard identification (ai/safety/hazard-identification.md, OL-AI-SAFETY-HAZARD-IDENTIFICATION).
 *
 * How the AI identifies the hazards that could cause harm, and the categories they fall into, as
 * immutable definitions (ADR-0020). This concern owns the hazard model only; it never defines the
 * classification of a hazard's risk (owned by ai/safety/risk-classification.md) nor the business truth a
 * knowledge hazard concerns (owned by the knowledge repository). Discovering concrete hazards over a
 * concrete action is a runtime evaluation this concern does not own. This concern states the hazard
 * categories and the invariants it always satisfies.
 */

/**
 * A hazard-identification principle (ai/safety/hazard-identification.md, "Principles"). Each instantiates
 * a safety invariant owned by ai/safety/README.md.
 */
export type HazardIdentificationPrinciple =
  'identified-before-harm' | 'categorized' | 'no-hazard-hidden' | 'hazards-compound';

/** The four hazard-identification principles, in constitutional order; frozen. */
export const HAZARD_IDENTIFICATION_PRINCIPLES: readonly HazardIdentificationPrinciple[] =
  Object.freeze(['identified-before-harm', 'categorized', 'no-hazard-hidden', 'hazards-compound']);

/** The statement each hazard-identification principle makes (ai/safety/hazard-identification.md). */
export const HAZARD_IDENTIFICATION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<HazardIdentificationPrinciple, string>
> = Object.freeze({
  'identified-before-harm':
    'The AI surfaces what could cause harm ahead of an action, so protection precedes it.',
  categorized:
    'Every hazard falls into a defined category, so it can be reasoned about and classified consistently.',
  'no-hazard-hidden':
    'An identified hazard is made explicit and never suppressed, so protection is not silently removed.',
  'hazards-compound':
    'Hazards that combine into a greater hazard are identified as such, so compound harm is not missed.',
});

/**
 * A hazard category (ai/safety/hazard-identification.md, "Specification"). Every hazard falls into
 * exactly one of these architectural categories, each naming a source of potential harm within the AI
 * layer. The set may be extended additively as the AI layer grows.
 */
export type HazardCategory =
  | 'capability'
  | 'knowledge'
  | 'permission'
  | 'reasoning'
  | 'runtime'
  | 'prompt'
  | 'agent'
  | 'compound';

/** The eight hazard categories, in constitutional order; frozen. */
export const HAZARD_CATEGORIES: readonly HazardCategory[] = Object.freeze([
  'capability',
  'knowledge',
  'permission',
  'reasoning',
  'runtime',
  'prompt',
  'agent',
  'compound',
]);

/** What each hazard category arises from, and its owner (ai/safety/hazard-identification.md). */
export const HAZARD_CATEGORY_DESCRIPTIONS: Readonly<Record<HazardCategory, string>> = Object.freeze(
  {
    capability:
      'A hazard arising from what an agent is able to do, defined by the capabilities owned by ai/agents/agent-capabilities.md.',
    knowledge:
      'A hazard arising from the business truth an action concerns, including sensitive, private, or consequential knowledge, whose definition is owned by the knowledge repository and never restated here.',
    permission:
      'A hazard arising from the authority an agent holds, including excess or misused authority, defined by the permissions owned by ai/agents/agent-permissions.md and the rules owned by ai/governance/permission-governance.md.',
    reasoning:
      'A hazard arising from a flaw or uncertainty in reasoning, whose cognitive uncertainty is owned by ai/reasoning/uncertainty-handling.md.',
    runtime:
      'A hazard arising from execution, orchestration, or failure, whose execution is owned by ai/runtime/.',
    prompt:
      'A hazard arising from a composed instruction, including one that would embed truth or exceed bounds, whose composition is owned by ai/prompts/.',
    agent:
      'A hazard arising from an agent as an actor, including coordination or delegation, whose model is owned by ai/agents/.',
    compound:
      'A hazard formed when two or more hazards combine into a greater one, identified as a distinct hazard so that combined harm is not missed.',
  },
);

/**
 * A hazard-identification invariant (ai/safety/hazard-identification.md, "Invariants"): a guarantee that
 * always holds for the hazard model.
 */
export type HazardIdentificationInvariant =
  | 'one-category-compound-distinct'
  | 'surfaced-never-hidden'
  | 'categorizes-not-classifies'
  | 'knowledge-hazard-references-never-restates'
  | 'identifying-is-inert';

/** The five hazard-identification invariants, in constitutional order; frozen. */
export const HAZARD_IDENTIFICATION_INVARIANTS: readonly HazardIdentificationInvariant[] =
  Object.freeze([
    'one-category-compound-distinct',
    'surfaced-never-hidden',
    'categorizes-not-classifies',
    'knowledge-hazard-references-never-restates',
    'identifying-is-inert',
  ]);

/** The guarantee each hazard-identification invariant states (ai/safety/hazard-identification.md). */
export const HAZARD_IDENTIFICATION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<HazardIdentificationInvariant, string>
> = Object.freeze({
  'one-category-compound-distinct':
    'Every identified hazard falls into exactly one category, and compound hazards are identified as distinct hazards.',
  'surfaced-never-hidden':
    'A hazard is surfaced before an action proceeds and is never hidden or suppressed.',
  'categorizes-not-classifies':
    'Hazard identification categorizes a hazard and never classifies its risk or enforces a boundary.',
  'knowledge-hazard-references-never-restates':
    'A knowledge hazard references business truth by its canonical owner and never restates it.',
  'identifying-is-inert':
    'Identifying a hazard never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});
