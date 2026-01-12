/**
 * Integration Tests - Validate Command
 *
 * Tests the validation engine's integration with .cortexrc configuration,
 * including scope-based line limits and ignore lists.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import {
  createTempDir,
  cleanupTempDir,
} from './utils/temp-dir.js';
import {
  validateProject,
  validateFileSizes,
  validateMandatoryFiles,
  DEFAULT_LINE_LIMITS,
} from '../utils/validator.js';
import { saveConfig, createConfigFromScope } from '../utils/config.js';

/**
 * Helper to create a minimal TMS project structure
 */
async function createMinimalProject(dir: string): Promise<void> {
  // Create mandatory files
  await writeFile(join(dir, 'NEXT-TASKS.md'), '# NEXT: Upcoming Tasks\n');
  await writeFile(join(dir, 'CLAUDE.md'), '# Agent Workflow\n');
  await mkdir(join(dir, '.github'), { recursive: true });
  await writeFile(
    join(dir, '.github/copilot-instructions.md'),
    '# Instructions\n'
  );
}

/**
 * Helper to create a file with N lines
 */
async function createFileWithLines(
  dir: string,
  filename: string,
  lineCount: number
): Promise<void> {
  const content = Array(lineCount)
    .fill('Line content here')
    .join('\n');

  // Handle nested paths
  const filePath = join(dir, filename);
  const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
  if (dirPath !== dir) {
    await mkdir(dirPath, { recursive: true });
  }

  await writeFile(filePath, content);
}

describe('Validate Command - .cortexrc Integration', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await createMinimalProject(tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should use default line limits when no .cortexrc exists', async () => {
    // Create a file that exceeds default limit
    await createFileWithLines(tempDir, 'NEXT-TASKS.md', 250);

    const result = await validateProject(tempDir);

    const fileSizeCheck = result.checks.find(
      (c) => c.name === 'File Size: NEXT-TASKS.md'
    );

    expect(fileSizeCheck).toBeDefined();
    expect(fileSizeCheck?.passed).toBe(false);
    expect(fileSizeCheck?.details).toContain('250');
    expect(fileSizeCheck?.details).toContain('200'); // Default limit
  });

  it('should use scope-based limits from .cortexrc', async () => {
    // Create nano config (limit: 100 lines)
    const config = createConfigFromScope('nano', 'test-project');
    await saveConfig(tempDir, config);

    // Create file with 150 lines (exceeds nano limit)
    await createFileWithLines(tempDir, 'NEXT-TASKS.md', 150);

    const result = await validateProject(tempDir);

    const fileSizeCheck = result.checks.find(
      (c) => c.name === 'File Size: NEXT-TASKS.md'
    );

    expect(fileSizeCheck?.passed).toBe(false);
    expect(fileSizeCheck?.details).toContain('150');
    expect(fileSizeCheck?.details).toContain('100'); // Nano limit
  });

  it('should allow larger limits for enterprise scope', async () => {
    // Create enterprise config (limit: 300 lines)
    const config = createConfigFromScope('enterprise', 'test-project');
    await saveConfig(tempDir, config);

    // Create file with 250 lines (within enterprise limit)
    await createFileWithLines(tempDir, 'NEXT-TASKS.md', 250);

    const result = await validateProject(tempDir);

    const fileSizeCheck = result.checks.find(
      (c) => c.name === 'File Size: NEXT-TASKS.md'
    );

    expect(fileSizeCheck?.passed).toBe(true);
    expect(fileSizeCheck?.details).toContain('250');
    expect(fileSizeCheck?.details).toContain('300'); // Enterprise limit
  });

  it('should respect custom line limit overrides in .cortexrc', async () => {
    const config = createConfigFromScope('standard', 'test-project');

    // Override NEXT-TASKS.md limit to 500
    config.limits = {
      'NEXT-TASKS.md': 500,
    };

    await saveConfig(tempDir, config);

    // Create file with 450 lines (exceeds standard 200 but within custom 500)
    await createFileWithLines(tempDir, 'NEXT-TASKS.md', 450);

    const result = await validateProject(tempDir);

    const fileSizeCheck = result.checks.find(
      (c) => c.name === 'File Size: NEXT-TASKS.md'
    );

    expect(fileSizeCheck?.passed).toBe(true);
    expect(fileSizeCheck?.details).toContain('450');
    expect(fileSizeCheck?.details).toContain('500'); // Custom limit
  });
});

