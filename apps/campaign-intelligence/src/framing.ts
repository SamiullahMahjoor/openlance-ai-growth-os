import type { AgentRequest, AgentStep } from '@openlance/aios-agent-engine';
import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { isCampaignCapability } from './capabilities.js';
import { CampaignError } from './errors.js';
import type { CampaignHash } from './hash.js';
import { CampaignNormalizer } from './normalizer.js';
import type { CampaignPlan, CampaignRequest } from './types.js';

/**
 * A canonical knowledge reference must point to a concrete document under knowledge/: never a bare namespace, and never a
 * path-traversal (`.` / `..`) or control-character segment. Each path segment is a safe filename character set.
 */
const KNOWLEDGE_DOCUMENT = /^knowledge\/(?:(?!\.\.?\/)[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.md$/;

/** The provider-neutral capability a campaign generation step needs; the subsystem selects no provider or model. */
const GENERATION_CAPABILITY = 'text-generation';

/**
 * The campaign framer: it validates a campaign request and frames it as a governed platform task, deterministically and
 * never throwing. It produces an immutable `CampaignPlan` carrying the frozen Agent Engine `AgentRequest` (a prompt and a
 * provider step). It composes no plan (the Agent Engine does), executes nothing, schedules nothing, orchestrates nothing
 * at runtime, selects no provider, decides nothing, and owns no business truth; it references the marketing, content,
 * SEO, social, and analytics plans plus the knowledge the behavior consumes.
 */
export class CampaignFramer {
  readonly #normalizer = new CampaignNormalizer();
  readonly #hash: CampaignHash;

  constructor(hash: CampaignHash) {
    this.#hash = hash;
  }

  /** Frame a campaign request into an immutable plan, or fail closed on an unknown, blank, or invalid request. */
  frame(request: CampaignRequest): Result<CampaignPlan, CampaignError> {
    // Zero trust: a null/undefined (or primitive) request never throws; it settles to an empty request and fails closed.
    const safe: CampaignRequest = request ?? ({} as CampaignRequest);
    const capability = safe.capability;
    if (typeof capability !== 'string' || !isCampaignCapability(capability)) {
      return err(
        new CampaignError(
          'CAMPAIGN.UNKNOWN_CAPABILITY',
          `Unknown campaign capability '${String(capability)}'.`,
          {},
        ),
      );
    }
    const objective = this.#normalizer.normalize(safe.objective);
    if (objective === '') {
      return err(
        new CampaignError('CAMPAIGN.BLANK_OBJECTIVE', 'A campaign request has a blank objective.', {
          capability,
        }),
      );
    }
    const agent = this.#normalizer.normalize(safe.agent);
    if (agent === '') {
      return err(
        new CampaignError('CAMPAIGN.BLANK_AGENT', 'A campaign request has a blank agent.', {
          capability,
        }),
      );
    }
    const marketing = this.#normalizer.normalize(safe.marketing);
    if (marketing === '') {
      return err(
        new CampaignError(
          'CAMPAIGN.MISSING_MARKETING',
          'A campaign request must reference a marketing direction.',
          {
            capability,
          },
        ),
      );
    }
    const content = this.#normalizer.normalize(safe.content);
    if (content === '') {
      return err(
        new CampaignError(
          'CAMPAIGN.MISSING_CONTENT',
          'A campaign request must reference a content plan.',
          {
            capability,
          },
        ),
      );
    }
    const seo = this.#normalizer.normalize(safe.seo);
    if (seo === '') {
      return err(
        new CampaignError(
          'CAMPAIGN.MISSING_SEO',
          'A campaign request must reference an SEO plan.',
          {
            capability,
          },
        ),
      );
    }
    const social = this.#normalizer.normalize(safe.social);
    if (social === '') {
      return err(
        new CampaignError(
          'CAMPAIGN.MISSING_SOCIAL',
          'A campaign request must reference a social plan.',
          {
            capability,
          },
        ),
      );
    }
    const analytics = this.#normalizer.normalize(safe.analytics);
    if (analytics === '') {
      return err(
        new CampaignError(
          'CAMPAIGN.MISSING_ANALYTICS',
          'A campaign request must reference an analytics plan.',
          {
            capability,
          },
        ),
      );
    }
    const knowledge = this.#references(safe.knowledge);
    if (knowledge === null) {
      return err(
        new CampaignError(
          'CAMPAIGN.INVALID_REFERENCE',
          'A campaign request may reference only canonical knowledge documents.',
          { capability },
        ),
      );
    }

    const contextReferences: readonly string[] = [
      marketing,
      content,
      seo,
      social,
      analytics,
      ...knowledge,
    ];
    const steps: readonly AgentStep[] = [
      {
        capability: 'prompt',
        request: { variables: { objective, campaignTask: capability }, contextReferences },
      },
      { capability: 'provider', request: { capability: GENERATION_CAPABILITY } },
    ];
    const task = `${capability}: ${objective}`;
    const agentRequest: AgentRequest = Object.freeze({ agent, task, steps: Object.freeze(steps) });
    const deliverable = `campaign ${capability} deliverable for '${objective}'`;
    const canonical = JSON.stringify([
      capability,
      objective,
      agent,
      marketing,
      content,
      seo,
      social,
      analytics,
      knowledge,
      task,
    ]);
    const plan: CampaignPlan = {
      capability,
      objective,
      agent,
      marketing,
      content,
      seo,
      social,
      analytics,
      knowledge,
      deliverable,
      request: agentRequest,
      id: this.#hash.hash(canonical),
    };
    return ok(Object.freeze(plan));
  }

  /** Normalize the optional extra knowledge references; returns null when any provided reference is not canonical. */
  #references(references: readonly string[] | undefined): readonly string[] | null {
    const guarded = Array.isArray(references) ? references : [];
    const normalized: string[] = [];
    for (const reference of guarded) {
      const value = typeof reference === 'string' ? reference.trim() : '';
      if (!KNOWLEDGE_DOCUMENT.test(value)) {
        return null;
      }
      normalized.push(value);
    }
    // Deduplicate so the plan id is invariant under the same reference set (a duplicate reference is redundant).
    return Object.freeze([...new Set(normalized)].sort());
  }
}
