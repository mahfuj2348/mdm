#!/usr/bin/env bash
# Build a store-submission ZIP of the browser extension.
#
# The archive root must contain manifest.json (Chrome Web Store and Edge
# Add-ons both reject a ZIP with a wrapping folder). Test files and the
# Firefox-only manifest variant are excluded.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXT="$ROOT/extension"
OUT="$ROOT/release-extension"

VERSION="$(python3 -c "import json;print(json.load(open('$EXT/manifest.json'))['version'])")"
ZIP="$OUT/MDM-Extension-$VERSION.zip"

mkdir -p "$OUT"
rm -f "$ZIP"

cd "$EXT"
find . -type f \
  ! -name '*.test.cjs' \
  ! -name 'manifest.firefox.json' \
  ! -name '.DS_Store' \
  | sed 's|^\./||' \
  | sort \
  | TZ=UTC zip -q -X "$ZIP" -@

echo "Store package: $ZIP"
echo "Entries:"
unzip -l "$ZIP" | tail -n +4 | head -n -2 | awk '{print "  " $4}'
