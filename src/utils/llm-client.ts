/**
 * LLM Client - BYOK (Bring Your Own Key) Support
 *
 * Supports OpenAI and Anthropic APIs for Guardian code review
 */

import type { GuardianResult } from '../types/guardian.js';
import { sanitizeError } from './sanitize.js';

// Default timeout for API requests (30 seconds)
const DEFAULT_API_TIMEOUT_MS = 30000;

// Default retry configuration
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_INITIAL_DELAY_MS = 1000; // 1 second
const DEFAULT_MAX_DELAY_MS = 10000; // 10 seconds
const DEFAULT_BACKOFF_MULTIPLIER = 2;

export interface LLMConfig {
  provider: 'openai' | 'anthropic';
  apiKey: string;
  model?: string;
  timeoutMs?: number;
  responseFormat?: 'text' | 'json';
  retryConfig?: {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    backoffMultiplier?: number;
  };
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Sleep for specified milliseconds (for retry delays)
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if an error is retryable
 *
 * Retryable errors:
 * - Network errors (fetch failures, timeouts)
 * - Rate limit errors (429)
 * - Server errors (500, 502, 503, 504)
 *
 * Non-retryable errors:
 * - Authentication errors (401, 403)
 * - Invalid request errors (400, 404)
 * - Other client errors (4xx except 429)
 */
function isRetryableError(error: Error): boolean {
  const errorMessage = error.message.toLowerCase();

  // Network errors (timeout, connection issues)
  if (errorMessage.includes('timeout') ||
      errorMessage.includes('network') ||
      errorMessage.includes('econnrefused') ||
      errorMessage.includes('enotfound')) {
    return true;
  }

  // Rate limit errors (429)
  if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
    return true;
  }

  // Server errors (5xx)
  if (errorMessage.includes('500') ||
      errorMessage.includes('502') ||
      errorMessage.includes('503') ||
      errorMessage.includes('504')) {
    return true;
  }

  // Authentication and client errors are not retryable
  if (errorMessage.includes('401') ||
      errorMessage.includes('403') ||
      errorMessage.includes('400') ||
      errorMessage.includes('404')) {
    return false;
  }

  // Default to not retrying for unknown errors
  return false;
}

/**
 * Call LLM API with messages (with automatic retry on transient failures)
 */
export async function callLLM(
  config: LLMConfig,
  messages: LLMMessage[]
): Promise<LLMResponse> {
  const maxRetries = config.retryConfig?.maxRetries ?? DEFAULT_MAX_RETRIES;
  const initialDelayMs = config.retryConfig?.initialDelayMs ?? DEFAULT_INITIAL_DELAY_MS;
  const maxDelayMs = config.retryConfig?.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;
  const backoffMultiplier = config.retryConfig?.backoffMultiplier ?? DEFAULT_BACKOFF_MULTIPLIER;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Make the actual API call
      if (config.provider === 'openai') {
        return await callOpenAI(config, messages);
      } else if (config.provider === 'anthropic') {
        return await callAnthropic(config, messages);
      }

      throw new Error(`Unsupported provider: ${config.provider}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If this is the last attempt or error is not retryable, throw immediately
      if (attempt === maxRetries || !isRetryableError(lastError)) {
        throw lastError;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        initialDelayMs * Math.pow(backoffMultiplier, attempt),
        maxDelayMs
      );

      // Log retry attempt (can be useful for debugging)
      // console.warn(`LLM API call failed (attempt ${attempt + 1}/${maxRetries + 1}): ${lastError.message}. Retrying in ${delay}ms...`);

      await sleep(delay);
    }
  }

  // This should never be reached due to throw in loop, but TypeScript needs it
  throw lastError || new Error('Unknown error in LLM API call');
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  config: LLMConfig,
  messages: LLMMessage[]
): Promise<LLMResponse> {
  const model = config.model || 'gpt-4-turbo-preview';
  const timeoutMs = config.timeoutMs || DEFAULT_API_TIMEOUT_MS;

  // Setup timeout with AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const requestBody: Record<string, unknown> = {
      model,
      messages,
      temperature: 0.1, // Low temperature for consistent code analysis
    };

    // Add JSON mode for OpenAI if requested
    if (config.responseFormat === 'json') {
      requestBody.response_format = { type: 'json_object' };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      const sanitizedError = sanitizeError(error);
      throw new Error(`OpenAI API error: ${response.status} ${sanitizedError}`);
    }

    const data = await response.json() as OpenAIResponse;

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid OpenAI response: missing content');
    }

    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      },
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`OpenAI API request timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
}

interface AnthropicResponse {
  content: Array<{
    text: string;
  }>;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Call Anthropic API
 */
async function callAnthropic(
  config: LLMConfig,
  messages: LLMMessage[]
): Promise<LLMResponse> {
  const model = config.model || 'claude-sonnet-4-5-20250929';
  const timeoutMs = config.timeoutMs || DEFAULT_API_TIMEOUT_MS;

  // Convert messages to Anthropic format (system message separate)
  let systemMessage = messages.find(m => m.role === 'system')?.content || '';

  // For JSON mode, append JSON format instruction to system message
  if (config.responseFormat === 'json') {
    systemMessage += '\n\nIMPORTANT: You MUST respond with valid JSON only. Do not include any text before or after the JSON. The response must be parseable by JSON.parse().';
  }

  const conversationMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({ role: m.role, content: m.content }));

  // Setup timeout with AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        temperature: 0.1,
        system: systemMessage,
        messages: conversationMessages,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      const sanitizedError = sanitizeError(error);
      throw new Error(`Anthropic API error: ${response.status} ${sanitizedError}`);
    }

    const data = await response.json() as AnthropicResponse;

    if (!data.content?.[0]?.text) {
      throw new Error('Invalid Anthropic response: missing content');
    }

    return {
      content: data.content[0].text,
      usage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      },
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Anthropic API request timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
}

/**
 * Parse and validate Guardian JSON response
 *
 * Handles edge cases where LLMs wrap JSON in markdown code blocks.
 *
 * @param content - Raw LLM response content
 * @returns Parsed GuardianResult or null if invalid
 */
export function parseGuardianJSON(content: string): GuardianResult | null {
  try {
    // Strip markdown code blocks if present (some LLMs wrap JSON even when instructed not to)
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    const parsed = JSON.parse(jsonStr);

    // Validate required fields
    if (!parsed.summary?.status || typeof parsed.summary.message !== 'string') {
      return null;
    }

    if (!Array.isArray(parsed.violations)) {
      return null;
    }

    if (!Array.isArray(parsed.positiveObservations)) {
      return null;
    }

    // Validate status enum
    const validStatuses = ['compliant', 'minor_issues', 'major_violations'];
    if (!validStatuses.includes(parsed.summary.status)) {
      return null;
    }

    // Validate violations structure
    for (const v of parsed.violations) {
      if (
        typeof v.pattern !== 'string' ||
        typeof v.issue !== 'string' ||
        typeof v.recommendation !== 'string' ||
        (v.severity !== 'minor' && v.severity !== 'major')
      ) {
        return null;
      }

      // Validate optional confidence field (0-1 range)
      if (v.confidence !== undefined) {
        if (typeof v.confidence !== 'number' || v.confidence < 0 || v.confidence > 1) {
          return null;
        }
      }
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Get API key from environment or prompt user
 */
export function getApiKey(provider: 'openai' | 'anthropic'): string | null {
  const envVar = provider === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY';
  return process.env[envVar] || null;
}
