import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "InkPoint Studio",
  description:
    "Custom tattoo studio — gallery, booking with an AI consultation brief, and studio FAQ.",
};

const NAV = [
  { href: "/gallery", label: "Gallery" },
  { href: "/book", label: "Book" },
  { href: "/faq", label: "FAQ" },
  { href: "/studio/requests", label: "Studio queue" },
  { href: "/settings", label: "Settings" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="sticky top-0 z-40 border-b border-ink-line bg-ink-bg/85 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4">
            <Link href="/" className="text-sm font-bold uppercase tracking-[0.2em]">
              Ink<span className="text-ink-accent">Point</span>
            </Link>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-muted">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-ink-text">
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>

        <footer className="border-t border-ink-line px-5 py-8 text-center text-xs text-ink-muted">
          InkPoint Studio — demo slice. Seeded artwork and placeholder imagery;
          requests live in memory for this session only.
        </footer>
      </body>
    </html>
  );
}
