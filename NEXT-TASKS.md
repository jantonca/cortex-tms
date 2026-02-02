# NEXT: Upcoming Tasks

**Last Updated**: 2026-02-02

---

## ✅ v3.3.0: Phase 1 - Onboarding Improvements (Complete)

**Timeline**: Feb 2026 (6h)
**Status**: ✅ Complete (on develop branch)
**Target**: Guide new users to success in <5 minutes
**Details**: See [docs/tasks/v3.3-phase1-implementation.md](docs/tasks/v3.3-phase1-implementation.md)

### Completed Tasks

- ✅ Task 1.1: Next steps after init (src/commands/init.ts)
- ✅ Task 1.2: START-HERE.md guide (docs/guides/START-HERE.md)
- ✅ Task 1.5: Token savings visible (src/commands/status.ts)

---

## 🎯 v3.3.1: Phase 2 - Migration Support

**Timeline**: Feb 2026 (12h estimated)
**Status**: 🔄 In Progress (on develop branch)
**Target**: Support existing projects with messy docs
**Details**: See [docs/tasks/v3.3.1-phase2-implementation.md](docs/tasks/v3.3.1-phase2-implementation.md)

### Tasks

#### Task 2.1: Project Analyzer (6h) ✅
**Status**: Complete
**Goal**: Analyze existing project structure and suggest TMS setup
**Files**:
- src/commands/analyze.ts (new command)
- src/utils/project-analyzer.ts (core logic)
- src/cli.ts (command registration)

#### Task 2.4: Savings Projection (3h) ✅
**Status**: Complete
**Goal**: Show "You'll save $X/month" estimate
**Files**:
- src/utils/project-analyzer.ts (added savings calculation)
- src/commands/analyze.ts (display savings section)

#### Task 2.6: Migration Guide (3h) ⏸️
**Status**: Planned
**Goal**: Manual migration guide for existing projects

---

**See**: [docs/archive/](docs/archive/) for completed sprints | [FUTURE-ENHANCEMENTS.md](FUTURE-ENHANCEMENTS.md) for full backlog

<!-- @cortex-tms-version 3.1.0 -->
