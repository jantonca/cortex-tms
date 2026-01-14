/**
 * Cortex TMS CLI - Migrate Command
 *
 * Upgrades TMS files to the current template version while preserving custom changes
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { join } from 'path';
import { existsSync } from 'fs';
import { loadConfig, getScopePreset } from '../utils/config.js';
import { getPackageVersion, extractVersion, getTemplatesDir } from '../utils/templates.js';
import fs from 'fs-extra';

/**
 * Migration status for a single file
 */
export type MigrationStatus = 'LATEST' | 'OUTDATED' | 'CUSTOMIZED' | 'MISSING';

/**
 * File migration information
 */
export interface FileMigration {
  path: string;
  status: MigrationStatus;
  currentVersion: string | null;
  targetVersion: string;
  reason?: string;
}

/**
 * Create and configure the migrate command
 */
export function createMigrateCommand(): Command {
  const migrateCommand = new Command('migrate');

  migrateCommand
    .description('Upgrade TMS files to the current template version')
    .option('-f, --force', 'Force upgrade even for customized files')
    .option('-v, --verbose', 'Show detailed output')
    .option('-d, --dry-run', 'Preview changes without applying them')
    .action(async (options) => {
      await runMigrate(options);
    });

  return migrateCommand;
}

/**
 * Export command instance for registration in CLI
 */
export const migrateCommand = createMigrateCommand();

/**
 * Main migrate command logic
 */
async function runMigrate(options: {
  force?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
}): Promise<void> {
  const cwd = process.cwd();
  const { force: _force = false, verbose: _verbose = false, dryRun = false } = options;

  console.log(chalk.bold.cyan('\n🔄 Cortex TMS Migration\n'));

  if (dryRun) {
    console.log(chalk.yellow('🔍 DRY RUN MODE: No files will be modified.\n'));
  }

  // Step 1: Load configuration
  const spinner = ora('Loading project configuration...').start();
  const config = await loadConfig(cwd);

  if (!config) {
    spinner.fail('No .cortexrc found');
    console.log(
      chalk.red('\n❌ Error:'),
      'This directory is not a Cortex TMS project.'
    );
    console.log(chalk.gray('Run "cortex-tms init" to initialize.\n'));
    process.exit(1);
  }

  spinner.succeed('Configuration loaded');

  // Step 2: Get file list from scope
  const preset = getScopePreset(config.scope);
  if (!preset) {
    console.log(chalk.red('\n❌ Error:'), `Unknown scope: ${config.scope}\n`);
    process.exit(1);
  }

  const allFiles =
    config.scope === 'custom' && config.metadata?.customFiles
      ? config.metadata.customFiles
      : [...preset.mandatoryFiles, ...preset.optionalFiles];

  // Step 3: Analyze each file
  spinner.text = 'Analyzing files...';
  spinner.start();

  const targetVersion = getPackageVersion();
  const migrations: FileMigration[] = [];

  for (const file of allFiles) {
    const filePath = join(cwd, file);
    const status = await analyzeFile(filePath, targetVersion);
    migrations.push(status);
  }

  spinner.succeed(`Analyzed ${migrations.length} files`);

  // Step 4: Display migration report
  printMigrationReport(migrations, targetVersion);

  // Step 5: Determine if migration is needed
  const outdated = migrations.filter((m) => m.status === 'OUTDATED');
  const customized = migrations.filter((m) => m.status === 'CUSTOMIZED');
  const missing = migrations.filter((m) => m.status === 'MISSING');

  if (outdated.length === 0 && customized.length === 0 && missing.length === 0) {
    console.log(
      chalk.green.bold('\n✨ All files are up to date! No migration needed.\n')
    );
    return;
  }

  // Step 6: Show summary and next steps
  console.log(chalk.bold('\n📋 Migration Summary:\n'));

  if (outdated.length > 0) {
    console.log(
      chalk.blue(`  ✓ ${outdated.length} file(s) can be safely upgraded`)
    );
  }

  if (customized.length > 0) {
    console.log(
      chalk.yellow(`  ⚠ ${customized.length} file(s) have custom changes (manual review needed)`)
    );
  }

  if (missing.length > 0) {
    console.log(
      chalk.gray(`  ℹ ${missing.length} file(s) not installed (optional)`)
    );
  }

  if (dryRun) {
    console.log(
      chalk.gray('\n💡 Tip: Run without --dry-run to apply the migration.\n')
    );
    return;
  }

  // TODO: Phase 2 - Implement actual migration logic
  console.log(
    chalk.yellow('\n🚧 Migration execution coming in next phase...\n')
  );
  console.log(
    chalk.gray(
      '   The migration engine will automatically upgrade safe files and'
    )
  );
  console.log(
    chalk.gray('   create backups for customized ones.\n')
  );
}

