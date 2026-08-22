import { PhysicalMusicPlayer } from "@/components/music-player/PhysicalMusicPlayer";

export default function Home() {
  return (
    <main className="grid min-h-dvh place-items-center overflow-hidden px-4 py-8">
      <PhysicalMusicPlayer />
    </main>
  );
}
