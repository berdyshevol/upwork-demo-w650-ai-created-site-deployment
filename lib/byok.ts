export type Provider = "anthropic" | "openai" | "google" | "mock";

export type ByokConfig = {
  provider: Provider;
  apiKey: string;
  model: string;
};

export const BYOK_KEY = "byok";

export const PROVIDER_LABELS: Record<Exclude<Provider, "mock">, string> = {
  anthropic: "Anthropic",
  openai: "OpenAI",
  google: "Google",
};

export const PROVIDER_MODELS: Record<Exclude<Provider, "mock">, string[]> = {
  anthropic: ["claude-haiku-4-5", "claude-sonnet-4-6", "claude-opus-4-7"],
  openai: ["gpt-4o-mini", "gpt-4o", "o1-mini"],
  google: ["gemini-2.0-flash", "gemini-2.5-pro"],
};

/**
 * The visitor's key lives in their own localStorage and nowhere else — it is
 * never sent to this app's server, logged, or persisted server-side.
 */
export function readByok(): ByokConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(BYOK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ByokConfig>;
    if (!parsed.provider || !parsed.apiKey || !parsed.model) return null;
    return parsed as ByokConfig;
  } catch {
    return null;
  }
}

export function writeByok(config: ByokConfig): void {
  window.localStorage.setItem(BYOK_KEY, JSON.stringify(config));
}

export function clearByok(): void {
  window.localStorage.removeItem(BYOK_KEY);
}
