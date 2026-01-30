#!/usr/bin/env node

/**
 * Cortex TMS CLI - Main Entry Point
 *
 * This file defines the CLI structure using Commander.js and delegates
 * to individual command files in src/commands/
 */

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';
import { CLIError, ValidationError, formatError } from './utils/errors.js';
import { sanitizeApiKey } from './utils/sanitize.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version info
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

// Configure CLI metadata
program
  .name('cortex-tms')
  .description(
    chalk.bold('🧠 Cortex TMS') +
      '\n' +
      chalk.gray('The Universal AI-Optimized Project Boilerplate\n') +
      chalk.gray('Initialize your project with TMS documentation structure')
  )
  .version(packageJson.version, '-v, --version', 'Output the current version')
  .helpOption('-h, --help', 'Display help for command');

// Register commands
import { initCommand } from './commands/init.js';
import { validateCommand } from './commands/validate.js';
import { statusCommand } from './commands/status.js';
import { migrateCommand } from './commands/migrate.js';
import { promptCommand } from './commands/prompt.js';
import { tutorialCommand } from './commands/tutorial.js';
import { reviewCommand } from './commands/review.js';
import { autoTierCommand } from './commands/auto-tier.js';

program.addCommand(initCommand);
program.addCommand(validateCommand);
program.addCommand(statusCommand);
program.addCommand(migrateCommand);
program.addCommand(promptCommand);
program.addCommand(tutorialCommand);
program.addCommand(reviewCommand);
program.addCommand(autoTierCommand);

// Handle unknown commands
program.on('command:*', () => {
  throw new ValidationError('Invalid command', {
    command: program.args.join(' '),
    hint: 'Run "cortex-tms --help" to see available commands',
  });
});

// Global error handler - catches errors from commands
program.exitOverride(); // Prevent Commander from exiting on its own

// Parse command-line arguments and handle errors
try {
  await program.parseAsync(process.argv);
} catch (error) {
  // Handle CLIError instances with formatted output
  if (error instanceof CLIError) {
    console.error(chalk.red('\n❌ Error:'), formatError(error));
    process.exit(error.exitCode);
  }

  // Handle Commander errors (invalid usage, unknown options, etc.)
  if (error instanceof Error) {
    if ('code' in error && typeof error.code === 'string') {
      // Commander errors are already displayed, just exit
      process.exit(1);
    }

    // Other unexpected errors - display them (with sanitization)
    if (!error.message.includes('(outputHelp)')) {
      const sanitizedMessage = sanitizeApiKey(error.message);
      console.error(chalk.red('\n❌ Error:'), sanitizedMessage);
    }
  }

  process.exit(1);
}

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
