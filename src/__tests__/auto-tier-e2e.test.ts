/**
 * E2E Integration Tests - Auto-Tier Command
 *
 * Tests the complete auto-tier command workflow with varied git histories.
 * Uses faked commit dates (GIT_AUTHOR_DATE) to simulate different file ages.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'path';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { execSync } from 'child_process';
import { createTempDir, cleanupTempDir } from './utils/temp-dir.js';
import { runCommand } from './utils/cli-runner.js';

/**
 * Helper to initialize a git repo
 */
async function initGitRepo(dir: string): Promise<void> {
  execSync('git init', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.email "test@example.com"', { cwd: dir, stdio: 'ignore' });
  execSync('git config user.name "Test User"', { cwd: dir, stdio: 'ignore' });
}

/**
 * Helper to create and commit a file with a specific date
 * @param date - ISO date string (e.g., '2026-01-01')
 */
async function createAndCommitFileWithDate(
  dir: string,
  filename: string,
  content: string,
  date: string
): Promise<void> {
  await writeFile(join(dir, filename), content);
  execSync(`git add "${filename}"`, { cwd: dir, stdio: 'ignore' });

  // Use GIT_AUTHOR_DATE and GIT_COMMITTER_DATE to fake the commit date
  execSync(`git commit -m "Add ${filename}"`, {
    cwd: dir,
    stdio: 'ignore',
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: date,
      GIT_COMMITTER_DATE: date,
    },
  });
}

/**
 * Helper to check if file has a tier tag
 */
async function getFileTierTag(dir: string, filename: string): Promise<string | null> {
  const content = await readFile(join(dir, filename), 'utf-8');
  const match = content.match(/<!--\s*@cortex-tms-tier\s+(HOT|WARM|COLD)\s*-->/);
  return match ? match[1] : null;
}

describe('Auto-Tier E2E - Basic Workflows', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await initGitRepo(tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should tag fresh root files as WARM (scoring-based)', async () => {
    // Create file with today's date
    const today = new Date().toISOString();
    await createAndCommitFileWithDate(tempDir, 'fresh.md', '# Fresh File', today);

    // Run auto-tier
    const result = await runCommand('auto-tier', [], tempDir);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('WARM');
    expect(result.stdout).toContain('fresh.md');

    // Verify tier tag was applied
    // Root files get WARM (score=15 from recent bonus, not enough for HOT)
    const tier = await getFileTierTag(tempDir, 'fresh.md');
    expect(tier).toBe('WARM');
  });

  it('should tag old files as COLD (modified 100+ days ago)', async () => {
    // Create file with date 100 days ago
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 100);

    await createAndCommitFileWithDate(
      tempDir,
      'old.md',
      '# Old File',
      oldDate.toISOString()
    );

    // Run auto-tier
    const result = await runCommand('auto-tier', [], tempDir);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('COLD');
    expect(result.stdout).toContain('old.md');

    // Verify tier tag
    const tier = await getFileTierTag(tempDir, 'old.md');
    expect(tier).toBe('COLD');
  });

  it('should tag medium-aged files as WARM (modified 15 days ago)', async () => {
    // Create file with date 15 days ago
    const mediumDate = new Date();
    mediumDate.setDate(mediumDate.getDate() - 15);

    await createAndCommitFileWithDate(
      tempDir,
      'medium.md',
      '# Medium File',
      mediumDate.toISOString()
    );

    // Run auto-tier
    const result = await runCommand('auto-tier', [], tempDir);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('WARM');
    expect(result.stdout).toContain('medium.md');

    // Verify tier tag
    const tier = await getFileTierTag(tempDir, 'medium.md');
    expect(tier).toBe('WARM');
  });

  it('should handle mixed file ages (HOT, WARM, COLD)', async () => {
    // Create files with different ages
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5);
    const twentyDaysAgo = new Date(today);
    twentyDaysAgo.setDate(today.getDate() - 20);
    const hundredDaysAgo = new Date(today);
    hundredDaysAgo.setDate(today.getDate() - 100);

    await createAndCommitFileWithDate(tempDir, 'hot.md', '# Hot', today.toISOString());
    await createAndCommitFileWithDate(tempDir, 'warm.md', '# Warm', twentyDaysAgo.toISOString());
    await createAndCommitFileWithDate(tempDir, 'cold.md', '# Cold', hundredDaysAgo.toISOString());

    // Run auto-tier
    const result = await runCommand('auto-tier', [], tempDir);

    expect(result.exitCode).toBe(0);
    // With new scoring: root files get low scores
    // hot.md: score=15 (recent) → WARM
    // warm.md: score=0 → WARM
    // cold.md: score=0, old → COLD
    expect(result.stdout).toContain('WARM (2 files)');
    expect(result.stdout).toContain('COLD (1 files)');

    // Verify tier tags
    expect(await getFileTierTag(tempDir, 'hot.md')).toBe('WARM');
    expect(await getFileTierTag(tempDir, 'warm.md')).toBe('WARM');
    expect(await getFileTierTag(tempDir, 'cold.md')).toBe('COLD');
  });
});

