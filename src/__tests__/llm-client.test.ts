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
