import type { AgentRequest, AgentStep } from '@openlance/aios-agent-engine';
import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { isSeoCapability } from './capabilities.js';
import { SeoError } from './errors.js';
import type { SeoHash } from './hash.js';
import { SeoNormalizer } from './normalizer.js';
import type { SeoPlan, SeoRequest } from './types.js';

/**
 * A canonical knowledge reference must point to a concrete document under knowledge/: never a bare namespace, and never a
 * path-traversal (`.` / `..`) or control-character segment. Each path segment is a safe filename character set.
 */
const KNOWLEDGE_DOCUMENT = /^knowledge\/(?:(?!\.\.?\/)[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.md$/;

/** The provider-neutral capability an SEO generation step needs; the subsystem selects no provider or model. */
const GENERATION_CAPABILITY = 'text-generation';

/**
 * The SEO framer: it validates an SEO request and frames it as a governed platform task, deterministically and never
 * throwing. It produces an immutable `SeoPlan` carrying the frozen Agent Engine `AgentRequest` (a prompt and a provider
 * step). It composes no plan (the Agent Engine does), executes nothing, retrieves nothing, crawls nothing, scores
 * nothing, selects no provider, decides nothing, and owns no business truth; it references the marketing direction,
 * content plan, and knowledge the behavior consumes.
 */
export class SeoFramer {
  readonly #normalizer = new SeoNormalizer();
  readonly #hash: SeoHash;

  constructor(hash: SeoHash) {
    this.#hash = hash;
  }

  /** Frame an SEO request into an immutable plan, or fail closed on an unknown, blank, or invalid request. */
  frame(request: SeoRequest): Result<SeoPlan, SeoError> {
    // Zero trust: a null/undefined (or primitive) request never throws; it settles to an empty request and fails closed.
    const safe: SeoRequest = request ?? ({} as SeoRequest);
    const capability = safe.capability;
    if (typeof capability !== 'string' || !isSeoCapability(capability)) {
      return err(
        new SeoError(
          'SEO.UNKNOWN_CAPABILITY',
          `Unknown SEO capability '${String(capability)}'.`,
          {},
        ),
      );
    }
    const objective = this.#normalizer.normalize(safe.objective);
    if (objective === '') {
      return err(
        new SeoError('SEO.BLANK_OBJECTIVE', 'An SEO request has a blank objective.', {
          capability,
        }),
      );
    }
    const agent = this.#normalizer.normalize(safe.agent);
    if (agent === '') {
      return err(
        new SeoError('SEO.BLANK_AGENT', 'An SEO request has a blank agent.', { capability }),
      );
    }
    const marketing = this.#normalizer.normalize(safe.marketing);
    if (marketing === '') {
      return err(
        new SeoError(
          'SEO.MISSING_MARKETING',
          'An SEO request must reference a marketing direction.',
          {
            capability,
          },
        ),
      );
    }
    const content = this.#normalizer.normalize(safe.content);
    if (content === '') {
      return err(
        new SeoError('SEO.MISSING_CONTENT', 'An SEO request must reference a content plan.', {
          capability,
        }),
      );
    }
    const knowledge = this.#references(safe.knowledge);
    if (knowledge === null) {
      return err(
        new SeoError(
          'SEO.INVALID_REFERENCE',
          'An SEO request may reference only canonical knowledge documents.',
          {
            capability,
          },
        ),
      );
    }

    const contextReferences: readonly string[] = [marketing, content, ...knowledge];
    const steps: readonly AgentStep[] = [
      {
        capability: 'prompt',
        request: { variables: { objective, seoTask: capability }, contextReferences },
      },
      { capability: 'provider', request: { capability: GENERATION_CAPABILITY } },
    ];
    const task = `${capability}: ${objective}`;
    const agentRequest: AgentRequest = Object.freeze({ agent, task, steps: Object.freeze(steps) });
    const deliverable = `seo ${capability} deliverable for '${objective}'`;
    const canonical = JSON.stringify([
      capability,
      objective,
      agent,
      marketing,
      content,
      knowledge,
      task,
    ]);
    const plan: SeoPlan = {
      capability,
      objective,
      agent,
      marketing,
      content,
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
