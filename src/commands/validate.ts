/**
 * Cortex TMS CLI - Validate Command
 *
 * Performs health checks on TMS projects to ensure compliance with
 * documentation standards and best practices.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { validateProject } from '../utils/validator.js';
import type { ValidateCommandOptions } from '../types/cli.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Get emoji for check result
 */
function getCheckEmoji(level: 'info' | 'warning' | 'error', passed: boolean): string {
  if (passed) {
    return chalk.green('✓');
  }
  if (level === 'error') {
    return chalk.red('✗');
  }
  return chalk.yellow('⚠');
}

/**
 * Get color function for check level
 */
function getColorForLevel(level: 'info' | 'warning' | 'error'): typeof chalk {
  switch (level) {
    case 'error':
      return chalk.red;
    case 'warning':
      return chalk.yellow;
    case 'info':
      return chalk.gray;
  }
}

/**
 * Format validation check for display
 */
function formatCheck(
  check: {
    name: string;
    passed: boolean;
    level: 'info' | 'warning' | 'error';
    message: string;
    details?: string;
  },
  verbose: boolean
): string {
  const emoji = getCheckEmoji(check.level, check.passed);
  const color = getColorForLevel(check.level);

  let output = `  ${emoji} ${color(check.message)}`;

  if (verbose && check.details) {
    output += `\n    ${chalk.gray(check.details)}`;
  }

  return output;
}

/**
 * Create and configure the validate command
 */
export function createValidateCommand(): Command {
  const validateCommand = new Command('validate');

  validateCommand
    .description('Validate TMS project health and compliance')
    .option('-s, --strict', 'Treat warnings as errors')
    .option('-v, --verbose', 'Show detailed check information')
    .option('-f, --fix', 'Auto-fix issues where possible (e.g., recreate missing files)')
    .action(async (options: ValidateCommandOptions) => {
      await runValidate(options);
    });

  return validateCommand;
}

/**
 * Main validate command logic
 */
