import { artworkById } from "@/lib/seed/artwork";
import { artists } from "@/lib/seed/artists";

/**
 * Stand-in imagery so the demo ships without licensing photography. The client's
 * real photos replace this by pointing `imageUrl` at their CDN — nothing else changes.
 */
function hue(seed: string): number {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

function escapeXml(value: string): string {
  return value.replace(
    /[<>&'"]/g,
    (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!,
  );
}

function svg(id: string, label: string, sub: string): string {
  const h = hue(id);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600" role="img" aria-label="${escapeXml(label)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${h} 30% 16%)"/>
      <stop offset="1" stop-color="hsl(${(h + 40) % 360} 26% 6%)"/>
    </linearGradient>
    <pattern id="p" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(${h % 90})">
      <line x1="0" y1="0" x2="0" y2="26" stroke="hsl(${h} 40% 60%)" stroke-opacity="0.14" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="600" height="600" fill="url(#g)"/>
  <rect width="600" height="600" fill="url(#p)"/>
  <circle cx="300" cy="268" r="118" fill="none" stroke="hsl(${h} 45% 70%)" stroke-opacity="0.35" stroke-width="1.5"/>
  <circle cx="300" cy="268" r="86" fill="none" stroke="hsl(${h} 45% 70%)" stroke-opacity="0.22" stroke-width="1"/>
  <text x="300" y="452" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="26" fill="#ececf1">${escapeXml(label)}</text>
  <text x="300" y="484" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="16" fill="#9a9aa8">${escapeXml(sub)}</text>
</svg>`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const key = id.replace(/\.svg$/, "");

  const piece = artworkById(key);
  const artist = artists.find((a) => a.avatarUrl.endsWith(`/${key}.svg`));

  let body: string;
  if (piece) body = svg(key, piece.title, piece.style);
  else if (artist) body = svg(key, artist.name, artist.styles.join(" · "));
  else body = svg(key, "InkPoint", "placeholder");

  return new Response(body, {
    headers: {
      "content-type": "image/svg+xml",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
