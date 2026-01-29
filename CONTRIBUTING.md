# Contributing to Cortex TMS

Thank you for considering contributing to Cortex TMS! This document provides guidelines to help make the contribution process smooth and effective for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Contribution Guidelines](#contribution-guidelines)
- [Areas Where We Need Help](#areas-where-we-need-help)

---

## Code of Conduct

This project follows a simple code of conduct:
- **Be respectful** - Treat all contributors with respect
- **Be constructive** - Provide helpful feedback
- **Be collaborative** - Work together to improve the project

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Found a bug? Please [open an issue](https://github.com/cortex-tms/cortex-tms/issues/new?template=bug_report.md) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node.js version, Cortex TMS version)

### 💡 Suggesting Features

Have an idea? Please [open a feature request](https://github.com/cortex-tms/cortex-tms/issues/new?template=feature_request.md) with:
- **Use case** - What problem does this solve?
- **Proposed solution** - How should it work?
- **Alternatives considered** - Other approaches you've thought about

**Important**: For significant features, open an issue for discussion **before** starting work. This prevents wasted effort on features that may not align with the project's direction.

### 📝 Improving Documentation

Documentation improvements are always welcome:
- Fix typos or unclear wording
- Add examples or tutorials
- Improve command documentation
- Write blog posts about your TMS workflow

### 🧪 Contributing Code

Code contributions are welcome! Please follow the [Pull Request Process](#pull-request-process) below.

---

## Getting Started

### Prerequisites

- **Node.js**: >=18.0.0 (we recommend Node.js 22 LTS)
- **Package Manager**: npm or pnpm
- **Git**: For version control

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cortex-tms.git
   cd cortex-tms
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Build the CLI**
   ```bash
   npm run build
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

5. **Test CLI Locally**
   ```bash
   node bin/cortex-tms.js --help
   ```

---

## Development Workflow

### Branch Strategy

- **`main`** - Stable, production-ready code
- **Feature branches** - Use descriptive names:
  - `feat/auto-tiering` - New features
  - `fix/windows-path-bug` - Bug fixes
  - `docs/contributing-guide` - Documentation
  - `chore/ci-improvements` - Tooling/infrastructure

**Never commit directly to `main`**. Always work on a feature branch.

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `test` - Test additions/changes
- `chore` - Tooling, dependencies, build changes
- `refactor` - Code restructuring without behavior change

**Examples**:
```bash
feat(cli): add --verbose flag to status command
fix(templates): correct CLAUDE.md placeholder replacement
docs(readme): update installation instructions
test(init): add test for nano scope
```

### Code Style

- **TypeScript**: All source code uses TypeScript with strict mode
- **ESM**: Use `import/export`, not `require()` (this is an ESM-only project)
- **Import extensions**: Always use `.js` extensions in imports (required for ESM)
- **No any**: Avoid `any` type - use proper types or `unknown`
- **Formatting**: Run `npm run format` before committing

### Testing Requirements

- **All new features** must include tests
- **All bug fixes** must include a regression test
- **Test command**: `npm test`
- **Coverage**: We aim for >80% coverage (check with `npm run test:coverage`)

**Test File Naming**:
- Unit tests: `src/__tests__/filename.test.ts`
- Integration tests: `src/__tests__/integration/feature.test.ts`

---

## Pull Request Process

### Before Opening a PR

**Required Checklist**:
- [ ] **Issue exists** - Link to related issue or explain why no issue needed
- [ ] **Tests added** - New code has test coverage
- [ ] **Tests pass** - `npm test` passes locally
- [ ] **Lint passes** - `npm run lint` passes
- [ ] **Build works** - `npm run build` succeeds
- [ ] **Docs updated** - README or docs reflect changes (if applicable)
- [ ] **Self-reviewed** - You've reviewed your own diff for mistakes

### PR Submission

1. **Push your branch**
   ```bash
   git push origin feat/your-feature
   ```

2. **Open PR** on GitHub
   - Use the PR template (auto-populated)
   - Link to related issue with "Closes #XXX"
   - Provide clear description of changes
   - Add screenshots/examples if UI/CLI changes

3. **CI Checks** - Wait for automated checks to pass
   - Tests must pass
   - Lint must pass
   - Build must succeed

4. **Review** - Respond to feedback promptly
   - Address reviewer comments
   - Push additional commits if needed
   - Mark conversations as resolved when fixed

### PR Size Guidelines

**Preferred PR Size**: <300 lines changed
- **Small PRs** (<100 lines) - Reviewed quickly
- **Medium PRs** (100-300 lines) - Standard review time
- **Large PRs** (>300 lines) - May ask to split into smaller PRs

**Exception**: Large PRs acceptable for:
- New examples in `examples/` directory
- Generated code or migrations
- Test additions

---

## Contribution Guidelines

### ✅ What We Welcome

**Bug Fixes**:
- Platform-specific issues (Windows, macOS, Linux)
- ESM compatibility fixes
- Template rendering bugs
- CLI command errors

**Features** (with prior issue discussion):
- New TMS templates
- CLI improvements (new flags, better output)
- Validation enhancements
- Migration tooling

**Documentation**:
- Typo fixes
- Clarity improvements
- New examples or tutorials
- Architecture explanations

**Testing**:
- Improve test coverage
- Add edge case tests
- Platform-specific test scenarios

**Examples**:
- New project examples in `examples/`
- Real-world TMS implementations
- Integration examples (CI/CD, IDEs)

### ⚠️ Requires Discussion First

**These changes need an approved issue before starting work**:

- **New commands** - Architecture impact
- **Breaking changes** - Affects existing users
- **New dependencies** - Bundle size impact
- **Schema changes** - Affects `.cortex-tms.json` format
- **Major refactoring** - Risk of regressions

**Process**: Open an issue → Get maintainer approval → Then start coding

### ❌ What We Don't Accept

**Auto-rejected PRs** (to save your time and ours):

- **Style-only changes** - Formatting without functional improvement
- **Mass refactoring** - "Improving" code structure without measurable benefit
- **Tooling changes** - Changing prettier, eslint, etc. without discussion
- **Dependency upgrades** - Unless fixing a security issue
- **Generated files** - Don't edit files in `dist/` (those are auto-generated)
- **Feature PRs without issue** - Discuss first, code second

---

## Areas Where We Need Help

### 🔥 High Priority

1. **Windows Testing**
   - Path handling edge cases
   - PowerShell compatibility
   - File permissions issues

2. **Platform-Specific Examples**
   - Monorepo examples (Nx, Turborepo)
   - Framework examples (Next.js, Astro, Express)
   - Language examples (Python, Go, Rust)

3. **Documentation**
   - Video tutorials
   - Migration guides (from other systems)
   - Best practices articles

### 💚 Good First Issues

Look for issues labeled [`good-first-issue`](https://github.com/cortex-tms/cortex-tms/labels/good-first-issue):
- Simple bug fixes
- Documentation improvements
- Test additions
- Template enhancements

### 🚀 Advanced Contributions

For experienced contributors:
- CI/CD integrations (GitHub Actions, GitLab CI)
- IDE extensions (VS Code, JetBrains)
- Language-specific implementations
- Performance optimizations

---

## Technical Architecture

### Project Structure

```
cortex-tms/
├── src/
│   ├── commands/          # CLI command implementations
│   ├── utils/             # Shared utilities
│   ├── types/             # TypeScript type definitions
│   └── __tests__/         # Test files
├── templates/             # TMS file templates
├── bin/                   # CLI entry points
├── dist/                  # Compiled output (auto-generated)
├── docs/                  # Documentation
└── examples/              # Example projects
```

### Key Concepts

**Tiered Memory System (TMS)**:
- **HOT** - Files read at start of every AI session
- **WARM** - Files read on-demand when working on features
- **COLD** - Archived files, rarely read by AI

**Scopes**:
- **nano** - Minimal (2 files: CLAUDE.md, NEXT-TASKS.md)
- **standard** - Mid-size projects (9 files)
- **enterprise** - Large projects (12+ files)

**Commands**:
- `init` - Initialize TMS in a project
- `validate` - Check TMS health
- `status` - Show project dashboard
- `migrate` - Upgrade TMS files
- `review` - Run Guardian semantic validation (beta)

### Code Patterns

**1. ESM Only**
```typescript
// ✅ Correct
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ❌ Wrong (this is not CommonJS!)
const path = require('path');
const __dirname = __dirname; // Not available in ESM
```

**2. Import Extensions Required**
```typescript
// ✅ Correct
import { validateProject } from './utils/validator.js';

// ❌ Wrong
import { validateProject } from './utils/validator';
```

**3. Type Safety**
```typescript
// ✅ Correct
function processConfig(config: ProjectConfig): ValidationResult {
  // ...
}

// ❌ Wrong
function processConfig(config: any): any {
  // ...
}
```

---

## Review Process

### What to Expect

- **Review Timeline**: No SLA - we review PRs on a best-effort basis
- **Feedback**: Expect constructive feedback to improve code quality
- **Iterations**: Multiple rounds of review are normal for larger changes
- **Responsiveness**: Please respond to review comments within 7 days

### When PRs Get Closed

PRs may be closed if:
- **Stale** - No activity for 30 days
- **Out of scope** - Doesn't align with project direction
- **No discussion** - Feature wasn't discussed in an issue first
- **Quality issues** - Tests missing, lint failing, breaking changes without justification
- **Duplicates** - Another PR already addresses the same issue

Don't take it personally! You can always reopen with adjustments.

---

## Questions?

- **GitHub Discussions**: [Ask questions here](https://github.com/cortex-tms/cortex-tms/discussions)
- **Reddit**: [r/cortextms](https://reddit.com/r/cortextms)
- **Documentation**: [cortex-tms.org](https://cortex-tms.org/)

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

**Thank you for contributing to Cortex TMS!** 🎉
