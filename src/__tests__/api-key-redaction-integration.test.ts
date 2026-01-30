/**
 * Integration test for API key redaction (AUDIT-6)
 *
 * Verifies that API keys are properly sanitized in all error paths
 * to prevent accidental exposure in logs and error messages.
 */

import { describe, it, expect } from 'vitest';
import { formatError, ValidationError } from '../utils/errors.js';
import { sanitizeError } from '../utils/sanitize.js';

describe('API Key Redaction - Integration', () => {
  it('should redact API keys from ValidationError messages', () => {
    const error = new ValidationError(
      'API request failed with key sk-ant-api03-xyz789abc123def456'
    );
    const formatted = formatError(error);

    // Verify API key is redacted in formatted error
    expect(formatted).toContain('[REDACTED_API_KEY]');
    expect(formatted).not.toContain('sk-ant-api03');
    expect(formatted).not.toContain('xyz789abc123');
  });

  it('should redact API keys from error context', () => {
    const error = new ValidationError('Authentication failed', {
      provider: 'anthropic',
      apiKey: 'sk-ant-api03-secretkey123',
      error: 'Invalid key: sk-ant-api03-secretkey123',
    });
    const formatted = formatError(error);

    // Verify API keys are redacted in both field name and error message
    expect(formatted).toContain('apiKey=[REDACTED_API_KEY]');
    expect(formatted).toContain('error=Invalid key: [REDACTED_API_KEY]');
    expect(formatted).not.toContain('secretkey123');
  });

  it('should redact API keys from LLM error responses', () => {
    // Simulate an Anthropic API error response that includes the API key
    const apiError = `{
      "error": {
        "type": "authentication_error",
        "message": "Invalid API key: sk-ant-api03-leakedkey123"
      }
    }`;

    const sanitized = sanitizeError(apiError);

    // Verify the API key is redacted
    expect(sanitized).toContain('[REDACTED_API_KEY]');
    expect(sanitized).not.toContain('leakedkey123');
  });

  it('should preserve non-sensitive error information', () => {
    const error = new ValidationError('API request failed with key sk-abc123def456ghi789', {
      provider: 'openai',
      model: 'gpt-4-turbo-preview',
      status: 401,
      timestamp: '2026-01-30T12:00:00Z',
    });
    const formatted = formatError(error);

    // Verify sensitive data is redacted
    expect(formatted).toContain('[REDACTED_API_KEY]');
    expect(formatted).not.toContain('sk-abc123def456');

    // Verify non-sensitive data is preserved
    expect(formatted).toContain('provider=openai');
    expect(formatted).toContain('model=gpt-4-turbo-preview');
    expect(formatted).toContain('status=401');
    expect(formatted).toContain('timestamp=2026-01-30T12:00:00Z');
  });

  it('should handle nested error objects with API keys', () => {
    const error = new ValidationError('Request failed', {
      request: {
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          Authorization: 'Bearer sk-proj-abc123def456ghi789jkl012',
        },
      },
      response: {
        status: 401,
        error: 'Invalid API key: sk-proj-abc123def456ghi789jkl012',
      },
    });
    const formatted = formatError(error);

    // Verify API keys are redacted in nested structures
    expect(formatted).toContain('[REDACTED_API_KEY]');
    expect(formatted).not.toContain('sk-proj-abc123');

    // Verify non-sensitive data is preserved
    expect(formatted).toContain('https://api.openai.com');
    expect(formatted).toContain('status');
    expect(formatted).toContain('401');
  });

  it('should handle real-world OpenAI error format', () => {
    const error = new ValidationError('API error', {
      statusCode: 401,
      body: JSON.stringify({
        error: {
          message: 'Incorrect API key provided: sk-proj-xyz789abc123def456ghi789',
          type: 'invalid_request_error',
          param: null,
          code: 'invalid_api_key',
        },
      }),
    });
    const formatted = formatError(error);

    // Verify API key is redacted
    expect(formatted).toContain('[REDACTED_API_KEY]');
    expect(formatted).not.toContain('sk-proj-xyz789');

    // Verify error structure is preserved
    expect(formatted).toContain('statusCode=401');
    expect(formatted).toContain('invalid_api_key');
  });

  it('should handle multiple API keys in the same error', () => {
    const error = new ValidationError('Multiple API failures', {
      openaiError: 'Failed with key sk-proj-abc123def456ghi789',
      anthropicError: 'Failed with key sk-ant-api03-xyz789abc123',
    });
    const formatted = formatError(error);

    // Verify both API keys are redacted
    expect(formatted).toContain('[REDACTED_API_KEY]');
    expect(formatted).not.toContain('sk-proj-abc123');
    expect(formatted).not.toContain('sk-ant-api03');
  });

  it('should not over-redact non-sensitive strings', () => {
    const error = new ValidationError('Normal error message', {
      info: 'This is a normal string with no API keys',
      numbers: 12345,
      boolean: true,
    });
    const formatted = formatError(error);

    // Verify no unnecessary redaction occurred
    expect(formatted).not.toContain('[REDACTED_API_KEY]');
    expect(formatted).toContain('This is a normal string with no API keys');
    expect(formatted).toContain('12345');
    expect(formatted).toContain('true');
  });
});
