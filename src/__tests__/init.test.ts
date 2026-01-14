/**
 * Integration Tests - Init Command
 *
 * Tests the init command's scope-based template filtering and file copying.
 * These tests use temporary directories to ensure safe, isolated testing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'path';
import {
  createTempDir,
  cleanupTempDir,
  fileExists,
} from './utils/temp-dir.js';
import {
  copyTemplates,
  getTemplatesDir,
  generateReplacements,
  replacePlaceholders,
} from '../utils/templates.js';
import { createConfigFromScope, saveConfig, loadConfig } from '../utils/config.js';

describe('Init Command - Scope Filtering', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should copy exactly 2 files when scope is "nano"', async () => {
    const templatesDir = getTemplatesDir();
    const replacements = generateReplacements('test-project');

    const result = await copyTemplates(templatesDir, tempDir, replacements, {
      scope: 'nano',
      overwrite: true,
    });

    expect(result.copied).toBe(2);
    expect(result.skipped).toBe(0);

    // Verify mandatory files exist
    expect(await fileExists(join(tempDir, 'NEXT-TASKS.md'))).toBe(true);
    expect(await fileExists(join(tempDir, 'CLAUDE.md'))).toBe(true);

    // Verify optional files are NOT copied
    expect(await fileExists(join(tempDir, 'FUTURE-ENHANCEMENTS.md'))).toBe(false);
    expect(await fileExists(join(tempDir, 'docs/core/ARCHITECTURE.md'))).toBe(false);
  });

  it('should copy exactly 9 files when scope is "standard"', async () => {
    const templatesDir = getTemplatesDir();
    const replacements = generateReplacements('test-project');

    const result = await copyTemplates(templatesDir, tempDir, replacements, {
      scope: 'standard',
      overwrite: true,
    });

    expect(result.copied).toBe(10);
    expect(result.skipped).toBe(0);

    // Verify mandatory files
    expect(await fileExists(join(tempDir, 'NEXT-TASKS.md'))).toBe(true);
    expect(await fileExists(join(tempDir, 'CLAUDE.md'))).toBe(true);
    expect(await fileExists(join(tempDir, '.github/copilot-instructions.md'))).toBe(true);

    // Verify optional files
    expect(await fileExists(join(tempDir, 'PROMPTS.md'))).toBe(true);
    expect(await fileExists(join(tempDir, 'FUTURE-ENHANCEMENTS.md'))).toBe(true);
    expect(await fileExists(join(tempDir, 'docs/core/ARCHITECTURE.md'))).toBe(true);
    expect(await fileExists(join(tempDir, 'docs/core/PATTERNS.md'))).toBe(true);
  });

  it('should copy exactly 12 files when scope is "enterprise"', async () => {
    const templatesDir = getTemplatesDir();
    const replacements = generateReplacements('test-project');

    const result = await copyTemplates(templatesDir, tempDir, replacements, {
      scope: 'enterprise',
      overwrite: true,
    });

    expect(result.copied).toBe(12);
    expect(result.skipped).toBe(0);

    // Verify enterprise-specific files
    expect(await fileExists(join(tempDir, 'docs/core/GLOSSARY.md'))).toBe(true);
    expect(await fileExists(join(tempDir, 'docs/core/SCHEMA.md'))).toBe(true);
  });

  it('should never copy example files regardless of scope', async () => {
    const templatesDir = getTemplatesDir();
    const replacements = generateReplacements('test-project');

    // Test all scopes
    for (const scope of ['nano', 'standard', 'enterprise'] as const) {
      const scopeTempDir = await createTempDir();

      await copyTemplates(templatesDir, scopeTempDir, replacements, {
        scope,
        overwrite: true,
      });

      // Verify examples directory is never copied
      expect(await fileExists(join(scopeTempDir, 'examples'))).toBe(false);

      await cleanupTempDir(scopeTempDir);
    }
  });

  it('should skip existing files when overwrite is false', async () => {
    const templatesDir = getTemplatesDir();
    const replacements = generateReplacements('test-project');

    // First copy
    const result1 = await copyTemplates(templatesDir, tempDir, replacements, {
      scope: 'nano',
      overwrite: false,
    });

    expect(result1.copied).toBe(2);
    expect(result1.skipped).toBe(0);

    // Second copy without overwrite
    const result2 = await copyTemplates(templatesDir, tempDir, replacements, {
      scope: 'nano',
      overwrite: false,
    });

    expect(result2.copied).toBe(0);
    expect(result2.skipped).toBe(2);
  });

  it('should overwrite existing files when overwrite is true', async () => {
    const templatesDir = getTemplatesDir();
    const replacements = generateReplacements('test-project');

    // First copy
    await copyTemplates(templatesDir, tempDir, replacements, {
      scope: 'nano',
      overwrite: true,
    });

    // Second copy with overwrite
    const result2 = await copyTemplates(templatesDir, tempDir, replacements, {
      scope: 'nano',
      overwrite: true,
    });

    expect(result2.copied).toBe(2);
    expect(result2.skipped).toBe(0);
  });
});

describe('Init Command - Placeholder Replacement', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should correctly generate replacement map with project name', async () => {
    const replacements = generateReplacements('My Awesome Project');

    expect(replacements['Project Name']).toBe('My Awesome Project');
    expect(replacements['project-name']).toBe('my-awesome-project');
    expect(replacements['Description']).toBe('A project powered by Cortex TMS');
  });

  it('should replace placeholders in template content', async () => {
    const content = 'Project: [Project Name] (slug: [project-name])\n[Description]';
    const replacements = generateReplacements('My Awesome Project', 'A cool project');

    const result = replacePlaceholders(content, replacements);

    expect(result).toContain('My Awesome Project');
    expect(result).toContain('my-awesome-project');
    expect(result).toContain('A cool project');
    expect(result).not.toContain('[Project Name]');
    expect(result).not.toContain('[project-name]');
    expect(result).not.toContain('[Description]');
  });

  it('should handle projects with special characters', async () => {
    const projectName = 'Test@Project#123!!!';
    const replacements = generateReplacements(projectName);

    expect(replacements['project-name']).toBe('test-project-123');
  });

  it('should replace [Description] when provided', async () => {
    const content = 'This is [Description] test';
    const replacements = generateReplacements('Test', 'A cool project');

    const result = replacePlaceholders(content, replacements);
    expect(result).toBe('This is A cool project test');
  });

  it('should use default description when not provided', async () => {
    const replacements = generateReplacements('Test');

    expect(replacements.Description).toBe('A project powered by Cortex TMS');
  });
});

describe('Init Command - Configuration Generation', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should create .cortexrc with correct scope', async () => {
    const config = createConfigFromScope('nano', 'test-project');
    await saveConfig(tempDir, config);

    const loadedConfig = await loadConfig(tempDir);
    expect(loadedConfig).not.toBeNull();
    expect(loadedConfig?.scope).toBe('nano');
    expect(loadedConfig?.metadata?.projectName).toBe('test-project');
  });

  it('should set correct line limits for nano scope', async () => {
    const config = createConfigFromScope('nano');

    expect(config.limits?.['NEXT-TASKS.md']).toBe(100);
  });

  it('should set correct line limits for enterprise scope', async () => {
    const config = createConfigFromScope('enterprise');

    expect(config.limits?.['NEXT-TASKS.md']).toBe(300);
    expect(config.limits?.['ARCHITECTURE.md']).toBe(800);
  });

  it('should include creation timestamp in metadata', async () => {
    const config = createConfigFromScope('standard', 'test-project');

    expect(config.metadata?.created).toBeDefined();
    expect(new Date(config.metadata!.created!).getTime()).toBeLessThanOrEqual(Date.now());
  });
});
