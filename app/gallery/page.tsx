import Link from "next/link";
import type { Metadata } from "next";
import { artwork, STYLES, type Style } from "@/lib/seed/artwork";
import { artists } from "@/lib/seed/artists";
import { GalleryClient } from "./gallery-client";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Gallery — InkPoint Studio" };

const FILTERS = ["All", ...STYLES] as const;

function isStyle(value: string | undefined): value is Style {
  return !!value && (STYLES as readonly string[]).includes(value);
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ style?: string }>;
}) {
  const { style } = await searchParams;
  // The URL is the filter's source of truth (FR3), so a filtered view is shareable.
  const active = isStyle(style) ? style : "All";
  const pieces = active === "All" ? artwork : artwork.filter((p) => p.style === active);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Gallery</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Healed work from all three residents. Open a piece for the artist,
          placement and how long it took in the chair.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label="Filter by style">
        {FILTERS.map((filter) => (
          <Link
            key={filter}
            href={filter === "All" ? "/gallery" : `/gallery?style=${encodeURIComponent(filter)}`}
            scroll={false}
            aria-current={active === filter ? "page" : undefined}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition",
              active === filter
                ? "border-ink-accent bg-ink-accent text-ink-bg font-semibold"
                : "border-ink-line text-ink-muted hover:border-ink-accent hover:text-ink-text",
            )}
          >
            {filter}
          </Link>
        ))}
      </nav>

      <p className="text-xs uppercase tracking-wide text-ink-muted">
        {pieces.length} {pieces.length === 1 ? "piece" : "pieces"}
        {active !== "All" && ` in ${active}`}
      </p>

      <GalleryClient pieces={pieces} artists={artists} />
    </div>
  );
}
