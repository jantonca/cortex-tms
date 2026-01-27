/**
 * Cortex TMS CLI - Validation Engine
 *
 * Performs health checks on TMS projects to ensure compliance with
 * documentation standards (Rule 4, placeholder completion, etc.)
 */

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, basename } from 'path';
import type {
  ValidationCheck,
  ValidationResult,
  LineLimits,
  MandatoryFile,
  ProjectScope,
} from '../types/cli.js';
import {
  loadConfig,
  mergeConfig,
  getEffectiveLineLimits,
  saveConfig,
  createConfigFromScope,
  getScopePreset,
} from './config.js';
import { getTemplatesDir, processTemplate } from './templates.js';

/**
 * Default line limits for TMS files (Rule 4)
 * These limits ensure AI agents can efficiently process documentation
 */
export const DEFAULT_LINE_LIMITS: LineLimits = {
  'NEXT-TASKS.md': 200, // HOT - Current sprint only
  'FUTURE-ENHANCEMENTS.md': 500, // PLANNING - Backlog
  'ARCHITECTURE.md': 500, // WARM - System design
  'PATTERNS.md': 650, // WARM - Code patterns (reference manual with index)
  'DOMAIN-LOGIC.md': 400, // WARM - Business rules (includes Maintenance Protocol)
  'DECISIONS.md': 400, // WARM - ADRs
  'GLOSSARY.md': 200, // WARM - Terminology
  'SCHEMA.md': 600, // WARM - Data models
  'TROUBLESHOOTING.md': 400, // WARM - Common issues
};

/**
 * Mandatory files that must exist in a TMS project
 */
export const MANDATORY_FILES: MandatoryFile[] = [
  'NEXT-TASKS.md',
  '.github/copilot-instructions.md',
  'CLAUDE.md',
];

/**
 * Placeholder pattern to detect in files (Rule 3)
 * Matches placeholder syntax like [Project Name], [Description], etc.
 * Excludes:
 * - Markdown links: [text](url)
 * - Checkboxes: [x], [ ]
 * - Single chars: [a], [1]
 * - Code arrays: [major, minor, patch]
 */
const PLACEHOLDER_PATTERN = /\[([A-Z][a-zA-Z\s]+)\](?!\()/g;

/**
 * Count lines in a file
 */
async function countLines(filePath: string): Promise<number> {
  try {
    const content = await readFile(filePath, 'utf-8');
    return content.split('\n').length;
  } catch {
    return 0;
  }
}

/**
 * Scan file for unreplaced placeholders
 */
async function scanForPlaceholders(
  filePath: string
): Promise<{ found: boolean; placeholders: string[] }> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const matches = content.match(PLACEHOLDER_PATTERN);

    if (matches) {
      return {
        found: true,
        placeholders: [...new Set(matches)], // Remove duplicates
      };
    }

    return { found: false, placeholders: [] };
  } catch {
    return { found: false, placeholders: [] };
  }
}

/**
 * Scan file for AI-DRAFT markers
 * These indicate content populated by AI that needs human review
 */
async function scanForAIDrafts(
  filePath: string
): Promise<{ found: boolean; count: number }> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const matches = content.match(/<!--\s*AI-DRAFT.*?-->/gi);

    if (matches) {
      return {
        found: true,
        count: matches.length,
      };
    }

    return { found: false, count: 0 };
  } catch {
    return { found: false, count: 0 };
  }
}

/**
 * Count completed tasks in NEXT-TASKS.md
 */
async function countCompletedTasks(filePath: string): Promise<number> {
  try {
    const content = await readFile(filePath, 'utf-8');
    // Match table rows with ✅ Done status
    const doneMatches = content.match(/\|\s*✅\s*(Done|Complete)\s*\|/gi);
    return doneMatches ? doneMatches.length : 0;
  } catch {
    return 0;
  }
}

/**
 * Check if docs/archive/ directory exists
 */
function hasArchiveDirectory(cwd: string): boolean {
  return existsSync(join(cwd, 'docs/archive'));
}

/**
 * Fix function: Restore missing mandatory file from template
 */
async function fixMissingFile(cwd: string, file: string): Promise<void> {
  const templatesDir = getTemplatesDir();
  const sourcePath = join(templatesDir, file);
  const destPath = join(cwd, file);

  // Use project directory name as default project name
  const projectName = basename(cwd);
  const replacements = {
    'Project Name': projectName,
    'project-name': projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    Description: `A project powered by Cortex TMS`,
  };

  await processTemplate(sourcePath, destPath, replacements);
}

/**
 * Validate file size limits (Rule 4)
 */
