import type { Metadata } from "next";
import { SettingsClient } from "./settings-client";

export const metadata: Metadata = { title: "Settings — InkPoint Studio" };

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold">AI settings</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          The consultation brief runs on your key, not ours. It is stored only in
          this browser&apos;s localStorage, sent straight from this page to the
          provider you choose, and never reaches the InkPoint server. Without a
          key the whole site still works — booking just returns a sample brief.
        </p>
      </header>

      <SettingsClient />
    </div>
  );
}
