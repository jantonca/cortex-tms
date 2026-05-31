/**
 * MCP Resource Discovery for Cortex TMS
 *
 * Pure module — no SDK imports, no side effects. Discovers which TMS governance
 * files should be exposed as MCP resources given the project's .cortexrc config.
 */

import { join } from "path";
import { pathExists } from "fs-extra";
import { loadConfig, SCOPE_PRESETS } from "./config.js";
import { validateSafePath } from "./validation.js";
import { CortexConfigMissingError } from "./errors.js";
import {
  getDeclaredRuleSourceEntries,
  validateRuleSourcePath,
} from "./rule-sources.js";

// ============================================================================
// Registry
// ============================================================================

interface RegistryEntry {
  name: string;
  description: string;
  mimeType: "text/markdown";
  /** Path relative to cwd (for root-level and .github/* files) */
  relativePath?: string;
  /** Path relative to config.paths.docs (for docs/core/* files) */
  docsRelativePath?: string;
  /** If true, resolve path from config.paths.tasks instead */
  isTasksFile?: boolean;
}

/**
 * Canonical allowlist of exposable resources, keyed by stable URI slug.
 * Only files in this registry can ever be surfaced via MCP.
 */
const RESOURCE_REGISTRY: Record<string, RegistryEntry> = {
  "next-tasks": {
    name: "Next Tasks",
    description: "Active tasks and sprint backlog",
    mimeType: "text/markdown",
    isTasksFile: true,
  },
  claude: {
    name: "Claude Instructions",
    description: "AI agent instructions and workflow",
    mimeType: "text/markdown",
    relativePath: "CLAUDE.md",
  },
  agents: {
    name: "Agents",
    description: "Multi-agent governance registry",
    mimeType: "text/markdown",
    relativePath: "AGENTS.md",
  },
  prompts: {
    name: "Prompts",
    description: "Reusable prompt templates",
    mimeType: "text/markdown",
    relativePath: "PROMPTS.md",
  },
  "future-enhancements": {
    name: "Future Enhancements",
    description: "Roadmap and enhancement backlog",
    mimeType: "text/markdown",
    relativePath: "FUTURE-ENHANCEMENTS.md",
  },
  "copilot-instructions": {
    name: "Copilot Instructions",
    description: "GitHub Copilot instructions",
    mimeType: "text/markdown",
    relativePath: ".github/copilot-instructions.md",
  },
  patterns: {
    name: "Patterns",
    description: "Code patterns and conventions",
    mimeType: "text/markdown",
    docsRelativePath: "PATTERNS.md",
  },
  architecture: {
    name: "Architecture",
    description: "System architecture documentation",
    mimeType: "text/markdown",
    docsRelativePath: "ARCHITECTURE.md",
  },
  "domain-logic": {
    name: "Domain Logic",
    description: "Business logic and domain model",
    mimeType: "text/markdown",
    docsRelativePath: "DOMAIN-LOGIC.md",
  },
  decisions: {
    name: "Decisions",
    description: "Architecture decision records",
    mimeType: "text/markdown",
    docsRelativePath: "DECISIONS.md",
  },
  troubleshooting: {
    name: "Troubleshooting",
    description: "Common issues and solutions",
    mimeType: "text/markdown",
    docsRelativePath: "TROUBLESHOOTING.md",
  },
  glossary: {
    name: "Glossary",
    description: "Project terminology and definitions",
    mimeType: "text/markdown",
    docsRelativePath: "GLOSSARY.md",
  },
  schema: {
    name: "Schema",
    description: "Data schemas and API contracts",
    mimeType: "text/markdown",
    docsRelativePath: "SCHEMA.md",
  },
};

/**
 * Inverse lookup: canonical TMS template path → registry slug.
 * These are the paths as they appear in SCOPE_PRESETS (using default docs path).
 */
