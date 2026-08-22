#!/bin/zsh

set -euo pipefail

SCRIPT_DIR=${0:A:h}
APP_NAME="Physical Music Player.app"
OUTPUT_DIR="$SCRIPT_DIR/dist"
APP_PATH="$OUTPUT_DIR/$APP_NAME"
ZIP_PATH="$OUTPUT_DIR/Physical-Music-Player-macOS.zip"
CONTENTS_PATH="$APP_PATH/Contents"

swift build --package-path "$SCRIPT_DIR" -c release
BIN_PATH=$(swift build --package-path "$SCRIPT_DIR" -c release --show-bin-path)

mkdir -p "$CONTENTS_PATH/MacOS" "$CONTENTS_PATH/Resources"
cp "$BIN_PATH/PhysicalMusicPlayer" "$CONTENTS_PATH/MacOS/PhysicalMusicPlayer"
cp "$SCRIPT_DIR/Resources/Info.plist" "$CONTENTS_PATH/Info.plist"
xattr -cr "$APP_PATH"
codesign --force --deep --sign - "$APP_PATH"
xattr -d com.apple.FinderInfo "$APP_PATH" 2>/dev/null || true
xattr -d 'com.apple.fileprovider.fpfs#P' "$APP_PATH" 2>/dev/null || true

rm -f "$ZIP_PATH"
(
    cd "$OUTPUT_DIR"
    /usr/bin/zip -qry -X "${ZIP_PATH:t}" "$APP_NAME"
)

echo "$APP_PATH"
echo "$ZIP_PATH"
