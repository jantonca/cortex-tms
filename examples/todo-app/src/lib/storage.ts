import { Todo } from "@/types/todo";

const STORAGE_KEY = "cortex-todos";

/**
 * Type-safe localStorage abstraction
 *
 * Provides SSR-safe access to browser localStorage for Next.js compatibility.
 * All todo persistence operations flow through this utility to ensure consistent
 * error handling and the atomic "Read-Modify-Write" pattern.
 */
export const storage = {
  /**
   * Fetch all todos from storage
   * @returns Array of todos, or empty array if storage is unavailable/corrupted
   * @description SSR-safe: Returns empty array on server-side (when window is undefined)
   */
  getTodos: (): Todo[] => {
    if (typeof window === "undefined") return [];

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load todos from localStorage:", error);
      return [];
    }
  },

  /**
   * Persist entire todo list to storage
   * @param todos - Complete array of todos to save
   * @description Follows atomic "Read-Modify-Write" pattern defined in ARCHITECTURE.md
   * @description SSR-safe: No-op on server-side
   */
  saveTodos: (todos: Todo[]): void => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error("Failed to save todos to localStorage:", error);
    }
  },

  /**
   * Clear all todos from storage
   * @description Useful for testing or "reset" functionality
   * @description SSR-safe: No-op on server-side
   */
  clear: (): void => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  }
};
