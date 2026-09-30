// ==============================================================================
// ORBIT-I Private Limited — Hostinger Production Node.js Entrypoint
// File: server/app.js
// ==============================================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distServer = path.join(__dirname, 'dist', 'server.js');

// 1. Fallback: If dist/server.js is missing, compile TypeScript automatically
if (!fs.existsSync(distServer)) {
  console.log('[ORBIT-I] dist/server.js not found. Triggering automated TypeScript compilation...');
  try {
    execSync('npx tsc -p tsconfig.json', { cwd: __dirname, stdio: 'inherit' });
    console.log('[ORBIT-I] Automated compilation completed successfully.');
  } catch (err) {
    console.error('[ORBIT-I] Automated compilation failed:', err.message);
  }
}

// 2. Ensure dist/server.js exists before booting
if (!fs.existsSync(distServer)) {
  console.error('====================================================================');
  console.error('[ORBIT-I FATAL ERROR] dist/server.js could not be found or built.');
  console.error('Please run `npm run build` or `./build.sh` inside the server directory.');
  console.error('====================================================================');
  process.exit(1);
}

// 3. Boot the application
console.log('[ORBIT-I] Starting server from dist/server.js...');
require(distServer);

