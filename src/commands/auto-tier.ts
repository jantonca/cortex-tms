import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import { isGitRepo, analyzeFileHistory, FileGitInfo } from '../utils/git-history.js';
import { readTierTag, writeTierTag, Tier } from '../utils/tier-tags.js';
import { GitError } from '../utils/errors.js';
import { autoTierOptionsSchema, validateOptions } from '../utils/validation.js';

interface AutoTierOptions {
  hot: string;
  warm: string;
  cold: string;
  dryRun?: boolean;
  force?: boolean;
  verbose?: boolean;
  maxHot?: string;
}

interface TierSuggestion {
  path: string;
  currentTier: Tier | null;
  suggestedTier: Tier;
  reason: string;
  daysSinceChange: number;
  action: 'CREATE' | 'UPDATE' | 'SKIP';
}

// Files that must always remain HOT (canonical HOT list)
// These are exact path matches, not patterns
const MANDATORY_HOT = [
  'NEXT-TASKS.md',
  'CLAUDE.md',
  '.github/copilot-instructions.md',
  'docs/core/PATTERNS.md',
  'docs/core/GLOSSARY.md',
];

/**
 * Check if file is in canonical HOT list (exact path match)
 */
function isCanonicalHot(filePath: string): boolean {
  return MANDATORY_HOT.includes(filePath);
}

/**
 * Calculate score for a file to determine tier priority
 * Higher score = more likely to be HOT
 */
function calculateFileScore(filePath: string, daysSinceChange: number, hotDays: number): number {
  let score = 0;

  // Canonical HOT files get highest priority (must be > docs+core+recent = 65)
  if (isCanonicalHot(filePath)) {
    score += 100;
  }

  // Documentation files are high value
  if (filePath.startsWith('docs/')) {
    score += 40;

    // Core docs get extra boost
    if (filePath.startsWith('docs/core/')) {
      score += 10;
    }

    // Archive docs get penalty
    if (filePath.startsWith('docs/archive/')) {
      score -= 60; // Effectively removes them from HOT consideration
    }
  }

  // Recency bonus (recent changes indicate active work)
  if (daysSinceChange <= hotDays) {
    score += 15;
  } else if (daysSinceChange <= hotDays * 2) {
    score += 5;
  }

  return score;
}

/**
 * Determine tier based on file path and return matched directory
 */
function getDirectoryBasedTier(filePath: string): { tier: Tier; directory: string } | null {
  // Archive always goes to COLD
  if (filePath.startsWith('docs/archive/')) {
    return { tier: 'COLD', directory: 'docs/archive/' };
  }

  // Examples typically COLD
  if (filePath.startsWith('examples/')) {
    return { tier: 'COLD', directory: 'examples/' };
  }

  // Templates typically WARM
  if (filePath.startsWith('templates/')) {
    return { tier: 'WARM', directory: 'templates/' };
  }

  // Guides typically WARM
  if (filePath.startsWith('docs/guides/')) {
    return { tier: 'WARM', directory: 'docs/guides/' };
  }

  // Tasks typically WARM
  if (filePath.startsWith('docs/tasks/')) {
    return { tier: 'WARM', directory: 'docs/tasks/' };
  }

  return null; // No directory-based tier, use scoring
}

export function createAutoTierCommand(): Command {
  const cmd = new Command('auto-tier');

  cmd
    .description('Analyze and apply tier tags based on git history (use --dry-run to preview)')
    .option('--hot <days>', 'Files modified ≤N days ago get recency bonus', '7')
    .option('--warm <days>', 'Files modified ≤N days ago → WARM (aging beyond this stays WARM until --cold)', '30')
    .option('--cold <days>', 'Files older than N days → COLD', '90')
    .option('--max-hot <count>', 'Maximum number of HOT files (capped)', '10')
    .option('-d, --dry-run', 'Preview changes without applying')
    .option('-f, --force', 'Overwrite existing tier tags')
    .option('-v, --verbose', 'Show detailed output')
    .action(runAutoTier);

  return cmd;
}

