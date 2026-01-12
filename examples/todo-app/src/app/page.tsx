"use client";

import { useState, useEffect } from "react";
import { Todo, TodoFilter } from "@/types/todo";
import { storage } from "@/lib/storage";
import { TodoForm } from "@/components/todo-form";
import { TodoList } from "@/components/todo-list";
import { TodoFilters } from "@/components/todo-filters";
import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize: Load todos from storage on mount
  useEffect(() => {
    const savedTodos = storage.getTodos();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Valid pattern for hydration-safe localStorage loading in Next.js
    setTodos(savedTodos);
    setIsLoaded(true);
  }, []);

  // Sync: Helper to update state and storage simultaneously
  const updateTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
    storage.saveTodos(newTodos);
  };

  // Handlers
  const handleAddTodo = (todo: Todo) => {
    updateTodos([todo, ...todos]); // Add new at top
  };

  const handleToggleTodo = (id: string) => {
    updateTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleEditTodo = (id: string, text: string) => {
    updateTodos(todos.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  const handleDeleteTodo = (id: string) => {
    updateTodos(todos.filter((t) => t.id !== id));
  };

  const handleClearCompleted = () => {
    updateTodos(todos.filter((t) => !t.completed));
  };

  // Derived state
  const hasCompleted = todos.some((t) => t.completed);

  // Prevent flash of empty state during hydration
  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-2xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col items-center sm:items-start gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <ListTodo className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Cortex Tasks
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            A TMS reference implementation built with Next.js 15
          </p>
        </header>

        {/* Action Section */}
        <div className="space-y-6">
          <TodoForm onAddTodo={handleAddTodo} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TodoFilters
              currentFilter={filter}
              onFilterChange={setFilter}
            />
            <div className="flex items-center gap-4 justify-between sm:justify-end">
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
              <div className="text-xs text-muted-foreground italic">
                {todos.filter(t => !t.completed).length} items remaining
              </div>
            </div>
          </div>

          <TodoList
            todos={todos}
            filter={filter}
            onToggle={handleToggleTodo}
            onEdit={handleEditTodo}
            onDelete={handleDeleteTodo}
          />
        </div>

        {/* Footer info */}
        <footer className="pt-8 text-center text-xs text-muted-foreground border-t">
          <p>Built with Cortex TMS Documentation Standards</p>
        </footer>
      </div>
    </main>
  );
}
