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

  // Create .cortexrc configuration
  const config = createConfigFromScope('standard', 'test-project');
  await saveConfig(dir, config);
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

describe('Validate Command - Nano Scope Integration (CRITICAL-1 Fix)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should PASS validation after nano scope init', async () => {
    // Simulate what nano init does: creates 2 files + .cortexrc
    await writeFile(join(tempDir, 'NEXT-TASKS.md'), '# NEXT: Upcoming Tasks\n');
    await writeFile(join(tempDir, 'CLAUDE.md'), '# Agent Workflow\n');

    // Create nano config
    const config = createConfigFromScope('nano', 'test-project');
    await saveConfig(tempDir, config);

    // Run full validation
    const result = await validateProject(tempDir, { strict: false });

    // Should PASS (this was the bug - it used to FAIL)
    expect(result.passed).toBe(true);
    expect(result.summary.errors).toBe(0);

    // Verify only 2 mandatory files were checked
    const mandatoryChecks = result.checks.filter((c) =>
      c.name.startsWith('Mandatory File:')
    );
    expect(mandatoryChecks.length).toBe(2);

    // Verify copilot-instructions.md is NOT required
    const copilotCheck = result.checks.find(
      (c) => c.file === '.github/copilot-instructions.md'
    );
    expect(copilotCheck).toBeUndefined();
  });

  it('should FAIL validation if nano scope is missing CLAUDE.md', async () => {
    // Create only NEXT-TASKS.md (missing CLAUDE.md)
    await writeFile(join(tempDir, 'NEXT-TASKS.md'), '# NEXT: Upcoming Tasks\n');

    // Create nano config
    const config = createConfigFromScope('nano', 'test-project');
    await saveConfig(tempDir, config);

    // Run validation
    const result = await validateProject(tempDir, { strict: false });

    // Should FAIL
    expect(result.passed).toBe(false);
    expect(result.summary.errors).toBeGreaterThan(0);

    // Find the CLAUDE.md check
    const claudeCheck = result.checks.find((c) => c.file === 'CLAUDE.md');
    expect(claudeCheck?.passed).toBe(false);
    expect(claudeCheck?.level).toBe('error');
  });
});

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

    const completionCheck = result.checks.find(
      (c) => c.name === 'Completion: NEXT-TASKS.md'
    );

    expect(completionCheck?.passed).toBe(false);
    expect(completionCheck?.message).toContain('incomplete');
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

    // Completion check for NEXT-TASKS.md should not exist (file is ignored)
    const completionCheck = result.checks.find(
      (c) => c.name === 'Completion: NEXT-TASKS.md'
    );

    expect(completionCheck).toBeUndefined();
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
      (c) => c.name === 'Completion: CLAUDE.md'
    );

    expect(claudeCheck?.passed).toBe(false);
    expect(claudeCheck?.message).toContain('incomplete');
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

  it('should only require 2 files for nano scope', async () => {
    // Create only NEXT-TASKS.md and CLAUDE.md (nano scope)
    await writeFile(join(tempDir, 'NEXT-TASKS.md'), '# NEXT: Upcoming Tasks\n');
    await writeFile(join(tempDir, 'CLAUDE.md'), '# Agent Workflow\n');

    // Validate with nano scope
    const checks = validateMandatoryFiles(tempDir, 'nano');

    // Should only check 2 files for nano scope
    expect(checks.length).toBe(2);

    // Both should pass
    const allPassed = checks.every((c) => c.passed);
    expect(allPassed).toBe(true);

    // Should not check for copilot-instructions.md
    const copilotCheck = checks.find((c) => c.file === '.github/copilot-instructions.md');
    expect(copilotCheck).toBeUndefined();
  });

  it('should require 3 files for standard scope', async () => {
    // Create all 3 standard files
    await writeFile(join(tempDir, 'NEXT-TASKS.md'), '# NEXT: Upcoming Tasks\n');
    await writeFile(join(tempDir, 'CLAUDE.md'), '# Agent Workflow\n');
    await mkdir(join(tempDir, '.github'), { recursive: true });
    await writeFile(
      join(tempDir, '.github/copilot-instructions.md'),
      '# Instructions\n'
    );

    // Validate with standard scope
    const checks = validateMandatoryFiles(tempDir, 'standard');

    // Should check 3 files for standard scope
    expect(checks.length).toBe(3);

    // All should pass
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

describe('Validate Command - AI-DRAFT Detection (Bootstrap Feature)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await createMinimalProject(tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should detect files with placeholder text as incomplete (error)', async () => {
    await writeFile(
      join(tempDir, 'NEXT-TASKS.md'),
      '# Project: [Project Name]\n\nThis is a [Description] of the project.\n'
    );

    const result = await validateProject(tempDir);

    const completionCheck = result.checks.find(
      (c) => c.name === 'Completion: NEXT-TASKS.md'
    );

    expect(completionCheck).toBeDefined();
    expect(completionCheck?.passed).toBe(false);
    expect(completionCheck?.level).toBe('error');
    expect(completionCheck?.message).toContain('incomplete');
    expect(completionCheck?.details).toContain('[Project Name]');
    expect(completionCheck?.details).toContain('cortex-tms prompt bootstrap');
  });

  it('should detect files with AI-DRAFT markers as draft (warning)', async () => {
    await writeFile(
      join(tempDir, 'NEXT-TASKS.md'),
      '# NEXT: Upcoming Tasks\n\n<!-- AI-DRAFT: Review before treating as canonical -->\n\n## Sprint Goals\n\nGoal 1\n\n<!-- AI-DRAFT -->\n\nGoal 2\n'
    );

    const result = await validateProject(tempDir);

    const completionCheck = result.checks.find(
      (c) => c.name === 'Completion: NEXT-TASKS.md'
    );

    expect(completionCheck).toBeDefined();
    expect(completionCheck?.passed).toBe(true); // Not a hard failure
    expect(completionCheck?.level).toBe('warning');
    expect(completionCheck?.message).toContain('AI-generated drafts');
    expect(completionCheck?.details).toContain('2 draft sections');
    expect(completionCheck?.details).toContain('Review the AI-generated content');
  });

  it('should mark files without placeholders or drafts as complete', async () => {
    await writeFile(
      join(tempDir, 'NEXT-TASKS.md'),
      '# NEXT: Upcoming Tasks\n\n## Sprint Goals\n\nReal goal 1\nReal goal 2\n'
    );

    const result = await validateProject(tempDir);

    const completionCheck = result.checks.find(
      (c) => c.name === 'Completion: NEXT-TASKS.md'
    );

    expect(completionCheck).toBeDefined();
    expect(completionCheck?.passed).toBe(true);
    expect(completionCheck?.level).toBe('info');
    expect(completionCheck?.message).toContain('complete and reviewed');
  });

  it('should prioritize placeholder detection over AI-DRAFT detection', async () => {
    // File with both placeholders and AI-DRAFT markers
    await writeFile(
      join(tempDir, 'NEXT-TASKS.md'),
      '# Project: [Project Name]\n\n<!-- AI-DRAFT -->\n\nContent here\n'
    );

    const result = await validateProject(tempDir);

    const completionCheck = result.checks.find(
      (c) => c.name === 'Completion: NEXT-TASKS.md'
    );

    expect(completionCheck).toBeDefined();
    expect(completionCheck?.passed).toBe(false);
    expect(completionCheck?.level).toBe('error'); // Placeholder is higher priority
    expect(completionCheck?.message).toContain('incomplete');
  });

  it('should detect AI-DRAFT markers with various formats', async () => {
    await writeFile(
      join(tempDir, 'NEXT-TASKS.md'),
      '# NEXT: Upcoming Tasks\n\n<!-- AI-DRAFT -->\n<!-- AI-DRAFT: Review this -->\n<!--AI-DRAFT: Another one-->\n'
    );

    const result = await validateProject(tempDir);

    const completionCheck = result.checks.find(
      (c) => c.name === 'Completion: NEXT-TASKS.md'
    );

    expect(completionCheck).toBeDefined();
    expect(completionCheck?.passed).toBe(true);
    expect(completionCheck?.level).toBe('warning');
    expect(completionCheck?.details).toContain('3 draft sections');
  });

  it('should provide helpful messages for incomplete files', async () => {
    // Ensure directory exists first
    await mkdir(join(tempDir, 'docs/core'), { recursive: true });
    await writeFile(
      join(tempDir, 'docs/core/ARCHITECTURE.md'),
      '# Architecture\n\n[System Description]\n'
    );

    const result = await validateProject(tempDir);

    const completionCheck = result.checks.find(
      (c) => c.name === 'Completion: docs/core/ARCHITECTURE.md'
    );

    expect(completionCheck?.details).toContain('cortex-tms prompt bootstrap');
    expect(completionCheck?.details).toContain('populate this file');
  });

  it('should provide helpful messages for draft files', async () => {
    await mkdir(join(tempDir, 'docs/core'), { recursive: true });
    await writeFile(
      join(tempDir, 'docs/core/ARCHITECTURE.md'),
      '# Architecture\n\n<!-- AI-DRAFT -->\n\nSystem description here\n'
    );

    const result = await validateProject(tempDir);

    const completionCheck = result.checks.find(
      (c) => c.name === 'Completion: docs/core/ARCHITECTURE.md'
    );

    expect(completionCheck?.details).toContain('Review the AI-generated content');
    expect(completionCheck?.details).toContain('remove the <!-- AI-DRAFT --> markers');
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
