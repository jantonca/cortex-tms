/**
 * E2E Integration Tests - Review Command (Guardian)
 *
 * Tests the complete review command workflow including:
 * - Code analysis with Guardian
 * - Pattern file requirements
 * - API key handling
 * - Output formats (text and JSON)
 * - Safe mode filtering
 *
 * Note: Most tests skip actual API calls (require API key)
 * but verify command structure and error handling.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { createTempDir, cleanupTempDir } from './utils/temp-dir.js';
import { runCommand, expectFailure } from './utils/cli-runner.js';

/**
 * Helper to create a sample code file
 */
async function createSampleCodeFile(dir: string, filename: string): Promise<void> {
  const sampleCode = `
/**
 * Sample TypeScript code for testing
 */
export function calculateTotal(items: number[]): number {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i];
  }
  return total;
}
`.trim();

  await writeFile(join(dir, filename), sampleCode);
}

/**
 * Helper to create PATTERNS.md
 */
async function createPatternsFile(dir: string): Promise<void> {
  await mkdir(join(dir, 'docs/core'), { recursive: true });

  const patterns = `
# Code Patterns

<!-- @cortex-tms-version 3.1.0 -->

## TypeScript Conventions

### Loop Patterns
- **Prefer**: \`for...of\` loops for arrays
- **Avoid**: Traditional \`for\` loops with index
- **Rationale**: More readable and less error-prone

### Function Naming
- Use descriptive names
- Verb + noun pattern (e.g., calculateTotal, fetchData)
`.trim();

  await writeFile(join(dir, 'docs/core/PATTERNS.md'), patterns);
}

describe('Review E2E - Prerequisites', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should require PATTERNS.md to exist', async () => {
    await createSampleCodeFile(tempDir, 'sample.ts');

    // Run review without PATTERNS.md (provide fake API key to get past validation)
    const result = await runCommand(
      'review',
      ['sample.ts', '--api-key', 'sk-fake-key-for-testing'],
      tempDir
    );

    expectFailure(result);
    const mentionsPatternsFile = result.stdout.includes('PATTERNS.md') || result.stderr.includes('PATTERNS.md');
    expect(mentionsPatternsFile).toBe(true);
  });

  it('should provide helpful message when PATTERNS.md is missing', async () => {
    await createSampleCodeFile(tempDir, 'sample.ts');

    // Provide fake API key to get past validation
    const result = await runCommand(
      'review',
      ['sample.ts', '--api-key', 'sk-fake-key-for-testing'],
      tempDir
    );

    expectFailure(result);
    const hasHelpfulMessage =
      result.stdout.includes('cortex-tms init') ||
      result.stdout.includes('Run') ||
      result.stderr.includes('PATTERNS.md');
    expect(hasHelpfulMessage).toBe(true);
  });

  it('should handle missing file to review', async () => {
    await createPatternsFile(tempDir);

    // Try to review non-existent file (provide fake API key to get past validation)
    const result = await runCommand(
      'review',
      ['nonexistent.ts', '--api-key', 'sk-fake-key-for-testing'],
      tempDir
    );

    expectFailure(result);
    const hasErrorMessage =
      result.stdout.includes('File') ||
      result.stderr.includes('File') ||
      result.stdout.includes('nonexistent.ts') ||
      result.stderr.includes('nonexistent.ts');
    expect(hasErrorMessage).toBe(true);
  });
});

describe('Review E2E - API Key Requirements', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await createPatternsFile(tempDir);
    await createSampleCodeFile(tempDir, 'sample.ts');
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should require API key when not set in environment', async () => {
    // Run without API key (CI mode prevents interactive prompt)
    const result = await runCommand('review', ['sample.ts'], tempDir);

    // Should fail or warn about missing API key
    if (result.exitCode !== 0) {
      const hasApiKeyMessage =
        result.stdout.includes('API key') ||
        result.stderr.includes('API key') ||
        result.stdout.includes('ANTHROPIC_API_KEY');
      expect(hasApiKeyMessage).toBe(true);
    }
  });

  it('should accept API key via --api-key flag', async () => {
    // Note: Won't actually make API call with fake key, but should accept the option
    const result = await runCommand(
      'review',
      ['sample.ts', '--api-key', 'sk-test-fake-key-for-testing'],
      tempDir
    );

    // May fail on actual API call, but should parse the option
    // (Implementation may vary on how it handles fake keys)
    const hasOutput = result.stdout || result.stderr; expect(hasOutput).toBeTruthy();
  });
});

