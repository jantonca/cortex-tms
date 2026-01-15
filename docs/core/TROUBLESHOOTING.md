# Troubleshooting: Cortex TMS Development

<!-- This file documents issues specific to developing Cortex TMS itself. -->
<!-- For general framework gotchas, see the template file in templates/docs/core/TROUBLESHOOTING.md -->

---

## 🎯 Purpose

This file helps developers working on Cortex TMS avoid common pitfalls when:
- Developing the CLI tool
- Creating/updating templates
- Testing with AI agents
- Contributing to the project

---

## 🔴 Critical Issues

### [Issue: Template Files Must Not Have Trailing Newlines]

**Symptom**: Git diffs show unnecessary changes in template files

**Cause**: Different editors handle trailing newlines differently

**Solution**:
```bash
# Configure .editorconfig (already in repo)
[*.md]
insert_final_newline = false
trim_trailing_whitespace = true
```

**AI Agent Note**: When creating template files, ensure no trailing newline after final content.

---

### [Issue: Placeholders Must Use Exact Bracket Syntax]

**Symptom**: CLI tool doesn't detect placeholders for replacement

**Cause**: Using incorrect syntax like `<placeholder>` or `{{placeholder}}`

**Solution**:
```markdown
# ❌ Bad: Wrong syntax
<Project Name>
{{Project Name}}
TODO: Add project name

# ✅ Good: Correct syntax
[Project Name]
[e.g., My Awesome App]
```

**AI Agent Note**: All placeholders MUST use `[Description]` format. See `PATTERNS.md#pattern-1-placeholder-syntax`.

**Reference**: `docs/core/PATTERNS.md#pattern-1-placeholder-syntax`

---

## 🟡 Common Errors

### [Issue: Template Changes Not Appearing in Test Projects]

**Symptom**: Modified a template but changes don't show up when copying to test project

**Cause**: Forgot to save file or cached version being used

**Solution**:
```bash
# Always verify file was saved
cat templates/NEXT-TASKS.md

# If using a test script, clear any caches
rm -rf /tmp/cortex-test && mkdir /tmp/cortex-test
```

**AI Agent Note**: After modifying templates, verify changes were saved before testing.

---

### [Issue: pnpm install Fails After Cloning]

**Symptom**:
```
ERR_PNPM_NO_LOCKFILE
```

**Cause**: `pnpm-lock.yaml` not in repository (or git not initialized)

**Solution**:
```bash
# If no lockfile exists, create one
pnpm install

# Commit the lockfile
git add pnpm-lock.yaml
git commit -m "Add pnpm lockfile"
```

**AI Agent Note**: Cortex TMS requires `pnpm`. Never suggest `npm install` or `yarn install`.

---

### [Issue: TypeScript Errors in CLI Code (Future)]

**Symptom**:
```
error TS2307: Cannot find module './types'
```

**Cause**: TypeScript compilation hasn't run yet

**Solution**:
```bash
# Build TypeScript files
pnpm run build

# Or run in watch mode during development
pnpm run dev
```

**AI Agent Note**: CLI tool is written in TypeScript but distributed as JavaScript. Always build before testing.

---

## 🟢 Framework Gotchas

### [Gotcha: Templates vs Cortex Docs Are Different]

**Behavior**: There are two sets of docs:
- `templates/docs/core/` → Templates for user projects (generic)
- `docs/core/` → Documentation for Cortex itself (specific)

**Why This Matters**:
- Changes to `docs/core/PATTERNS.md` document how Cortex works
- Changes to `templates/docs/core/PATTERNS.md` affect what users copy to their projects

**AI Agent Note**: When asked to "update PATTERNS.md", clarify which one:
- Cortex's patterns? → `docs/core/PATTERNS.md`
- Template for users? → `templates/docs/core/PATTERNS.md`

---

### [Gotcha: File Size Limits Apply to Cortex's Own HOT Files]

**Behavior**: Cortex enforces line limits on its own documentation

| File | Max Lines | Current |
|:-----|:----------|:--------|
| `NEXT-TASKS.md` | 200 | ~50 |
| `.github/copilot-instructions.md` | 100 | ~55 |
| `docs/core/PATTERNS.md` | 500 | ~350 |

**Why This Matters**: If `NEXT-TASKS.md` grows beyond 200 lines, archive completed sprints to `docs/archive/sprint-YYYY-MM.md`

**AI Agent Note**: Before adding to `NEXT-TASKS.md`, check current line count with `wc -l NEXT-TASKS.md`.

**Reference**: `docs/core/DOMAIN-LOGIC.md#rule-4-context-budget-enforcement`

---

### [Gotcha: Dogfooding Means We Use TMS Rules]

**Behavior**: Cortex TMS uses its own system to develop itself

**Implications**:
- Must follow `DOMAIN-LOGIC.md` rules
- Must use placeholders in templates
- Must archive aggressively
- Must test changes with AI agents

