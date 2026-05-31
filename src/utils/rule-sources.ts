/**
 * Cortex TMS — Rule-Source Seam
 *
 * Handles external rule source resolution, safety guards, hash pinning,
 * and drift detection per design doc v4.1.
 */

import { resolve, basename } from "path";
import { realpath, readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { createHash } from "crypto";
import { homedir } from "os";
import type {
  RuleSourcesConfig,
  RuleSourcesLock,
} from "../types/cli.js";

const SECRET_PATTERNS = [
  /^\.env(\..*)?$/,
  /^id_/,
  /\.pem$/,
  /\.key$/,
];

const SECRET_PATH_SEGMENTS = [".ssh/"];

/**
 * Expand leading ~/ to the user's home directory
 */
export function expandTilde(p: string): string {
  if (p === "~") return homedir();
  if (p.startsWith("~/")) return resolve(homedir(), p.slice(2));
  return p;
}

/**
 * Resolve a rule source path: expand ~ and resolve to absolute
 */
export function resolveRuleSourcePath(p: string): string {
  return resolve(expandTilde(p));
}

/**
 * Check if a filename or path segment matches a secret pattern
 */
export function isSecretPattern(p: string): boolean {
  const name = basename(p);

  if (name.startsWith(".") && name !== "." && name !== "..") {
    return true;
  }

  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(name)) return true;
  }

  for (const seg of SECRET_PATH_SEGMENTS) {
    if (p.includes(seg)) return true;
  }

  return false;
}

/**
 * Check if a path ends with .md
 */
function isMarkdownPath(p: string): boolean {
  return p.endsWith(".md");
}

export interface ValidateRuleSourceResult {
  isValid: boolean;
  resolvedPath?: string;
  error?: string;
}

/**
 * Validate a rule source path against the declared allowlist and safety guards.
 *
 * Checks:
 * 1. Path must be in declared sources (exact match after normalization)
 * 2. Both declared and realpath must end in .md
 * 3. Neither declared nor realpath may be a dotfile or secret-pattern path
 */
export async function validateRuleSourcePath(
  requestedPath: string,
  declaredSources: Record<string, string>,
): Promise<ValidateRuleSourceResult> {
  const resolvedRequested = resolveRuleSourcePath(requestedPath);

  const declaredValues = Object.values(declaredSources);
  const normalizedDeclared = declaredValues.map((p) => resolveRuleSourcePath(p));

  if (!normalizedDeclared.includes(resolvedRequested)) {
    return {
      isValid: false,
      error: `Path not declared in ruleSources: ${requestedPath}`,
    };
  }

  if (!isMarkdownPath(resolvedRequested)) {
    return {
      isValid: false,
      error: `Declared path must end in .md: ${resolvedRequested}`,
    };
  }

  if (isSecretPattern(resolvedRequested)) {
    return {
      isValid: false,
      error: `Declared path matches secret pattern: ${resolvedRequested}`,
    };
  }

  let realResolved: string;
  try {
    realResolved = await realpath(resolvedRequested);
  } catch {
    return {
      isValid: false,
      error: `File does not exist or cannot be resolved: ${resolvedRequested}`,
    };
  }

  if (!isMarkdownPath(realResolved)) {
    return {
      isValid: false,
      error: `Resolved realpath does not end in .md: ${realResolved}`,
    };
  }

  if (isSecretPattern(realResolved)) {
    return {
      isValid: false,
      error: `Resolved realpath matches secret pattern: ${realResolved}`,
    };
  }

  return {
    isValid: true,
    resolvedPath: realResolved,
  };
}

/**
 * Compute sha256 hash of a file's contents
 */
export async function computeSha256(filePath: string): Promise<string> {
  const content = await readFile(filePath);
  return createHash("sha256").update(content).digest("hex");
}

/**
 * Pin all configured rule sources into a lock object.
 * Validates each source through the safety guard before reading.
 * Returns lock entries and warnings for sources that failed the guard.
 */
