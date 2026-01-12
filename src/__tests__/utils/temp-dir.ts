/**
 * Test Utilities - Temporary Directory Management
 *
 * Provides safe, isolated temporary directories for testing file operations.
 */

import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

/**
 * Create a temporary directory for testing
 * @returns Path to the temporary directory
 */
export async function createTempDir(): Promise<string> {
  const prefix = join(tmpdir(), 'cortex-test-');
  return await mkdtemp(prefix);
}

/**
 * Clean up a temporary directory
 * @param dirPath Path to the directory to remove
 */
export async function cleanupTempDir(dirPath: string): Promise<void> {
  try {
    await rm(dirPath, { recursive: true, force: true });
  } catch (error) {
    // Ignore cleanup errors in tests
    console.warn(`Warning: Failed to cleanup ${dirPath}:`, error);
  }
}

/**
 * Get list of files in a directory (non-recursive)
 */
export async function getFiles(dirPath: string): Promise<string[]> {
  const { readdir } = await import('fs/promises');
  return await readdir(dirPath);
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  const { access } = await import('fs/promises');
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read file contents
 */
export async function readFile(filePath: string): Promise<string> {
  const { readFile: fsReadFile } = await import('fs/promises');
  return await fsReadFile(filePath, 'utf-8');
}
