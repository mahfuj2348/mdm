#!/usr/bin/env bash
# Fetch the third-party media binaries that are not committed to Git.
#
# The yt-dlp binary is large, so it is downloaded on demand and pinned by
# checksum. Run this once after cloning, before `npm run dist`, if you want the
# "paste a YouTube URL" feature to work in your build.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR="$ROOT/vendor"
VERSION="2026.10.26"
URL="https://github.com/yt-dlp/yt-dlp/releases/download/${VERSION}/yt-dlp_macos"
SHA256="0f922c15ccc0b83eefa1c8bc9104e434318c4bf16e408e1ee93b7745a6efe0aa"
TARGET="$VENDOR/yt-dlp_macos"

mkdir -p "$VENDOR"

if [ -x "$TARGET" ] && [ "$(shasum -a 256 "$TARGET" | awk '{print $1}')" = "$SHA256" ]; then
  echo "yt-dlp ${VERSION} already present and verified."
  exit 0
fi

echo "Downloading yt-dlp ${VERSION}..."
curl -fsSL --retry 3 -o "$TARGET.part" "$URL"

ACTUAL="$(shasum -a 256 "$TARGET.part" | awk '{print $1}')"
if [ "$ACTUAL" != "$SHA256" ]; then
  rm -f "$TARGET.part"
  echo "Checksum mismatch: expected ${SHA256}, got ${ACTUAL}" >&2
  exit 1
fi

mv "$TARGET.part" "$TARGET"
chmod +x "$TARGET"
echo "Verified and installed $TARGET"
