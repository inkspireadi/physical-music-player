# Contributing

Thanks for helping improve Physical Music Player.

## Development setup

1. Fork the repository and create a focused branch.
2. Install Node.js 20 or newer and run `npm install`.
3. Start the web app with `npm run dev`.
4. For the macOS wrapper, install Xcode 16 or newer and run `swift build` inside `macos/PhysicalMusicPlayer`.

Before opening a pull request, run:

```bash
npm run typecheck
npm run lint
npm run build
cd macos/PhysicalMusicPlayer && swift build
```

Keep pull requests small, explain visible behavior changes, and include screenshots or a short recording for interface changes. Only add media that can legally be redistributed or embedded. Never commit API keys, cookies, downloaded music, or private credentials.

By contributing, you agree that your contribution is licensed under the repository's MIT License.
