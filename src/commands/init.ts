/**
 * Cortex TMS CLI - Init Command
 *
 * Initializes Cortex TMS documentation structure in the current directory
 */

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { basename, join } from "path";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { detectContext, isSafeToInitialize } from "../utils/detection.js";
import { detectPackageManager } from "../utils/package-manager.js";
import {
  runInitPrompts,
  showInitSummary,
  confirmInit,
} from "../utils/prompts.js";
import {
  getTemplatesDir,
  copyTemplates,
  generateReplacements,
} from "../utils/templates.js";
import { createConfigFromScope, saveConfig, loadConfig } from "../utils/config.js";
import { initOptionsSchema, validateOptions, validateSafePath } from "../utils/validation.js";
import {
  detectInheritedProtection,
  applyInheritedRules,
} from "../utils/rule-sources.js";
import type { InitCommandOptions } from "../types/cli.js";

/**
 * Create and configure the init command
 */
export function createInitCommand(): Command {
  const initCommand = new Command("init");

  initCommand
    .description("Initialize Cortex TMS in your project")
    .option(
      "-f, --force",
      "Skip confirmation prompts and overwrite existing files",
    )
    .option("-m, --minimal", "Install minimal template set only")
    .option("-v, --verbose", "Show detailed output")
    .option(
      "-s, --scope <scope>",
      "Specify scope for non-interactive mode (nano|standard|enterprise|custom)",
    )
    .option("-d, --dry-run", "Preview changes without writing to disk")
    .option(
      "-p, --preset <preset>",
      "Governance pack preset for ecosystem-specific content (node|python|go)",
    )
    .option(
      "--with-skills",
      "Install cortex-validate and cortex-review Claude Code skills into .claude/skills/",
    )
    .option(
      "--overwrite-inherited",
      "Override inherited-rules protection in AGENTS.md (requires --force)",
    )
    .action(async (options: InitCommandOptions) => {
      await runInit(options);
    });

  return initCommand;
}

/**
 * Main init command logic
 */
