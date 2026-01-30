/**
 * Centralized Error Handling for Cortex TMS CLI
 *
 * All CLI errors should extend CLIError and be thrown (not logged with process.exit).
 * The main CLI entry point (src/cli.ts) catches these errors and handles them appropriately.
 */

/**
 * Base class for all CLI errors
 * Includes exit code and optional error context
 */
export class CLIError extends Error {
  public readonly exitCode: number;
  public readonly context: Record<string, unknown> | undefined;

  constructor(message: string, exitCode: number = 1, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.exitCode = exitCode;
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation errors for invalid user input
 * Used when CLI arguments, options, or file contents are invalid
 */
export class ValidationError extends CLIError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 1, context);
  }
}

/**
 * Git-related errors (not a repo, git command failed, etc.)
 */
export class GitError extends CLIError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 1, context);
  }
}

/**
 * Configuration errors (.cortexrc, missing files, etc.)
 */
export class ConfigError extends CLIError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 1, context);
  }
}

/**
 * File system errors (file not found, permission denied, etc.)
 */
export class FileSystemError extends CLIError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 1, context);
  }
}

/**
 * Format an error for display to the user
 * Returns a formatted error message with optional context
 */
export function formatError(error: Error): string {
  if (error instanceof CLIError) {
    let message = error.message;

    // Add context if available
    if (error.context && Object.keys(error.context).length > 0) {
      const contextLines = Object.entries(error.context)
        .map(([key, value]) => `   ${key}=${value}`)
        .join('\n');
      message += '\n' + contextLines;
    }

    return message;
  }

  // Non-CLI errors (unexpected)
  return error.message;
}
