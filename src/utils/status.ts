/**
 * Cortex TMS CLI - Status Utilities
 *
 * Provides functions to parse TMS files and extract status information
 * for the dashboard view.
 */

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import type { CortexConfig } from '../types/cli.js';
import { loadConfig } from './config.js';

/**
 * Information about the current sprint
 */
export interface SprintInfo {
  name: string; // e.g., "v2.3 - Confidence & Comfort"
  description: string; // "Why this matters" section
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
}

/**
 * Project status summary
 */
export interface ProjectStatus {
  projectName: string;
  scope: string;
  sprint: SprintInfo | null;
  backlogSize: number;
  config: CortexConfig | null;
}

/**
 * Parse sprint information from NEXT-TASKS.md
 *
 * Extracts:
 * - Sprint name from "## Active Sprint: [name]"
 * - Description from "**Why this matters**: [description]"
 * - Task counts from the task table
 *
 * @param content - Content of NEXT-TASKS.md
 * @returns Sprint information or null if not found
 */
export function parseSprintInfo(content: string): SprintInfo | null {
  // Match sprint header: ## Active Sprint: v2.3 - Confidence & Comfort
  const sprintMatch = content.match(/##\s+Active Sprint:\s*(.+?)(?:\n|$)/i);
  if (!sprintMatch) {
    return null;
  }

  const sprintName = sprintMatch[1]?.trim() || '';

  // Match description: **Why this matters**: With automation and...
  const descMatch = content.match(/\*\*Why this matters\*\*:\s*(.+?)(?:\n|$)/i);
  const description = descMatch?.[1]?.trim() || '';

  // Count tasks in the table by status emoji
  // Match lines like: | **Task Name** - Description | [TMS-XXX] | 2h | 🔴 HIGH | ✅ Done |
  const taskLines = content.match(/\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|/g) || [];

  // Skip header rows (contain "Task", "Ref", etc.)
  const dataRows = taskLines.filter(
    (line) => !line.includes('Task') && !line.includes('---')
  );

  let completedTasks = 0;
  let inProgressTasks = 0;
  let todoTasks = 0;

  for (const row of dataRows) {
    if (row.includes('✅ Done')) {
      completedTasks++;
    } else if (row.includes('🔄 In Progress')) {
      inProgressTasks++;
    } else if (row.includes('⬜ Todo')) {
      todoTasks++;
    }
  }

  const totalTasks = completedTasks + inProgressTasks + todoTasks;

  return {
    name: sprintName,
    description,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
  };
}

/**
 * Count backlog items in FUTURE-ENHANCEMENTS.md
 *
 * Counts top-level list items (lines starting with "- **")
 *
 * @param content - Content of FUTURE-ENHANCEMENTS.md
 * @returns Number of backlog items
 */
export function countBacklogItems(content: string): number {
  // Match top-level enhancements (lines starting with "- **" or "### ")
  // that are actual feature items, not section headers
  const itemMatches = content.match(/^- \*\*.+?\*\*:/gm) || [];
  return itemMatches.length;
}

/**
 * Calculate sprint progress percentage
 *
 * @param sprint - Sprint information
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(sprint: SprintInfo): number {
  if (sprint.totalTasks === 0) {
    return 0;
  }
  return Math.round((sprint.completedTasks / sprint.totalTasks) * 100);
}

/**
 * Get project status from TMS files
 *
 * Reads configuration, task list, and backlog to assemble
 * a complete status picture.
 *
 * @param cwd - Current working directory
 * @returns Project status summary
 */
export async function getProjectStatus(cwd: string): Promise<ProjectStatus> {
  // Load configuration
  let config: CortexConfig | null = null;
  try {
    config = await loadConfig(cwd);
  } catch {
    // Config not found or invalid - continue with defaults
  }

  const projectName = config?.metadata?.projectName || 'Unknown Project';
  const scope = config?.scope || 'unknown';

  // Parse sprint from NEXT-TASKS.md
  let sprint: SprintInfo | null = null;
  const tasksPath = join(cwd, 'NEXT-TASKS.md');
  if (existsSync(tasksPath)) {
    try {
      const tasksContent = await readFile(tasksPath, 'utf-8');
      sprint = parseSprintInfo(tasksContent);
    } catch {
      // Failed to read or parse tasks file
    }
  }

  // Count backlog items from FUTURE-ENHANCEMENTS.md
  let backlogSize = 0;
  const backlogPath = join(cwd, 'FUTURE-ENHANCEMENTS.md');
  if (existsSync(backlogPath)) {
    try {
      const backlogContent = await readFile(backlogPath, 'utf-8');
      backlogSize = countBacklogItems(backlogContent);
    } catch {
      // Failed to read or parse backlog file
    }
  }

  return {
    projectName,
    scope,
    sprint,
    backlogSize,
    config,
  };
}
