/**
 * The Runtime namespace, namespace-wide truth (ai/runtime/README.md, OL-AI-RUNTIME-README; ai/runtime/runtime.md,
 * OL-AI-RUNTIME-RUNTIME).
 *
 * The runtime invariants every execution concern upholds, and the canonical inventory of the execution-model
 * concerns, as immutable definitions (ADR-0020). The namespace is the execution kernel of the AI layer: it
 * defines how an AI task is initialized, loaded, validated, run, monitored, recovered, and finalized. It
 * defines the execution model and never carries it out: it enforces the governance mandates in a defined
 * order, orchestrates the loading of knowledge and the results of the operational namespaces, and owns none of
 * the rules, truth, or behavior it sequences, and it never defines a provider, model, framework, language,
 * runtime system, protocol, interface, or code (ai/runtime/README.md). Every execution follows one defined,
 * governed model at any scale (ai/runtime/runtime.md).
 *
 * ADR-0024 classifies Runtime as category 3 (Runtime Service): it owns lifecycle and orchestration and
 * coordinates execution in the AI Operating System. That names the runtime's constitutional role; the package
 * that conforms to the frozen, technology-neutral ai/runtime/ specification is realized per ADR-0020 (which
 * governs every namespace "in addition to" the category, ADR-0024 §42) as an immutable, stateless domain
 * model with no IO, no state, and no services. Its executable surface is five pure deterministic algorithms -
 * the execution state-transition relation (transitionAllowed) and the execution-lifecycle, session-lifecycle,
 * workflow-step, and validation-stage orderings. The actual orchestration and execution over a concrete task
 * are the operational runtime's, outside this constitutional-conformance package.
 */

/**
 * A runtime invariant: a permanent guarantee every runtime document upholds and no execution may violate
 * (ai/runtime/README.md, "Runtime Invariants"). Every execution concern's principles instantiate these.
 */
export type RuntimeInvariant =
  | 'governance-precedes-execution'
  | 'every-execution-has-a-defined-lifecycle'
  | 'owns-no-truth-rule-or-behavior'
  | 'stays-within-its-grant'
  | 'failure-is-handled-safely'
  | 'execution-is-observable'
  | 'changes-nothing-at-execution-time'
  | 'scales-independently';

/** The eight runtime invariants, in constitutional order; frozen. */
export const RUNTIME_INVARIANTS: readonly RuntimeInvariant[] = Object.freeze([
  'governance-precedes-execution',
  'every-execution-has-a-defined-lifecycle',
  'owns-no-truth-rule-or-behavior',
  'stays-within-its-grant',
  'failure-is-handled-safely',
  'execution-is-observable',
  'changes-nothing-at-execution-time',
  'scales-independently',
]);

/** The guarantee each runtime invariant states (ai/runtime/README.md, "Runtime Invariants"). */
export const RUNTIME_INVARIANT_DESCRIPTIONS: Readonly<Record<RuntimeInvariant, string>> =
  Object.freeze({
    'governance-precedes-execution':
      'Every significant action is validated against governance before it runs, in the order the runtime defines and the rules governance owns.',
    'every-execution-has-a-defined-lifecycle':
      'An execution has a defined beginning and end, and it always reaches a terminal state and releases its resources.',
    'owns-no-truth-rule-or-behavior':
      'Execution consumes rules from governance, truth from the knowledge repository, and behavior from the operational namespaces, and owns none of them.',
    'stays-within-its-grant':
      'An execution acts only within the permissions and autonomy granted to it, as owned by ai/governance/, and never expands them.',
    'failure-is-handled-safely':
      'Every failure resolves to a defined outcome of retry, recovery, or termination, and whether execution may continue, escalate, or refuse is decided by governance.',
    'execution-is-observable':
      'Every execution emits the defined lifecycle events, so it can be followed and reviewed.',
    'changes-nothing-at-execution-time':
      'Execution never changes ownership, authority, governance, or the knowledge repository.',
    'scales-independently':
      'One execution and many millions of concurrent executions follow the same model, without redesign.',
  });

/**
 * A runtime concern: one aspect of the execution model, each owned by exactly one document
 * (ai/runtime/runtime.md, "The Execution-Model Concerns"). This is the namespace inventory identity; the model
 * of each concern is owned by its named document and this package's corresponding module.
 */
export type RuntimeConcern =
  | 'execution-lifecycle'
  | 'session-lifecycle'
  | 'execution-states'
  | 'execution-workflow'
  | 'context-loading'
  | 'knowledge-resolution'
  | 'validation-pipeline'
  | 'execution-boundaries'
  | 'failure-recovery'
  | 'event-lifecycle';

/** The ten execution-model concerns, in inventory order; frozen. */
export const RUNTIME_CONCERNS: readonly RuntimeConcern[] = Object.freeze([
  'execution-lifecycle',
  'session-lifecycle',
  'execution-states',
  'execution-workflow',
  'context-loading',
  'knowledge-resolution',
  'validation-pipeline',
  'execution-boundaries',
  'failure-recovery',
  'event-lifecycle',
]);

/** What each runtime concern owns (ai/runtime/runtime.md, "The Execution-Model Concerns"). */
export const RUNTIME_CONCERN_DESCRIPTIONS: Readonly<Record<RuntimeConcern, string>> = Object.freeze(
  {
    'execution-lifecycle':
      'The lifecycle of a single execution, from creation to closure, and the phases it passes through.',
    'session-lifecycle':
      'The lifecycle of a session, the container within which executions run, from establishment to closure.',
    'execution-states':
      'The execution state model, the named states an execution may hold, and the permitted transitions between them.',
    'execution-workflow':
      'The required order of an execution: the ordered sequence of phases from initialization through finalization.',
    'context-loading':
      'How the runtime assembles the execution context by combining loaded knowledge, memory, and the task into the working context an execution runs with.',
    'knowledge-resolution':
      'How the runtime orchestrates the loading of knowledge into an execution, in the order the loading strategy requires.',
    'validation-pipeline':
      'The order in which an execution is validated against governance before it proceeds.',
    'execution-boundaries':
      'The architectural boundaries of an execution: its scope, isolation, and the limits it operates within.',
    'failure-recovery':
      'Failure handling, retries, timeouts, cancellation, recovery, checkpoint and rollback policy, and execution termination.',
    'event-lifecycle': 'The architectural lifecycle events an execution emits.',
  },
);