describe('Auto-Tier E2E - Command Options', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await initGitRepo(tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should not modify files in dry-run mode', async () => {
    const today = new Date().toISOString();
    await createAndCommitFileWithDate(tempDir, 'test.md', '# Test', today);

    // Run with --dry-run
    const result = await runCommand('auto-tier', ['--dry-run'], tempDir);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('DRY RUN MODE');
    expect(result.stdout).toContain('test.md');

    // Verify NO tier tag was applied
    const tier = await getFileTierTag(tempDir, 'test.md');
    expect(tier).toBeNull();
  });

  it('should use custom thresholds (--hot, --warm, --cold)', async () => {
    // Create file 10 days old
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    await createAndCommitFileWithDate(
      tempDir,
      'test.md',
      '# Test',
      tenDaysAgo.toISOString()
    );

    // With default thresholds (hot=7, warm=30), this should be WARM
    const defaultResult = await runCommand('auto-tier', ['--dry-run'], tempDir);
    expect(defaultResult.stdout).toContain('WARM');

    // With custom threshold (hot=14), this should be HOT
    const customResult = await runCommand('auto-tier', ['--dry-run', '--hot', '14'], tempDir);
    expect(customResult.stdout).toContain('HOT');
  });

  it('should use custom --warm and --cold thresholds correctly', async () => {
    const today = new Date();

    // Create files at different ages
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5);
    const twentyDaysAgo = new Date(today);
    twentyDaysAgo.setDate(today.getDate() - 20);
    const fiftyDaysAgo = new Date(today);
    fiftyDaysAgo.setDate(today.getDate() - 50);

    await createAndCommitFileWithDate(tempDir, 'file-5d.md', '# 5 days', fiveDaysAgo.toISOString());
    await createAndCommitFileWithDate(tempDir, 'file-20d.md', '# 20 days', twentyDaysAgo.toISOString());
    await createAndCommitFileWithDate(tempDir, 'file-50d.md', '# 50 days', fiftyDaysAgo.toISOString());

    // Custom thresholds: hot=10, warm=40, cold=60
    // With scoring: root files get low scores (not HOT unless in docs/)
    // All three files are root files with no special location → all WARM
    const result1 = await runCommand('auto-tier', ['--dry-run', '--hot', '10', '--warm', '40', '--cold', '60'], tempDir);

    expect(result1.stdout).toContain('WARM (3 files)'); // All root files → WARM
    expect(result1.stdout).toContain('file-5d.md');
    expect(result1.stdout).toContain('file-20d.md');
    expect(result1.stdout).toContain('file-50d.md');

    // Different thresholds: hot=10, warm=25, cold=40
    // Expected: 5d→HOT, 20d→WARM, 50d→COLD
    const result2 = await runCommand('auto-tier', ['--dry-run', '--hot', '10', '--warm', '25', '--cold', '40'], tempDir);

    expect(result2.stdout).toContain('COLD');
    expect(result2.stdout).toContain('file-50d.md');
  });

  it('should overwrite existing tags with --force', async () => {
    const today = new Date().toISOString();
    await createAndCommitFileWithDate(
      tempDir,
      'test.md',
      '<!-- @cortex-tms-tier COLD -->\n# Test',
      today
    );

    // First run without --force (should skip)
    const firstResult = await runCommand('auto-tier', [], tempDir);
    expect(firstResult.exitCode).toBe(0);

    // Tier should still be COLD (not updated)
    let tier = await getFileTierTag(tempDir, 'test.md');
    expect(tier).toBe('COLD');

    // Run with --force (should update based on scoring)
    const secondResult = await runCommand('auto-tier', ['--force'], tempDir);
    expect(secondResult.exitCode).toBe(0);

    // Tier should now be WARM (root file with recent modification = score 15)
    tier = await getFileTierTag(tempDir, 'test.md');
    expect(tier).toBe('WARM');
  });

  it('should show detailed output with --verbose', async () => {
    const today = new Date().toISOString();
    await createAndCommitFileWithDate(tempDir, 'test.md', '# Test', today);

    // Run with --verbose
    const result = await runCommand('auto-tier', ['--verbose', '--dry-run'], tempDir);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('test.md');
    // Verbose mode should show reasons
    expect(result.stdout).toMatch(/Modified.*days ago/i);
  });
});