**Why This Matters**: If Cortex violates its own rules, users won't trust the system

**AI Agent Note**: Before implementing a feature, verify it follows `docs/core/DOMAIN-LOGIC.md`.

---

## 🛠️ Development Environment Issues

### [Issue: FN (Fast Node Manager) Not Recognized]

**Platform**: macOS, Linux

**Symptom**:
```
command not found: fn
```

**Cause**: FN not installed or not in PATH

**Solution**:
```bash
# Install FN (if not already)
# See: https://github.com/Schniz/fnm

# Use installed Node version
fn use

# Verify
node --version
```

**AI Agent Note**: Project uses FN for Node.js version management. Never suggest `nvm` or system Node.js.

---

### [Issue: Git Pre-commit Hook Fails]

**Symptom**:
```
File exceeds size limit: NEXT-TASKS.md (215 lines, max 200)
```

**Cause**: HOT file exceeded size limit

**Solution**:
```bash
# Archive old tasks
mv completed-tasks.md docs/archive/sprint-2026-01.md

# Reduce NEXT-TASKS.md to current sprint only
# Edit manually to remove completed tasks
```

**AI Agent Note**: Size limits are enforced via git hooks (future). Never suggest bypassing them.

---

## 🐛 AI Agent Common Mistakes

### [Mistake: Hardcoding Tech Stacks in Templates]

**Example**:
```markdown
# ❌ Bad: Hardcoded in template
## Tech Stack
- Next.js 15
- TypeScript
- Tailwind CSS

# ✅ Good: Using placeholders
## Tech Stack
- [Frontend Framework: e.g., Next.js 15, Vue 3, Svelte]
- [Type System: e.g., TypeScript, PropTypes, None]
- [Styling: e.g., Tailwind CSS, CSS Modules]
```

**Prevention**: Before modifying `templates/`, review `DOMAIN-LOGIC.md#rule-2-templates-must-be-framework-agnostic`.

**Reference**: `docs/core/DOMAIN-LOGIC.md#rule-2`

---

### [Mistake: Adding Meta-Documentation to Templates]

**Example**:
```markdown
# ❌ Bad: Explaining TMS in template
# NEXT-TASKS.md

This file is part of the Tiered Memory System...
[200 lines of explanation]

# ✅ Good: Clean template
# NEXT: Upcoming Tasks

## Active Sprint: [Feature Name]
```

**Prevention**: Meta-documentation belongs in `docs/`, not `templates/`.

**Reference**: `docs/core/DOMAIN-LOGIC.md#rule-7-no-meta-documentation-in-templates`

---

### [Mistake: Using npm Instead of pnpm]

**Example**:
```bash
# ❌ Wrong package manager
npm install

# ✅ Correct
pnpm install
```

**Prevention**: Check `.github/copilot-instructions.md` which explicitly states "ALWAYS use pnpm".

**Reference**: `.github/copilot-instructions.md:8`

---

## 📚 Reference Checklist (For AI Agents)

Before contributing to Cortex TMS:

- [ ] Read `NEXT-TASKS.md` to see current sprint
- [ ] Verify changes follow `docs/core/DOMAIN-LOGIC.md` rules
- [ ] Check `docs/core/PATTERNS.md` for template patterns
- [ ] Use `pnpm` (not npm or yarn)
- [ ] Test templates by copying to a sample project
- [ ] Verify HOT files are under size limits
- [ ] No hardcoded tech stacks in `templates/`
- [ ] No meta-documentation in `templates/`

---

## 🔗 Related Documentation

- **Domain Logic**: See `DOMAIN-LOGIC.md` for TMS rules
- **Patterns**: See `PATTERNS.md` for template patterns
- **Architecture**: See `ARCHITECTURE.md` for system design
- **Schema**: See `SCHEMA.md` for CLI types and file structure

---

## 📝 How to Document a New Issue

When you encounter a new issue while developing Cortex:

1. **Reproduce**: Ensure the issue is reproducible
2. **Document**: Add entry to this file using the template below
3. **Test**: Verify the solution works
4. **Commit**: Include in a PR with context

**Template**:
```markdown
### [Issue: Brief Description]

**Symptom**: [What you see]
**Cause**: [Why it happens]
**Solution**: [How to fix it]
**AI Agent Note**: [What to check before generating this code]
**Reference**: [Link to related docs, if any]
```

---

## Testing Notes

### Validating Templates

**Process**:
1. Create test directory: `mkdir /tmp/cortex-test`
2. Copy template: `cp templates/NEXT-TASKS.md /tmp/cortex-test/`
3. Ask AI agent to use it: "Read NEXT-TASKS.md and plan a feature"
4. Observe: Did AI understand? Did it follow the structure?
5. Refine template based on observations

**AI Agent Note**: All templates should be validated this way before merging.

**Reference**: `docs/core/DOMAIN-LOGIC.md#rule-9-test-templates-with-ai-agents`

<!-- @cortex-tms-version 2.5.0 -->
