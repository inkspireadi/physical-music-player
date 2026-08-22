export type YouTubeTrack = {
  id: string;
  title: string;
  artist: string;
  videoId: string;
};

// A deliberately small, hand-picked set of official music videos. Keeping the
// list local makes the player fast and predictable without requiring a YouTube
// Data API key. Reorder or replace entries here to refresh the mix.
export const youtubeTracks: readonly YouTubeTrack[] = [
  {
    id: "choosin-texas",
    title: "Choosin' Texas",
    artist: "Ella Langley",
    videoId: "nUsrYVxrDwI",
  },
  {
    id: "gameboy",
    title: "Gameboy",
    artist: "KATSEYE",
    videoId: "-bC4iak3kxg",
  },
  {
    id: "sunflower",
    title: "Sunflower",
    artist: "Post Malone & Swae Lee",
    videoId: "ApXoWvfEYVU",
  },
  {
    id: "billie-jean",
    title: "Billie Jean",
    artist: "Michael Jackson",
    videoId: "Zi_XLOBDo_Y",
  },
  {
    id: "poker-face",
    title: "Poker Face",
    artist: "Lady Gaga",
    videoId: "bESGLojNYSo",
  },
  {
    id: "bring-me-to-life",
    title: "Bring Me To Life",
    artist: "Evanescence",
    videoId: "3YxaaGgTQYM",
  },
  {
    id: "africa",
    title: "Africa",
    artist: "Toto",
    videoId: "FTQbiNvZqaY",
  },
  {
    id: "i-will-always-love-you",
    title: "I Will Always Love You",
    artist: "Whitney Houston",
    videoId: "3JWTaaS7LdU",
  },
  {
    id: "baby",
    title: "Baby",
    artist: "Justin Bieber ft. Ludacris",
    videoId: "kffacxfA7G4",
  },
  {
    id: "beat-it",
    title: "Beat It",
    artist: "Michael Jackson",
    videoId: "oRdxUFDoQe0",
  },
] as const;
