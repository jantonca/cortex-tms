/**
 * Cortex TMS CLI - Init Command
 *
 * Initializes Cortex TMS documentation structure in the current directory
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { basename, join } from 'path';
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
      throw new Error(
        `Invalid scope "${options.scope}". Must be one of: ${validScopes.join(', ')}`
      );
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

    // Auto-install snippets for Standard and Enterprise scopes in non-interactive mode
    const installSnippets = scope === 'standard' || scope === 'enterprise';

    answers = {
      projectName: defaultName,
      scope,
      overwrite: options.force ?? false,
      installSnippets,
    };

    if (options.verbose) {
      console.log(chalk.gray('\nUsing non-interactive mode:'));
      console.log(chalk.gray(`  Project Name: ${answers.projectName}`));
      console.log(chalk.gray(`  Scope: ${answers.scope}`));
      console.log(chalk.gray(`  Overwrite: ${answers.overwrite}`));
      console.log(chalk.gray(`  Install Snippets: ${answers.installSnippets}`));
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
      throw new Error('TMS files already exist');
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

    // Step 7: Install VS Code snippets if requested (skip in dry-run mode)
    if (!options.dryRun && answers.installSnippets) {
      const snippetsSpinner = ora('Installing VS Code snippets...').start();

      try {
        const templatesDir = getTemplatesDir();
        const snippetSource = join(templatesDir, 'vscode', 'tms.code-snippets');
        const snippetDest = join(cwd, '.vscode', 'tms.code-snippets');

        // Check if source snippet file exists
        const fs = (await import('fs-extra')).default;
        if (await fs.pathExists(snippetSource)) {
          // Ensure .vscode directory exists
          await fs.ensureDir(join(cwd, '.vscode'));

          // Copy snippet file
          await fs.copyFile(snippetSource, snippetDest);
          snippetsSpinner.succeed('VS Code snippets installed to .vscode/tms.code-snippets');
        } else {
          snippetsSpinner.warn('Snippet file not found, skipping');
        }
      } catch (error) {
        snippetsSpinner.fail('Failed to install snippets');
        if (options.verbose) {
          console.error(
            chalk.gray('Error details:'),
            error instanceof Error ? error.message : 'Unknown error'
          );
        }
        // Don't throw - snippets are optional
      }
    }

    // Step 8: Save .cortexrc configuration (skip in dry-run mode)
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

    // Step 9: Success message
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
      console.log(chalk.bold('🚀 Quick Start'), chalk.gray('(choose one):'));
      console.log();
      console.log(chalk.cyan('  Option A - With your AI agent'), chalk.gray('(recommended):'));
      console.log(chalk.gray('    1. Open your AI tool (Claude Code, Copilot, Cursor, etc.)'));
      console.log(chalk.gray('    2. Run:'), chalk.cyan('cortex-tms prompt bootstrap'));
      console.log(chalk.gray('    3. Paste the prompt - your AI will analyze the codebase and'));
      console.log(chalk.gray('       populate your documentation files as drafts for you to review'));
      console.log();
      console.log(chalk.cyan('  Option B - Manual setup:'));
      console.log(chalk.gray('    1. Review'), chalk.cyan('NEXT-TASKS.md'), chalk.gray('for active sprint tasks'));
      console.log(chalk.gray('    2. Update'), chalk.cyan('docs/core/'), chalk.gray('with your project details'));
      console.log(chalk.gray('    3. Customize'), chalk.cyan('.github/copilot-instructions.md'));

      if (answers.installSnippets) {
        console.log();
        console.log(
          chalk.gray('  💡 Tip: Use'),
          chalk.cyan('tms-adr'),
          chalk.gray('or'),
          chalk.cyan('tms-pattern'),
          chalk.gray('snippets in VS Code for rapid documentation')
        );
      }

      if (!context.isGitRepo) {
        console.log();
        console.log(
          chalk.gray('  💡 Tip: Initialize git with'),
          chalk.cyan('git init'),
          chalk.gray('to track changes')
        );
      }

      console.log();
      console.log(
        chalk.gray('📚 Learn more:'),
        chalk.underline('https://cortex-tms.org')
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

    throw error instanceof Error ? error : new Error('Unknown error');
  }
}

// Export the command
export const initCommand = createInitCommand();
