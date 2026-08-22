export type Track = {
  id: string;
  title: string;
  artist: string;
  src: string;
  artwork: string;
};

export const tracks: readonly Track[] = [
  {
    id: "after-static",
    title: "After Static",
    artist: "North Relay",
    src: "/audio/after-static.wav",
    artwork: "/artwork/figma-after-static.svg",
  },
  {
    id: "soft-signal",
    title: "Soft Signal",
    artist: "Relay System",
    src: "/audio/soft-signal.wav",
    artwork: "/artwork/soft-signal.svg",
  },
  {
    id: "night-receiver",
    title: "Night Receiver",
    artist: "Mono Field",
    src: "/audio/night-receiver.wav",
    artwork: "/artwork/night-receiver.svg",
  },
] as const;
