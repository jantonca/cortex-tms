/**
 * Cortex TMS CLI - Prompt Parser
 *
 * Parses PROMPTS.md to extract project-aware AI prompt templates
 */

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Parsed prompt template
 */
export interface Prompt {
  /** Prompt identifier (e.g., "init-session", "feature") */
  name: string;
  /** Full prompt text */
  content: string;
  /** Short description for list display */
  description: string;
}

/**
 * Parse PROMPTS.md file to extract all prompt templates
 *
 * Format expected:
 * ## prompt-name
 * Prompt content here...
 * ---
 *
 * @param promptsFilePath - Absolute path to PROMPTS.md
 * @returns Array of parsed prompts
 */
export async function parsePromptsFile(
  promptsFilePath: string
): Promise<Prompt[]> {
  if (!existsSync(promptsFilePath)) {
    throw new Error(`PROMPTS.md not found at: ${promptsFilePath}`);
  }

  const content = await readFile(promptsFilePath, 'utf-8');
  const prompts: Prompt[] = [];

  // Split by markdown H2 headers (## prompt-name)
  const sections = content.split(/^## /gm).filter(Boolean);

  for (const section of sections) {
    // Skip the file header section (before first prompt)
    if (section.includes('# Cortex TMS:')) {
      continue;
    }

    // Extract prompt name (first line)
    const lines = section.trim().split('\n');
    const nameMatch = lines[0]?.trim();

    // Skip meta sections like "Usage Tips"
    if (!nameMatch || nameMatch.toLowerCase().includes('usage') || nameMatch.toLowerCase().includes('tip')) {
      continue;
    }

    // Extract prompt content (everything after name, before separator)
    const contentLines = lines.slice(1);
    const promptContent = (contentLines
      .join('\n')
      .split('---')[0] || '') // Stop at section separator
      .trim();

    // Generate short description (first sentence)
    const description =
      promptContent
        .split('.')
        .slice(0, 2)
        .join('.')
        .trim()
        .substring(0, 100) + (promptContent.length > 100 ? '...' : '');

    if (promptContent) {
      prompts.push({
        name: nameMatch,
        content: promptContent,
        description,
      });
    }
  }

  return prompts;
}

/**
 * Get prompts from the project's PROMPTS.md file
 *
 * @param cwd - Current working directory
 * @returns Array of parsed prompts
 */
export async function getProjectPrompts(cwd: string): Promise<Prompt[]> {
  const promptsPath = join(cwd, 'PROMPTS.md');
  return await parsePromptsFile(promptsPath);
}

/**
 * Find a specific prompt by name
 *
 * @param cwd - Current working directory
 * @param promptName - Name of prompt to find
 * @returns Prompt content or null if not found
 */
export async function getPrompt(
  cwd: string,
  promptName: string
): Promise<string | null> {
  const prompts = await getProjectPrompts(cwd);
  const prompt = prompts.find((p) => p.name === promptName);
  return prompt ? prompt.content : null;
}
