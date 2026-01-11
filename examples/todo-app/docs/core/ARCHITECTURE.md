# Architecture: Todo App

## 🎯 Quick Context (For AI Agents)

- **What it does**: A task management app demonstrating Cortex TMS integration with modern Next.js development
- **Who it's for**: Developers learning the Cortex TMS documentation standard and Next.js 16 patterns
- **Key constraint**: **No Backend** - Must use localStorage for all persistence to ensure zero-setup deployment

---

## 🏗️ System Overview

A client-side todo application built with Next.js 16, React 19, and Shadcn UI. The app demonstrates CRUD operations, client-side state management, and localStorage persistence without requiring any backend infrastructure. This serves as the reference implementation for how Cortex TMS organizes documentation for real-world web applications.

---

## 🧠 Mental Model

**"Client-First Task Manager"**: All state lives in React + localStorage. The browser is the database. No server, no API calls, no authentication complexity—just pure client-side task management optimized for learning and demonstration.

---

## 📂 Component Map

| Component | Responsibility | Tech Stack |
|:----------|:---------------|:-----------|
| **TodoForm** | User input for adding new todos | React 19, Shadcn Input + Button |
| **TodoItem** | Individual todo with edit/delete/complete actions | React 19, Shadcn Checkbox + Dialog |
| **TodoList** | Container for rendering filtered todos | React 19, Shadcn Card |
| **TodoFilters** | Filter buttons (All, Active, Completed) | React 19, Shadcn Button |
| **Main Page** | State management + component composition | Next.js 16 App Router, React hooks |
| **Storage Layer** | localStorage abstraction for persistence | TypeScript, Web Storage API |

---

## 🔄 Core Data Flow

1. **User adds todo**: Form captures input → Creates Todo object with UUID → Updates React state → Persists to localStorage
2. **User toggles complete**: Checkbox clicked → Updates todo.completed → React re-renders → Syncs to localStorage
3. **User deletes todo**: Delete button → Confirmation dialog → Removes from state → Updates localStorage
4. **User filters todos**: Filter button clicked → Updates filter state → TodoList re-renders with filtered subset
5. **Page reload**: App mounts → Reads from localStorage → Initializes React state → Renders todos

**Data Flow Diagram**:
```
[User Input] → [React State] ⇄ [localStorage]
                      ↓
              [Filtered View]
```

---

## 🗃️ Data Model

### Todo Type (`src/types/todo.ts`)

```typescript
export interface Todo {
  id: string;          // UUID v4
  text: string;        // Todo description
  completed: boolean;  // Completion status
  createdAt: number;   // Unix timestamp
}

export type TodoFilter = 'all' | 'active' | 'completed';
```

### Storage Strategy

- **Key**: `cortex-todos`
- **Format**: `JSON.stringify(Todo[])`
- **Initialization**: Empty array `[]` if key missing
- **Update Pattern**: Read → Modify → Write (atomic)

---

## 🚢 Deployment & Infrastructure

**Hosting**: Static hosting (Vercel, Netlify, GitHub Pages)
**Build Output**: Static HTML + JS (no server required)
**Environment**: Client-side only (no environment variables needed)
**Browser Support**: Modern browsers with localStorage support

---

## 🎨 UI Component Structure

### Component Hierarchy

```
page.tsx (Main App)
├── TodoForm
│   ├── Input (Shadcn)
│   └── Button (Shadcn)
├── TodoFilters
│   └── Button (Shadcn) × 3
├── TodoList
│   ├── Card (Shadcn)
│   └── TodoItem × N
│       ├── Checkbox (Shadcn)
│       ├── Input (inline edit)
│       └── Dialog (delete confirmation)
└── Footer (todo counter)
```

### Styling Strategy

- **Tailwind CSS v4**: Utility-first styling
- **Shadcn Components**: Pre-styled Radix UI primitives
- **Neutral Theme**: Default color palette
- **Responsive**: Mobile-first design

---

## 🔑 Key Technical Decisions

### Why localStorage?

- **Zero Setup**: App runs anywhere without backend
- **Instant Persistence**: No network latency
- **Perfect for Demo**: Users can test immediately
- **Limitation Acknowledged**: Data is browser-specific, not synced across devices

### Why No Server Components for State?

- **Local State**: Todos are user-specific, not shared
- **Real-Time Updates**: Client state is more responsive than server state
- **Simplicity**: Avoids unnecessary Next.js server complexity

### Why Shadcn over Other UI Libraries?

- **Ownership**: Copy-paste components (not npm dependency)
- **Tailwind Native**: Perfect Tailwind integration
- **Accessibility**: Built on Radix UI (ARIA compliant)
- **Customizability**: Easy to modify component code

---

## 🧪 Testing Strategy

**Phase 3 MVP**: Manual testing only
**Future**: Add Vitest unit tests + Playwright E2E tests

### Manual Test Checklist

- [ ] Add todo with various text lengths
- [ ] Toggle completion status
- [ ] Edit todo text inline
- [ ] Delete todo with confirmation
- [ ] Filter by All/Active/Completed
- [ ] Reload page (verify localStorage persistence)
- [ ] Test on mobile viewport

---

## 🚀 Performance Considerations

### Optimizations

- **Client Components Only**: All interactive, no SSR overhead
- **No API Calls**: Zero network latency
- **localStorage Caching**: Instant reads

### Potential Bottlenecks

- **Large Todo Lists**: Re-rendering 1000+ todos may lag (future: virtualization)
- **localStorage Limits**: ~5-10MB quota (future: IndexedDB migration)

---

## 📚 File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with global styles
│   ├── page.tsx            # Main todo app (state + composition)
│   └── globals.css         # Tailwind imports + CSS variables
├── components/
│   ├── ui/                 # Shadcn components (Button, Input, etc.)
│   ├── todo-form.tsx       # Add todo form
│   ├── todo-item.tsx       # Individual todo
│   ├── todo-list.tsx       # List container
│   └── todo-filters.tsx    # Filter buttons
├── lib/
│   ├── utils.ts            # cn() helper (Shadcn default)
│   └── storage.ts          # localStorage abstraction
└── types/
    └── todo.ts             # TypeScript interfaces
```

---

## 🔮 Future Enhancements

See `FUTURE-ENHANCEMENTS.md` for backlog. Key items:

- Backend sync (Supabase/Firebase)
- User authentication
- Due dates + priority levels
- Tags and categories
- Dark mode toggle

---

**Last Updated**: 2026-01-12
**Tech Stack Version**: Next.js 16.1.1, React 19.2.3, Tailwind CSS 4.1.18
