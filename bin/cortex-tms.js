#!/usr/bin/env node

/**
 * Cortex TMS CLI - Executable Wrapper
 *
 * This is a minimal shebang wrapper that delegates to the TypeScript source.
 *
 * In development: Uses tsx to execute TypeScript directly
 * In production: Will execute compiled JavaScript from dist/
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Check if we're running from source (dev) or compiled (prod)
const isSource = process.env.NODE_ENV !== 'production';

if (isSource) {
  // Development: Use tsx to run TypeScript directly
  const { register } = await import('tsx/esm/api');
  const unregister = register();

  await import(join(__dirname, '../src/cli.js'));

  unregister();
} else {
  // Production: Run compiled JavaScript
  await import(join(__dirname, '../dist/cli.js'));
}
