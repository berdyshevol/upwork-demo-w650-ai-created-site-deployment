import type { Metadata } from "next";
import Link from "next/link";
import { faq } from "@/lib/seed/faq";
import { FaqClient } from "./faq-client";

export const metadata: Metadata = { title: "FAQ — InkPoint Studio" };

export default function FaqPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Before you book</h1>
        <p className="mt-2 text-sm text-ink-muted">
          The eight questions the front desk answers every week. Anything else,
          put it in the{" "}
          <Link href="/book" className="text-ink-accent hover:underline">
            booking form
          </Link>{" "}
          and an artist will pick it up.
        </p>
      </header>

      <FaqClient items={faq} />
    </div>
  );
}
