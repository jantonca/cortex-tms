/**
 * Tests for Zod Input Validation
 *
 * Ensures all CLI command options are properly validated with clear error messages
 */

import { describe, it, expect } from 'vitest';
import {
  autoTierOptionsSchema,
  initOptionsSchema,
  validateOptionsSchema,
  reviewOptionsSchema,
  migrateOptionsSchema,
  promptOptionsSchema,
  statusOptionsSchema,
  validateOptions,
  validateSafePath,
} from '../utils/validation.js';
import { ValidationError } from '../utils/errors.js';

describe('Zod Input Validation', () => {
  describe('autoTierOptionsSchema', () => {
    it('should validate valid auto-tier options', () => {
      const result = autoTierOptionsSchema.parse({
        hot: '7',
        warm: '30',
        cold: '90',
        dryRun: true,
        force: false,
        verbose: true,
      });

      expect(result.hot).toBe(7);
      expect(result.warm).toBe(30);
      expect(result.cold).toBe(90);
      expect(result.dryRun).toBe(true);
      expect(result.force).toBe(false);
      expect(result.verbose).toBe(true);
    });

    it('should reject negative numbers for hot', () => {
      expect(() =>
        autoTierOptionsSchema.parse({
          hot: '-5',
          warm: '30',
          cold: '90',
        })
      ).toThrow();
    });

    it('should reject non-numeric hot value', () => {
      expect(() =>
        autoTierOptionsSchema.parse({
          hot: 'invalid',
          warm: '30',
          cold: '90',
        })
      ).toThrow();
    });

    it('should reject when hot > warm', () => {
      expect(() =>
        autoTierOptionsSchema.parse({
          hot: '40',
          warm: '30',
          cold: '90',
        })
      ).toThrow('--hot threshold must be ≤ --warm threshold');
    });

    it('should reject when warm > cold', () => {
      expect(() =>
        autoTierOptionsSchema.parse({
          hot: '7',
          warm: '100',
          cold: '90',
        })
      ).toThrow('--warm threshold must be ≤ --cold threshold');
    });

    it('should accept when hot = warm = cold', () => {
      const result = autoTierOptionsSchema.parse({
        hot: '30',
        warm: '30',
        cold: '30',
      });

      expect(result.hot).toBe(30);
      expect(result.warm).toBe(30);
      expect(result.cold).toBe(30);
    });
  });

  describe('initOptionsSchema', () => {
    it('should validate valid init options', () => {
      const result = initOptionsSchema.parse({
        force: true,
        minimal: false,
        verbose: true,
        scope: 'standard',
        dryRun: false,
      });

      expect(result.force).toBe(true);
      expect(result.minimal).toBe(false);
      expect(result.verbose).toBe(true);
      expect(result.scope).toBe('standard');
      expect(result.dryRun).toBe(false);
    });

    it('should accept valid scope values', () => {
      const scopes = ['nano', 'standard', 'enterprise', 'custom'];

      scopes.forEach((scope) => {
        const result = initOptionsSchema.parse({ scope });
        expect(result.scope).toBe(scope);
      });
    });

    it('should accept undefined scope', () => {
      const result = initOptionsSchema.parse({});
      expect(result.scope).toBeUndefined();
    });

    it('should accept all flags as optional', () => {
      const result = initOptionsSchema.parse({});
      expect(result.force).toBeUndefined();
      expect(result.minimal).toBeUndefined();
      expect(result.verbose).toBeUndefined();
      expect(result.dryRun).toBeUndefined();
    });
  });

  describe('validateOptionsSchema', () => {
    it('should validate valid validate options', () => {
      const result = validateOptionsSchema.parse({
        strict: true,
        verbose: false,
        fix: true,
      });

      expect(result.strict).toBe(true);
      expect(result.verbose).toBe(false);
      expect(result.fix).toBe(true);
    });

    it('should accept all flags as optional', () => {
      const result = validateOptionsSchema.parse({});
      expect(result.strict).toBeUndefined();
      expect(result.verbose).toBeUndefined();
      expect(result.fix).toBeUndefined();
    });
  });

  describe('reviewOptionsSchema', () => {
    it('should validate valid review options', () => {
      const result = reviewOptionsSchema.parse({
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-20241022',
        apiKey: 'sk-test-key',
        safe: true,
        outputJson: false,
      });

      expect(result.provider).toBe('anthropic');
      expect(result.model).toBe('claude-3-5-sonnet-20241022');
      expect(result.apiKey).toBe('sk-test-key');
      expect(result.safe).toBe(true);
      expect(result.outputJson).toBe(false);
    });

    it('should default to anthropic provider', () => {
      const result = reviewOptionsSchema.parse({});
      expect(result.provider).toBe('anthropic');
    });

    it('should accept openai provider', () => {
      const result = reviewOptionsSchema.parse({ provider: 'openai' });
      expect(result.provider).toBe('openai');
    });

    it('should reject invalid provider', () => {
      expect(() =>
        reviewOptionsSchema.parse({ provider: 'invalid' })
      ).toThrow();
    });
  });

  describe('migrateOptionsSchema', () => {
    it('should validate valid migrate options', () => {
      const result = migrateOptionsSchema.parse({
        apply: true,
        rollback: false,
        force: false,
        verbose: true,
        dryRun: false,
      });

      expect(result.apply).toBe(true);
      expect(result.rollback).toBe(false);
      expect(result.force).toBe(false);
      expect(result.verbose).toBe(true);
      expect(result.dryRun).toBe(false);
    });

    it('should reject force without apply', () => {
      expect(() =>
        migrateOptionsSchema.parse({
          force: true,
          apply: false,
        })
      ).toThrow('--force requires --apply');
    });

    it('should accept force with apply', () => {
      const result = migrateOptionsSchema.parse({
        force: true,
        apply: true,
      });

      expect(result.force).toBe(true);
      expect(result.apply).toBe(true);
    });
  });

  describe('promptOptionsSchema', () => {
    it('should validate valid prompt options', () => {
      const result = promptOptionsSchema.parse({
        list: true,
        copy: false,
      });

      expect(result.list).toBe(true);
      expect(result.copy).toBe(false);
    });

    it('should default copy to true', () => {
      const result = promptOptionsSchema.parse({});
      expect(result.copy).toBe(true);
    });
  });

  describe('statusOptionsSchema', () => {
    it('should validate valid status options', () => {
      const result = statusOptionsSchema.parse({
        tokens: true,
        model: 'claude-opus-4.5',
      });

      expect(result.tokens).toBe(true);
      expect(result.model).toBe('claude-opus-4.5');
    });

    it('should default to claude-sonnet-4.5', () => {
      const result = statusOptionsSchema.parse({});
      expect(result.model).toBe('claude-sonnet-4.5');
    });

    it('should accept valid model names', () => {
      const models = [
        'claude-sonnet-4.5',
        'claude-opus-4.5',
        'gpt-4-turbo',
        'gpt-4',
        'gpt-4o',
      ];

      models.forEach((model) => {
        const result = statusOptionsSchema.parse({ model });
        expect(result.model).toBe(model);
      });
    });

    it('should reject invalid model name', () => {
      expect(() =>
        statusOptionsSchema.parse({ model: 'invalid-model' })
      ).toThrow('Invalid model');
    });
  });

  describe('validateOptions helper', () => {
    it('should parse valid options', () => {
      const result = validateOptions(
        validateOptionsSchema,
        { strict: true },
        'test-command'
      );

      expect(result.strict).toBe(true);
    });

    it('should throw ValidationError on invalid options', () => {
      expect(() =>
        validateOptions(
          autoTierOptionsSchema,
          { hot: 'invalid', warm: '30', cold: '90' },
          'auto-tier'
        )
      ).toThrow(ValidationError);
    });

    it('should include command name in error message', () => {
      try {
        validateOptions(
          autoTierOptionsSchema,
          { hot: 'invalid', warm: '30', cold: '90' },
          'auto-tier'
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as Error).message).toContain('auto-tier');
      }
    });
  });

  describe('validateSafePath', () => {
    it('should accept safe paths', () => {
      const result = validateSafePath('src/commands/init.ts', '/home/user/project');
      expect(result.isValid).toBe(true);
      expect(result.resolvedPath).toContain('src/commands/init.ts');
    });

    it('should reject path traversal attempts', () => {
      const result = validateSafePath(
        '../../etc/passwd',
        '/home/user/project'
      );
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Path traversal detected');
    });

    it('should accept relative paths within project', () => {
      const result = validateSafePath(
        './src/commands/init.ts',
        '/home/user/project'
      );
      expect(result.isValid).toBe(true);
    });

    it('should reject absolute paths outside project', () => {
      const result = validateSafePath(
        '/etc/passwd',
        '/home/user/project'
      );
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Path traversal detected');
    });
  });
});
