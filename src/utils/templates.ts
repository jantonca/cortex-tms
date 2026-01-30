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
import chalk from 'chalk';
import type { TemplateFile } from '../types/cli.js';
import { getScopePreset } from './config.js';
import { validateSafePath } from './validation.js';
import { FileSystemError } from './errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the current package version from package.json
 */
export function getPackageVersion(): string {
  const packageJsonPath = join(__dirname, '../../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.version;
}

/**
 * Inject version metadata into file content
 *
 * Appends a hidden comment with version information to track template versions.
 * This enables the migrate command to detect and upgrade templates safely.
 *
 * @param content - Original file content
 * @param version - Version string (e.g., "2.3.0")
 * @returns Content with version metadata appended
 */
export function injectVersionMetadata(content: string, version: string): string {
  // Ensure content ends with newline
  const normalizedContent = content.endsWith('\n') ? content : content + '\n';

  // Append version comment
  return `${normalizedContent}\n<!-- @cortex-tms-version ${version} -->\n`;
}

/**
 * Extract version metadata from file content
 *
 * Parses the @cortex-tms-version comment to determine the template version.
 * Returns null if no version metadata is found (pre-versioned files).
 * Supports semver prerelease versions (e.g., "2.6.0-beta.1").
 *
 * @param filePath - Absolute path to file to check
 * @returns Version string (e.g., "2.3.0" or "2.6.0-beta.1") or null if not found
 */
export async function extractVersion(filePath: string): Promise<string | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    // Support full semver including prerelease tags (beta, alpha, rc, etc.)
    // Matches: 2.6.0, 2.6.0-beta.1, 2.6.0-alpha.3, 2.6.0-rc.2
    const match = content.match(/<!-- @cortex-tms-version (\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?) -->/);
    return match?.[1] ?? null;
  } catch (error) {
    // File doesn't exist or can't be read
    return null;
  }
}

/**
 * File change status for impact analysis
 */
export type FileStatus = 'CREATE' | 'UPDATE' | 'SKIP' | 'CONFLICT';

/**
 * File change information for dry-run mode
 */
export interface FileChange {
  path: string;
  status: FileStatus;
  reason?: string;
}

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
 * @param options - Processing options
 */
export async function processTemplate(
  sourcePath: string,
  destPath: string,
  replacements: Record<string, string>,
  options: { injectVersion?: boolean } = {}
): Promise<void> {
  const { injectVersion = true } = options;

  // Read template content
  const content = await fs.readFile(sourcePath, 'utf-8');

  // Replace placeholders
  let processed = replacePlaceholders(content, replacements);

  // Inject version metadata for markdown files
  if (injectVersion && destPath.endsWith('.md')) {
    const version = getPackageVersion();
    processed = injectVersionMetadata(processed, version);
  }

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
    dryRun?: boolean; // Preview changes without writing
  } = {}
): Promise<{ copied: number; skipped: number; changes?: FileChange[] }> {
  const { overwrite = false, scope = 'standard', customFiles, dryRun = false } = options;

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
  const changes: FileChange[] = [];

  for (const file of filesToCopy) {
    // Validate source path stays within templates directory (defense in depth)
    const sourceValidation = validateSafePath(file.source, templatesDir);
    if (!sourceValidation.isValid) {
      throw new FileSystemError(
        `Template path validation failed: ${sourceValidation.error}`,
        { templatePath: file.source }
      );
    }

    // Validate destination path stays within target directory (prevent path traversal)
    const destValidation = validateSafePath(file.destination, destDir);
    if (!destValidation.isValid) {
      throw new FileSystemError(
        `Destination path validation failed: ${destValidation.error}`,
        { destinationPath: file.destination }
      );
    }

    const destPath = destValidation.resolvedPath!;
    const exists = await fs.pathExists(destPath);

    if (dryRun) {
      // Dry-run mode: analyze impact without writing
      if (!exists) {
        changes.push({
          path: file.destination,
          status: 'CREATE',
        });
        copied++;
      } else if (overwrite) {
        // Check if content would actually change
        const existingContent = await fs.readFile(destPath, 'utf-8');
        const templateContent = await fs.readFile(file.source, 'utf-8');
        let processedContent = replacePlaceholders(templateContent, replacements);

        // Inject version for markdown files (same as processTemplate)
        if (destPath.endsWith('.md')) {
          const version = getPackageVersion();
          processedContent = injectVersionMetadata(processedContent, version);
        }

        if (existingContent !== processedContent) {
          changes.push({
            path: file.destination,
            status: 'UPDATE',
            reason: 'Content differs from template',
          });
          copied++;
        } else {
          changes.push({
            path: file.destination,
            status: 'SKIP',
            reason: 'Already up to date',
          });
          skipped++;
        }
      } else {
        changes.push({
          path: file.destination,
          status: 'CONFLICT',
          reason: 'File exists (use --force to overwrite)',
        });
        skipped++;
      }
    } else {
      // Normal mode: write files
      // Skip if file exists and overwrite is false
      if (!overwrite && exists) {
        skipped++;
        continue;
      }

      // Process template with placeholder replacement
      await processTemplate(file.source, destPath, replacements);
      copied++;
    }
  }

  // Print impact report in dry-run mode
  if (dryRun && changes.length > 0) {
    printImpactReport(changes);
  }

  return { copied, skipped, ...(dryRun && { changes }) };
}

/**
 * Print a formatted impact report showing planned changes
 */
function printImpactReport(changes: FileChange[]): void {
  console.log(chalk.bold('\n📋 IMPACT ANALYSIS:\n'));

  // Group changes by status
  const byStatus: Record<FileStatus, FileChange[]> = {
    CREATE: [],
    UPDATE: [],
    SKIP: [],
    CONFLICT: [],
  };

  changes.forEach((change) => {
    byStatus[change.status].push(change);
  });

  // Print each status group
  const statusConfig: Record<
    FileStatus,
    { icon: string; color: typeof chalk.green; label: string }
  > = {
    CREATE: { icon: '✨', color: chalk.green, label: 'CREATE' },
    UPDATE: { icon: '🔄', color: chalk.blue, label: 'UPDATE' },
    CONFLICT: { icon: '⚠️ ', color: chalk.yellow, label: 'CONFLICT' },
    SKIP: { icon: '⏭️ ', color: chalk.gray, label: 'SKIP' },
  };

  for (const status of ['CREATE', 'UPDATE', 'CONFLICT', 'SKIP'] as FileStatus[]) {
    const items = byStatus[status];
    if (items.length === 0) continue;

    const config = statusConfig[status];
    console.log(config.color.bold(`${config.icon} ${config.label} (${items.length}):`));

    items.forEach((item) => {
      const reasonText = item.reason ? chalk.gray(` - ${item.reason}`) : '';
      console.log(`  ${config.color(item.path)}${reasonText}`);
    });

    console.log();
  }

  // Summary and recommendations
  const conflicts = byStatus.CONFLICT.length;
  const updates = byStatus.UPDATE.length;

  if (conflicts > 0) {
    console.log(
      chalk.yellow.bold('⚠️  WARNING:'),
      chalk.yellow(
        `${conflicts} file(s) will be skipped due to conflicts. Use --force to overwrite.`
      )
    );
  }

  if (updates > 0) {
    console.log(
      chalk.blue.bold('ℹ️  INFO:'),
      chalk.blue(
        `${updates} file(s) will be updated with new template content. Review changes carefully.`
      )
    );
  }

  console.log(
    chalk.gray('\n💡 Tip: Run without --dry-run to apply these changes.')
  );
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
