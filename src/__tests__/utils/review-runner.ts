/**
 * Test Utility - Review Command Runner
 *
 * Helper to run review command in test environment
 */

import { resolve, join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { callLLM, getApiKey, type LLMConfig, type LLMMessage } from '../../utils/llm-client.js';

interface ReviewOptions {
  provider: 'openai' | 'anthropic';
  model?: string;
  apiKey?: string;
}

interface ReviewResult {
  success: boolean;
  output?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Run review command in test environment
 * Mirrors the logic from src/commands/review.ts but returns results instead of logging
 */
export async function runReviewForTest(
  cwd: string,
  filePath: string,
  options: ReviewOptions
): Promise<ReviewResult> {
  try {
    // Step 1: Validate TMS files exist
    const patternsPath = join(cwd, 'docs/core/PATTERNS.md');
    const domainLogicPath = join(cwd, 'docs/core/DOMAIN-LOGIC.md');

    if (!existsSync(patternsPath)) {
      return {
        success: false,
        error: 'PATTERNS.md not found at docs/core/PATTERNS.md',
      };
    }

    // Step 2: Validate file to review exists
    const targetPath = resolve(cwd, filePath);
    if (!existsSync(targetPath)) {
      return {
        success: false,
        error: `File not found: ${filePath}`,
      };
    }

    // Step 3: Read files
    const patterns = readFileSync(patternsPath, 'utf-8');
    const domainLogic = existsSync(domainLogicPath)
      ? readFileSync(domainLogicPath, 'utf-8')
      : null;
    const codeToReview = readFileSync(targetPath, 'utf-8');

    // Step 4: Get API key
    const apiKey = options.apiKey || getApiKey(options.provider);

    if (!apiKey) {
      return {
        success: false,
        error: 'API key is required',
      };
    }

    // Step 5: Build LLM prompt
    const systemPrompt = buildSystemPrompt(patterns, domainLogic);
    const userPrompt = buildUserPrompt(filePath, codeToReview);

    const messages: LLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    // Step 6: Call LLM
    const config: LLMConfig = {
      provider: options.provider,
      apiKey,
      ...(options.model && { model: options.model }),
    };

    const response = await callLLM(config, messages);

    // Step 7: Return results
    return {
      success: true,
      output: response.content,
      usage: response.usage,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Build system prompt (duplicated from review.ts for testing)
 */
function buildSystemPrompt(patterns: string, domainLogic: string | null): string {
  let prompt = `You are Guardian, a code review assistant that analyzes code against project-specific patterns and architectural rules.

# Your Task
Analyze the provided code file and identify violations of the patterns defined in PATTERNS.md${domainLogic ? ' and domain logic rules in DOMAIN-LOGIC.md' : ''}.

# PATTERNS.md
${patterns}
`;

  if (domainLogic) {
    prompt += `
# DOMAIN-LOGIC.md
${domainLogic}
`;
  }

  prompt += `
# Output Format
Provide a structured report with:

1. **Summary**: Overall assessment (✅ Compliant, ⚠️  Minor Issues, ❌ Major Violations)
2. **Violations**: List each violation with:
   - **Pattern**: Which pattern/rule was violated
   - **Line**: Approximate line number (if identifiable)
   - **Issue**: What's wrong
   - **Recommendation**: How to fix it
3. **Positive Observations**: What the code does well

If no violations found, provide positive feedback and highlight good practices.

Be concise but specific. Reference exact line numbers when possible.`;

  return prompt;
}

/**
 * Build user prompt (duplicated from review.ts for testing)
 */
function buildUserPrompt(filePath: string, code: string): string {
  return `# File to Review
**Path**: \`${filePath}\`

\`\`\`
${code}
\`\`\`

Please analyze this code against the project patterns and provide your assessment.`;
}
