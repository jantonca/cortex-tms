# Implementation Patterns (Cortex TMS)

This document describes the patterns used when designing and maintaining Cortex TMS templates.

## 🔍 Quick Reference

| Need | Pattern | Line |
|:-----|:--------|:-----|
| Template placeholders | Pattern 1: Placeholder Syntax | 7 |
| Multi-framework support | Pattern 2: Framework-Agnostic | 44 |
| Reference real code | Pattern 3: Canonical Links | 78 |
| Template guidance | Pattern 4: Inline Documentation | 111 |
| File organization | Pattern 5: Tiered Organization | 144 |
| File size limits | Pattern 6: Size Limits on HOT Files | 186 |
| CLI customization | Pattern 7: Modular Selection | 221 |
| Clean templates | Pattern 8: No Meta-Documentation | 250 |
| When to archive | Pattern 9: Archive Trigger Events | 283 |
| Testing templates | Pattern 10: Validation with AI Agents | 313 |
| Error handling | Pattern 12: Centralized Error Handling | 367 |
| Input validation | Pattern 13: Zod Input Validation | 460 |

---

## Pattern 1: Placeholder Syntax

**Rule**: All user-customizable content in templates uses `[Description]` syntax with optional examples.

### ✅ Canonical Examples

**Location**: `templates/NEXT-TASKS.md:3`

```markdown
## Active Sprint: [Feature Name]

**Why this matters**: [Briefly describe user value or technical necessity]
```

**Location**: `templates/.github/copilot-instructions.md:5`

```markdown
- **Tech Stack**: [e.g., Next.js 15, TypeScript Strict, Tailwind CSS]
```

### ❌ Anti-Pattern (What NOT to do)

```markdown
<!-- Bad: Using TODO or FIXME -->
## Active Sprint: TODO

<!-- Bad: Using <placeholder> XML tags -->
## Active Sprint: <insert feature name here>

<!-- Bad: Empty with no guidance -->
## Active Sprint:
```

**Why it fails**: AI agents don't reliably detect `TODO` as a placeholder. The `[Bracket Syntax]` is explicit and easily parseable.

---

## Pattern 2: Framework-Agnostic Templates

**Rule**: Templates in `templates/` must work for any tech stack. Provide examples, not requirements.

### ✅ Canonical Example

**Location**: `templates/docs/core/ARCHITECTURE.md` (when completed)

```markdown
## Tech Stack

- **Frontend**: [e.g., Next.js 15, Vue 3, Svelte]
- **Backend**: [e.g., Express, Fastify, NestJS]
- **Database**: [e.g., PostgreSQL, MongoDB, Redis]
```

### ❌ Anti-Pattern

```markdown
<!-- Bad: Hardcoding a tech stack -->
## Tech Stack

- Next.js 15
- React 18
- Tailwind CSS
- PostgreSQL
```

**Why it fails**: Users may use Vue, Svelte, or build a CLI tool with no frontend. Templates must be adaptable.

**Exception**: Example projects (`examples/todo-app/`) can use specific tech stacks.

---

## Pattern 3: Canonical Links Over Code Duplication

**Rule**: When documenting a pattern, reference the real implementation instead of duplicating code.

### ✅ Canonical Example

**Location**: `docs/core/PATTERNS.md` (this file, meta-example)

```markdown
## Pattern 1: Placeholder Syntax

**Location**: `templates/NEXT-TASKS.md:3`

[Brief code snippet showing the pattern in context]
```

### ❌ Anti-Pattern

```markdown
<!-- Bad: Copying entire files into docs -->
## NEXT-TASKS.md Structure

Here's the complete file:
[200 lines of duplicated content]
```

**Why it fails**: Duplication causes drift. When templates update, docs become stale.

**References**:
- **Domain Logic**: `DOMAIN-LOGIC.md#rule-8-canonical-links-over-duplication`

---

## Pattern 4: Inline Documentation in Templates

