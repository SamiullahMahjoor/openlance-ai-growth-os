/**
 * Incident management: how an operational incident, a discrete disruption in the running of the layer, is
 * recognized, classified, and responded to across its lifecycle (ai/operations/incident-management.md,
 * OL-AI-OPERATIONS-INCIDENT-MANAGEMENT).
 *
 * The Specification narrates the incident model as heterogeneous facets (incident lifecycle, incident
 * classification, incident response architecture, defer not protect or decide). Per the modeling rule recorded
 * in docs/implementation/13-retrieval.md section 4, none is modeled as a classification: the incident lifecycle
 * is narrated in a single sentence and restated in the invariants only by its endpoints ("from recognition to
 * closure"), not as a closed set referred to by identity; the incident classification is "a defined
 * classification of its severity and kind" whose severity levels and kinds the document does not enumerate (as
 * with the ordered-but-unnamed risk levels of ai/safety/), so no classification set is invented; and the
 * response architecture is a narrated structure. This concern is therefore definitions only. The diagnosis of
 * the cause is owned by ai/operations/diagnostics.md and the protective response by ai/safety/, referenced not
 * restated (ADR-0020, ADR-0025).
 */

/**
 * An incident-management principle: a permanent rule the incident model upholds, each instantiating an
 * operational invariant (ai/operations/incident-management.md, "Principles").
 */
export type IncidentManagementPrinciple =
  | 'an-incident-is-a-discrete-operational-disruption'
  | 'an-incident-is-classified'
  | 'response-restores-operation-it-never-changes-behavior'
  | 'an-incident-is-not-a-safety-hazard';

/** The incident-management principles, in constitutional order; frozen. */
export const INCIDENT_MANAGEMENT_PRINCIPLES: readonly IncidentManagementPrinciple[] = Object.freeze(
  [
    'an-incident-is-a-discrete-operational-disruption',
    'an-incident-is-classified',
    'response-restores-operation-it-never-changes-behavior',
    'an-incident-is-not-a-safety-hazard',
  ],
);

/** What each incident-management principle requires (ai/operations/incident-management.md, "Principles"). */
export const INCIDENT_MANAGEMENT_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<IncidentManagementPrinciple, string>
> = Object.freeze({
  'an-incident-is-a-discrete-operational-disruption':
    'An incident is a defined disruption in the running of the layer, distinct from the ongoing health state owned by ai/operations/health-management.md.',
  'an-incident-is-classified':
    'Every incident is classified by a defined classification, so its severity and kind are explicit, never ad hoc.',
  'response-restores-operation-it-never-changes-behavior':
    'An incident response restores the running of the layer and never changes the behavior of any namespace.',
  'an-incident-is-not-a-safety-hazard':
    'An operational incident is handled here; a hazard, risk, or protective response is owned by ai/safety/, to which an incident defers when safety is implied.',
});

/**
 * An incident-management invariant: a guarantee the incident model always upholds
 * (ai/operations/incident-management.md, "Invariants").
 */
export type IncidentManagementInvariant =
  | 'a-discrete-disruption-with-a-defined-lifecycle-from-recognition-to-closure'
  | 'every-incident-is-classified-by-severity-and-kind'
  | 'a-response-restores-operation-never-changes-behavior'
  | 'an-incident-implying-a-hazard-defers-to-safety-and-governance'
  | 'managing-an-incident-is-inert';

/** The incident-management invariants, in constitutional order; frozen. */
export const INCIDENT_MANAGEMENT_INVARIANTS: readonly IncidentManagementInvariant[] = Object.freeze(
  [
    'a-discrete-disruption-with-a-defined-lifecycle-from-recognition-to-closure',
    'every-incident-is-classified-by-severity-and-kind',
    'a-response-restores-operation-never-changes-behavior',
    'an-incident-implying-a-hazard-defers-to-safety-and-governance',
    'managing-an-incident-is-inert',
  ],
);

/** What each incident-management invariant guarantees (ai/operations/incident-management.md, "Invariants"). */
export const INCIDENT_MANAGEMENT_INVARIANT_DESCRIPTIONS: Readonly<
  Record<IncidentManagementInvariant, string>
> = Object.freeze({
  'a-discrete-disruption-with-a-defined-lifecycle-from-recognition-to-closure':
    'An incident is a discrete operational disruption with a defined lifecycle from recognition to closure.',
  'every-incident-is-classified-by-severity-and-kind':
    'Every incident is classified by a defined classification of severity and kind.',
  'a-response-restores-operation-never-changes-behavior':
    'An incident response restores operation and never changes the behavior of a namespace.',
  'an-incident-implying-a-hazard-defers-to-safety-and-governance':
    'An incident that implies a hazard defers a protective response to ai/safety/, and any governed decision to ai/governance/.',
  'managing-an-incident-is-inert':
    'Managing an incident never reasons, executes runtime behavior, decides, changes behavior, or changes ownership, authority, governance, or business truth.',
});
