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
  scope: ProjectScope;
  customFiles?: string[]; // Only present when scope is 'custom'
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
  scope?: ProjectScope; // Specify scope for non-interactive mode
  dryRun?: boolean; // Preview changes without writing to disk
}

/**
 * CLI tool configuration
 */
export interface CliConfig {
  version: string;
  templatesDir: string;
  outputDir: string;
}

/**
 * Validation check result
 */
export interface ValidationCheck {
  name: string;
  passed: boolean;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: string;
  file?: string;
  line?: number;
}

/**
 * Overall validation result
 */
export interface ValidationResult {
  passed: boolean;
  checks: ValidationCheck[];
  summary: {
    total: number;
    passed: number;
    warnings: number;
    errors: number;
  };
}

/**
 * File size limits for TMS files (Rule 4)
 */
export interface LineLimits {
  'NEXT-TASKS.md': number;
  'FUTURE-ENHANCEMENTS.md': number;
  'ARCHITECTURE.md': number;
  'PATTERNS.md': number;
  'DOMAIN-LOGIC.md': number;
  'DECISIONS.md': number;
  'GLOSSARY.md': number;
  'SCHEMA.md': number;
  'TROUBLESHOOTING.md': number;
  [key: string]: number; // Allow custom files
}

/**
 * Mandatory files that must exist in a TMS project
 */
export type MandatoryFile =
  | 'NEXT-TASKS.md'
  | '.github/copilot-instructions.md'
  | 'CLAUDE.md';

/**
 * Options for the validate command
 */
export interface ValidateCommandOptions {
  fix?: boolean; // Auto-fix issues where possible
  strict?: boolean; // Treat warnings as errors
  verbose?: boolean; // Show detailed output
}

/**
 * Project scope - determines which templates are included
 */
export type ProjectScope = 'nano' | 'standard' | 'enterprise' | 'custom';

/**
 * Cortex TMS project configuration (.cortexrc)
 */
export interface CortexConfig {
  /** Config schema version (for future migrations) */
  version: string;

  /** Project scope - determines template set and validation rules */
  scope: ProjectScope;

  /** Custom paths for TMS files */
  paths?: {
    /** Documentation directory (default: 'docs/core') */
    docs?: string;
    /** Tasks file (default: 'NEXT-TASKS.md') */
    tasks?: string;
    /** Archive directory (default: 'docs/archive') */
    archive?: string;
  };

  /** Custom line limits (overrides Rule 4 defaults) */
  limits?: Partial<LineLimits>;

  /** Validation configuration */
  validation?: {
    /** File patterns to ignore (glob syntax) */
    ignorePatterns?: string[];
    /** Specific files to ignore */
    ignoreFiles?: string[];
  };

  /** Metadata */
  metadata?: {
    /** When this config was created */
    created?: string;
    /** Project name */
    projectName?: string;
  };
}

/**
 * Scope preset - defines which files are included in each scope
 */
export interface ScopePreset {
  name: ProjectScope;
  displayName: string;
  description: string;
  mandatoryFiles: string[];
  optionalFiles: string[];
  lineLimits: Partial<LineLimits>;
}
