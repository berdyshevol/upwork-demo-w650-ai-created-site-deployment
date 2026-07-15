import { test, expect, type Page } from "@playwright/test";

/**
 * Acceptance tests for the InkPoint Studio live-site slice.
 * One test() block per acceptance criterion in the PRD, plus the BYOK gate.
 *
 * The AI brief is generated in the browser with the visitor's own key (BYOK),
 * so tests seed localStorage.byok with the "mock" provider — no real key, ever.
 */

const MOCK_BYOK = JSON.stringify({
  provider: "mock",
  apiKey: "test",
  model: "mock",
});

async function useMockKey(page: Page) {
  await page.addInitScript((blob) => {
    window.localStorage.setItem("byok", blob as string);
  }, MOCK_BYOK);
}

const IDEA =
  "A fine-line moth with moon phases along its wings, soft shading, no color.";

async function fillBooking(
  page: Page,
  overrides: { email?: string; description?: string } = {},
) {
  await page.getByLabel("Your name").fill("Mara Ellis");

  const email = overrides.email ?? "mara@example.com";
  if (email) await page.getByLabel("Email").fill(email);

  await page.getByLabel("Style").click();
  await page.getByRole("option", { name: "Fine-line" }).click();

  await page.getByLabel("Placement").fill("Left forearm");
  await page.getByLabel("Approximate size").fill("12 cm tall");

  await page.getByLabel("Budget range").click();
  await page.getByRole("option", { name: "$400 – $800" }).click();

  await page.getByLabel("Preferred dates").fill("Weekends in March");
  await page
    .getByLabel("Your tattoo idea")
    .fill(overrides.description ?? IDEA);
}

test("homepage shows hero, studio intro, featured work and both CTAs", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: /ink|skin|studio/i }),
  ).toBeVisible();
  await expect(page.getByTestId("studio-intro")).toBeVisible();
  await expect(page.getByTestId("featured-strip")).toBeVisible();

  await expect(page.getByRole("link", { name: "Book a session" })).toHaveAttribute(
    "href",
    "/book",
  );
  await expect(page.getByRole("link", { name: "See the gallery" })).toHaveAttribute(
    "href",
    "/gallery",
  );
});

test("AC1a: filtering the gallery to a style updates the grid and the URL", async ({
  page,
}) => {
  await page.goto("/gallery");

  const tiles = page.getByTestId("artwork-tile");
  const total = await tiles.count();
  expect(total).toBeGreaterThan(8);

  await page.getByRole("link", { name: "Fine-line", exact: true }).click();

  await expect(page).toHaveURL(/\/gallery\?style=Fine-line/);
  const filtered = await tiles.count();
  expect(filtered).toBeGreaterThan(0);
  expect(filtered).toBeLessThan(total);

  for (const badge of await page.getByTestId("tile-style").all()) {
    await expect(badge).toHaveText("Fine-line");
  }
});

test("AC1b: a tile opens a detail dialog that closes with Escape", async ({
  page,
}) => {
  await page.goto("/gallery");
  await page.getByTestId("artwork-tile").first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByTestId("detail-artist")).toBeVisible();
  await expect(dialog.getByTestId("detail-style")).toBeVisible();
  await expect(dialog.getByTestId("detail-placement")).toBeVisible();
  await expect(dialog.getByTestId("detail-session")).toContainText(/hour/i);

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("AC1b-2: the detail dialog also closes with the close button", async ({
  page,
}) => {
  await page.goto("/gallery");
  await page.getByTestId("artwork-tile").first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: /close/i }).click();
  await expect(dialog).not.toBeVisible();
});

test("AC2: bad email and too-short description show inline errors and block submit; fixing them confirms", async ({
  page,
}) => {
  await page.goto("/book");

  await fillBooking(page, { email: "mara@", description: "moth!!" });
  await page.getByRole("button", { name: "Request a consultation" }).click();

  await expect(page.getByTestId("error-email")).toBeVisible();
  await expect(page.getByTestId("error-description")).toBeVisible();
  await expect(page.getByTestId("confirmation")).toHaveCount(0);

  await page.getByLabel("Email").fill("mara@example.com");
  await page.getByLabel("Your tattoo idea").fill(IDEA);
  await page.getByRole("button", { name: "Request a consultation" }).click();

  const confirmation = page.getByTestId("confirmation");
  await expect(confirmation).toBeVisible();
  await expect(page.getByTestId("reference-id")).toHaveText(/^INK-[0-9A-F]{4}$/);
});

