# Implementation Patterns

## [State Management] Centralized State with Atomic Sync

**Rule**: All todo state mutations must update both React state AND localStorage atomically using the `updateTodos` helper.

### ❌ Anti-Pattern (What NOT to do)

```typescript
// DON'T: Update state and storage separately (can desync)
const handleToggle = (id: string) => {
  const updated = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  setTodos(updated);
  // Later... (forgot to call storage.saveTodos)
};
```

### ✅ Canonical Example

**Source File**: `src/app/page.tsx:24-27`

```typescript
// Sync helper: guarantees atomic updates
const updateTodos = (newTodos: Todo[]) => {
  setTodos(newTodos);
  storage.saveTodos(newTodos);
};

// Usage in handlers
const handleToggleTodo = (id: string) => {
  updateTodos(
    todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
  );
};
```

### 🔗 References

- **Domain Logic**: See "Single Source of Truth" rule
- **Gotchas**: `TROUBLESHOOTING.md#localStorage-sync-issues`

---

## [React Hooks] Hydration-Safe localStorage Loading

**Rule**: Load from localStorage AFTER initial render to prevent hydration mismatches in Next.js SSR.

### ❌ Anti-Pattern (What NOT to do)

```typescript
// DON'T: Read localStorage during useState initialization (causes hydration error)
const [todos, setTodos] = useState<Todo[]>(storage.getTodos()); // ❌ SSR mismatch
```

### ✅ Canonical Example

**Source File**: `src/app/page.tsx:17-23`

```typescript
const [todos, setTodos] = useState<Todo[]>([]);
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  const savedTodos = storage.getTodos();
  setTodos(savedTodos);
  setIsLoaded(true);
}, []);

// Prevent flash of empty state
if (!isLoaded) return null;
```

### 🔗 References

- **Architecture**: `ARCHITECTURE.md#data-flow`
- **Gotchas**: `TROUBLESHOOTING.md#hydration-errors`

---

## [Component Design] Derived State Over useEffect

**Rule**: Filter todos during render, not in useEffect. Prefer derived state for calculations.

### ❌ Anti-Pattern (What NOT to do)

```typescript
// DON'T: Use useEffect to compute filtered lists (causes extra renders)
const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

useEffect(() => {
  const filtered = todos.filter(t => filter === 'active' ? !t.completed : true);
  setFilteredTodos(filtered);
}, [todos, filter]);
```

### ✅ Canonical Example

**Source File**: `src/components/todo-list.tsx:40-44`

```typescript
// Calculate filtered list during render (no extra state)
const filteredTodos = todos.filter((todo) => {
  if (filter === "active") return !todo.completed;
  if (filter === "completed") return todo.completed;
  return true; // 'all'
});
```

### 🔗 References

- **React Docs**: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- **Performance**: Avoids cascading renders

---

## [TypeScript] Type-Safe Props with Interfaces

**Rule**: Define explicit interfaces for all component props. Never use `any`.

### ❌ Anti-Pattern (What NOT to do)

```typescript
// DON'T: Use loose types or any
function TodoItem({ todo, onToggle }: any) { ... } // ❌
```

### ✅ Canonical Example

**Source File**: `src/components/todo-item.tsx:8-13`

```typescript
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  // TypeScript ensures all props are correctly typed
}
```

### 🔗 References

- **Schema**: `SCHEMA.md#todo-interface`
- **TypeScript Config**: `tsconfig.json` (strict mode enabled)

---

## [UI/UX] Conditional Rendering for Empty States

**Rule**: Provide contextual, visually engaging empty states for better UX.

### ❌ Anti-Pattern (What NOT to do)

```tsx
// DON'T: Show generic or unclear empty messages
{todos.length === 0 && <p>No items</p>}
```

### ✅ Canonical Example

**Source File**: `src/components/todo-list.tsx:61-75`

