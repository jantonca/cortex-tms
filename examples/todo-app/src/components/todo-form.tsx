"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Todo } from "@/types/todo";
import { Plus } from "lucide-react";

interface TodoFormProps {
  onAddTodo: (todo: Todo) => void;
}

/**
 * TodoForm Component
 *
 * Handles user input for creating new tasks.
 * Pattern: Controlled Component (React state manages input value).
 *
 * Features:
 * - Validates non-empty input (trims whitespace)
 * - Generates UUIDs using native crypto.randomUUID()
 * - Clears input after successful submission
 * - Supports Enter key submission (via form element)
 * - Accessible (aria-label, sr-only text for icon button)
 */
export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Ignore empty or whitespace-only strings
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // Create new Todo object
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: trimmedText,
      completed: false,
      createdAt: Date.now(),
    };

    onAddTodo(newTodo);
    setText(""); // Reset form
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <Input
        type="text"
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1"
        aria-label="New todo text"
      />
      <Button type="submit" size="icon" disabled={!text.trim()}>
        <Plus className="h-4 w-4" />
        <span className="sr-only">Add Todo</span>
      </Button>
    </form>
  );
}
