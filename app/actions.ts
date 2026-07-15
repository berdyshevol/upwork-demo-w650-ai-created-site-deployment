"use server";

import { revalidatePath } from "next/cache";
import { sampleBrief } from "@/lib/brief";
import {
  bookingSchema,
  briefSchema,
  fieldErrors,
  type BookingInput,
  type ConsultationBrief,
  type FieldErrors,
} from "@/lib/schema";
import { addRequest, attachBrief } from "@/lib/store";

export type SubmitResult =
  | { ok: true; id: string; brief: ConsultationBrief }
  | { ok: false; errors: FieldErrors };

/**
 * Validate → store → confirm (FR7). The brief starts as the deterministic
 * sample so the confirmation is never blank or broken; if the visitor brought
 * an API key, the browser upgrades it via `saveBrief` (FR8/FR9).
 */
export async function submitBooking(input: BookingInput): Promise<SubmitResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const record = addRequest({ ...parsed.data, brief: sampleBrief(parsed.data) });
  revalidatePath("/studio/requests");

  return { ok: true, id: record.id, brief: record.brief };
}

/**
 * Stores the brief the visitor's own provider generated in their browser. Only
 * the brief crosses the wire — their API key never leaves their machine.
 */
export async function saveBrief(
  id: string,
  brief: ConsultationBrief,
): Promise<void> {
  const parsed = briefSchema.safeParse(brief);
  if (!parsed.success) return;

  attachBrief(id, { ...parsed.data, source: brief.source === "ai" ? "ai" : "sample" });
  revalidatePath("/studio/requests");
}
