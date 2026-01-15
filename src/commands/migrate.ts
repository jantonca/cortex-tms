/**
 * Cortex TMS CLI - Migrate Command
 *
 * Upgrades TMS files to the current template version while preserving custom changes
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { join } from 'path';
import { existsSync } from 'fs';
import { loadConfig, getScopePreset } from '../utils/config.js';
import { getPackageVersion, extractVersion, getTemplatesDir } from '../utils/templates.js';
import { createBackup, listBackups, restoreBackup, formatBackupSize, getBackupSize } from '../utils/backup.js';
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
    .option('-a, --apply', 'Apply automatic upgrades (creates backup first)')
    .option('-r, --rollback', 'Restore files from a previous backup')
    .option('-f, --force', 'Force upgrade even for customized files (requires --apply)')
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
  apply?: boolean;
  rollback?: boolean;
  force?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
}): Promise<void> {
  const cwd = process.cwd();
  const { apply = false, rollback = false, force = false, verbose: _verbose = false, dryRun = false } = options;

  // Handle rollback mode
  if (rollback) {
    await runRollback(cwd);
    return;
  }

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
    printNextSteps(outdated.length, customized.length, apply);
    return;
  }

  // If --apply flag is set, perform automatic upgrades
  if (apply) {
    await applyMigration(cwd, migrations, targetVersion, force);
  } else {
    printNextSteps(outdated.length, customized.length, apply);
  }
}

/**
 * Apply automatic migration with backup
 */
