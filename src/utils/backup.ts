/**
 * Cortex TMS - Backup Utility
 *
 * Provides atomic snapshot capabilities for safe file operations
 * Used by migrate --apply and other potentially destructive commands
 */

import { join, dirname, relative } from 'path';
import { existsSync, mkdirSync } from 'fs';
import fs from 'fs-extra';

/**
 * Metadata for a backed-up file
 */
export interface BackupFileInfo {
  relativePath: string;
  originalPath: string;
  size: number;
  reason: string;
}

/**
 * Manifest describing a backup snapshot
 */
export interface BackupManifest {
  timestamp: string;
  version: string;
  reason: string;
  files: BackupFileInfo[];
  projectRoot: string;
}

/**
 * Result of a backup operation
 */
export interface BackupResult {
  success: boolean;
  backupPath: string;
  filesBackedUp: number;
  error?: string;
}

/**
 * Create a timestamped backup of specified files
 *
 * @param projectRoot - Root directory of the project
 * @param filesToBackup - Array of absolute file paths to backup
 * @param reason - Reason for creating the backup (e.g., "migrate --apply v2.5.0")
 * @param version - Target version being applied
 * @returns BackupResult with path to backup directory
 */
export async function createBackup(
  projectRoot: string,
  filesToBackup: string[],
  reason: string,
  version: string
): Promise<BackupResult> {
  try {
    // Generate timestamp for backup directory
    const timestamp = generateTimestamp();
    const backupDir = join(projectRoot, '.cortex', 'backups', timestamp);

    // Ensure backup directory exists
    if (!existsSync(backupDir)) {
      mkdirSync(backupDir, { recursive: true });
    }

    // Backup each file
    const backedUpFiles: BackupFileInfo[] = [];

    for (const filePath of filesToBackup) {
      // Skip if file doesn't exist
      if (!existsSync(filePath)) {
        continue;
      }

      // Calculate relative path from project root
      const relativePath = relative(projectRoot, filePath);

      // Create destination path preserving directory structure
      const destPath = join(backupDir, relativePath);
      const destDir = dirname(destPath);

      // Ensure destination directory exists
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }

      // Copy file
      await fs.copyFile(filePath, destPath);

      // Get file size
      const stats = await fs.stat(filePath);

      backedUpFiles.push({
        relativePath,
        originalPath: filePath,
        size: stats.size,
        reason: `Backup before ${reason}`,
      });
    }

    // Create manifest
    const manifest: BackupManifest = {
      timestamp,
      version,
      reason,
      files: backedUpFiles,
      projectRoot,
    };

    // Write manifest to backup directory
    const manifestPath = join(backupDir, 'manifest.json');
    await fs.writeJson(manifestPath, manifest, { spaces: 2 });

    return {
      success: true,
      backupPath: backupDir,
      filesBackedUp: backedUpFiles.length,
    };
  } catch (error) {
    return {
      success: false,
      backupPath: '',
      filesBackedUp: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Restore files from a backup directory
 *
 * @param backupPath - Path to the backup directory
 * @returns Number of files restored
 */
export async function restoreBackup(backupPath: string): Promise<number> {
  // Read manifest
  const manifestPath = join(backupPath, 'manifest.json');

  if (!existsSync(manifestPath)) {
    throw new Error('Backup manifest not found');
  }

  const manifest: BackupManifest = await fs.readJson(manifestPath);

  let restoredCount = 0;

  // Restore each file
  for (const fileInfo of manifest.files) {
    const sourcePath = join(backupPath, fileInfo.relativePath);
    const destPath = fileInfo.originalPath;

    // Skip if backup file doesn't exist
    if (!existsSync(sourcePath)) {
      continue;
    }

    // Ensure destination directory exists
    const destDir = dirname(destPath);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    // Copy file back
    await fs.copyFile(sourcePath, destPath);
    restoredCount++;
  }

  return restoredCount;
}

/**
 * List all available backups in the project
 *
 * @param projectRoot - Root directory of the project
 * @returns Array of backup manifests
 */
export async function listBackups(projectRoot: string): Promise<BackupManifest[]> {
  const backupsDir = join(projectRoot, '.cortex', 'backups');

  if (!existsSync(backupsDir)) {
    return [];
  }

  const backupDirs = await fs.readdir(backupsDir);
  const manifests: BackupManifest[] = [];

  for (const dir of backupDirs) {
    const manifestPath = join(backupsDir, dir, 'manifest.json');

    if (existsSync(manifestPath)) {
      try {
        const manifest = await fs.readJson(manifestPath);
        manifests.push(manifest);
      } catch (error) {
        // Skip invalid manifests
        continue;
      }
    }
  }

  // Sort by timestamp (newest first)
  return manifests.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

/**
 * Delete old backups, keeping only the most recent N backups
 *
 * @param projectRoot - Root directory of the project
 * @param keepCount - Number of backups to keep (default: 10)
 * @returns Number of backups deleted
 */
export async function pruneBackups(
  projectRoot: string,
  keepCount: number = 10
): Promise<number> {
  const backups = await listBackups(projectRoot);

  if (backups.length <= keepCount) {
    return 0;
  }

  const backupsDir = join(projectRoot, '.cortex', 'backups');
  const toDelete = backups.slice(keepCount);
  let deletedCount = 0;

  for (const backup of toDelete) {
    const backupDir = join(backupsDir, backup.timestamp);

    if (existsSync(backupDir)) {
      await fs.remove(backupDir);
      deletedCount++;
    }
  }

  return deletedCount;
}

/**
 * Generate a timestamp string for backup directory naming
 *
 * @returns Timestamp in format: YYYY-MM-DD_HHMMSS
 */
function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}${minutes}${seconds}`;
}

/**
 * Get the size of a backup directory in bytes
 *
 * @param backupPath - Path to the backup directory
 * @returns Size in bytes
 */
export async function getBackupSize(backupPath: string): Promise<number> {
  const manifestPath = join(backupPath, 'manifest.json');

  if (!existsSync(manifestPath)) {
    return 0;
  }

  const manifest: BackupManifest = await fs.readJson(manifestPath);

  return manifest.files.reduce((total, file) => total + file.size, 0);
}

/**
 * Format backup size for human-readable display
 *
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatBackupSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
