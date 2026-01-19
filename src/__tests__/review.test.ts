/**
 * Integration Tests - Review Command
 *
 * Tests the Guardian review command with mocked LLM calls
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { join } from 'path';
import { writeFileSync, mkdirSync } from 'fs';
import {
  createTempDir,
  cleanupTempDir,
} from './utils/temp-dir.js';

// Mock the LLM client
vi.mock('../utils/llm-client.js', () => ({
  callLLM: vi.fn(async () => ({
    content: '# Analysis Result\n\n✅ Code is compliant with all patterns.',
    usage: {
      promptTokens: 1000,
      completionTokens: 100,
      totalTokens: 1100,
    },
  })),
  getApiKey: vi.fn(() => 'mock-api-key'),
}));

describe('Review Command - File Validation', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();

    // Create TMS structure
    const docsDir = join(tempDir, 'docs/core');
    mkdirSync(docsDir, { recursive: true });

    // Create PATTERNS.md
    writeFileSync(
      join(docsDir, 'PATTERNS.md'),
      '# Patterns\n\n## Pattern 1\nUse consistent naming.'
    );

    // Create DOMAIN-LOGIC.md
    writeFileSync(
      join(docsDir, 'DOMAIN-LOGIC.md'),
      '# Domain Logic\n\n## Rule 1\nValidate all inputs.'
    );

    // Create test file to review
    writeFileSync(
      join(tempDir, 'test.ts'),
      'function add(a: number, b: number) { return a + b; }'
    );
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
    vi.clearAllMocks();
  });

  it('should detect missing PATTERNS.md', async () => {
    const tempDir2 = await createTempDir();
    writeFileSync(join(tempDir2, 'test.ts'), 'code');

    // Import here to use mocked modules
    const { runReviewForTest } = await import('./utils/review-runner.js');

    const result = await runReviewForTest(tempDir2, 'test.ts', {
      provider: 'anthropic',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('PATTERNS.md not found');

    await cleanupTempDir(tempDir2);
  });

  it('should detect non-existent file to review', async () => {
    const { runReviewForTest } = await import('./utils/review-runner.js');

    const result = await runReviewForTest(tempDir, 'nonexistent.ts', {
      provider: 'anthropic',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('File not found');
  });

  it('should successfully review file when all requirements met', async () => {
    const { runReviewForTest } = await import('./utils/review-runner.js');
    const { callLLM } = await import('../utils/llm-client.js');

    const result = await runReviewForTest(tempDir, 'test.ts', {
      provider: 'anthropic',
      apiKey: 'test-key',
    });

    expect(result.success).toBe(true);
    expect(result.output).toContain('Analysis Result');
    expect(callLLM).toHaveBeenCalledOnce();
  });

  it('should pass file content to LLM', async () => {
    const { runReviewForTest } = await import('./utils/review-runner.js');
    const { callLLM } = await import('../utils/llm-client.js');

    await runReviewForTest(tempDir, 'test.ts', {
      provider: 'anthropic',
      apiKey: 'test-key',
    });

    const callArgs = (callLLM as ReturnType<typeof vi.fn>).mock.calls[0];
    const messages = callArgs[1];

    // Should have system and user messages
    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe('system');
    expect(messages[1].role).toBe('user');

    // User message should contain the code
    expect(messages[1].content).toContain('function add');
  });

  it('should include PATTERNS.md in system prompt', async () => {
    const { runReviewForTest } = await import('./utils/review-runner.js');
    const { callLLM } = await import('../utils/llm-client.js');

    await runReviewForTest(tempDir, 'test.ts', {
      provider: 'anthropic',
      apiKey: 'test-key',
    });

    const callArgs = (callLLM as ReturnType<typeof vi.fn>).mock.calls[0];
    const systemMessage = callArgs[1][0].content;

    expect(systemMessage).toContain('PATTERNS.md');
    expect(systemMessage).toContain('Pattern 1');
    expect(systemMessage).toContain('consistent naming');
  });

  it('should include DOMAIN-LOGIC.md in system prompt when present', async () => {
    const { runReviewForTest } = await import('./utils/review-runner.js');
    const { callLLM } = await import('../utils/llm-client.js');

    await runReviewForTest(tempDir, 'test.ts', {
      provider: 'anthropic',
      apiKey: 'test-key',
    });

    const callArgs = (callLLM as ReturnType<typeof vi.fn>).mock.calls[0];
    const systemMessage = callArgs[1][0].content;

    expect(systemMessage).toContain('DOMAIN-LOGIC.md');
    expect(systemMessage).toContain('Rule 1');
    expect(systemMessage).toContain('Validate all inputs');
  });

  it('should use specified provider', async () => {
    const { runReviewForTest } = await import('./utils/review-runner.js');
    const { callLLM } = await import('../utils/llm-client.js');

    await runReviewForTest(tempDir, 'test.ts', {
      provider: 'openai',
      apiKey: 'test-key',
    });

    const callArgs = (callLLM as ReturnType<typeof vi.fn>).mock.calls[0];
    const config = callArgs[0];

    expect(config.provider).toBe('openai');
  });

  it('should use custom model when specified', async () => {
    const { runReviewForTest } = await import('./utils/review-runner.js');
    const { callLLM } = await import('../utils/llm-client.js');

    await runReviewForTest(tempDir, 'test.ts', {
      provider: 'anthropic',
      apiKey: 'test-key',
      model: 'claude-opus-4-5-20251101',
    });

    const callArgs = (callLLM as ReturnType<typeof vi.fn>).mock.calls[0];
    const config = callArgs[0];

    expect(config.model).toBe('claude-opus-4-5-20251101');
  });
});

describe('Review Command - Error Handling', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();

    // Create minimal TMS structure
    const docsDir = join(tempDir, 'docs/core');
    mkdirSync(docsDir, { recursive: true });
    writeFileSync(join(docsDir, 'PATTERNS.md'), '# Patterns');
    writeFileSync(join(tempDir, 'test.ts'), 'code');
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
    vi.clearAllMocks();
  });

  it('should handle LLM API errors gracefully', async () => {
    const { callLLM } = await import('../utils/llm-client.js');
    (callLLM as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('API rate limit exceeded')
    );

    const { runReviewForTest } = await import('./utils/review-runner.js');

    const result = await runReviewForTest(tempDir, 'test.ts', {
      provider: 'anthropic',
      apiKey: 'test-key',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('rate limit');
  });
});
