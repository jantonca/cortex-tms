# NEXT: Upcoming Tasks (v2.5 cycle)

## 🎉 v2.4 "Scaling Intelligence" Sprint Complete!

**Achievements**:
- ✅ Migration Auditor with version tracking and customization detection
- ✅ Prompt Engine with Essential 7 library
- ✅ Version metadata infrastructure across all templates
- ✅ Automatic clipboard integration for frictionless AI workflows
- ✅ Project-local prompt customization via PROMPTS.md

**Sprint Closed**: 2026-01-14
**Release**: [v2.4.0](https://github.com/jantonca/cortex-tms/releases/tag/v2.4.0)

---

## Active Sprint: v2.5 - Guidance & Growth

**Why this matters**: With the infrastructure for scaling in place (version tracking + prompt engine), v2.5 focuses on making Cortex TMS self-teaching and self-healing. The Zero-Drift governance suite eliminates manual version management, while the Safe-Fail Migration Engine enables worry-free template evolution.

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Sync Engine** - Automated version synchronization script | [TMS-250] | 1h | 🔴 HIGH | ✅ Done |
| **CI Guardian** - Multi-file version validation in CI | [TMS-251] | 30m | 🔴 HIGH | ✅ Done |
| **Prompt Refinement** - Command-driven maintenance protocol | [TMS-252] | 15m | 🔴 HIGH | ✅ Done |
| **Backup Engine** - Atomic snapshot utility | [TMS-236-P2A] | 2h | 🔴 HIGH | ✅ Done |
| **Apply Logic** - Non-destructive `migrate --apply` | [TMS-236-P2B] | 4h | 🔴 HIGH | ✅ Done |
| **Rollback Command** - `migrate --rollback` capability | [TMS-236-P2C] | 2h | 🟡 MED | ⬜ Todo |
| **Interactive Tutorial** - In-CLI onboarding walkthrough | [TMS-238] | 3h | 🟡 MED | ⬜ Todo |
| **Custom Templates** - User-defined template support | [TMS-241] | 4h | 🟡 MED | ⬜ Todo |

---

## 📋 v2.4 Sprint Completed (2026-01-14)

| Task | Ref | Status |
| :--- | :--- | :----- |
| **Migration Engine** - Version tagging infrastructure | [TMS-237] | ✅ Done |
| **Migration Auditor** - `cortex-tms migrate` command | [TMS-236] | ✅ Done |
| **Prompt Engine** - `cortex-tms prompt` & Essential 7 | [TMS-240] | ✅ Done |

---

## 📋 v2.3 Sprint Completed (2026-01-13)

| Task | Ref | Status |
| :--- | :--- | :----- |
| **Release v2.2.0** - NPM Publish & GitHub Release | [#24] | ✅ Done |
| **Template Audit & Sync** - Update todo-app to v2.2.0 | [TMS-230] | ✅ Done |
| **Dry Run Preview** - Add `--dry-run` and `--scope` flags | [TMS-231] | ✅ Done |
| **Validation Fix** - Add `--fix` flag to `validate` | [TMS-233] | ✅ Done |
| **VS Code Snippets** - TMS snippet library for docs | [TMS-234] | ✅ Done |
| **Status Command** - Add `cortex-tms status` dashboard | [TMS-235] | ✅ Done |

---

## ✅ v2.3 Definition of Done (Complete)
- [x] Users can preview all file changes before committing (`--dry-run`).
- [x] Non-interactive mode works in CI/CD environments (`--scope` flag).
- [x] Validation command can auto-fix common issues (`--fix`).
- [x] VS Code users have snippet library for rapid TMS documentation.
- [x] Status command provides project health dashboard with scope, tasks, and validation results.

**Archive**: See `docs/archive/sprint-v2.3-confidence-comfort.md` for full sprint retrospective.

---

## ✅ v2.4 Definition of Done (Complete)
- [x] Templates include machine-readable version metadata for detection.
- [x] Migration command detects version status and identifies customizations.
- [x] Version conflicts are clearly reported with upgrade guidance.
- [x] Prompt engine provides project-aware AI interaction templates.
- [x] Essential 7 library covers full development lifecycle.

**Archive**: See `docs/archive/sprint-v2.4-scaling-intelligence.md` for full sprint retrospective.

---

## 🎯 Definition of Done (v2.5)
- [x] Automated version synchronization script eliminates manual updates.
- [x] CI validates documentation sync before merging PRs.
- [x] Maintenance protocol references automated tooling instead of manual steps.
- [x] Users can automatically upgrade templates with `migrate --apply`.
- [x] Backup system creates restore points before migrations.
- [ ] Rollback command can restore from backups.
- [ ] First-time users can complete an interactive tutorial inside the CLI.
- [ ] Custom template directories can be specified for team-specific patterns.

---

## 🗂️ Sprint Archive Links

- **v2.4**: [Scaling Intelligence](docs/archive/sprint-v2.4-scaling-intelligence.md) - Migration Auditor, Prompt Engine, Version Infrastructure
- **v2.3**: [Confidence & Comfort](docs/archive/sprint-v2.3-confidence-comfort.md) - Status Dashboard, Snippets, Self-Healing
- **v2.2**: [Automation & Precision](docs/archive/sprint-2026-01.md) - CI/CD, Custom Init, Branch Hygiene
- **v2.1**: [Foundation](docs/archive/sprint-2026-01-dogfooding.md) - CLI Launch, Validation Engine, Template System

<!-- @cortex-tms-version 2.4.1 -->