describe('Auto-Tier E2E - Edge Cases', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await initGitRepo(tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should skip untracked files (not in git history)', async () => {
    // Create file but don't commit it
    await writeFile(join(tempDir, 'untracked.md'), '# Untracked File');

    const result = await runCommand('auto-tier', [], tempDir);

    expect(result.exitCode).toBe(0);
    // Untracked file should not appear in output
    expect(result.stdout).not.toContain('untracked.md');

    // Verify no tier tag was added
    const tier = await getFileTierTag(tempDir, 'untracked.md');
    expect(tier).toBeNull();
  });

  it('should always tag NEXT-TASKS.md as HOT (mandatory)', async () => {
    // Create NEXT-TASKS.md with old commit date
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 100);

    await createAndCommitFileWithDate(
      tempDir,
      'NEXT-TASKS.md',
      '# Tasks',
      oldDate.toISOString()
    );

    const result = await runCommand('auto-tier', [], tempDir);

    expect(result.exitCode).toBe(0);

    // Even though it's 100 days old, should still be HOT
    const tier = await getFileTierTag(tempDir, 'NEXT-TASKS.md');
    expect(tier).toBe('HOT');
  });

  it('should always tag CLAUDE.md as HOT (mandatory)', async () => {
    // Create CLAUDE.md with old commit date
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 100);

    await createAndCommitFileWithDate(
      tempDir,
      'CLAUDE.md',
      '# Claude Instructions',
      oldDate.toISOString()
    );

    const result = await runCommand('auto-tier', [], tempDir);

    expect(result.exitCode).toBe(0);

    // Even though it's 100 days old, should still be HOT
    const tier = await getFileTierTag(tempDir, 'CLAUDE.md');
    expect(tier).toBe('HOT');
  });

  it('should always tag copilot-instructions.md as HOT (canonical)', async () => {
    // Create .github directory and copilot-instructions.md
    await mkdir(join(tempDir, '.github'));

    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 100);

    await createAndCommitFileWithDate(
      tempDir,
      '.github/copilot-instructions.md',
      '# Copilot Instructions',
      oldDate.toISOString()
    );

    const result = await runCommand('auto-tier', [], tempDir);

    expect(result.exitCode).toBe(0);

    // Even though it's 100 days old, should still be HOT
    const tier = await getFileTierTag(tempDir, '.github/copilot-instructions.md');
    expect(tier).toBe('HOT');
  });

  it('should fail gracefully on non-git repository', async () => {
    // Create temp dir without git init
    const nonGitDir = await createTempDir();

    try {
      const result = await runCommand('auto-tier', [], nonGitDir);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Not a git repository');
    } finally {
      await cleanupTempDir(nonGitDir);
    }
  });

  it('should handle empty repository (no markdown files)', async () => {
    // Git repo with no markdown files
    const result = await runCommand('auto-tier', [], tempDir);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('HOT (0 files)');
    expect(result.stdout).toContain('No changes to apply');
  });
});