export async function validateFileSizes(
  cwd: string,
  limits: LineLimits = DEFAULT_LINE_LIMITS
): Promise<ValidationCheck[]> {
  const checks: ValidationCheck[] = [];

  for (const [filename, limit] of Object.entries(limits)) {
    const filePath = join(cwd, filename);

    if (!existsSync(filePath)) {
      continue; // Skip if file doesn't exist
    }

    const lineCount = await countLines(filePath);

    if (lineCount > limit) {
      checks.push({
        name: `File Size: ${filename}`,
        passed: false,
        level: 'warning',
        message: `${filename} exceeds recommended line limit`,
        details: `Current: ${lineCount} lines | Limit: ${limit} lines | Overage: ${lineCount - limit} lines`,
        file: filename,
      });
    } else {
      checks.push({
        name: `File Size: ${filename}`,
        passed: true,
        level: 'info',
        message: `${filename} is within size limits`,
        details: `${lineCount}/${limit} lines`,
        file: filename,
      });
    }
  }

  return checks;
}

/**
 * Get mandatory files for a specific scope
 */
function getMandatoryFilesForScope(scope?: string): MandatoryFile[] {
  // If no scope specified, use hardcoded defaults (backwards compatibility)
  if (!scope) {
    return MANDATORY_FILES;
  }

  // Get scope preset
  const preset = getScopePreset(scope as ProjectScope);

  if (!preset) {
    // Unknown scope - use defaults
    return MANDATORY_FILES;
  }

  // Return mandatory files from scope preset
  return preset.mandatoryFiles as MandatoryFile[];
}

/**
 * Validate mandatory files exist (scope-aware)
 */
export function validateMandatoryFiles(
  cwd: string,
  scope?: string
): ValidationCheck[] {
  const checks: ValidationCheck[] = [];
  const mandatoryFiles = getMandatoryFilesForScope(scope);

  for (const file of mandatoryFiles) {
    const filePath = join(cwd, file);
    const exists = existsSync(filePath);

    checks.push({
      name: `Mandatory File: ${file}`,
      passed: exists,
      level: exists ? 'info' : 'error',
      message: exists
        ? `${file} exists`
        : `${file} is missing (required for TMS)`,
      file,
      // Add fix function for missing files
      ...(!exists && {
        fix: async (cwd: string) => fixMissingFile(cwd, file),
      }),
    });
  }

  return checks;
}

/**
 * Fix function: Generate missing .cortexrc configuration
 */
async function fixMissingConfig(cwd: string): Promise<void> {
  // Try to detect scope from existing files
  const hasGlossary = existsSync(join(cwd, 'docs/core/GLOSSARY.md'));
  const hasSchema = existsSync(join(cwd, 'docs/core/SCHEMA.md'));
  const hasArchitecture = existsSync(join(cwd, 'docs/core/ARCHITECTURE.md'));

  let scope: 'nano' | 'standard' | 'enterprise' = 'standard';

  if (hasGlossary || hasSchema) {
    scope = 'enterprise';
  } else if (!hasArchitecture) {
    scope = 'nano';
  }

  const projectName = basename(cwd);
  const config = createConfigFromScope(scope, projectName);
  await saveConfig(cwd, config);
}

/**
 * Validate .cortexrc configuration exists
 */
export function validateConfig(cwd: string): ValidationCheck[] {
  const configPath = join(cwd, '.cortexrc');
  const exists = existsSync(configPath);

  return [
    {
      name: 'Configuration File',
      passed: exists,
      level: exists ? 'info' : 'error',
      message: exists
        ? '.cortexrc configuration exists'
        : '.cortexrc is missing (required for TMS validation)',
      file: '.cortexrc',
      ...(!exists && {
        fix: fixMissingConfig,
      }),
    },
  ];
}

/**
 * Validate no unreplaced placeholders and check for AI-DRAFT markers
 */
