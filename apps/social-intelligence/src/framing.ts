import type { AgentRequest, AgentStep } from '@openlance/aios-agent-engine';
import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { isSocialCapability } from './capabilities.js';
import { SocialError } from './errors.js';
import type { SocialHash } from './hash.js';
import { SocialNormalizer } from './normalizer.js';
import type { SocialPlan, SocialRequest } from './types.js';

/**
 * A canonical knowledge reference must point to a concrete document under knowledge/: never a bare namespace, and never a
 * path-traversal (`.` / `..`) or control-character segment. Each path segment is a safe filename character set.
 */
const KNOWLEDGE_DOCUMENT = /^knowledge\/(?:(?!\.\.?\/)[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.md$/;

/** The provider-neutral capability a social generation step needs; the subsystem selects no provider or model. */
const GENERATION_CAPABILITY = 'text-generation';

/**
 * The social framer: it validates a social request and frames it as a governed social task, deterministically and never
 * throwing. It produces an immutable `SocialPlan` carrying the frozen Agent Engine `AgentRequest` (a prompt step grounded
 * in the marketing direction, the content plan, the SEO plan, and knowledge, and a provider step). It composes no plan
 * (the Agent Engine does), executes nothing, publishes nothing, schedules nothing, posts nothing, calls no API, selects
 * no provider, decides nothing, authors no content, and owns neither marketing strategy, content, nor brand truth; it
 * references what it consumes.
 */
export class SocialFramer {
  readonly #normalizer = new SocialNormalizer();
  readonly #hash: SocialHash;

  constructor(hash: SocialHash) {
    this.#hash = hash;
  }

  /** Frame a social request into an immutable plan, or fail closed on an unknown, blank, or invalid request. */
  frame(request: SocialRequest): Result<SocialPlan, SocialError> {
    // Zero trust: a null/undefined (or primitive) request never throws; it settles to an empty request and fails closed.
    const safe: SocialRequest = request ?? ({} as SocialRequest);
    const capability = safe.capability;
    if (typeof capability !== 'string' || !isSocialCapability(capability)) {
      return err(
        new SocialError(
          'SOCIAL.UNKNOWN_CAPABILITY',
          `Unknown social capability '${String(capability)}'.`,
          {},
        ),
      );
    }
    const objective = this.#normalizer.normalize(safe.objective);
    if (objective === '') {
      return err(
        new SocialError('SOCIAL.BLANK_OBJECTIVE', 'A social request has a blank objective.', {
          capability,
        }),
      );
    }
    const agent = this.#normalizer.normalize(safe.agent);
    if (agent === '') {
      return err(
        new SocialError('SOCIAL.BLANK_AGENT', 'A social request has a blank agent.', {
          capability,
        }),
      );
    }
    const marketing = this.#normalizer.normalize(safe.marketing);
    if (marketing === '') {
      return err(
        new SocialError(
          'SOCIAL.MISSING_MARKETING',
          'A social request must reference a marketing direction.',
          {
            capability,
          },
        ),
      );
    }
    const content = this.#normalizer.normalize(safe.content);
    if (content === '') {
      return err(
        new SocialError(
          'SOCIAL.MISSING_CONTENT',
          'A social request must reference a content plan.',
          {
            capability,
          },
        ),
      );
    }
    const seo = this.#normalizer.normalize(safe.seo);
    if (seo === '') {
      return err(
        new SocialError('SOCIAL.MISSING_SEO', 'A social request must reference an SEO plan.', {
          capability,
        }),
      );
    }
    const knowledge = this.#references(safe.knowledge);
    if (knowledge === null) {
      return err(
        new SocialError(
          'SOCIAL.INVALID_REFERENCE',
          'A social request may reference only canonical knowledge documents.',
          {
            capability,
          },
        ),
      );
    }

    const contextReferences: readonly string[] = [marketing, content, seo, ...knowledge];
    const steps: readonly AgentStep[] = [
      {
        capability: 'prompt',
        request: { variables: { objective, socialTask: capability }, contextReferences },
      },
      { capability: 'provider', request: { capability: GENERATION_CAPABILITY } },
    ];
    const task = `${capability}: ${objective}`;
    const agentRequest: AgentRequest = Object.freeze({ agent, task, steps: Object.freeze(steps) });
    const deliverable = `social ${capability} deliverable for '${objective}'`;
    const canonical = JSON.stringify([
      capability,
      objective,
      agent,
      marketing,
      content,
      seo,
      knowledge,
      task,
    ]);
    const plan: SocialPlan = {
      capability,
      objective,
      agent,
      marketing,
      content,
      seo,
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
