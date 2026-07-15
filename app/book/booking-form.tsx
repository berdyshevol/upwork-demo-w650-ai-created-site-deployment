"use client";

import * as React from "react";
import Link from "next/link";
import { saveBrief, submitBooking } from "@/app/actions";
import { BriefCard } from "@/components/brief-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { readByok } from "@/lib/byok";
import { generateBrief } from "@/lib/llm";
import { STYLES } from "@/lib/seed/artwork";
import {
  BUDGETS,
  bookingSchema,
  fieldErrors,
  type BookingInput,
  type ConsultationBrief,
  type FieldErrors,
} from "@/lib/schema";

const EMPTY = {
  name: "",
  email: "",
  style: "",
  placement: "",
  size: "",
  budget: "",
  dates: "",
  description: "",
};

type Confirmation = { id: string; brief: ConsultationBrief };

function FieldError({ name, message }: { name: string; message?: string }) {
  if (!message) return null;
  return (
    <p data-testid={`error-${name}`} className="mt-1.5 text-xs text-red-400">
      {message}
    </p>
  );
}

export function BookingForm() {
  const [values, setValues] = React.useState<Record<string, string>>(EMPTY);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState<Confirmation | null>(null);
  const [aiPending, setAiPending] = React.useState(false);
  const [hasKey, setHasKey] = React.useState(false);

  React.useEffect(() => setHasKey(readByok() !== null), []);

  const set = (field: string) => (value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);

    // Same schema the server action runs — the client just gets there first (FR6).
    const parsed = bookingSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setSubmitting(false);
      return;
    }
    setErrors({});

    const result = await submitBooking(parsed.data);
    setSubmitting(false);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setConfirmation({ id: result.id, brief: result.brief });
    void upgradeBrief(result.id, parsed.data);
  }

  /** The visitor's own key, their own browser, their own bill (BYOK). */
  async function upgradeBrief(id: string, input: BookingInput) {
    const config = readByok();
    if (!config) return;

    setAiPending(true);
    const brief = await generateBrief(input, config);
    setConfirmation((prev) => (prev && prev.id === id ? { ...prev, brief } : prev));
    setAiPending(false);
    await saveBrief(id, brief);
  }

  if (confirmation) {
    return (
      <div data-testid="confirmation" className="max-w-2xl space-y-6">
        <div className="rounded-xl border border-ink-accent/40 bg-ink-panel p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-accent">
            Request received
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Your reference is{" "}
            <span data-testid="reference-id" className="text-ink-accent">
              {confirmation.id}
            </span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Quote it in any reply. An artist reads the brief below and comes back
            within two working days with a date or a question. Nothing is held
            until the $100 deposit is paid.
          </p>
        </div>

        <BriefCard brief={confirmation.brief} pending={aiPending} />

        {!hasKey && (
          <p
            data-testid="byok-hint"
            className="rounded-lg border border-ink-line bg-ink-panel p-4 text-sm text-ink-muted"
          >
            Choose a provider and paste your API key in Settings to enable live AI.
            {" "}
            <Link href="/settings" className="text-ink-accent hover:underline">
              Open settings
            </Link>
            .
          </p>
        )}

        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            setConfirmation(null);
            setValues(EMPTY);
          }}
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Your name
          </label>
          <input
            id="name"
            className="field"
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            placeholder="Mara Ellis"
          />
          <FieldError name="name" message={errors.name} />
        </div>

        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="field"
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            placeholder="you@example.com"
          />
          <FieldError name="email" message={errors.email} />
        </div>

        <div>
          <span className="label">Style</span>
          <Select value={values.style} onValueChange={set("style")}>
            <SelectTrigger aria-label="Style">
              <SelectValue placeholder="Pick a style" />
            </SelectTrigger>
            <SelectContent>
              {STYLES.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError name="style" message={errors.style} />
        </div>

        <div>
          <span className="label">Budget range</span>
          <Select value={values.budget} onValueChange={set("budget")}>
            <SelectTrigger aria-label="Budget range">
              <SelectValue placeholder="Pick a range" />
            </SelectTrigger>
            <SelectContent>
              {BUDGETS.map((budget) => (
                <SelectItem key={budget} value={budget}>
                  {budget}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError name="budget" message={errors.budget} />
        </div>

        <div>
          <label className="label" htmlFor="placement">
            Placement
          </label>
          <input
            id="placement"
            className="field"
            value={values.placement}
            onChange={(e) => set("placement")(e.target.value)}
            placeholder="Inner forearm"
          />
          <FieldError name="placement" message={errors.placement} />
        </div>

        <div>
          <label className="label" htmlFor="size">
            Approximate size
          </label>
          <input
            id="size"
            className="field"
            value={values.size}
            onChange={(e) => set("size")(e.target.value)}
            placeholder="Palm-sized, about 12 cm"
          />
          <FieldError name="size" message={errors.size} />
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="dates">
            Preferred dates
          </label>
          <input
            id="dates"
            className="field"
            value={values.dates}
            onChange={(e) => set("dates")(e.target.value)}
            placeholder="Weekends in March, or any Thursday"
          />
          <FieldError name="dates" message={errors.dates} />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="description">
          Your tattoo idea
        </label>
        <textarea
          id="description"
          rows={5}
          className="w-full rounded-md border border-ink-line bg-ink-bg p-3 text-sm leading-relaxed placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-ink-accent"
          value={values.description}
          onChange={(e) => set("description")(e.target.value)}
          placeholder="Describe it however it comes out — subject, mood, what it is for, anything you definitely do not want."
        />
        <FieldError name="description" message={errors.description} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Sending…" : "Request a consultation"}
        </button>
        <p className="text-xs text-ink-muted">
          {hasKey
            ? "Your API key will draft the consultation brief in your browser."
            : "You will get a sample brief — add your own API key in Settings for a live one."}
        </p>
      </div>
    </form>
  );
}