async function applyMigration(
  projectRoot: string,
  migrations: FileMigration[],
  targetVersion: string,
  force: boolean
): Promise<void> {
  const outdated = migrations.filter((m) => m.status === 'OUTDATED');
  const customized = migrations.filter((m) => m.status === 'CUSTOMIZED');

  // Determine which files to upgrade
  const filesToUpgrade = force ? [...outdated, ...customized] : outdated;

  if (filesToUpgrade.length === 0) {
    console.log(chalk.yellow('\n⚠️  No files to upgrade.\n'));
    return;
  }

  // Show what will be upgraded
  console.log(chalk.bold('\n🔄 Files to be upgraded:\n'));
  filesToUpgrade.forEach((file) => {
    const icon = file.status === 'CUSTOMIZED' ? '⚠️ ' : '✓';
    console.log(chalk.blue(`  ${icon} ${file.path}`));
  });

  if (!force && customized.length > 0) {
    console.log(
      chalk.yellow(
        `\n⚠️  ${customized.length} CUSTOMIZED file(s) skipped. Use --force to upgrade them.\n`
      )
    );
  }

  // Create backup
  console.log(chalk.bold('\n💾 Creating backup...\n'));
  const spinner = ora('Backing up files...').start();

  const filePaths = filesToUpgrade.map((m) => join(projectRoot, m.path));
  const backupResult = await createBackup(
    projectRoot,
    filePaths,
    `migrate to v${targetVersion}`,
    targetVersion
  );

  if (!backupResult.success) {
    spinner.fail('Backup failed');
    console.log(chalk.red('\n❌ Error:'), backupResult.error);
    console.log(chalk.gray('Migration aborted to prevent data loss.\n'));
    process.exit(1);
  }

  spinner.succeed(`Backup created: ${chalk.cyan(backupResult.backupPath)}`);
  console.log(
    chalk.gray(
      `   ${backupResult.filesBackedUp} file(s) backed up safely\n`
    )
  );

  // Apply upgrades
  console.log(chalk.bold('🚀 Applying upgrades...\n'));
  const upgradeSpinner = ora('Updating files...').start();

  let upgradedCount = 0;
  const templatesDir = getTemplatesDir();

  for (const migration of filesToUpgrade) {
    const filePath = join(projectRoot, migration.path);
    const templatePath = join(templatesDir, migration.path);

    // Skip if template doesn't exist
    if (!existsSync(templatePath)) {
      continue;
    }

    try {
      // Copy template to destination
      await fs.copyFile(templatePath, filePath);
      upgradedCount++;
    } catch (error) {
      upgradeSpinner.warn(`Failed to upgrade ${migration.path}`);
      console.log(
        chalk.yellow(
          `   ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      );
    }
  }

  upgradeSpinner.succeed(
    `Upgraded ${upgradedCount} file(s) to v${targetVersion}`
  );

  // Success message
  console.log(chalk.green.bold('\n✨ Migration complete!\n'));
  console.log(chalk.gray('💡 Tip: Review changes with:'));
  console.log(chalk.cyan('   git diff\n'));
  console.log(chalk.gray('💡 To rollback, run:'));
  console.log(chalk.cyan('   cortex-tms migrate --rollback\n'));
}

/**
 * Rollback to a previous backup
 */
async function runRollback(projectRoot: string): Promise<void> {
  console.log(chalk.bold.cyan('\n⏪ Cortex TMS Rollback\n'));

  // List available backups
  const spinner = ora('Searching for backups...').start();
  const backups = await listBackups(projectRoot);

  if (backups.length === 0) {
    spinner.fail('No backups found');
    console.log(chalk.yellow('\n⚠️  No backup snapshots available.'));
    console.log(chalk.gray('Backups are created automatically when using:'));
    console.log(chalk.cyan('   cortex-tms migrate --apply\n'));
    return;
  }

  spinner.succeed(`Found ${backups.length} backup(s)`);

  // Format backup choices for inquirer
  const choices = await Promise.all(
    backups.slice(0, 5).map(async (backup) => {
      const backupPath = join(projectRoot, '.cortex', 'backups', backup.timestamp);
      const size = await getBackupSize(backupPath);
      const formattedSize = formatBackupSize(size);
      const fileCount = backup.files.length;

      return {
        name: `${chalk.cyan(backup.timestamp)} - ${chalk.gray(`v${backup.version}`)} - ${chalk.blue(`${fileCount} file(s)`)} - ${chalk.gray(formattedSize)}`,
        value: backup.timestamp,
        short: backup.timestamp,
      };
    })
  );

  // Add cancel option
  choices.push({
    name: chalk.gray('Cancel'),
    value: 'cancel',
    short: 'Cancel',
  });

  // Prompt user to select backup
  const { selectedBackup } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedBackup',
      message: 'Select a backup to restore:',
      choices,
      pageSize: 10,
    },
  ]);

  if (selectedBackup === 'cancel') {
    console.log(chalk.gray('\n✓ Rollback cancelled.\n'));
    return;
  }

  // Get selected backup manifest
  const selectedManifest = backups.find((b) => b.timestamp === selectedBackup);
  if (!selectedManifest) {
    console.log(chalk.red('\n❌ Error:'), 'Backup not found.\n');
    return;
  }

  // Show what will be restored
  console.log(chalk.bold('\n📋 Files to be restored:\n'));
  selectedManifest.files.forEach((file) => {
    console.log(chalk.blue(`  ✓ ${file.relativePath}`));
  });

  // Confirm restoration
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: chalk.yellow('This will overwrite current files. Continue?'),
      default: false,
    },
  ]);

  if (!confirmed) {
    console.log(chalk.gray('\n✓ Rollback cancelled.\n'));
    return;
  }

  // Perform rollback
  console.log(chalk.bold('\n⏪ Restoring backup...\n'));
  const restoreSpinner = ora('Restoring files...').start();

  try {
    const backupPath = join(projectRoot, '.cortex', 'backups', selectedBackup);
    const restoredCount = await restoreBackup(backupPath);

    restoreSpinner.succeed(`Restored ${restoredCount} file(s) from backup`);

    // Success message
    console.log(chalk.green.bold('\n✨ Rollback complete!\n'));
    console.log(chalk.gray('💡 Tip: Review restored files with:'));
    console.log(chalk.cyan('   git diff\n'));
  } catch (error) {
    restoreSpinner.fail('Rollback failed');
    console.log(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : 'Unknown error');
    console.log(chalk.gray('Files may be partially restored.\n'));
    process.exit(1);
  }
}

/**
 * Print next steps and guidance for manual migration
 */
function printNextSteps(outdatedCount: number, customizedCount: number, applyAvailable: boolean): void {
  console.log(chalk.bold('\n📋 Next Steps:\n'));

  if (outdatedCount > 0) {
    console.log(
      chalk.blue('  1. Review OUTDATED files marked above')
    );
    console.log(
      chalk.gray('     → These match the old template and can be safely upgraded')
    );
  }

  if (customizedCount > 0) {
    console.log(
      chalk.yellow(`  ${outdatedCount > 0 ? '2' : '1'}. Review CUSTOMIZED files marked above`)
    );
    console.log(
      chalk.gray('     → These have custom changes - preserve your modifications')
    );
  }

  console.log(
    chalk.gray(`  ${outdatedCount > 0 || customizedCount > 0 ? (outdatedCount > 0 && customizedCount > 0 ? '3' : '2') : '1'}. Check the latest templates at:`)
  );
  console.log(
    chalk.cyan('     https://github.com/cortex-tms/cortex-tms/tree/main/templates')
  );

  if (applyAvailable && (outdatedCount > 0 || customizedCount > 0)) {
    console.log(chalk.bold.cyan('\n🚀 Automatic Upgrade Available:\n'));

    if (outdatedCount > 0) {
      console.log(chalk.blue('   cortex-tms migrate --apply'));
      console.log(chalk.gray('   → Safely upgrade OUTDATED files (creates backup)\n'));
    }

    if (customizedCount > 0) {
      console.log(chalk.yellow('   cortex-tms migrate --apply --force'));
      console.log(chalk.gray('   → Upgrade ALL files including customized (use with caution)\n'));
    }
  } else {
    console.log(
      chalk.gray('   Or manually review and update files as needed.\n')
    );
  }
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
