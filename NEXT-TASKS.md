# NEXT: Upcoming Tasks (v2.3 cycle)

## 🎉 v2.2 Sprint Complete!

**Achievements**:
- ✅ CI automation with GitHub Actions (Immutable Guardian)
- ✅ Custom file selection for granular init (Surgical Precision)
- ✅ Clean Trunk policy for branch hygiene
- ✅ Enterprise-ready ARCHITECTURE.md template

**Sprint Closed**: 2026-01-13

---

## Active Sprint: v2.3 - Confidence & Comfort

**Why this matters**: With automation and templates solid, we now focus on user trust (Dry Run) and developer comfort (VS Code integration).

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Release v2.2.0** - NPM Publish & GitHub Release | [#24] | 10m | 🔴 HIGH | ✅ Done |
| **Template Audit & Sync** - Update todo-app to v2.2.0 enterprise | [TMS-230] | 45m | 🔴 HIGH | ✅ Done |
| **Dry Run Preview** - Add `--dry-run` and `--scope` flags | [TMS-231] | 2h | 🔴 HIGH | ✅ Done |
| **Validation Fix** - Add `--fix` flag to `validate` | [TMS-233] | 3h | 🟡 MED | ⬜ Todo |
| **VS Code Snippets** - TMS snippet library for docs | [TMS-234] | 2h | 🟢 LOW | ⬜ Todo |

---

## 📋 v2.2 Sprint Completed (2026-01-13)

| Task | Ref | Status |
| :--- | :--- | :----- |
| **CI Setup** - Add GitHub Action for `validate` | [#18] | ✅ Done |
| **Refine Init** - Prompt for specific docs selection | [#19] | ✅ Done |
| **Template Polish** - Complete ARCHITECTURE.md sections | [#20] | ✅ Done |

---
## ✅ v2.2 Definition of Done (Complete)
- [x] Every PR is auto-validated by GitHub Actions.
- [x] Users can cherry-pick specific .md files during `init`.
- [x] ARCHITECTURE.md includes Observability, Scalability, and IaC sections.

---

## 🎯 Definition of Done (v2.3)
- [x] Users can preview all file changes before committing (`--dry-run`).
- [x] Non-interactive mode works in CI/CD environments (`--scope` flag).
- [ ] Validation command can auto-fix common issues (`--fix`).
- [ ] VS Code users have snippet library for rapid TMS documentation.
