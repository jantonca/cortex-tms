# Phase 3 Plan: Next.js 15 + Shadcn Todo App

## 🎯 Objective

Build a production-quality todo application that demonstrates Cortex TMS in a real-world Next.js project. This app will serve as the "Gold Standard" reference implementation for users adopting Cortex TMS.

---

## 🏗️ Tech Stack

### Core Framework
- **Next.js 15** (App Router, React Server Components)
- **TypeScript** (strict mode)
- **React 19** (bundled with Next.js 15)

### UI Layer
- **Shadcn UI** (Radix UI primitives + Tailwind)
- **Tailwind CSS 4.0** (utility-first styling)
- **Lucide Icons** (icon library)

### State Management
- **React Server Components** (minimize client state)
- **Server Actions** (mutations)
- **Local Storage** (persistence - no backend initially)

### Development Tools
- **pnpm** (package manager)
- **ESLint** (linting)
- **Prettier** (formatting)

---

## 📐 Application Architecture

### Feature Set (Minimal but Complete)

1. **CRUD Operations**:
   - ✅ Create new todos
   - ✅ Mark todos as complete/incomplete
   - ✅ Edit todo text
   - ✅ Delete todos

2. **UX Features**:
   - ✅ Filter by status (All, Active, Completed)
   - ✅ Clear all completed todos
   - ✅ Todo counter (X items left)
   - ✅ Persist to localStorage

3. **UI Components** (Shadcn):
   - `Button` (actions)
   - `Input` (todo text entry)
   - `Card` (todo list container)
   - `Checkbox` (complete toggle)
   - `Dialog` (delete confirmation)

---

## 📂 Project Structure

```
examples/todo-app/
├── NEXT-TASKS.md                 # Sprint tracking (populated with TMS)
├── FUTURE-ENHANCEMENTS.md        # Backlog (populated with TMS)
├── CLAUDE.md                     # Workflow config (populated with TMS)
├── README.md                     # Project intro (populated with TMS)
├── .github/
│   └── copilot-instructions.md  # AI guardrails (populated with TMS)
├── docs/
│   └── core/                    # All TMS templates populated
│       ├── ARCHITECTURE.md      # (this plan becomes the actual content)
│       ├── PATTERNS.md          # (Next.js patterns, component patterns)
│       ├── DOMAIN-LOGIC.md      # (todo business rules)
│       ├── DECISIONS.md         # (why localStorage, why Shadcn, etc.)
│       ├── GLOSSARY.md          # (todo terminology)
│       ├── SCHEMA.md            # (Todo type definition)
│       └── TROUBLESHOOTING.md   # (Next.js 15 gotchas)
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page (todo list)
│   │   └── globals.css          # Tailwind imports
│   ├── components/              # React components
│   │   ├── ui/                  # Shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   └── dialog.tsx
│   │   ├── todo-item.tsx        # Individual todo
│   │   ├── todo-list.tsx        # List of todos
│   │   ├── todo-form.tsx        # Add todo form
│   │   └── todo-filters.tsx     # Filter buttons
│   ├── lib/                     # Utilities
│   │   ├── utils.ts             # cn() helper
│   │   └── storage.ts           # localStorage abstraction
│   └── types/                   # TypeScript types
│       └── todo.ts              # Todo interface
├── public/                      # Static assets
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind config
├── next.config.js               # Next.js config
└── components.json              # Shadcn config
```

---

## 🗃️ Data Model

### Todo Type (`src/types/todo.ts`)

```typescript
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type TodoFilter = 'all' | 'active' | 'completed';
```

### Storage Strategy

- **Local Storage Key**: `cortex-todos`
- **Format**: JSON array of `Todo[]`
- **Initialization**: Empty array `[]` if key doesn't exist
- **Update Pattern**: Read → Modify → Write (atomic operations)

---

## 🎨 UI Design Philosophy

### Aesthetic
- **Minimalist**: Clean, distraction-free interface
- **Modern**: Subtle shadows, smooth transitions
- **Accessible**: ARIA labels, keyboard navigation

### Layout
- Centered single-column layout (max-width 600px)
- Header with title + filter buttons
- Input field at top
- Scrollable todo list
- Footer with counter + clear button

