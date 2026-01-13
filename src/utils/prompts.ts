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
 * Available template files with user-friendly labels
 */
const AVAILABLE_TEMPLATES = [
  { value: 'NEXT-TASKS.md', name: 'NEXT-TASKS.md - Active sprint tasks (mandatory)' },
  { value: 'CLAUDE.md', name: 'CLAUDE.md - Agent workflow config (mandatory)' },
  { value: '.github/copilot-instructions.md', name: '.github/copilot-instructions.md - AI rules (recommended)' },
  { value: 'FUTURE-ENHANCEMENTS.md', name: 'FUTURE-ENHANCEMENTS.md - Backlog & ideas' },
  { value: 'docs/core/ARCHITECTURE.md', name: 'ARCHITECTURE.md - System design' },
  { value: 'docs/core/PATTERNS.md', name: 'PATTERNS.md - Code conventions' },
  { value: 'docs/core/DOMAIN-LOGIC.md', name: 'DOMAIN-LOGIC.md - Business rules' },
  { value: 'docs/core/DECISIONS.md', name: 'DECISIONS.md - Architecture decisions' },
  { value: 'docs/core/GLOSSARY.md', name: 'GLOSSARY.md - Project terminology' },
  { value: 'docs/core/SCHEMA.md', name: 'SCHEMA.md - Data models' },
  { value: 'docs/core/TROUBLESHOOTING.md', name: 'TROUBLESHOOTING.md - Common issues' },
];

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

  // If custom scope is selected, prompt for specific files
  if (answers.scope === 'custom') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { customFiles } = await (inquirer.prompt as any)({
      type: 'checkbox',
      name: 'customFiles',
      message: 'Select files to include (use space to select, enter to confirm):',
      choices: AVAILABLE_TEMPLATES,
      default: ['NEXT-TASKS.md', 'CLAUDE.md', '.github/copilot-instructions.md'],
      validate: (input: string[]) => {
        // Must include at least NEXT-TASKS.md (core requirement)
        if (!input.includes('NEXT-TASKS.md')) {
          return 'You must include NEXT-TASKS.md (mandatory for TMS)';
        }
        if (input.length === 0) {
          return 'You must select at least one file';
        }
        return true;
      },
    });

    answers.customFiles = customFiles;
  }

  // Ask about VS Code snippets for Standard, Enterprise, or substantial Custom setups
  const shouldOfferSnippets =
    answers.scope === 'standard' ||
    answers.scope === 'enterprise' ||
    (answers.scope === 'custom' && (answers.customFiles?.length ?? 0) >= 3);

  if (shouldOfferSnippets) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { installSnippets } = await (inquirer.prompt as any)({
      type: 'confirm',
      name: 'installSnippets',
      message: 'Install VS Code snippet library for TMS documentation? (Recommended)',
      default: true,
    });

    answers.installSnippets = installSnippets;
  }

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

  if (answers.scope === 'custom' && answers.customFiles) {
    console.log(`  Scope: ${preset?.displayName || answers.scope} (${answers.customFiles.length} files selected)`);
    console.log(`  Files: ${answers.customFiles.join(', ')}`);
  } else {
    console.log(
      `  Scope: ${preset?.displayName || answers.scope} (${(preset?.mandatoryFiles.length || 0) + (preset?.optionalFiles.length || 0)} files)`
    );
  }

  if (context.isGitRepo) {
    console.log(`  Git: Repository detected ✓`);
  }

  if (context.hasPackageJson) {
    console.log(
      `  Package Manager: ${context.packageManager !== 'unknown' ? context.packageManager : 'npm (default)'}`
    );
  }

  if (answers.installSnippets) {
    console.log(`  VS Code Snippets: Will install to .vscode/`);
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
