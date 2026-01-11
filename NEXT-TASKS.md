# NEXT: Upcoming Tasks

## Active Sprint: Foundation - Build Cortex TMS v2.0 Boilerplate

**Why this matters**: Transform Cortex TMS from concept to production-ready developer tool that can be used to bootstrap AI-optimized projects. Using the "dogfooding" approach, we'll validate the TMS structure by using it to build itself.

| Task | Effort | Priority | Status |
| :--- | :----- | :------- | :----- |
| **Phase 1: Dogfood the System** - Apply TMS to Cortex itself | 2h | 🔴 HIGH | ✅ Done |
| **Phase 1.5: Resolve Rule 4 Violation** - Modularize Git standards | 1h | 🔴 HIGH | ✅ Done |
| **Phase 2: Complete Template Library** - Fill all template files with real content | 4h | 🔴 HIGH | ✅ Done |
| **Phase 3: Build Example App** - Next.js 15 + Shadcn todo app | 6h | 🔴 HIGH | 🔄 In Progress |
| **Phase 4: Create CLI Tool** - Node.js CLI for `npx cortex-tms init` | 4h | 🟡 MED | ⬜ Todo |
| **Phase 5: Documentation** - Quick Start, Migration Guide, Best Practices | 3h | 🟡 MED | ⬜ Todo |
| **Phase 6: Distribution** - GitHub Template + NPM Package | 2h | 🟢 LOW | ⬜ Todo |

---

## 📋 Current Focus: Phase 3 - Example App

### Immediate Tasks (This Session)
- [x] Phase 2 complete (all templates built + validated)
- [x] Create validation document (`docs/validation/phase2-sandbox.md`)
- [x] Archive Phase 1, 1.5, and 2 to `docs/archive/sprint-2026-01.md`
- [ ] Plan Phase 3 architecture (Next.js 15 + Shadcn todo app)
- [ ] Create `examples/todo-app/` directory structure
- [ ] Initialize Next.js 15 project with TypeScript
- [ ] Populate example app with Cortex TMS templates
- [ ] Build core todo functionality (CRUD operations)
- [ ] Add Shadcn UI components
- [ ] Validate templates work in real-world scenario

---

## 🎯 Definition of Done (Phase 3)

- [ ] Next.js 15 app runs without errors (`pnpm dev`)
- [ ] All Cortex TMS templates populated in `examples/todo-app/`
- [ ] Todo app has functional CRUD operations
- [ ] Shadcn UI components integrated (Button, Input, Card, etc.)
- [ ] `examples/todo-app/docs/core/ARCHITECTURE.md` reflects actual implementation
- [ ] App serves as "Gold Standard" reference for Cortex TMS users
- [ ] Templates validated to work with complex real-world project

---

## 🚀 Next Sprint Preview: Phase 4 - CLI Tool

Once Phase 3 completes, we'll:
1. Build Node.js CLI tool for `npx cortex-tms init`
2. Implement interactive prompts (project name, tech stack, templates to include)
3. Add safe file operations (never overwrite without confirmation)
4. Test CLI in both greenfield and brownfield scenarios
