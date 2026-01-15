#!/usr/bin/env node

/**
 * Cortex TMS - Atomic Release Engine
 *
 * Single-command release workflow with automatic rollback on failure.
 * Implements the "Atomicity" principle: releases either succeed completely or fail safely.
 *
 * Usage:
 *   node scripts/release.js patch      # Bump patch version (2.5.0 -> 2.5.1)
 *   node scripts/release.js minor      # Bump minor version (2.5.0 -> 2.6.0)
 *   node scripts/release.js major      # Bump major version (2.5.0 -> 3.0.0)
 *   node scripts/release.js --dry-run  # Preview without making changes
 *
 * Lifecycle:
 *   1. Pre-flight: Validate credentials and workspace
 *   2. Backup: Snapshot current state
 *   3. Sync: Update version across all files
 *   4. Git: Create release branch, commit, tag, push
 *   5. Publish: NPM package and GitHub release
 *   6. Cleanup: Merge to main and cleanup
 *
 * Rollback: On any failure, automatically restores from backup
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// ANSI color helpers
const log = {
  info: (msg) => console.log(chalk.blue(msg)),
  success: (msg) => console.log(chalk.green(msg)),
  warn: (msg) => console.log(chalk.yellow(msg)),
  error: (msg) => console.log(chalk.red(msg)),
  step: (msg) => console.log(chalk.cyan(`\n${msg}`)),
  detail: (msg) => console.log(chalk.gray(`  ${msg}`)),
};

/**
 * Atomic Release Engine
 */