export async function pinRuleSources(
  ruleSources: RuleSourcesConfig,
): Promise<{ lock: RuleSourcesLock; warnings: string[] }> {
  const lock: RuleSourcesLock = {};
  const warnings: string[] = [];
  const now = new Date().toISOString();

  const entries = getDeclaredRuleSourceEntries(ruleSources);

  // Build declared paths map for validation
  const declaredPaths: Record<string, string> = {};
  for (const [n, p] of Object.entries(entries)) {
    declaredPaths[n] = p;
  }

  for (const [name, resolvedPath] of Object.entries(entries)) {
    if (!existsSync(resolvedPath)) {
      warnings.push(`Rule source ${name} not found: ${resolvedPath}`);
      continue;
    }

    // Validate through safety guard BEFORE reading
    const safetyCheck = await validateRuleSourcePath(resolvedPath, declaredPaths);
    if (!safetyCheck.isValid) {
      warnings.push(`Rule source ${name} failed safety guard: ${safetyCheck.error}`);
      continue;
    }

    const sha256 = await computeSha256(resolvedPath);
    lock[name] = { sha256, pinnedAt: now };
  }

  return { lock, warnings };
}

export interface DriftCheckResult {
  drifted: boolean;
  missing: boolean;
  noLock: boolean;
  currentHash?: string;
  pinnedHash?: string;
}

/**
 * Check if a rule source file has drifted from its pinned hash
 */
export async function checkDrift(
  name: string,
  filePath: string,
  lock: RuleSourcesLock,
): Promise<DriftCheckResult> {
  const entry = lock[name];
  if (!entry) {
    return { drifted: false, missing: false, noLock: true };
  }

  const resolved = resolveRuleSourcePath(filePath);
  if (!existsSync(resolved)) {
    return { drifted: false, missing: true, noLock: false };
  }

  const currentHash = await computeSha256(resolved);
  return {
    drifted: currentHash !== entry.sha256,
    missing: false,
    noLock: false,
    currentHash,
    pinnedHash: entry.sha256,
  };
}

/**
 * Flatten ruleSources config into a name → resolved-path map.
 * Domain entries use "domain:<name>" as the key.
 */
export function getDeclaredRuleSourceEntries(
  ruleSources: RuleSourcesConfig | undefined,
): Record<string, string> {
  const entries: Record<string, string> = {};
  if (!ruleSources) return entries;

  if (ruleSources.global) {
    entries["global"] = resolveRuleSourcePath(ruleSources.global.path);
  }
  if (ruleSources.operatingModes) {
    entries["operatingModes"] = resolveRuleSourcePath(
      ruleSources.operatingModes.path,
    );
  }
  if (ruleSources.domains) {
    for (const domain of ruleSources.domains) {
      if (domain.name) {
        entries[`domain:${domain.name}`] = resolveRuleSourcePath(domain.path);
      }
    }
  }

  return entries;
}

/**
 * Read the lock file from .cortex/rule-sources.lock.json
 */
export async function readLockFile(cwd: string): Promise<RuleSourcesLock | null> {
  const lockPath = resolve(cwd, ".cortex", "rule-sources.lock.json");
  if (!existsSync(lockPath)) return null;

  try {
    const content = await readFile(lockPath, "utf-8");
    return JSON.parse(content) as RuleSourcesLock;
  } catch {
    return null;
  }
}

/**
 * Write the lock file to .cortex/rule-sources.lock.json
 */
export async function writeLockFile(
  cwd: string,
  lock: RuleSourcesLock,
): Promise<void> {
  const cortexDir = resolve(cwd, ".cortex");
  await mkdir(cortexDir, { recursive: true });
  const lockPath = resolve(cortexDir, "rule-sources.lock.json");
  await writeFile(lockPath, JSON.stringify(lock, null, 2), "utf-8");
}

/**
 * Generate the "## Inherited rules" anchor block from resolved config.
 * Returns the full markdown block including markers.
 * Uses cortex:// URIs instead of machine-specific paths for portability.
 */
export function generateInheritedRulesBlock(
  ruleSources: RuleSourcesConfig,
): string {
  const lines: string[] = [
    "## Inherited rules",
    "",
    "This project inherits behavioral rules from an external source.",
    "All agents MUST read and follow these before acting:",
    "",
    "> Rules are served via Cortex MCP (`cortex://rules/*`), resolved from `.cortexrc.local`. See `.cortexrc.example`.",
    "",
  ];

  if (ruleSources.global) {
    lines.push("<!-- cortex:ruleSource global -->");
    lines.push(`- Global: \`cortex://rules/global\``);
    lines.push("<!-- /cortex:ruleSource -->");
    lines.push("");
  }

  if (ruleSources.operatingModes) {
    lines.push("<!-- cortex:ruleSource operatingModes -->");
    lines.push(
      `- Operating modes: \`cortex://rules/operatingModes\``,
    );
    lines.push("<!-- /cortex:ruleSource -->");
    lines.push("");
  }

  if (ruleSources.domains) {
    for (const domain of ruleSources.domains) {
      if (domain.name) {
        lines.push(`<!-- cortex:ruleSource domain:${domain.name} -->`);
        lines.push(
          `- Domain (${domain.name}): \`cortex://rules/domain:${domain.name}\``,
        );
        lines.push("<!-- /cortex:ruleSource -->");
        lines.push("");
      }
    }
  }

  lines.push("Project-specific rules below override inherited rules.");

  return lines.join("\n");
}

