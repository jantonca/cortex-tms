/**
 * Unit Tests - LLM Client
 *
 * Tests the LLM client with mocked API responses
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callLLM, getApiKey, type LLMConfig, type LLMMessage } from '../utils/llm-client.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('LLM Client - OpenAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully call OpenAI API', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Test response from OpenAI',
          },
        },
      ],
      usage: {
        prompt_tokens: 100,
        completion_tokens: 50,
        total_tokens: 150,
      },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const config: LLMConfig = {
      provider: 'openai',
      apiKey: 'test-key',
    };

    const messages: LLMMessage[] = [
      { role: 'system', content: 'You are a helpful assistant' },
      { role: 'user', content: 'Test message' },
    ];

    const response = await callLLM(config, messages);

    expect(response.content).toBe('Test response from OpenAI');
    expect(response.usage?.totalTokens).toBe(150);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-key',
        }),
      })
    );
  });

  it('should use custom model when provided', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'Response' } }],
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const config: LLMConfig = {
      provider: 'openai',
      apiKey: 'test-key',
      model: 'gpt-4o',
    };

    await callLLM(config, [{ role: 'user', content: 'Test' }]);

    const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);
    expect(requestBody.model).toBe('gpt-4o');
  });

  it('should throw error on API failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Invalid API key',
    });

    const config: LLMConfig = {
      provider: 'openai',
      apiKey: 'invalid-key',
    };

    await expect(
      callLLM(config, [{ role: 'user', content: 'Test' }])
    ).rejects.toThrow('OpenAI API error: 401');
  });

  it('should throw error on invalid response', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [] }), // Missing required fields
    });

    const config: LLMConfig = {
      provider: 'openai',
      apiKey: 'test-key',
    };

    await expect(
      callLLM(config, [{ role: 'user', content: 'Test' }])
    ).rejects.toThrow('Invalid OpenAI response');
  });
});

describe('LLM Client - Anthropic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully call Anthropic API', async () => {
    const mockResponse = {
      content: [
        {
          text: 'Test response from Anthropic',
        },
      ],
      usage: {
        input_tokens: 120,
        output_tokens: 80,
      },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const config: LLMConfig = {
      provider: 'anthropic',
      apiKey: 'test-key',
    };

    const messages: LLMMessage[] = [
      { role: 'system', content: 'You are a code reviewer' },
      { role: 'user', content: 'Review this code' },
    ];

    const response = await callLLM(config, messages);

    expect(response.content).toBe('Test response from Anthropic');
    expect(response.usage?.totalTokens).toBe(200); // 120 + 80
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-api-key': 'test-key',
        }),
      })
    );
  });

  it('should separate system message from conversation', async () => {
    const mockResponse = {
      content: [{ text: 'Response' }],
      usage: { input_tokens: 10, output_tokens: 5 },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const config: LLMConfig = {
      provider: 'anthropic',
      apiKey: 'test-key',
    };

    const messages: LLMMessage[] = [
      { role: 'system', content: 'System prompt' },
      { role: 'user', content: 'User message' },
    ];

    await callLLM(config, messages);

    const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);

    expect(requestBody.system).toBe('System prompt');
    expect(requestBody.messages).toHaveLength(1);
    expect(requestBody.messages[0].role).toBe('user');
  });

  it('should use custom model when provided', async () => {
    const mockResponse = {
      content: [{ text: 'Response' }],
      usage: { input_tokens: 10, output_tokens: 5 },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const config: LLMConfig = {
      provider: 'anthropic',
      apiKey: 'test-key',
      model: 'claude-opus-4-5-20251101',
    };

    await callLLM(config, [{ role: 'user', content: 'Test' }]);

    const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);
    expect(requestBody.model).toBe('claude-opus-4-5-20251101');
  });

  it('should throw error on API failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: async () => 'Forbidden',
    });

    const config: LLMConfig = {
      provider: 'anthropic',
      apiKey: 'invalid-key',
    };

    await expect(
      callLLM(config, [{ role: 'user', content: 'Test' }])
    ).rejects.toThrow('Anthropic API error: 403');
  });
});

describe('LLM Client - API Key Management', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should get OpenAI API key from environment', () => {
    process.env.OPENAI_API_KEY = 'sk-test-openai';
    expect(getApiKey('openai')).toBe('sk-test-openai');
  });

  it('should get Anthropic API key from environment', () => {
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
    expect(getApiKey('anthropic')).toBe('sk-ant-test');
  });

  it('should return null when API key not set', () => {
    delete process.env.OPENAI_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;

    expect(getApiKey('openai')).toBeNull();
    expect(getApiKey('anthropic')).toBeNull();
  });
});

describe('LLM Client - Unsupported Provider', () => {
  it('should throw error for unsupported provider', async () => {
    const config = {
      provider: 'unsupported' as any,
      apiKey: 'test-key',
    };

    await expect(
      callLLM(config, [{ role: 'user', content: 'Test' }])
    ).rejects.toThrow('Unsupported provider');
  });
});

describe('LLM Client - Retry Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should retry on rate limit error (429) and succeed', async () => {
    const mockSuccessResponse = {
      choices: [{ message: { content: 'Success after retry' } }],
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
    };

    // First call fails with 429, second succeeds
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => 'Rate limit exceeded',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

    const config: LLMConfig = {
      provider: 'openai',
      apiKey: 'test-key',
      retryConfig: {
        maxRetries: 3,
        initialDelayMs: 10, // Very short delay for tests
      },
    };

    const response = await callLLM(config, [{ role: 'user', content: 'Test' }]);

    expect(response.content).toBe('Success after retry');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should retry on server error (503) and succeed', async () => {
    const mockSuccessResponse = {
      content: [{ text: 'Success after retry' }],
      usage: { input_tokens: 10, output_tokens: 5 },
    };

    // First call fails with 503, second succeeds
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        text: async () => 'Service temporarily unavailable',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

    const config: LLMConfig = {
      provider: 'anthropic',
      apiKey: 'test-key',
      retryConfig: {
        maxRetries: 3,
        initialDelayMs: 10, // Very short delay for tests
      },
    };

    const response = await callLLM(config, [{ role: 'user', content: 'Test' }]);

    expect(response.content).toBe('Success after retry');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should NOT retry on authentication error (401)', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Invalid API key',
    });

    const config: LLMConfig = {
      provider: 'openai',
      apiKey: 'invalid-key',
      retryConfig: {
        maxRetries: 3,
      },
    };

    await expect(
      callLLM(config, [{ role: 'user', content: 'Test' }])
    ).rejects.toThrow('OpenAI API error: 401');

    // Should only be called once (no retry)
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should NOT retry on client error (400)', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'Bad request',
    });

    const config: LLMConfig = {
      provider: 'anthropic',
      apiKey: 'test-key',
      retryConfig: {
        maxRetries: 3,
      },
    };

    await expect(
      callLLM(config, [{ role: 'user', content: 'Test' }])
    ).rejects.toThrow('Anthropic API error: 400');

    // Should only be called once (no retry)
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should exhaust retries and throw final error', async () => {
    // All attempts fail with 503
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 503,
      text: async () => 'Service unavailable',
    });

    const config: LLMConfig = {
      provider: 'openai',
      apiKey: 'test-key',
      retryConfig: {
        maxRetries: 2, // Will try 3 times total (initial + 2 retries)
        initialDelayMs: 10, // Very short delay for tests
      },
    };

    await expect(
      callLLM(config, [{ role: 'user', content: 'Test' }])
    ).rejects.toThrow('OpenAI API error: 503');

    // Should be called 3 times (initial + 2 retries)
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('should use exponential backoff for delays', async () => {
    const mockSuccessResponse = {
      choices: [{ message: { content: 'Success' } }],
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
    };

    // Fail twice, then succeed on third attempt
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => 'Rate limit',
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => 'Rate limit',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

    const config: LLMConfig = {
      provider: 'openai',
      apiKey: 'test-key',
      retryConfig: {
        maxRetries: 3,
        initialDelayMs: 10, // Very short for tests
        backoffMultiplier: 2,
        maxDelayMs: 10000,
      },
    };

    const response = await callLLM(config, [{ role: 'user', content: 'Test' }]);

    expect(response.content).toBe('Success');
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('should respect maxDelayMs cap', async () => {
    // All attempts fail
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 503,
      text: async () => 'Server error',
    });

    const config: LLMConfig = {
      provider: 'openai',
      apiKey: 'test-key',
      retryConfig: {
        maxRetries: 3,
        initialDelayMs: 10,
        backoffMultiplier: 10, // Very high multiplier
        maxDelayMs: 50, // Cap at 50ms for tests
      },
    };

    await expect(
      callLLM(config, [{ role: 'user', content: 'Test' }])
    ).rejects.toThrow();

    // Should retry maxRetries times
    expect(global.fetch).toHaveBeenCalledTimes(4); // initial + 3 retries
  });

  it('should use default retry config when not provided', async () => {
    const mockSuccessResponse = {
      choices: [{ message: { content: 'Success' } }],
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
    };

    // Fail once, then succeed
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => 'Rate limit',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

    const config: LLMConfig = {
      provider: 'openai',
      apiKey: 'test-key',
      // No retryConfig provided - should use defaults
    };

    const response = await callLLM(config, [{ role: 'user', content: 'Test' }]);

    expect(response.content).toBe('Success');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