class AtomicRelease {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.bumpType = options.bumpType || 'patch';
    this.projectRoot = ROOT_DIR;
    this.backupPath = null;
    this.originalBranch = null;
    this.releaseBranch = null;
    this.newVersion = null;
    this.packageJsonPath = path.join(this.projectRoot, 'package.json');
  }

  /**
   * Main execution flow
   */
  async execute() {
    const startTime = Date.now();

    try {
      log.step('🚀 Cortex TMS - Atomic Release Engine\n');

      if (this.dryRun) {
        log.warn('DRY RUN MODE - No changes will be made\n');
      }

      // Phase 1: Pre-flight checks
      await this.preflight();

      // Phase 2: Create backup
      await this.createBackup();

      // Phase 3: Version bump and sync
      await this.bumpVersion();
      await this.syncVersions();

      // Phase 4: Git operations
      await this.gitTransaction();

      // Phase 5: Publish
      await this.publishNpm();
      await this.publishGitHub();

      // Phase 6: Cleanup
      await this.cleanup();

      // Success summary
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      log.step('✅ Release Complete!\n');
      log.success(`Version ${this.newVersion} released successfully in ${duration}s`);
      log.detail(`NPM: https://www.npmjs.com/package/cortex-tms`);
      log.detail(`GitHub: https://github.com/jantonca/cortex-tms/releases/tag/v${this.newVersion}`);

    } catch (error) {
      log.step('❌ Release Failed\n');
      log.error(error.message);

      // Attempt rollback
      await this.rollback();

      process.exit(1);
    }
  }

  /**
   * Phase 1: Pre-flight validation
   */
  async preflight() {
    log.step('📋 Phase 1: Pre-flight Checks');

    // Check current branch
    this.originalBranch = this.exec('git branch --show-current', { silent: true }).trim();
    log.detail(`Current branch: ${this.originalBranch}`);

    if (this.originalBranch !== 'main') {
      throw new Error('Must be on main branch to create a release');
    }

    // Check workspace is clean
    const status = this.exec('git status --porcelain', { silent: true });
    if (status.trim() !== '') {
      throw new Error('Working directory must be clean (no uncommitted changes)');
    }
    log.detail('✓ Workspace is clean');

    // Check npm credentials
    try {
      this.exec('npm whoami', { silent: true });
      log.detail('✓ NPM credentials valid');
    } catch (error) {
      throw new Error('NPM authentication required. Run: npm login');
    }

    // Check gh CLI
    try {
      this.exec('gh auth status', { silent: true });
      log.detail('✓ GitHub CLI authenticated');
    } catch (error) {
      throw new Error('GitHub CLI authentication required. Run: gh auth login');
    }

    // Pull latest
    if (!this.dryRun) {
      this.exec('git pull origin main');
      log.detail('✓ Pulled latest from origin/main');
    }

    log.success('✓ All pre-flight checks passed');
  }

  /**
   * Phase 2: Create backup snapshot
   */
  async createBackup() {
    log.step('💾 Phase 2: Creating Backup');

    if (this.dryRun) {
      log.warn('Skipping backup in dry-run mode');
      return;
    }

    // Files to backup (critical files that will be modified)
    const filesToBackup = [
      this.packageJsonPath,
      path.join(this.projectRoot, 'package-lock.json'),
      path.join(this.projectRoot, 'pnpm-lock.yaml'),
      path.join(this.projectRoot, 'README.md'),
      path.join(this.projectRoot, 'CHANGELOG.md'),
      path.join(this.projectRoot, 'NEXT-TASKS.md'),
    ].filter(f => fs.existsSync(f));

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    this.backupPath = path.join(this.projectRoot, '.cortex', 'backups', `release-${timestamp}`);

    // Create backup directory
    fs.mkdirSync(this.backupPath, { recursive: true });

    // Copy files
    for (const file of filesToBackup) {
      const relativePath = path.relative(this.projectRoot, file);
      const destPath = path.join(this.backupPath, relativePath);
      const destDir = path.dirname(destPath);

      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(file, destPath);
    }

    // Write manifest
    const manifest = {
      timestamp,
      reason: 'Atomic release',
      files: filesToBackup.map(f => path.relative(this.projectRoot, f)),
      originalBranch: this.originalBranch,
    };

    fs.writeFileSync(
      path.join(this.backupPath, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    log.success(`✓ Backup created: ${path.relative(this.projectRoot, this.backupPath)}`);
  }

  /**
   * Phase 3a: Bump version in package.json
   */
  async bumpVersion() {
    log.step('🔢 Phase 3a: Bumping Version');

    const pkg = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf-8'));
    const currentVersion = pkg.version;

    // Calculate new version
    const [major, minor, patch] = currentVersion.split('.').map(Number);

    switch (this.bumpType) {
      case 'major':
        this.newVersion = `${major + 1}.0.0`;
        break;
      case 'minor':
        this.newVersion = `${major}.${minor + 1}.0`;
        break;
      case 'patch':
        this.newVersion = `${major}.${minor}.${patch + 1}`;
        break;
      default:
        throw new Error(`Invalid bump type: ${this.bumpType}`);
    }

    log.detail(`${currentVersion} → ${this.newVersion} (${this.bumpType})`);

    if (!this.dryRun) {
      pkg.version = this.newVersion;
      fs.writeFileSync(this.packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
      log.success('✓ package.json updated');
    } else {
      log.warn('Skipping file write in dry-run mode');
    }
  }

  /**
   * Phase 3b: Sync versions across all files
   */
  async syncVersions() {
    log.step('🔄 Phase 3b: Synchronizing Versions');

    if (!this.dryRun) {
      this.exec('node scripts/sync-project.js');
      log.success('✓ All files synchronized');
    } else {
      this.exec('node scripts/sync-project.js --dry-run');
      log.warn('Sync preview shown (dry-run mode)');
    }
  }

  /**
   * Phase 4: Atomic Git transaction
   */
  async gitTransaction() {
    log.step('🔀 Phase 4: Git Transaction');

    this.releaseBranch = `release/v${this.newVersion}`;
    log.detail(`Creating branch: ${this.releaseBranch}`);

    if (!this.dryRun) {
      // Create and checkout release branch
      this.exec(`git checkout -b ${this.releaseBranch}`);

      // Stage all changes
      this.exec('git add -A');

      // Commit
      const commitMessage = `chore(release): v${this.newVersion}

Release v${this.newVersion} via Atomic Release Engine

Changes:
- Bump version to ${this.newVersion}
- Sync version across all documentation
- Update CHANGELOG.md

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`;

      fs.writeFileSync('/tmp/cortex-release-commit-msg.txt', commitMessage);
      this.exec('git commit -F /tmp/cortex-release-commit-msg.txt');
      fs.unlinkSync('/tmp/cortex-release-commit-msg.txt');

      // Create tag
      this.exec(`git tag -a v${this.newVersion} -m "Release v${this.newVersion}"`);
      log.detail(`✓ Created tag: v${this.newVersion}`);

      // Push branch and tags
      this.exec(`git push origin ${this.releaseBranch}`);
      this.exec('git push origin --tags');
      log.success('✓ Pushed to remote');

    } else {
      log.warn('Skipping Git operations in dry-run mode');
    }
  }

  /**
   * Phase 5a: Publish to NPM
   */
  async publishNpm() {
    log.step('📦 Phase 5a: Publishing to NPM');

    if (!this.dryRun) {
      this.exec('npm publish');
      log.success(`✓ Published to NPM: cortex-tms@${this.newVersion}`);
    } else {
      log.warn('Skipping NPM publish in dry-run mode');
      log.detail('Would run: npm publish');
    }
  }

  /**
   * Phase 5b: Create GitHub release
   */
  async publishGitHub() {
    log.step('🐙 Phase 5b: Creating GitHub Release');

    if (!this.dryRun) {
      const releaseNotes = `Release v${this.newVersion}

See CHANGELOG.md for full details.`;

      fs.writeFileSync('/tmp/cortex-release-notes.txt', releaseNotes);

      this.exec(
        `gh release create v${this.newVersion} --title "v${this.newVersion}" --notes-file /tmp/cortex-release-notes.txt`
      );

      fs.unlinkSync('/tmp/cortex-release-notes.txt');

      log.success(`✓ GitHub release created: v${this.newVersion}`);
    } else {
      log.warn('Skipping GitHub release in dry-run mode');
      log.detail(`Would create: v${this.newVersion}`);
    }
  }

  /**
   * Phase 6: Cleanup and merge
   */
  async cleanup() {
    log.step('🧹 Phase 6: Cleanup');

    if (!this.dryRun) {
      // Switch back to main
      this.exec('git checkout main');

      // Merge release branch
      this.exec(`git merge ${this.releaseBranch} --no-ff`);

      // Delete release branch
      this.exec(`git branch -d ${this.releaseBranch}`);
      this.exec(`git push origin --delete ${this.releaseBranch}`);

      log.success('✓ Merged to main and cleaned up release branch');
    } else {
      log.warn('Skipping cleanup in dry-run mode');
    }
  }

  /**
   * Rollback on failure
   */
  async rollback() {
    log.step('🔄 Rolling Back...');

    if (this.dryRun) {
      log.warn('Rollback not needed in dry-run mode');
      return;
    }

    try {
      // Restore files from backup
      if (this.backupPath && fs.existsSync(this.backupPath)) {
        const manifest = JSON.parse(
          fs.readFileSync(path.join(this.backupPath, 'manifest.json'), 'utf-8')
        );

        for (const relativePath of manifest.files) {
          const sourcePath = path.join(this.backupPath, relativePath);
          const destPath = path.join(this.projectRoot, relativePath);

          if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, destPath);
          }
        }

        log.detail('✓ Restored files from backup');
      }

      // Reset Git state
      this.exec('git reset --hard HEAD', { silent: true, ignoreError: true });

      // Return to original branch
      if (this.originalBranch) {
        this.exec(`git checkout ${this.originalBranch}`, { silent: true, ignoreError: true });
      }

      // Delete release branch if it exists
      if (this.releaseBranch) {
        this.exec(`git branch -D ${this.releaseBranch}`, { silent: true, ignoreError: true });
      }

      // Delete remote tag if it was created
      if (this.newVersion) {
        this.exec(`git tag -d v${this.newVersion}`, { silent: true, ignoreError: true });
        this.exec(`git push origin :refs/tags/v${this.newVersion}`, { silent: true, ignoreError: true });
      }

      log.success('✓ Rollback complete - workspace restored to pre-release state');

    } catch (error) {
      log.error('⚠️  Rollback failed - manual intervention required');
      log.detail(error.message);
    }
  }

  /**
   * Execute shell command
   */
  exec(command, options = {}) {
    const { silent = false, ignoreError = false } = options;

    try {
      const output = execSync(command, {
        cwd: this.projectRoot,
        encoding: 'utf-8',
        stdio: silent ? 'pipe' : 'inherit',
      });

      return output || '';
    } catch (error) {
      if (ignoreError) {
        return '';
      }
      throw error;
    }
  }
}

/**
 * CLI Entry Point
 */
async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const isDryRun = args.includes('--dry-run');
  const bumpType = args.find(arg => ['major', 'minor', 'patch'].includes(arg)) || 'patch';

  // Show help
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Cortex TMS - Atomic Release Engine

Usage:
  node scripts/release.js [bump-type] [options]

Bump Types:
  patch     Bump patch version (default) - 2.5.0 → 2.5.1
  minor     Bump minor version - 2.5.0 → 2.6.0
  major     Bump major version - 2.5.0 → 3.0.0

Options:
  --dry-run    Preview the release without making changes
  --help, -h   Show this help message

Examples:
  node scripts/release.js patch            # Release v2.5.1
  node scripts/release.js minor --dry-run  # Preview v2.6.0 release
  node scripts/release.js major            # Release v3.0.0

Pre-requisites:
  - Must be on main branch
  - Workspace must be clean (no uncommitted changes)
  - NPM must be authenticated (npm login)
  - GitHub CLI must be authenticated (gh auth login)
`);
    process.exit(0);
  }

  // Execute release
  const release = new AtomicRelease({ dryRun: isDryRun, bumpType });
  await release.execute();
}

main();
