export const STYLES = ["Fine-line", "Blackwork", "Traditional", "Color"] as const;
export type Style = (typeof STYLES)[number];

export type Artwork = {
  id: string;
  title: string;
  artistId: string;
  style: Style;
  placement: string;
  sessionHours: number;
  imageUrl: string;
};

export const artwork: Artwork[] = [
  {
    id: "ink-01",
    title: "Moth and Moon Phases",
    artistId: "ari-nakamura",
    style: "Fine-line",
    placement: "Inner forearm",
    sessionHours: 3,
    imageUrl: "/art/ink-01.svg",
  },
  {
    id: "ink-02",
    title: "Wild Fennel Study",
    artistId: "ari-nakamura",
    style: "Fine-line",
    placement: "Ribs",
    sessionHours: 4,
    imageUrl: "/art/ink-02.svg",
  },
  {
    id: "ink-03",
    title: "Compass Rose, Single Needle",
    artistId: "ari-nakamura",
    style: "Fine-line",
    placement: "Shoulder blade",
    sessionHours: 2,
    imageUrl: "/art/ink-03.svg",
  },
  {
    id: "ink-04",
    title: "Ornamental Chest Panel",
    artistId: "dex-moreau",
    style: "Blackwork",
    placement: "Chest",
    sessionHours: 6,
    imageUrl: "/art/ink-04.svg",
  },
  {
    id: "ink-05",
    title: "Solid Black Sleeve Wrap",
    artistId: "dex-moreau",
    style: "Blackwork",
    placement: "Full sleeve",
    sessionHours: 8,
    imageUrl: "/art/ink-05.svg",
  },
  {
    id: "ink-06",
    title: "Geometric Cover-Up",
    artistId: "dex-moreau",
    style: "Blackwork",
    placement: "Outer thigh",
    sessionHours: 5,
    imageUrl: "/art/ink-06.svg",
  },
  {
    id: "ink-07",
    title: "Dagger Through Rose",
    artistId: "rosa-vance",
    style: "Traditional",
    placement: "Calf",
    sessionHours: 3,
    imageUrl: "/art/ink-07.svg",
  },
  {
    id: "ink-08",
    title: "Swallow Pair",
    artistId: "rosa-vance",
    style: "Traditional",
    placement: "Collarbone",
    sessionHours: 2,
    imageUrl: "/art/ink-08.svg",
  },
  {
    id: "ink-09",
    title: "Anchor and Rope Flash",
    artistId: "rosa-vance",
    style: "Traditional",
    placement: "Upper arm",
    sessionHours: 3,
    imageUrl: "/art/ink-09.svg",
  },
  {
    id: "ink-10",
    title: "Koi in Full Colour",
    artistId: "rosa-vance",
    style: "Color",
    placement: "Forearm",
    sessionHours: 5,
    imageUrl: "/art/ink-10.svg",
  },
  {
    id: "ink-11",
    title: "Poppy Field Wrap",
    artistId: "ari-nakamura",
    style: "Color",
    placement: "Ankle",
    sessionHours: 4,
    imageUrl: "/art/ink-11.svg",
  },
  {
    id: "ink-12",
    title: "Stained Glass Beetle",
    artistId: "rosa-vance",
    style: "Color",
    placement: "Back of hand",
    sessionHours: 2,
    imageUrl: "/art/ink-12.svg",
  },
];

export const artworkById = (id: string) => artwork.find((a) => a.id === id);