const CANONICAL_PATH_TO_SLUG: Record<string, string> = {
  "NEXT-TASKS.md": "next-tasks",
  "CLAUDE.md": "claude",
  "AGENTS.md": "agents",
  "PROMPTS.md": "prompts",
  "FUTURE-ENHANCEMENTS.md": "future-enhancements",
  ".github/copilot-instructions.md": "copilot-instructions",
  "docs/core/PATTERNS.md": "patterns",
  "docs/core/ARCHITECTURE.md": "architecture",
  "docs/core/DOMAIN-LOGIC.md": "domain-logic",
  "docs/core/DECISIONS.md": "decisions",
  "docs/core/TROUBLESHOOTING.md": "troubleshooting",
  "docs/core/GLOSSARY.md": "glossary",
  "docs/core/SCHEMA.md": "schema",
};

// ============================================================================
// Public API
// ============================================================================

export interface DiscoveredResource {
  uri: string;
  name: string;
  description: string;
  mimeType: "text/markdown";
  /** Absolute disk path — used by mcp.ts to read contents */
  path: string;
}

/**
 * Discovers MCP-exposable resources from the project's .cortexrc and disk.
 *
 * Returns only files that:
 * 1. Are in the canonical allowlist (RESOURCE_REGISTRY)
 * 2. Are selected by the configured scope (or customFiles for custom scope)
 * 3. Pass path safety validation
 * 4. Actually exist on disk
 */
export async function discoverResources(
  cwd: string,
): Promise<DiscoveredResource[]> {
  const config = await loadConfig(cwd);
  if (!config) {
    throw new CortexConfigMissingError(cwd);
  }

  const docsDir = config.paths?.docs ?? "docs/core";
  const tasksPath = config.paths?.tasks ?? "NEXT-TASKS.md";

  // Collect candidate slugs based on scope
  let candidateSlugs: string[];

  if (config.scope === "custom") {
    // customFiles contains canonical TMS template paths — map through allowlist
    const customFiles = config.metadata?.customFiles ?? [];
    candidateSlugs = customFiles
      .map((f) => CANONICAL_PATH_TO_SLUG[f])
      .filter((slug): slug is string => slug !== undefined);
  } else {
    const preset = SCOPE_PRESETS.find((p) => p.name === config.scope);
    const allFiles = preset
      ? [...preset.mandatoryFiles, ...preset.optionalFiles]
      : [];
    candidateSlugs = allFiles
      .map((f) => CANONICAL_PATH_TO_SLUG[f])
      .filter((slug): slug is string => slug !== undefined);
  }

  const resources: DiscoveredResource[] = [];

  for (const slug of candidateSlugs) {
    const entry = RESOURCE_REGISTRY[slug];
    if (!entry) continue;

    // Resolve disk path
    let diskPath: string;
    if (entry.isTasksFile) {
      diskPath = join(cwd, tasksPath);
    } else if (entry.docsRelativePath) {
      diskPath = join(cwd, docsDir, entry.docsRelativePath);
    } else if (entry.relativePath) {
      diskPath = join(cwd, entry.relativePath);
    } else {
      continue;
    }

    // Path safety check
    const safety = validateSafePath(diskPath, cwd);
    if (!safety.isValid) continue;

    // Existence check
    if (!(await pathExists(diskPath))) continue;

    resources.push({
      uri: `cortex://${slug}`,
      name: entry.name,
      description: entry.description,
      mimeType: entry.mimeType,
      path: diskPath,
    });
  }

  // Discover external rule sources (cortex://rules/*)
  if (config.ruleSources) {
    const ruleEntries = getDeclaredRuleSourceEntries(config.ruleSources);
    const declaredPaths: Record<string, string> = {};
    for (const [name, resolvedPath] of Object.entries(ruleEntries)) {
      declaredPaths[name] = resolvedPath;
    }

    for (const [name, resolvedPath] of Object.entries(ruleEntries)) {
      if (!(await pathExists(resolvedPath))) continue;

      const safety = await validateRuleSourcePath(resolvedPath, declaredPaths);
      if (!safety.isValid) continue;

      resources.push({
        uri: `cortex://rules/${name}`,
        name: `Rule Source: ${name}`,
        description: `External rule source from .cortexrc ruleSources`,
        mimeType: "text/markdown",
        path: safety.resolvedPath!,
      });
    }
  }

  return resources;
}