/**
 * Pin all configured rule sources and write the lock — but only when every
 * source passes the safety guard. If any source failed the guard or is missing,
 * the existing lock is left untouched (no partial lock is ever persisted) and
 * the warnings are returned for the caller to surface.
 */
export async function pinAndWriteLock(
  cwd: string,
  ruleSources: RuleSourcesConfig,
): Promise<{ written: boolean; warnings: string[] }> {
  const { lock, warnings } = await pinRuleSources(ruleSources);
  if (warnings.length > 0) {
    return { written: false, warnings };
  }
  await writeLockFile(cwd, lock);
  return { written: true, warnings };
}

export interface ApplyInheritedRulesResult {
  agentsModified: boolean;
  lockWritten: boolean;
  warnings: string[];
}

/**
 * Apply inherited-rules config to a project: pin the rule-source lock and, only
 * if that succeeds, render the AGENTS.md anchor block.
 *
 * Order matters: pinning happens FIRST. AGENTS.md is never updated with
 * `cortex://rules/*` anchors unless the lock was successfully written, so the
 * project can't be left pointing at sources that failed the safety guard.
 * Protection is also honored: when `skipAgentsMd` is true the existing AGENTS.md
 * is left untouched. The lock itself is only written when every configured
 * source passes the guard — a partial lock is never persisted (see
 * pinAndWriteLock / pinRuleSources).
 */
export async function applyInheritedRules(
  cwd: string,
  ruleSources: RuleSourcesConfig,
  opts: { skipAgentsMd: boolean },
): Promise<ApplyInheritedRulesResult> {
  const { written, warnings } = await pinAndWriteLock(cwd, ruleSources);

  let agentsModified = false;
  const agentsPath = resolve(cwd, "AGENTS.md");

  // Only touch AGENTS.md when the lock was written (all sources valid) and
  // protection allows it.
  if (written && !opts.skipAgentsMd && existsSync(agentsPath)) {
    const block = generateInheritedRulesBlock(ruleSources);
    let agentsContent = await readFile(agentsPath, "utf-8");
    const existingBlockRegex =
      /##\s+Inherited\s+rules[\s\S]*?Project-specific rules below override inherited rules\./i;

    if (existingBlockRegex.test(agentsContent)) {
      agentsContent = agentsContent.replace(existingBlockRegex, block);
    } else {
      agentsContent += "\n\n" + block + "\n";
    }

    await writeFile(agentsPath, agentsContent, "utf-8");
    agentsModified = true;
  }

  return { agentsModified, lockWritten: written, warnings };
}

/**
 * Detect if AGENTS.md content has inherited-rules protection.
 *
 * Two tiers:
 * - Hard protect: contains <!-- cortex:ruleSource marker
 * - Soft protect: contains "inherited rules" heading (case-insensitive)
 *   AND ≥1 file path/link bullet under it
 */
export function detectInheritedProtection(
  content: string,
): "hard" | "soft" | "none" {
  if (content.includes("<!-- cortex:ruleSource")) {
    return "hard";
  }

  const headingRegex = /^##\s+inherited\s+rules\s*$/im;
  if (headingRegex.test(content)) {
    const headingMatch = content.match(headingRegex);
    if (headingMatch && headingMatch.index !== undefined) {
      const afterHeading = content.slice(headingMatch.index);
      const nextHeadingIdx = afterHeading.search(/\n##\s+(?!inherited\s+rules)/i);
      const section =
        nextHeadingIdx > 0
          ? afterHeading.slice(0, nextHeadingIdx)
          : afterHeading;

      const pathBulletRegex = /^-\s+.*[`([][^`\])]*[`\])]/m;
      if (pathBulletRegex.test(section)) {
        return "soft";
      }
    }
  }

  return "none";
}
