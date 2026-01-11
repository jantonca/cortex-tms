"use client";

import { Todo, TodoFilter } from "@/types/todo";
import { TodoItem } from "@/components/todo-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  filter: TodoFilter;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

/**
 * TodoList Component
 *
 * Manages the display and filtering of tasks.
 *
 * Pattern: Derived State (no useEffect for filtering)
 * - Filtering happens during render cycle
 * - Performance: Only recalculates when todos or filter change
 * - Simplicity: No extra state management needed
 *
 * Features:
 * - Dynamic filtering based on filter prop ('all', 'active', 'completed')
 * - Empty state messages (contextual based on filter type)
 * - Visual card container with header + count badge
 * - Passes through callbacks to TodoItem (onToggle, onEdit, onDelete)
 *
 * UI/UX:
 * - Shadcn Card wrapper (elevation, border, padding)
 * - Header with ListChecks icon + title
 * - Count badge showing filtered total
 * - Empty state with helpful message
 */
export function TodoList({ todos, filter, onToggle, onEdit, onDelete }: TodoListProps) {
  // Derived state: calculate filtered list based on the active filter
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true; // 'all'
  });

  const isEmpty = filteredTodos.length === 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">Tasks</CardTitle>
          <span className="ml-auto text-xs font-medium text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
            {filteredTodos.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <p className="text-sm text-muted-foreground italic">
              {filter === "all"
                ? "No tasks found. Add one above to get started!"
                : `No ${filter} tasks found.`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