**Rule**: Templates should include brief inline comments explaining what users should customize.

### ✅ Canonical Example

**Location**: `templates/NEXT-TASKS.md`

```markdown
## 🎯 Definition of Done

<!-- Customize this checklist based on your project's quality standards -->
- [ ] Tests passing
- [ ] Documentation updated in `docs/core/`
- [ ] Code follows `docs/core/PATTERNS.md`
```

### ❌ Anti-Pattern

```markdown
<!-- Bad: No guidance -->
## 🎯 Definition of Done

- [ ] Tests passing
- [ ] Documentation updated
```

**Why it fails**: Users don't know what to customize or why. Inline comments provide just-in-time guidance.

**Balance**: Don't over-comment. Keep it concise (1 line per section max).

---

## Pattern 5: Tiered File Organization

**Rule**: Files are organized by access frequency (HOT/WARM/COLD), not by content type.

### ✅ Canonical Example

**Location**: Root directory structure

```
.
├── NEXT-TASKS.md          # HOT
├── CLAUDE.md              # HOT
├── .github/
│   └── copilot-instructions.md  # HOT
├── docs/
│   ├── core/              # WARM
│   │   ├── ARCHITECTURE.md
│   │   └── PATTERNS.md
│   └── archive/           # COLD
│       └── v1.0-CHANGELOG.md
```

### ❌ Anti-Pattern

```
<!-- Bad: Organizing by content type -->
.
├── docs/
│   ├── architecture/
│   ├── tasks/
│   ├── decisions/
│   └── changelog/
```

**Why it fails**: AI agents don't know which docs to prioritize. The tier structure makes it explicit.

**References**:
- **Domain Logic**: `DOMAIN-LOGIC.md#rule-1-the-tier-hierarchy-is-sacred`
- **Architecture**: `ARCHITECTURE.md#the-tiered-memory-system`

---

## Pattern 6: Size Limits on HOT Files

**Rule**: HOT files have strict line limits to preserve AI agent context budget.

### ✅ Canonical Example

**Enforcement**: See `DOMAIN-LOGIC.md#rule-4-context-budget-enforcement`

| File | Max Lines |
|:-----|:----------|
| `NEXT-TASKS.md` | 200 |
| `.github/copilot-instructions.md` | 100 |

**When violated**: Move content to `FUTURE-ENHANCEMENTS.md` (backlog) or `docs/archive/` (history).

### ❌ Anti-Pattern

```markdown
<!-- Bad: Putting 6 months of tasks in NEXT-TASKS.md -->
# NEXT: Upcoming Tasks

## Q1 2026 Tasks
[100 lines]

## Q2 2026 Tasks
[100 lines]

## Q3 2026 Tasks
[100 lines]
```

**Why it fails**: AI agent reads all of this at the start of every session, wasting context on tasks that won't be worked on for months.

---

## Pattern 7: Modular Template Selection

**Rule**: The CLI should allow users to select which templates they need, not force all of them.

### ✅ Canonical Example

**Future CLI behavior**:

```
? Which core docs do you need?
  ◉ ARCHITECTURE.md (Recommended)
  ◉ PATTERNS.md (Recommended)
  ◉ DOMAIN-LOGIC.md (Recommended)
  ◯ SCHEMA.md (For data-heavy apps)
  ◯ TROUBLESHOOTING.md (For framework gotchas)
```

### ❌ Anti-Pattern

```bash
# Bad: Copying all templates regardless of project needs
cortex-tms init
# -> Creates all 10 files even for a simple CLI tool
```

**Why it fails**: A CLI tool doesn't need `SCHEMA.md`. An API service might not need `TROUBLESHOOTING.md`. Flexibility is key.

---

## Pattern 8: No Meta-Documentation in Templates

**Rule**: Templates should not explain TMS concepts. They should just be ready to use.

### ✅ Canonical Example

**Location**: `templates/NEXT-TASKS.md`

