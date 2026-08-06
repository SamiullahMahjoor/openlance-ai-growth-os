import type { AgentRequest, AgentStep } from '@openlance/aios-agent-engine';
import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { isAutomationCapability } from './capabilities.js';
import { AutomationError } from './errors.js';
import type { AutomationHash } from './hash.js';
import { AutomationNormalizer } from './normalizer.js';
import type { AutomationPlan, AutomationRequest } from './types.js';

/**
 * A canonical knowledge reference must point to a concrete document under knowledge/: never a bare namespace, and never a
 * path-traversal (`.` / `..`) or control-character segment. Each path segment is a safe filename character set.
 */
const KNOWLEDGE_DOCUMENT = /^knowledge\/(?:(?!\.\.?\/)[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.md$/;

/** The provider-neutral capability an automation generation step needs; the subsystem selects no provider or model. */
const GENERATION_CAPABILITY = 'text-generation';

/**
 * The automation framer: it validates an automation request and frames it as a governed platform task, deterministically
 * and never throwing. It produces an immutable `AutomationPlan` carrying the frozen Agent Engine `AgentRequest` (a prompt
 * and a provider step). It composes no plan (the Agent Engine does), executes nothing, schedules nothing, triggers
 * nothing, orchestrates no runtime, mints no governance clearance, selects no provider, decides nothing, and owns no
 * business truth; it references the growth workflow and the knowledge the behavior consumes. Preparing a governed
 * automation opportunity is a declarative framing; the platform runs it later through its governed runtime.
 */
export class AutomationFramer {
  readonly #normalizer = new AutomationNormalizer();
  readonly #hash: AutomationHash;

  constructor(hash: AutomationHash) {
    this.#hash = hash;
  }

  /** Frame an automation request into an immutable plan, or fail closed on an unknown, blank, or invalid request. */
  frame(request: AutomationRequest): Result<AutomationPlan, AutomationError> {
    // Zero trust: a null/undefined (or primitive) request never throws; it settles to an empty request and fails closed.
    const safe: AutomationRequest = request ?? ({} as AutomationRequest);
    const capability = safe.capability;
    if (typeof capability !== 'string' || !isAutomationCapability(capability)) {
      return err(
        new AutomationError(
          'AUTOMATION.UNKNOWN_CAPABILITY',
          `Unknown automation capability '${String(capability)}'.`,
          {},
        ),
      );
    }
    const objective = this.#normalizer.normalize(safe.objective);
    if (objective === '') {
      return err(
        new AutomationError(
          'AUTOMATION.BLANK_OBJECTIVE',
          'An automation request has a blank objective.',
          { capability },
        ),
      );
    }
    const agent = this.#normalizer.normalize(safe.agent);
    if (agent === '') {
      return err(
        new AutomationError('AUTOMATION.BLANK_AGENT', 'An automation request has a blank agent.', {
          capability,
        }),
      );
    }
    const workflow = this.#normalizer.normalize(safe.workflow);
    if (workflow === '') {
      return err(
        new AutomationError(
          'AUTOMATION.MISSING_WORKFLOW',
          'An automation request must reference a growth workflow.',
          { capability },
        ),
      );
    }
    const knowledge = this.#references(safe.knowledge);
    if (knowledge === null) {
      return err(
        new AutomationError(
          'AUTOMATION.INVALID_REFERENCE',
          'An automation request may reference only canonical knowledge documents.',
          { capability },
        ),
      );
    }

    const contextReferences: readonly string[] = [workflow, ...knowledge];
    const steps: readonly AgentStep[] = [
      {
        capability: 'prompt',
        request: { variables: { objective, automationTask: capability }, contextReferences },
      },
      { capability: 'provider', request: { capability: GENERATION_CAPABILITY } },
    ];
    const task = `${capability}: ${objective}`;
    const agentRequest: AgentRequest = Object.freeze({ agent, task, steps: Object.freeze(steps) });
    const deliverable = `automation ${capability} deliverable for '${objective}'`;
    const canonical = JSON.stringify([capability, objective, agent, workflow, knowledge, task]);
    const plan: AutomationPlan = {
      capability,
      objective,
      agent,
      workflow,
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
