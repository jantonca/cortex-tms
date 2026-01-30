/**
 * Tests for API key sanitization utilities
 *
 * Ensures that API keys and sensitive data are properly redacted
 * from error messages, logs, and user-facing output.
 */

import { describe, it, expect } from 'vitest';
import { sanitizeApiKey, sanitizeError, sanitizeObject } from '../utils/sanitize.js';

describe('sanitizeApiKey', () => {
  it('should redact OpenAI API keys (sk-...)', () => {
    const text = 'Error: Invalid API key sk-abc123def456ghi789';
    const result = sanitizeApiKey(text);
    expect(result).toBe('Error: Invalid API key [REDACTED_API_KEY]');
    expect(result).not.toContain('sk-abc123');
  });

  it('should redact Anthropic API keys (sk-ant-...)', () => {
    const text = 'Authentication failed with key sk-ant-api03-xyz789_ABC-123';
    const result = sanitizeApiKey(text);
    expect(result).toBe('Authentication failed with key [REDACTED_API_KEY]');
    expect(result).not.toContain('sk-ant-');
  });

  it('should redact Bearer tokens', () => {
    const text = 'Authorization: Bearer sk-abc123def456ghi789jkl012';
    const result = sanitizeApiKey(text);
    expect(result).toBe('Authorization: Bearer [REDACTED_API_KEY]');
    expect(result).not.toContain('sk-abc123def456');
  });

  it('should redact Authorization header values', () => {
    const text = 'Authorization: sk-abc123def456ghi789jkl012mno345';
    const result = sanitizeApiKey(text);
    expect(result).toBe('Authorization: [REDACTED_API_KEY]');
  });

  it('should redact x-api-key header values', () => {
    const text = 'x-api-key: sk-ant-api03-xyz789_ABC-123';
    const result = sanitizeApiKey(text);
    expect(result).toBe('x-api-key: [REDACTED_API_KEY]');
  });

  it('should handle multiple API keys in the same string', () => {
    const text = 'OpenAI key: sk-abc123def456ghi789 and Anthropic key: sk-ant-xyz789abc123';
    const result = sanitizeApiKey(text);
    expect(result).toBe('OpenAI key: [REDACTED_API_KEY] and Anthropic key: [REDACTED_API_KEY]');
    expect(result).not.toContain('sk-abc123def456');
    expect(result).not.toContain('sk-ant-xyz789');
  });

  it('should not modify strings without API keys', () => {
    const text = 'This is a normal error message without sensitive data';
    const result = sanitizeApiKey(text);
    expect(result).toBe(text);
  });

  it('should handle empty strings', () => {
    expect(sanitizeApiKey('')).toBe('');
  });

  it('should handle real-world OpenAI error responses', () => {
    const errorResponse = JSON.stringify({
      error: {
        message: 'Invalid API key provided: sk-proj-abc123def456ghi789',
        type: 'invalid_request_error',
        code: 'invalid_api_key',
      },
    });
    const result = sanitizeApiKey(errorResponse);
    expect(result).toContain('[REDACTED_API_KEY]');
    expect(result).not.toContain('sk-proj-abc123');
  });

  it('should handle real-world Anthropic error responses', () => {
    const errorResponse = `{
      "error": {
        "type": "authentication_error",
        "message": "Invalid API key: sk-ant-api03-xyz789_ABC-123DEF"
      }
    }`;
    const result = sanitizeApiKey(errorResponse);
    expect(result).toContain('[REDACTED_API_KEY]');
    expect(result).not.toContain('sk-ant-api03');
  });
});

describe('sanitizeError', () => {
  it('should sanitize Error objects', () => {
    const error = new Error('API request failed with key sk-abc123def456');
    const result = sanitizeError(error);
    expect(result).toBe('API request failed with key [REDACTED_API_KEY]');
    expect(result).not.toContain('sk-abc123');
  });

  it('should sanitize error message strings', () => {
    const message = 'Authentication failed: sk-ant-api03-xyz789';
    const result = sanitizeError(message);
    expect(result).toBe('Authentication failed: [REDACTED_API_KEY]');
  });

  it('should handle errors without API keys', () => {
    const error = new Error('File not found');
    const result = sanitizeError(error);
    expect(result).toBe('File not found');
  });
});

