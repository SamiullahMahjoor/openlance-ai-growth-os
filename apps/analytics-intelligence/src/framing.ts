import type { AgentRequest, AgentStep } from '@openlance/aios-agent-engine';
import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { isAnalyticsCapability } from './capabilities.js';
import { AnalyticsError } from './errors.js';
import type { AnalyticsHash } from './hash.js';
import { AnalyticsNormalizer } from './normalizer.js';
import type { AnalyticsPlan, AnalyticsRequest } from './types.js';

/**
 * A canonical knowledge reference must point to a concrete document under knowledge/: never a bare namespace, and never a
 * path-traversal (`.` / `..`) or control-character segment. Each path segment is a safe filename character set.
 */
const KNOWLEDGE_DOCUMENT = /^knowledge\/(?:(?!\.\.?\/)[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.md$/;

/** The provider-neutral capability an analytics generation step needs; the subsystem selects no provider or model. */
const GENERATION_CAPABILITY = 'text-generation';

/**
 * The analytics framer: it validates an analytics request and frames it as a governed platform task, deterministically
 * and never throwing. It produces an immutable `AnalyticsPlan` carrying the frozen Agent Engine `AgentRequest` (a prompt
 * and a provider step). It composes no plan (the Agent Engine does), executes nothing, evaluates nothing, orchestrates
 * nothing, schedules nothing, selects no provider, decides nothing, and owns no business truth; it references the
 * marketing, content, SEO, and social plans plus the knowledge the behavior consumes.
 */
export class AnalyticsFramer {
  readonly #normalizer = new AnalyticsNormalizer();
  readonly #hash: AnalyticsHash;

  constructor(hash: AnalyticsHash) {
    this.#hash = hash;
  }

  /** Frame an analytics request into an immutable plan, or fail closed on an unknown, blank, or invalid request. */
  frame(request: AnalyticsRequest): Result<AnalyticsPlan, AnalyticsError> {
    // Zero trust: a null/undefined (or primitive) request never throws; it settles to an empty request and fails closed.
    const safe: AnalyticsRequest = request ?? ({} as AnalyticsRequest);
    const capability = safe.capability;
    if (typeof capability !== 'string' || !isAnalyticsCapability(capability)) {
      return err(
        new AnalyticsError(
          'ANALYTICS.UNKNOWN_CAPABILITY',
          `Unknown analytics capability '${String(capability)}'.`,
          {},
        ),
      );
    }
    const objective = this.#normalizer.normalize(safe.objective);
    if (objective === '') {
      return err(
        new AnalyticsError(
          'ANALYTICS.BLANK_OBJECTIVE',
          'An analytics request has a blank objective.',
          {
            capability,
          },
        ),
      );
    }
    const agent = this.#normalizer.normalize(safe.agent);
    if (agent === '') {
      return err(
        new AnalyticsError('ANALYTICS.BLANK_AGENT', 'An analytics request has a blank agent.', {
          capability,
        }),
      );
    }
    const marketing = this.#normalizer.normalize(safe.marketing);
    if (marketing === '') {
      return err(
        new AnalyticsError(
          'ANALYTICS.MISSING_MARKETING',
          'An analytics request must reference a marketing direction.',
          {
            capability,
          },
        ),
      );
    }
    const content = this.#normalizer.normalize(safe.content);
    if (content === '') {
      return err(
        new AnalyticsError(
          'ANALYTICS.MISSING_CONTENT',
          'An analytics request must reference a content plan.',
          {
            capability,
          },
        ),
      );
    }
    const seo = this.#normalizer.normalize(safe.seo);
    if (seo === '') {
      return err(
        new AnalyticsError(
          'ANALYTICS.MISSING_SEO',
          'An analytics request must reference an SEO plan.',
          {
            capability,
          },
        ),
      );
    }
    const social = this.#normalizer.normalize(safe.social);
    if (social === '') {
      return err(
        new AnalyticsError(
          'ANALYTICS.MISSING_SOCIAL',
          'An analytics request must reference a social plan.',
          {
            capability,
          },
        ),
      );
    }
    const knowledge = this.#references(safe.knowledge);
    if (knowledge === null) {
      return err(
        new AnalyticsError(
          'ANALYTICS.INVALID_REFERENCE',
          'An analytics request may reference only canonical knowledge documents.',
          { capability },
        ),
      );
    }

    const contextReferences: readonly string[] = [marketing, content, seo, social, ...knowledge];
    const steps: readonly AgentStep[] = [
      {
        capability: 'prompt',
        request: { variables: { objective, analyticsTask: capability }, contextReferences },
      },
      { capability: 'provider', request: { capability: GENERATION_CAPABILITY } },
    ];
    const task = `${capability}: ${objective}`;
    const agentRequest: AgentRequest = Object.freeze({ agent, task, steps: Object.freeze(steps) });
    const deliverable = `analytics ${capability} deliverable for '${objective}'`;
    const canonical = JSON.stringify([
      capability,
      objective,
      agent,
      marketing,
      content,
      seo,
      social,
      knowledge,
      task,
    ]);
    const plan: AnalyticsPlan = {
      capability,
      objective,
      agent,
      marketing,
      content,
      seo,
      social,
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