export async function validatePlaceholders(
  cwd: string,
  ignoreFiles: string[] = []
): Promise<ValidationCheck[]> {
  const checks: ValidationCheck[] = [];

  // Files to scan for placeholders and AI-DRAFT markers
  const filesToScan = [
    'README.md',
    'NEXT-TASKS.md',
    'CLAUDE.md',
    'FUTURE-ENHANCEMENTS.md',
    'docs/core/ARCHITECTURE.md',
    'docs/core/PATTERNS.md',
    'docs/core/DOMAIN-LOGIC.md',
  ];

  for (const file of filesToScan) {
    // Skip if file is in ignore list
    if (ignoreFiles.includes(file)) {
      continue;
    }

    const filePath = join(cwd, file);

    if (!existsSync(filePath)) {
      continue;
    }

    // Check for placeholders and AI-DRAFT markers
    const [placeholderResult, draftResult] = await Promise.all([
      scanForPlaceholders(filePath),
      scanForAIDrafts(filePath),
    ]);

    // Priority 1: Incomplete (has placeholders) - highest severity
    if (placeholderResult.found) {
      checks.push({
        name: `Completion: ${file}`,
        passed: false,
        level: 'error',
        message: `${file} is incomplete (contains placeholder text)`,
        details: `Found: ${placeholderResult.placeholders.join(', ')}\n💡 Run 'cortex-tms prompt bootstrap' with your AI agent to populate this file.`,
        file,
      });
    }
    // Priority 2: AI-DRAFT (has draft markers) - needs human review
    else if (draftResult.found) {
      checks.push({
        name: `Completion: ${file}`,
        passed: true, // Not a hard failure - content exists
        level: 'warning',
        message: `${file} contains AI-generated drafts (needs human review)`,
        details: `${draftResult.count} draft section${draftResult.count > 1 ? 's' : ''} marked with <!-- AI-DRAFT -->\n💡 Review the AI-generated content and remove the <!-- AI-DRAFT --> markers once accepted.`,
        file,
      });
    }
    // Priority 3: Complete (no placeholders, no drafts)
    else {
      checks.push({
        name: `Completion: ${file}`,
        passed: true,
        level: 'info',
        message: `${file} is complete and reviewed`,
        file,
      });
    }
  }

  return checks;
}

/**
 * Validate archive status (too many completed tasks not archived)
 */
export async function validateArchiveStatus(cwd: string): Promise<ValidationCheck[]> {
  const checks: ValidationCheck[] = [];

  const nextTasksPath = join(cwd, 'NEXT-TASKS.md');

  if (!existsSync(nextTasksPath)) {
    return checks; // Skip if file doesn't exist
  }

  const completedCount = await countCompletedTasks(nextTasksPath);
  const hasArchive = hasArchiveDirectory(cwd);

  if (completedCount > 10) {
    checks.push({
      name: 'Archive Status',
      passed: false,
      level: 'warning',
      message: 'Too many completed tasks in NEXT-TASKS.md',
      details: `${completedCount} completed tasks should be archived to docs/archive/`,
      file: 'NEXT-TASKS.md',
    });
  } else if (completedCount > 5) {
    checks.push({
      name: 'Archive Status',
      passed: true,
      level: 'info',
      message: 'Consider archiving completed tasks soon',
      details: `${completedCount} completed tasks in NEXT-TASKS.md`,
      file: 'NEXT-TASKS.md',
    });
  } else {
    checks.push({
      name: 'Archive Status',
      passed: true,
      level: 'info',
      message: 'Active task list is healthy',
      details: `${completedCount} completed tasks`,
      file: 'NEXT-TASKS.md',
    });
  }

  if (!hasArchive && completedCount > 0) {
    checks.push({
      name: 'Archive Directory',
      passed: false,
      level: 'warning',
      message: 'No archive directory found',
      details: 'Create docs/archive/ to store completed sprint history',
    });
  }

  return checks;
}

/**
 * Run all validation checks
 */
export async function validateProject(
  cwd: string,
  options: { strict?: boolean; limits?: LineLimits } = {}
): Promise<ValidationResult> {
  const { strict = false } = options;

  // Load configuration (if exists)
  const userConfig = await loadConfig(cwd);
  const config = mergeConfig(userConfig);

  // Get effective line limits (config overrides > scope presets > defaults)
  const limits = options.limits || getEffectiveLineLimits(config);

  // Get ignore list for placeholder validation
  const ignoreFiles = config.validation?.ignoreFiles || [];

  // Run all checks in parallel
  const [fileSizeChecks, mandatoryChecks, configChecks, placeholderChecks, archiveChecks] =
    await Promise.all([
      validateFileSizes(cwd, limits),
      Promise.resolve(validateMandatoryFiles(cwd, config.scope)),
      Promise.resolve(validateConfig(cwd)),
      validatePlaceholders(cwd, ignoreFiles),
      validateArchiveStatus(cwd),
    ]);

  const checks = [
    ...mandatoryChecks,
    ...configChecks,
    ...fileSizeChecks,
    ...placeholderChecks,
    ...archiveChecks,
  ];

  // Calculate summary
  const summary = {
    total: checks.length,
    passed: checks.filter((c) => c.passed).length,
    warnings: checks.filter((c) => c.level === 'warning').length,
    errors: checks.filter((c) => c.level === 'error').length,
  };

  // Determine overall pass/fail
  const hasErrors = summary.errors > 0;
  const hasWarnings = summary.warnings > 0;
  const passed = strict ? !hasErrors && !hasWarnings : !hasErrors;

  return {
    passed,
    checks,
    summary,
  };
}
