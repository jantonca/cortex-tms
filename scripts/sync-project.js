#!/usr/bin/env node

/**
 * Cortex TMS - Project Synchronization Script
 *
 * Purpose: Enforces package.json as Single Source of Truth for version strings
 * Usage:
 *   node scripts/sync-project.js          # Update all files
 *   node scripts/sync-project.js --check  # Validate only (exit 1 if drift detected)
 *   node scripts/sync-project.js --dry-run # Preview changes without writing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ROOT_DIR = path.join(__dirname, '..');
const PACKAGE_JSON_PATH = path.join(ROOT_DIR, 'package.json');

// Target files with version patterns
const TARGET_FILES = [
  {
    name: 'README.md',
    path: path.join(ROOT_DIR, 'README.md'),
    patterns: [
      {
        regex: /(\*\*The Universal AI-Optimized Project Boilerplate \()v\d+\.\d+\.\d+(\)\*\*)/,
        replacement: (version) => `$1v${version}$2`,
        description: 'Main version header'
      },
      {
        regex: /(\*\*Version\*\*: )\d+\.\d+\.\d+/,
        replacement: (version) => `$1${version}`,
        description: 'Status section version'
      },
      {
        regex: /(<!-- @cortex-tms-version )\d+\.\d+\.\d+( -->)/,
        replacement: (version) => `$1${version}$2`,
        description: 'Version metadata tag'
      }
    ]
  },
  {
    name: 'templates/README.md',
    path: path.join(ROOT_DIR, 'templates/README.md'),
    patterns: [
      {
        regex: /(\*\*Cortex TMS v)\d+\.\d+\.\d+(\*\*)/,
        replacement: (version) => `$1${version}$2`,
        description: 'Template version header'
      }
    ]
  },
  {
    name: 'docs/guides/CLI-USAGE.md',
    path: path.join(ROOT_DIR, 'docs/guides/CLI-USAGE.md'),
    patterns: [
      {
        regex: /(\*\*Version\*\*: )\d+\.\d+\.\d+/,
        replacement: (version) => `$1${version}`,
        description: 'CLI guide version'
      }
    ]
  }
];

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getPackageVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
    return packageJson.version;
  } catch (error) {
    log(`❌ Error reading package.json: ${error.message}`, 'red');
    process.exit(1);
  }
}

function checkChangelogEntry(version) {
  const changelogPath = path.join(ROOT_DIR, 'CHANGELOG.md');

  if (!fs.existsSync(changelogPath)) {
    log('⚠️  CHANGELOG.md not found', 'yellow');
    return false;
  }

  const content = fs.readFileSync(changelogPath, 'utf-8');
  const versionHeaderRegex = new RegExp(`^## \\[${version.replace(/\./g, '\\.')}\\]`, 'm');

  return versionHeaderRegex.test(content);
}

function syncFile(fileConfig, targetVersion, mode) {
  const { name, path: filePath, patterns } = fileConfig;

  if (!fs.existsSync(filePath)) {
    log(`  ⚠️  ${name} not found (skipping)`, 'yellow');
    return { changed: false, skipped: true };
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  let changesDetected = false;
  const changes = [];

  // Apply each pattern
  for (const pattern of patterns) {
    const match = content.match(pattern.regex);

    if (match) {
      const currentVersion = match[0].match(/\d+\.\d+\.\d+/)?.[0];

      if (currentVersion !== targetVersion) {
        changesDetected = true;
        content = content.replace(pattern.regex, pattern.replacement(targetVersion));
        changes.push({
          description: pattern.description,
          from: currentVersion,
          to: targetVersion
        });
      }
    }
  }

  // Report changes
  if (changesDetected) {
    log(`  📝 ${name}`, 'cyan');
    changes.forEach(change => {
      log(`     ${change.description}: ${change.from} → ${change.to}`, 'gray');
    });

    if (mode === 'write') {
      fs.writeFileSync(filePath, content, 'utf-8');
      log(`     ✅ Updated`, 'green');
    }
  } else {
    log(`  ✓ ${name}`, 'gray');
  }

  return { changed: changesDetected, skipped: false };
}

function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const isCheck = args.includes('--check');
  const mode = isDryRun || isCheck ? 'check' : 'write';

  // Header
  log('\n🔍 Cortex TMS - Project Synchronization\n', 'cyan');

  // Get version from package.json
  const version = getPackageVersion();
  log(`📦 Source of Truth: package.json v${version}`, 'blue');

  // Check CHANGELOG
  log('\n📋 Validating CHANGELOG.md...', 'blue');
  const hasChangelogEntry = checkChangelogEntry(version);

  if (hasChangelogEntry) {
    log(`  ✓ Version ${version} found in CHANGELOG.md`, 'gray');
  } else {
    log(`  ⚠️  Version ${version} not found in CHANGELOG.md`, 'yellow');
    log(`     Add a changelog entry before syncing documentation`, 'gray');
  }

  // Sync files
  log('\n📄 Synchronizing documentation files...\n', 'blue');

  let totalChanged = 0;
  let totalSkipped = 0;

  for (const fileConfig of TARGET_FILES) {
    const result = syncFile(fileConfig, version, mode);
    if (result.changed) totalChanged++;
    if (result.skipped) totalSkipped++;
  }

  // Summary
  log('\n' + '─'.repeat(50), 'gray');

  if (mode === 'write') {
    if (totalChanged > 0) {
      log(`✅ Synchronized ${totalChanged} file(s) to v${version}`, 'green');
    } else {
      log(`✅ All files already at v${version}`, 'green');
    }
  } else {
    if (totalChanged > 0) {
      log(`❌ Drift detected: ${totalChanged} file(s) out of sync`, 'red');
      log(`   Run without --check/--dry-run to fix`, 'gray');
      process.exit(1);
    } else {
      log(`✅ All files synchronized with v${version}`, 'green');
    }
  }

  if (totalSkipped > 0) {
    log(`⚠️  ${totalSkipped} file(s) skipped (not found)`, 'yellow');
  }

  log('');
}

main();
