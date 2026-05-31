/**
 * Cortex TMS CLI - Validation Engine
 *
 * Performs health checks on TMS projects to ensure compliance with
 * documentation standards (Rule 4, placeholder completion, etc.)
 */

import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { join, basename } from "path";
import type {
  ValidationCheck,
  ValidationResult,
  LineLimits,
  MandatoryFile,
  ProjectScope,
  CortexConfig,
} from "../types/cli.js";
import {
  loadConfig,
  mergeConfig,
  getEffectiveLineLimits,
  saveConfig,
  createConfigFromScope,
  getScopePreset,
} from "./config.js";
import { getTemplatesDir, processTemplate } from "./templates.js";
import { checkDocStaleness, isShallowClone } from "./git-staleness.js";
import {
  getDeclaredRuleSourceEntries,
  validateRuleSourcePath,
  readLockFile,
  checkDrift,
} from "./rule-sources.js";

/**
 * Default line limits for TMS files (Rule 4)
 * These limits ensure AI agents can efficiently process documentation
 */
export const DEFAULT_LINE_LIMITS: LineLimits = {
  "NEXT-TASKS.md": 200, // HOT - Current sprint only
  "FUTURE-ENHANCEMENTS.md": 500, // PLANNING - Backlog
  "ARCHITECTURE.md": 500, // WARM - System design
  "PATTERNS.md": 650, // WARM - Code patterns (reference manual with index)
  "DOMAIN-LOGIC.md": 400, // WARM - Business rules (includes Maintenance Protocol)
  "DECISIONS.md": 400, // WARM - ADRs
  "GLOSSARY.md": 200, // WARM - Terminology
  "SCHEMA.md": 600, // WARM - Data models
  "TROUBLESHOOTING.md": 400, // WARM - Common issues
  "AGENTS.md": 300, // WARM - Multi-agent governance registry
};

/**
 * Mandatory files that must exist in a TMS project
 */
export const MANDATORY_FILES: MandatoryFile[] = [
  "NEXT-TASKS.md",
  ".github/copilot-instructions.md",
  "CLAUDE.md",
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
    const content = await readFile(filePath, "utf-8");
    return content.split("\n").length;
  } catch {
    return 0;
  }
}

/**
 * Strip fenced code blocks and inline code spans from markdown content.
 * Prevents placeholder regex from matching examples shown inside code formatting.
 */
