import type { AgentRequest, AgentStep } from '@openlance/aios-agent-engine';
import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { isMarketingCapability } from './capabilities.js';
import { MarketingError } from './errors.js';
import type { MarketingHash } from './hash.js';
import { MarketingNormalizer } from './normalizer.js';
import type { MarketingBrief, MarketingRequest } from './types.js';

/**
 * A canonical knowledge reference must point to a concrete document under knowledge/: never a bare namespace, and never a
 * path-traversal (`.` / `..`) or control-character segment. Each path segment is a safe filename character set.
 */
const KNOWLEDGE_DOCUMENT = /^knowledge\/(?:(?!\.\.?\/)[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.md$/;

/** The provider-neutral capability a marketing generation step needs; the subsystem selects no provider or model. */
const GENERATION_CAPABILITY = 'text-generation';

/**
 * The marketing framer: it validates a marketing request and frames it as a governed platform task, deterministically and
 * never throwing. It produces an immutable `MarketingBrief` carrying the frozen Agent Engine `AgentRequest` (a grounded
 * retrieval, prompt, and provider step pipeline). It composes no plan (the Agent Engine does), executes nothing, selects
 * no provider, decides nothing, and owns no business truth; it references the knowledge the behavior consumes.
 */
export class MarketingFramer {
  readonly #normalizer = new MarketingNormalizer();
  readonly #hash: MarketingHash;

  constructor(hash: MarketingHash) {
    this.#hash = hash;
  }

  /** Frame a marketing request into an immutable brief, or fail closed on an unknown, blank, or ungrounded request. */
  frame(request: MarketingRequest): Result<MarketingBrief, MarketingError> {
    // Zero trust: a null/undefined (or primitive) request never throws; it settles to an empty request and fails closed.
    const safe: MarketingRequest = request ?? ({} as MarketingRequest);
    const capability = safe.capability;
    if (typeof capability !== 'string' || !isMarketingCapability(capability)) {
      return err(
        new MarketingError(
          'MARKETING.UNKNOWN_CAPABILITY',
          `Unknown marketing capability '${String(capability)}'.`,
          {},
        ),
      );
    }
    const objective = this.#normalizer.normalize(safe.objective);
    if (objective === '') {
      return err(
        new MarketingError(
          'MARKETING.BLANK_OBJECTIVE',
          'A marketing request has a blank objective.',
          {
            capability,
          },
        ),
      );
    }
    const agent = this.#normalizer.normalize(safe.agent);
    if (agent === '') {
      return err(
        new MarketingError('MARKETING.BLANK_AGENT', 'A marketing request has a blank agent.', {
          capability,
        }),
      );
    }
    const knowledge = this.#references(safe.knowledge);
    if (knowledge === null) {
      return err(
        new MarketingError(
          'MARKETING.UNGROUNDED',
          'A marketing request must reference at least one canonical knowledge document.',
          { capability },
        ),
      );
    }
    const audience = this.#audience(safe.audience);

    const steps: readonly AgentStep[] = [
      { capability: 'retrieval', request: { scope: capability } },
      {
        capability: 'prompt',
        request: {
          variables: { objective, audience: audience ?? '' },
          contextReferences: knowledge,
        },
      },
      { capability: 'provider', request: { capability: GENERATION_CAPABILITY } },
    ];
    const task = `${capability}: ${objective}`;
    const agentRequest: AgentRequest = Object.freeze({ agent, task, steps: Object.freeze(steps) });
    const deliverable = `marketing ${capability} deliverable for '${objective}'`;
    const canonical = JSON.stringify([capability, objective, agent, knowledge, audience, task]);
    const brief: MarketingBrief = {
      capability,
      objective,
      agent,
      knowledge,
      audience,
      deliverable,
      request: agentRequest,
      id: this.#hash.hash(canonical),
    };
    return ok(Object.freeze(brief));
  }

  /** Normalize the knowledge references; returns null when none is canonical (a brief is always grounded). */
  #references(references: readonly string[]): readonly string[] | null {
    const guarded = Array.isArray(references) ? references : [];
    const normalized: string[] = [];
    for (const reference of guarded) {
      const value = typeof reference === 'string' ? reference.trim() : '';
      if (!KNOWLEDGE_DOCUMENT.test(value)) {
        return null;
      }
      normalized.push(value);
    }
    // Deduplicate so the brief id is invariant under the same reference set (a duplicate reference is redundant).
    const unique = [...new Set(normalized)];
    return unique.length > 0 ? Object.freeze(unique.sort()) : null;
  }

  /** Normalize an optional audience to a trimmed string, or null when absent or blank. */
  #audience(audience: string | undefined): string | null {
    const value = this.#normalizer.normalize(audience);
    return value === '' ? null : value;
  }
}