describe('sanitizeObject', () => {
  it('should sanitize string values in objects', () => {
    const obj = {
      message: 'Error with key sk-abc123def456',
      status: 401,
    };
    const result = sanitizeObject(obj);
    expect(result.message).toBe('Error with key [REDACTED_API_KEY]');
    expect(result.status).toBe(401);
  });

  it('should redact apiKey fields entirely', () => {
    const obj = {
      apiKey: 'sk-abc123def456ghi789',
      provider: 'openai',
    };
    const result = sanitizeObject(obj);
    expect(result.apiKey).toBe('[REDACTED_API_KEY]');
    expect(result.provider).toBe('openai');
  });

  it('should redact api_key fields entirely', () => {
    const obj = {
      api_key: 'sk-ant-api03-xyz789',
      model: 'claude-3-opus',
    };
    const result = sanitizeObject(obj);
    expect(result.api_key).toBe('[REDACTED_API_KEY]');
    expect(result.model).toBe('claude-3-opus');
  });

  it('should redact token fields entirely', () => {
    const obj = {
      token: 'abc123def456',
      userId: '12345',
    };
    const result = sanitizeObject(obj);
    expect(result.token).toBe('[REDACTED_API_KEY]');
    expect(result.userId).toBe('12345');
  });

  it('should redact secret fields entirely', () => {
    const obj = {
      secret: 'my-secret-value',
      name: 'test',
    };
    const result = sanitizeObject(obj);
    expect(result.secret).toBe('[REDACTED_API_KEY]');
    expect(result.name).toBe('test');
  });

  it('should redact password fields entirely', () => {
    const obj = {
      password: 'my-password',
      username: 'john',
    };
    const result = sanitizeObject(obj);
    expect(result.password).toBe('[REDACTED_API_KEY]');
    expect(result.username).toBe('john');
  });

  it('should sanitize nested objects', () => {
    const obj = {
      config: {
        apiKey: 'sk-abc123def456ghi789',
        endpoint: 'https://api.openai.com',
      },
      error: {
        message: 'Failed with key sk-def456ghi789jkl012',
      },
    };
    const result = sanitizeObject(obj);
    expect(result.config.apiKey).toBe('[REDACTED_API_KEY]');
    expect(result.config.endpoint).toBe('https://api.openai.com');
    expect(result.error.message).toBe('Failed with key [REDACTED_API_KEY]');
  });

  it('should sanitize arrays', () => {
    const obj = {
      errors: [
        'Error 1 with key sk-abc123def456ghi789',
        'Error 2 with key sk-def456ghi789jkl012',
      ],
    };
    const result = sanitizeObject(obj);
    expect(result.errors[0]).toBe('Error 1 with key [REDACTED_API_KEY]');
    expect(result.errors[1]).toBe('Error 2 with key [REDACTED_API_KEY]');
  });

  it('should handle arrays of objects', () => {
    const obj = {
      requests: [
        { apiKey: 'sk-abc123', status: 'failed' },
        { apiKey: 'sk-def456', status: 'success' },
      ],
    };
    const result = sanitizeObject(obj);
    expect(result.requests[0].apiKey).toBe('[REDACTED_API_KEY]');
    expect(result.requests[1].apiKey).toBe('[REDACTED_API_KEY]');
    expect(result.requests[0].status).toBe('failed');
    expect(result.requests[1].status).toBe('success');
  });

  it('should handle null and undefined values', () => {
    const obj = {
      nullValue: null,
      undefinedValue: undefined,
      message: 'test',
    };
    const result = sanitizeObject(obj);
    expect(result.nullValue).toBeNull();
    expect(result.undefinedValue).toBeUndefined();
    expect(result.message).toBe('test');
  });

  it('should preserve primitive values', () => {
    expect(sanitizeObject(42)).toBe(42);
    expect(sanitizeObject(true)).toBe(true);
    expect(sanitizeObject(null)).toBeNull();
    expect(sanitizeObject(undefined)).toBeUndefined();
  });

  it('should handle deeply nested structures', () => {
    const obj = {
      level1: {
        level2: {
          level3: {
            apiKey: 'sk-abc123',
            data: 'test',
          },
        },
      },
    };
    const result = sanitizeObject(obj);
    expect(result.level1.level2.level3.apiKey).toBe('[REDACTED_API_KEY]');
    expect(result.level1.level2.level3.data).toBe('test');
  });

  it('should sanitize realistic error context objects', () => {
    const errorContext = {
      provider: 'anthropic',
      model: 'claude-sonnet-4-5-20250929',
      apiKey: 'sk-ant-api03-xyz789',
      error: 'Request failed with key sk-ant-api03-xyz789',
      timestamp: '2026-01-30T12:00:00Z',
    };
    const result = sanitizeObject(errorContext);
    expect(result.apiKey).toBe('[REDACTED_API_KEY]');
    expect(result.error).toBe('Request failed with key [REDACTED_API_KEY]');
    expect(result.provider).toBe('anthropic');
    expect(result.model).toBe('claude-sonnet-4-5-20250929');
    expect(result.timestamp).toBe('2026-01-30T12:00:00Z');
  });
});

describe('Integration: Error Handling Flow', () => {
  it('should prevent API key leaks in error messages', () => {
    // Simulate an API error response that includes the API key
    const apiErrorResponse = JSON.stringify({
      error: {
        message: 'Invalid authentication: sk-ant-api03-leaked-key-12345',
        type: 'authentication_error',
      },
    });

    // Sanitize the error before throwing
    const sanitized = sanitizeError(apiErrorResponse);

    // Verify the API key is redacted
    expect(sanitized).not.toContain('sk-ant-api03');
    expect(sanitized).toContain('[REDACTED_API_KEY]');
  });

  it('should prevent API key leaks in error context objects', () => {
    // Simulate error context that might be displayed to the user
    const errorContext = {
      command: 'review',
      apiKey: 'sk-abc123def456',
      error: 'API request failed with key sk-abc123def456',
    };

    // Sanitize the context before display
    const sanitized = sanitizeObject(errorContext);

    // Verify API keys are redacted
    expect(sanitized.apiKey).toBe('[REDACTED_API_KEY]');
    expect(sanitized.error).not.toContain('sk-abc123');
    expect(sanitized.error).toContain('[REDACTED_API_KEY]');
    expect(sanitized.command).toBe('review'); // Non-sensitive data preserved
  });
});
