/**
 * Cortex TMS CLI - Interactive Prompts
 *
 * Defines inquirer prompts for gathering user input during init
 */

import inquirer from 'inquirer';
import type { InitPromptAnswers, ProjectContext } from '../types/cli.js';
import { getDefaultProjectName } from './detection.js';
import { SCOPE_PRESETS } from './config.js';

/**
 * Run interactive prompts for the init command
 *
 * @param context - Detected project context
 * @param cwd - Current working directory
 * @returns User's answers
 */
export async function runInitPrompts(
  context: ProjectContext,
  cwd: string
): Promise<InitPromptAnswers> {
  const defaultName = getDefaultProjectName(cwd);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const answers = (await (inquirer.prompt as any)([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: defaultName,
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Project name is required';
        }
        if (input.length > 100) {
          return 'Project name must be 100 characters or less';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description (optional):',
      default: undefined,
    },
    {
      type: 'list',
      name: 'scope',
      message: 'What project scope would you like?',
      choices: SCOPE_PRESETS.map((preset) => ({
        name: `${preset.displayName} - ${preset.description}`,
        value: preset.name,
      })),
      default: 'standard',
    },
  ])) as InitPromptAnswers;

  // Add overwrite confirmation if files exist
  if (context.existingFiles.length > 0) {
    const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Warning: ${context.existingFiles.length} TMS file(s) already exist. Overwrite them?`,
        default: false,
      },
    ]);

    return { ...answers, overwrite };
  }

  return { ...answers, overwrite: false };
}

/**
 * Show a summary of what will be initialized
 *
 * @param answers - User's prompt answers
 * @param context - Project context
 */
export function showInitSummary(
  answers: InitPromptAnswers,
  context: ProjectContext
): void {
  const preset = SCOPE_PRESETS.find((p) => p.name === answers.scope);

  console.log('\n📋 Summary:');
  console.log(`  Project: ${answers.projectName}`);
  if (answers.description) {
    console.log(`  Description: ${answers.description}`);
  }
  console.log(
    `  Scope: ${preset?.displayName || answers.scope} (${preset?.mandatoryFiles.length || 0} mandatory files)`
  );

  if (context.isGitRepo) {
    console.log(`  Git: Repository detected ✓`);
  }

  if (context.hasPackageJson) {
    console.log(
      `  Package Manager: ${context.packageManager !== 'unknown' ? context.packageManager : 'npm (default)'}`
    );
  }

  if (answers.overwrite) {
    console.log(`  ⚠️  Will overwrite ${context.existingFiles.length} existing files`);
  }

  console.log();
}

/**
 * Ask for final confirmation before proceeding
 *
 * @returns true if user confirms, false otherwise
 */
export async function confirmInit(): Promise<boolean> {
  const { confirmed } = await inquirer.prompt<{ confirmed: boolean }>([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Initialize Cortex TMS with these settings?',
      default: true,
    },
  ]);

  return confirmed;
}
