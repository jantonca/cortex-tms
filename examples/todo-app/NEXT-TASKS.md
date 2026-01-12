# NEXT: Upcoming Tasks

## Active Sprint: MVP - Build Todo CRUD Operations

**Why this matters**: Validate that Cortex TMS works for real-world Next.js development. This todo app serves as the "Gold Standard" reference implementation for users learning the TMS structure.

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Initialize Project** - Next.js 16 + Shadcn + TMS templates | - | 1h | 🔴 HIGH | ✅ Done |
| **Build Data Layer** - TypeScript types + localStorage abstraction | - | 30min | 🔴 HIGH | ✅ Done |
| **Add Shadcn Components** - Button, Input, Card, Checkbox, Dialog | - | 20min | 🔴 HIGH | ✅ Done |
| **Build TodoForm** - Add new todo input component | - | 30min | 🔴 HIGH | ✅ Done |
| **Build TodoItem** - Individual todo with edit/delete/complete | - | 45min | 🔴 HIGH | ✅ Done |
| **Build TodoList** - List container with filtering | - | 45min | 🔴 HIGH | ✅ Done |
| **Build Main Page** - Assemble components with state management | - | 45min | 🔴 HIGH | ✅ Done |
| **Add Polish** - Styling, transitions, responsive design | - | 30min | 🟡 MED | ⬜ Todo |
| **Validate Templates** - Ensure docs match implementation | - | 30min | 🟡 MED | ⬜ Todo |

**Ref Column**:
- `[#123]` = GitHub Issue
- `-` = No external reference

---

## 🎯 Definition of Done (MVP)

- [ ] `pnpm dev` runs without errors
- [ ] All CRUD operations work (create, read, update, delete)
- [ ] Todos persist across page reloads (localStorage)
- [ ] Filters work (All, Active, Completed)
- [ ] All Shadcn components integrated correctly
- [ ] All TMS templates populated with accurate content
- [ ] `docs/core/ARCHITECTURE.md` matches actual implementation
- [ ] TypeScript strict mode passes with no errors
- [ ] UI is responsive and accessible

---

## 📝 Current Focus

Main page assembled with global state + TodoFilters. Next: Add Polish (styling, transitions, responsive design).
