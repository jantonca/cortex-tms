/**
 * Cortex TMS CLI - Init Command
 *
 * Initializes Cortex TMS documentation structure in the current directory
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { basename } from 'path';
import { detectContext, isSafeToInitialize } from '../utils/detection.js';
import {
  runInitPrompts,
  showInitSummary,
  confirmInit,
} from '../utils/prompts.js';
import {
  getTemplatesDir,
  copyTemplates,
  generateReplacements,
} from '../utils/templates.js';
import { createConfigFromScope, saveConfig } from '../utils/config.js';
import type { InitCommandOptions } from '../types/cli.js';

/**
 * Create and configure the init command
 */
export function createInitCommand(): Command {
  const initCommand = new Command('init');

  initCommand
    .description('Initialize Cortex TMS in your project')
    .option('-f, --force', 'Skip confirmation prompts and overwrite existing files')
    .option('-m, --minimal', 'Install minimal template set only')
    .option('-v, --verbose', 'Show detailed output')
    .option('-s, --scope <scope>', 'Specify scope for non-interactive mode (nano|standard|enterprise|custom)')
    .option('-d, --dry-run', 'Preview changes without writing to disk')
    .action(async (options: InitCommandOptions) => {
      await runInit(options);
    });

  return initCommand;
}

/**
 * Main init command logic
 */
