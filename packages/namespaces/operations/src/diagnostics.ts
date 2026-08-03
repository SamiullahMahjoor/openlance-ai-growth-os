/**
 * Diagnostics: how the cause of an operational problem is investigated, expressed as a diagnostic model, an
 * investigation architecture, and the relationships a diagnosis holds to what it investigates
 * (ai/operations/diagnostics.md, OL-AI-OPERATIONS-DIAGNOSTICS).
 *
 * The Specification narrates the diagnostic model as heterogeneous facets (the diagnostic model, investigation
 * architecture, diagnostic relationships, establishing cause not fixing or judging). It enumerates no closed
 * homogeneous set the model refers to by identity, so this concern is definitions only (principles and
 * invariants), consistent with the modeling rule recorded in docs/implementation/13-retrieval.md section 4. The
 * incident a diagnosis serves is owned by ai/operations/incident-management.md, the maintenance it leads to by
 * ai/operations/maintenance.md, and the reasoning of the AI about its task by ai/reasoning/, referenced not
 * restated (ADR-0020, ADR-0025).
 */

/**
 * A diagnostics principle: a permanent rule the diagnostic model upholds, each instantiating an operational
 * invariant (ai/operations/diagnostics.md, "Principles").
 */
export type DiagnosticsPrinciple =
  | 'diagnosis-investigates-a-cause-it-does-not-change-behavior'
  | 'diagnosis-rests-on-observed-signals'
  | 'diagnosis-is-grounded-and-traceable'
  | 'diagnosis-observes-it-never-reasons-about-the-task';

/** The diagnostics principles, in constitutional order; frozen. */
export const DIAGNOSTICS_PRINCIPLES: readonly DiagnosticsPrinciple[] = Object.freeze([
  'diagnosis-investigates-a-cause-it-does-not-change-behavior',
  'diagnosis-rests-on-observed-signals',
  'diagnosis-is-grounded-and-traceable',
  'diagnosis-observes-it-never-reasons-about-the-task',
]);

/** What each diagnostics principle requires (ai/operations/diagnostics.md, "Principles"). */
export const DIAGNOSTICS_PRINCIPLE_DESCRIPTIONS: Readonly<Record<DiagnosticsPrinciple, string>> =
  Object.freeze({
    'diagnosis-investigates-a-cause-it-does-not-change-behavior':
      'A diagnosis establishes why an operational problem occurred and never alters the behavior it investigates.',
    'diagnosis-rests-on-observed-signals':
      'A diagnosis rests on the signals owned by ai/operations/observability.md and what monitoring recognized, never on an unfounded guess.',
    'diagnosis-is-grounded-and-traceable':
      'A diagnosis is traceable from the observed signals to the cause it establishes, so it can be followed and never rests on a hidden judgment.',
    'diagnosis-observes-it-never-reasons-about-the-task':
      'A diagnosis investigates operational cause; the reasoning of the AI about its task is owned by ai/reasoning/, and a diagnosis never performs it.',
  });

/**
 * A diagnostics invariant: a guarantee the diagnostic model always upholds (ai/operations/diagnostics.md,
 * "Invariants").
 */
export type DiagnosticsInvariant =
  | 'investigates-and-establishes-a-cause-never-changes-the-behavior-investigated'
  | 'rests-on-observed-signals-traceable-from-signals-to-cause'
  | 'passes-its-cause-never-fixes-judges-or-protects'
  | 'investigates-operational-cause-never-performs-the-ais-reasoning'
  | 'diagnosing-a-problem-is-inert';

/** The diagnostics invariants, in constitutional order; frozen. */
export const DIAGNOSTICS_INVARIANTS: readonly DiagnosticsInvariant[] = Object.freeze([
  'investigates-and-establishes-a-cause-never-changes-the-behavior-investigated',
  'rests-on-observed-signals-traceable-from-signals-to-cause',
  'passes-its-cause-never-fixes-judges-or-protects',
  'investigates-operational-cause-never-performs-the-ais-reasoning',
  'diagnosing-a-problem-is-inert',
]);

/** What each diagnostics invariant guarantees (ai/operations/diagnostics.md, "Invariants"). */
export const DIAGNOSTICS_INVARIANT_DESCRIPTIONS: Readonly<Record<DiagnosticsInvariant, string>> =
  Object.freeze({
    'investigates-and-establishes-a-cause-never-changes-the-behavior-investigated':
      'A diagnosis investigates and establishes an operational cause and never changes the behavior it investigates.',
    'rests-on-observed-signals-traceable-from-signals-to-cause':
      'A diagnosis rests on observed signals and is traceable from signals to cause.',
    'passes-its-cause-never-fixes-judges-or-protects':
      'A diagnosis passes its cause to maintenance and the incident, and never itself fixes, judges, or protects.',
    'investigates-operational-cause-never-performs-the-ais-reasoning':
      "A diagnosis investigates operational cause and never performs the AI's reasoning about its task.",
    'diagnosing-a-problem-is-inert':
      'Diagnosing a problem never reasons about the task, executes, decides, changes behavior, or changes ownership, authority, governance, or business truth.',
  });
