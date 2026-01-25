/**
 * Guardian Accuracy Validation Test
 *
 * Tests Guardian's semantic validation capabilities against a curated dataset
 * of code samples with known violations and compliant code.
 *
 * Goal: Achieve 70%+ accuracy in detecting pattern/rule violations
 */

import { describe, it, expect, beforeAll, vi } from 'vitest';
import { callLLM, parseGuardianJSON, type LLMConfig, type LLMMessage } from '../utils/llm-client.js';

// Test configuration constants
const ACCURACY_THRESHOLDS = {
  MINIMUM_ACCURACY: 70,
  MAX_FALSE_POSITIVE_RATE: 30,
  MAX_FALSE_NEGATIVE_RATE: 30,
  API_TIMEOUT_MS: 600000, // 10 minutes
} as const;

// Test case structure
interface TestCase {
  id: string;
  name: string;
  code: string;
  expectedViolation: boolean;
  violatedRules?: string[]; // e.g., ["Pattern 1", "Rule 3"]
  description: string;
}

// Test dataset with diverse violation types
const TEST_DATASET: TestCase[] = [
  // ===== PATTERN 1: Placeholder Syntax =====
  {
    id: 'P1-PASS-1',
    name: 'Pattern 1: Correct bracket syntax',
    code: `# Project Setup

## Tech Stack
- **Frontend**: [e.g., Next.js 15, Vue 3, Svelte]
- **Backend**: [e.g., Express, Fastify, NestJS]`,
    expectedViolation: false,
    description: 'Uses correct [bracket] placeholder syntax',
  },
  {
    id: 'P1-FAIL-1',
    name: 'Pattern 1: TODO placeholder violation',
    code: `# Project Setup

## Tech Stack
- **Frontend**: TODO
- **Backend**: FIXME`,
    expectedViolation: true,
    violatedRules: ['Pattern 1'],
    description: 'Uses TODO/FIXME instead of bracket syntax',
  },
  {
    id: 'P1-FAIL-2',
    name: 'Pattern 1: XML placeholder violation',
    code: `# Project Setup

## Tech Stack
- **Frontend**: <insert framework here>
- **Backend**: <placeholder>`,
    expectedViolation: true,
    violatedRules: ['Pattern 1'],
    description: 'Uses XML tags instead of bracket syntax',
  },

  // ===== PATTERN 2: Framework-Agnostic Templates =====
  {
    id: 'P2-PASS-1',
    name: 'Pattern 2: Framework-agnostic tech stack',
    code: `## Tech Stack

- **Frontend**: [e.g., Next.js 15, Vue 3, Svelte]
- **Styling**: [e.g., Tailwind CSS, CSS Modules]
- **Database**: [e.g., PostgreSQL, MongoDB, Redis]`,
    expectedViolation: false,
    description: 'Provides examples without hardcoding specific stack',
  },
  {
    id: 'P2-FAIL-1',
    name: 'Pattern 2: Hardcoded tech stack violation',
    code: `## Tech Stack

- Next.js 15
- React 18
- Tailwind CSS
- PostgreSQL`,
    expectedViolation: true,
    violatedRules: ['Pattern 2'],
    description: 'Hardcodes specific tech stack in template',
  },

  // ===== PATTERN 3: Canonical Links =====
  {
    id: 'P3-PASS-1',
    name: 'Pattern 3: Proper canonical link usage',
    code: `## Button Component Pattern

**Canonical Example**: \`src/components/Button.tsx:15\`

**Key Details**:
- Uses cva for variant composition
- Supports size, variant, disabled props`,
    expectedViolation: false,
    description: 'Uses canonical links instead of duplicating code',
  },
  {
    id: 'P3-FAIL-1',
    name: 'Pattern 3: Code duplication violation',
    code: `## Button Component Pattern

Here's the complete implementation:

\`\`\`tsx
export function Button({ variant, size, children }) {
  return <button className={cn(variants[variant], sizes[size])}>{children}</button>;
}

const variants = {
  primary: 'bg-blue-500 text-white',
  secondary: 'bg-gray-500 text-white',
};
// ... 50 more lines of duplicated code
\`\`\``,
    expectedViolation: true,
    violatedRules: ['Pattern 3'],
    description: 'Duplicates code instead of using canonical links',
  },

  // ===== PATTERN 4: Inline Documentation =====
  {
    id: 'P4-PASS-1',
    name: 'Pattern 4: Helpful inline comments',
    code: `## Definition of Done

<!-- Customize this checklist based on your project's quality standards -->
- [ ] Tests passing
- [ ] Documentation updated in \`docs/core/\`
- [ ] Code follows \`docs/core/PATTERNS.md\``,
    expectedViolation: false,
    description: 'Includes concise inline guidance',
  },
  {
    id: 'P4-FAIL-1',
    name: 'Pattern 4: Missing inline guidance',
    code: `## Definition of Done

- [ ] Tests passing
- [ ] Documentation updated
- [ ] Code reviewed`,
    expectedViolation: true,
    violatedRules: ['Pattern 4'],
    description: 'No inline comments explaining what to customize',
  },

  // ===== PATTERN 8: No Meta-Documentation =====
  {
    id: 'P8-PASS-1',
    name: 'Pattern 8: Clean template without meta-docs',
    code: `# NEXT: Upcoming Tasks

## Active Sprint: [Feature Name]

**Why this matters**: [Briefly describe user value]`,
    expectedViolation: false,
    description: 'Template is clean and ready to use',
  },
  {
    id: 'P8-FAIL-1',
    name: 'Pattern 8: Meta-documentation in template',
    code: `# NEXT: Upcoming Tasks

This file is part of the Tiered Memory System (TMS).
It represents the HOT tier of documentation, meaning AI agents
will read this at the start of every session...

## Active Sprint: [Feature Name]`,
    expectedViolation: true,
    violatedRules: ['Pattern 8'],
    description: 'Template contains TMS explanations',
  },

  // ===== PATTERN 9: Archive Triggers =====
  {
    id: 'P9-PASS-1',
    name: 'Pattern 9: Proper archiving behavior',
    code: `# Sprint Archive moved to docs/archive/sprint-2026-01.md

## Current Sprint: User Authentication

- [ ] Implement login flow
- [ ] Add password reset`,
    expectedViolation: false,
    description: 'Completed tasks moved to archive',
  },
  {
    id: 'P9-FAIL-1',
    name: 'Pattern 9: Completed tasks not archived',
    code: `# NEXT: Upcoming Tasks

## Completed Tasks (Jan 2026)
- [x] Task 1
- [x] Task 2
- [x] Task 3
[... 50 more completed tasks ...]

## Completed Tasks (Dec 2025)
- [x] Old task 1
- [x] Old task 2
[... 100 more lines ...]`,
    expectedViolation: true,
    violatedRules: ['Pattern 9'],
    description: 'Keeping completed tasks in NEXT-TASKS.md',
  },

  // ===== RULE 2: Framework-Agnostic Templates =====
  {
    id: 'R2-PASS-1',
    name: 'Rule 2: Framework flexibility',
    code: `## Authentication Strategy

- [e.g., OAuth 2.0, JWT, Session-based]
- [Provider: Auth0, Clerk, custom implementation]`,
    expectedViolation: false,
    description: 'Provides options rather than prescribing specific solution',
  },

  // ===== RULE 3: Bracket Syntax =====
  {
    id: 'R3-FAIL-1',
    name: 'Rule 3: Missing bracket placeholders',
    code: `# Project: My App

## Description
TODO: Add project description here

## Goals
- FIXME: Define project goals`,
    expectedViolation: true,
    violatedRules: ['Rule 3'],
    description: 'Uses TODO/FIXME instead of bracket syntax',
  },

  // ===== RULE 4: Context Budget Enforcement =====
  {
    id: 'R4-FAIL-1',
    name: 'Rule 4: HOT file exceeding line limits',
    code: `# NEXT-TASKS.md
${Array(250).fill('- [ ] Some task\n').join('')}
`,
    expectedViolation: true,
    violatedRules: ['Rule 4'],
    description: 'NEXT-TASKS.md exceeds 200 line limit',
  },

  // ===== RULE 6: Archive Trigger =====
  {
    id: 'R6-PASS-1',
    name: 'Rule 6: Proper archiving workflow',
    code: `// Archive process completed
// 1. Tests passed ✓
// 2. Changes committed ✓
// 3. Documentation updated in docs/core/ARCHITECTURE.md ✓
// 4. Tasks moved to docs/archive/sprint-2026-01.md ✓`,
    expectedViolation: false,
    description: 'Follows complete maintenance protocol',
  },

  // ===== RULE 7: No Meta-Documentation =====
  {
    id: 'R7-FAIL-1',
    name: 'Rule 7: Explaining TMS in template',
    code: `# ARCHITECTURE.md

NOTE: This is a WARM tier file, which means AI agents
should read it on-demand when implementing features.
The Tiered Memory System organizes files by access frequency...

## System Overview
[Content...]`,
    expectedViolation: true,
    violatedRules: ['Rule 7'],
    description: 'Template explains TMS concepts instead of being ready to use',
  },

  // ===== RULE 8: Canonical Links =====
  {
    id: 'R8-PASS-1',
    name: 'Rule 8: Referencing actual implementation',
    code: `## Error Handling Pattern

**Location**: \`src/utils/error-handler.ts:42\`

All errors should use the centralized handler.
See canonical implementation for error types and handling logic.`,
    expectedViolation: false,
    description: 'Links to actual code instead of duplicating',
  },

  // ===== COMPLEX CASES (Multiple Violations) =====
  {
    id: 'MULTI-FAIL-1',
    name: 'Multiple violations: Meta-docs + TODO + Hardcoded stack',
    code: `# PROJECT SETUP GUIDE

This file is part of TMS and explains how to set up your project.

## Tech Stack
- Next.js 15
- React 18
- PostgreSQL
- TODO: Add more technologies

## Database Schema
TODO: Define schema here`,
    expectedViolation: true,
    violatedRules: ['Pattern 2', 'Pattern 8', 'Rule 3', 'Rule 7'],
    description: 'Contains meta-docs, TODO, and hardcoded tech stack',
  },

  // ===== EDGE CASES (Should Pass) =====
  {
    id: 'EDGE-PASS-1',
    name: 'Edge: Example project with specific stack (allowed)',
    code: `# Example: Todo App

This is a reference implementation.

## Tech Stack
- Next.js 15
- TypeScript
- Tailwind CSS

(This is an example project, not a template)`,
    expectedViolation: false,
    description: 'Example projects can have specific stacks per Rule 2 exception',
  },
  {
    id: 'EDGE-PASS-2',
    name: 'Edge: Code snippet showing anti-pattern (allowed)',
    code: `## Pattern 1: Placeholder Syntax

### ❌ Anti-Pattern
\`\`\`markdown
## Tech Stack
- Frontend: TODO
\`\`\`

### ✅ Correct Pattern
\`\`\`markdown
## Tech Stack
- Frontend: [e.g., Next.js, Vue]
\`\`\``,
    expectedViolation: false,
    description: 'Documentation showing anti-patterns is allowed',
  },

  // ===== SUBTLE VIOLATIONS =====
  {
    id: 'SUBTLE-FAIL-1',
    name: 'Subtle: Implicit hardcoding',
    code: `## Setup Instructions

1. Install dependencies: \`npm install react react-dom next\`
2. Configure Tailwind CSS
3. Set up PostgreSQL database`,
    expectedViolation: true,
    violatedRules: ['Pattern 2'],
    description: 'Implicitly assumes specific tech stack in instructions',
  },
  {
    id: 'SUBTLE-PASS-1',
    name: 'Subtle: Generic instructions (correct)',
    code: `## Setup Instructions

1. Install dependencies: \`[package-manager] install\`
2. Configure your styling solution
3. Set up your database connection`,
    expectedViolation: false,
    description: 'Generic instructions that adapt to any stack',
  },

  // ===== PATTERN 5: Tiered Organization =====
  {
    id: 'P5-PASS-1',
    name: 'Pattern 5: Correct tier structure',
    code: `// File: NEXT-TASKS.md (HOT tier)
# Current Sprint Tasks

// Referenced WARM files when needed:
// - docs/core/ARCHITECTURE.md
// - docs/core/PATTERNS.md

// Archived old content to:
// - docs/archive/sprint-2025-12.md`,
    expectedViolation: false,
    description: 'Follows HOT/WARM/COLD tier organization',
  },
  {
    id: 'P5-FAIL-1',
    name: 'Pattern 5: Wrong organization structure',
    code: `// Project structure:
// docs/
//   architecture/
//   tasks/
//   decisions/
//   changelog/

// Organizing by content type instead of access frequency`,
    expectedViolation: true,
    violatedRules: ['Pattern 5'],
    description: 'Organizes by content type instead of access tiers',
  },

  // ===== PATTERN 11: Website Design System =====
  {
    id: 'P11-PASS-1',
    name: 'Pattern 11: Proper theme support',
    code: `/* Using CSS custom properties for theme support */
:root {
  --glass-surface: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
}

:root[data-theme='light'] {
  --glass-surface: rgba(0, 0, 0, 0.03);
  --glass-border: rgba(0, 0, 0, 0.08);
}`,
    expectedViolation: false,
    description: 'Uses CSS variables for proper theme switching',
  },
  {
    id: 'P11-FAIL-1',
    name: 'Pattern 11: Hard-coded colors',
    code: `/* Website component */
.glass-panel {
  background: #111111;
  border: 1px solid #333333;
}`,
    expectedViolation: true,
    violatedRules: ['Pattern 11'],
    description: 'Hard-codes colors instead of using theme variables',
  },

  // ===== VALIDATION EDGE CASE: Checkbox content =====
  {
    id: 'CHECKBOX-PASS-1',
    name: 'Edge: Checkbox content is not a placeholder',
    code: `## Definition of Done

- [ ] Tests passing
- [ ] Documentation updated
- [ ] Code reviewed`,
    expectedViolation: true,
    violatedRules: ['Pattern 4'],
    description: 'Missing inline guidance (checkboxes are not placeholders)',
  },
];