test("AC3: with a key set, the brief reflects the typed description and names a seeded artist", async ({
  page,
}) => {
  await useMockKey(page);
  await page.goto("/book");

  await fillBooking(page);
  await page.getByRole("button", { name: "Request a consultation" }).click();

  const brief = page.getByTestId("brief");
  await expect(brief).toBeVisible();
  await expect(page.getByTestId("brief-source")).toHaveText("AI brief");

  await expect(brief.getByTestId("brief-summary")).toContainText("moth");
  await expect(brief.getByTestId("brief-artist")).toHaveText(
    /Ari Nakamura|Dex Moreau|Rosa Vance/,
  );
  await expect(brief.getByTestId("brief-sessions")).toContainText(/session/i);
  await expect(brief.getByTestId("prep-note")).toHaveCount(3);
});

test("AC4: with no key, submission still confirms with a brief marked 'sample brief'", async ({
  page,
}) => {
  await page.goto("/book");

  await fillBooking(page);
  await page.getByRole("button", { name: "Request a consultation" }).click();

  await expect(page.getByTestId("confirmation")).toBeVisible();
  await expect(page.getByTestId("brief-source")).toHaveText("sample brief");
  await expect(page.getByTestId("brief-artist")).toHaveText(
    /Ari Nakamura|Dex Moreau|Rosa Vance/,
  );
  await expect(page.getByTestId("prep-note")).toHaveCount(3);
  await expect(page.getByTestId("byok-hint")).toContainText(
    "Choose a provider and paste your API key in Settings to enable live AI.",
  );
});

test("AC5: /studio/requests lists the new submission above the two seeded examples, each expandable", async ({
  page,
}) => {
  await useMockKey(page);
  await page.goto("/book");

  await fillBooking(page);
  await page.getByRole("button", { name: "Request a consultation" }).click();
  await expect(page.getByTestId("confirmation")).toBeVisible();
  const ref = (await page.getByTestId("reference-id").textContent())!.trim();

  await page.goto("/studio/requests");

  // Sibling tests submit into the same in-memory store, so assert the ordering
  // the criterion describes: this submission on top, the two seeds at the bottom.
  const rows = page.getByTestId("request-row");
  const count = await rows.count();
  expect(count).toBeGreaterThanOrEqual(3);
  await expect(rows.first()).toContainText(ref);
  await expect(rows.nth(count - 2)).toContainText("INK-7B31");
  await expect(rows.nth(count - 1)).toContainText("INK-2C08");

  await rows.first().getByRole("button").first().click();
  await expect(page.getByTestId("row-brief").first()).toBeVisible();
  await expect(page.getByTestId("row-brief").first()).toContainText("moth");
});

test("AC6: the FAQ renders seeded items as an accordion with one open by default", async ({
  page,
}) => {
  await page.goto("/faq");

  const items = page.getByTestId("faq-item");
  await expect(items).toHaveCount(8);

  const answers = page.getByTestId("faq-answer");
  await expect(answers).toHaveCount(1);
  await expect(answers.first()).toContainText(/deposit/i);

  await items.nth(1).getByRole("button").click();
  await expect(page.getByTestId("faq-answer")).toHaveCount(1);
  await expect(page.getByTestId("faq-answer")).not.toContainText(/deposit/i);
});

test("BYOK: settings persists provider, key and model to localStorage and clears them", async ({
  page,
}) => {
  await page.goto("/settings");

  await page.getByLabel("Provider").click();
  await page.getByRole("option", { name: "OpenAI" }).click();
  await expect(page.getByLabel("OpenAI API key")).toBeVisible();

  await page.getByLabel("OpenAI API key").fill("sk-test-123");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByTestId("byok-status")).toContainText("Saved");
  const stored = await page.evaluate(() => window.localStorage.getItem("byok"));
  expect(JSON.parse(stored!)).toMatchObject({
    provider: "openai",
    apiKey: "sk-test-123",
    model: "gpt-4o-mini",
  });

  await page.getByRole("button", { name: "Clear" }).click();
  const cleared = await page.evaluate(() => window.localStorage.getItem("byok"));
  expect(cleared).toBeNull();
});
