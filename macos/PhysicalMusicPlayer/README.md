# macOS desktop widget app

This native SwiftUI wrapper presents the web player in a frameless, always-on-top `WKWebView`. It behaves like a movable desktop widget, joins every Space, has no Dock icon, and remains recoverable from its menu-bar music-note item.

## Run from source

Start the web player first:

```bash
cd ../../
npm install
npm run dev
```

Then, in another terminal:

```bash
swift run
```

## Build an app bundle

```bash
chmod +x build-app.sh
./build-app.sh
open "dist/Physical Music Player.app"
```

The generated app is ad-hoc signed for local use. A public release should use your Apple Developer ID, hardened runtime, notarization, and a unique bundle identifier.
The script also creates `dist/Physical-Music-Player-macOS.zip`; use that clean archive for GitHub release uploads.

The release defaults to `https://inkspireadi.github.io/physical-music-player/`, so it works without a local development server. Set `PHYSICAL_PLAYER_URL=https://your-deployment.example` before launching from a terminal, or change the saved URL in the app's Settings window. Use **Use Localhost** only while developing the web app locally.

## Why this is a desktop app, not WidgetKit

WidgetKit renders timeline snapshots in a separate extension process and supports a limited SwiftUI view/interaction set. It cannot host this live YouTube `WKWebView`. The frameless wrapper preserves the real player, custom controls, video, and audio while providing the desktop-widget experience.
