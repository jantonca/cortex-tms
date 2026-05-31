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
  installSnippets?: boolean; // VS Code snippet library installation
}

/**
 * Template categories that can be selected during init
 */
export type TemplateSelection =
  | "all"
  | "minimal"
  | "core-docs"
  | "workflow-files"
  | "example-app";

/**
 * Configuration for project detection
 */
export interface ProjectContext {
  isGitRepo: boolean;
  hasPackageJson: boolean;
  packageManager: "npm" | "pnpm" | "yarn" | "bun" | "unknown";
  existingFiles: string[];
}

/**
 * Template file metadata
 */
export interface TemplateFile {
  source: string; // Path in templates/ directory
  destination: string; // Path in user's project
  hasPlaceholders: boolean; // Whether file contains [Project Name] etc.
  category: "core" | "workflow" | "example";
}

/**
 * Governance preset — controls ecosystem-specific content inside templates.
 * Independent of scope (which controls the file set).
 */
export type GovernancePreset = "node" | "python" | "go";

/**
 * Options for the init command
 */
export interface InitCommandOptions {
  force?: boolean; // Skip confirmation prompts
  minimal?: boolean; // Install minimal template set only
  verbose?: boolean; // Show detailed output
  scope?: ProjectScope; // Specify scope for non-interactive mode
  dryRun?: boolean; // Preview changes without writing to disk
  preset?: GovernancePreset; // Ecosystem-specific content preset
  withSkills?: boolean; // Install cortex-validate and cortex-review Claude Code skills
  overwriteInherited?: boolean; // Override inherited-rules protection in AGENTS.md (requires --force)
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
  level: "info" | "warning" | "error";
  message: string;
  details?: string;
  file?: string;
  line?: number;
  /** Optional fix function that can remediate the issue */
  fix?: (cwd: string) => Promise<void>;
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
  "NEXT-TASKS.md": number;
  "FUTURE-ENHANCEMENTS.md": number;
  "ARCHITECTURE.md": number;
  "PATTERNS.md": number;
  "DOMAIN-LOGIC.md": number;
  "DECISIONS.md": number;
  "GLOSSARY.md": number;
  "SCHEMA.md": number;
  "TROUBLESHOOTING.md": number;
  "AGENTS.md": number;
  [key: string]: number; // Allow custom files
}

/**
 * Mandatory files that must exist in a TMS project
 */
export type MandatoryFile =
  | "NEXT-TASKS.md"
  | ".github/copilot-instructions.md"
  | "CLAUDE.md";

/**
 * Options for the validate command
 */
export interface ValidateCommandOptions {
  fix?: boolean; // Auto-fix issues where possible
  strict?: boolean; // Treat warnings as errors
  verbose?: boolean; // Show detailed output
  skipStaleness?: boolean; // Skip staleness detection checks
  repin?: boolean; // Re-pin rule source hashes (acknowledge drift)
}

/**
 * Project scope - determines which templates are included
 */
export type ProjectScope = "nano" | "standard" | "enterprise" | "custom";

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

  /** Staleness detection configuration */
  staleness?: {
    /** Enable staleness detection (default: true) */
    enabled?: boolean;
    /** Days threshold for staleness (default: 30) */
    thresholdDays?: number;
    /** Minimum meaningful commits to trigger staleness (default: 3) */
    minCommits?: number;
    /** Per-doc watch directories */
    docs?: {
      [docPath: string]: string[];
    };
    /** Per-rule-source staleness thresholds */
    ruleSources?: {
      [name: string]: RuleSourceStalenessConfig;
    };
  };

  /** External rule sources consumed by reference (not embedded) */
  ruleSources?: RuleSourcesConfig;

  /** Git hooks configuration */
  hooks?: {
    /** Hook mode: 'default' runs validate, 'strict' treats warnings as errors */
    mode?: "default" | "strict";
    /** Skip staleness checks in the hook (faster commits) */
    skipStaleness?: boolean;
    /** Pinned cortex-tms version for npx fallback */
    version?: string;
  };

  /** Metadata */
  metadata?: {
    /** When this config was created */
    created?: string;
    /** Project name */
    projectName?: string;
    /** Project description */
    description?: string;
    /** Custom file list (only for custom scope) */
    customFiles?: string[];
    /** Governance preset used at init time */
    preset?: GovernancePreset;
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

/**
 * Options for the auto-tier command
 */
export interface AutoTierOptions {
  hot: string;
  warm: string;
  cold: string;
  dryRun?: boolean;
  force?: boolean;
  verbose?: boolean;
}

/**
 * Options for the mcp command
 */
export interface McpCommandOptions {
  printConfig?: boolean;
}

/**
 * Rule source type discriminator
 * v1 only supports "local-path"; git-ref and mcp-uri are deferred.
 */
export type RuleSourceType = "local-path";

/**
 * A single rule source entry (global, operatingModes, or a domain entry)
 */
export interface RuleSource {
  type: RuleSourceType;
  path: string;
  name?: string;
}

/**
 * Rule sources configuration — external behavioral rules consumed by reference
 */
export interface RuleSourcesConfig {
  global?: RuleSource;
  operatingModes?: RuleSource;
  domains?: RuleSource[];
}

/**
 * Staleness configuration for a specific rule source
 */
export interface RuleSourceStalenessConfig {
  maxAgeDays: number;
}

/**
 * Lock entry for a pinned rule source digest
 */
export interface RuleSourceLockEntry {
  sha256: string;
  pinnedAt: string;
}

/**
 * Lock file schema for .cortex/rule-sources.lock.json
 */
export interface RuleSourcesLock {
  [name: string]: RuleSourceLockEntry;
}
