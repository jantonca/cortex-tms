# NEXT: Upcoming Tasks

## Active Sprint: Foundation - Build Cortex TMS v2.0 Boilerplate

**Why this matters**: Transform Cortex TMS from concept to production-ready developer tool that can be used to bootstrap AI-optimized projects. Using the "dogfooding" approach, we'll validate the TMS structure by using it to build itself.

| Task | Effort | Priority | Status |
| :--- | :----- | :------- | :----- |
| **Phase 1: Dogfood the System** - Apply TMS to Cortex itself | 2h | 🔴 HIGH | ✅ Done |
| **Phase 1.5: Resolve Rule 4 Violation** - Modularize Git standards | 1h | 🔴 HIGH | ✅ Done |
| **Phase 2: Complete Template Library** - Fill all template files with real content | 4h | 🔴 HIGH | ✅ Done |
| **Phase 3: Build Example App** - Next.js 15 + Shadcn todo app | 6h | 🔴 HIGH | ✅ Done |
| **Phase 4: Create CLI Tool** - Node.js CLI for `npx cortex-tms init` | 4h | 🔴 HIGH | 🔄 In Progress |
| **Phase 5: Documentation** - Quick Start, Migration Guide, Best Practices | 3h | 🟡 MED | ⬜ Todo |
| **Phase 6: Distribution** - GitHub Template + NPM Package | 2h | 🟢 LOW | ⬜ Todo |

---

## 📋 Current Focus: Phase 4 - CLI Tool

### Phase 3 Achievements 🎉

**Gold Standard Todo App Complete!**
- ✅ Fully functional Next.js 15 app with TypeScript strict mode
- ✅ Complete CRUD operations (create, read, update, delete, clear completed)
- ✅ Polished UX (empty states, bulk actions, inline editing, confirmation dialogs)
- ✅ All TMS documentation validated and synchronized with implementation
- ✅ 10 documented patterns with canonical examples
- ✅ Production build verified
- ✅ Accessibility compliant (ARIA labels, semantic HTML, keyboard navigation)

**Location**: `examples/todo-app/`

---

## 🎯 Phase 4 Objectives: CLI Distribution Tool

**Goal**: Create `npx cortex-tms init` command for one-click TMS setup.

### Phase 4 Progress (3/6 Steps Complete)

**✅ Step 1: CLI Foundation**
- Modern ESM Node.js CLI with TypeScript
- Commander.js command structure
- Dual-mode executable (dev/prod)

**✅ Step 2: Init Command**
- Context detection (git, package manager, existing files)
- Interactive prompts with Inquirer.js
- Template engine with placeholder replacement
- Force mode for non-interactive usage
- Tested in /tmp/cortex-test

**✅ Step 3: Validation Engine**
- `cortex-tms validate` command
- Rule 4 enforcement (file size limits)
- Mandatory file checks
- Placeholder detection
- Archive status monitoring
- --strict and --verbose flags
- Dogfooded on cortex-tms: 10/13 checks passed

### Remaining Tasks
- [ ] **Step 4**: Configuration System (.cortexrc) - MEDIUM priority
- [ ] **Step 5**: Enhanced Init UX - MEDIUM priority
- [ ] **Step 6**: Documentation & Testing - HIGH priority
- [ ] **Final**: Merge to main & npm publish dry-run

---

## 🎯 Definition of Done (Phase 4)

- [ ] `npx cortex-tms init` runs without errors
- [ ] Interactive prompts for project name and template selection
- [ ] Safe file operations (never overwrites without confirmation)
- [ ] Detects existing package.json and git repo
- [ ] Replaces `[Project Name]` placeholders automatically
- [ ] Supports both greenfield and brownfield scenarios
- [ ] Published as npm package (dry-run)
- [ ] CLI tested in at least 3 different project types

---

## 🚀 Next Sprint Preview: Phase 5 - Documentation Guides

Once Phase 4 completes, we'll:
1. Write Quick Start guide for new users
2. Write Migration Guide for existing projects
3. Write Best Practices guide for TMS patterns
4. Create video walkthrough (optional)