async function runValidate(options: ValidateCommandOptions): Promise<void> {
  const cwd = process.cwd();

  console.log(chalk.bold.cyan('\n🔍 Cortex TMS Validation\n'));

  // Run validation
  const spinner = ora('Running health checks...').start();

  try {
    const result = await validateProject(cwd, {
      strict: options.strict || false,
    });

    spinner.stop();

    // If --fix flag is present, attempt to fix issues
    if (options.fix) {
      const fixableIssues = result.checks.filter((c) => !c.passed && c.fix);

      if (fixableIssues.length > 0) {
        console.log(chalk.bold.yellow(`\n🔧 Auto-fixing ${fixableIssues.length} issue(s)...\n`));

        for (const check of fixableIssues) {
          const fixSpinner = ora(`Fixing: ${check.message}`).start();

          try {
            await check.fix!(cwd);
            fixSpinner.succeed(chalk.green(`Fixed: ${check.file || check.name}`));
          } catch (error) {
            fixSpinner.fail(
              chalk.red(
                `Failed to fix ${check.file || check.name}: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`
              )
            );
          }
        }

        console.log(chalk.bold.green('\n✨ Auto-fix complete! Re-running validation...\n'));

        // Re-run validation to show updated results
        const revalidateSpinner = ora('Re-validating...').start();
        const updatedResult = await validateProject(cwd, {
          strict: options.strict || false,
        });
        revalidateSpinner.stop();

        // Update result with re-validation
        result.checks = updatedResult.checks;
        result.summary = updatedResult.summary;
        result.passed = updatedResult.passed;
      } else {
        console.log(chalk.gray('\nNo auto-fixable issues found.\n'));
      }
    }

    // Group checks by category
    const mandatoryChecks = result.checks.filter((c) =>
      c.name.startsWith('Mandatory File')
    );
    const configChecks = result.checks.filter((c) =>
      c.name === 'Configuration File'
    );
    const fileSizeChecks = result.checks.filter((c) =>
      c.name.startsWith('File Size')
    );
    const placeholderChecks = result.checks.filter((c) =>
      c.name.startsWith('Completion:')
    );
    const archiveChecks = result.checks.filter(
      (c) => c.name === 'Archive Status' || c.name === 'Archive Directory'
    );

    // Display results by category
    if (mandatoryChecks.length > 0) {
      console.log(chalk.bold('\n📋 Mandatory Files'));
      mandatoryChecks.forEach((check) => {
        console.log(formatCheck(check, options.verbose || false));
      });
    }

    if (configChecks.length > 0) {
      console.log(chalk.bold('\n⚙️  Configuration'));
      configChecks.forEach((check) => {
        console.log(formatCheck(check, options.verbose || false));
      });
    }

    if (fileSizeChecks.length > 0 && options.verbose) {
      console.log(chalk.bold('\n📏 File Size Limits (Rule 4)'));
      fileSizeChecks.forEach((check) => {
        console.log(formatCheck(check, options.verbose || false));
      });
    } else if (fileSizeChecks.some((c) => !c.passed)) {
      // Only show file size issues if there are problems
      console.log(chalk.bold('\n📏 File Size Limits (Rule 4)'));
      fileSizeChecks
        .filter((c) => !c.passed)
        .forEach((check) => {
          console.log(formatCheck(check, options.verbose || false));
        });
    }

    if (placeholderChecks.length > 0 && options.verbose) {
      console.log(chalk.bold('\n🔧 Placeholder Completion'));
      placeholderChecks.forEach((check) => {
        console.log(formatCheck(check, options.verbose || false));
      });
    } else if (placeholderChecks.some((c) => !c.passed)) {
      // Only show placeholder issues if there are problems
      console.log(chalk.bold('\n🔧 Placeholder Completion'));
      placeholderChecks
        .filter((c) => !c.passed)
        .forEach((check) => {
          console.log(formatCheck(check, options.verbose || false));
        });
    }

    if (archiveChecks.length > 0) {
      console.log(chalk.bold('\n📦 Archive Status'));
      archiveChecks.forEach((check) => {
        console.log(formatCheck(check, options.verbose || false));
      });
    }

    // Display summary
    console.log(chalk.bold('\n📊 Summary\n'));

    const { summary } = result;

    console.log(`  Total Checks: ${chalk.bold(summary.total)}`);
    console.log(`  ${chalk.green('✓')} Passed: ${chalk.bold(summary.passed)}`);

    if (summary.warnings > 0) {
      console.log(
        `  ${chalk.yellow('⚠')} Warnings: ${chalk.bold(summary.warnings)}`
      );
    }

    if (summary.errors > 0) {
      console.log(`  ${chalk.red('✗')} Errors: ${chalk.bold(summary.errors)}`);
    }

    // Overall result
    console.log();
    if (result.passed) {
      console.log(
        chalk.green.bold('✨ Validation passed!'),
        chalk.gray('Your TMS project is healthy.')
      );
    } else {
      if (options.strict && summary.warnings > 0) {
        console.log(
          chalk.red.bold('❌ Validation failed!'),
          chalk.gray('(Strict mode: warnings treated as errors)')
        );
      } else {
        console.log(
          chalk.red.bold('❌ Validation failed!'),
          chalk.gray('Please fix the errors above.')
        );
      }
    }

    // Helpful tips
    if (summary.errors > 0 || summary.warnings > 0) {
      console.log(chalk.bold('\n💡 Tips:\n'));

      const hasFixableIssues = result.checks.some((c) => !c.passed && c.fix);

      if (hasFixableIssues && !options.fix) {
        console.log(
          chalk.gray('  • Run'),
          chalk.cyan('cortex-tms validate --fix'),
          chalk.gray('to auto-fix common issues')
        );
      }

      if (result.checks.some((c) => c.message.includes('missing'))) {
        console.log(
          chalk.gray('  • Run'),
          chalk.cyan('cortex-tms init'),
          chalk.gray('to create missing files')
        );
      }

      if (result.checks.some((c) => c.message.includes('placeholders'))) {
        console.log(
          chalk.gray('  • Replace [Placeholders] with actual values')
        );
      }

      if (result.checks.some((c) => c.message.includes('exceeds'))) {
        console.log(
          chalk.gray('  • Archive completed tasks to reduce file size')
        );
        console.log(
          chalk.gray('  • Move to'),
          chalk.cyan('docs/archive/'),
          chalk.gray('for historical reference')
        );
      }

      if (result.checks.some((c) => c.message.includes('completed tasks'))) {
        console.log(
          chalk.gray('  • Archive completed tasks from NEXT-TASKS.md')
        );
        console.log(
          chalk.gray('  • Create'),
          chalk.cyan('docs/archive/sprint-YYYY-MM.md'),
          chalk.gray('if needed')
        );
      }
    }

    console.log();

    // Throw error if validation failed
    if (!result.passed) {
      throw new ValidationError('Validation failed', {
        errors: summary.errors,
        warnings: summary.warnings,
        strict: options.strict ?? false,
      });
    }
  } catch (error) {
    spinner.fail('Validation failed');

    if (options.verbose && error instanceof Error && error.stack) {
      console.error(chalk.gray('\nStack trace:'));
      console.error(chalk.gray(error.stack));
    }

    throw error instanceof Error ? error : new Error('Unknown error');
  }
}

// Export the command
export const validateCommand = createValidateCommand();
