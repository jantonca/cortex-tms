import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import { isGitRepo, analyzeFileHistory } from '../utils/git-history.js';
import { readTierTag, writeTierTag, Tier } from '../utils/tier-tags.js';

interface AutoTierOptions {
  hot: string;
  warm: string;
  cold: string;
  dryRun?: boolean;
  force?: boolean;
  verbose?: boolean;
}

interface TierSuggestion {
  path: string;
  currentTier: Tier | null;
  suggestedTier: Tier;
  reason: string;
  daysSinceChange: number;
  action: 'CREATE' | 'UPDATE' | 'SKIP';
}

// Files that must always remain HOT
const MANDATORY_HOT = ['NEXT-TASKS.md', 'CLAUDE.md', '.github/copilot-instructions.md'];

export function createAutoTierCommand(): Command {
  const cmd = new Command('auto-tier');

  cmd
    .description('Analyze and apply tier tags based on git history (use --dry-run to preview)')
    .option('--hot <days>', 'Files modified ≤N days ago → HOT', '7')
    .option('--warm <days>', 'Files modified ≤N days ago → WARM (aging beyond this stays WARM until --cold)', '30')
    .option('--cold <days>', 'Files older than N days → COLD', '90')
    .option('-d, --dry-run', 'Preview changes without applying')
    .option('-f, --force', 'Overwrite existing tier tags')
    .option('-v, --verbose', 'Show detailed output')
    .action(runAutoTier);

  return cmd;
}

async function runAutoTier(options: AutoTierOptions): Promise<void> {
  const cwd = process.cwd();

  // Parse and validate numeric options
  const hotDays = parseInt(String(options.hot), 10);
  const warmDays = parseInt(String(options.warm), 10);
  const coldDays = parseInt(String(options.cold), 10);

  // Validate thresholds
  if (isNaN(hotDays) || hotDays < 0) {
    console.log(chalk.red('❌ Error: --hot must be a positive number'));
    process.exit(1);
  }
  if (isNaN(warmDays) || warmDays < 0) {
    console.log(chalk.red('❌ Error: --warm must be a positive number'));
    process.exit(1);
  }
  if (isNaN(coldDays) || coldDays < 0) {
    console.log(chalk.red('❌ Error: --cold must be a positive number'));
    process.exit(1);
  }
  if (hotDays > warmDays) {
    console.log(chalk.red('❌ Error: --hot threshold must be ≤ --warm threshold'));
    console.log(chalk.gray(`   Got: hot=${hotDays}, warm=${warmDays}`));
    process.exit(1);
  }
  if (warmDays > coldDays) {
    console.log(chalk.red('❌ Error: --warm threshold must be ≤ --cold threshold'));
    console.log(chalk.gray(`   Got: warm=${warmDays}, cold=${coldDays}`));
    process.exit(1);
  }

  console.log(chalk.bold.cyan('\n🔄 Git-Based Auto-Tiering\n'));

  // Check for git repo
  if (!isGitRepo(cwd)) {
    console.log(chalk.red('❌ Error: Not a git repository'));
    console.log(chalk.gray('   Run this command in a git-initialized project.'));
    process.exit(1);
  }

  if (options.dryRun) {
    console.log(chalk.yellow('🔍 DRY RUN MODE: No files will be modified.\n'));
  }

  const spinner = ora('Analyzing git history...').start();

  // Find all markdown files
  const files = await glob('**/*.md', {
    cwd,
    ignore: ['node_modules/**', '.git/**', 'dist/**'],
  });

  // Analyze git history
  const gitInfo = analyzeFileHistory(cwd, files);

  spinner.text = 'Calculating tier suggestions...';

  // Generate suggestions
  const suggestions: TierSuggestion[] = [];

  for (const info of gitInfo) {
    const content = await readFile(info.path, 'utf-8');
    const currentTier = readTierTag(content);

    // Determine suggested tier
    let suggestedTier: Tier;
    let reason: string;

    if (MANDATORY_HOT.some(f => info.path.endsWith(f))) {
      suggestedTier = 'HOT';
      reason = 'Mandatory HOT file';
    } else if (info.isNewFile) {
      suggestedTier = 'HOT';
      reason = 'New/untracked file (active work)';
    } else if (info.daysSinceChange <= hotDays) {
      suggestedTier = 'HOT';
      reason = `Modified ${Math.round(info.daysSinceChange)} days ago`;
    } else if (info.daysSinceChange <= warmDays) {
      suggestedTier = 'WARM';
      reason = `Modified ${Math.round(info.daysSinceChange)} days ago`;
    } else if (info.daysSinceChange <= coldDays) {
      suggestedTier = 'WARM';
      reason = `Modified ${Math.round(info.daysSinceChange)} days ago (aging)`;
    } else {
      suggestedTier = 'COLD';
      reason = `No changes in ${Math.round(info.daysSinceChange)} days`;
    }

    // Determine action
    let action: TierSuggestion['action'];
    if (!currentTier) {
      action = 'CREATE';
    } else if (currentTier !== suggestedTier && options.force) {
      action = 'UPDATE';
    } else if (currentTier === suggestedTier) {
      action = 'SKIP';
    } else {
      action = 'SKIP';  // Don't overwrite without --force
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

  spinner.succeed(`Analyzed ${files.length} files`);

  // Display results
  printSuggestions(suggestions, options.verbose || false);

  // Apply changes if not dry-run
  if (!options.dryRun) {
    await applyChanges(suggestions);
  }
}

function printSuggestions(suggestions: TierSuggestion[], verbose: boolean): void {
  // Group by tier
  const byTier = { HOT: [], WARM: [], COLD: [] } as Record<Tier, TierSuggestion[]>;
  suggestions.forEach(s => byTier[s.suggestedTier].push(s));

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