async function runInit(options: InitCommandOptions): Promise<void> {
  const cwd = process.cwd();

  // Validate options using Zod schema
  const validated = validateOptions(initOptionsSchema, options, "init");

  console.log(chalk.bold.cyan("\n🧠 Cortex TMS Initialization\n"));

  // Dry-run mode indicator
  if (validated.dryRun) {
    console.log(chalk.yellow("🔍 DRY RUN MODE: No files will be modified.\n"));
  }

  // Step 1: Detect project context
  const spinner = ora("Detecting project context...").start();
  const context = detectContext(cwd);
  spinner.succeed("Project context detected");

  // Show context info if verbose
  if (validated.verbose) {
    console.log(chalk.gray("\nProject Context:"));
    console.log(
      chalk.gray(`  Git repository: ${context.isGitRepo ? "Yes" : "No"}`),
    );
    console.log(
      chalk.gray(`  Package.json: ${context.hasPackageJson ? "Yes" : "No"}`),
    );
    console.log(
      chalk.gray(
        `  Package manager: ${context.packageManager !== "unknown" ? context.packageManager : "Unknown"}`,
      ),
    );
    console.log(
      chalk.gray(
        `  Existing TMS files: ${context.existingFiles.length > 0 ? context.existingFiles.join(", ") : "None"}`,
      ),
    );
    console.log();
  }

  // Step 2: Safety check
  if (!isSafeToInitialize(context) && !validated.force) {
    console.log(
      chalk.yellow(
        `\n⚠️  Warning: ${context.existingFiles.length} TMS file(s) already exist:`,
      ),
    );
    context.existingFiles.forEach((file) => {
      console.log(chalk.yellow(`  - ${file}`));
    });
    console.log(
      chalk.gray(
        "\nUse --force to overwrite, or remove existing files first.\n",
      ),
    );
  }

  // Step 3: Interactive prompts (or use defaults if --force or --scope)
  let answers;

  const shouldSkipPrompts = validated.force || validated.scope;

  if (shouldSkipPrompts) {
    // Use default values when --force or --scope is enabled
    const defaultName = basename(cwd)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Determine scope: explicit flag > minimal flag > default to standard
    let scope: "nano" | "standard" | "enterprise" | "custom";
    if (validated.scope) {
      scope = validated.scope;
    } else if (validated.minimal) {
      scope = "nano";
    } else {
      scope = "standard";
    }

    // Auto-install snippets for Standard and Enterprise scopes in non-interactive mode
    const installSnippets = scope === "standard" || scope === "enterprise";

    answers = {
      projectName: defaultName,
      scope,
      overwrite: validated.force ?? false,
      installSnippets,
    };

    if (validated.verbose) {
      console.log(chalk.gray("\nUsing non-interactive mode:"));
      console.log(chalk.gray(`  Project Name: ${answers.projectName}`));
      console.log(chalk.gray(`  Scope: ${answers.scope}`));
      console.log(chalk.gray(`  Overwrite: ${answers.overwrite}`));
      console.log(chalk.gray(`  Install Snippets: ${answers.installSnippets}`));
      console.log();
    }
  } else {
    // Check for TTY before running interactive prompts
    if (!process.stdin.isTTY) {
      console.error(
        chalk.red("\n❌ Error:"),
        "Interactive prompts require a TTY.",
      );
      console.log(
        chalk.gray(
          "Use --scope <scope> and --force flags for non-interactive environments (CI/CD).",
        ),
      );
      console.log(
        chalk.gray("Example: cortex-tms init --scope standard --force\n"),
      );
      throw new Error("TMS files already exist");
    }

    answers = await runInitPrompts(context, cwd);
  }

  // Step 4: Show summary and confirm (skip in dry-run or force mode)
  if (!validated.force && !validated.dryRun) {
    showInitSummary(answers, context);

    const confirmed = await confirmInit();
    if (!confirmed) {
      console.log(chalk.gray("\nInitialization cancelled.\n"));
      return;
    }
  }

  // Step 5: Generate replacements
  const detectedPm =
    validated.preset === "node" ? detectPackageManager(cwd) : null;
  if (validated.verbose && validated.preset === "node") {
    console.log(
      chalk.gray(
        `\nPackage manager: ${detectedPm ?? "<package-manager> (not detected — fill in manually)"}`,
      ),
    );
  }
  const replacements = generateReplacements(
    answers.projectName,
    answers.description,
    detectedPm,
  );

  if (validated.verbose) {
    console.log(chalk.gray("\nPlaceholder Replacements:"));
    Object.entries(replacements).forEach(([key, value]) => {
      console.log(chalk.gray(`  [${key}] → ${value}`));
    });
    console.log();
  }

  // Step 5b: Check AGENTS.md inherited-rules protection
  const agentsPath = join(cwd, "AGENTS.md");
  let skipAgentsMd = false;
  if (existsSync(agentsPath) && (validated.force || answers.overwrite)) {
    const agentsContent = await readFile(agentsPath, "utf-8");
    const protection = detectInheritedProtection(agentsContent);

    if (protection === "hard" || protection === "soft") {
      if (!validated.overwriteInherited) {
        skipAgentsMd = true;
        if (protection === "soft") {
          console.log(
            chalk.yellow(
              "\n⚠️  AGENTS.md contains inherited rules references — skipping.",
            ),
          );
          console.log(
            chalk.gray(
              "  Use --force --overwrite-inherited to override this protection.",
            ),
          );
        }
      }
    }
  }

  // Step 6: Copy templates (or analyze in dry-run mode)
  const copySpinner = ora(
    validated.dryRun ? "Analyzing changes..." : "Copying templates...",
  ).start();

  try {
    const templatesDir = getTemplatesDir();
    const overwrite = validated.force || answers.overwrite;

    const result = await copyTemplates(templatesDir, cwd, replacements, {
      overwrite,
      scope: answers.scope,
      dryRun: validated.dryRun ?? false,
      ...(answers.customFiles && { customFiles: answers.customFiles }),
      ...(validated.preset && { preset: validated.preset }),
      ...(skipAgentsMd && { excludeFiles: ["AGENTS.md"] }),
    });

    copySpinner.succeed(
      validated.dryRun
        ? `Analysis complete: ${chalk.bold(result.copied)} files would be affected`
        : `Templates copied: ${chalk.bold(result.copied)} files${result.skipped > 0 ? chalk.gray(` (skipped ${result.skipped})`) : ""}`,
    );

    // Step 7: Install VS Code snippets if requested (skip in dry-run mode)
    if (!validated.dryRun && answers.installSnippets) {
      const snippetsSpinner = ora("Installing VS Code snippets...").start();

      try {
        const templatesDir = getTemplatesDir();
        const snippetSource = join(templatesDir, "vscode", "tms.code-snippets");
        const snippetDest = join(cwd, ".vscode", "tms.code-snippets");

        // Check if source snippet file exists
        const fs = (await import("fs-extra")).default;
        if (await fs.pathExists(snippetSource)) {
          // Ensure .vscode directory exists
          await fs.ensureDir(join(cwd, ".vscode"));

          // Copy snippet file
          await fs.copyFile(snippetSource, snippetDest);
          snippetsSpinner.succeed(
            "VS Code snippets installed to .vscode/tms.code-snippets",
          );
        } else {
          snippetsSpinner.warn("Snippet file not found, skipping");
        }
      } catch (error) {
        snippetsSpinner.fail("Failed to install snippets");
        if (validated.verbose) {
          console.error(
            chalk.gray("Error details:"),
            error instanceof Error ? error.message : "Unknown error",
          );
        }
        // Don't throw - snippets are optional
      }
    }

    // Step 8: Save .cortexrc configuration (skip in dry-run mode)
    if (!validated.dryRun) {
      const configSpinner = ora("Creating .cortexrc configuration...").start();

      try {
        const config = createConfigFromScope(
          answers.scope,
          answers.projectName,
          answers.customFiles,
        );
        if (validated.preset && config.metadata) {
          config.metadata.preset = validated.preset;
        }
        await saveConfig(cwd, config);
        configSpinner.succeed("Configuration saved");
      } catch (error) {
        configSpinner.fail("Failed to save configuration");
        throw error;
      }
    }

    // Step 8b: Config-first anchor rendering (skip in dry-run mode)
    if (!validated.dryRun) {
      const resolvedConfig = await loadConfig(cwd);
      if (resolvedConfig?.ruleSources) {
        const anchorSpinner = ora("Generating inherited rules anchors...").start();
        try {
          // Step 8b honors AGENTS.md protection (skipAgentsMd) and never
          // persists a partial lock — see applyInheritedRules.
          const { warnings } = await applyInheritedRules(
            cwd,
            resolvedConfig.ruleSources,
            { skipAgentsMd },
          );

          if (warnings.length > 0) {
            anchorSpinner.warn(
              "Inherited rules anchors generated — lock NOT written (rule source validation failed)",
            );
            for (const warning of warnings) {
              console.log(chalk.yellow(`  ⚠ ${warning}`));
            }
          } else {
            anchorSpinner.succeed("Inherited rules anchors generated");
          }
        } catch (error) {
          anchorSpinner.fail("Failed to generate inherited rules anchors");
          if (validated.verbose) {
            console.error(
              chalk.gray("Error details:"),
              error instanceof Error ? error.message : "Unknown error",
            );
          }
        }
      }
    }

    // Step 9: Install (or preview) Claude Code skills when --with-skills is passed.
    // Unlike VS Code snippets, --with-skills is always explicit, so errors propagate.
    if (validated.withSkills) {
      const fs = (await import("fs-extra")).default;
      const skillsTemplatesDir = join(getTemplatesDir(), "skills");

      if (!(await fs.pathExists(skillsTemplatesDir))) {
        throw new Error(
          "--with-skills: skills templates directory not found in cortex-tms package",
        );
      }

      // Only cortex- prefixed directories are shipped user-facing skills (naming convention)
      const skillDirs = (await fs.readdir(skillsTemplatesDir)).filter((d) =>
        d.startsWith("cortex-"),
      );

      if (validated.dryRun) {
        console.log(chalk.cyan("\n  --with-skills (preview):"));
        for (const skillDir of skillDirs) {
          const relativeDestPath = join(".claude", "skills", skillDir);
          const pathCheck = validateSafePath(relativeDestPath, cwd);
          if (!pathCheck.isValid) {
            throw new Error(pathCheck.error);
          }
          const exists = await fs.pathExists(pathCheck.resolvedPath!);
          const action = exists ? "would skip (already exists)" : "would create";
          console.log(
            chalk.gray(`    .claude/skills/${skillDir}/SKILL.md — ${action}`),
          );
        }
      } else {
        const skillsSpinner = ora("Installing Claude Code skills...").start();
        const conflicts: string[] = [];
        const installed: string[] = [];

        for (const skillDir of skillDirs) {
          const relativeDestPath = join(".claude", "skills", skillDir);
          const pathCheck = validateSafePath(relativeDestPath, cwd);
          if (!pathCheck.isValid) {
            skillsSpinner.fail(`Unsafe skill path: ${relativeDestPath}`);
            throw new Error(pathCheck.error);
          }

          const destSkillDir = pathCheck.resolvedPath!;

          if (await fs.pathExists(destSkillDir)) {
            conflicts.push(skillDir);
          } else {
            const srcSkillDir = join(skillsTemplatesDir, skillDir);
            await fs.ensureDir(destSkillDir);
            await fs.copy(srcSkillDir, destSkillDir);
            installed.push(skillDir);
          }
        }

        if (conflicts.length > 0) {
          skillsSpinner.warn(
            `Installed ${installed.length} skill(s); skipped ${conflicts.length} conflict(s): ${conflicts.join(", ")} already exists`,
          );
          console.log(
            chalk.gray(
              "  To reinstall, remove the conflicting .claude/skills/ directory and re-run with --with-skills.",
            ),
          );
        } else {
          skillsSpinner.succeed(
            `Claude Code skills installed: ${installed.map((s) => `/${s}`).join(", ")}`,
          );
        }

        if (installed.length > 0) {
          console.log();
          console.log(chalk.bold("  Skills ready:"));
          console.log(
            chalk.cyan("    /cortex-validate"),
            chalk.gray("— run TMS validation and report results"),
          );
          console.log(
            chalk.cyan("    /cortex-review"),
            chalk.gray("— review current diff against TMS governance docs"),
          );
          console.log();
          console.log(
            chalk.yellow(
              "  Note: Skills take effect after accepting the Claude Code workspace trust dialog for this project.",
            ),
          );
        }
      }
    }

    // Step 10: Success message
    if (validated.dryRun) {
      console.log(
        chalk.green.bold("\n✨ Dry run complete!"),
        chalk.gray("Run without --dry-run to apply changes.\n"),
      );
    } else {
      console.log(
        chalk.green.bold("\n✨ Success!"),
        chalk.gray("Cortex TMS initialized.\n"),
      );
    }

    // Show next steps (skip in dry-run mode)
    if (!validated.dryRun) {
      console.log(chalk.bold("🚀 Quick Start"), chalk.gray("(choose one):"));
      console.log();
      console.log(
        chalk.cyan("  Option A - With your AI agent"),
        chalk.gray("(recommended):"),
      );
      console.log(
        chalk.gray(
          "    1. Open your AI tool (Claude Code, Copilot, Cursor, etc.)",
        ),
      );
      console.log(
        chalk.gray("    2. Run:"),
        chalk.cyan("cortex-tms prompt bootstrap"),
      );
      console.log(
        chalk.gray(
          "    3. Paste the prompt - your AI will analyze the codebase and",
        ),
      );
      console.log(
        chalk.gray(
          "       populate your documentation files as drafts for you to review",
        ),
      );
      console.log();
      console.log(chalk.cyan("  Option B - Manual setup:"));
      console.log(
        chalk.gray("    1. Review"),
        chalk.cyan("NEXT-TASKS.md"),
        chalk.gray("for active sprint tasks"),
      );
      console.log(
        chalk.gray("    2. Update"),
        chalk.cyan("docs/core/"),
        chalk.gray("with your project details"),
      );
      console.log(
        chalk.gray("    3. Customize"),
        chalk.cyan(".github/copilot-instructions.md"),
      );

      if (answers.installSnippets) {
        console.log();
        console.log(
          chalk.gray("  💡 Tip: Use"),
          chalk.cyan("tms-adr"),
          chalk.gray("or"),
          chalk.cyan("tms-pattern"),
          chalk.gray("snippets in VS Code for rapid documentation"),
        );
      }

      if (!context.isGitRepo) {
        console.log();
        console.log(
          chalk.gray("  💡 Tip: Initialize git with"),
          chalk.cyan("git init"),
          chalk.gray("to track changes"),
        );
      }

      console.log();
      console.log(
        chalk.gray("📚 Learn more:"),
        chalk.underline("https://cortex-tms.org"),
      );
      console.log();
    }
  } catch (error) {
    copySpinner.fail("Failed to copy templates");
    console.error(
      chalk.red("\n❌ Error:"),
      error instanceof Error ? error.message : "Unknown error",
    );

    if (validated.verbose && error instanceof Error && error.stack) {
      console.error(chalk.gray("\nStack trace:"));
      console.error(chalk.gray(error.stack));
    }

    throw error instanceof Error ? error : new Error("Unknown error");
  }
}

// Export the command
export const initCommand = createInitCommand();
