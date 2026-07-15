"use client";

import * as React from "react";
import type { Artwork } from "@/lib/seed/artwork";
import type { Artist } from "@/lib/seed/artists";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  pieces: Artwork[];
  artists: Artist[];
};

export function GalleryClient({ pieces, artists }: Props) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const active = pieces.find((p) => p.id === openId) ?? null;
  const artistOf = (id: string) => artists.find((a) => a.id === id);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {pieces.map((piece) => (
          <button
            key={piece.id}
            type="button"
            data-testid="artwork-tile"
            onClick={() => setOpenId(piece.id)}
            className="group overflow-hidden rounded-lg border border-ink-line bg-ink-panel text-left transition hover:border-ink-accent focus:outline-none focus:ring-2 focus:ring-ink-accent"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={piece.imageUrl}
              alt={piece.title}
              className="aspect-square w-full object-cover"
              loading="lazy"
            />
            <div className="space-y-1 p-3">
              <p className="truncate text-sm font-medium group-hover:text-ink-accent">
                {piece.title}
              </p>
              <p className="truncate text-xs text-ink-muted">
                {artistOf(piece.artistId)?.name}
              </p>
              <p
                data-testid="tile-style"
                className="inline-block rounded-full border border-ink-line px-2 py-0.5 text-[11px] text-ink-muted"
              >
                {piece.style}
              </p>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setOpenId(null)}>
        {active && (
          <DialogContent>
            <DialogTitle className="pr-10 text-xl font-semibold">
              {active.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Artwork detail: artist, style, placement and approximate session length.
            </DialogDescription>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.imageUrl}
              alt={active.title}
              className="mt-4 aspect-square w-full rounded-lg border border-ink-line object-cover"
            />

            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-muted">Artist</dt>
                <dd data-testid="detail-artist" className="mt-1 font-medium">
                  {artistOf(active.artistId)?.name}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-muted">Style</dt>
                <dd data-testid="detail-style" className="mt-1 font-medium">
                  {active.style}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-muted">
                  Placement
                </dt>
                <dd data-testid="detail-placement" className="mt-1 font-medium">
                  {active.placement}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-muted">
                  Approx. session
                </dt>
                <dd data-testid="detail-session" className="mt-1 font-medium">
                  {active.sessionHours} hours in the chair
                </dd>
              </div>
            </dl>

            <p className="mt-5 border-t border-ink-line pt-4 text-sm leading-relaxed text-ink-muted">
              {artistOf(active.artistId)?.bio}
            </p>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
