/**
 * Cortex TMS CLI - Type Definitions
 *
 * TypeScript interfaces for the CLI tool
 */

/**
 * User responses from the interactive init prompt
 */
export interface InitPromptAnswers {
  projectName: string;
  description?: string;
  includeTemplates: TemplateSelection[];
  overwrite: boolean;
}

/**
 * Template categories that can be selected during init
 */
export type TemplateSelection =
  | 'all'
  | 'minimal'
  | 'core-docs'
  | 'workflow-files'
  | 'example-app';

/**
 * Configuration for project detection
 */
export interface ProjectContext {
  isGitRepo: boolean;
  hasPackageJson: boolean;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun' | 'unknown';
  existingFiles: string[];
}

/**
 * Template file metadata
 */
export interface TemplateFile {
  source: string; // Path in templates/ directory
  destination: string; // Path in user's project
  hasPlaceholders: boolean; // Whether file contains [Project Name] etc.
  category: 'core' | 'workflow' | 'example';
}

/**
 * Options for the init command
 */
export interface InitCommandOptions {
  force?: boolean; // Skip confirmation prompts
  minimal?: boolean; // Install minimal template set only
  verbose?: boolean; // Show detailed output
}

/**
 * CLI tool configuration
 */
export interface CliConfig {
  version: string;
  templatesDir: string;
  outputDir: string;
}
