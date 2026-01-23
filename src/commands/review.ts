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
  type LLMConfig,
  type LLMMessage,
} from '../utils/llm-client.js';

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
 * Main review command logic
 */
async function runReviewCommand(
  filePath: string,
  options: {
    provider: string;
    model?: string;
    apiKey?: string;
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

    // Step 6: Call LLM
    const config: LLMConfig = {
      provider,
      apiKey,
      ...(options.model && { model: options.model }),
      timeoutMs: 60000, // 60 seconds for code review (longer than default)
    };

    const response = await callLLM(config, messages);

    // Step 7: Display results
    console.log(chalk.bold.green('\n✅ Analysis Complete\n'));
    console.log(chalk.white(response.content));

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