async function runAutoTier(options: AutoTierOptions): Promise<void> {
  const cwd = process.cwd();

  // Validate options using Zod schema
  const validated = validateOptions(autoTierOptionsSchema, options, 'auto-tier');
  const hotDays = validated.hot;
  const warmDays = validated.warm;
  const coldDays = validated.cold;
  const maxHotFiles = validated.maxHot ?? 10;

  console.log(chalk.bold.cyan('\n🔄 Git-Based Auto-Tiering\n'));

  // Check for git repo
  if (!isGitRepo(cwd)) {
    throw new GitError('Not a git repository. Run this command in a git-initialized project.');
  }

  if (options.dryRun) {
    console.log(chalk.yellow('🔍 DRY RUN MODE: No files will be modified.\n'));
  }

  const spinner = ora('Analyzing git history...').start();

  // Find all markdown files (including dot-directories like .github/)
  const files = await glob('**/*.md', {
    cwd,
    dot: true,
    ignore: ['**/node_modules/**', '.git/**', '**/dist/**'],
  });

  // Analyze git history
  const gitInfo = analyzeFileHistory(cwd, files);

  spinner.text = 'Calculating tier suggestions...';

  // Step 1: Calculate scores and gather candidates
  interface ScoredFile {
    info: FileGitInfo;
    content: string;
    currentTier: Tier | null;
    score: number;
  }

  const scoredFiles: ScoredFile[] = [];

  for (const info of gitInfo) {
    // Skip untracked files (not in git history)
    if (!info.isTracked) {
      continue;
    }

    const content = await readFile(info.path, 'utf-8');
    const currentTier = readTierTag(content);

    // Respect explicit tier tags unless --force is used
    // EXCEPT: Canonical HOT files are always included (they must always be HOT)
    if (currentTier && !options.force && !isCanonicalHot(info.path)) {
      // Keep existing tier, skip scoring
      continue;
    }

    const score = calculateFileScore(info.path, info.daysSinceChange, hotDays);

    scoredFiles.push({
      info,
      content,
      currentTier,
      score,
    });
  }

  // Step 2: Sort by score (highest first), with path as tie-breaker for stability
  scoredFiles.sort((a, b) => {
    const scoreDiff = b.score - a.score;
    if (scoreDiff !== 0) return scoreDiff;
    // Tie-breaker: alphabetical by path
    return a.info.path.localeCompare(b.info.path);
  });

  // Step 3: Assign tiers with HOT cap
  const suggestions: TierSuggestion[] = [];
  let hotCount = 0;

  for (const scored of scoredFiles) {
    const { info, currentTier } = scored;
    let suggestedTier: Tier;
    let reason: string;

    // Strict cap: canonical and high-scoring files compete for HOT slots
    // Canonical files have highest scores, so they naturally get priority
    if (hotCount < maxHotFiles && (isCanonicalHot(info.path) || scored.score >= 40)) {
      suggestedTier = 'HOT';
      reason = isCanonicalHot(info.path)
        ? 'Canonical HOT file'
        : `High-value doc (score: ${scored.score})`;
      hotCount++;
    }
    // Directory-based defaults
    else {
      const dirResult = getDirectoryBasedTier(info.path);
      if (dirResult) {
        suggestedTier = dirResult.tier;
        reason = `Directory convention: ${dirResult.directory}`;
      }
      // Time-based fallback for unclassified files
      else if (info.daysSinceChange <= warmDays) {
        suggestedTier = 'WARM';
        reason = `Modified ${Math.round(info.daysSinceChange)} days ago`;
      } else if (info.daysSinceChange <= coldDays) {
        suggestedTier = 'WARM';
        reason = `Modified ${Math.round(info.daysSinceChange)} days ago (aging)`;
      } else {
        suggestedTier = 'COLD';
        reason = `No changes in ${Math.round(info.daysSinceChange)} days`;
      }
    }

    // Determine action
    let action: TierSuggestion['action'];
    if (!currentTier) {
      action = 'CREATE';
    } else if (currentTier !== suggestedTier) {
      action = 'UPDATE';
    } else {
      action = 'SKIP';
    }

    suggestions.push({
      path: info.path,
      currentTier,
      suggestedTier,
      reason,
      daysSinceChange: info.daysSinceChange,
      action,
    });
  }

  // Step 4: Add skipped files (those with explicit tags we're respecting)
  for (const info of gitInfo) {
    if (!info.isTracked) continue;

    const content = await readFile(info.path, 'utf-8');
    const currentTier = readTierTag(content);

    // If file has explicit tier and we're not forcing, add as SKIP
    if (currentTier && !options.force) {
      const alreadyAdded = suggestions.some(s => s.path === info.path);
      if (!alreadyAdded) {
        suggestions.push({
          path: info.path,
          currentTier,
          suggestedTier: currentTier,
          reason: 'Explicit tier tag (use --force to override)',
          daysSinceChange: info.daysSinceChange,
          action: 'SKIP',
        });
      }
    }
  }

  spinner.succeed(`Analyzed ${files.length} files`);

  // Display results
  printSuggestions(suggestions, options.verbose || false);

  // Apply changes if not dry-run
  if (!options.dryRun) {
    await applyChanges(suggestions);
  }
}

