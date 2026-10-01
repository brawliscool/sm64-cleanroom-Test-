#!/bin/sh
# Package the touch-ready site for Vercel. The compiled runtime is fetched from
# the project's published build because this source repo does not track WASM.
set -eu

OUT="${VERCEL_OUTPUT_DIR:-public}"
ASSET_BASE="${SM64_ASSET_BASE_URL:-https://andrewnakas.github.io/sm64-cleanroom}"
mkdir -p "$OUT"
cp games/sm64/web/shell.html "$OUT/index.html"
cp games/sm64/web/manifest.webmanifest games/sm64/web/service-worker.js "$OUT/"
curl --fail --location --retry 3 --connect-timeout 20 "$ASSET_BASE/sm64.us.js" --output "$OUT/sm64.us.js"
curl --fail --location --retry 3 --connect-timeout 20 "$ASSET_BASE/sm64.us.wasm" --output "$OUT/sm64.us.wasm"
test -s "$OUT/index.html"
test -s "$OUT/manifest.webmanifest"
test -s "$OUT/sm64.us.js"
test -s "$OUT/sm64.us.wasm"
printf 'Vercel static site ready in %s\n' "$OUT"