describe('Validate Command - Ignore Files', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await createMinimalProject(tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should detect placeholders by default', async () => {
    await writeFile(
      join(tempDir, 'NEXT-TASKS.md'),
      '# Project: [Project Name]\n'
    );

    const result = await validateProject(tempDir);

    const placeholderCheck = result.checks.find(
      (c) => c.name === 'Placeholders: NEXT-TASKS.md'
    );

    expect(placeholderCheck?.passed).toBe(false);
    expect(placeholderCheck?.message).toContain('unreplaced placeholders');
  });

  it('should ignore files specified in .cortexrc validation.ignoreFiles', async () => {
    const config = createConfigFromScope('standard', 'test-project');

    // Ignore NEXT-TASKS.md from placeholder checks
    config.validation = {
      ignoreFiles: ['NEXT-TASKS.md'],
      ignorePatterns: [],
    };

    await saveConfig(tempDir, config);

    await writeFile(
      join(tempDir, 'NEXT-TASKS.md'),
      '# Project: [Project Name]\n'
    );

    const result = await validateProject(tempDir);

    // Placeholder check for NEXT-TASKS.md should not exist
    const placeholderCheck = result.checks.find(
      (c) => c.name === 'Placeholders: NEXT-TASKS.md'
    );

    expect(placeholderCheck).toBeUndefined();
  });

  it('should still check non-ignored files', async () => {
    const config = createConfigFromScope('standard', 'test-project');

    // Only ignore NEXT-TASKS.md
    config.validation = {
      ignoreFiles: ['NEXT-TASKS.md'],
      ignorePatterns: [],
    };

    await saveConfig(tempDir, config);

    // Add placeholder to CLAUDE.md (not ignored)
    await writeFile(
      join(tempDir, 'CLAUDE.md'),
      '# Agent for [Project Name]\n'
    );

    const result = await validateProject(tempDir);

    const claudeCheck = result.checks.find(
      (c) => c.name === 'Placeholders: CLAUDE.md'
    );

    expect(claudeCheck?.passed).toBe(false);
    expect(claudeCheck?.message).toContain('unreplaced placeholders');
  });
});

describe('Validate Command - Mandatory Files', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should fail when mandatory files are missing', async () => {
    const checks = validateMandatoryFiles(tempDir);

    const nextTasksCheck = checks.find((c) => c.file === 'NEXT-TASKS.md');
    const claudeCheck = checks.find((c) => c.file === 'CLAUDE.md');

    expect(nextTasksCheck?.passed).toBe(false);
    expect(nextTasksCheck?.level).toBe('error');
    expect(claudeCheck?.passed).toBe(false);
    expect(claudeCheck?.level).toBe('error');
  });

  it('should pass when all mandatory files exist', async () => {
    await createMinimalProject(tempDir);

    const checks = validateMandatoryFiles(tempDir);

    const allPassed = checks.every((c) => c.passed);
    expect(allPassed).toBe(true);
  });
});

describe('Validate Command - File Size Limits', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should pass when file is within limit', async () => {
    await createFileWithLines(tempDir, 'NEXT-TASKS.md', 100);

    const checks = await validateFileSizes(tempDir, DEFAULT_LINE_LIMITS);
    const nextTasksCheck = checks.find((c) => c.file === 'NEXT-TASKS.md');

    expect(nextTasksCheck?.passed).toBe(true);
    expect(nextTasksCheck?.details).toContain('100/200');
  });

  it('should fail when file exceeds limit', async () => {
    await createFileWithLines(tempDir, 'NEXT-TASKS.md', 300);

    const checks = await validateFileSizes(tempDir, DEFAULT_LINE_LIMITS);
    const nextTasksCheck = checks.find((c) => c.file === 'NEXT-TASKS.md');

    expect(nextTasksCheck?.passed).toBe(false);
    expect(nextTasksCheck?.level).toBe('warning');
    expect(nextTasksCheck?.details).toContain('Overage: 100');
  });

  it('should skip files that do not exist', async () => {
    const checks = await validateFileSizes(tempDir, DEFAULT_LINE_LIMITS);

    // Should return empty array if no files exist
    expect(checks.length).toBe(0);
  });
});

describe('Validate Command - Strict Mode', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    // Don't create minimal project - tests will set up their own scenarios
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should pass in normal mode with warnings', async () => {
    await createMinimalProject(tempDir);
    // Create file that exceeds limit (warning)
    await createFileWithLines(tempDir, 'NEXT-TASKS.md', 250);

    const result = await validateProject(tempDir, { strict: false });

    expect(result.passed).toBe(true); // Warnings don't fail in normal mode
    expect(result.summary.warnings).toBeGreaterThan(0);
  });

  it('should fail in strict mode with warnings', async () => {
    await createMinimalProject(tempDir);
    // Create file that exceeds limit (warning)
    await createFileWithLines(tempDir, 'NEXT-TASKS.md', 250);

    const result = await validateProject(tempDir, { strict: true });

    expect(result.passed).toBe(false); // Warnings fail in strict mode
    expect(result.summary.warnings).toBeGreaterThan(0);
  });

  it('should fail in both modes with errors', async () => {
    // Create only some mandatory files (missing CLAUDE.md = error)
    await writeFile(join(tempDir, 'NEXT-TASKS.md'), '# NEXT: Upcoming Tasks\n');
    await mkdir(join(tempDir, '.github'), { recursive: true });
    await writeFile(
      join(tempDir, '.github/copilot-instructions.md'),
      '# Instructions\n'
    );
    // Intentionally NOT creating CLAUDE.md

    const normalResult = await validateProject(tempDir, { strict: false });
    const strictResult = await validateProject(tempDir, { strict: true });

    // Find the CLAUDE.md check
    const claudeCheck = normalResult.checks.find((c) => c.file === 'CLAUDE.md');

    expect(claudeCheck).toBeDefined();
    expect(claudeCheck?.passed).toBe(false);
    expect(claudeCheck?.level).toBe('error');
    expect(normalResult.summary.errors).toBeGreaterThan(0);
    expect(normalResult.passed).toBe(false);
    expect(strictResult.passed).toBe(false);
  });
});
