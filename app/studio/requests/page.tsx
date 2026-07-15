import type { Metadata } from "next";
import { listRequests } from "@/lib/store";
import { RequestsClient } from "./requests-client";

export const metadata: Metadata = { title: "Studio queue — InkPoint Studio" };

// The store is per-process and mutates on every booking, so this page can never
// be cached at build time.
export const dynamic = "force-dynamic";

export default function StudioRequestsPage() {
  const requests = listRequests();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Studio queue</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Every request from this session, newest first, followed by two seeded
          examples. Expand a row to read the consultation brief the visitor never
          had to write. Demo page — no login, and the queue resets when the
          server restarts.
        </p>
      </header>

      <RequestsClient requests={requests} />
    </div>
  );
}