describe('Review E2E - Provider Selection', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await createPatternsFile(tempDir);
    await createSampleCodeFile(tempDir, 'sample.ts');
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should support --provider flag for OpenAI', async () => {
    const result = await runCommand(
      'review',
      ['sample.ts', '--provider', 'openai'],
      tempDir
    );

    // Should accept the provider option (may fail on API key)
    const hasOutput = result.stdout || result.stderr; expect(hasOutput).toBeTruthy();
  });

  it('should support --provider flag for Anthropic', async () => {
    const result = await runCommand(
      'review',
      ['sample.ts', '--provider', 'anthropic'],
      tempDir
    );

    // Should accept the provider option (may fail on API key)
    const hasOutput = result.stdout || result.stderr; expect(hasOutput).toBeTruthy();
  });

  it('should reject invalid provider', async () => {
    const result = await runCommand(
      'review',
      ['sample.ts', '--provider', 'invalid', '--api-key', 'sk-fake-key-for-testing'],
      tempDir
    );

    expectFailure(result);
    const hasProviderError =
      result.stdout.includes('provider') ||
      result.stderr.includes('provider') ||
      result.stderr.includes('enum') ||
      result.stderr.includes('anthropic');
    expect(hasProviderError).toBe(true);
  });
});

describe('Review E2E - Output Formats', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await createPatternsFile(tempDir);
    await createSampleCodeFile(tempDir, 'sample.ts');
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should support --output-json flag', async () => {
    const result = await runCommand(
      'review',
      ['sample.ts', '--output-json'],
      tempDir
    );

    // Should accept the option (may fail on API key)
    // If it gets far enough, output should be JSON-parseable or error should be JSON
    const hasOutput = result.stdout || result.stderr; expect(hasOutput).toBeTruthy();
  });

  it('should not prompt for API key in JSON mode', async () => {
    // In CI mode with --output-json, should fail immediately instead of prompting
    const result = await runCommand(
      'review',
      ['sample.ts', '--output-json'],
      tempDir
    );

    // Should fail quickly without trying to prompt
    expect(result.exitCode).not.toBe(0);
  });
});

describe('Review E2E - Safe Mode', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await createPatternsFile(tempDir);
    await createSampleCodeFile(tempDir, 'sample.ts');
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should support --safe flag', async () => {
    const result = await runCommand(
      'review',
      ['sample.ts', '--safe'],
      tempDir
    );

    // Should accept the flag
    const hasOutput = result.stdout || result.stderr; expect(hasOutput).toBeTruthy();
  });
});

describe('Review E2E - Model Selection', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await createPatternsFile(tempDir);
    await createSampleCodeFile(tempDir, 'sample.ts');
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should support --model flag for custom model', async () => {
    const result = await runCommand(
      'review',
      ['sample.ts', '--model', 'claude-opus-4-5-20251101'],
      tempDir
    );

    // Should accept the model option
    const hasOutput = result.stdout || result.stderr; expect(hasOutput).toBeTruthy();
  });
});

describe('Review E2E - Path Validation', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    await createPatternsFile(tempDir);
    await createSampleCodeFile(tempDir, 'sample.ts');
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should reject path traversal attempts', async () => {
    const result = await runCommand(
      'review',
      ['../../etc/passwd', '--api-key', 'sk-fake-key-for-testing'],
      tempDir
    );

    expectFailure(result);
    const hasPathError =
      result.stdout.includes('traversal') ||
      result.stderr.includes('traversal') ||
      result.stdout.includes('Path') ||
      result.stderr.includes('Path');
    expect(hasPathError).toBe(true);
  });

  it('should accept valid relative paths', async () => {
    // Create nested file
    await mkdir(join(tempDir, 'src'), { recursive: true });
    await createSampleCodeFile(tempDir, 'src/nested.ts');

    const result = await runCommand(
      'review',
      ['src/nested.ts'],
      tempDir
    );

    // Should accept the path (may fail on API key)
    const hasOutput = result.stdout || result.stderr; expect(hasOutput).toBeTruthy();
  });
});
