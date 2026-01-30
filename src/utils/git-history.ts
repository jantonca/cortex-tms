import { execSync } from 'child_process';

export interface FileGitInfo {
  path: string;
  lastCommitTimestamp: number | null;  // Unix timestamp
  daysSinceChange: number;
  isTracked: boolean;
  isNewFile: boolean;
}

/**
 * Check if directory is inside a git repository
 * Works from any subdirectory within the repo
 */
export function isGitRepo(cwd: string): boolean {
  try {
    const result = execSync(
      'git rev-parse --is-inside-work-tree',
      { cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    return result === 'true';
  } catch {
    return false;
  }
}

/**
 * Get last commit timestamp for a file
 * Uses --follow to track renames
 */
export function getFileLastCommit(cwd: string, filePath: string): number | null {
  try {
    const result = execSync(
      `git log -1 --format=%ct --follow -- "${filePath}"`,
      { cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();

    return result ? parseInt(result, 10) : null;
  } catch {
    return null;  // File not in git history
  }
}

/**
 * Analyze git history for multiple files
 */
export function analyzeFileHistory(
  cwd: string,
  files: string[]
): FileGitInfo[] {
  const now = Math.floor(Date.now() / 1000);

  return files.map(path => {
    const lastCommitTimestamp = getFileLastCommit(cwd, path);
    const isTracked = lastCommitTimestamp !== null;

    // New/untracked files get daysSinceChange = 0 (treat as HOT)
    const daysSinceChange = isTracked
      ? (now - lastCommitTimestamp!) / 86400
      : 0;

    return {
      path,
      lastCommitTimestamp,
      daysSinceChange,
      isTracked,
      isNewFile: !isTracked,
    };
  });
}