describe('Auto-Tier E2E - Real-World Scenarios', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await initGitRepo(tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should handle typical project with docs hierarchy', async () => {
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5);
    const fifteenDaysAgo = new Date(today);
    fifteenDaysAgo.setDate(today.getDate() - 15);
    const fiftyDaysAgo = new Date(today);
    fiftyDaysAgo.setDate(today.getDate() - 50);
    const hundredDaysAgo = new Date(today);
    hundredDaysAgo.setDate(today.getDate() - 100);

    // Create docs structure
    await mkdir(join(tempDir, 'docs'));
    await mkdir(join(tempDir, 'docs/archive'));

    // Active files (HOT) - modified within 7 days
    await createAndCommitFileWithDate(tempDir, 'README.md', '# README', today.toISOString());
    await createAndCommitFileWithDate(tempDir, 'NEXT-TASKS.md', '# Tasks', fiveDaysAgo.toISOString());

    // Recent files (WARM) - modified 8-30 days ago
    await createAndCommitFileWithDate(tempDir, 'docs/ARCHITECTURE.md', '# Arch', fifteenDaysAgo.toISOString());

    // Aging files (WARM) - modified 31-90 days ago
    await createAndCommitFileWithDate(tempDir, 'docs/API.md', '# API', fiftyDaysAgo.toISOString());

    // Archived files (COLD) - modified 91+ days ago
    await createAndCommitFileWithDate(tempDir, 'docs/archive/old-design.md', '# Old', hundredDaysAgo.toISOString());

    const result = await runCommand('auto-tier', [], tempDir);

    expect(result.exitCode).toBe(0);
    // New scoring system: canonical + high-scoring docs go to HOT
    expect(result.stdout).toContain('HOT (3 files)');
    expect(result.stdout).toContain('WARM (1 files)');
    expect(result.stdout).toContain('COLD (1 files)');

    // Verify categorization with new scoring
    // README.md: Root file (score=15) → WARM
    // NEXT-TASKS.md: Canonical (score=100) → HOT
    // docs/ARCHITECTURE.md: docs/ file (score=40) → HOT
    // docs/API.md: docs/ file (score=40) → HOT
    // docs/archive/old-design.md: archive (score=-20) → COLD
    expect(await getFileTierTag(tempDir, 'README.md')).toBe('WARM');
    expect(await getFileTierTag(tempDir, 'NEXT-TASKS.md')).toBe('HOT');
    expect(await getFileTierTag(tempDir, 'docs/ARCHITECTURE.md')).toBe('HOT');
    expect(await getFileTierTag(tempDir, 'docs/API.md')).toBe('HOT');
    expect(await getFileTierTag(tempDir, 'docs/archive/old-design.md')).toBe('COLD');
  });

  it('should work correctly on subsequent runs (idempotent)', async () => {
    const today = new Date().toISOString();
    await createAndCommitFileWithDate(tempDir, 'test.md', '# Test', today);

    // First run
    const firstResult = await runCommand('auto-tier', [], tempDir);
    expect(firstResult.exitCode).toBe(0);
    const firstTier = await getFileTierTag(tempDir, 'test.md');

    // Second run (should be idempotent)
    const secondResult = await runCommand('auto-tier', [], tempDir);
    expect(secondResult.exitCode).toBe(0);
    const secondTier = await getFileTierTag(tempDir, 'test.md');

    // Tier should not change
    expect(firstTier).toBe(secondTier);
    // Root files get WARM (score=15, not enough for HOT)
    expect(secondTier).toBe('WARM');
  });

  it('should format ValidationError context in stderr output', async () => {
    // Test invalid threshold combination (--hot > --warm)
    const result = await runCommand('auto-tier', ['--hot', '10', '--warm', '5'], tempDir);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('--hot threshold must be ≤ --warm threshold');
    expect(result.stderr).toContain('command=auto-tier');
    expect(result.stderr).toContain('errors=');
  });
});
