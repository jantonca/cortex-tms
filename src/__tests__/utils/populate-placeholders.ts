/**
 * Test Utilities - Placeholder Population
 *
 * Removes placeholder text from initialized projects to create "complete"
 * test fixtures that pass validation.
 */

import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';

/**
 * Replace ALL bracketed placeholders in a file with generic test content
 */
async function replacePlaceholdersInFile(
  filePath: string,
  specificReplacements: Record<string, string> = {}
): Promise<void> {
  try {
    let content = await readFile(filePath, 'utf-8');

    // First, apply specific replacements
    for (const [placeholder, value] of Object.entries(specificReplacements)) {
      const pattern = `\\[${placeholder}\\]`;
      content = content.replace(new RegExp(pattern, 'g'), value);
    }

    // Then replace any remaining bracketed placeholders with generic text
    // But skip things that look like references like [#123] or [PROJ-123]
    content = content.replace(/\[([^\]#]+)\]/g, (match, capture) => {
      // Skip if it looks like a reference (contains # or all caps followed by dash-number)
      if (capture.includes('#') || /^[A-Z]+-\d+$/.test(capture)) {
        return match; // Keep as-is
      }
      // Replace with generic text
      return 'Test Content';
    });

    await writeFile(filePath, content, 'utf-8');
  } catch (error) {
    // File doesn't exist - skip silently
  }
}

/**
 * Populate all placeholder text in a test project directory
 *
 * @param projectDir - Path to the project directory
 * @param options - Custom replacement values
 */
export async function populatePlaceholders(
  projectDir: string,
  options: {
    projectName?: string;
    projectContext?: string;
    featureName?: string;
    description?: string;
  } = {}
): Promise<void> {
  // Specific replacements (optional, for targeted substitutions)
  const specificReplacements = {
    'Project Name': options.projectName || 'Test Project',
    'Project Context': options.projectContext || 'Test Context',
  };

  // Files that commonly contain placeholders
  const filesToPopulate = [
    'README.md',
    'NEXT-TASKS.md',
    'FUTURE-ENHANCEMENTS.md',
    'CLAUDE.md',
    'docs/core/ARCHITECTURE.md',
    'docs/core/PATTERNS.md',
    'docs/core/DOMAIN-LOGIC.md',
    'docs/core/GLOSSARY.md',
    '.github/copilot-instructions.md',
  ];

  // Replace placeholders in each file
  await Promise.all(
    filesToPopulate.map((file) =>
      replacePlaceholdersInFile(join(projectDir, file), specificReplacements)
    )
  );
}

/**
 * Remove the "First Session Setup" section from CLAUDE.md
 * (This section contains instructions for first-time users)
 */
export async function removeFirstSessionSetup(projectDir: string): Promise<void> {
  const claudeMdPath = join(projectDir, 'CLAUDE.md');

  try {
    let content = await readFile(claudeMdPath, 'utf-8');

    // Remove the First Session Setup section
    content = content.replace(
      /## 🚀 First Session Setup[\s\S]*?<!-- @cortex-tms-version/,
      '<!-- @cortex-tms-version'
    );

    await writeFile(claudeMdPath, content, 'utf-8');
  } catch (error) {
    // File doesn't exist - skip silently
  }
}

/**
 * Create a "complete" test project (initialized + populated)
 *
 * This is useful for tests that expect validation to pass.
 */
export async function createCompleteTestProject(
  projectDir: string,
  options?: {
    projectName?: string;
    scope?: string;
  }
): Promise<void> {
  // Project is already initialized by the caller
  // Just populate the placeholders
  await populatePlaceholders(projectDir, {
    projectName: options?.projectName || 'Test Project',
  });

  // Remove instructional sections
  await removeFirstSessionSetup(projectDir);
}
