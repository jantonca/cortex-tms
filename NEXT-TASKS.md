# NEXT: Upcoming Tasks

**Last Updated**: 2026-02-04

---

## 📦 v3.3.0 Release Preparation

**Status**: Ready for release
**Branch**: `develop` (all phases complete)
**Tasks**:

- [ ] Run full validation suite
- [ ] Update CHANGELOG.md with v3.3.0 changes
- [ ] Bump version in package.json (3.1.0 → 3.3.0)
- [ ] Run sync-project.js to update version tags
- [ ] Test dashboard in production environment
- [ ] Publish to NPM
- [ ] Create GitHub release with notes

---

## 🔄 Follow-up Items

### Dashboard UI Tests (Deferred)
- **Priority**: Medium
- **Description**: Add integration tests for dashboard UI components
- **Blocker**: vitest config doesn't support JSX in .test.ts files
- **Solution**: Configure ink-testing-library or separate UI test suite

### Cost Savings Configuration
- **Priority**: Low
- **Description**: Make model and sessions/day configurable
- **Current**: Hard-coded to Claude Sonnet 4.5 @ 10 sessions/day
- **Future**: Add to `.cortexrc` schema

---

## 🎬 Active Initiatives

### AI Video Tutorials Sprint
- **Status**: 🚧 Phase 1 - In Progress (95% complete)
- **Branch**: `feat/video-tutorials-setup`
- **Description**: Create automated video tutorial series using Motion Canvas
- **Full Plan**: [docs/tasks/video-tutorials-sprint.md](docs/tasks/video-tutorials-sprint.md)
- **Goal**: Reduce time-to-first-value via visual learning, increase discoverability
- **Phases**: Setup & Validation → MVP (3 videos) → Full Series (11 videos)

**Current Progress**:
- ✅ Motion Canvas toolchain setup
- ✅ Hero video animation built (60-second demo, 5 scenes)
- ✅ Hero script documented with cross-channel variations
- ✅ Component library organized for reusability
- ⏳ **Next**: Export video, run user validation tests

---

**See**: [docs/archive/v3.3.0-sprint-summary.md](docs/archive/v3.3.0-sprint-summary.md) for completed v3.3.0 work

**See Also**: [docs/archive/](docs/archive/) for all completed sprints | [FUTURE-ENHANCEMENTS.md](FUTURE-ENHANCEMENTS.md) for full backlog

<!-- @cortex-tms-version 3.1.0 -->
