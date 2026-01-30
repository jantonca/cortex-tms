/**
 * Error Handling Tests
 *
 * Tests the centralized error handling system.
 */

import { describe, it, expect } from 'vitest';
import {
  CLIError,
  ValidationError,
  GitError,
  ConfigError,
  FileSystemError,
  formatError,
} from '../utils/errors.js';

describe('CLIError', () => {
  it('should create error with message and default exit code', () => {
    const error = new CLIError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.exitCode).toBe(1);
    expect(error.name).toBe('CLIError');
  });

  it('should create error with custom exit code', () => {
    const error = new CLIError('Test error', 2);
    expect(error.exitCode).toBe(2);
  });

  it('should create error with context', () => {
    const error = new CLIError('Test error', 1, { foo: 'bar', count: 42 });
    expect(error.context).toEqual({ foo: 'bar', count: 42 });
  });

  it('should be instance of Error', () => {
    const error = new CLIError('Test error');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CLIError);
  });
});

describe('ValidationError', () => {
  it('should create validation error', () => {
    const error = new ValidationError('Invalid input');
    expect(error.message).toBe('Invalid input');
    expect(error.exitCode).toBe(1);
    expect(error.name).toBe('ValidationError');
    expect(error).toBeInstanceOf(CLIError);
  });

  it('should create validation error with context', () => {
    const error = new ValidationError('Invalid threshold', {
      hot: 10,
      warm: 5,
    });
    expect(error.context).toEqual({ hot: 10, warm: 5 });
  });
});

describe('GitError', () => {
  it('should create git error', () => {
    const error = new GitError('Not a git repository');
    expect(error.message).toBe('Not a git repository');
    expect(error.exitCode).toBe(1);
    expect(error.name).toBe('GitError');
    expect(error).toBeInstanceOf(CLIError);
  });
});

describe('ConfigError', () => {
  it('should create config error', () => {
    const error = new ConfigError('Invalid configuration');
    expect(error.message).toBe('Invalid configuration');
    expect(error.exitCode).toBe(1);
    expect(error.name).toBe('ConfigError');
    expect(error).toBeInstanceOf(CLIError);
  });
});

describe('FileSystemError', () => {
  it('should create filesystem error', () => {
    const error = new FileSystemError('File not found');
    expect(error.message).toBe('File not found');
    expect(error.exitCode).toBe(1);
    expect(error.name).toBe('FileSystemError');
    expect(error).toBeInstanceOf(CLIError);
  });
});

describe('formatError', () => {
  it('should format CLIError without context', () => {
    const error = new CLIError('Test error');
    const formatted = formatError(error);
    expect(formatted).toBe('Test error');
  });

  it('should format CLIError with context', () => {
    const error = new CLIError('Invalid threshold', 1, {
      hot: 10,
      warm: 5,
    });
    const formatted = formatError(error);
    expect(formatted).toContain('Invalid threshold');
    expect(formatted).toContain('hot=10');
    expect(formatted).toContain('warm=5');
  });

  it('should format ValidationError with context', () => {
    const error = new ValidationError('--hot must be ≤ --warm', {
      hot: 10,
      warm: 5,
    });
    const formatted = formatError(error);
    expect(formatted).toContain('--hot must be ≤ --warm');
    expect(formatted).toContain('hot=10');
    expect(formatted).toContain('warm=5');
  });

  it('should format non-CLIError', () => {
    const error = new Error('Standard error');
    const formatted = formatError(error);
    expect(formatted).toBe('Standard error');
  });

  it('should handle empty context', () => {
    const error = new CLIError('Test error', 1, {});
    const formatted = formatError(error);
    expect(formatted).toBe('Test error');
  });

  it('should format object context values with JSON.stringify', () => {
    const error = new ValidationError('Complex validation error', {
      thresholds: { hot: 7, warm: 30, cold: 90 },
      files: ['file1.md', 'file2.md'],
    });
    const formatted = formatError(error);
    expect(formatted).toContain('Complex validation error');
    expect(formatted).toContain('thresholds={"hot":7,"warm":30,"cold":90}');
    expect(formatted).toContain('files=["file1.md","file2.md"]');
  });

  it('should handle mixed primitive and object context values', () => {
    const error = new ValidationError('Mixed context error', {
      count: 42,
      enabled: true,
      config: { debug: true, level: 'info' },
    });
    const formatted = formatError(error);
    expect(formatted).toContain('count=42');
    expect(formatted).toContain('enabled=true');
    expect(formatted).toContain('config={"debug":true,"level":"info"}');
  });
});
