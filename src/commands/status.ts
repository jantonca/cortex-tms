/**
 * Cortex TMS CLI - Status Command
 *
 * Provides a high-level project dashboard showing scope, sprint progress,
 * health summary, and backlog size.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getProjectStatus, calculateProgress } from '../utils/status.js';
import { validateProject } from '../utils/validator.js';

/**
 * Create and configure the status command
 */
export function createStatusCommand(): Command {
  const statusCommand = new Command('status');

  statusCommand
    .description('Show project health dashboard')
    .action(async () => {
      await runStatus();
    });

  return statusCommand;
}

/**
 * Main status command logic
 */
async function runStatus(): Promise<void> {
  const cwd = process.cwd();

  console.log(chalk.bold.cyan('\n📊 Cortex TMS Status Dashboard\n'));

  // Gather status information
  const spinner = ora('Gathering project information...').start();

  try {
    const status = await getProjectStatus(cwd);
    const validation = await validateProject(cwd, { strict: false });

    spinner.succeed('Project information loaded');

    // Project Identity Section
    console.log(chalk.bold('\n🏷️  Project Identity'));
    console.log(`  ${chalk.cyan('Name:')} ${status.projectName}`);
    console.log(
      `  ${chalk.cyan('Scope:')} ${formatScope(status.scope)} ${getScopeEmoji(status.scope)}`
    );
    if (status.config) {
      console.log(`  ${chalk.cyan('TMS Version:')} ${status.config.version}`);
    }

    // Health Section
    console.log(chalk.bold('\n💚 Project Health'));
    const healthEmoji = validation.passed ? '✅' : '⚠️';
    const healthText = validation.passed ? chalk.green('Healthy') : chalk.yellow('Issues Found');
    console.log(`  ${healthEmoji} ${healthText}`);
    console.log(
      `  ${chalk.cyan('Checks:')} ${validation.summary.passed}/${validation.summary.total} passed`
    );
    if (validation.summary.warnings > 0) {
      console.log(`  ${chalk.yellow('⚠')} ${validation.summary.warnings} warnings`);
    }
    if (validation.summary.errors > 0) {
      console.log(`  ${chalk.red('✗')} ${validation.summary.errors} errors`);
    }

    // Sprint Section
    if (status.sprint) {
      console.log(chalk.bold('\n🎯 Current Sprint'));
      console.log(`  ${chalk.cyan('Name:')} ${status.sprint.name}`);
      if (status.sprint.description) {
        console.log(`  ${chalk.cyan('Focus:')} ${status.sprint.description}`);
      }

      const progress = calculateProgress(status.sprint);
      const progressBar = createProgressBar(progress, 20);
      const progressColor = progress === 100 ? chalk.green : progress >= 50 ? chalk.yellow : chalk.gray;

      console.log(`  ${chalk.cyan('Progress:')} ${progressBar} ${progressColor(`${progress}%`)}`);
      console.log(
        `  ${chalk.cyan('Tasks:')} ${status.sprint.completedTasks} done, ${status.sprint.inProgressTasks} in progress, ${status.sprint.todoTasks} todo`
      );
    } else {
      console.log(chalk.bold('\n🎯 Current Sprint'));
      console.log(chalk.gray('  No active sprint found in NEXT-TASKS.md'));
    }

    // Backlog Section
    console.log(chalk.bold('\n📋 Backlog'));
    if (status.backlogSize > 0) {
      console.log(`  ${chalk.cyan('Future Enhancements:')} ${status.backlogSize} items pending`);
    } else {
      console.log(chalk.gray('  No backlog items found in FUTURE-ENHANCEMENTS.md'));
    }

    // Quick Actions
    console.log(chalk.bold('\n⚡ Quick Actions'));
    console.log(chalk.gray('  Run'), chalk.cyan('cortex-tms validate'), chalk.gray('for detailed health checks'));
    console.log(chalk.gray('  Edit'), chalk.cyan('NEXT-TASKS.md'), chalk.gray('to update sprint tasks'));
    if (validation.summary.warnings > 0 || validation.summary.errors > 0) {
      console.log(
        chalk.gray('  Run'),
        chalk.cyan('cortex-tms validate --fix'),
        chalk.gray('to auto-fix issues')
      );
    }

    console.log(); // Add trailing newline
  } catch (error) {
    spinner.fail('Failed to gather project information');
    console.error(
      chalk.red('\n❌ Error:'),
      error instanceof Error ? error.message : 'Unknown error'
    );
    process.exit(1);
  }
}

/**
 * Format scope name with proper capitalization
 */
function formatScope(scope: string): string {
  return scope.charAt(0).toUpperCase() + scope.slice(1).toLowerCase();
}

/**
 * Get emoji for project scope
 */
function getScopeEmoji(scope: string): string {
  switch (scope.toLowerCase()) {
    case 'nano':
      return '🔬';
    case 'standard':
      return '📦';
    case 'enterprise':
      return '🏢';
    default:
      return '❓';
  }
}

/**
 * Create a visual progress bar
 *
 * @param progress - Progress percentage (0-100)
 * @param width - Width of the progress bar in characters
 * @returns Formatted progress bar string
 */
function createProgressBar(progress: number, width: number): string {
  const filled = Math.round((progress / 100) * width);
  const empty = width - filled;

  const filledColor = progress === 100 ? chalk.green : progress >= 50 ? chalk.yellow : chalk.gray;

  return `[${filledColor('█'.repeat(filled))}${chalk.gray('░'.repeat(empty))}]`;
}

// Export the command
export const statusCommand = createStatusCommand();
