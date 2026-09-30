#!/bin/bash
# ==============================================================================
# ORBIT-I Private Limited — Server Build Script (Hostinger/cPanel)
# ==============================================================================
set -e

echo "========================================================"
echo "  [ORBIT-I] Starting Server Build..."
echo "========================================================"

echo "--> Node version: $(node -v 2>/dev/null || echo 'not found')"
echo "--> NPM version:  $(npm -v 2>/dev/null || echo 'not found')"
echo "--> Current dir:  $(pwd)"

# Install dependencies (production=false ensures typescript compiler is installed)
echo "--> Installing server dependencies..."
npm install --include=dev --no-audit --prefer-offline || npm install --no-audit

# Compile TypeScript
echo "--> Compiling TypeScript..."
npm run build

# Generate dist/server.ts compatibility stub if needed
if [ ! -f "dist/server.ts" ]; then
  echo "require('./server.js');" > dist/server.ts
fi

# Verification
if [ -f "dist/server.js" ]; then
  echo "========================================================"
  echo "  [ORBIT-I] SERVER BUILD SUCCESSFUL!"
  echo "  Entry file: dist/server.js (and app.js) is ready."
  echo "========================================================"
  exit 0
else
  echo "========================================================"
  echo "  [ORBIT-I ERROR] dist/server.js was not generated!"
  echo "========================================================"
  exit 1
fi
