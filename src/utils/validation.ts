/**
 * Zod Input Validation for Cortex TMS CLI
 *
 * Provides type-safe validation for all CLI command options.
 * Integrates with ValidationError for consistent error handling.
 */

import { z } from 'zod';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { ValidationError } from './errors.js';

// ============================================================================
// Common Schemas
// ============================================================================

/**
 * Schema for boolean flags (handles Commander's boolean coercion)
 */
const booleanFlag = z.boolean().optional();

/**
 * Schema for verbose flag (common across many commands)
 */
const verboseFlag = booleanFlag;

/**
 * Schema for dry-run flag (common across init, auto-tier, migrate)
 */
const dryRunFlag = booleanFlag;

/**
 * Schema for force flag (common across init, auto-tier, migrate)
 */
const forceFlag = booleanFlag;

// ============================================================================
// Command-Specific Schemas
// ============================================================================

/**
 * Schema for auto-tier command options
 * Validates numeric thresholds and ensures hot <= warm <= cold
 */
export const autoTierOptionsSchema = z
  .object({
    hot: z.string().transform((val, ctx) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '--hot must be a positive number',
        });
        return z.NEVER;
      }
      return num;
    }),
    warm: z.string().transform((val, ctx) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '--warm must be a positive number',
        });
        return z.NEVER;
      }
      return num;
    }),
    cold: z.string().transform((val, ctx) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '--cold must be a positive number',
        });
        return z.NEVER;
      }
      return num;
    }),
    dryRun: dryRunFlag,
    force: forceFlag,
    verbose: verboseFlag,
  })
  .refine((data) => data.hot <= data.warm, {
    message: '--hot threshold must be ≤ --warm threshold',
    path: ['hot'],
  })
  .refine((data) => data.warm <= data.cold, {
    message: '--warm threshold must be ≤ --cold threshold',
    path: ['warm'],
  });

/**
 * Schema for init command options
 */
export const initOptionsSchema = z.object({
  force: forceFlag,
  minimal: booleanFlag,
  verbose: verboseFlag,
  scope: z
    .enum(['nano', 'standard', 'enterprise', 'custom'])
    .optional()
    .refine(
      (val) => {
        if (val && !['nano', 'standard', 'enterprise', 'custom'].includes(val)) {
          return false;
        }
        return true;
      },
      {
        message: 'Invalid scope. Must be one of: nano, standard, enterprise, custom',
      }
    ),
  dryRun: dryRunFlag,
});

/**
 * Schema for validate command options
 */
export const validateOptionsSchema = z.object({
  strict: booleanFlag,
  verbose: verboseFlag,
  fix: booleanFlag,
});

/**
 * Schema for review command options
 */
export const reviewOptionsSchema = z.object({
  provider: z
    .enum(['openai', 'anthropic'])
    .default('anthropic')
    .refine(
      (val) => ['openai', 'anthropic'].includes(val),
      {
        message: 'Invalid provider. Must be: openai or anthropic',
      }
    ),
  model: z.string().optional(),
  apiKey: z.string().optional(),
  safe: booleanFlag,
  outputJson: booleanFlag,
});

/**
 * Schema for migrate command options
 */
export const migrateOptionsSchema = z
  .object({
    apply: booleanFlag,
    rollback: booleanFlag,
    force: forceFlag,
    verbose: verboseFlag,
    dryRun: dryRunFlag,
  })
  .refine(
    (data) => {
      // Force requires apply
      if (data.force && !data.apply) {
        return false;
      }
      return true;
    },
    {
      message: '--force requires --apply',
      path: ['force'],
    }
  );

/**
 * Schema for prompt command options
 */
export const promptOptionsSchema = z.object({
  list: booleanFlag,
  copy: z.boolean().default(true),
});

/**
 * Schema for status command options
 */
export const statusOptionsSchema = z.object({
  tokens: booleanFlag,
  model: z
    .string()
    .default('claude-sonnet-4.5')
    .refine(
      (val) =>
        [
          'claude-sonnet-4.5',
          'claude-opus-4.5',
          'gpt-4-turbo',
          'gpt-4',
          'gpt-4o',
        ].includes(val),
      {
        message:
          'Invalid model. Must be one of: claude-sonnet-4.5, claude-opus-4.5, gpt-4-turbo, gpt-4, gpt-4o',
      }
    ),
});

// ============================================================================
// Validation Helper
// ============================================================================

/**
 * Type-safe validation helper
 * Parses and validates options using Zod schema
 * Throws ValidationError with clear messages on failure
 */
export function validateOptions<T extends z.ZodType>(
  schema: T,
  options: unknown,
  commandName: string
): z.infer<T> {
  try {
    return schema.parse(options);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format Zod errors into a clear message
      const issues = error.issues || [];
      const messages = issues.map((err) => {
        const path = err.path && err.path.length > 0 ? `--${err.path.join('.')}` : 'options';
        return `${path}: ${err.message}`;
      });

      throw new ValidationError(
        `Invalid ${commandName} command options${messages.length > 0 ? ':\n  ' + messages.join('\n  ') : ''}`,
        {
          command: commandName,
          errors: messages,
        }
      );
    }

    // Re-throw unexpected errors
    throw error;
  }
}

// ============================================================================
// Path Validation Utilities
// ============================================================================

/**
 * Validates that a file path doesn't traverse outside the project directory
 * Prevents path traversal attacks (e.g., ../../etc/passwd)
 */
export function validateSafePath(
  filePath: string,
  baseDir: string
): { isValid: boolean; resolvedPath?: string; error?: string } {
  // Resolve to absolute path
  const resolvedPath = resolve(baseDir, filePath);

  // Check if resolved path is within base directory
  if (!resolvedPath.startsWith(baseDir)) {
    return {
      isValid: false,
      error: `Path traversal detected: ${filePath} resolves outside project directory`,
    };
  }

  return {
    isValid: true,
    resolvedPath,
  };
}

/**
 * Validates a file path argument
 * Ensures file exists and is within project bounds
 */
export function validateFilePath(
  filePath: string,
  baseDir: string
): string {
  // Check for path traversal
  const pathValidation = validateSafePath(filePath, baseDir);

  if (!pathValidation.isValid) {
    throw new ValidationError(pathValidation.error || 'Invalid file path');
  }

  // Check if file exists
  if (!existsSync(pathValidation.resolvedPath!)) {
    throw new ValidationError(`File not found: ${filePath}`);
  }

  return pathValidation.resolvedPath!;
}
