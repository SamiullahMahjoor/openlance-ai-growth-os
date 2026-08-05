/**
 * A transport request the adapter hands to the injected transport. It is technology-neutral: a method, a URL, headers,
 * and an optional string body. The adapter constructs it; the transport carries it out.
 */
export interface TransportRequest {
  readonly method: 'GET' | 'POST';
  readonly url: string;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: string | null;
}

/** A transport result: the status code and the raw response body. The adapter maps the body; it performs no I/O itself. */
export interface TransportResult {
  readonly status: number;
  readonly body: string;
}

/**
 * The transport seam: the only I/O surface the adapter uses. The composition root supplies a concrete implementation (an
 * HTTP client); tests supply a fake, so the adapter is deterministic and performs no network call during validation. The
 * adapter imports no HTTP client and no SDK.
 */
export interface Transport {
  send(request: TransportRequest): Promise<TransportResult>;
}

/**
 * The options an OpenAI provider is constructed from. The API key and base URL are injected (never embedded), and the
 * transport carries every request. `capability` defaults to `text-generation`; `baseUrl` defaults to the OpenAI API base.
 */
export interface OpenAIProviderOptions {
  readonly transport: Transport;
  readonly apiKey: string;
  readonly model: string;
  readonly baseUrl?: string;
  readonly capability?: string;
}

/** The neutral text-generation output the adapter returns; the Provider Engine normalizes it into a ProviderResponse. */
export interface OpenAITextOutput {
  readonly text: string;
  readonly model: string;
  readonly id: string;
}
