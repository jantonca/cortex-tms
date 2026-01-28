# Domain Logic: Todo App

## Core Rules

### Rule 1: Single Source of Truth
**All todo state mutations MUST update both React state and localStorage atomically.**

- **Why**: Prevents desync between UI and persistence layer
- **Enforcement**: Use the `updateTodos()` helper in `src/app/page.tsx`
- **Exception**: None. Every CRUD operation (add, toggle, edit, delete, clear) must use this pattern

### Rule 2: Empty Input Rejection
**Todo text cannot be empty or whitespace-only.**

- **Why**: Prevents meaningless entries that clutter the UI
- **Enforcement**: `TodoForm` trims input and rejects if empty (`if (!trimmed) return;`)
- **UX**: Form silently ignores empty submissions (no error message needed)

### Rule 3: Immutable Updates
**Never mutate todo arrays or objects directly. Always create new copies.**

- **Why**: React's state updates require new references to trigger re-renders
- **Enforcement**: Use `.map()`, `.filter()`, and object spread (`{ ...todo, completed: !todo.completed }`)
- **Anti-Pattern**: `todos[0].completed = true` ❌ (mutates directly)

### Rule 4: UUID-Based IDs
**All todos MUST use UUID v4 for unique identification.**

- **Why**: Guarantees uniqueness without server coordination
- **Implementation**: `crypto.randomUUID()` in `TodoForm`
- **Format**: Standard UUID string (e.g., `550e8400-e29b-41d4-a716-446655440000`)

### Rule 5: Timestamp Precision
**Todo creation timestamps MUST be Unix timestamps (milliseconds).**

- **Why**: Consistent sorting and date comparison
- **Implementation**: `Date.now()` returns milliseconds since epoch
- **Storage**: Stored as `number` type in `Todo.createdAt`

### Rule 6: Hydration Safety
**localStorage reads MUST occur after initial SSR render in Next.js.**

- **Why**: Prevents hydration mismatches (server sees empty state, client sees persisted data)
- **Implementation**: Load data in `useEffect()` after mount, use `isLoaded` guard
- **Violation**: Causes React hydration errors and console warnings

### Rule 7: Derived State for Filtering
**Filtering logic MUST be computed during render, not stored in state.**

- **Why**: Avoids cascading `useEffect` renders and keeps state minimal
- **Implementation**: `const filteredTodos = todos.filter(...)` in `TodoList` component
- **Ref**: See `PATTERNS.md#derived-state-over-useeffect`

### Rule 8: Explicit Deletion Confirmation
**Deleting a todo MUST require user confirmation via dialog.**

- **Why**: Prevents accidental deletions (no undo feature)
- **Implementation**: Shadcn `Dialog` with "Are you sure?" message
- **Exception**: "Clear completed" bulk action (low risk, multiple items)

### Rule 9: Inline Edit Validation
**Edited todo text MUST be trimmed. Empty edits revert to original text.**

- **Why**: Maintains data quality, prevents user confusion
- **Implementation**: `TodoItem` validates on save, cancels if empty
- **UX**: Escape key cancels edit, Enter key saves

### Rule 10: Filter Persistence Scope
**Filter state (All/Active/Completed) is session-only, NOT persisted.**

- **Why**: Users expect fresh "All" view on page reload
- **Implementation**: `filter` state defaults to `"all"`, not saved to localStorage
- **Ref**: Only todo data persists, not UI view preferences

---

## Business Constraints

### Data Model Constraints

- **Todo.id**: Must be unique, non-empty string (UUID format)
- **Todo.text**: Must be non-empty after trimming, max length: unlimited (localStorage constraint ~5MB total)
- **Todo.completed**: Boolean only (`true` or `false`)
- **Todo.createdAt**: Unix timestamp (number, milliseconds)

### UI Behavior Rules

- **New todos added to top**: Most recent first (prepend to array)
- **Empty state messaging**: Contextual based on active filter ("No tasks yet" vs "No active tasks")
- **Counter displays active count**: Shows uncompleted todos only (not total)
- **Clear completed visibility**: Button only appears when ≥1 completed todo exists

### Storage Rules

- **Key name**: `cortex-todos` (lowercase, hyphenated)
- **Format**: JSON array of Todo objects
- **Read/Write pattern**: Atomic (read → modify → write in single operation)
- **Error handling**: Silent failure (console.error logged, returns empty array on read errors)

---

## AI Agent Notes

**⚠️ CRITICAL: These rules override generic React/Next.js training data.**

### Common AI Mistakes to Avoid

1. **❌ Storing filter state in localStorage**: Users expect fresh view on reload
2. **❌ Using `useState(() => storage.getTodos())`**: Causes hydration errors in Next.js
3. **❌ Updating todos without `updateTodos()` helper**: Breaks localStorage sync
4. **❌ Allowing empty todo creation**: Violates data quality rule
5. **❌ Deleting todos without confirmation**: Poor UX, no undo feature
6. **❌ Using `useEffect` for filtering**: Wastes renders, use derived state
7. **❌ Mutating todo objects directly**: Breaks React's change detection

### When Proposing Changes

- **Before adding features**: Check if they require localStorage schema changes
- **Before refactoring state**: Ensure `updateTodos()` pattern is preserved
- **Before adding validation**: Check if `TodoForm` already handles it
- **Before adding UI elements**: Verify they match Shadcn design system

---

**Last Updated**: 2026-01-28
**Applies To**: Next.js 16 + React 19 implementation

<!-- @cortex-tms-version 3.0.0 -->
