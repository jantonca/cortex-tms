/**
 * Integration Tests - Command Workflows
 *
 * Tests end-to-end command interactions and workflows to ensure
 * commands work together correctly. Uses real CLI execution in
 * isolated temporary directories.
 *
 * These tests verify:
 * - Command sequences (init → validate → status)
 * - File system state after operations
 * - Error recovery and rollback
 * - Cross-command data flow
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { createTempDir, cleanupTempDir } from './utils/temp-dir.js';
import { runCommand } from './utils/cli-runner.js';

describe('Integration Tests - Command Workflows', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('Happy Path: Complete Project Setup', () => {
    it('should init → validate → status workflow successfully', async () => {
      // Step 1: Initialize project with standard scope
      const initResult = await runCommand(
        'init',
        ['--scope', 'standard', '--force'],
        tempDir
      );

      expect(initResult.exitCode).toBe(0);
      expect(initResult.stdout).toContain('Success');

      // Verify files created
      expect(existsSync(join(tempDir, 'NEXT-TASKS.md'))).toBe(true);
      expect(existsSync(join(tempDir, 'CLAUDE.md'))).toBe(true);
      expect(existsSync(join(tempDir, '.cortexrc'))).toBe(true);

      // Step 2: Validate the initialized project (expect placeholder errors)
      const validateResult = await runCommand('validate', [], tempDir);

      expect(validateResult.exitCode).toBe(1); // Fails due to placeholders
      expect(validateResult.stdout).toContain('Placeholder Completion');
      expect(validateResult.stdout).toContain('incomplete');

      // Step 3: Check status (should still work even with validation errors)
      const statusResult = await runCommand('status', [], tempDir);

      expect(statusResult.exitCode).toBe(0);
      expect(statusResult.stdout).toContain('Project Health');
      expect(statusResult.stdout).toContain('Scope: Standard');
    });

    it('should handle init → validate → fix workflow', async () => {
      // Initialize project
      await runCommand('init', ['--scope', 'nano', '--force'], tempDir);

      // Delete a required file to trigger validation failure
      const nextTasksPath = join(tempDir, 'NEXT-TASKS.md');
      if (existsSync(nextTasksPath)) {
        unlinkSync(nextTasksPath);
      }

      // Validate should fail
      const validateResult = await runCommand('validate', [], tempDir);
      expect(validateResult.exitCode).toBe(1);
      expect(validateResult.stdout).toContain('missing');

      // Fix with validate --fix (should recreate the file)
      const fixResult = await runCommand('validate', ['--fix'], tempDir);

      // After fix, file should exist again
      expect(existsSync(nextTasksPath)).toBe(true);

      // Validate again (will still have placeholder errors, but mandatory file check passes)
      const revalidateResult = await runCommand('validate', [], tempDir);
      expect(revalidateResult.exitCode).toBe(1); // Still fails due to placeholders
      expect(revalidateResult.stdout).toContain('NEXT-TASKS.md exists');
    });
  });

  describe('Error Recovery and Rollback', () => {
    it('should handle init on existing project gracefully', async () => {
      // First init
      await runCommand('init', ['--scope', 'standard', '--force'], tempDir);

      // Second init with --force should succeed (overwrite)
      const result = await runCommand('init', ['--scope', 'standard', '--force'], tempDir);

      expect(result.exitCode).toBe(0);

      // Verify files still exist and have correct scope
      const config = JSON.parse(
        readFileSync(join(tempDir, '.cortexrc'), 'utf-8')
      );
      expect(config.scope).toBe('standard');
    });

    it('should rollback on init failure', async () => {
      // Simulate init failure by making directory read-only (if possible)
      // For now, test that partial init doesn't leave corrupt state
      const result = await runCommand(
        'init',
        ['--scope', 'invalid-scope', '--force'],
        tempDir
      );

      expect(result.exitCode).toBe(1);

      // Should not create partial files
      const filesCreated = [
        existsSync(join(tempDir, 'NEXT-TASKS.md')),
        existsSync(join(tempDir, 'CLAUDE.md')),
        existsSync(join(tempDir, '.cortexrc')),
      ].filter(Boolean).length;

      // Either all files or no files (no partial state)
      expect(filesCreated === 0 || filesCreated === 3).toBe(true);
    });
  });

  describe('Cross-Command Data Flow', () => {
    it('should persist scope across commands', async () => {
      // Init with enterprise scope
      await runCommand('init', ['--scope', 'enterprise', '--force'], tempDir);

      // Status should show enterprise
      const statusResult = await runCommand('status', [], tempDir);
      expect(statusResult.stdout).toContain('Scope: Enterprise');

      // Validate should check enterprise files (will fail due to placeholders)
      const validateResult = await runCommand('validate', [], tempDir);
      expect(validateResult.exitCode).toBe(1); // Fails due to placeholders
      expect(validateResult.stdout).toContain('Placeholder Completion');

      // Config should persist
      const config = JSON.parse(
        readFileSync(join(tempDir, '.cortexrc'), 'utf-8')
      );
      expect(config.scope).toBe('enterprise');
    });

    it('should handle scope migration workflow', async () => {
      // Start with nano
      await runCommand('init', ['--scope', 'nano', '--force'], tempDir);

      // Manually change scope (simulating user migration)
      const configPath = join(tempDir, '.cortexrc');
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      config.scope = 'standard';
      writeFileSync(configPath, JSON.stringify(config, null, 2));

      // Status should reflect new scope
      const statusResult = await runCommand('status', [], tempDir);
      expect(statusResult.stdout).toContain('Scope: Standard');

      // Validate should detect missing files for standard scope
      const validateResult = await runCommand('validate', [], tempDir);
      expect(validateResult.exitCode).toBe(1);
    });
  });

  describe('Multi-Command Sequences', () => {
    it('should support init → status → validate → status cycle', async () => {
      // Init
      await runCommand('init', ['--scope', 'standard', '--force'], tempDir);

      // Status before validation
      const status1 = await runCommand('status', [], tempDir);
      expect(status1.stdout).toContain('Project Health');

      // Validate (will fail due to placeholders)
      const validate1 = await runCommand('validate', [], tempDir);
      expect(validate1.exitCode).toBe(1);

      // Status after validation
      const status2 = await runCommand('status', [], tempDir);
      expect(status2.stdout).toContain('Project Health');

      // Both statuses should show same scope
      expect(status1.stdout).toContain('Scope: Standard');
      expect(status2.stdout).toContain('Scope: Standard');
    });

    it('should handle repeated validation cycles', async () => {
      await runCommand('init', ['--scope', 'nano', '--force'], tempDir);

      // Run validate multiple times (will consistently fail due to placeholders)
      for (let i = 0; i < 3; i++) {
        const result = await runCommand('validate', [], tempDir);
        expect(result.exitCode).toBe(1); // Fails due to placeholders
        expect(result.stdout).toContain('Placeholder Completion');
      }
    });
  });

  describe('File System State Management', () => {
    it('should maintain consistent state across commands', async () => {
      // Init project
      await runCommand('init', ['--scope', 'standard', '--force'], tempDir);

      // Snapshot initial files
      const initialFiles = [
        'NEXT-TASKS.md',
        'CLAUDE.md',
        '.cortexrc',
        'docs/core/PATTERNS.md',
      ].map(f => join(tempDir, f));

      const initialContent = new Map(
        initialFiles.map(f => [f, readFileSync(f, 'utf-8')])
      );

      // Run multiple non-mutating commands
      await runCommand('status', [], tempDir);
      await runCommand('validate', [], tempDir);
      await runCommand('status', [], tempDir);

      // Verify files unchanged
      initialFiles.forEach(file => {
        const current = readFileSync(file, 'utf-8');
        const original = initialContent.get(file);
        expect(current).toBe(original);
      });
    });

    it('should handle migrate command properly', async () => {
      await runCommand('init', ['--scope', 'standard', '--force'], tempDir);

      // Run migrate (may report "already up to date" or perform migration)
      const migrateResult = await runCommand('migrate', [], tempDir);

      // Migrate should complete (either success or informative message)
      // Exit code 0 or 1 both acceptable depending on migration state
      expect([0, 1]).toContain(migrateResult.exitCode);

      // Either way, original files should still exist
      expect(existsSync(join(tempDir, 'NEXT-TASKS.md'))).toBe(true);
      expect(existsSync(join(tempDir, '.cortexrc'))).toBe(true);
    });
  });

  describe('Error Messages and User Guidance', () => {
    it('should provide helpful error on missing init', async () => {
      const result = await runCommand('validate', [], tempDir);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toContain('cortex-tms init');
    });

    it('should provide helpful error on invalid scope', async () => {
      const result = await runCommand(
        'init',
        ['--scope', 'invalid', '--force'],
        tempDir
      );

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Invalid init command options');
      expect(result.stderr).toMatch(/nano|standard|enterprise|custom/);
    });

    it('should guide user through recovery', async () => {
      await runCommand('init', ['--scope', 'standard', '--force'], tempDir);

      // Delete a required file
      const nextTasksPath = join(tempDir, 'NEXT-TASKS.md');
      if (existsSync(nextTasksPath)) {
        unlinkSync(nextTasksPath);
      }

      const result = await runCommand('validate', [], tempDir);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toMatch(/missing|NEXT-TASKS\.md/i);
      expect(result.stdout).toContain('--fix');
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle status check during other operations', async () => {
      await runCommand('init', ['--scope', 'standard', '--force'], tempDir);

      // Run status while validate is running (simulated sequence)
      const results = await Promise.all([
        runCommand('status', [], tempDir),
        runCommand('validate', [], tempDir),
      ]);

      // Status should succeed, validate will fail due to placeholders
      const [statusResult, validateResult] = results;
      expect(statusResult.exitCode).toBe(0); // Status succeeds
      expect(validateResult.exitCode).toBe(1); // Validate fails (placeholders)
    });
  });

  describe('Real-World Scenarios', () => {
    it('should support typical developer workflow', async () => {
      // Day 1: Initialize project
      const init = await runCommand(
        'init',
        ['--scope', 'standard', '--force'],
        tempDir
      );
      expect(init.exitCode).toBe(0);

      // Day 1: Check status
      const status1 = await runCommand('status', [], tempDir);
      expect(status1.exitCode).toBe(0);

      // Day 2: Make some changes to NEXT-TASKS.md
      const nextTasksPath = join(tempDir, 'NEXT-TASKS.md');
      const content = readFileSync(nextTasksPath, 'utf-8');
      writeFileSync(nextTasksPath, content + '\n## New Sprint\n');

      // Day 2: Validate changes (will fail due to placeholders)
      const validate = await runCommand('validate', [], tempDir);
      expect(validate.exitCode).toBe(1); // Fails due to placeholders
      expect(validate.stdout).toContain('Placeholder Completion');

      // Day 3: Check status again
      const status2 = await runCommand('status', [], tempDir);
      expect(status2.exitCode).toBe(0);

      // Day 4: Run full health check (also fails due to placeholders)
      const healthCheck = await runCommand('validate', ['--strict'], tempDir);
      expect(healthCheck.exitCode).toBe(1); // Fails due to placeholders
    });
  });
});
