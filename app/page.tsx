import Link from "next/link";
import { artwork } from "@/lib/seed/artwork";
import { artists, artistById } from "@/lib/seed/artists";

const featured = artwork.slice(0, 6);

export default function HomePage() {
  return (
    <div className="space-y-20">
      <section className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-ink-accent">
            Custom tattoo studio · Est. 2014
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
            Ink that earns its place on your skin.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
            Three resident artists, one chair each, and no rushed appointments.
            Tell us the idea in your own words — we turn it into a brief, match
            the artist, and give you a straight answer on sessions and cost.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="btn-primary">
              Book a session
            </Link>
            <Link href="/gallery" className="btn-ghost">
              See the gallery
            </Link>
          </div>
        </div>

        <div
          className="rounded-xl border border-ink-line bg-ink-panel p-6"
          data-testid="studio-intro"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-accent">
            The studio
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            InkPoint is a three-artist shop on the north side. We take custom
            work by request, keep a flash book for walk-in touch-ups, and hold
            every date with a $100 deposit that comes off the final price.
          </p>
          <ul className="mt-5 space-y-3">
            {artists.map((artist) => (
              <li key={artist.id} className="flex items-baseline justify-between gap-4">
                <span className="text-sm font-medium">{artist.name}</span>
                <span className="text-xs text-ink-muted">
                  {artist.styles.join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section data-testid="featured-strip">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-semibold">Featured work</h2>
          <Link href="/gallery" className="text-sm text-ink-accent hover:underline">
            All 12 pieces →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((piece) => (
            <Link
              key={piece.id}
              href={`/gallery?style=${encodeURIComponent(piece.style)}`}
              className="group overflow-hidden rounded-lg border border-ink-line bg-ink-panel transition hover:border-ink-accent"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={piece.imageUrl}
                alt={piece.title}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <div className="p-3">
                <p className="truncate text-xs font-medium group-hover:text-ink-accent">
                  {piece.title}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-ink-muted">
                  {artistById(piece.artistId)?.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-ink-line bg-ink-panel p-8">
        <h2 className="text-2xl font-semibold">Booking that does the writing for you</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Describe the tattoo however it comes out. The booking form turns it
          into a structured consultation brief — a summary, a suggested artist,
          an estimated session count and three prep notes — so the studio reads
          a request instead of decoding a message.
        </p>
        <Link href="/book" className="btn-primary mt-6">
          Start a request
        </Link>
      </section>
    </div>
  );
}