```markdown
# NEXT: Upcoming Tasks

## Active Sprint: [Feature Name]
```

**Clean and ready to customize.**

### ❌ Anti-Pattern

```markdown
<!-- Bad: Explaining TMS in the template -->
# NEXT: Upcoming Tasks

This file is part of the Tiered Memory System (TMS).
It represents the HOT tier, meaning AI agents will
read this at the start of every session...

## Active Sprint: [Feature Name]
```

**Why it fails**: Users copy templates into their projects. Meta-explanations create noise. TMS concepts belong in `docs/`, not `templates/`.

---

## Pattern 9: Archive Trigger Events

**Rule**: Define clear triggers for moving content from HOT → COLD.

### ✅ Canonical Example

**Location**: `docs/core/DOMAIN-LOGIC.md#rule-6-archive-aggressively`

**Trigger Events**:
- Sprint completes → Move tasks to `docs/archive/sprint-2026-01.md`
- Version ships → Move changelog to `docs/archive/v1.0-CHANGELOG.md`
- Pattern deprecated → Move to `docs/archive/deprecated-patterns.md`

### ❌ Anti-Pattern

```markdown
<!-- Bad: Keeping completed tasks in NEXT-TASKS.md -->
## Completed Tasks (Jan 2026)
- [x] Task 1
- [x] Task 2
[50 lines of old completed tasks]

## Completed Tasks (Dec 2025)
[100 lines of old completed tasks]
```

**Why it fails**: Completed tasks are COLD context. They waste AI agent's context budget.

---

## Pattern 10: Validation with AI Agents

**Rule**: Before shipping a template, test it with Claude Code, Copilot, or Cursor.

### ✅ Validation Process

1. Copy template into a sample project
2. Start an AI coding session
3. Ask AI to implement a feature using the template
4. Observe AI behavior:
   - Did it find the right docs?
   - Did it hallucinate?
   - Did it ask for clarification?
5. Refine template based on observations

**Example Test**:
```
User: "Add a new authentication feature. Follow the patterns in docs/core/PATTERNS.md."

AI Agent: [reads PATTERNS.md, finds auth pattern, implements correctly]
✅ Template works

AI Agent: [can't find pattern, implements incorrectly]
❌ Template needs improvement
```

### ❌ Anti-Pattern

```markdown
<!-- Bad: Shipping templates without testing -->
# I think this template looks good, let's ship it!
```

**Why it fails**: Templates that work in theory may confuse AI agents in practice. Real-world testing is mandatory.

**References**:
- **Domain Logic**: `DOMAIN-LOGIC.md#rule-9-test-templates-with-ai-agents`

---

## Pattern 12: Centralized Error Handling

**Rule**: CLI commands throw errors instead of calling `process.exit()`. Only the CLI entry point handles process termination.

**See also**: Pattern 13 for input validation that complements error handling.

### ✅ Canonical Example

**Location**: `src/commands/auto-tier.ts:55-76`

```typescript
import { ValidationError, GitError } from '../utils/errors.js';

// Validate input - throw errors instead of process.exit()
if (isNaN(hotDays) || hotDays < 0) {
  throw new ValidationError('--hot must be a positive number');
}

if (hotDays > warmDays) {
  throw new ValidationError('--hot threshold must be ≤ --warm threshold', {
    hot: hotDays,
    warm: warmDays,
  });
}

// Check for git repo
if (!isGitRepo(cwd)) {
  throw new GitError('Not a git repository. Run this command in a git-initialized project.');
}
```

**Location**: `src/cli.ts:71-95` (centralized error handler)

```typescript
try {
  await program.parseAsync(process.argv);
} catch (error) {
  if (error instanceof CLIError) {
    console.error(chalk.red('\n❌ Error:'), formatError(error));
    process.exit(error.exitCode);
  }
  // ... handle other errors
}
```

### ✅ Error Classes

**Location**: `src/utils/errors.ts`

