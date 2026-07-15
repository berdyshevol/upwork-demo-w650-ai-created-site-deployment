import type { BookingRequest, ConsultationBrief } from "./schema";

/**
 * Ephemeral request store. Demo scope explicitly excludes a database, so this
 * lives in the server process and resets on redeploy. Hung off globalThis so
 * dev-mode module reloads don't drop the session's requests.
 */
const globalStore = globalThis as unknown as {
  __inkpointRequests?: Map<string, BookingRequest>;
};

const requests: Map<string, BookingRequest> = (globalStore.__inkpointRequests ??=
  new Map());

const seeded: BookingRequest[] = [
  {
    id: "INK-7B31",
    createdAt: "2026-07-13T09:12:00.000Z",
    name: "Tomas Reiner",
    email: "t.reiner@example.com",
    style: "Blackwork",
    placement: "Left shoulder to elbow",
    size: "Half sleeve",
    budget: "$1,500+",
    dates: "Any Thursday in August",
    description:
      "Ornamental blackwork half sleeve built around a compass motif, heavy on negative space, wrapping the outer arm.",
    brief: {
      summary:
        "Tomas Reiner is after an ornamental blackwork half sleeve built around a compass motif with heavy negative space — blackwork, left shoulder to elbow, half sleeve scale. Budget is $1,500+ with August Thursdays open, which is squarely Dex Moreau's panel work.",
      suggestedArtistId: "dex-moreau",
      estimatedSessions: 5,
      prepNotes: [
        "Send a straight-on photo of the outer arm so the wrap can be mapped before the stencil.",
        "Clear a full afternoon for the first sitting — negative space is laid out in one pass.",
        "Wear a vest or loose tee; the whole shoulder needs to be free.",
      ],
      source: "ai",
    },
  },
  {
    id: "INK-2C08",
    createdAt: "2026-07-12T16:40:00.000Z",
    name: "Priya Raman",
    email: "priya.raman@example.com",
    style: "Traditional",
    placement: "Right calf",
    size: "Palm-sized",
    budget: "$400 – $800",
    dates: "Late July, evenings",
    description:
      "A traditional swallow carrying a letter, bold outline, red and gold only, sitting just below the knee.",
    brief: {
      summary:
        "Priya Raman is after a traditional swallow carrying a letter in red and gold only — traditional, right calf, palm-sized. Budget is $400 – $800 with late-July evenings preferred, which points at Rosa Vance.",
      suggestedArtistId: "rosa-vance",
      estimatedSessions: 2,
      prepNotes: [
        "Look through the flash book first — there are three swallow sheets that already fit this brief.",
        "Two-colour traditional wants bold sizing; expect Rosa to push it slightly larger.",
        "Skip alcohol for 24 hours so the linework takes evenly.",
      ],
      source: "ai",
    },
  },
];

function newId(): string {
  let id: string;
  do {
    id = `INK-${Math.floor(Math.random() * 0x10000)
      .toString(16)
      .toUpperCase()
      .padStart(4, "0")}`;
  } while (requests.has(id) || seeded.some((r) => r.id === id));
  return id;
}

export function addRequest(
  data: Omit<BookingRequest, "id" | "createdAt">,
): BookingRequest {
  const record: BookingRequest = {
    ...data,
    id: newId(),
    createdAt: new Date().toISOString(),
  };
  requests.set(record.id, record);
  return record;
}

/** Upgrades a stored request once the visitor's own AI call returns (FR8). */
export function attachBrief(id: string, brief: ConsultationBrief): void {
  const record = requests.get(id);
  if (record) record.brief = brief;
}

/** This session's requests, newest first, then the two seeded examples (FR11). */
export function listRequests(): BookingRequest[] {
  return [
    ...[...requests.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    ),
    ...seeded,
  ];
}
