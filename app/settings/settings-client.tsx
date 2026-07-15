"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PROVIDER_LABELS,
  PROVIDER_MODELS,
  clearByok,
  readByok,
  writeByok,
  type Provider,
} from "@/lib/byok";

type UiProvider = Exclude<Provider, "mock">;

const PROVIDERS = Object.keys(PROVIDER_LABELS) as UiProvider[];

export function SettingsClient() {
  const [provider, setProvider] = React.useState<UiProvider>("anthropic");
  const [model, setModel] = React.useState(PROVIDER_MODELS.anthropic[0]);
  const [apiKey, setApiKey] = React.useState("");
  const [status, setStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    const saved = readByok();
    if (!saved || saved.provider === "mock") return;
    setProvider(saved.provider);
    setModel(saved.model);
    setApiKey(saved.apiKey);
    setStatus(`Saved — using ${PROVIDER_LABELS[saved.provider]} / ${saved.model}.`);
  }, []);

  function onProviderChange(next: string) {
    const key = next as UiProvider;
    setProvider(key);
    setModel(PROVIDER_MODELS[key][0]);
    setStatus(null);
  }

  function onSave() {
    if (!apiKey.trim()) {
      setStatus("Paste a key first — nothing was saved.");
      return;
    }
    writeByok({ provider, apiKey: apiKey.trim(), model });
    setStatus(`Saved — using ${PROVIDER_LABELS[provider]} / ${model}.`);
  }

  function onClear() {
    clearByok();
    setApiKey("");
    setStatus("Cleared. AI features fall back to the sample brief.");
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <span className="label">Provider</span>
        <Select value={provider} onValueChange={onProviderChange}>
          <SelectTrigger aria-label="Provider">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROVIDERS.map((key) => (
              <SelectItem key={key} value={key}>
                {PROVIDER_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="label" htmlFor="apiKey">
          {PROVIDER_LABELS[provider]} API key
        </label>
        <input
          id="apiKey"
          type="password"
          autoComplete="off"
          className="field font-mono"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            setStatus(null);
          }}
          placeholder={provider === "anthropic" ? "sk-ant-…" : "sk-…"}
        />
      </div>

      <div>
        <span className="label">Model</span>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger aria-label="Model">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROVIDER_MODELS[provider].map((option, i) => (
              <SelectItem key={option} value={option}>
                {option}
                {i === 0 ? " (default)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" className="btn-primary" onClick={onSave}>
          Save
        </button>
        <button type="button" className="btn-ghost" onClick={onClear}>
          Clear
        </button>
      </div>

      {status && (
        <p data-testid="byok-status" className="text-sm text-ink-muted">
          {status}
        </p>
      )}
    </div>
  );
}