function stripCodeFromMarkdown(content: string): string {
  // Remove fenced code blocks (``` ... ``` or ~~~ ... ~~~)
  let stripped = content.replace(/^(`{3,}|~{3,})[\s\S]*?\1$/gm, "");
  // Remove inline code spans (` ... `)
  stripped = stripped.replace(/`[^`\n]+`/g, "");
  return stripped;
}

/**
 * Scan file for unreplaced placeholders
 */
async function scanForPlaceholders(
  filePath: string,
): Promise<{ found: boolean; placeholders: string[] }> {
  try {
    const content = await readFile(filePath, "utf-8");
    // Strip code blocks/spans before scanning to avoid false positives
    // from placeholder examples shown in documentation
    const scannable = stripCodeFromMarkdown(content);
    const matches = scannable.match(PLACEHOLDER_PATTERN);

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
  filePath: string,
): Promise<{ found: boolean; count: number }> {
  try {
    const content = await readFile(filePath, "utf-8");
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
    const content = await readFile(filePath, "utf-8");
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
  return existsSync(join(cwd, "docs/archive"));
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
    "Project Name": projectName,
    "project-name": projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    Description: `A project powered by Cortex TMS`,
  };

  await processTemplate(sourcePath, destPath, replacements);
}

/**
 * Validate file size limits (Rule 4)
 */
export async function validateFileSizes(
  cwd: string,
  limits: LineLimits = DEFAULT_LINE_LIMITS,
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
        level: "warning",
        message: `${filename} exceeds recommended line limit`,
        details: `Current: ${lineCount} lines | Limit: ${limit} lines | Overage: ${lineCount - limit} lines`,
        file: filename,
      });
    } else {
      checks.push({
        name: `File Size: ${filename}`,
        passed: true,
        level: "info",
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
  scope?: string,
): ValidationCheck[] {
  const checks: ValidationCheck[] = [];
  const mandatoryFiles = getMandatoryFilesForScope(scope);

  for (const file of mandatoryFiles) {
    const filePath = join(cwd, file);
    const exists = existsSync(filePath);

    checks.push({
      name: `Mandatory File: ${file}`,
      passed: exists,
      level: exists ? "info" : "error",
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
  const hasGlossary = existsSync(join(cwd, "docs/core/GLOSSARY.md"));
  const hasSchema = existsSync(join(cwd, "docs/core/SCHEMA.md"));
  const hasArchitecture = existsSync(join(cwd, "docs/core/ARCHITECTURE.md"));

  let scope: "nano" | "standard" | "enterprise" = "standard";

  if (hasGlossary || hasSchema) {
    scope = "enterprise";
  } else if (!hasArchitecture) {
    scope = "nano";
  }

  const projectName = basename(cwd);
  const config = createConfigFromScope(scope, projectName);
  await saveConfig(cwd, config);
}

/**
 * Validate .cortexrc configuration exists
 */
export function validateConfig(cwd: string): ValidationCheck[] {
  const configPath = join(cwd, ".cortexrc");
  const exists = existsSync(configPath);

  return [
    {
      name: "Configuration File",
      passed: exists,
      level: exists ? "info" : "error",
      message: exists
        ? ".cortexrc configuration exists"
        : ".cortexrc is missing (required for TMS validation)",
      file: ".cortexrc",
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
  ignoreFiles: string[] = [],
): Promise<ValidationCheck[]> {
  const checks: ValidationCheck[] = [];

  // Files to scan for placeholders and AI-DRAFT markers
  const filesToScan = [
    "README.md",
    "NEXT-TASKS.md",
    "CLAUDE.md",
    "FUTURE-ENHANCEMENTS.md",
    "docs/core/ARCHITECTURE.md",
    "docs/core/PATTERNS.md",
    "docs/core/DOMAIN-LOGIC.md",
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
        level: "error",
        message: `${file} is incomplete (contains placeholder text)`,
        details: `Found: ${placeholderResult.placeholders.join(", ")}\n💡 Run 'cortex-tms prompt bootstrap' with your AI agent to populate this file.`,
        file,
      });
    }
    // Priority 2: AI-DRAFT (has draft markers) - needs human review
    else if (draftResult.found) {
      checks.push({
        name: `Completion: ${file}`,
        passed: true, // Not a hard failure - content exists
        level: "warning",
        message: `${file} contains AI-generated drafts (needs human review)`,
        details: `${draftResult.count} draft section${draftResult.count > 1 ? "s" : ""} marked with <!-- AI-DRAFT -->\n💡 Review the AI-generated content and remove the <!-- AI-DRAFT --> markers once accepted.`,
        file,
      });
    }
    // Priority 3: Complete (no placeholders, no drafts)
    else {
      checks.push({
        name: `Completion: ${file}`,
        passed: true,
        level: "info",
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
export async function validateArchiveStatus(
  cwd: string,
): Promise<ValidationCheck[]> {
  const checks: ValidationCheck[] = [];

  const nextTasksPath = join(cwd, "NEXT-TASKS.md");

  if (!existsSync(nextTasksPath)) {
    return checks; // Skip if file doesn't exist
  }

  const completedCount = await countCompletedTasks(nextTasksPath);
  const hasArchive = hasArchiveDirectory(cwd);

  if (completedCount > 10) {
    checks.push({
      name: "Archive Status",
      passed: false,
      level: "warning",
      message: "Too many completed tasks in NEXT-TASKS.md",
      details: `${completedCount} completed tasks should be archived to docs/archive/`,
      file: "NEXT-TASKS.md",
    });
  } else if (completedCount > 5) {
    checks.push({
      name: "Archive Status",
      passed: true,
      level: "info",
      message: "Consider archiving completed tasks soon",
      details: `${completedCount} completed tasks in NEXT-TASKS.md`,
      file: "NEXT-TASKS.md",
    });
  } else {
    checks.push({
      name: "Archive Status",
      passed: true,
      level: "info",
      message: "Active task list is healthy",
      details: `${completedCount} completed tasks`,
      file: "NEXT-TASKS.md",
    });
  }

  if (!hasArchive && completedCount > 0) {
    checks.push({
      name: "Archive Directory",
      passed: false,
      level: "warning",
      message: "No archive directory found",
      details: "Create docs/archive/ to store completed sprint history",
    });
  }

  return checks;
}

/**
 * Validate documentation staleness using git history
 */
async function validateDocStaleness(
  cwd: string,
  config: any,
): Promise<ValidationCheck[]> {
  const checks: ValidationCheck[] = [];

  // Check if staleness detection is enabled
  const stalenessConfig = config.staleness || {};
  const enabled = stalenessConfig.enabled !== false; // Default: true
  const thresholdDays = stalenessConfig.thresholdDays || 30;
  const minCommits = stalenessConfig.minCommits || 3;

  if (!enabled) {
    return checks;
  }

  // Check for shallow clone
  if (isShallowClone(cwd)) {
    checks.push({
      name: "Staleness Detection",
      passed: true,
      level: "warning",
      message: "Shallow clone detected - staleness check skipped",
      details: "Run with fetch-depth: 0 in CI to enable staleness detection",
    });
    return checks;
  }

  // Default doc-to-path mappings
  const defaultDocs = stalenessConfig.docs || {
    "docs/core/PATTERNS.md": ["src/"],
    "docs/core/ARCHITECTURE.md": ["src/", "infrastructure/"],
    "docs/core/DOMAIN-LOGIC.md": ["src/"],
  };

  // Check each configured doc
  for (const [docPath, watchPaths] of Object.entries(defaultDocs)) {
    const fullDocPath = join(cwd, docPath);

    // Skip if doc doesn't exist
    if (!existsSync(fullDocPath)) {
      continue;
    }

    // Check staleness
    const result = checkDocStaleness(
      docPath,
      watchPaths as string[],
      thresholdDays,
      minCommits,
      cwd,
    );

    if (result.isStale) {
      checks.push({
        name: "Doc Staleness",
        passed: false,
        level: "warning",
        message: `${basename(docPath)} may be outdated`,
        details: `${result.reason}\n  Code: ${result.codeLastModified ? new Date(result.codeLastModified * 1000).toISOString().split("T")[0] : "N/A"}\n  Doc:  ${result.docLastModified ? new Date(result.docLastModified * 1000).toISOString().split("T")[0] : "N/A"}\n\n  Note: Staleness v1 uses git timestamps (temporal comparison only)\n  Review ${docPath} to ensure it reflects current codebase`,
        file: docPath,
      });
    } else if (
      result.daysSinceDocUpdate !== null &&
      result.daysSinceDocUpdate > 0
    ) {
      // Not stale, but show info if there's been activity
      checks.push({
        name: "Doc Freshness",
        passed: true,
        level: "info",
        message: `${basename(docPath)} is current`,
        details: result.reason,
        file: docPath,
      });
    }
  }

  // If no checks were added, add a success check
  if (checks.length === 0) {
    checks.push({
      name: "Doc Staleness",
      passed: true,
      level: "info",
      message: "All governance docs are current",
      details: `Checked with ${thresholdDays} day threshold, ${minCommits} commit minimum`,
    });
  }

  return checks;
}

/**
 * Check for recommended (but not mandatory) files based on project scope.
 *
 * Uses passed:true + level:"info" so the check:
 * - Never reduces the "Passed: X" summary count
 * - Never fails strict mode (strict only elevates warnings/errors)
 * - Still appears in validate output via the Recommendations display section
 */
function validateRecommendedFiles(
  cwd: string,
  scope?: string,
): ValidationCheck[] {
  const checks: ValidationCheck[] = [];

  if (scope === "standard" || scope === "enterprise") {
    const agentsPath = join(cwd, "AGENTS.md");
    if (!existsSync(agentsPath)) {
      checks.push({
        name: "Recommended: AGENTS.md",
        passed: true,
        level: "info",
        message: "AGENTS.md not found — recommended for multi-agent projects",
        details:
          "Run cortex-tms init or create AGENTS.md to define agent roles and boundaries.",
        file: "AGENTS.md",
      });
    }
  }

  return checks;
}

/**
 * Validate external rule sources (v1 checks: exists, servable, drift, age)
 */
async function validateRuleSources(
  cwd: string,
  config: CortexConfig,
): Promise<ValidationCheck[]> {
  const checks: ValidationCheck[] = [];
  const ruleSources = config.ruleSources;

  if (!ruleSources) return checks;

  checks.push({
    name: "Rule Source Configured",
    passed: true,
    level: "info",
    message: "ruleSources field present in .cortexrc",
  });

  const entries = getDeclaredRuleSourceEntries(ruleSources);
  const lock = await readLockFile(cwd);
  const stalenessConfig = config.staleness?.ruleSources || {};

  // Report missing lock state when ruleSources are configured
  if (!lock && Object.keys(entries).length > 0) {
    checks.push({
      name: "Rule Source Lock",
      passed: false,
      level: "warning",
      message: "Rule sources configured but no lock file found",
      details: "Run 'cortex-tms validate --repin' to generate .cortex/rule-sources.lock.json",
    });
  }

  for (const [name, resolvedPath] of Object.entries(entries)) {
    if (!existsSync(resolvedPath)) {
      checks.push({
        name: `Rule Source Exists: ${name}`,
        passed: false,
        level: "error",
        message: `External rule source file not found: ${resolvedPath}`,
      });
      continue;
    }

    // Use realpath-aware guard (same as MCP) to check servability
    const declaredPaths: Record<string, string> = {};
    for (const [n, p] of Object.entries(entries)) {
      declaredPaths[n] = p;
    }
    const safetyCheck = await validateRuleSourcePath(resolvedPath, declaredPaths);

    if (!safetyCheck.isValid) {
      checks.push({
        name: `Rule Source Servable: ${name}`,
        passed: false,
        level: "error",
        message: `Rule source is not servable: ${safetyCheck.error}`,
      });
      continue;
    }

    checks.push({
      name: `Rule Source Servable: ${name}`,
      passed: true,
      level: "info",
      message: `Rule source ${name} is servable`,
    });

    if (lock) {
      const sourceEntry =
        name === "global"
          ? ruleSources.global
          : name === "operatingModes"
            ? ruleSources.operatingModes
            : ruleSources.domains?.find(
                (d) => `domain:${d.name}` === name,
              );

      if (sourceEntry) {
        const driftResult = await checkDrift(name, sourceEntry.path, lock);

        if (driftResult.missing) {
          checks.push({
            name: `Rule Source Drift: ${name}`,
            passed: false,
            level: "error",
            message: `Rule source file missing: ${sourceEntry.path}`,
          });
        } else if (driftResult.drifted) {
          checks.push({
            name: `Rule Source Drift: ${name}`,
            passed: false,
            level: "warning",
            message: `Inherited rules (${name}) changed since last review`,
            details:
              "Re-review for compatibility, then re-pin with validate --repin.",
          });
        } else if (!driftResult.noLock) {
          checks.push({
            name: `Rule Source Drift: ${name}`,
            passed: true,
            level: "info",
            message: `Rule source ${name} matches pinned hash`,
          });
        }
      }
    }

    const lockEntry = lock?.[name];
    const maxAgeDays = stalenessConfig[name]?.maxAgeDays;
    if (lockEntry && maxAgeDays) {
      const pinnedDate = new Date(lockEntry.pinnedAt);
      const ageDays = Math.floor(
        (Date.now() - pinnedDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (ageDays > maxAgeDays) {
        checks.push({
          name: `Rule Source Age: ${name}`,
          passed: true,
          level: "info",
          message: `Rule source ${name} last reviewed ${ageDays} days ago`,
          details: `Consider re-reviewing for drift (threshold: ${maxAgeDays} days).`,
        });
      }
    }
  }

  return checks;
}

/**
 * Run all validation checks
 */
export async function validateProject(
  cwd: string,
  options: { strict?: boolean; skipStaleness?: boolean; limits?: LineLimits } = {},
): Promise<ValidationResult> {
  const { strict = false, skipStaleness = false } = options;

  // Load configuration (if exists)
  const userConfig = await loadConfig(cwd);
  const config = mergeConfig(userConfig);

  // Get effective line limits (config overrides > scope presets > defaults)
  const limits = options.limits || getEffectiveLineLimits(config);

  // Get ignore list for placeholder validation
  const ignoreFiles = config.validation?.ignoreFiles || [];

  // Run all checks in parallel
  const [
    fileSizeChecks,
    mandatoryChecks,
    configChecks,
    placeholderChecks,
    archiveChecks,
    stalenessChecks,
    ruleSourceChecks,
  ] = await Promise.all([
    validateFileSizes(cwd, limits),
    Promise.resolve(validateMandatoryFiles(cwd, config.scope)),
    Promise.resolve(validateConfig(cwd)),
    validatePlaceholders(cwd, ignoreFiles),
    validateArchiveStatus(cwd),
    skipStaleness
      ? Promise.resolve([])
      : validateDocStaleness(cwd, config),
    validateRuleSources(cwd, config),
  ]);

  const recommendedChecks = validateRecommendedFiles(cwd, config.scope);

  const checks = [
    ...mandatoryChecks,
    ...configChecks,
    ...fileSizeChecks,
    ...placeholderChecks,
    ...archiveChecks,
    ...stalenessChecks,
    ...ruleSourceChecks,
    ...recommendedChecks,
  ];

  // Calculate summary
  const summary = {
    total: checks.length,
    passed: checks.filter((c) => c.passed).length,
    warnings: checks.filter((c) => c.level === "warning").length,
    errors: checks.filter((c) => c.level === "error").length,
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