```tsx
{isEmpty ? (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-3">
    <div className="rounded-full bg-muted p-3">
      <ListChecks className="h-6 w-6 text-muted-foreground/50" />
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium text-foreground">
        {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
      </p>
      <p className="text-xs text-muted-foreground max-w-[200px]">
        {filter === "all"
          ? "Get started by adding your first task in the input above."
          : `You don't have any tasks marked as ${filter}.`}
      </p>
    </div>
  </div>
) : (
  // Render todo items...
)}
```

### 🔗 References

- **Design System**: Shadcn Card + muted colors
- **Accessibility**: Clear messaging for screen readers

---

## [Form Handling] Controlled Inputs with Validation

**Rule**: Use controlled inputs with inline validation and clear UX feedback.

### ❌ Anti-Pattern (What NOT to do)

```typescript
// DON'T: Use uncontrolled inputs or skip validation
<input ref={inputRef} /> // ❌ No validation, unclear state
```

### ✅ Canonical Example

**Source File**: `src/components/todo-form.tsx:14-39`

```typescript
const [text, setText] = useState("");

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const trimmed = text.trim();
  if (!trimmed) return; // Guard: reject empty input

  onAddTodo({
    id: crypto.randomUUID(),
    text: trimmed,
    completed: false,
    createdAt: Date.now(),
  });

  setText(""); // Clear after success
};

return (
  <form onSubmit={handleSubmit}>
    <Input
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="What needs to be done?"
    />
  </form>
);
```

### 🔗 References

- **Schema**: `SCHEMA.md#todo-creation`
- **Accessibility**: Form labels and ARIA attributes

---

## [Component Architecture] Props-Down, Events-Up

**Rule**: Parent components own state, children receive props and emit events via callbacks.

### ❌ Anti-Pattern (What NOT to do)

```typescript
// DON'T: Let children mutate parent state directly
<TodoItem todo={todo} todos={todos} setTodos={setTodos} /> // ❌ Tight coupling
```

### ✅ Canonical Example

**Source File**: `src/app/page.tsx:83-89`

```typescript
// Parent owns state and handlers
<TodoList
  todos={todos}
  filter={filter}
  onToggle={handleToggleTodo}  // ✅ Event callbacks
  onEdit={handleEditTodo}
  onDelete={handleDeleteTodo}
/>
```

**Child receives callbacks**:
```typescript
// src/components/todo-list.tsx
export function TodoList({ todos, filter, onToggle, onEdit, onDelete }: TodoListProps) {
  // Calls parent's handlers via props
  <TodoItem onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
}
```

### 🔗 References

- **React Docs**: [Lifting State Up](https://react.dev/learn/sharing-state-between-components)
- **Architecture**: `ARCHITECTURE.md#component-hierarchy`

---

## [Accessibility] Semantic HTML + ARIA Labels

**Rule**: Use semantic HTML elements and ARIA attributes for screen reader compatibility.

### ❌ Anti-Pattern (What NOT to do)

```tsx
// DON'T: Use divs for interactive elements
<div onClick={handleDelete}>Delete</div> // ❌ Not keyboard accessible
```

### ✅ Canonical Example

**Source File**: `src/components/todo-item.tsx:88-97`

```tsx
// ✅ Use proper button elements + ARIA
<Button
  variant="ghost"
  size="icon"
  onClick={handleEditClick}
  aria-label="Edit todo"
  className="h-8 w-8"
>
  <Pencil className="h-4 w-4" />
</Button>
```

### 🔗 References

- **Shadcn Components**: Built on Radix UI (ARIA compliant by default)
- **Testing**: Manual keyboard navigation tests

---

## [Performance] Conditional Bulk Actions

**Rule**: Only render bulk action buttons when relevant items exist (avoid layout shift).

### ❌ Anti-Pattern (What NOT to do)

```tsx
// DON'T: Always render buttons (causes layout shift)
<Button onClick={clearCompleted}>Clear completed</Button>
```

### ✅ Canonical Example

**Source File**: `src/app/page.tsx:87-95`

```tsx
const hasCompleted = todos.some((t) => t.completed);

{hasCompleted && (
  <Button
    variant="link"
    size="sm"
    onClick={handleClearCompleted}
    className="text-xs text-destructive h-auto p-0 hover:text-destructive/80"
  >
    Clear completed
  </Button>
)}
```

### 🔗 References

- **UX**: Prevents empty button footprint
- **Performance**: Avoids unnecessary DOM nodes

---

**Last Updated**: 2026-01-12
**Framework**: Next.js 16, React 19, TypeScript 5