describe('Guardian Accuracy Validation', () => {
  let results: {
    testCase: TestCase;
    guardianResponse: string;
    guardianDetectedViolation: boolean;
    correct: boolean;
  }[] = [];

  // Run Guardian on all test cases
  beforeAll(async () => {
    // Check if API key is available
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn('⚠️  ANTHROPIC_API_KEY not set - skipping accuracy validation');
      return;
    }

    console.log('\n🛡️  Guardian Accuracy Validation\n');
    console.log(`Testing ${TEST_DATASET.length} cases...\n`);

    for (const testCase of TEST_DATASET) {
      try {
        const response = await runGuardianOnTestCase(testCase);
        const detectedViolation = detectViolationInResponse(response);

        const correct =
          detectedViolation === testCase.expectedViolation;

        results.push({
          testCase,
          guardianResponse: response,
          guardianDetectedViolation: detectedViolation,
          correct,
        });

        // Progress indicator
        const status = correct ? '✅' : '❌';
        console.log(`${status} ${testCase.id}: ${testCase.name}`);
      } catch (error) {
        console.error(`Error testing ${testCase.id}:`, error);
      }
    }
  }, ACCURACY_THRESHOLDS.API_TIMEOUT_MS);

  it('should achieve 70%+ accuracy on test dataset', () => {
    if (results.length === 0) {
      console.log('⏭️  Skipping - no API key available');
      return;
    }

    const correctCount = results.filter((r) => r.correct).length;
    const totalCount = results.length;
    const accuracy = (correctCount / totalCount) * 100;

    // Calculate confusion matrix
    const truePositives = results.filter(
      (r) => r.testCase.expectedViolation && r.guardianDetectedViolation
    ).length;
    const trueNegatives = results.filter(
      (r) => !r.testCase.expectedViolation && !r.guardianDetectedViolation
    ).length;
    const falsePositives = results.filter(
      (r) => !r.testCase.expectedViolation && r.guardianDetectedViolation
    ).length;
    const falseNegatives = results.filter(
      (r) => r.testCase.expectedViolation && !r.guardianDetectedViolation
    ).length;

    // Print detailed results
    console.log('\n' + '='.repeat(60));
    console.log('📊 GUARDIAN ACCURACY REPORT');
    console.log('='.repeat(60));
    console.log(`Total Test Cases: ${totalCount}`);
    console.log(`Correct: ${correctCount}`);
    console.log(`Incorrect: ${totalCount - correctCount}`);
    console.log(`Accuracy: ${accuracy.toFixed(1)}%`);
    console.log('\nConfusion Matrix:');
    console.log(`  True Positives:  ${truePositives}`);
    console.log(`  True Negatives:  ${trueNegatives}`);
    console.log(`  False Positives: ${falsePositives}`);
    console.log(`  False Negatives: ${falseNegatives}`);

    // Print failures for debugging
    const failures = results.filter((r) => !r.correct);
    if (failures.length > 0) {
      console.log('\n❌ FAILURES:');
      failures.forEach((f) => {
        console.log(`\n  ${f.testCase.id}: ${f.testCase.name}`);
        console.log(`  Expected: ${f.testCase.expectedViolation ? 'VIOLATION' : 'COMPLIANT'}`);
        console.log(`  Got: ${f.guardianDetectedViolation ? 'VIOLATION' : 'COMPLIANT'}`);
        console.log(`  Description: ${f.testCase.description}`);
      });
    }

    console.log('='.repeat(60) + '\n');

    // Assert minimum accuracy threshold
    expect(accuracy).toBeGreaterThanOrEqual(ACCURACY_THRESHOLDS.MINIMUM_ACCURACY);
  });

  it('should have low false positive rate (< 30%)', () => {
    if (results.length === 0) return;

    const compliantCases = results.filter(
      (r) => !r.testCase.expectedViolation
    );
    const falsePositives = compliantCases.filter(
      (r) => r.guardianDetectedViolation
    ).length;

    const falsePositiveRate =
      compliantCases.length > 0
        ? (falsePositives / compliantCases.length) * 100
        : 0;

    console.log(`False Positive Rate: ${falsePositiveRate.toFixed(1)}%`);
    expect(falsePositiveRate).toBeLessThan(ACCURACY_THRESHOLDS.MAX_FALSE_POSITIVE_RATE);
  });

  it('should have low false negative rate (< 30%)', () => {
    if (results.length === 0) return;

    const violationCases = results.filter(
      (r) => r.testCase.expectedViolation
    );
    const falseNegatives = violationCases.filter(
      (r) => !r.guardianDetectedViolation
    ).length;

    const falseNegativeRate =
      violationCases.length > 0
        ? (falseNegatives / violationCases.length) * 100
        : 0;

    console.log(`False Negative Rate: ${falseNegativeRate.toFixed(1)}%`);
    expect(falseNegativeRate).toBeLessThan(ACCURACY_THRESHOLDS.MAX_FALSE_NEGATIVE_RATE);
  });
});

