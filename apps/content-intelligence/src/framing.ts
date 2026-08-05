import type { AgentRequest, AgentStep } from '@openlance/aios-agent-engine';
import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { isContentCapability } from './capabilities.js';
import { ContentError } from './errors.js';
import type { ContentHash } from './hash.js';
import { ContentNormalizer } from './normalizer.js';
import type { ContentPlan, ContentRequest } from './types.js';

/**
 * A canonical knowledge reference must point to a concrete document; the brand-voice one must be a knowledge/brand
 * document. Neither may be a bare namespace, a path-traversal (`.` / `..`) segment, or a control-character segment; each
 * path segment is a safe filename character set.
 */
const KNOWLEDGE_DOCUMENT = /^knowledge\/(?:(?!\.\.?\/)[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.md$/;
const BRAND_DOCUMENT = /^knowledge\/brand\/(?:(?!\.\.?\/)[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.md$/;

/** The provider-neutral capability a content generation step needs; the subsystem selects no provider or model. */
const GENERATION_CAPABILITY = 'text-generation';

/**
 * The content framer: it validates a content request and frames it as a governed content-generation task,
 * deterministically and never throwing. It produces an immutable `ContentPlan` carrying the frozen Agent Engine
 * `AgentRequest` (a prompt step grounded in the marketing direction and the brand voice, and a provider step). It
 * composes no plan (the Agent Engine does), executes nothing, selects no provider, decides nothing, and owns neither
 * marketing strategy nor brand truth; it references what it consumes.
 */
export class ContentFramer {
  readonly #normalizer = new ContentNormalizer();
  readonly #hash: ContentHash;

  constructor(hash: ContentHash) {
    this.#hash = hash;
  }

  /** Frame a content request into an immutable plan, or fail closed on an unknown, blank, or invalid request. */
  frame(request: ContentRequest): Result<ContentPlan, ContentError> {
    // Zero trust: a null/undefined (or primitive) request never throws; it settles to an empty request and fails closed.
    const safe: ContentRequest = request ?? ({} as ContentRequest);
    const capability = safe.capability;
    if (typeof capability !== 'string' || !isContentCapability(capability)) {
      return err(
        new ContentError(
          'CONTENT.UNKNOWN_CAPABILITY',
          `Unknown content capability '${String(capability)}'.`,
          {},
        ),
      );
    }
    const objective = this.#normalizer.normalize(safe.objective);
    if (objective === '') {
      return err(
        new ContentError('CONTENT.BLANK_OBJECTIVE', 'A content request has a blank objective.', {
          capability,
        }),
      );
    }
    const agent = this.#normalizer.normalize(safe.agent);
    if (agent === '') {
      return err(
        new ContentError('CONTENT.BLANK_AGENT', 'A content request has a blank agent.', {
          capability,
        }),
      );
    }
    const marketing = this.#normalizer.normalize(safe.marketing);
    if (marketing === '') {
      return err(
        new ContentError(
          'CONTENT.MISSING_MARKETING',
          'A content request must reference a marketing direction.',
          { capability },
        ),
      );
    }
    const brandVoice = this.#normalizer.normalize(safe.brandVoice);
    if (!BRAND_DOCUMENT.test(brandVoice)) {
      return err(
        new ContentError(
          'CONTENT.INVALID_BRAND_VOICE',
          'A content request must reference a concrete knowledge/brand voice document.',
          { capability },
        ),
      );
    }
    const knowledge = this.#references(safe.knowledge);
    if (knowledge === null) {
      return err(
        new ContentError(
          'CONTENT.INVALID_REFERENCE',
          'A content request may reference only canonical knowledge documents.',
          { capability },
        ),
      );
    }

    const contextReferences: readonly string[] = [marketing, brandVoice, ...knowledge];
    const steps: readonly AgentStep[] = [
      {
        capability: 'prompt',
        request: { variables: { objective, contentType: capability }, contextReferences },
      },
      { capability: 'provider', request: { capability: GENERATION_CAPABILITY } },
    ];
    const task = `${capability}: ${objective}`;
    const agentRequest: AgentRequest = Object.freeze({ agent, task, steps: Object.freeze(steps) });
    const deliverable = `content ${capability} deliverable for '${objective}'`;
    const canonical = JSON.stringify([
      capability,
      objective,
      agent,
      marketing,
      brandVoice,
      knowledge,
      task,
    ]);
    const plan: ContentPlan = {
      capability,
      objective,
      agent,
      marketing,
      brandVoice,
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