/**
 * Analyze a single file's migration status
 */
async function analyzeFile(
  filePath: string,
  targetVersion: string
): Promise<FileMigration> {
  const fileName = filePath.split('/').pop() || filePath;

  // Check if file exists
  if (!existsSync(filePath)) {
    return {
      path: fileName,
      status: 'MISSING',
      currentVersion: null,
      targetVersion,
      reason: 'File not installed',
    };
  }

  // Extract version
  const currentVersion = await extractVersion(filePath);

  // No version metadata = pre-versioned file
  if (!currentVersion) {
    return {
      path: fileName,
      status: 'CUSTOMIZED',
      currentVersion: null,
      targetVersion,
      reason: 'Pre-versioned file (needs manual review)',
    };
  }

  // Already on target version
  if (currentVersion === targetVersion) {
    return {
      path: fileName,
      status: 'LATEST',
      currentVersion,
      targetVersion,
    };
  }

  // Outdated version - check if customized
  const isCustomized = await checkIfCustomized(filePath);

  return {
    path: fileName,
    status: isCustomized ? 'CUSTOMIZED' : 'OUTDATED',
    currentVersion,
    targetVersion,
    reason: isCustomized ? 'File has custom changes' : 'Template update available',
  };
}

/**
 * Check if a file has been customized by comparing to original template
 */
async function checkIfCustomized(filePath: string): Promise<boolean> {
  try {
    const fileName = filePath.split('/').pop() || '';
    const templatesDir = getTemplatesDir();
    const templatePath = join(templatesDir, fileName);

    // If template doesn't exist, assume customized
    if (!existsSync(templatePath)) {
      return true;
    }

    // Read both files
    const userContent = await fs.readFile(filePath, 'utf-8');
    const templateContent = await fs.readFile(templatePath, 'utf-8');

    // Strip version metadata for comparison
    const stripVersion = (content: string) =>
      content.replace(/<!-- @cortex-tms-version [\d.]+ -->\n?/g, '').trim();

    const userStripped = stripVersion(userContent);
    const templateStripped = stripVersion(templateContent);

    // If content matches template, it's not customized
    return userStripped !== templateStripped;
  } catch (error) {
    // If we can't determine, assume customized (safer)
    return true;
  }
}

/**
 * Print formatted migration report
 */
function printMigrationReport(
  migrations: FileMigration[],
  targetVersion: string
): void {
  console.log(chalk.bold(`\n📊 Migration Report (Target: v${targetVersion}):\n`));

  // Group by status
  const byStatus: Record<MigrationStatus, FileMigration[]> = {
    LATEST: [],
    OUTDATED: [],
    CUSTOMIZED: [],
    MISSING: [],
  };

  migrations.forEach((m) => byStatus[m.status].push(m));

  // Status configuration
  const statusConfig: Record<
    MigrationStatus,
    { icon: string; color: typeof chalk.green; label: string }
  > = {
    LATEST: { icon: '✅', color: chalk.green, label: 'UP TO DATE' },
    OUTDATED: { icon: '🔄', color: chalk.blue, label: 'OUTDATED' },
    CUSTOMIZED: { icon: '⚠️ ', color: chalk.yellow, label: 'CUSTOMIZED' },
    MISSING: { icon: 'ℹ️ ', color: chalk.gray, label: 'NOT INSTALLED' },
  };

  // Print each status group
  for (const status of ['LATEST', 'OUTDATED', 'CUSTOMIZED', 'MISSING'] as MigrationStatus[]) {
    const items = byStatus[status];
    if (items.length === 0) continue;

    const config = statusConfig[status];
    console.log(config.color.bold(`${config.icon} ${config.label} (${items.length}):`));

    items.forEach((item) => {
      const versionText = item.currentVersion
        ? chalk.gray(` v${item.currentVersion} → v${item.targetVersion}`)
        : '';
      const reasonText = item.reason ? chalk.gray(` - ${item.reason}`) : '';
      console.log(`  ${config.color(item.path)}${versionText}${reasonText}`);
    });

    console.log();
  }
}
