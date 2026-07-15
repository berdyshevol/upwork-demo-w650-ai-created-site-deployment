import { z } from "zod";
import { STYLES } from "./seed/artwork";

export const BUDGETS = [
  "Under $400",
  "$400 – $800",
  "$800 – $1,500",
  "$1,500+",
] as const;

/** Shared by the client form and the server action — one source of truth (FR6). */
export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Tell us what to call you."),
  email: z.string().trim().email("That email address looks incomplete."),
  style: z.enum(STYLES, { errorMap: () => ({ message: "Pick a style." }) }),
  placement: z.string().trim().min(2, "Where on the body should this go?"),
  size: z.string().trim().min(2, "Roughly how big? A hand span is fine."),
  budget: z.enum(BUDGETS, { errorMap: () => ({ message: "Pick a budget range." }) }),
  dates: z.string().trim().min(2, "Give us a week or two that works."),
  description: z
    .string()
    .trim()
    .min(20, "Twenty characters minimum — describe the idea so an artist can picture it."),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const briefSchema = z.object({
  summary: z.string(),
  suggestedArtistId: z.string(),
  estimatedSessions: z.number().int().min(1).max(8),
  prepNotes: z.array(z.string()).length(3),
});

export type ConsultationBrief = z.infer<typeof briefSchema> & {
  source: "ai" | "sample";
};

export type BookingRequest = BookingInput & {
  id: string;
  createdAt: string;
  brief: ConsultationBrief;
};

export type FieldErrors = Partial<Record<keyof BookingInput, string>>;

export function fieldErrors(error: z.ZodError<BookingInput>): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof BookingInput;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
