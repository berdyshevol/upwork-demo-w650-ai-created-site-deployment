import type { Metadata } from "next";
import Link from "next/link";
import { BookingForm } from "./booking-form";

export const metadata: Metadata = { title: "Book a session — InkPoint Studio" };

export default function BookPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold">Request a consultation</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Every field helps an artist picture the piece before they reply. We
          turn your description into a consultation brief — you never have to
          write one yourself. Deposit terms are in the{" "}
          <Link href="/faq" className="text-ink-accent hover:underline">
            FAQ
          </Link>
          ; nothing is charged here.
        </p>
      </header>

      <BookingForm />
    </div>
  );
}
