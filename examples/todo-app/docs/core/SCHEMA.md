# Schema: Data Models & TypeScript Types

<!-- This todo app uses TypeScript types + localStorage (no database). -->
<!-- This file documents the type definitions and localStorage contract. -->

---

## Overview

**Storage Type**: localStorage (Browser Web Storage API)
**Data Format**: JSON
**Type System**: TypeScript (strict mode enabled)
**Schema Migration Strategy**: Manual (localStorage is unversioned, relies on code migrations if needed)

---

## Core Type Definitions

### Todo Interface

**Purpose**: Represents a single task in the todo list.

**Source File**: `src/types/todo.ts`

```typescript
export interface Todo {
  id: string;          // UUID v4
  text: string;        // The task description
  completed: boolean;  // Task status
  createdAt: number;   // Unix timestamp for sorting
}
```

**Field Details**:

| Field | Type | Required | Validation | Notes |
|:------|:-----|:---------|:-----------|:------|
| `id` | `string` | Yes | Must be UUID v4 format | Generated via `crypto.randomUUID()` |
| `text` | `string` | Yes | Non-empty after trim | User-provided task description |
| `completed` | `boolean` | Yes | `true` or `false` only | Completion status |
| `createdAt` | `number` | Yes | Unix timestamp (ms) | Generated via `Date.now()` |

**Default Values** (on creation):

```typescript
{
  id: crypto.randomUUID(),        // e.g., "550e8400-e29b-41d4-a716-446655440000"
  text: "[User input]",           // Trimmed, non-empty string
  completed: false,                // Always false on creation
  createdAt: Date.now()           // e.g., 1705123200000
}
```

**Relationships**: None (flat structure, no foreign keys)

**Indexes**: None (in-memory filtering only)

---

### TodoFilter Type

**Purpose**: Defines the available filter options for the UI.

**Source File**: `src/types/todo.ts`

```typescript
export type TodoFilter = 'all' | 'active' | 'completed';
```

**Values**:
- `'all'` - Show all todos (no filtering)
- `'active'` - Show only incomplete todos (`completed === false`)
- `'completed'` - Show only completed todos (`completed === true`)

**Storage**: NOT persisted to localStorage (session-only state)

**Default**: `'all'` (shows all todos on page load)

---

## localStorage Schema

### Storage Key

**Key Name**: `cortex-todos`

**Scope**: Per-origin (domain + protocol + port)

**Format**: JSON string representation of `Todo[]` array

### Data Structure

**Stored Value Example**:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "text": "Buy groceries",
    "completed": false,
    "createdAt": 1705123200000
  },
  {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "text": "Write documentation",
    "completed": true,
    "createdAt": 1705120000000
  }
]
```

**Empty State**: `[]` (empty array, not `null` or missing)

### Storage Operations

**Source File**: `src/lib/storage.ts`

#### Read Operation

```typescript
getTodos(): Todo[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load todos:", error);
    return [];
  }
}
```

**SSR Safety**: Returns `[]` when `window` is undefined (server-side)

#### Write Operation

```typescript
saveTodos(todos: Todo[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("Failed to save todos:", error);
  }
}
```

**Error Handling**: Silent failure with console logging (quota errors, etc.)

#### Clear Operation

```typescript
clear(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
```

**Use Case**: Testing, manual reset (not exposed in UI)

---

## Component Prop Types

### TodoFormProps

**Purpose**: Props for the todo creation form component.

**Source File**: `src/components/todo-form.tsx`

```typescript
interface TodoFormProps {
  onAddTodo: (todo: Todo) => void;
}
```

**Callback Contract**: Parent provides handler that accepts a fully-formed `Todo` object.

---

### TodoItemProps

**Purpose**: Props for individual todo item component.

**Source File**: `src/components/todo-item.tsx`

```typescript
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}
```

**Callbacks**:
- `onToggle`: Toggle completion status
- `onEdit`: Update todo text
- `onDelete`: Remove todo from list

---

### TodoListProps

**Purpose**: Props for the todo list container component.

**Source File**: `src/components/todo-list.tsx`

```typescript
interface TodoListProps {
  todos: Todo[];
  filter: TodoFilter;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}
```

**Derived State**: Component computes `filteredTodos` internally based on `filter` prop.

---

### TodoFiltersProps

**Purpose**: Props for the filter button group component.

**Source File**: `src/components/todo-filters.tsx`

```typescript
interface TodoFiltersProps {
  currentFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}
