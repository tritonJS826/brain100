#!/usr/bin/env bash
set -e

APP_ENTRY="app/run.py"
OUTPUT_DIR="build"
APP_NAME="brain100"
# Add this at the top after `set -e`
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
PRISMA_DIR="$PROJECT_ROOT/br-general-python/prisma"


echo "Building FastAPI app with Nuitka..."

# Ensure venv is active
if [ -z "$VIRTUAL_ENV" ]; then
  echo "Please activate your virtual environment first."
  echo "   Example: source .venv/bin/activate"
  exit 1
fi

# Ensure Prisma binaries exist
if [ ! -d "$PRISMA_DIR" ]; then
  echo "Prisma directory not found at: $PRISMA_DIR"
  exit 1
fi

# Clean previous builds
rm -rf "$OUTPUT_DIR" dist __pycache__ .pytest_cache 2>/dev/null || true
mkdir -p "$OUTPUT_DIR"

# Run Prisma generate (ensures latest engine binaries)
echo "Generating Prisma client..."
python -m prisma generate || true

# Compile using Nuitka
python -m nuitka \
  --standalone \
  --onefile \
  --follow-imports \
  --include-package=app \
  --include-package=prisma \
  --include-module=prisma.types \
  --include-data-file=.env=.env \
  --include-data-dir="$PRISMA_DIR"=.prisma \
  --nofollow-import-to=app.tests \
  --noinclude-pytest-mode=nofollow \
  --noinclude-unittest-mode=nofollow \
  --noinclude-setuptools-mode=nofollow \
  --lto=yes \
  --clang \
  --assume-yes-for-downloads \
  --remove-output \
  --show-progress \
  --jobs="$(nproc)" \
  --output-dir="$OUTPUT_DIR" \
  --output-filename="$APP_NAME" \
  "$APP_ENTRY"

echo ""
echo "Build complete!"
echo "Binary: $OUTPUT_DIR/$APP_NAME"
echo ""
echo "You can now run:"
echo "./build/$APP_NAME"