export type Artist = {
  id: string;
  name: string;
  styles: string[];
  bio: string;
  avatarUrl: string;
};

export const artists: Artist[] = [
  {
    id: "ari-nakamura",
    name: "Ari Nakamura",
    styles: ["Fine-line", "Color"],
    bio: "Single-needle work and botanical detail. Ari books long, quiet sessions and plans every stem before the machine comes on.",
    avatarUrl: "/art/artist-ari.svg",
  },
  {
    id: "dex-moreau",
    name: "Dex Moreau",
    styles: ["Blackwork", "Fine-line"],
    bio: "Heavy blackwork, ornamental panels and cover-ups. Dex draws directly on skin and prefers ideas that leave room for scale.",
    avatarUrl: "/art/artist-dex.svg",
  },
  {
    id: "rosa-vance",
    name: "Rosa Vance",
    styles: ["Traditional", "Color"],
    bio: "American traditional with a saturated palette. Rosa keeps a flash book on the counter and welcomes walk-in touch-ups.",
    avatarUrl: "/art/artist-rosa.svg",
  },
];

export const artistById = (id: string) => artists.find((a) => a.id === id);
