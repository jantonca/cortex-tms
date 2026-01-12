/**
 * Core Todo entity definition
 *
 * This interface serves as the single source of truth for the Todo data model.
 * All components and utilities must use this type to prevent type drift.
 */
export interface Todo {
  id: string;          // UUID v4
  text: string;        // The task description
  completed: boolean;  // Task status
  createdAt: number;   // Unix timestamp for sorting
}

/**
 * Filter types for the UI
 *
 * Used by TodoFilters component to determine which todos to display:
 * - 'all': Show all todos
 * - 'active': Show only incomplete todos
 * - 'completed': Show only completed todos
 */
export type TodoFilter = 'all' | 'active' | 'completed';
