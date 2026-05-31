/**
 * Rule-Source Seam v1 Tests
 *
 * Test-first order per design doc §4:
 * 1. Config parsing (ruleSources schema, optional fields, ~ expansion) + .cortexrc.local overlay
 * 2. Source safety — declared + realpath .md/secret guard; allowlist exact-match; symlink-to-secret
 * 3. Lock generation + hash pin/compare
 * 4. Init --force protection + config-first anchor rendering
 * 5. MCP cortex://rules/* exposure + refusal of guarded paths
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join } from "path";
import { mkdir, writeFile, symlink, readFile, rm } from "fs/promises";
import { createTempDir, cleanupTempDir } from "./utils/temp-dir.js";
import {
  expandTilde,
  resolveRuleSourcePath,
  validateRuleSourcePath,
  isSecretPattern,
  computeSha256,
  pinRuleSources,
  checkDrift,
  getDeclaredRuleSourceEntries,
  generateInheritedRulesBlock,
  detectInheritedProtection,
} from "../utils/rule-sources.js";
import { loadConfig, mergeConfig } from "../utils/config.js";

// ============================================================================
// §4.1: Config parsing + .cortexrc.local overlay
// ============================================================================

describe("§4.1 Config parsing — ruleSources", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("loads config with ruleSources.global", async () => {
    await writeFile(
      join(tempDir, ".cortexrc"),
      JSON.stringify({
        version: "1.0.0",
        scope: "standard",
        ruleSources: {
          global: {
            type: "local-path",
            path: "~/rules/core-rules.md",
          },
        },
      }),
    );

    const config = await loadConfig(tempDir);
    expect(config).not.toBeNull();
    expect(config!.ruleSources?.global?.type).toBe("local-path");
    expect(config!.ruleSources?.global?.path).toBe("~/rules/core-rules.md");
  });

  it("loads config with ruleSources.operatingModes", async () => {
    await writeFile(
      join(tempDir, ".cortexrc"),
      JSON.stringify({
        version: "1.0.0",
        scope: "standard",
        ruleSources: {
          operatingModes: {
            type: "local-path",
            path: "~/rules/operating-modes.md",
          },
        },
      }),
    );

    const config = await loadConfig(tempDir);
    expect(config!.ruleSources?.operatingModes?.path).toBe(
      "~/rules/operating-modes.md",
    );
  });

  it("loads config with ruleSources.domains array", async () => {
    await writeFile(
      join(tempDir, ".cortexrc"),
      JSON.stringify({
        version: "1.0.0",
        scope: "standard",
        ruleSources: {
          domains: [
            { type: "local-path", path: "~/rules/frontend.md", name: "frontend" },
          ],
        },
      }),
    );

    const config = await loadConfig(tempDir);
    expect(config!.ruleSources?.domains).toHaveLength(1);
    expect(config!.ruleSources?.domains![0]!.name).toBe("frontend");
  });

  it("ruleSources is optional — config without it still loads", async () => {
    await writeFile(
      join(tempDir, ".cortexrc"),
      JSON.stringify({ version: "1.0.0", scope: "standard" }),
    );

    const config = await loadConfig(tempDir);
    expect(config).not.toBeNull();
    expect(config!.ruleSources).toBeUndefined();
  });

  it("staleness.ruleSources is parsed", async () => {
    await writeFile(
      join(tempDir, ".cortexrc"),
      JSON.stringify({
        version: "1.0.0",
        scope: "standard",
        staleness: {
          ruleSources: {
            global: { maxAgeDays: 90 },
            operatingModes: { maxAgeDays: 90 },
          },
        },
      }),
    );

    const config = await loadConfig(tempDir);
    expect(config!.staleness?.ruleSources?.global?.maxAgeDays).toBe(90);
  });
});

describe("§4.1 .cortexrc.local overlay deep-merge", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("merges .cortexrc.local over .cortexrc", async () => {
    await writeFile(
      join(tempDir, ".cortexrc"),
      JSON.stringify({
        version: "1.0.0",
        scope: "standard",
        paths: { docs: "docs/core" },
      }),
    );
    await writeFile(
      join(tempDir, ".cortexrc.local"),
      JSON.stringify({
        ruleSources: {
          global: { type: "local-path", path: "/home/user/rules/core.md" },
        },
      }),
    );

    const config = await loadConfig(tempDir);
    expect(config).not.toBeNull();
    expect(config!.scope).toBe("standard");
    expect(config!.paths?.docs).toBe("docs/core");
    expect(config!.ruleSources?.global?.path).toBe("/home/user/rules/core.md");
  });

  it("overlay overrides specific nested fields without wiping siblings", async () => {
    await writeFile(
      join(tempDir, ".cortexrc"),
      JSON.stringify({
        version: "1.0.0",
        scope: "standard",
        ruleSources: {
          global: { type: "local-path", path: "/portable/global.md" },
          operatingModes: { type: "local-path", path: "/portable/modes.md" },
        },
      }),
    );
    await writeFile(
      join(tempDir, ".cortexrc.local"),
      JSON.stringify({
        ruleSources: {
          global: { type: "local-path", path: "/local/global.md" },
        },
      }),
    );

    const config = await loadConfig(tempDir);
    expect(config!.ruleSources?.global?.path).toBe("/local/global.md");
    expect(config!.ruleSources?.operatingModes?.path).toBe("/portable/modes.md");
  });

  it("works when .cortexrc.local does not exist", async () => {
    await writeFile(
      join(tempDir, ".cortexrc"),
      JSON.stringify({ version: "1.0.0", scope: "nano" }),
    );

    const config = await loadConfig(tempDir);
    expect(config).not.toBeNull();
    expect(config!.scope).toBe("nano");
  });

  it("overlay domains array replaces (not concatenates) base domains", async () => {
    await writeFile(
      join(tempDir, ".cortexrc"),
      JSON.stringify({
        version: "1.0.0",
        scope: "standard",
        ruleSources: {
          domains: [
            { type: "local-path", path: "/base/frontend.md", name: "frontend" },
          ],
        },
      }),
    );
    await writeFile(
      join(tempDir, ".cortexrc.local"),
      JSON.stringify({
        ruleSources: {
          domains: [
            { type: "local-path", path: "/local/frontend.md", name: "frontend" },
            { type: "local-path", path: "/local/backend.md", name: "backend" },
          ],
        },
      }),
    );

    const config = await loadConfig(tempDir);
    expect(config!.ruleSources?.domains).toHaveLength(2);
    expect(config!.ruleSources?.domains![0]!.path).toBe("/local/frontend.md");
  });
});

// ============================================================================
// §4.1 ~ expansion
// ============================================================================

describe("expandTilde", () => {
  it("expands ~/ to HOME", () => {
    const result = expandTilde("~/foo/bar.md");
    expect(result).not.toContain("~");
    expect(result).toContain("foo/bar.md");
  });

  it("leaves non-tilde paths unchanged", () => {
    expect(expandTilde("/absolute/path.md")).toBe("/absolute/path.md");
    expect(expandTilde("relative/path.md")).toBe("relative/path.md");
  });

  it("expands ~ at start only", () => {
    const result = expandTilde("~/dir/~/other.md");
    expect(result.startsWith(process.env.HOME || "")).toBe(true);
    expect(result).toContain("~/other.md");
  });
});

// ============================================================================
// §4.2: Source safety
// ============================================================================

describe("§4.2 Source safety — isSecretPattern", () => {
  it("rejects .env files", () => {
    expect(isSecretPattern(".env")).toBe(true);
    expect(isSecretPattern(".env.local")).toBe(true);
    expect(isSecretPattern(".env.production")).toBe(true);
  });

  it("rejects SSH key patterns", () => {
    expect(isSecretPattern("id_rsa")).toBe(true);
    expect(isSecretPattern("id_ed25519")).toBe(true);
    expect(isSecretPattern("id_ecdsa")).toBe(true);
  });

  it("rejects .pem and .key files", () => {
    expect(isSecretPattern("cert.pem")).toBe(true);
    expect(isSecretPattern("private.key")).toBe(true);
  });

  it("rejects paths under .ssh/", () => {
    expect(isSecretPattern(".ssh/id_rsa")).toBe(true);
    expect(isSecretPattern("/home/user/.ssh/config")).toBe(true);
  });

  it("rejects dotfiles", () => {
    expect(isSecretPattern(".bashrc")).toBe(true);
    expect(isSecretPattern(".gitconfig")).toBe(true);
  });

  it("accepts normal markdown files", () => {
    expect(isSecretPattern("core-rules.md")).toBe(false);
    expect(isSecretPattern("templates/operating-modes.md")).toBe(false);
    expect(isSecretPattern("domains/frontend.md")).toBe(false);
  });
});

describe("§4.2 validateRuleSourcePath", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("accepts a declared .md path that exists", async () => {
    const filePath = join(tempDir, "rules.md");
    await writeFile(filePath, "# Rules");

    const declaredSources = { global: filePath };
    const result = await validateRuleSourcePath(filePath, declaredSources);
    expect(result.isValid).toBe(true);
  });

  it("rejects path not in declared sources", async () => {
    const filePath = join(tempDir, "rules.md");
    await writeFile(filePath, "# Rules");

    const declaredSources = { global: join(tempDir, "other.md") };
    const result = await validateRuleSourcePath(filePath, declaredSources);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("not declared");
  });

  it("rejects non-.md files", async () => {
    const filePath = join(tempDir, "rules.txt");
    await writeFile(filePath, "not markdown");

    const declaredSources = { global: filePath };
    const result = await validateRuleSourcePath(filePath, declaredSources);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain(".md");
  });

  it("rejects symlink to secret (symlink-to-secret attack)", async () => {
    const secretPath = join(tempDir, ".env");
    await writeFile(secretPath, "SECRET=value");

    const linkPath = join(tempDir, "rules.md");
    await symlink(secretPath, linkPath);

    const declaredSources = { global: linkPath };
    const result = await validateRuleSourcePath(linkPath, declaredSources);
    expect(result.isValid).toBe(false);
  });

  it("rejects declared path that is a dotfile", async () => {
    const filePath = join(tempDir, ".hidden.md");
    await writeFile(filePath, "# Hidden");

    const declaredSources = { global: filePath };
    const result = await validateRuleSourcePath(filePath, declaredSources);
    expect(result.isValid).toBe(false);
  });

  it("rejects when realpath resolves to a secret pattern", async () => {
    const sshDir = join(tempDir, ".ssh");
    await mkdir(sshDir, { recursive: true });
    const secretFile = join(sshDir, "id_rsa");
    await writeFile(secretFile, "ssh-key-content");

    const linkPath = join(tempDir, "innocent.md");
    await symlink(secretFile, linkPath);

    const declaredSources = { global: linkPath };
    const result = await validateRuleSourcePath(linkPath, declaredSources);
    expect(result.isValid).toBe(false);
  });
});

describe("§4.2 resolveRuleSourcePath", () => {
  it("expands ~ and resolves to absolute path", () => {
    const result = resolveRuleSourcePath("~/foo/bar.md");
    expect(result).not.toContain("~");
    expect(result).toMatch(/^\//);
  });

  it("resolves relative paths against cwd", () => {
    const result = resolveRuleSourcePath("relative/path.md");
    expect(result).toMatch(/^\//);
    expect(result).toContain("relative/path.md");
  });
});

// ============================================================================
// §4.3: Lock generation + hash comparison
// ============================================================================

describe("§4.3 Lock generation + hash comparison", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it("computeSha256 produces consistent hash for same content", async () => {
    const filePath = join(tempDir, "test.md");
    await writeFile(filePath, "# Hello");

    const hash1 = await computeSha256(filePath);
    const hash2 = await computeSha256(filePath);
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/);
  });

  it("computeSha256 produces different hash for different content", async () => {
    const file1 = join(tempDir, "a.md");
    const file2 = join(tempDir, "b.md");
    await writeFile(file1, "# Version 1");
    await writeFile(file2, "# Version 2");

    const hash1 = await computeSha256(file1);
    const hash2 = await computeSha256(file2);
    expect(hash1).not.toBe(hash2);
  });

  it("pinRuleSources creates lock entries for all configured sources", async () => {
    const globalFile = join(tempDir, "global.md");
    const modesFile = join(tempDir, "modes.md");
    await writeFile(globalFile, "# Global rules");
    await writeFile(modesFile, "# Operating modes");

    const ruleSources = {
      global: { type: "local-path" as const, path: globalFile },
      operatingModes: { type: "local-path" as const, path: modesFile },
    };

    const { lock, warnings } = await pinRuleSources(ruleSources);
    expect(lock.global).toBeDefined();
    expect(lock.global!.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(lock.global!.pinnedAt).toBeTruthy();
    expect(lock.operatingModes).toBeDefined();
    expect(warnings).toHaveLength(0);
  });

  it("pinRuleSources returns warnings for sources that fail safety guard", async () => {
    const secretPath = join(tempDir, ".env");
    await writeFile(secretPath, "SECRET=value");

    const linkPath = join(tempDir, "rules.md");
    await symlink(secretPath, linkPath);

    const ruleSources = {
      global: { type: "local-path" as const, path: linkPath },
    };

    const { lock, warnings } = await pinRuleSources(ruleSources);
    expect(lock.global).toBeUndefined();
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("safety guard");
  });

  it("checkDrift returns clean when content unchanged", async () => {
    const filePath = join(tempDir, "rules.md");
    await writeFile(filePath, "# Rules v1");

    const hash = await computeSha256(filePath);
    const lock = {
      global: { sha256: hash, pinnedAt: new Date().toISOString() },
    };

    const result = await checkDrift("global", filePath, lock);
    expect(result.drifted).toBe(false);
  });

  it("checkDrift returns drifted when content changed", async () => {
    const filePath = join(tempDir, "rules.md");
    await writeFile(filePath, "# Rules v1");

    const hash = await computeSha256(filePath);
    const lock = {
      global: { sha256: hash, pinnedAt: new Date().toISOString() },
    };

    await writeFile(filePath, "# Rules v2 — changed!");

    const result = await checkDrift("global", filePath, lock);
    expect(result.drifted).toBe(true);
  });

  it("checkDrift returns missing when file does not exist", async () => {
    const lock = {
      global: { sha256: "abc123", pinnedAt: new Date().toISOString() },
    };

    const result = await checkDrift("global", join(tempDir, "nonexistent.md"), lock);
    expect(result.missing).toBe(true);
  });

  it("checkDrift returns noLock when lock entry missing", async () => {
    const filePath = join(tempDir, "rules.md");
    await writeFile(filePath, "# Rules");

    const result = await checkDrift("global", filePath, {});
    expect(result.noLock).toBe(true);
  });
});

// ============================================================================
// §4.4: getDeclaredRuleSourceEntries helper
// ============================================================================

describe("getDeclaredRuleSourceEntries", () => {
  it("returns flat map of name → resolved path", () => {
    const ruleSources = {
      global: { type: "local-path" as const, path: "/home/user/global.md" },
      operatingModes: { type: "local-path" as const, path: "/home/user/modes.md" },
      domains: [
        { type: "local-path" as const, path: "/home/user/frontend.md", name: "frontend" },
      ],
    };

    const entries = getDeclaredRuleSourceEntries(ruleSources);
    expect(entries.global).toBeDefined();
    expect(entries.operatingModes).toBeDefined();
    expect(entries["domain:frontend"]).toBeDefined();
  });

  it("skips domains without name", () => {
    const ruleSources = {
      domains: [
        { type: "local-path" as const, path: "/home/user/noname.md" },
      ],
    };

    const entries = getDeclaredRuleSourceEntries(ruleSources);
    expect(Object.keys(entries)).toHaveLength(0);
  });

  it("returns empty object when no ruleSources", () => {
    const entries = getDeclaredRuleSourceEntries(undefined);
    expect(Object.keys(entries)).toHaveLength(0);
  });
});

// ============================================================================
// generateInheritedRulesBlock — cortex:// URI generation
// ============================================================================

describe("generateInheritedRulesBlock", () => {
  it("emits cortex:// URIs instead of raw paths", () => {
    const ruleSources = {
      global: { type: "local-path" as const, path: "/home/user/rules/core.md" },
      operatingModes: { type: "local-path" as const, path: "/home/user/rules/modes.md" },
      domains: [
        { type: "local-path" as const, path: "/home/user/rules/frontend.md", name: "frontend" },
      ],
    };

    const block = generateInheritedRulesBlock(ruleSources);

    expect(block).toContain("cortex://rules/global");
    expect(block).toContain("cortex://rules/operatingModes");
    expect(block).toContain("cortex://rules/domain:frontend");
    expect(block).not.toContain("/home/user/rules/core.md");
    expect(block).not.toContain("/home/user/rules/modes.md");
    expect(block).not.toContain("/home/user/rules/frontend.md");
  });

  it("includes MCP note line", () => {
    const ruleSources = {
      global: { type: "local-path" as const, path: "/rules/core.md" },
    };

    const block = generateInheritedRulesBlock(ruleSources);
    expect(block).toContain("cortex://rules/*");
    expect(block).toContain(".cortexrc.local");
  });

  it("uses lowercase heading", () => {
    const ruleSources = {
      global: { type: "local-path" as const, path: "/rules/core.md" },
    };

    const block = generateInheritedRulesBlock(ruleSources);
    expect(block).toContain("## Inherited rules");
  });
});

// ============================================================================
// detectInheritedProtection
// ============================================================================

describe("detectInheritedProtection", () => {
  it("returns 'hard' when cortex:ruleSource marker present", () => {
    const content = `# AGENTS.md

## Inherited rules

<!-- cortex:ruleSource global -->
- Global: \`cortex://rules/global\`
<!-- /cortex:ruleSource -->
`;
    expect(detectInheritedProtection(content)).toBe("hard");
  });

  it("returns 'soft' when heading + path bullet present (no marker)", () => {
    const content = `# AGENTS.md

## Inherited rules

- Global: \`/path/to/rules.md\`
`;
    expect(detectInheritedProtection(content)).toBe("soft");
  });

  it("returns 'none' when no heading or marker", () => {
    const content = `# AGENTS.md

## Some other section
`;
    expect(detectInheritedProtection(content)).toBe("none");
  });

  it("is case-insensitive for heading", () => {
    const content = `# AGENTS.md

## INHERITED RULES

- Global: \`/path/to/rules.md\`
`;
    expect(detectInheritedProtection(content)).toBe("soft");
  });
});
