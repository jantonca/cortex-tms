/**
 * Cortex TMS CLI - Configuration Management
 *
 * Handles loading, merging, and saving .cortexrc configuration files
 */

import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import type {
  CortexConfig,
  ProjectScope,
  ScopePreset,
  LineLimits,
} from '../types/cli.js';

/**
 * Current config schema version
 */
export const CONFIG_VERSION = '1.0.0';

/**
 * Default line limits for TMS files (Rule 4)
 * Duplicated here to avoid circular dependency with validator.ts
 */
const DEFAULT_LINE_LIMITS: LineLimits = {
  'NEXT-TASKS.md': 200,
  'FUTURE-ENHANCEMENTS.md': 500,
  'ARCHITECTURE.md': 500,
  'PATTERNS.md': 500,
  'DOMAIN-LOGIC.md': 300,
  'DECISIONS.md': 400,
  'GLOSSARY.md': 200,
  'SCHEMA.md': 600,
  'TROUBLESHOOTING.md': 400,
};

/**
 * Default configuration
 */
export const DEFAULT_CONFIG: CortexConfig = {
  version: CONFIG_VERSION,
  scope: 'standard',
  paths: {
    docs: 'docs/core',
    tasks: 'NEXT-TASKS.md',
    archive: 'docs/archive',
  },
  limits: {},
  validation: {
    ignorePatterns: [],
    ignoreFiles: [],
  },
};

/**
 * Scope presets - define template sets for different project sizes
 */
export const SCOPE_PRESETS: ScopePreset[] = [
  {
    name: 'nano',
    displayName: 'Nano',
    description: 'Minimal setup for scripts and small tools',
    mandatoryFiles: ['NEXT-TASKS.md', 'CLAUDE.md'],
    optionalFiles: [],
    lineLimits: {
      'NEXT-TASKS.md': 100,
    },
  },
  {
    name: 'standard',
    displayName: 'Standard',
    description: 'Complete setup for most products (recommended)',
    mandatoryFiles: [
      'NEXT-TASKS.md',
      'CLAUDE.md',
      '.github/copilot-instructions.md',
    ],
    optionalFiles: [
      'PROMPTS.md',
      'FUTURE-ENHANCEMENTS.md',
      'docs/core/ARCHITECTURE.md',
      'docs/core/PATTERNS.md',
      'docs/core/DOMAIN-LOGIC.md',
      'docs/core/DECISIONS.md',
      'docs/core/TROUBLESHOOTING.md',
    ],
    lineLimits: DEFAULT_LINE_LIMITS,
  },
  {
    name: 'enterprise',
    displayName: 'Enterprise',
    description: 'Full suite for large, complex repositories',
    mandatoryFiles: [
      'NEXT-TASKS.md',
      'CLAUDE.md',
      '.github/copilot-instructions.md',
    ],
    optionalFiles: [
      'PROMPTS.md',
      'FUTURE-ENHANCEMENTS.md',
      'docs/core/ARCHITECTURE.md',
      'docs/core/PATTERNS.md',
      'docs/core/DOMAIN-LOGIC.md',
      'docs/core/DECISIONS.md',
      'docs/core/TROUBLESHOOTING.md',
      'docs/core/GLOSSARY.md',
      'docs/core/SCHEMA.md',
    ],
    lineLimits: {
      'NEXT-TASKS.md': 300,
      'FUTURE-ENHANCEMENTS.md': 800,
      'ARCHITECTURE.md': 800,
      'PATTERNS.md': 800,
      'DOMAIN-LOGIC.md': 500,
      'DECISIONS.md': 600,
      'GLOSSARY.md': 400,
      'SCHEMA.md': 1000,
      'TROUBLESHOOTING.md': 600,
    },
  },
  {
    name: 'custom',
    displayName: 'Custom',
    description: 'Choose specific files to include (advanced)',
    mandatoryFiles: [], // Will be determined by user selection
    optionalFiles: [], // Will be determined by user selection
    lineLimits: DEFAULT_LINE_LIMITS,
  },
];

