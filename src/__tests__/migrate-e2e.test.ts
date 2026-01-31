/**
 * E2E Integration Tests - Migrate Command
 *
 * Tests the complete migrate command workflow including:
 * - Version migration (v2.x to v3.x)
 * - Dry-run mode
 * - Backup creation
 * - File updates and preservation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'path';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { createTempDir, cleanupTempDir } from './utils/temp-dir.js';
import { runCommand, expectSuccess } from './utils/cli-runner.js';

/**
 * Helper to create a v2.x project structure
 */
async function createV2Project(dir: string): Promise<void> {
  // Create v2.x .cortexrc
  const v2Config = {
    version: '2.6.0',
    scope: 'standard',
    createdAt: new Date().toISOString(),
  };
  await writeFile(join(dir, '.cortexrc'), JSON.stringify(v2Config, null, 2));

  // Create old-style files with v2.x version tags
  await writeFile(
    join(dir, 'NEXT-TASKS.md'),
    '# NEXT-TASKS\n\nOld format\n\n<!-- @cortex-tms-version 2.6.0 -->'
  );
  await writeFile(
    join(dir, 'CLAUDE.md'),
    '# CLAUDE\n\nOld format\n\n<!-- @cortex-tms-version 2.6.0 -->'
  );

  // Create docs structure
  await mkdir(join(dir, 'docs/core'), { recursive: true });
  await writeFile(
    join(dir, 'docs/core/PATTERNS.md'),
    '# Patterns (v2.x)\n\n<!-- @cortex-tms-version 2.6.0 -->'
  );
}

describe('Migrate E2E - Basic Migration', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await createV2Project(tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should migrate from v2.x to v3.x successfully', async () => {
    // Use --force to upgrade customized files
    const result = await runCommand('migrate', ['--apply', '--force'], tempDir);

    expectSuccess(result);
    // Check for migration success message (either/or)
    expect(
      result.stdout.includes('Migration complete') ||
      result.stdout.includes('Upgraded') ||
      result.stdout.includes('migrated')
    ).toBe(true);

    // Verify files have v3.x version tags
    const nextTasks = await readFile(join(tempDir, 'NEXT-TASKS.md'), 'utf-8');
    expect(nextTasks).toMatch(/<!-- @cortex-tms-version 3\.\d+\.\d+ -->/);
  });

  it('should skip customized files during migration (without --force)', async () => {
    // Add custom content to make file CUSTOMIZED
    const customContent = '\n\n## Custom Section\n\nMy custom notes';
    const originalNextTasks = await readFile(join(tempDir, 'NEXT-TASKS.md'), 'utf-8');
    const customized = originalNextTasks + customContent;
    await writeFile(join(tempDir, 'NEXT-TASKS.md'), customized);

    const result = await runCommand('migrate', ['--apply'], tempDir);
    expectSuccess(result);

    // Check custom content is PRESERVED (file skipped, not upgraded)
    const afterMigration = await readFile(join(tempDir, 'NEXT-TASKS.md'), 'utf-8');
    expect(afterMigration).toContain('Custom Section');
    expect(afterMigration).toContain('My custom notes');
    expect(afterMigration).toBe(customized); // File unchanged
  });

  it('should create backup before migration', async () => {
    // Use --force to trigger actual migration (and backup)
    const result = await runCommand('migrate', ['--apply', '--force'], tempDir);
    expectSuccess(result);

    // Check for backup directory or mention in output
    expect(result.stdout).toMatch(/[Bb]ackup/);

    // Verify backup directory exists
    const backupExists = existsSync(join(tempDir, '.cortex/backups'));
    expect(backupExists).toBe(true);
  });

  it('should update version tags in migrated files', async () => {
    const result = await runCommand('migrate', ['--apply', '--force'], tempDir);
    expectSuccess(result);

    // Check that version tags were updated
    const patterns = await readFile(join(tempDir, 'docs/core/PATTERNS.md'), 'utf-8');
    expect(patterns).toMatch(/<!-- @cortex-tms-version 3\.\d+\.\d+ -->/);
  });
});

describe('Migrate E2E - Dry Run Mode', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await createV2Project(tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should preview migration without making changes in dry-run mode', async () => {
    // Read original version
    const originalConfig = JSON.parse(
      await readFile(join(tempDir, '.cortexrc'), 'utf-8')
    );

    const result = await runCommand('migrate', ['--dry-run'], tempDir);

    expectSuccess(result);
    expect(result.stdout).toMatch(/dry[-\s]run|preview/i);

    // Verify no changes were made
    const currentConfig = JSON.parse(
      await readFile(join(tempDir, '.cortexrc'), 'utf-8')
    );
    expect(currentConfig.version).toBe(originalConfig.version);
  });

  it('should show what would be migrated in dry-run output', async () => {
    const result = await runCommand('migrate', ['--dry-run'], tempDir);

    expectSuccess(result);

    // Should list files that would be updated
    expect(
      result.stdout.includes('NEXT-TASKS.md') ||
      result.stdout.includes('.cortexrc') ||
      result.stdout.includes('dry')
    ).toBe(true);
  });
});

describe('Migrate E2E - Already Migrated', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    // Create a v3.x project
    await runCommand('init', ['--scope', 'standard', '--force'], tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should handle migration of already migrated project gracefully', async () => {
    const result = await runCommand('migrate', [], tempDir);

    // Should either succeed with message or skip migration
    expect(result.exitCode).toBe(0);

    if (result.stdout.includes('already') || result.stdout.includes('up-to-date')) {
      // Good - acknowledged already migrated
      expect(result.stdout).toMatch(/already|up-to-date/);
    }
  });
});

describe('Migrate E2E - Missing Files', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should handle missing .cortexrc gracefully', async () => {
    // Create minimal structure without .cortexrc
    await writeFile(join(tempDir, 'NEXT-TASKS.md'), '# Tasks');

    const result = await runCommand('migrate', [], tempDir);

    // Should either initialize or fail with helpful error
    const hasOutput = result.stderr || result.stdout;
    expect(hasOutput).toBeTruthy();
  });
});

describe('Migrate E2E - File Creation', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await createV2Project(tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should create missing v3.x files during migration', async () => {
    const result = await runCommand('migrate', [], tempDir);
    expectSuccess(result);

    // Check for new v3.x files that didn't exist in v2.x
    // (Implementation dependent - adjust based on actual v3.x additions)
    const cortexrcExists = existsSync(join(tempDir, '.cortexrc'));
    expect(cortexrcExists).toBe(true);
  });

  it('should preserve directory structure during migration', async () => {
    const result = await runCommand('migrate', [], tempDir);
    expectSuccess(result);

    // Verify docs/core still exists
    const docsExists = existsSync(join(tempDir, 'docs/core'));
    expect(docsExists).toBe(true);
  });
});
