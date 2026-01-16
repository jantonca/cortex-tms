# FUTURE: Planned Enhancements

This is the **living backlog** for Cortex TMS. Tasks move from here to `NEXT-TASKS.md` when they become active.

---

## 🔴 High Priority (Next 1-2 Months)

### CLI Tool Enhancements

- **Interactive Template Selection**: Prompt users to choose which `docs/core/*.md` files they need
  - **Why**: Not all projects need `SCHEMA.md` or `TROUBLESHOOTING.md`
  - **Effort**: 4h

- **Detect Existing Package Manager**: Auto-detect if user uses npm/yarn/pnpm/bun
  - **Why**: Respect user's existing tooling
  - **Effort**: 2h

- **Safe File Merging**: Don't overwrite existing files without confirmation
  - **Why**: Brownfield projects may have existing `README.md` or `.github/` files
  - **Effort**: 3h

- **GitHub Actions Detection**: If `.github/workflows/` exists, offer to add TMS validation workflow
  - **Why**: Automate enforcement of line limits and structure
  - **Effort**: 4h

---

### Documentation Guides

- **QUICK-START.md**: 5-minute setup guide
  - **Why**: New users need fast onboarding
  - **Effort**: 2h

- **MIGRATION-GUIDE.md**: How to add TMS to existing projects
  - **Why**: Most users have brownfield projects
  - **Effort**: 3h

- **BEST-PRACTICES.md**: How to write effective DOMAIN-LOGIC, PATTERNS, etc.
  - **Why**: Quality of docs determines AI agent success
  - **Effort**: 3h

---

## 🟡 Medium Priority (2-4 Months)

### Example Projects

- **examples/todo-app/**: Next.js 15 + Shadcn todo app with full TMS
  - **Why**: Reference implementation validates the structure
  - **Effort**: 8h

- **examples/cli-tool/**: Node.js CLI application with TMS
  - **Why**: Shows TMS works for non-web projects
  - **Effort**: 4h

- **examples/api-service/**: Express + PostgreSQL API with TMS
  - **Why**: Demonstrates `SCHEMA.md` and `TROUBLESHOOTING.md` usage
  - **Effort**: 6h

---

### Template Enhancements

- **Complete ARCHITECTURE.md template**: Add sections for deployment, security, scalability
  - **Effort**: 2h

- **Complete TROUBLESHOOTING.md template**: Add common framework gotchas
  - **Effort**: 2h

- **Complete SCHEMA.md template**: Add examples for SQL, NoSQL, GraphQL schemas
  - **Effort**: 3h

- **Add README.md template**: Project-specific README that references TMS
  - **Effort**: 1h

---

### Automation & Validation

- **TMS Validation CLI Command**: `cortex-tms validate`
  - Checks file sizes (HOT files under limits)
  - Detects placeholders that weren't replaced
  - Verifies file structure
  - **Effort**: 6h

- **GitHub Action for TMS Validation**: Auto-check PRs
  - **Effort**: 3h

- **Pre-commit Hook**: Warn if `NEXT-TASKS.md` exceeds 200 lines
  - **Effort**: 2h

---

## 🟢 Low Priority (Nice to Have)

### VS Code Extension

- **TMS File Navigator**: Sidebar showing HOT/WARM/COLD tiers
  - **Effort**: 12h

- **Snippet Library**: Quick insert for patterns, ADRs, tasks
  - **Effort**: 4h

- **Placeholder Detection**: Highlight `[Placeholders]` in templates
  - **Effort**: 3h

---

### Advanced Features

- **AI Agent Performance Metrics**: Track before/after TMS adoption
  - Measure: hallucination rate, task completion time, file reads
  - **Effort**: 16h (research-heavy)

- **Multi-Language Support**: Templates in Spanish, French, Mandarin
  - **Effort**: 8h per language

- **TMS for Non-Code Projects**: Adapt for marketing, design, operations teams
  - **Effort**: 12h (requires research)

---

### Distribution Enhancements

- **NPM Package Publishing**: Publish `cortex-tms` to npm
  - **Effort**: 4h (includes CI/CD setup)

- **GitHub Template Repository**: Configure repo as template
  - **Effort**: 1h

- **Homebrew Formula**: `brew install cortex-tms`
  - **Effort**: 4h

- **Docker Image**: Containerized CLI tool
  - **Effort**: 3h

---

## 🔬 Experimental Ideas

### AI Agent Integration

- **Claude Code Integration**: Native support for TMS structure
  - **Effort**: Unknown (requires Anthropic partnership)

- **Cursor Rules Generator**: Auto-generate `.cursorrules` from `copilot-instructions.md`
  - **Effort**: 4h

- **Copilot Chat Slash Commands**: `/tms-sprint`, `/tms-pattern`, `/tms-decision`
  - **Effort**: Unknown (requires GitHub partnership)

---

### Community Features

- **Template Marketplace**: User-submitted templates for specific frameworks
  - Example: "TMS for Django", "TMS for Rails"
  - **Effort**: 20h (platform development)

- **TMS Showcase**: Gallery of projects using TMS
  - **Effort**: 8h

---

## 🗑️ Rejected Ideas

### Why We're NOT Doing These

- **YAML/JSON Templates**: Markdown is more human-readable
- **GUI Tool**: CLI-first philosophy; GUI adds complexity
- **Automatic Archiving**: Too risky; requires manual review
- **AI-Generated Docs**: Quality control is too difficult

---

## Migration Checklist

**When a task becomes active**:
1. Move it to `NEXT-TASKS.md`
2. Add to current sprint table
3. Break into smaller tasks if needed
4. Assign effort estimate
5. Mark status as "Todo"

**Archive Trigger**: When this file exceeds 300 lines, move completed sections to `docs/archive/backlog-YYYY-MM.md`.

<!-- @cortex-tms-version 2.6.0-beta.1 -->
