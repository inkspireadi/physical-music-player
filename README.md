# Physical Music Player

An open-source, hardware-inspired YouTube music player for the web and the macOS desktop. The interface recreates a compact physical player with custom playback, seeking, and volume controls while keeping YouTube's native overlay out of the visual design.

## Features

- curated ten-video playlist using official YouTube embeds;
- tactile previous, play/pause, and next controls;
- custom in-screen video scrubber and volume control;
- keyboard and speaker-grille volume control;
- responsive Figma-matched hardware styling, shadows, and texture;
- frameless, always-on-top macOS desktop widget app;
- no YouTube Data API key and no downloaded audio files.

## Run the web player

```bash
npm install
npm run dev
```

Keyboard controls: Space toggles playback; Left/Right changes tracks; Up/Down changes volume. Scroll over the speaker grille for contextual volume control.

## Run the macOS desktop widget app

Keep the web development server running, then:

```bash
cd macos/PhysicalMusicPlayer
swift run
```

To generate an ad-hoc signed `.app` bundle:

```bash
chmod +x build-app.sh
./build-app.sh
open "dist/Physical Music Player.app"
```

The wrapper defaults to `http://localhost:3000/`. Its Settings window accepts a public HTTPS deployment URL for a standalone release. See [macos/PhysicalMusicPlayer/README.md](macos/PhysicalMusicPlayer/README.md) for packaging notes.

WidgetKit widgets are timeline-rendered SwiftUI snapshots and cannot host the live YouTube web player. The included native wrapper provides the practical desktop-widget behavior—frameless, floating, movable, visible across Spaces, and recoverable from the menu bar—without losing audio or video.

## Change the selected ten videos

Edit `components/music-player/youtubeTracks.ts`. Each entry needs the 11-character video ID from an embeddable official YouTube video:

```ts
{
  id: "my-song",
  title: "My Song",
  artist: "Artist Name",
  videoId: "dQw4w9WgXcQ",
}
```

The custom physical buttons control the embedded playlist. The video itself stays visible in the player screen, so imagery changes with every song. No API key is required for this curated list. The first play must come from a click or keyboard action because browsers block unsolicited autoplay.

Use only videos that their owner allows to be embedded. If a video is removed, made private, blocked by region, or disables embedding, the player skips it automatically.

## Live radio

Radio is still possible, but it is a separate integration: use an HTTPS Icecast/Shoutcast stream plus a station-specific now-playing metadata endpoint. YouTube is the better default here because the audio, title, timing, and changing visuals stay synchronized. A truly live US chart would also need a server-side chart source or YouTube Data API integration; the current list is intentionally curated and predictable.

## Open source

Physical Music Player is available under the [MIT License](LICENSE). Contributions are welcome; read [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), and [SECURITY.md](SECURITY.md) before opening a pull request or report.
