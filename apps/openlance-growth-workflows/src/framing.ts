import type { AgentRequest, AgentStep } from '@openlance/aios-agent-engine';
import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { WORKFLOW_DEFINITIONS, isWorkflowType } from './catalogue.js';
import { GrowthWorkflowError } from './errors.js';
import type { GrowthWorkflowHash } from './hash.js';
import { GrowthWorkflowNormalizer } from './normalizer.js';
import type { GrowthWorkflow, GrowthWorkflowRequest, PlannerStage } from './types.js';

/**
 * A canonical knowledge reference must point to a concrete document under knowledge/: never a bare namespace, and never a
 * path-traversal (`.` / `..`) or control-character segment. Each path segment is a safe filename character set.
 */
const KNOWLEDGE_DOCUMENT = /^knowledge\/(?:(?!\.\.?\/)[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.md$/;

/** The provider-neutral capability a workflow generation step needs; the subsystem selects no provider or model. */
const GENERATION_CAPABILITY = 'text-generation';

/** Each planner reference and its fail-closed missing-code, in canonical chain order. */
const PLANNER_GATES: readonly (readonly [PlannerStage, string])[] = [
  ['marketing', 'WORKFLOW.MISSING_MARKETING'],
  ['content', 'WORKFLOW.MISSING_CONTENT'],
  ['seo', 'WORKFLOW.MISSING_SEO'],
  ['social', 'WORKFLOW.MISSING_SOCIAL'],
  ['analytics', 'WORKFLOW.MISSING_ANALYTICS'],
  ['campaign', 'WORKFLOW.MISSING_CAMPAIGN'],
];

/**
 * The growth-workflow framer: it validates a growth-workflow request and frames it as a governed platform task,
 * deterministically and never throwing. It composes the six frozen planners (by reference) into a reusable workflow and
 * produces an immutable `GrowthWorkflow` carrying the frozen Agent Engine `AgentRequest` (a prompt and a provider step).
 * It composes no plan (the Agent Engine does), executes nothing, schedules nothing, automates nothing, orchestrates no
 * runtime, selects no provider, decides nothing, and owns no business truth; it references the planner outputs and the
 * knowledge the behavior consumes.
 */
export class GrowthWorkflowFramer {
  readonly #normalizer = new GrowthWorkflowNormalizer();
  readonly #hash: GrowthWorkflowHash;

  constructor(hash: GrowthWorkflowHash) {
    this.#hash = hash;
  }

  /** Frame a growth-workflow request into an immutable workflow, or fail closed on an unknown, blank, or invalid request. */
  frame(request: GrowthWorkflowRequest): Result<GrowthWorkflow, GrowthWorkflowError> {
    // Zero trust: a null/undefined (or primitive) request never throws; it settles to an empty request and fails closed.
    const safe: GrowthWorkflowRequest = request ?? ({} as GrowthWorkflowRequest);
    const type = safe.type;
    if (typeof type !== 'string' || !isWorkflowType(type)) {
      return err(
        new GrowthWorkflowError(
          'WORKFLOW.UNKNOWN_TYPE',
          `Unknown growth-workflow type '${String(type)}'.`,
          {},
        ),
      );
    }
    const objective = this.#normalizer.normalize(safe.objective);
    if (objective === '') {
      return err(
        new GrowthWorkflowError(
          'WORKFLOW.BLANK_OBJECTIVE',
          'A growth-workflow request has a blank objective.',
          {
            type,
          },
        ),
      );
    }
    const agent = this.#normalizer.normalize(safe.agent);
    if (agent === '') {
      return err(
        new GrowthWorkflowError(
          'WORKFLOW.BLANK_AGENT',
          'A growth-workflow request has a blank agent.',
          { type },
        ),
      );
    }
    // Every workflow references all six planner outputs; each blank fails closed with its own precise code.
    const upstream = {} as Record<PlannerStage, string>;
    for (const [stage, code] of PLANNER_GATES) {
      const value = this.#normalizer.normalize(safe[stage]);
      if (value === '') {
        return err(
          new GrowthWorkflowError(
            code,
            `A growth-workflow request must reference a ${stage} plan.`,
            { type },
          ),
        );
      }
      upstream[stage] = value;
    }
    const knowledge = this.#references(safe.knowledge);
    if (knowledge === null) {
      return err(
        new GrowthWorkflowError(
          'WORKFLOW.INVALID_REFERENCE',
          'A growth-workflow request may reference only canonical knowledge documents.',
          { type },
        ),
      );
    }

    const definition = WORKFLOW_DEFINITIONS[type];
    // A fresh frozen sequence: the workflow never aliases the shared catalogue array, and cannot be mutated.
    const sequence: readonly PlannerStage[] = Object.freeze([...definition.sequence]);
    const plannerReferences: readonly string[] = Object.freeze(
      sequence.map((stage) => upstream[stage]),
    );
    const contextReferences: readonly string[] = [...plannerReferences, ...knowledge];
    const steps: readonly AgentStep[] = [
      {
        capability: 'prompt',
        request: { variables: { objective, workflowType: type }, contextReferences },
      },
      { capability: 'provider', request: { capability: GENERATION_CAPABILITY } },
    ];
    const task = `${type}: ${objective}`;
    const agentRequest: AgentRequest = Object.freeze({ agent, task, steps: Object.freeze(steps) });
    const metadata = Object.freeze({
      category: definition.category,
      plannerCount: sequence.length,
    });
    const deliverable = `growth workflow ${type} deliverable for '${objective}'`;
    const canonical = JSON.stringify([
      type,
      objective,
      agent,
      upstream.marketing,
      upstream.content,
      upstream.seo,
      upstream.social,
      upstream.analytics,
      upstream.campaign,
      knowledge,
      task,
    ]);
    const workflow: GrowthWorkflow = {
      id: this.#hash.hash(canonical),
      type,
      objective,
      agent,
      sequence,
      plannerReferences,
      upstream: Object.freeze(upstream),
      knowledge,
      metadata,
      deliverable,
      request: agentRequest,
    };
    return ok(Object.freeze(workflow));
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
    // Deduplicate so the workflow id is invariant under the same reference set (a duplicate reference is redundant).
    return Object.freeze([...new Set(normalized)].sort());
  }
}
