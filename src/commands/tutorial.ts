/**
 * Cortex TMS CLI - Tutorial Command
 *
 * Interactive onboarding walkthrough teaching the Cortex Way
 */

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';

/**
 * Tutorial lesson structure
 */
interface Lesson {
  title: string;
  content: string[];
  command?: string;
  tip?: string;
}

/**
 * Create and configure the tutorial command
 */
export function createTutorialCommand(): Command {
  const tutorialCommand = new Command('tutorial');

  tutorialCommand
    .description('Interactive walkthrough of Cortex TMS features')
    .action(async () => {
      await runTutorial();
    });

  return tutorialCommand;
}

/**
 * Export command instance for registration in CLI
 */
export const tutorialCommand = createTutorialCommand();

/**
 * Main tutorial logic
 */
async function runTutorial(): Promise<void> {
  console.log(chalk.bold.cyan('\n🎓 Welcome to Cortex TMS Tutorial\n'));
  console.log(chalk.gray('This interactive guide will teach you the "Cortex Way"'));
  console.log(chalk.gray('Press Enter to continue through lessons, or select Exit to quit.\n'));

  const lessons: Lesson[] = [
    {
      title: '📊 Lesson 1: The Project Dashboard',
      content: [
        'Every Cortex TMS project has a visual dashboard showing:',
        '  • Current scope (Nano/Standard/Enterprise)',
        '  • Active tasks from NEXT-TASKS.md',
        '  • Validation health status',
        '  • Quick statistics at a glance',
        '',
        'Think of this as your "Project Cockpit" - everything you need to know in one command.',
      ],
      command: 'cortex-tms status',
      tip: 'Run this command whenever you return to a project to get oriented.',
    },
    {
      title: '🤖 Lesson 2: AI Agent Activation',
      content: [
        'Cortex TMS includes the "Essential 7" prompt library:',
        '  • init-session - Start with context',
        '  • feature - Implement with architectural anchors',
        '  • debug - Troubleshoot systematically',
        '  • review - Code review against patterns',
        '  • refactor - Structural improvements',
        '  • decision - Architecture decision records',
        '  • finish - Execute maintenance protocol',
        '',
        'Each prompt is project-aware, referencing YOUR docs.',
        'Prompts auto-copy to clipboard for instant paste!',
      ],
      command: 'cortex-tms prompt init-session',
      tip: 'Customize prompts by editing PROMPTS.md in your project root.',
    },
    {
      title: '🔄 Lesson 3: Zero-Drift Governance',
      content: [
        'Version drift is the #1 cause of documentation errors.',
        'Cortex TMS eliminates this with automated version sync.',
        '',
        'How it works:',
        '  1. Update package.json version (the Single Source of Truth)',
        '  2. Run the sync script',
        '  3. All docs automatically updated',
        '',
        'CI validates sync on every PR - drift cannot merge!',
      ],
      command: 'pnpm run docs:sync',
      tip: 'If CI blocks your PR, run docs:sync locally and commit the changes.',
    },
    {
      title: '✅ Lesson 4: Project Health & The Archive Protocol',
      content: [
        'The validate command checks project health:',
        '  • Mandatory files exist',
        '  • No placeholder text (e.g., [YOUR_PROJECT])',
        '  • Configuration is valid',
        '  • Archive status is healthy',
        '',
        'The Archive Protocol (you just experienced this!):',
        '  • CI blocks PRs if >10 completed tasks in NEXT-TASKS.md',
        '  • This forces regular archival to docs/archive/',
        '  • Keeps NEXT-TASKS.md focused on current work',
        '  • Prevents technical debt accumulation',
        '',
        'This is governance that enforces itself!',
      ],
      command: 'cortex-tms validate --strict',
      tip: 'Run validate before commits to catch issues early.',
    },
    {
      title: '🚀 Lesson 5: Safe Template Evolution',
      content: [
        'Templates evolve, but your customizations matter.',
        'The Safe-Fail Migration Engine has 3 components:',
        '',
        '1. Backup Engine (automatic snapshots)',
        '   • Timestamped backups in .cortex/backups/',
        '   • Created BEFORE any changes',
        '   • Manifest tracks what/why',
        '',
        '2. Apply Logic (smart upgrades)',
        '   • Auto-upgrades OUTDATED files',
        '   • Skips CUSTOMIZED files (unless --force)',
        '   • Clear status reporting',
        '',
        '3. Rollback Command (one-click recovery)',
        '   • Interactive backup selection',
        '   • Preview before restore',
        '   • Confirmation required',
        '',
        'Upgrade fearlessly - recovery is one command away!',
      ],
      command: 'cortex-tms migrate',
      tip: 'Always run migrate (no flags) first to see what needs updating.',
    },
  ];

  let currentLesson = 0;

  while (currentLesson < lessons.length) {
    const lesson = lessons[currentLesson];

    if (!lesson) {
      break; // Safety check
    }

    // Display lesson
    console.clear();
    console.log(chalk.bold.cyan(`\n${lesson.title}\n`));
    console.log(chalk.gray(`Lesson ${currentLesson + 1} of ${lessons.length}\n`));

    lesson.content.forEach((line) => {
      if (line === '') {
        console.log();
      } else if (line.startsWith('  •')) {
        console.log(chalk.blue(line));
      } else if (line.startsWith('  ')) {
        console.log(chalk.gray(line));
      } else {
        console.log(chalk.white(line));
      }
    });

    if (lesson.command) {
      console.log(chalk.bold.yellow('\n💻 Try this command:\n'));
      console.log(chalk.cyan(`   ${lesson.command}\n`));
    }

    if (lesson.tip) {
      console.log(chalk.gray(`💡 Pro Tip: ${lesson.tip}\n`));
    }

    // Navigation
    const isLast = currentLesson === lessons.length - 1;
    const choices = isLast
      ? [
          { name: chalk.green('✓ Finish Tutorial'), value: 'next' },
          { name: chalk.gray('← Previous Lesson'), value: 'prev' },
          { name: chalk.red('Exit Tutorial'), value: 'exit' },
        ]
      : [
          { name: chalk.green('→ Next Lesson'), value: 'next' },
          ...(currentLesson > 0
            ? [{ name: chalk.gray('← Previous Lesson'), value: 'prev' }]
            : []),
          { name: chalk.red('Exit Tutorial'), value: 'exit' },
        ];

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices,
      },
    ]);

    if (action === 'exit') {
      console.log(chalk.gray('\n✓ Tutorial exited. Run "cortex-tms tutorial" anytime to continue.\n'));
      return;
    } else if (action === 'prev') {
      currentLesson = Math.max(0, currentLesson - 1);
    } else if (action === 'next') {
      if (isLast) {
        break; // Exit tutorial naturally
      } else {
        currentLesson++;
      }
    }
  }

  // Tutorial complete
  console.clear();
  console.log(chalk.bold.green('\n🎉 Tutorial Complete!\n'));
  console.log(chalk.white('You now know the Cortex Way:'));
  console.log(chalk.blue('  • Dashboard: cortex-tms status'));
  console.log(chalk.blue('  • AI Activation: cortex-tms prompt'));
  console.log(chalk.blue('  • Version Sync: pnpm run docs:sync'));
  console.log(chalk.blue('  • Health Check: cortex-tms validate'));
  console.log(chalk.blue('  • Migration: cortex-tms migrate'));
  console.log();
  console.log(chalk.gray('💡 Next Steps:'));
  console.log(chalk.cyan('   1. Run "cortex-tms status" to see your project dashboard'));
  console.log(chalk.cyan('   2. Run "cortex-tms prompt init-session" to start coding'));
  console.log(chalk.cyan('   3. Read NEXT-TASKS.md to see what to work on next'));
  console.log();
  console.log(chalk.gray('📚 For more details, see:'));
  console.log(chalk.gray('   • CLAUDE.md (agent workflow)'));
  console.log(chalk.gray('   • docs/core/ARCHITECTURE.md (technical design)'));
  console.log(chalk.gray('   • docs/core/PATTERNS.md (coding standards)'));
  console.log();
  console.log(chalk.bold.cyan('Happy coding! 🚀\n'));
}
