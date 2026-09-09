"use client";

import { useState, FormEvent } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  /** Fires on every keystroke — used to drive live filtering */
  onChange?: (query: string) => void;
  /** Fires on submit/enter */
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchBar({
  value,
  defaultValue = "",
  placeholder = "Search for an item (e.g. water bottle, backpack, ID card)",
  onChange,
  onSearch,
  className = "",
}: SearchBarProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const query = isControlled ? value : internalValue;

  function handleChange(next: string) {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch?.(query.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={`flex items-center gap-2 rounded-lg border border-line bg-paper-raised p-1.5 shadow-sm ${className}`}
    >
      <Search className="ml-2 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
      <label htmlFor="item-search" className="sr-only">
        Search items
      </label>
      <input
        id="item-search"
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent py-2 text-sm text-ink placeholder:text-muted focus:outline-none"
      />
      {query && (
        <button
          type="button"
          onClick={() => handleChange("")}
          aria-label="Clear search"
          className="text-muted hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <button
        type="submit"
        className="shrink-0 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
      >
        Search
      </button>
    </form>
  );
}