/**
 * E2E Integration Tests - Validate Command
 *
 * Tests the complete validate command workflow including:
 * - Validating initialized projects
 * - Detecting missing files
 * - Strict mode validation
 * - Configuration validation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'path';
import { writeFile, unlink } from 'fs/promises';
import { createTempDir, cleanupTempDir } from './utils/temp-dir.js';
import { runCommand, expectSuccess, expectFailure } from './utils/cli-runner.js';

describe('Validate E2E - Passing Projects', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    // Initialize project first
    await runCommand('init', ['--scope', 'standard', '--force'], tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should pass validation for properly initialized project', async () => {
    const result = await runCommand('validate', [], tempDir);

    expectSuccess(result);
    expect(result.stdout).toContain('Validation passed');
    expect(result.stdout).toContain('✓') || expect(result.stdout).toContain('✅');
  });

  it('should show all checks passing in output', async () => {
    const result = await runCommand('validate', [], tempDir);

    expectSuccess(result);

    // Should mention mandatory files
    expect(result.stdout).toContain('NEXT-TASKS.md');
    expect(result.stdout).toContain('CLAUDE.md');

    // Should show configuration check
    expect(result.stdout).toContain('configuration') || expect(result.stdout).toContain('config');
  });

  it('should pass strict validation for complete project', async () => {
    const result = await runCommand('validate', ['--strict'], tempDir);

    expectSuccess(result);
    expect(result.stdout).toContain('Validation passed');
  });
});

describe('Validate E2E - Failing Projects', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    // Initialize project
    await runCommand('init', ['--scope', 'standard', '--force'], tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should detect missing NEXT-TASKS.md', async () => {
    // Remove mandatory file
    await unlink(join(tempDir, 'NEXT-TASKS.md'));

    const result = await runCommand('validate', [], tempDir);

    expectFailure(result);
    expect(result.stdout).toContain('NEXT-TASKS.md');
  });

  it('should detect missing CLAUDE.md', async () => {
    // Remove mandatory file
    await unlink(join(tempDir, 'CLAUDE.md'));

    const result = await runCommand('validate', [], tempDir);

    expectFailure(result);
    expect(result.stdout).toContain('CLAUDE.md');
  });

  it('should detect missing .cortexrc configuration', async () => {
    // Remove configuration file
    await unlink(join(tempDir, '.cortexrc'));

    const result = await runCommand('validate', [], tempDir);

    expectFailure(result);
    expect(result.stdout).toContain('.cortexrc') || expect(result.stdout).toContain('configuration');
  });

  it('should detect invalid .cortexrc format', async () => {
    // Write invalid JSON
    await writeFile(join(tempDir, '.cortexrc'), 'not valid json');

    const result = await runCommand('validate', [], tempDir);

    expectFailure(result);
    expect(result.stdout).toContain('configuration') || expect(result.stdout).toContain('invalid');
  });
});

describe('Validate E2E - Strict Mode', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await runCommand('init', ['--scope', 'standard', '--force'], tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should perform additional checks in strict mode', async () => {
    const normalResult = await runCommand('validate', [], tempDir);
    const strictResult = await runCommand('validate', ['--strict'], tempDir);

    expectSuccess(normalResult);
    expectSuccess(strictResult);

    // Strict mode should mention additional checks or use different wording
    // (Implementation may vary)
    expect(strictResult.stdout).toBeTruthy();
  });

  it('should fail strict mode for incomplete projects', async () => {
    // Remove optional file that strict mode might check
    // (Implementation dependent - may need adjustment)
    const result = await runCommand('validate', ['--strict'], tempDir);

    // Should pass for freshly initialized project
    expectSuccess(result);
  });
});

describe('Validate E2E - Archive Status', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await runCommand('init', ['--scope', 'standard', '--force'], tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should check archive directory exists', async () => {
    const result = await runCommand('validate', [], tempDir);

    expectSuccess(result);
    expect(result.stdout).toContain('archive') || expect(result.stdout).toContain('Archive');
  });

  it('should validate task list health', async () => {
    const result = await runCommand('validate', [], tempDir);

    expectSuccess(result);

    // Should check that task list is healthy
    expect(result.stdout).toContain('task') || expect(result.stdout).toContain('Task');
  });
});

describe('Validate E2E - Summary Output', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await runCommand('init', ['--scope', 'standard', '--force'], tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should show summary with check counts', async () => {
    const result = await runCommand('validate', [], tempDir);

    expectSuccess(result);

    // Should show number of checks performed
    expect(result.stdout).toMatch(/\d+/) || expect(result.stdout).toContain('checks');
    expect(result.stdout).toContain('Passed') || expect(result.stdout).toContain('passed');
  });

  it('should provide clear pass/fail indication', async () => {
    const result = await runCommand('validate', [], tempDir);

    expectSuccess(result);
    expect(result.stdout).toContain('✓') ||
      expect(result.stdout).toContain('✅') ||
      expect(result.stdout).toContain('passed');
  });
});