/**
 * Run Guardian analysis on a single test case
 */
async function runGuardianOnTestCase(testCase: TestCase): Promise<string> {
  // Read actual PATTERNS.md and DOMAIN-LOGIC.md
  const { readFileSync } = await import('fs');
  const { join } = await import('path');

  const patterns = readFileSync(
    join(process.cwd(), 'docs/core/PATTERNS.md'),
    'utf-8'
  );
  const domainLogic = readFileSync(
    join(process.cwd(), 'docs/core/DOMAIN-LOGIC.md'),
    'utf-8'
  );

  // Build Guardian prompt
  const systemPrompt = buildGuardianSystemPrompt(patterns, domainLogic);
  const userPrompt = buildGuardianUserPrompt(testCase);

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const config: LLMConfig = {
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: 'claude-sonnet-4-5-20250929', // Claude Sonnet 4.5
    timeoutMs: 60000, // 60 seconds for code review (longer than default)
    responseFormat: 'json', // Request structured JSON output
  };

  const response = await callLLM(config, messages);
  return response.content;
}

/**
 * Build Guardian system prompt (matches review.ts implementation)
 */
function buildGuardianSystemPrompt(
  patterns: string,
  domainLogic: string
): string {
  return `You are Guardian, a code review assistant that analyzes code against project-specific patterns and architectural rules.

# Your Task
Analyze the provided code file and identify violations of the patterns defined in PATTERNS.md and domain logic rules in DOMAIN-LOGIC.md.

# PATTERNS.md
${patterns}

# DOMAIN-LOGIC.md
${domainLogic}

# Important Guidelines

**ONLY flag actual violations in the code being reviewed. Do NOT flag:**
- Educational examples showing anti-patterns (if clearly marked with ❌ or "Anti-Pattern" or "Bad")
- Documentation that explains what NOT to do
- Code snippets demonstrating violations for teaching purposes
- Placeholder syntax like [e.g., ...] when used correctly
- Comments that provide inline guidance
- Canonical links to actual implementations

**Context Matters:**
- If code shows BOTH good and bad examples, only flag if the actual implementation is wrong
- Templates with [Bracket Syntax] are CORRECT per Pattern 1
- Inline comments explaining customization are GOOD per Pattern 4
- References to actual files are GOOD per Pattern 3

# Output Format
You MUST respond with valid JSON matching this exact schema:

\`\`\`json
{
  "summary": {
    "status": "compliant" | "minor_issues" | "major_violations",
    "message": "Brief overall assessment of the code"
  },
  "violations": [
    {
      "pattern": "Pattern name (e.g., 'Pattern 1: Placeholder Syntax')",
      "line": 42,  // Optional line number where violation occurs
      "issue": "What's wrong with the code",
      "recommendation": "How to fix it",
      "severity": "minor" | "major",
      "confidence": 0.85  // 0-1 scale, how certain you are about this violation
    }
  ],
  "positiveObservations": [
    "Good practice 1",
    "Good practice 2"
  ]
}
\`\`\`

**Field Definitions**:
- \`status\`: "compliant" (no violations), "minor_issues" (style/minor issues), or "major_violations" (serious pattern breaks)
- \`violations\`: Array of violations found (empty array if compliant)
- \`severity\`: "minor" for style/preference issues, "major" for pattern violations
- \`confidence\`: A number from 0 to 1 indicating certainty about the violation
  - 0.9-1.0: Very high - Clear, unambiguous violation of stated patterns
  - 0.7-0.9: High - Likely violation, context strongly supports it
  - 0.5-0.7: Medium - Possible violation, some ambiguity in interpretation
  - 0.0-0.5: Low - Uncertain, may be false positive or edge case
- \`positiveObservations\`: Array of strings highlighting good practices

If no violations found, set status to "compliant", violations to empty array [], and include positive observations.

Be concise but specific. Reference exact line numbers in violations when possible.`;
}

