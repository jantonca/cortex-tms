# NEXT: Upcoming Tasks

## Active Sprint: Foundation - Build Cortex TMS v2.0 Boilerplate

**Why this matters**: Transform Cortex TMS from concept to production-ready developer tool that can be used to bootstrap AI-optimized projects. Using the "dogfooding" approach, we'll validate the TMS structure by using it to build itself.

| Task | Effort | Priority | Status |
| :--- | :----- | :------- | :----- |
| **Phase 1: Dogfood the System** - Apply TMS to Cortex itself | 2h | 🔴 HIGH | ✅ Done |
| **Phase 1.5: Resolve Rule 4 Violation** - Modularize Git standards | 1h | 🔴 HIGH | ✅ Done |
| **Phase 2: Complete Template Library** - Fill all template files with real content | 4h | 🔴 HIGH | ✅ Done |
| **Phase 3: Build Example App** - Next.js 15 + Shadcn todo app | 6h | 🔴 HIGH | ✅ Done |
| **Phase 4: Create CLI Tool** - Node.js CLI for `npx cortex-tms init` | 4h | 🔴 HIGH | ✅ Done |
| **Phase 5: Documentation** - Quick Start, Migration Guide, Best Practices | 3h | 🟡 MED | ✅ Done |
| **Phase 6: Distribution** - GitHub Template + NPM Package | 2h | 🟢 LOW | ⬜ Todo |

---

## 📋 Current Focus: Phase 5 - Documentation Complete ✅

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

### Phase 4 Complete! ✅ All 6 Steps Done 🎉

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
- Validation passes 10/10 on cortex-tms

**✅ Step 4: Configuration System**
- `.cortexrc` with ProjectScope (Nano/Standard/Enterprise)
- Config load/merge/save utilities
- Validator respects ignoreFiles and custom limits
- Fixed circular dependency issues

**✅ Step 5: Scope-Based Init**
- Scope selection prompt in init
- Template filtering based on scope presets
- Auto-generates .cortexrc after init
- Tested: Nano (2 files), Standard (9 files), both validated ✓

**✅ Step 6: Documentation & Testing**
- Vitest integration testing suite (30 tests, 100% passing)
- Init command tests: scope filtering, placeholder replacement, config generation
- Validate command tests: .cortexrc integration, ignore lists, strict mode
- Comprehensive CLI-USAGE.md guide (installation, commands, config, examples)
- Final validation: 10/10 checks passed on root repo

### Next Phase Ready
- **Phase 5**: Documentation - Quick Start, Migration Guide, Best Practices
- **Phase 6**: Distribution - GitHub Template + NPM Package publish

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

## 🎉 Phase 5 Complete: User Documentation Suite

**Deliverables**:
1. ✅ `docs/guides/QUICK-START.md` - Greenfield project setup (5-minute guide)
2. ✅ `docs/guides/MIGRATION-GUIDE.md` - Brownfield integration strategy
3. ✅ `docs/guides/BEST-PRACTICES.md` - Maintaining high-signal documentation

**Key Features**:
- Scope-aware guidance (Nano/Standard/Enterprise)
- Accurate CLI behavior descriptions (validated against Phase 4 implementation)
- Cross-referenced with existing docs (PATTERNS.md, CLI-USAGE.md, DOMAIN-LOGIC.md)

---

## 🚀 Next Sprint Preview: Phase 6 - Distribution

Final phase to make Cortex TMS publicly available:
1. NPM package configuration and publishing
2. GitHub Template repository setup
3. Release preparation (changelog, versioning)
4. Public announcement materials
