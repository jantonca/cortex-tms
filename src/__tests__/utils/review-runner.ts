/**
 * Test Utility - Review Command Runner
 *
 * Helper to run review command in test environment
 */

import { resolve, join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { callLLM, getApiKey, parseGuardianJSON, type LLMConfig, type LLMMessage } from '../../utils/llm-client.js';
import { SAFE_MODE_THRESHOLD } from '../../types/guardian.js';

interface ReviewOptions {
  provider: 'openai' | 'anthropic';
  model?: string;
  apiKey?: string;
  safe?: boolean;
  outputJson?: boolean;
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

    // Step 7: Parse and filter results
    let parsedResult = parseGuardianJSON(response.content);

    // Apply Safe Mode filtering if enabled
    if (parsedResult && options.safe) {
      const originalCount = parsedResult.violations.length;

      parsedResult.violations = parsedResult.violations.filter(
        v => (v.confidence ?? 1.0) >= SAFE_MODE_THRESHOLD
      );

      // Update summary if all violations filtered out
      if (originalCount > 0 && parsedResult.violations.length === 0) {
        parsedResult.summary.status = 'compliant';
        parsedResult.summary.message = `No high-confidence violations found (Safe Mode filtered ${originalCount} low-confidence issue${originalCount === 1 ? '' : 's'})`;
      }
    }

    // Format output based on mode
    let output: string;
    if (options.outputJson) {
      // JSON mode: output raw JSON
      if (parsedResult) {
        output = JSON.stringify(parsedResult, null, 2);
      } else {
        output = JSON.stringify({
          error: 'Failed to parse Guardian response',
          rawContent: response.content
        }, null, 2);
      }
    } else {
      // Default mode: formatted output
      output = parsedResult ? formatGuardianResult(parsedResult) : response.content;
    }

    return {
      success: true,
      output,
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
You MUST respond with valid JSON matching this exact schema:

\`\`\`json
{
  "summary": {
    "status": "compliant" | "minor_issues" | "major_violations",
    "message": "Brief overall assessment of the code"
  },
  "violations": [
    {
      "pattern": "Pattern name (e.g., 'Pattern 1: Placeholder Syntax')",
      "line": 42,  // Optional line number where violation occurs
      "issue": "What's wrong with the code",
      "recommendation": "How to fix it",
      "severity": "minor" | "major",
      "confidence": 0.85  // 0-1 scale, how certain you are about this violation
    }
  ],
  "positiveObservations": [
    "Good practice 1",
    "Good practice 2"
  ]
}
\`\`\`

**Field Definitions**:
- \`status\`: "compliant" (no violations), "minor_issues" (style/minor issues), or "major_violations" (serious pattern breaks)
- \`violations\`: Array of violations found (empty array if compliant)
- \`severity\`: "minor" for style/preference issues, "major" for pattern violations
- \`confidence\`: A number from 0 to 1 indicating certainty about the violation
  - 0.9-1.0: Very high - Clear, unambiguous violation of stated patterns
  - 0.7-0.9: High - Likely violation, context strongly supports it
  - 0.5-0.7: Medium - Possible violation, some ambiguity in interpretation
  - 0.0-0.5: Low - Uncertain, may be false positive or edge case
- \`positiveObservations\`: Array of strings highlighting good practices

If no violations found, set status to "compliant", violations to empty array [], and include positive observations.

Be concise but specific. Reference exact line numbers in violations when possible.`;

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

/**
 * Format Guardian JSON result for display (duplicated from review.ts for testing)
 */
function formatGuardianResult(result: import('../../types/guardian.js').GuardianResult): string {
  let output = '';

  // Summary section with status emoji
  const statusConfig = {
    compliant: { emoji: '✅', label: 'Compliant' },
    minor_issues: { emoji: '⚠️ ', label: 'Minor Issues' },
    major_violations: { emoji: '❌', label: 'Major Violations' },
  };

  const { emoji, label } = statusConfig[result.summary.status];
  output += `${emoji} **${label}**\n\n`;
  output += `${result.summary.message}\n\n`;

  // Violations section
  if (result.violations.length > 0) {
    output += '## Violations\n\n';
    result.violations.forEach((v, index) => {
      const severityIcon = v.severity === 'major' ? '❌' : '⚠️ ';
      output += `${index + 1}. ${severityIcon} **${v.pattern}**\n`;
      if (v.line) {
        output += `   📍 Line: ${v.line}\n`;
      }
      output += `   ❗ Issue: ${v.issue}\n`;
      output += `   💡 Fix: ${v.recommendation}\n`;
      if (v.confidence !== undefined) {
        output += `   📊 Confidence: ${Math.round(v.confidence * 100)}%\n`;
      }
      output += '\n';
    });
  }

  // Positive observations section
  if (result.positiveObservations.length > 0) {
    output += '## Positive Observations\n\n';
    result.positiveObservations.forEach((obs) => {
      output += `✅ ${obs}\n`;
    });
  }

  return output;
}
