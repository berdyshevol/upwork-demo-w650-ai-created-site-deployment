import { artists } from "./seed/artists";
import type { BookingInput, ConsultationBrief } from "./schema";
import { BUDGETS } from "./schema";

/** First sentence of the idea, trimmed to something a summary can carry. */
function gist(description: string): string {
  const first = description.split(/(?<=[.!?])\s/)[0] ?? description;
  const clipped = first.length > 120 ? `${first.slice(0, 117).trimEnd()}…` : first;
  return clipped.replace(/[.!?]+$/, "").toLowerCase();
}

export function matchArtistId(style: string): string {
  return (artists.find((a) => a.styles.includes(style)) ?? artists[0]).id;
}

function estimateSessions(input: BookingInput): number {
  const budgetWeight = Math.max(1, BUDGETS.indexOf(input.budget) + 1);
  const bigPiece = /(sleeve|back|chest|thigh|full|half)/i.test(
    `${input.placement} ${input.size}`,
  )
    ? 1
    : 0;
  const dense = input.style === "Blackwork" || input.style === "Color" ? 1 : 0;
  return Math.min(8, budgetWeight + bigPiece + dense);
}

const PREP_BY_STYLE: Record<string, string[]> = {
  "Fine-line": [
    "Bring any reference photos — line weight decisions get made from them, not from memory.",
    "Fine-line settles best on skin that has not been shaved raw; leave it alone for 48 hours before.",
    "Budget a full sitting: single-needle work is slow and rushing it costs crispness.",
  ],
  Blackwork: [
    "Send a straight-on, well-lit photo of the area, including anything already tattooed there.",
    "Eat properly beforehand — solid black packing is the longest stretch of pain in the shop.",
    "Wear clothing that frees the whole limb; the stencil needs the full panel, not a window.",
  ],
  Traditional: [
    "Look through the flash book before your date — it is faster to adapt a sheet than to start blank.",
    "Traditional wants bold placement; be ready for the artist to size it up rather than down.",
    "Skip alcohol for 24 hours so the linework takes the ink evenly.",
  ],
  Color: [
    "Tell us about any pigment or nickel allergies before the appointment, not on the day.",
    "Colour needs untanned skin — keep the area out of direct sun for two weeks beforehand.",
    "Plan a second sitting for saturation; first-pass colour always heals lighter than it looks.",
  ],
};

/**
 * The deterministic brief shown when the visitor has not brought an AI key, and
 * the fallback when their provider call fails (FR9).
 */
export function sampleBrief(input: BookingInput): ConsultationBrief {
  const artistId = matchArtistId(input.style);
  const artist = artists.find((a) => a.id === artistId)!;
  const sessions = estimateSessions(input);

  return {
    summary:
      `${input.name} is after ${gist(input.description)} — ${input.style.toLowerCase()}, ` +
      `${input.placement.toLowerCase()}, around ${input.size}. ` +
      `Budget sits at ${input.budget} with ${input.dates.toLowerCase()} preferred, which points at ${artist.name}.`,
    suggestedArtistId: artistId,
    estimatedSessions: sessions,
    prepNotes: PREP_BY_STYLE[input.style] ?? PREP_BY_STYLE["Fine-line"],
    source: "sample",
  };
}
