/**
 * LLM Client - BYOK (Bring Your Own Key) Support
 *
 * Supports OpenAI and Anthropic APIs for Guardian code review
 */

// Default timeout for API requests (30 seconds)
const DEFAULT_API_TIMEOUT_MS = 30000;

export interface LLMConfig {
  provider: 'openai' | 'anthropic';
  apiKey: string;
  model?: string;
  timeoutMs?: number;
  responseFormat?: 'text' | 'json';
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
 * Call LLM API with messages
 */
export async function callLLM(
  config: LLMConfig,
  messages: LLMMessage[]
): Promise<LLMResponse> {
  if (config.provider === 'openai') {
    return await callOpenAI(config, messages);
  } else if (config.provider === 'anthropic') {
    return await callAnthropic(config, messages);
  }

  throw new Error(`Unsupported provider: ${config.provider}`);
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
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
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
      throw new Error(`Anthropic API error: ${response.status} ${error}`);
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
 * @param content - Raw LLM response content
 * @returns Parsed GuardianResult or null if invalid
 */
export function parseGuardianJSON(content: string): {
  summary: {
    status: 'compliant' | 'minor_issues' | 'major_violations';
    message: string;
  };
  violations: Array<{
    pattern: string;
    line?: number;
    issue: string;
    recommendation: string;
    severity: 'minor' | 'major';
  }>;
  positiveObservations: string[];
} | null {
  try {
    const parsed = JSON.parse(content);

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