async function runInit(options: InitCommandOptions): Promise<void> {
  const cwd = process.cwd();

  console.log(chalk.bold.cyan('\n🧠 Cortex TMS Initialization\n'));

  // Validate --scope flag if provided
  if (options.scope) {
    const validScopes = ['nano', 'standard', 'enterprise', 'custom'];
    if (!validScopes.includes(options.scope)) {
      console.error(
        chalk.red('\n❌ Error:'),
        `Invalid scope "${options.scope}". Must be one of: ${validScopes.join(', ')}`
      );
      process.exit(1);
    }
  }

  // Dry-run mode indicator
  if (options.dryRun) {
    console.log(chalk.yellow('🔍 DRY RUN MODE: No files will be modified.\n'));
  }

  // Step 1: Detect project context
  const spinner = ora('Detecting project context...').start();
  const context = detectContext(cwd);
  spinner.succeed('Project context detected');

  // Show context info if verbose
  if (options.verbose) {
    console.log(chalk.gray('\nProject Context:'));
    console.log(chalk.gray(`  Git repository: ${context.isGitRepo ? 'Yes' : 'No'}`));
    console.log(
      chalk.gray(`  Package.json: ${context.hasPackageJson ? 'Yes' : 'No'}`)
    );
    console.log(
      chalk.gray(
        `  Package manager: ${context.packageManager !== 'unknown' ? context.packageManager : 'Unknown'}`
      )
    );
    console.log(
      chalk.gray(
        `  Existing TMS files: ${context.existingFiles.length > 0 ? context.existingFiles.join(', ') : 'None'}`
      )
    );
    console.log();
  }

  // Step 2: Safety check
  if (!isSafeToInitialize(context) && !options.force) {
    console.log(
      chalk.yellow(
        `\n⚠️  Warning: ${context.existingFiles.length} TMS file(s) already exist:`
      )
    );
    context.existingFiles.forEach((file) => {
      console.log(chalk.yellow(`  - ${file}`));
    });
    console.log(
      chalk.gray('\nUse --force to overwrite, or remove existing files first.\n')
    );
  }

  // Step 3: Interactive prompts (or use defaults if --force or --scope)
  let answers;

  const shouldSkipPrompts = options.force || options.scope;

  if (shouldSkipPrompts) {
    // Use default values when --force or --scope is enabled
    const defaultName = basename(cwd)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Determine scope: explicit flag > minimal flag > default to standard
    let scope: 'nano' | 'standard' | 'enterprise' | 'custom';
    if (options.scope) {
      scope = options.scope;
    } else if (options.minimal) {
      scope = 'nano';
    } else {
      scope = 'standard';
    }

    answers = {
      projectName: defaultName,
      scope,
      overwrite: options.force ?? false,
    };

    if (options.verbose) {
      console.log(chalk.gray('\nUsing non-interactive mode:'));
      console.log(chalk.gray(`  Project Name: ${answers.projectName}`));
      console.log(chalk.gray(`  Scope: ${answers.scope}`));
      console.log(chalk.gray(`  Overwrite: ${answers.overwrite}`));
      console.log();
    }
  } else {
    // Check for TTY before running interactive prompts
    if (!process.stdin.isTTY) {
      console.error(
        chalk.red('\n❌ Error:'),
        'Interactive prompts require a TTY.'
      );
      console.log(
        chalk.gray(
          'Use --scope <scope> and --force flags for non-interactive environments (CI/CD).'
        )
      );
      console.log(
        chalk.gray('Example: cortex-tms init --scope standard --force\n')
      );
      process.exit(1);
    }

    answers = await runInitPrompts(context, cwd);
  }

  // Step 4: Show summary and confirm (skip in dry-run or force mode)
  if (!options.force && !options.dryRun) {
    showInitSummary(answers, context);

    const confirmed = await confirmInit();
    if (!confirmed) {
      console.log(chalk.gray('\nInitialization cancelled.\n'));
      return;
    }
  }

  // Step 5: Generate replacements
  const replacements = generateReplacements(
    answers.projectName,
    answers.description
  );

  if (options.verbose) {
    console.log(chalk.gray('\nPlaceholder Replacements:'));
    Object.entries(replacements).forEach(([key, value]) => {
      console.log(chalk.gray(`  [${key}] → ${value}`));
    });
    console.log();
  }

  // Step 6: Copy templates (or analyze in dry-run mode)
  const copySpinner = ora(
    options.dryRun ? 'Analyzing changes...' : 'Copying templates...'
  ).start();

  try {
    const templatesDir = getTemplatesDir();
    const overwrite = options.force || answers.overwrite;

    const result = await copyTemplates(templatesDir, cwd, replacements, {
      overwrite,
      scope: answers.scope,
      dryRun: options.dryRun ?? false,
      ...(answers.customFiles && { customFiles: answers.customFiles }),
    });

    copySpinner.succeed(
      options.dryRun
        ? `Analysis complete: ${chalk.bold(result.copied)} files would be affected`
        : `Templates copied: ${chalk.bold(result.copied)} files${result.skipped > 0 ? chalk.gray(` (skipped ${result.skipped})`) : ''}`
    );

    // Step 7: Save .cortexrc configuration (skip in dry-run mode)
    if (!options.dryRun) {
      const configSpinner = ora('Creating .cortexrc configuration...').start();

      try {
        const config = createConfigFromScope(
          answers.scope,
          answers.projectName,
          answers.customFiles
        );
        await saveConfig(cwd, config);
        configSpinner.succeed('Configuration saved');
      } catch (error) {
        configSpinner.fail('Failed to save configuration');
        throw error;
      }
    }

    // Step 8: Success message
    if (options.dryRun) {
      console.log(
        chalk.green.bold('\n✨ Dry run complete!'),
        chalk.gray('Run without --dry-run to apply changes.\n')
      );
    } else {
      console.log(chalk.green.bold('\n✨ Success!'), chalk.gray('Cortex TMS initialized.\n'));
    }

    // Show next steps (skip in dry-run mode)
    if (!options.dryRun) {
      console.log(chalk.bold('Next Steps:'));
      console.log(chalk.gray('  1. Review'), chalk.cyan('NEXT-TASKS.md'), chalk.gray('for active sprint tasks'));
      console.log(chalk.gray('  2. Update'), chalk.cyan('docs/core/'), chalk.gray('with your project details'));
      console.log(
        chalk.gray('  3. Customize'),
        chalk.cyan('.github/copilot-instructions.md'),
        chalk.gray('for AI rules')
      );

      if (!context.isGitRepo) {
        console.log(
          chalk.gray('\n  💡 Tip: Initialize git with'),
          chalk.cyan('git init'),
          chalk.gray('to track changes')
        );
      }

      console.log(
        chalk.gray('\n📚 Learn more:'),
        chalk.underline('https://github.com/yourusername/cortex-tms')
      );
      console.log();
    }
  } catch (error) {
    copySpinner.fail('Failed to copy templates');
    console.error(
      chalk.red('\n❌ Error:'),
      error instanceof Error ? error.message : 'Unknown error'
    );

    if (options.verbose && error instanceof Error && error.stack) {
      console.error(chalk.gray('\nStack trace:'));
      console.error(chalk.gray(error.stack));
    }

    process.exit(1);
  }
}

// Export the command
export const initCommand = createInitCommand();
