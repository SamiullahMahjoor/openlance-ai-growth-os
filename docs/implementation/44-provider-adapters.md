# 44 - Provider Adapter Architecture and the OpenAI Adapter (Platform Completion, PC-2)

Design artifact for the concrete provider adapter architecture and its first adapter, `@openlance/aios-provider-adapter-openai`, approved with [ADR-0047](adr/0047-provider-adapters.md) under the ADR-0007 design-first cadence. This is the second item of the Platform Completion milestone (the prerequisite to Phase 5, AI Growth OS Features). It is not Phase 5.

## 1. Purpose

The Provider Engine (Phase 4, Stage 1, ADR-0035) is vendor-neutral and deliberately holds no vendor knowledge. To let the AIOS call a real model, a concrete adapter maps a neutral provider request to and from a specific vendor's API. This item defines the adapter architecture (how any concrete adapter is built) and delivers the first production adapter (OpenAI), isolating all vendor knowledge in one leaf package.

## 2. The adapter seam (frozen, consumed not modified)

An adapter implements the frozen `ProviderDescriptor` from `@openlance/aios-provider-engine`:

- `id: string`, `capabilities: readonly string[]`, optional `phase`;
- `invoke(clearance: GovernanceClearance, request: ProviderRequest): Promise<Result<unknown, ProviderError>>`;
- optional `probe(): Promise<HealthStatus>`.

The engine's `ProviderFactory` validates a descriptor into an immutable `Provider`. `invoke` requires a `GovernanceClearance` whose minter is unexported; the adapter accepts it and never inspects or mints it. The engine normalizes the adapter's raw `unknown` output into a `ProviderResponse`.

## 3. Adapter rules

- Separate `apps/*` package, depending only on `@openlance/aios-provider-engine` (seam types plus the `ProviderError` value) and `@openlance/aios-kernel` (`Result`). Acyclic leaf; the engine never depends on it.
- All vendor knowledge (vendor name, model ids, endpoint paths, authorization scheme, request/response mapping) lives only here.
- No I/O of its own: it calls an injected `Transport` (`send(request): Promise<TransportResult>`); it imports no HTTP client and no SDK.
- No embedded credential: API key and base URL are injected as options. A `no-embedded-credential` guard scans the source.
- Fail-closed and never throws: `invoke` returns `err(ProviderError)` on an unsupported capability, a malformed payload, a non-success status, a transport rejection, or an unparseable body, with stable `PROVIDER.ADAPTER_*` codes.

## 4. The Transport seam

```
interface TransportRequest { method: 'GET' | 'POST'; url: string; headers: Record<string,string>; body: string | null }
interface TransportResult { status: number; body: string }
interface Transport { send(request: TransportRequest): Promise<TransportResult> }
```

The composition root (PC-3) supplies a concrete transport (an HTTP client) and the credential. Tests supply a fake transport, so the adapter is deterministic and performs no network call during validation.

## 5. The OpenAI adapter

`createOpenAIProvider(options): ProviderDescriptor`, `options = { transport, apiKey, model, baseUrl?, capability? }` (default `capability` = `text-generation`, default `baseUrl` = the OpenAI API base).

- `invoke`: validates the request capability; maps `request.payload` (a `{ messages }` or `{ prompt }` shape) to the OpenAI chat-completions body; calls `transport.send({ method: 'POST', url: baseUrl + '/chat/completions', headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' }, body })`; on a 2xx it parses the JSON and maps `choices[0].message.content` to a neutral `{ text, model, id }` output and returns `ok`; on a non-2xx or an unparseable body it returns `err(ProviderError)`; a transport rejection is caught and returned as `err`.
- `probe`: sends a lightweight `GET baseUrl + '/models'`; a 2xx yields `healthy`, otherwise `unhealthy`; a rejection yields `unhealthy`.
- `id` = `openai:` + model; `capabilities` = [capability]; `phase` = `operation`.

## 6. Module inventory

`types` (Transport, options, the OpenAI request/response shapes), `errors-codes` (the `PROVIDER.ADAPTER_*` codes as consumed from the frozen `ProviderError`), `mapping` (payload -> body and response -> neutral output, both pure and zero-trust), `provider` (`createOpenAIProvider`), `index` (barrel). Guard tests: `no-embedded-credential`.

## 7. Validation and Definition of Done

`pnpm run validate` exits 0. 100% coverage (ADR-0015) via an injected fake transport (invoke success, unsupported capability, malformed payload, non-2xx, unparseable body, transport rejection; probe healthy/unhealthy/rejection; the mapping edge cases). Benchmarks recorded. Two independent audits (architecture/constitution and correctness/security) CLEAN, all Tier-1 and Tier-2 resolved. Frozen with `PROVIDER-ADAPTER-OPENAI-FREEZE.md`. The Provider Engine and every engine, plus `ai/` and `knowledge/`, remain byte-identical.
