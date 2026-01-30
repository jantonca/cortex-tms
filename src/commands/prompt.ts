/**
 * Cortex TMS CLI - Prompt Command
 *
 * Provides quick access to project-aware AI prompt templates
 */

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import clipboard from 'clipboardy';
import { getProjectPrompts, getPrompt } from '../utils/prompt-parser.js';
import { promptOptionsSchema, validateOptions } from '../utils/validation.js';

/**
 * Create and configure the prompt command
 */
export function createPromptCommand(): Command {
  const promptCommand = new Command('prompt');

  promptCommand
    .description('Access project-aware AI prompt templates')
    .argument('[name]', 'Prompt name to display (e.g., "init-session", "feature")')
    .option('-l, --list', 'List all available prompts')
    .option('--no-copy', 'Do not copy to clipboard (stdout only)')
    .action(async (name, options) => {
      await runPromptCommand(name, options);
    });

  return promptCommand;
}

/**
 * Export command instance for registration in CLI
 */
export const promptCommand = createPromptCommand();

/**
 * Main prompt command logic
 */
async function runPromptCommand(
  promptName: string | undefined,
  options: { list?: boolean; copy: boolean }
): Promise<void> {
  const cwd = process.cwd();

  // Validate options using Zod schema
  validateOptions(promptOptionsSchema, options, 'prompt');

  try {
    // Load all prompts from PROMPTS.md
    const prompts = await getProjectPrompts(cwd);

    if (prompts.length === 0) {
      console.log(
        chalk.yellow('\n⚠️  No prompts found in PROMPTS.md')
      );
      console.log(
        chalk.gray('\nRun "cortex-tms init" to install the prompt library.\n')
      );
      return;
    }

    // --list flag: Show all available prompts
    if (options.list) {
      console.log(chalk.bold.cyan('\n📋 Available Prompts:\n'));

      prompts.forEach((p) => {
        console.log(chalk.bold.blue(`  ${p.name}`));
        console.log(chalk.gray(`    ${p.description}\n`));
      });

      console.log(
        chalk.gray(
          `\nUse: ${chalk.cyan('cortex-tms prompt <name>')} to access a prompt`
        )
      );
      console.log(
        chalk.gray(
          `Example: ${chalk.cyan('cortex-tms prompt init-session')}\n`
        )
      );
      return;
    }

    // Direct prompt name provided
    if (promptName) {
      const content = await getPrompt(cwd, promptName);

      if (!content) {
        console.log(
          chalk.red('\n❌ Error:'),
          `Prompt "${promptName}" not found`
        );
        console.log(
          chalk.gray('\nRun'),
          chalk.cyan('cortex-tms prompt --list'),
          chalk.gray('to see available prompts.\n')
        );
        return;
      }

      await displayPrompt(promptName, content, options.copy);
      return;
    }

    // Interactive mode: Let user choose
    const choices = prompts.map((p) => ({
      name: `${chalk.bold(p.name)} ${chalk.gray('- ' + p.description)}`,
      value: p.name,
      short: p.name,
    }));

    const answer = await inquirer.prompt<{ selectedPrompt: string }>([
      {
        type: 'list',
        name: 'selectedPrompt',
        message: 'Select a prompt:',
        choices,
        pageSize: 10,
      },
    ]);

    const selectedPrompt = prompts.find((p) => p.name === answer.selectedPrompt);

    if (!selectedPrompt) {
      console.log(chalk.red('\n❌ Error:'), 'Prompt not found\n');
      return;
    }

    await displayPrompt(selectedPrompt.name, selectedPrompt.content, options.copy);
  } catch (error) {
    if (error instanceof Error && error.message.includes('PROMPTS.md not found')) {
      console.log(
        chalk.yellow('\n⚠️  PROMPTS.md not found in current directory')
      );
      console.log(
        chalk.gray('\nThis command must be run from a Cortex TMS project.')
      );
      console.log(
        chalk.gray('Run "cortex-tms init" to initialize.\n')
      );
    } else {
      // Re-throw other errors
      throw error instanceof Error ? error : new Error('Unknown error');
    }
  }
}

/**
 * Display prompt content and optionally copy to clipboard
 */
async function displayPrompt(
  name: string,
  content: string,
  shouldCopy: boolean
): Promise<void> {
  console.log(chalk.bold.cyan(`\n📋 ${name}\n`));
  console.log(chalk.white(content));

  // Attempt clipboard copy
  if (shouldCopy) {
    try {
      await clipboard.write(content);
      console.log(chalk.green('\n✅ Copied to clipboard!'));
    } catch (error) {
      console.log(
        chalk.yellow('\n⚠️  Could not copy to clipboard'),
        chalk.gray('(no clipboard access)')
      );
    }
  }

  console.log(
    chalk.gray('\n💡 Tip: Paste this prompt into your AI conversation.\n')
  );
}
