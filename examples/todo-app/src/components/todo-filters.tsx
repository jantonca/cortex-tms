"use client";

import { TodoFilter } from "@/types/todo";
import { Button } from "@/components/ui/button";

interface TodoFiltersProps {
  currentFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}

export function TodoFilters({ currentFilter, onFilterChange }: TodoFiltersProps) {
  const filters: { label: string; value: TodoFilter }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="flex items-center gap-2 justify-center sm:justify-start">
      {filters.map((f) => (
        <Button
          key={f.value}
          variant={currentFilter === f.value ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(f.value)}
          className="capitalize transition-all"
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
}
