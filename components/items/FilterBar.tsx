"use client";

import { RotateCcw } from "lucide-react";
import { CATEGORY_OPTIONS, LOCATION_OPTIONS } from "@/lib/constants/item-options";
import { ItemFilters } from "@/types/item";

interface FilterBarProps {
  filters: ItemFilters;
  onChange: (partial: Partial<ItemFilters>) => void;
  onClear: () => void;
}

export default function FilterBar({ filters, onChange, onClear }: FilterBarProps) {
  const hasActiveFilters =
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.location !== "all" ||
    Boolean(filters.date);

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-line bg-paper-raised p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-type" className="text-xs font-medium text-muted">
          Status
        </label>
        <select
          id="filter-type"
          value={filters.type}
          onChange={(e) => onChange({ type: e.target.value as ItemFilters["type"] })}
          className="rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-amber focus:outline-none"
        >
          <option value="all">All items</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="filter-category" className="text-xs font-medium text-muted">
          Category
        </label>
        <select
          id="filter-category"
          value={filters.category}
          onChange={(e) =>
            onChange({ category: e.target.value as ItemFilters["category"] })
          }
          className="rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-amber focus:outline-none"
        >
          <option value="all">All categories</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="filter-location" className="text-xs font-medium text-muted">
          Location
        </label>
        <select
          id="filter-location"
          value={filters.location}
          onChange={(e) => onChange({ location: e.target.value })}
          className="rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-amber focus:outline-none"
        >
          <option value="all">All locations</option>
          {LOCATION_OPTIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="filter-date" className="text-xs font-medium text-muted">
          From date
        </label>
        <input
          id="filter-date"
          type="date"
          value={filters.date}
          onChange={(e) => onChange({ date: e.target.value })}
          className="rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-amber focus:outline-none"
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-lost hover:bg-lost-bg"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Clear filters
        </button>
      )}
    </div>
  );
}