import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import type { LanguageModel } from "ai";
import { artists } from "./seed/artists";
import { sampleBrief } from "./brief";
import { briefSchema, type BookingInput, type ConsultationBrief } from "./schema";
import type { ByokConfig } from "./byok";

/**
 * Builds a model bound to the visitor's own key. Every call goes browser →
 * provider directly; this app's server never sees the key and never pays for a
 * token. Anthropic blocks direct browser calls unless the
 * `anthropic-dangerous-direct-browser-access` header opts in — that header is
 * this SDK's equivalent of the Anthropic client's `dangerouslyAllowBrowser`.
 */
export function modelFor({ provider, apiKey, model }: ByokConfig): LanguageModel {
  switch (provider) {
    case "anthropic":
      return createAnthropic({
        apiKey,
        headers: { "anthropic-dangerous-direct-browser-access": "true" },
      })(model);
    case "openai":
      return createOpenAI({ apiKey })(model);
    case "google":
      return createGoogleGenerativeAI({ apiKey })(model);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/** Deterministic stand-in used by the behavioural tests — never touches a network. */
function mockBrief(input: BookingInput): ConsultationBrief {
  const base = sampleBrief(input);
  return {
    ...base,
    summary: `${input.name} wants ${input.description.replace(/\.$/, "")}. Read as ${input.style.toLowerCase()} on the ${input.placement.toLowerCase()} at roughly ${input.size}.`,
    source: "ai",
  };
}

function prompt(input: BookingInput): string {
  const roster = artists
    .map((a) => `- ${a.id} (${a.name}): ${a.styles.join(", ")}. ${a.bio}`)
    .join("\n");

  return [
    "You are the studio manager at InkPoint, a tattoo studio. Turn this booking request into a consultation brief the artists can read at a glance.",
    "",
    "Request:",
    `- Name: ${input.name}`,
    `- Style: ${input.style}`,
    `- Placement: ${input.placement}`,
    `- Approximate size: ${input.size}`,
    `- Budget: ${input.budget}`,
    `- Preferred dates: ${input.dates}`,
    `- Idea in their words: ${input.description}`,
    "",
    "Roster (suggestedArtistId MUST be one of these ids):",
    roster,
    "",
    "Write summary as exactly 2 sentences that restate their actual idea concretely — never generic filler.",
    "estimatedSessions is a whole number of sittings (1-8). prepNotes is exactly 3 short, specific, practical notes for this request.",
  ].join("\n");
}

/**
 * Generates the brief with the visitor's key. Any failure — bad key, rate limit,
 * refusal, offline — degrades to the deterministic sample brief (FR9).
 */
export async function generateBrief(
  input: BookingInput,
  config: ByokConfig,
): Promise<ConsultationBrief> {
  if (config.provider === "mock") return mockBrief(input);

  try {
    const { object } = await generateObject({
      model: modelFor(config),
      schema: briefSchema,
      prompt: prompt(input),
    });

    const known = artists.some((a) => a.id === object.suggestedArtistId);
    return {
      ...object,
      suggestedArtistId: known
        ? object.suggestedArtistId
        : sampleBrief(input).suggestedArtistId,
      prepNotes: object.prepNotes.slice(0, 3),
      source: "ai",
    };
  } catch {
    return sampleBrief(input);
  }
}
