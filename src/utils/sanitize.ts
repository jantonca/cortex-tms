/**
 * Sanitization utilities for sensitive data (API keys, secrets, etc.)
 *
 * Ensures that sensitive data never appears in logs, error messages, or user-facing output.
 */

/**
 * Pattern to match common API key formats
 *
 * Matches:
 * - OpenAI keys: sk-..., sk-proj-...
 * - Anthropic keys: sk-ant-...
 * - Generic bearer tokens
 * - Authorization and x-api-key headers
 */
const API_KEY_PATTERNS = [
  // OpenAI format: sk-... or sk-proj-... (variable length, 10+ chars)
  /sk-(?:proj-)?[a-zA-Z0-9_-]{10,}/g,
  // Anthropic format: sk-ant-... (10+ chars after prefix)
  /sk-ant-[a-zA-Z0-9_-]{10,}/g,
  // Generic bearer tokens (20+ chars)
  /Bearer\s+[a-zA-Z0-9_-]{20,}/gi,
  // Authorization header values (20+ chars)
  /Authorization:\s*["']?[a-zA-Z0-9_-]{20,}["']?/gi,
  // x-api-key header values (10+ chars)
  /x-api-key:\s*["']?[a-zA-Z0-9_-]{10,}["']?/gi,
];

/**
 * Redaction string used to replace sensitive data
 */
const REDACTED = '[REDACTED_API_KEY]';

/**
 * Sanitize a string by redacting API keys and other sensitive data
 *
 * @param text - Text that may contain sensitive data
 * @returns Sanitized text with API keys redacted
 *
 * @example
 * sanitizeApiKey('Error: Invalid key sk-abc123...')
 * // Returns: 'Error: Invalid key [REDACTED_API_KEY]'
 */
export function sanitizeApiKey(text: string): string {
  let sanitized = text;

  // Apply each pattern to redact API keys
  for (const pattern of API_KEY_PATTERNS) {
    sanitized = sanitized.replace(pattern, REDACTED);
  }

  return sanitized;
}

/**
 * Sanitize an error message by redacting API keys
 *
 * Handles both Error objects and plain strings.
 *
 * @param error - Error object or message string
 * @returns Sanitized error message
 */
export function sanitizeError(error: Error | string): string {
  const message = typeof error === 'string' ? error : error.message;
  return sanitizeApiKey(message);
}

/**
 * Sanitize an object by redacting API keys in all string values
 *
 * Recursively walks through objects and arrays to sanitize all strings.
 * Useful for sanitizing error context objects before display.
 *
 * @param obj - Object that may contain sensitive data
 * @returns Sanitized object with API keys redacted
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle strings
  if (typeof obj === 'string') {
    return sanitizeApiKey(obj) as T;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as T;
  }

  // Handle plain objects
  if (typeof obj === 'object' && obj.constructor === Object) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Redact common sensitive key names entirely
      if (['apiKey', 'api_key', 'token', 'secret', 'password'].includes(key)) {
        sanitized[key] = REDACTED;
      } else {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized as T;
  }

  // Return primitive values as-is
  return obj;
}
