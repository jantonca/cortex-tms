/**
 * Cortex TMS CLI - Review Command (Guardian MVP)
 *
 * Analyzes code files against PATTERNS.md and DOMAIN-LOGIC.md
 * using LLM-powered pattern detection
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import inquirer from 'inquirer';
import {
  callLLM,
  getApiKey,
  parseGuardianJSON,
  type LLMConfig,
  type LLMMessage,
} from '../utils/llm-client.js';
import type { GuardianResult } from '../types/guardian.js';

/**
 * Create and configure the review command
 */
export function createReviewCommand(): Command {
  const reviewCommand = new Command('review');

  reviewCommand
    .description('🛡️  Guardian: Analyze code against project patterns')
    .argument('<file>', 'Path to file to review')
    .option('-p, --provider <provider>', 'LLM provider: openai or anthropic', 'anthropic')
    .option('-m, --model <model>', 'Model name (default: gpt-4-turbo-preview or claude-3-5-sonnet-20241022)')
    .option('--api-key <key>', 'API key (alternative to environment variable)')
    .option('--safe', 'Safe Mode: only show high-confidence violations (>= 70%)')
    .action(async (filePath, options) => {
      await runReviewCommand(filePath, options);
    });

  return reviewCommand;
}

/**
 * Export command instance for registration in CLI
 */
export const reviewCommand = createReviewCommand();

/**
 * Format Guardian JSON result for display
 */
function formatGuardianResult(result: GuardianResult): string {
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

/**
 * Main review command logic
 */
async function runReviewCommand(
  filePath: string,
  options: {
    provider: string;
    model?: string;
    apiKey?: string;
    safe?: boolean;
  }
): Promise<void> {
  const cwd = process.cwd();

  console.log(chalk.bold.cyan('\n🛡️  Guardian Code Review\n'));

  // Step 1: Validate TMS files exist
  const patternsPath = join(cwd, 'docs/core/PATTERNS.md');
  const domainLogicPath = join(cwd, 'docs/core/DOMAIN-LOGIC.md');

  if (!existsSync(patternsPath)) {
    console.log(chalk.gray('\nGuardian requires a Cortex TMS project with pattern documentation.'));
    console.log(chalk.gray('Run'), chalk.cyan('cortex-tms init'), chalk.gray('to set up TMS files.\n'));
    throw new Error('PATTERNS.md not found at docs/core/PATTERNS.md');
  }

  if (!existsSync(domainLogicPath)) {
    console.log(chalk.yellow('⚠️  Warning:'), 'DOMAIN-LOGIC.md not found (optional)');
  }

  // Step 2: Validate file to review exists and prevent path traversal
  const targetPath = resolve(cwd, filePath);

  // Security: Ensure path stays within project directory
  if (!targetPath.startsWith(cwd)) {
    throw new Error(`Path traversal detected: ${filePath} resolves outside project directory`);
  }

  if (!existsSync(targetPath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  try {

    // Step 3: Read files
    console.log(chalk.gray('📖 Reading project patterns...'));
    const patterns = readFileSync(patternsPath, 'utf-8');
    const domainLogic = existsSync(domainLogicPath)
      ? readFileSync(domainLogicPath, 'utf-8')
      : null;
    const codeToReview = readFileSync(targetPath, 'utf-8');

    // Step 4: Get API key
    const provider = options.provider as 'openai' | 'anthropic';
    let apiKey = options.apiKey || getApiKey(provider);

    if (!apiKey) {
      const answer = await inquirer.prompt<{ apiKey: string }>([
        {
          type: 'password',
          name: 'apiKey',
          message: `Enter your ${provider === 'openai' ? 'OpenAI' : 'Anthropic'} API key:`,
          mask: '*',
        },
      ]);
      apiKey = answer.apiKey;
    }

    if (!apiKey) {
      throw new Error('API key is required');
    }

    // Step 5: Build LLM prompt
    console.log(chalk.gray('🤖 Analyzing code with', provider, '...'));

    const systemPrompt = buildSystemPrompt(patterns, domainLogic);
    const userPrompt = buildUserPrompt(filePath, codeToReview);

    const messages: LLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    // Step 6: Call LLM with JSON mode
    const config: LLMConfig = {
      provider,
      apiKey,
      ...(options.model && { model: options.model }),
      timeoutMs: 60000, // 60 seconds for code review (longer than default)
      responseFormat: 'json',
    };

    const response = await callLLM(config, messages);

    // Step 7: Parse and display results
    console.log(chalk.bold.green('\n✅ Analysis Complete\n'));

    let parsedResult = parseGuardianJSON(response.content);

    // Apply Safe Mode filtering if enabled
    if (parsedResult && options.safe) {
      const SAFE_MODE_THRESHOLD = 0.7;
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

    if (parsedResult) {
      // Display formatted JSON result
      const formatted = formatGuardianResult(parsedResult);
      console.log(chalk.white(formatted));
    } else {
      // Fallback to raw text if JSON parsing fails
      console.log(chalk.yellow('⚠️  Warning: Could not parse JSON response, displaying raw output:\n'));
      console.log(chalk.white(response.content));
    }

    if (response.usage) {
      console.log(
        chalk.gray(
          `\n📊 Tokens: ${response.usage.totalTokens} total (${response.usage.promptTokens} prompt + ${response.usage.completionTokens} completion)\n`
        )
      );
    }
  } catch (error) {
    // Re-throw to let CLI handle it
    throw error instanceof Error ? error : new Error('Unknown error');
  }
}

/**
 * Build system prompt with patterns and domain logic
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
# Important Guidelines

**ONLY flag actual violations in the code being reviewed. Do NOT flag:**
- Educational examples showing anti-patterns (if clearly marked with ❌ or "Anti-Pattern" or "Bad")
- Documentation that explains what NOT to do
- Code snippets demonstrating violations for teaching purposes
- Placeholder syntax like [e.g., ...] when used correctly
- Comments that provide inline guidance
- Canonical links to actual implementations

**Context Matters:**
- If code shows BOTH good and bad examples, only flag if the actual implementation is wrong
- Templates with [Bracket Syntax] are CORRECT per Pattern 1
- Inline comments explaining customization are GOOD per Pattern 4
- References to actual files are GOOD per Pattern 3

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
 * Build user prompt with code to review
 */
function buildUserPrompt(filePath: string, code: string): string {
  return `# File to Review
**Path**: \`${filePath}\`

\`\`\`
${code}
\`\`\`

Please analyze this code against the project patterns and provide your assessment.`;
}
