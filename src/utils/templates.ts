/**
 * Cortex TMS CLI - Template Processing
 *
 * Handles copying templates from the templates/ directory and
 * replacing placeholders with user-provided values.
 */

import fs from 'fs-extra';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { TemplateFile } from '../types/cli.js';
import { getScopePreset } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the absolute path to the templates directory
 */
export function getTemplatesDir(): string {
  // From src/utils/templates.ts -> go up to root, then into templates/
  return join(__dirname, '../../templates');
}

/**
 * Replace placeholders in template content
 *
 * Supported placeholders:
 * - [Project Name] - Full project name
 * - [project-name] - Kebab-case project name
 * - [Description] - Project description
 *
 * @param content - Template file content
 * @param replacements - Map of placeholder keys to replacement values
 * @returns Content with placeholders replaced
 */
export function replacePlaceholders(
  content: string,
  replacements: Record<string, string>
): string {
  let result = content;

  Object.entries(replacements).forEach(([key, value]) => {
    // Replace [Key] with Value (exact match)
    const placeholder = `[${key}]`;
    result = result.replaceAll(placeholder, value);
  });

  return result;
}

/**
 * Process a single template file: read, replace, write
 *
 * @param sourcePath - Absolute path to source template file
 * @param destPath - Absolute path to destination file
 * @param replacements - Placeholder replacements
 */
export async function processTemplate(
  sourcePath: string,
  destPath: string,
  replacements: Record<string, string>
): Promise<void> {
  // Read template content
  const content = await fs.readFile(sourcePath, 'utf-8');

  // Replace placeholders
  const processed = replacePlaceholders(content, replacements);

  // Ensure destination directory exists
  await fs.ensureDir(dirname(destPath));

  // Write processed content
  await fs.writeFile(destPath, processed, 'utf-8');
}

/**
 * Get all template files recursively from the templates directory
 *
 * @param templatesDir - Absolute path to templates directory
 * @returns Array of TemplateFile objects with metadata
 */
export async function getTemplateFiles(
  templatesDir: string
): Promise<TemplateFile[]> {
  const files: TemplateFile[] = [];

  async function walk(dir: string, baseDir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively walk subdirectories
        await walk(fullPath, baseDir);
      } else if (entry.isFile()) {
        // Get relative path from templates root
        const relativePath = relative(baseDir, fullPath);

        // Determine category based on path
        let category: TemplateFile['category'] = 'core';
        if (relativePath.startsWith('.github')) {
          category = 'workflow';
        } else if (relativePath.startsWith('examples')) {
          category = 'example';
        }

        // Check if file has placeholders (simple heuristic)
        const content = await fs.readFile(fullPath, 'utf-8');
        const hasPlaceholders =
          content.includes('[Project Name]') ||
          content.includes('[project-name]') ||
          content.includes('[Description]');

        files.push({
          source: fullPath,
          destination: relativePath,
          hasPlaceholders,
          category,
        });
      }
    }
  }

  await walk(templatesDir, templatesDir);
  return files;
}

/**
 * Copy templates to destination directory based on scope
 *
 * @param templatesDir - Source templates directory
 * @param destDir - Destination directory (user's project)
 * @param replacements - Placeholder replacements
 * @param options - Copy options
 */
export async function copyTemplates(
  templatesDir: string,
  destDir: string,
  replacements: Record<string, string>,
  options: {
    overwrite?: boolean;
    scope?: 'nano' | 'standard' | 'enterprise' | 'custom';
    customFiles?: string[]; // Only used when scope is 'custom'
  } = {}
): Promise<{ copied: number; skipped: number }> {
  const { overwrite = false, scope = 'standard', customFiles } = options;

  const allFiles = await getTemplateFiles(templatesDir);

  let allowedFiles: string[];

  // Handle custom scope with explicit file list
  if (scope === 'custom' && customFiles) {
    allowedFiles = customFiles;
  } else {
    // Get scope preset to determine which files to copy
    const preset = getScopePreset(scope);

    if (!preset) {
      throw new Error(`Unknown scope: ${scope}`);
    }

    // Combine mandatory and optional files for this scope
    allowedFiles = [...preset.mandatoryFiles, ...preset.optionalFiles];
  }

  // Filter files based on scope - match against full destination path
  const filesToCopy = allFiles.filter((f) => {
    // Always exclude examples directory
    if (f.category === 'example') {
      return false;
    }

    // Check if the file's destination path is in the allowed list
    return allowedFiles.includes(f.destination);
  });

  let copied = 0;
  let skipped = 0;

  for (const file of filesToCopy) {
    const destPath = join(destDir, file.destination);

    // Skip if file exists and overwrite is false
    if (!overwrite && (await fs.pathExists(destPath))) {
      skipped++;
      continue;
    }

    // Process template with placeholder replacement
    await processTemplate(file.source, destPath, replacements);
    copied++;
  }

  return { copied, skipped };
}

/**
 * Generate replacements map from user inputs
 *
 * @param projectName - User's project name
 * @param description - Project description
 * @returns Replacements map for template processing
 */
export function generateReplacements(
  projectName: string,
  description?: string
): Record<string, string> {
  // Generate kebab-case version
  const kebabName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    'Project Name': projectName,
    'project-name': kebabName,
    Description: description || `A project powered by Cortex TMS`,
  };
}
