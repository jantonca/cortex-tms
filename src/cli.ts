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

program.addCommand(initCommand);
program.addCommand(validateCommand);

// Handle unknown commands
program.on('command:*', () => {
  console.error(
    chalk.red('\n❌ Invalid command:'),
    chalk.bold(program.args.join(' '))
  );
  console.log(chalk.gray('\nRun'), chalk.cyan('cortex-tms --help'), chalk.gray('to see available commands.'));
  process.exit(1);
});

// Parse command-line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