function printSuggestions(suggestions: TierSuggestion[], verbose: boolean): void {
  // Group by tier (only show files that will be changed)
  const toChange = suggestions.filter(s => s.action !== 'SKIP');
  const byTier = { HOT: [], WARM: [], COLD: [] } as Record<Tier, TierSuggestion[]>;
  toChange.forEach(s => byTier[s.suggestedTier].push(s));

  console.log(chalk.bold('\n📊 Tier Suggestions:\n'));

  // HOT
  console.log(chalk.red.bold(`🔥 HOT (${byTier.HOT.length} files)`));
  byTier.HOT.slice(0, 10).forEach(s => {
    const actionIcon = s.action === 'CREATE' ? '✨' : s.action === 'UPDATE' ? '🔄' : '✓';
    console.log(`  ${actionIcon} ${s.path}`);
    if (verbose) console.log(chalk.gray(`      ${s.reason}`));
  });
  if (byTier.HOT.length > 10) console.log(chalk.gray(`  ... and ${byTier.HOT.length - 10} more`));

  // WARM
  console.log(chalk.yellow.bold(`\n📚 WARM (${byTier.WARM.length} files)`));
  byTier.WARM.slice(0, 10).forEach(s => {
    const actionIcon = s.action === 'CREATE' ? '✨' : s.action === 'UPDATE' ? '🔄' : '✓';
    console.log(`  ${actionIcon} ${s.path}`);
    if (verbose) console.log(chalk.gray(`      ${s.reason}`));
  });
  if (byTier.WARM.length > 10) console.log(chalk.gray(`  ... and ${byTier.WARM.length - 10} more`));

  // COLD
  console.log(chalk.blue.bold(`\n❄️  COLD (${byTier.COLD.length} files)`));
  byTier.COLD.slice(0, 5).forEach(s => {
    const actionIcon = s.action === 'CREATE' ? '✨' : s.action === 'UPDATE' ? '🔄' : '✓';
    console.log(`  ${actionIcon} ${s.path}`);
    if (verbose) console.log(chalk.gray(`      ${s.reason}`));
  });
  if (byTier.COLD.length > 5) console.log(chalk.gray(`  ... and ${byTier.COLD.length - 5} more`));

  // Summary
  const toCreate = suggestions.filter(s => s.action === 'CREATE').length;
  const toUpdate = suggestions.filter(s => s.action === 'UPDATE').length;

  console.log(chalk.bold('\n📈 Summary:'));
  console.log(`  ${chalk.green('✨ CREATE:')} ${toCreate} new tier tags`);
  console.log(`  ${chalk.blue('🔄 UPDATE:')} ${toUpdate} tier changes`);
}

async function applyChanges(suggestions: TierSuggestion[]): Promise<void> {
  const toApply = suggestions.filter(s => s.action !== 'SKIP');

  if (toApply.length === 0) {
    console.log(chalk.gray('\n✓ No changes to apply.'));
    return;
  }

  const spinner = ora(`Applying ${toApply.length} changes...`).start();

  for (const suggestion of toApply) {
    const content = await readFile(suggestion.path, 'utf-8');
    const updated = writeTierTag(content, suggestion.suggestedTier);
    await writeFile(suggestion.path, updated, 'utf-8');
  }

  spinner.succeed(`Applied ${toApply.length} tier tags`);
}

export const autoTierCommand = createAutoTierCommand();
