import { artistById } from "@/lib/seed/artists";
import type { ConsultationBrief } from "@/lib/schema";
import { cn } from "@/lib/utils";

export function BriefCard({
  brief,
  pending = false,
  className,
}: {
  brief: ConsultationBrief;
  pending?: boolean;
  className?: string;
}) {
  const artist = artistById(brief.suggestedArtistId);

  return (
    <div
      data-testid="brief"
      className={cn(
        "rounded-lg border border-ink-line bg-ink-bg p-5 transition-opacity",
        pending && "opacity-60",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-accent">
          Consultation brief
        </h3>
        <span
          data-testid="brief-source"
          className="rounded-full border border-ink-line px-2.5 py-0.5 text-[11px] text-ink-muted"
        >
          {pending ? "generating…" : brief.source === "ai" ? "AI brief" : "sample brief"}
        </span>
      </div>

      <p data-testid="brief-summary" className="text-sm leading-relaxed">
        {brief.summary}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-ink-line pt-4 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-muted">
            Suggested artist
          </dt>
          <dd data-testid="brief-artist" className="mt-1 font-medium">
            {artist?.name ?? brief.suggestedArtistId}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-muted">Estimate</dt>
          <dd data-testid="brief-sessions" className="mt-1 font-medium">
            {brief.estimatedSessions} {brief.estimatedSessions === 1 ? "session" : "sessions"}
          </dd>
        </div>
      </dl>

      <div className="mt-4 border-t border-ink-line pt-4">
        <p className="text-xs uppercase tracking-wide text-ink-muted">Prep notes</p>
        <ul className="mt-2 space-y-2">
          {brief.prepNotes.map((note, i) => (
            <li
              key={i}
              data-testid="prep-note"
              className="flex gap-2 text-sm leading-relaxed text-ink-muted"
            >
              <span className="text-ink-accent">·</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