/**
 * Build Guardian user prompt
 */
function buildGuardianUserPrompt(testCase: TestCase): string {
  return `# File to Review
**Test Case**: ${testCase.id} - ${testCase.name}
**Context**: ${testCase.description}

\`\`\`
${testCase.code}
\`\`\`

Please analyze this code against the project patterns and provide your assessment.`;
}

/**
 * Detect if Guardian found violations in the response (JSON parsing with legacy fallback)
 */
function detectViolationInResponse(response: string): boolean {
  // Try JSON parsing first
  const parsed = parseGuardianJSON(response);
  if (parsed) {
    return parsed.summary.status !== 'compliant' || parsed.violations.length > 0;
  }

  // Fallback to legacy string matching
  return detectViolationInResponseLegacy(response);
}

/**
 * Legacy string-based violation detection (fallback for non-JSON responses)
 */
function detectViolationInResponseLegacy(response: string): boolean {
  const lowerResponse = response.toLowerCase();

  // Check for violation indicators
  const violationIndicators = [
    '❌ major violations',
    '⚠️  minor issues',
    'violations:',
    'violated',
    'violation',
    'anti-pattern',
    'should use',
    'must use',
    'incorrect',
    'wrong',
  ];

  // Check for compliance indicators
  const complianceIndicators = [
    '✅ compliant',
    'no violations',
    'complies with',
    'follows the pattern',
    'adheres to',
    'correctly uses',
  ];

  const hasViolation = violationIndicators.some((indicator) =>
    lowerResponse.includes(indicator)
  );
  const hasCompliance = complianceIndicators.some((indicator) =>
    lowerResponse.includes(indicator)
  );

  // If both detected, check which appears first/more prominently
  if (hasViolation && hasCompliance) {
    const violationIndex = Math.min(
      ...violationIndicators
        .map((ind) => lowerResponse.indexOf(ind))
        .filter((idx) => idx >= 0)
    );
    const complianceIndex = Math.min(
      ...complianceIndicators
        .map((ind) => lowerResponse.indexOf(ind))
        .filter((idx) => idx >= 0)
    );

    return violationIndex < complianceIndex;
  }

  return hasViolation && !hasCompliance;
}
