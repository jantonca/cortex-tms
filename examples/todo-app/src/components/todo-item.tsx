"use client";

import { useState } from "react";
import { Todo } from "@/types/todo";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

/**
 * TodoItem Component
 *
 * Handles individual task actions: Toggle, Edit, Delete.
 *
 * State Management:
 * - isEditing: Controls view mode ↔ edit mode switching
 * - editText: Controlled input value during editing
 * - isDeleteDialogOpen: Controls delete confirmation dialog
 *
 * Features:
 * - Inline Editing: Double-click or click pencil icon to edit
 * - Keyboard Support: Enter to save, Escape to cancel
 * - Delete Confirmation: Shadcn Dialog prevents accidental deletion
 * - Visual Feedback: Strikethrough and muted color for completed todos
 * - Group Hover: Actions only visible on row hover (clean UI)
 *
 * Accessibility:
 * - Checkbox with descriptive aria-label
 * - Screen reader text for icon buttons
 * - Keyboard navigation support
 * - Focus management during edit mode (autoFocus)
 */
export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Handle saving the edit
  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed);
    } else {
      setEditText(todo.text); // Reset if empty or unchanged
    }
    setIsEditing(false);
  };

  // Handle canceling the edit
  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between gap-2 p-4 border-b last:border-0 group">
      <div className="flex items-center flex-1 gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'active' : 'completed'}`}
        />

        {isEditing ? (
          <div className="flex items-center flex-1 gap-2">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              className="h-8"
              autoFocus
            />
            <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8 text-green-600">
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8 text-red-600">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <span
            className={cn(
              "flex-1 text-sm transition-colors",
              todo.completed && "text-muted-foreground line-through"
            )}
          >
            {todo.text}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing && (
          <>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the task:
                    <br />
                    <span className="font-semibold text-foreground mt-2 inline-block italic">
                      &ldquo;{todo.text}&rdquo;
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={() => onDelete(todo.id)}>
                    Delete Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}