- **CLIError**: Base class for all CLI errors
- **ValidationError**: Invalid user input (args, options, file contents)
- **GitError**: Git-related errors (not a repo, command failed)
- **ConfigError**: Configuration issues (.cortexrc, missing files)
- **FileSystemError**: File operations (not found, permission denied)

### ❌ Anti-Pattern

```typescript
// Bad: Calling process.exit() in command files
if (isNaN(hotDays)) {
  console.log(chalk.red('❌ Error: --hot must be a number'));
  process.exit(1);  // ❌ Don't do this in commands
}

// Bad: Logging errors without throwing
if (!isGitRepo(cwd)) {
  console.error('Not a git repository');
  return;  // ❌ Silently fails, no exit code
}
```

**Why it fails**:
- Makes testing difficult (can't catch process.exit)
- Inconsistent error formatting across commands
- Can't distinguish error types programmatically
- Harder to refactor commands into library functions

### ✅ Benefits

- **Testable**: Errors can be caught and asserted in tests
- **Consistent**: All errors formatted the same way
- **Contextual**: Errors can include additional data (e.g., invalid values)
- **Type-safe**: Different error classes for different scenarios
- **Flexible**: Easy to add retry logic or error recovery

**References**:
- **Error Classes**: `src/utils/errors.ts`
- **CLI Entry Point**: `src/cli.ts:71-95`
- **Example Command**: `src/commands/auto-tier.ts`
- **Tests**: `src/__tests__/errors.test.ts`

---

## Pattern 13: Zod Input Validation

**Rule**: All CLI command options are validated using Zod schemas at command entry points. Invalid inputs throw ValidationError with clear, actionable error messages.

### ✅ Canonical Example

**Location**: `src/utils/validation.ts`

```typescript
import { z } from 'zod';
import { ValidationError } from './errors.js';

// Define schema with validation rules
export const autoTierOptionsSchema = z
  .object({
    hot: z.string().transform((val, ctx) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '--hot must be a positive number',
        });
        return z.NEVER;
      }
      return num;
    }),
    warm: z.string().transform((val, ctx) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '--warm must be a positive number',
        });
        return z.NEVER;
      }
      return num;
    }),
    // ... more fields
  })
  .refine((data) => data.hot <= data.warm, {
    message: '--hot threshold must be ≤ --warm threshold',
    path: ['hot'],
  });

// Helper function for consistent validation
export function validateOptions<T extends z.ZodType>(
  schema: T,
  options: unknown,
  commandName: string
): z.infer<T> {
  try {
    return schema.parse(options);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = (error.errors || []).map((err) => {
        const path = err.path && err.path.length > 0 ? `--${err.path.join('.')}` : 'options';
        return `${path}: ${err.message}`;
      });

      throw new ValidationError(
        `Invalid ${commandName} command options${messages.length > 0 ? ':\n  ' + messages.join('\n  ') : ''}`,
        {
          command: commandName,
          errors: messages,
        }
      );
    }
    throw error;
  }
}
```

**Location**: `src/commands/auto-tier.ts`

```typescript
import { autoTierOptionsSchema, validateOptions } from '../utils/validation.js';

async function runAutoTier(options: AutoTierOptions): Promise<void> {
  // Validate at entry point
  const validated = validateOptions(autoTierOptionsSchema, options, 'auto-tier');

  // Use validated (and transformed) values
  const hotDays = validated.hot;  // Now a number, not string
  const warmDays = validated.warm;
  const coldDays = validated.cold;

  // Continue with validated inputs...
}
```

### ✅ Security: Path Validation

**Location**: `src/utils/validation.ts:242-272`

```typescript
// Prevent path traversal attacks
export function validateSafePath(
  filePath: string,
  baseDir: string
): { isValid: boolean; resolvedPath?: string; error?: string } {
  // Normalize base directory to absolute path
  const normalizedBase = resolve(baseDir);

  // Resolve file path against base directory
  const resolvedPath = resolve(baseDir, filePath);

  // Check if resolved path is within base directory
  // Either equal to base, or starts with base + path separator
  const isWithinBase =
    resolvedPath === normalizedBase ||
    resolvedPath.startsWith(normalizedBase + sep);

  if (!isWithinBase) {
    return {
      isValid: false,
      error: `Path traversal detected: ${filePath} resolves outside allowed directory`,
    };
  }

  return { isValid: true, resolvedPath };
}
```

### ❌ Anti-Pattern

```typescript
// Bad: Manual validation without type safety
async function runAutoTier(options: AutoTierOptions): Promise<void> {
  const hotDays = parseInt(String(options.hot), 10);

  if (isNaN(hotDays) || hotDays < 0) {
    throw new ValidationError('--hot must be a positive number');
  }

  // Manual checks repeated for each field...
  // No cross-field validation
  // Error messages inconsistent
}

// Bad: No path traversal protection
const targetPath = resolve(cwd, filePath);
if (!existsSync(targetPath)) {
  throw new Error(`File not found: ${filePath}`);
}
// ❌ Attacker could use ../../etc/passwd
```

**Why it fails**:
- Manual validation is error-prone and repetitive
- No type transformations (string → number)
- Cross-field validation (hot ≤ warm ≤ cold) requires complex logic
- Inconsistent error messages across commands
- Security vulnerabilities (path traversal not checked)

### ✅ Benefits

- **Type Safety**: Validated options have correct TypeScript types
- **Type Transformations**: Automatic string → number conversion
- **Cross-Field Validation**: Complex rules (hot ≤ warm ≤ cold) expressed declaratively
- **Clear Error Messages**: User-friendly validation errors with context
- **Reusable Schemas**: Share validation logic across tests and commands
- **Security**: Built-in path traversal protection
- **Testable**: Schemas can be tested independently

### ✅ Command Coverage

All CLI commands use Zod validation:
- `auto-tier`: Numeric thresholds, cross-field validation
- `init`: Scope enum validation, flag validation
- `validate`: Boolean flags
- `review`: Provider enum, model validation, file path security
- `migrate`: Flag validation with dependencies (--force requires --apply)
- `prompt`: Boolean flags with defaults
- `status`: Model enum validation

**References**:
- **Validation Schemas**: `src/utils/validation.ts`
- **Example Commands**: `src/commands/auto-tier.ts`, `src/commands/review.ts`
- **Tests**: `src/__tests__/validation.test.ts`
- **Security**: Path traversal protection in `validateFilePath()`

---

## 📋 Pattern Summary

| Pattern | When to Use | Reference File |
|:--------|:------------|:---------------|
| Placeholder Syntax | All templates | `templates/*.md` |
| Framework-Agnostic | All templates | `templates/docs/core/*` |
| Canonical Links | All documentation | `docs/core/PATTERNS.md` |
| Inline Documentation | All templates | `templates/*.md` |
| Tiered Organization | File structure | `directory-structure.txt` |
| Size Limits | HOT files | `NEXT-TASKS.md`, copilot-instructions.md |
| Modular Selection | CLI tool | Future: `bin/cortex-tms.js` |
| No Meta-Docs | All templates | `templates/*.md` |
| Archive Triggers | Sprint management | `NEXT-TASKS.md` |
| AI Validation | Before shipping | All templates |
| Website Design System | Website components | `website/src/` |
| Centralized Error Handling | All CLI commands | `src/utils/errors.ts`, `src/cli.ts` |
| Zod Input Validation | All CLI commands | `src/utils/validation.ts` |

**For Git & PM Standards**: See `docs/core/GIT-STANDARDS.md`

---

## Pattern 11: Website Design System

**Rule**: The Cortex TMS website uses a modular liquid glass design system with clear separation between marketing and documentation layouts.

### ✅ Structure

**Location**: `website/src/styles/`, `website/src/components/`, `website/public/`

**Design System Files**:
- **glass-system.css**: Design tokens and base classes (colors, blur, borders, animations)
- **glass-components.css**: Component-specific styles (buttons, cards, panels, quotes)
- **glass-effects.js**: Interactive JavaScript effects (3D tilt, sheen tracking, parallax)
- **Astro Components**: GlassPanel, GlassButton, GlassQuote, BlogPostCard

**Layout Architecture**:
- **SimpleLayout**: For marketing pages (homepage, blog)
  - Structure: `<body>` → `<SimpleHeader>` → `<main>` → `<Footer>`
  - Clean 3-element structure with full-width footer
  - No sidebar, optimized for visual storytelling
- **Starlight Layout**: For documentation pages
  - Preserves Starlight's sidebar and navigation
  - Enhanced with glass effects on header/footer
- **Rule**: Never mix layout systems in the same page type

### ✅ Theme Support Requirements

**All components MUST support light/dark modes**:

```css
/* Use CSS custom properties, not hard-coded colors */
:root {
  --glass-surface: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
}

:root[data-theme='light'] {
  --glass-surface: rgba(0, 0, 0, 0.03);
  --glass-border: rgba(0, 0, 0, 0.08);
}
```

**Checklist Before Committing**:
- [ ] Test component in light mode
- [ ] Test component in dark mode
- [ ] Test component in auto mode (system preference)
- [ ] Verify all text has sufficient contrast
- [ ] Verify glass effects work in both modes

### ✅ Typography Hierarchy

**Font Usage**:
- **Noto Sans**: Body text, UI elements, navigation
- **Noto Serif**: Headings, hero titles, quotes
- **Noto Sans Mono**: Code blocks, technical references

```css
/* Hierarchy */
.hero-title { font-family: 'Noto Serif', serif; }
.body-text { font-family: 'Noto Sans', sans-serif; }
.code-block { font-family: 'Noto Sans Mono', monospace; }
```

### ❌ Anti-Patterns

```astro
<!-- Bad: Hard-coded colors -->
<div style="background: #111111;">

<!-- Bad: Importing from node_modules with relative paths -->
<style>
  @import '../../../node_modules/@astrojs/starlight/style/props.css';
</style>

<!-- Bad: Public assets without is:inline -->
<script src="/glass-effects.js"></script>

<!-- Bad: Mixing layouts -->
<SimpleLayout>
  <StarlightSidebar /> <!-- Don't do this -->
</SimpleLayout>

<!-- Bad: Reusing framework components outside context -->
<SimpleHeader>
  <StarlightHeader /> <!-- Missing required Starlight props -->
</SimpleHeader>
```

**Why they fail**:
- Hard-coded colors break theme switching
- Node_modules imports fail in Astro SSR
- Public scripts get bundled incorrectly without `is:inline`
- Layout mixing creates visual inconsistency
- Framework components need their specific context

### ✅ Component Development Pattern

**When creating new glass components**:

1. **Start with CSS tokens** in `glass-system.css`
2. **Create component styles** in `glass-components.css`
3. **Add interactivity** in `glass-effects.js` (if needed)
4. **Build Astro component** using existing tokens
5. **Test both themes** before committing

**Example**:

```astro
---
// src/components/GlassCard.astro
interface Props {
  variant?: 'default' | 'bordered' | 'elevated';
  tilt?: 'none' | 'subtle' | 'full';
}

const { variant = 'default', tilt = 'subtle' } = Astro.props;
---

<div
  class={`glass-panel glass-${variant}`}
  data-tilt={tilt}
>
  <slot />
</div>

<style>
  /* Use existing tokens, don't create new ones */
  .glass-panel {
    background: var(--glass-surface);
    border: 1px solid var(--glass-border);
  }
</style>
```

**References**:
- **Learning**: `docs/learning/2026-01-21-liquid-glass-design-retrospective.md`

<!-- @cortex-tms-version 3.1.0 -->
