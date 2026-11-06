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

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
cp -R "$EXT/." "$STAGE/"
cd "$STAGE"
python3 - "$ROOT/integration/extension-public-key.txt" <<'PYKEY'
from pathlib import Path
import json,sys
manifest=Path("manifest.json")
data=json.loads(manifest.read_text())
data["key"]=Path(sys.argv[1]).read_text().strip()
manifest.write_text(json.dumps(data,indent=2)+"\n")
PYKEY
find . -type f \
  ! -name '*.test.cjs' \
  ! -name 'manifest.firefox.json' \
  ! -name '.DS_Store' \
  | sed 's|^\./||' \
  | sort \
  | TZ=UTC zip -q -X "$ZIP" -@

echo "Store package: $ZIP"
unzip -tq "$ZIP"