```

**UI Contract**: Highlights active filter button, emits filter change events.

---

## Type Guards & Utilities

### Type Validation

**Source File**: `src/lib/storage.ts`

No runtime type guards currently implemented (localStorage is trusted source).

**Future Enhancement**: Add Zod schema validation for localStorage reads.

---

## Enums & Constants

### Storage Constants

**Source File**: `src/lib/storage.ts`

```typescript
const STORAGE_KEY = "cortex-todos";
```

**Rationale**: Single source of truth for the localStorage key name.

---

## Data Flow Diagrams

### Todo Creation Flow

```
1. User types in TodoForm input
   ↓
2. Form validates (trim, reject if empty)
   ↓
3. Create Todo object:
   - id: crypto.randomUUID()
   - text: trimmed input
   - completed: false
   - createdAt: Date.now()
   ↓
4. Call onAddTodo callback
   ↓
5. Parent (page.tsx) prepends to todos array
   ↓
6. updateTodos([newTodo, ...todos])
   ↓
7. React state update + localStorage.setItem() (atomic)
   ↓
8. UI re-renders with new todo at top
```

### Todo Toggle Flow

```
1. User clicks checkbox in TodoItem
   ↓
2. Call onToggle(todo.id)
   ↓
3. Parent maps over todos, flips completed flag
   ↓
4. updateTodos(mappedArray)
   ↓
5. React state update + localStorage.setItem() (atomic)
   ↓
6. UI re-renders with updated checkbox
```

### Filter Change Flow

```
1. User clicks filter button (All/Active/Completed)
   ↓
2. TodoFilters calls onFilterChange(newFilter)
   ↓
3. Parent updates filter state (NOT persisted)
   ↓
4. TodoList re-renders, computes filteredTodos
   ↓
5. UI shows filtered subset
```

---

## Validation Rules

### Todo Creation Validation

**Rule**: Todo text cannot be empty after trimming.

**Condition**: Text input must satisfy:
- `text.trim().length > 0`

**Enforcement Location**: `src/components/todo-form.tsx:17`

```typescript
const trimmed = text.trim();
if (!trimmed) return; // Guard: reject empty
```

### Todo Edit Validation

**Rule**: Edited text cannot be empty. Empty edits revert to original.

**Condition**:
- `editedText.trim().length > 0` → Save
- `editedText.trim().length === 0` → Cancel edit

**Enforcement Location**: `src/components/todo-item.tsx` (inline edit logic)

---

## Performance Considerations

### Query Patterns

**Most Common Operations**:
1. **Filter todos**: `todos.filter(t => t.completed === false)`
2. **Map for update**: `todos.map(t => t.id === targetId ? { ...t, completed: !t.completed } : t)`
3. **Count active**: `todos.filter(t => !t.completed).length`

**Optimization**: All operations are O(n) with n = number of todos. No indexes needed for small datasets (<1000 items).

### Expected Scale

**Projected Data Volume**:
- Typical user: 10-50 todos
- Power user: 100-500 todos
- localStorage limit: ~5MB (~10,000 todos)

**Growth Strategy**: If exceeding 1000 todos, consider migrating to IndexedDB or backend sync.

---

## Security Considerations

### Sensitive Fields

**None**: Todo app does not handle sensitive data (no PII, passwords, payments).

**Future**: If adding user authentication, ensure tokens/passwords are NOT stored in localStorage (use httpOnly cookies).

### XSS Prevention

**Text Sanitization**: React auto-escapes all text content (`{todo.text}` is safe).

**HTML Injection Risk**: None (no `dangerouslySetInnerHTML` used).

---

## AI Agent Notes

**When generating code that interacts with todos**:

- ⚠️ Always use the `Todo` interface from `src/types/todo.ts`
- ⚠️ Never mutate todos directly (use `.map()` and object spread)
- ⚠️ All CRUD operations MUST use `updateTodos()` helper (atomic state + storage sync)
- ⚠️ UUID generation: Use `crypto.randomUUID()` (not `Math.random()` or manual strings)
- ⚠️ Timestamps: Use `Date.now()` for Unix timestamps in milliseconds

**Common Mistakes to Avoid**:

- ❌ Don't use `localStorage.getItem()` directly outside `storage.ts`
- ❌ Don't create todos with missing fields (all 4 required: id, text, completed, createdAt)
- ❌ Don't persist filter state to localStorage (session-only)
- ❌ Don't use `useState(() => storage.getTodos())` (causes SSR hydration errors)

---

## References

- **TypeScript Handbook**: [Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- **Web Storage API**: [MDN localStorage docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- **UUID**: [RFC 4122](https://tools.ietf.org/html/rfc4122)

---

**Last Updated**: 2026-01-12
**TypeScript Version**: 5.7.3
**Strict Mode**: Enabled
