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
vi.mock('../utils/llm-client.js', async () => {
  const actual = await vi.importActual('../utils/llm-client.js');
  return {
    ...actual,
    callLLM: vi.fn(async () => ({
      content: JSON.stringify({
        summary: {
          status: 'compliant',
          message: 'Code is compliant with all patterns',
        },
        violations: [],
        positiveObservations: ['Good code structure'],
      }),
      usage: {
        promptTokens: 1000,
        completionTokens: 100,
        totalTokens: 1100,
      },
    })),
    getApiKey: vi.fn(() => 'mock-api-key'),
  };
});

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
    expect(result.output).toContain('Compliant');
    expect(result.output).toContain('Good code structure');
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

describe('Review Command - Safe Mode', () => {
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

  it('should filter violations below 70% confidence in safe mode', async () => {
    const { callLLM } = await import('../utils/llm-client.js');

    // Mock response with mixed confidence violations
    (callLLM as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      content: JSON.stringify({
        summary: {
          status: 'minor_issues',
          message: 'Found 3 violations',
        },
        violations: [
          {
            pattern: 'Pattern 1',
            issue: 'High confidence issue',
            recommendation: 'Fix it',
            severity: 'major',
            confidence: 0.9,
          },
          {
            pattern: 'Pattern 2',
            issue: 'Medium confidence issue',
            recommendation: 'Consider fixing',
            severity: 'minor',
            confidence: 0.6,
          },
          {
            pattern: 'Pattern 3',
            issue: 'Low confidence issue',
            recommendation: 'Maybe fix',
            severity: 'minor',
            confidence: 0.4,
          },
        ],
        positiveObservations: ['Good code structure'],
      }),
      usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
    });

    const { runReviewForTest } = await import('./utils/review-runner.js');

    const result = await runReviewForTest(tempDir, 'test.ts', {
      provider: 'anthropic',
      apiKey: 'test-key',
      safe: true,
    });

    expect(result.success).toBe(true);
    // Should only show the high confidence violation
    expect(result.output).toContain('Pattern 1');
    expect(result.output).toContain('High confidence issue');
    // Should not show low/medium confidence violations
    expect(result.output).not.toContain('Pattern 2');
    expect(result.output).not.toContain('Pattern 3');
  });

  it('should display confidence percentages when present', async () => {
    const { callLLM } = await import('../utils/llm-client.js');

    (callLLM as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      content: JSON.stringify({
        summary: {
          status: 'minor_issues',
          message: 'Found 1 violation',
        },
        violations: [
          {
            pattern: 'Pattern 1',
            issue: 'Issue',
            recommendation: 'Fix',
            severity: 'major',
            confidence: 0.85,
          },
        ],
        positiveObservations: [],
      }),
      usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
    });

    const { runReviewForTest } = await import('./utils/review-runner.js');

    const result = await runReviewForTest(tempDir, 'test.ts', {
      provider: 'anthropic',
      apiKey: 'test-key',
    });

    expect(result.success).toBe(true);
    expect(result.output).toContain('Confidence: 85%');
  });

  it('should update summary when all violations filtered in safe mode', async () => {
    const { callLLM } = await import('../utils/llm-client.js');

    // Mock response with only low confidence violations
    (callLLM as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      content: JSON.stringify({
        summary: {
          status: 'minor_issues',
          message: 'Found 2 violations',
        },
        violations: [
          {
            pattern: 'Pattern 1',
            issue: 'Low confidence issue',
            recommendation: 'Maybe fix',
            severity: 'minor',
            confidence: 0.5,
          },
          {
            pattern: 'Pattern 2',
            issue: 'Another low confidence',
            recommendation: 'Consider',
            severity: 'minor',
            confidence: 0.6,
          },
        ],
        positiveObservations: ['Good structure'],
      }),
      usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
    });

    const { runReviewForTest } = await import('./utils/review-runner.js');

    const result = await runReviewForTest(tempDir, 'test.ts', {
      provider: 'anthropic',
      apiKey: 'test-key',
      safe: true,
    });

    expect(result.success).toBe(true);
    expect(result.output).toContain('Compliant');
    expect(result.output).toContain('No high-confidence violations found');
    expect(result.output).toContain('filtered 2 low-confidence issues');
  });

  it('should work without confidence field (backwards compatibility)', async () => {
    const { callLLM } = await import('../utils/llm-client.js');

    // Mock response without confidence field (defaults to 1.0)
    (callLLM as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      content: JSON.stringify({
        summary: {
          status: 'minor_issues',
          message: 'Found 1 violation',
        },
        violations: [
          {
            pattern: 'Pattern 1',
            issue: 'Issue without confidence',
            recommendation: 'Fix',
            severity: 'major',
          },
        ],
        positiveObservations: [],
      }),
      usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
    });

    const { runReviewForTest } = await import('./utils/review-runner.js');

    const result = await runReviewForTest(tempDir, 'test.ts', {
      provider: 'anthropic',
      apiKey: 'test-key',
      safe: true,
    });

    expect(result.success).toBe(true);
    // Should still show violation (defaults to 100% confidence)
    expect(result.output).toContain('Pattern 1');
  });
});
