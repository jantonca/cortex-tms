/**
 * Cortex TMS CLI - Analyze Command
 *
 * Analyzes existing project structure and suggests TMS setup for migration
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { analyzeProject } from '../utils/project-analyzer.js';

/**
 * Create and configure the analyze command
 */
export function createAnalyzeCommand(): Command {
  const analyzeCommand = new Command('analyze');

  analyzeCommand
    .description('Analyze existing project and suggest TMS structure')
    .action(async () => {
      await runAnalysis();
    });

  return analyzeCommand;
}

/**
 * Main analyze command logic
 */
async function runAnalysis(): Promise<void> {
  const cwd = process.cwd();

  console.log(chalk.bold.cyan('\n🔍 Analyzing your project...\n'));

  const spinner = ora('Scanning project structure...').start();

  try {
    const analysis = await analyzeProject(cwd);
    spinner.succeed('Analysis complete');

    // Project Overview
    console.log(chalk.bold('\n📊 Project Overview'));
    console.log(`  ${chalk.cyan('Name:')} ${analysis.projectName}`);
    console.log(`  ${chalk.cyan('Type:')} ${analysis.projectType}`);
    console.log(
      `  ${chalk.cyan('Size:')} ${analysis.fileCount} files, ~${analysis.linesOfCode.toLocaleString()} LOC`
    );
    console.log(
      `  ${chalk.cyan('Documentation:')} ${analysis.existingDocs.length} files found`
    );

    // Existing Documentation Quality
    console.log(chalk.bold('\n📁 Existing Documentation Quality'));
    if (analysis.existingDocs.length > 0) {
      analysis.existingDocs.forEach((doc) => {
        const icon = doc.quality === 'good' ? '✅' : doc.quality === 'fair' ? '⚠️' : '❌';
        const color = doc.quality === 'good' ? chalk.green : doc.quality === 'fair' ? chalk.yellow : chalk.red;
        console.log(`  ${icon} ${chalk.cyan(doc.path)} (${doc.lines} lines) - ${color(doc.assessment)}`);
      });
    } else {
      console.log(chalk.gray('  No documentation files found'));
    }

    // Recommended TMS Structure
    console.log(chalk.bold('\n💡 Recommended TMS Structure'));
    console.log(`  ${chalk.cyan('Scope:')} ${analysis.recommendedScope} (${getScopeFileCount(analysis.recommendedScope)} files)`);
    console.log();
    console.log(chalk.bold('  Migration Strategy:'));
    analysis.migrationStrategy.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });
    console.log();
    console.log(`  ${chalk.cyan('Estimated effort:')} ~${analysis.estimatedEffort}`);

    // Savings Projection (if TMS docs exist)
    if (analysis.savingsProjection) {
      const savings = analysis.savingsProjection;
      console.log(chalk.bold('\n💰 Potential Savings with TMS'));
      console.log(`  ${chalk.cyan('Context reduction:')} ${savings.tokenReduction.toLocaleString()} tokens (${savings.percentReduction.toFixed(1)}%)`);
      console.log(`  ${chalk.cyan('Estimated usage:')} ${savings.monthlySessions} AI sessions/month`);
      console.log(`  ${chalk.green('Savings per session:')} ~$${savings.costSavings.perSession.toFixed(3)}`);
      console.log(`  ${chalk.green('Savings per month:')} ~$${savings.costSavings.perMonth.toFixed(2)}`);
      console.log(chalk.gray(`  (Estimates based on ${savings.modelUsed} pricing and a simple usage model – actual savings will vary)`));
    }

    // Next Steps
    console.log(chalk.bold('\n🚀 Next Steps'));
    console.log(chalk.gray('  1. Review the migration strategy above'));
    console.log(chalk.gray('  2. Read full migration guide:'), chalk.cyan('docs/guides/MIGRATION-GUIDE.md'));
    console.log(chalk.gray('  3. Run:'), chalk.cyan('cortex-tms init'), chalk.gray('to create TMS structure'));
    console.log(chalk.gray('  4. Migrate content following the guide'));
    console.log(chalk.gray('  5. Run:'), chalk.cyan('cortex-tms validate'), chalk.gray('to check setup'));

    console.log(); // Trailing newline
  } catch (error) {
    spinner.fail('Analysis failed');
    throw error instanceof Error ? error : new Error('Unknown error');
  }
}

/**
 * Get file count for scope
 */
function getScopeFileCount(scope: string): number {
  switch (scope.toLowerCase()) {
    case 'nano':
      return 2;
    case 'standard':
      return 9;
    case 'enterprise':
      return 15;
    default:
      return 9;
  }
}

// Export the command
export const analyzeCommand = createAnalyzeCommand();
