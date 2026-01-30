/**
 * Cortex TMS CLI - Review Command (Guardian MVP)
 *
 * Analyzes code files against PATTERNS.md and DOMAIN-LOGIC.md
 * using LLM-powered pattern detection
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import inquirer from 'inquirer';
import {
  callLLM,
  getApiKey,
  parseGuardianJSON,
  type LLMConfig,
  type LLMMessage,
} from '../utils/llm-client.js';
import { buildGuardianSystemPrompt, buildGuardianUserPrompt } from '../utils/guardian-prompt.js';
import type { GuardianResult } from '../types/guardian.js';
import { SAFE_MODE_THRESHOLD } from '../types/guardian.js';
import { reviewOptionsSchema, validateOptions, validateFilePath } from '../utils/validation.js';
import { ValidationError } from '../utils/errors.js';

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
    .option('--safe', `Safe Mode: only show high-confidence violations (>= ${SAFE_MODE_THRESHOLD * 100}%)`)
    .option('--output-json', 'Output raw JSON instead of formatted text (for programmatic use)')
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
    outputJson?: boolean;
  }
): Promise<void> {
  const cwd = process.cwd();

  // Validate options using Zod schema
  const validated = validateOptions(reviewOptionsSchema, options, 'review');

  // Suppress UI output in JSON mode
  if (!validated.outputJson) {
    console.log(chalk.bold.cyan('\n🛡️  Guardian Code Review\n'));
  }

  // Step 1: Validate TMS files exist
  const patternsPath = join(cwd, 'docs/core/PATTERNS.md');
  const domainLogicPath = join(cwd, 'docs/core/DOMAIN-LOGIC.md');

  if (!existsSync(patternsPath)) {
    if (!options.outputJson) {
      console.log(chalk.gray('\nGuardian requires a Cortex TMS project with pattern documentation.'));
      console.log(chalk.gray('Run'), chalk.cyan('cortex-tms init'), chalk.gray('to set up TMS files.\n'));
    }
    throw new Error('PATTERNS.md not found at docs/core/PATTERNS.md');
  }

  if (!existsSync(domainLogicPath) && !options.outputJson) {
    console.log(chalk.yellow('⚠️  Warning:'), 'DOMAIN-LOGIC.md not found (optional)');
  }

  // Step 2: Validate file to review exists and prevent path traversal
  const targetPath = validateFilePath(filePath, cwd);

  try {

    // Step 3: Read files
    if (!validated.outputJson) {
      console.log(chalk.gray('📖 Reading project patterns...'));
    }
    const patterns = readFileSync(patternsPath, 'utf-8');
    const domainLogic = existsSync(domainLogicPath)
      ? readFileSync(domainLogicPath, 'utf-8')
      : null;
    const codeToReview = readFileSync(targetPath, 'utf-8');

    // Step 4: Get API key
    const provider = validated.provider as 'openai' | 'anthropic';
    let apiKey = validated.apiKey || getApiKey(provider);

    if (!apiKey) {
      // In JSON mode, cannot prompt for API key - must be provided
      if (validated.outputJson) {
        throw new ValidationError('API key is required (use --api-key or set environment variable)');
      }

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
      throw new ValidationError('API key is required');
    }

    // Step 5: Build LLM prompt
    if (!validated.outputJson) {
      console.log(chalk.gray('🤖 Analyzing code with', provider, '...'));
    }

    const systemPrompt = buildGuardianSystemPrompt(patterns, domainLogic);
    const userPrompt = buildGuardianUserPrompt(filePath, codeToReview);

    const messages: LLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    // Step 6: Call LLM with JSON mode
    const config: LLMConfig = {
      provider,
      apiKey,
      ...(validated.model && { model: validated.model }),
      timeoutMs: 60000, // 60 seconds for code review (longer than default)
      responseFormat: 'json',
    };

    const response = await callLLM(config, messages);

    // Step 7: Parse and display results
    let parsedResult = parseGuardianJSON(response.content);

    // Apply Safe Mode filtering if enabled
    if (parsedResult && validated.safe) {
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

    // Output in requested format
    if (validated.outputJson) {
      // JSON mode: output raw JSON to stdout only
      if (parsedResult) {
        console.log(JSON.stringify(parsedResult, null, 2));
      } else {
        // If JSON parsing failed, output error as JSON
        console.log(JSON.stringify({
          error: 'Failed to parse Guardian response',
          rawContent: response.content
        }, null, 2));
      }
    } else {
      // Default mode: formatted output
      console.log(chalk.bold.green('\n✅ Analysis Complete\n'));

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
    }
  } catch (error) {
    // Re-throw to let CLI handle it
    throw error instanceof Error ? error : new Error('Unknown error');
  }
}

