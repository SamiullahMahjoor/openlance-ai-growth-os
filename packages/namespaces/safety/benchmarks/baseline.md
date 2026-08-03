# Safety predicate baselines

There are none. The Safety namespace is a Pure Domain Model (ADR-0020) of immutable definitions and
classifications, and it exposes **no executable predicate** (Engineering Rule 5, ADR-0022).

Unlike Governance (Risk, Autonomy), Providers, Memory, and Retrieval - each of which owns at least one
constitutionally named, ordered classification and so grounds an ordering predicate - the Safety
constitution defines no named ordered classification. Its risk levels are declared "an ordered set of
levels, from the lowest risk to the highest" but their members are not enumerated
(`ai/safety/risk-classification.md`), so naming or ordering them would invent a classification (forbidden);
its three classifications (hazard categories, refusal categories, impact dimensions) are unordered
taxonomies; and its escalation priority/hierarchy derive from risk and reference authorities owned by
other namespaces. There is therefore no constitutionally grounded pure predicate to expose, and no
executable code to benchmark. The `bench` script passes with no benchmark files
(`vitest bench --run --passWithNoTests`).