/**
 * Get the path to .cortexrc in a directory
 */
export function getConfigPath(cwd: string): string {
  return join(cwd, '.cortexrc');
}

/**
 * Check if a .cortexrc file exists
 */
export function hasConfig(cwd: string): boolean {
  return existsSync(getConfigPath(cwd));
}

/**
 * Load .cortexrc configuration from a directory
 */
export async function loadConfig(cwd: string): Promise<CortexConfig | null> {
  const configPath = getConfigPath(cwd);

  if (!existsSync(configPath)) {
    return null;
  }

  try {
    const content = await readFile(configPath, 'utf-8');
    const config = JSON.parse(content) as CortexConfig;

    // Validate version (for future migrations)
    if (config.version !== CONFIG_VERSION) {
      console.warn(
        `⚠️  Config version mismatch: expected ${CONFIG_VERSION}, got ${config.version}`
      );
    }

    return config;
  } catch (error) {
    throw new Error(
      `Failed to parse .cortexrc: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Merge user config with defaults
 */
export function mergeConfig(
  userConfig: Partial<CortexConfig> | null
): CortexConfig {
  if (!userConfig) {
    return { ...DEFAULT_CONFIG };
  }

  return {
    version: userConfig.version || DEFAULT_CONFIG.version,
    scope: userConfig.scope || DEFAULT_CONFIG.scope,
    paths: {
      ...DEFAULT_CONFIG.paths,
      ...userConfig.paths,
    },
    limits: {
      ...DEFAULT_CONFIG.limits,
      ...userConfig.limits,
    },
    validation: {
      ignorePatterns: [
        ...(DEFAULT_CONFIG.validation?.ignorePatterns || []),
        ...(userConfig.validation?.ignorePatterns || []),
      ],
      ignoreFiles: [
        ...(DEFAULT_CONFIG.validation?.ignoreFiles || []),
        ...(userConfig.validation?.ignoreFiles || []),
      ],
    },
    ...(userConfig.metadata && { metadata: userConfig.metadata }),
  };
}

/**
 * Save .cortexrc configuration to a directory
 */
export async function saveConfig(
  cwd: string,
  config: CortexConfig
): Promise<void> {
  const configPath = getConfigPath(cwd);

  try {
    const content = JSON.stringify(config, null, 2);
    await writeFile(configPath, content, 'utf-8');
  } catch (error) {
    throw new Error(
      `Failed to write .cortexrc: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Create a new config from a scope preset
 */
export function createConfigFromScope(
  scope: ProjectScope,
  projectName?: string,
  customFiles?: string[]
): CortexConfig {
  const preset = SCOPE_PRESETS.find((p) => p.name === scope);

  if (!preset) {
    throw new Error(`Unknown scope: ${scope}`);
  }

  const config: CortexConfig = {
    version: CONFIG_VERSION,
    scope,
    paths: { ...DEFAULT_CONFIG.paths },
    limits: preset.lineLimits,
    validation: { ...DEFAULT_CONFIG.validation },
  };

  if (projectName) {
    config.metadata = {
      created: new Date().toISOString(),
      projectName,
      ...(scope === 'custom' && customFiles && { customFiles }),
    };
  }

  return config;
}

/**
 * Get scope preset by name
 */
export function getScopePreset(scope: ProjectScope): ScopePreset | undefined {
  return SCOPE_PRESETS.find((p) => p.name === scope);
}

/**
 * Get effective line limits (merges preset with custom overrides)
 */
export function getEffectiveLineLimits(config: CortexConfig): LineLimits {
  const preset = getScopePreset(config.scope);
  const presetLimits = preset?.lineLimits || DEFAULT_LINE_LIMITS;

  return {
    ...DEFAULT_LINE_LIMITS,
    ...presetLimits,
    ...config.limits,
  } as LineLimits;
}
