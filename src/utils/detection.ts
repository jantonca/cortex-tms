/**
 * Cortex TMS CLI - Project Context Detection
 *
 * Detects existing project structure to provide intelligent defaults
 * and warnings when initializing TMS in existing projects.
 */

import { existsSync } from 'fs';
import { join, basename } from 'path';
import type { ProjectContext } from '../types/cli.js';

/**
 * Detect project context in the current working directory
 *
 * @param cwd - Current working directory path
 * @returns ProjectContext with detection results
 */
export function detectContext(cwd: string): ProjectContext {
  const isGitRepo = existsSync(join(cwd, '.git'));
  const hasPackageJson = existsSync(join(cwd, 'package.json'));

  // Detect package manager from lock files
  let packageManager: ProjectContext['packageManager'] = 'unknown';
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) {
    packageManager = 'pnpm';
  } else if (existsSync(join(cwd, 'yarn.lock'))) {
    packageManager = 'yarn';
  } else if (existsSync(join(cwd, 'package-lock.json'))) {
    packageManager = 'npm';
  } else if (existsSync(join(cwd, 'bun.lockb'))) {
    packageManager = 'bun';
  }

  // Check for existing TMS files
  const existingFiles: string[] = [];
  const tmsFiles = [
    'NEXT-TASKS.md',
    'FUTURE-ENHANCEMENTS.md',
    'CLAUDE.md',
    'README.md',
    '.github/copilot-instructions.md',
    'docs/core/ARCHITECTURE.md',
    'docs/core/PATTERNS.md',
    'docs/core/DOMAIN-LOGIC.md',
  ];

  for (const file of tmsFiles) {
    if (existsSync(join(cwd, file))) {
      existingFiles.push(file);
    }
  }

  return {
    isGitRepo,
    hasPackageJson,
    packageManager,
    existingFiles,
  };
}

/**
 * Get a sensible project name default from the current directory
 *
 * @param cwd - Current working directory path
 * @returns Sanitized directory name suitable for project name
 */
export function getDefaultProjectName(cwd: string): string {
  const dirName = basename(cwd);

  // Convert to kebab-case and remove invalid characters
  return dirName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Check if the current directory is safe to initialize
 *
 * @param context - Project context from detectContext()
 * @returns true if safe, false if caution needed
 */
export function isSafeToInitialize(context: ProjectContext): boolean {
  // If no TMS files exist, it's safe
  if (context.existingFiles.length === 0) {
    return true;
  }

  // If only README exists, it's probably safe (but we'll still warn)
  if (
    context.existingFiles.length === 1 &&
    context.existingFiles[0] === 'README.md'
  ) {
    return true;
  }

  // Multiple TMS files exist - needs user confirmation
  return false;
}