### Color Scheme (Tailwind Default)
- Background: `bg-background`
- Cards: `bg-card`
- Borders: `border-border`
- Text: `text-foreground`
- Accents: `text-primary`

---

## 🔄 Implementation Phases

### Step 1: Initialize Next.js Project (15min)
1. Create `examples/todo-app/` directory
2. Initialize Next.js 15 with TypeScript, Tailwind, App Router
3. Install Shadcn CLI and initialize (`npx shadcn@latest init`)
4. Verify dev server runs (`pnpm dev`)

### Step 2: Populate TMS Templates (30min)
1. Copy all templates from `templates/` to `examples/todo-app/`
2. Fill out each template for the todo app context:
   - `README.md` - Project intro
   - `ARCHITECTURE.md` - Use this plan as the base
   - `PATTERNS.md` - Next.js component patterns
   - `DOMAIN-LOGIC.md` - Todo business rules
   - `DECISIONS.md` - Tech stack decisions
   - `GLOSSARY.md` - Todo terminology
   - `SCHEMA.md` - Todo type definition
   - `TROUBLESHOOTING.md` - Next.js 15 gotchas
   - `CLAUDE.md` - Workflow config
   - `NEXT-TASKS.md` - Implementation sprint
   - `.github/copilot-instructions.md` - AI guardrails

### Step 3: Install Shadcn Components (10min)
```bash
npx shadcn@latest add button input card checkbox dialog
```

### Step 4: Build Data Layer (20min)
1. Create `src/types/todo.ts` - Type definitions
2. Create `src/lib/storage.ts` - localStorage abstraction
3. Add `src/lib/utils.ts` - `cn()` helper (Shadcn default)

### Step 5: Build UI Components (60min)
1. `src/components/todo-form.tsx` - Add todo form
2. `src/components/todo-item.tsx` - Individual todo
3. `src/components/todo-list.tsx` - List of todos
4. `src/components/todo-filters.tsx` - Filter buttons

### Step 6: Build Main Page (30min)
1. `src/app/page.tsx` - Assemble components
2. Add state management (useState hooks)
3. Wire up localStorage persistence

### Step 7: Styling & Polish (30min)
1. Add responsive design
2. Add transitions and animations
3. Add loading states
4. Test keyboard navigation

### Step 8: Validation & Documentation (30min)
1. Test all CRUD operations
2. Test localStorage persistence
3. Verify templates reflect actual implementation
4. Update `NEXT-TASKS.md` with completed tasks

---

## ✅ Definition of Done

- [ ] `pnpm dev` runs without errors
- [ ] All CRUD operations work (create, read, update, delete)
- [ ] Todos persist across page reloads (localStorage)
- [ ] Filters work (All, Active, Completed)
- [ ] All Shadcn components integrated correctly
- [ ] All TMS templates populated with accurate content
- [ ] `docs/core/ARCHITECTURE.md` matches actual implementation
- [ ] Code follows Next.js 15 best practices (Server Components, Server Actions)
- [ ] TypeScript strict mode passes with no errors
- [ ] UI is responsive and accessible

---

## 🚀 Next Steps After Phase 3

Once this example app is complete, it will serve as the reference for:
1. **Phase 4 CLI Tool**: The CLI will copy templates that look like this
2. **Phase 5 Documentation**: Screenshots and examples from this app
3. **User Onboarding**: New users can study this app to see TMS in action

---

## 📊 Success Metrics

**Template Validation**:
- An AI agent should be able to read `examples/todo-app/docs/core/` and immediately understand:
  - What the app does (`ARCHITECTURE.md`)
  - What the rules are (`DOMAIN-LOGIC.md`)
  - What patterns to follow (`PATTERNS.md`)

**User Experience**:
- A developer should be able to clone this example and understand TMS within 10 minutes
- The app should "feel" professional enough to serve as a portfolio piece

---

**Plan Created**: 2026-01-12
**Estimated Effort**: 3.5 hours (actual Phase 3 allocation: 6 hours, so buffer for polish)
**Next Action**: Initialize Next.js project
