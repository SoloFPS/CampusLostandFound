"use client";

import { useCallback, useEffect, useState } from "react";
import SearchBar from "@/components/items/SearchBar";
import FilterBar from "@/components/items/FilterBar";
import ItemGrid from "@/components/items/ItemGrid";
import { getItems } from "@/lib/api-client";
import { Item, ItemFilters } from "@/types/item";

const DEFAULT_FILTERS: ItemFilters = {
  query: "",
  type: "all",
  category: "all",
  location: "all",
  date: "",
};

export default function BrowseItemsPage() {
  const [filters, setFilters] = useState<ItemFilters>(DEFAULT_FILTERS);
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulateError, setSimulateError] = useState(false);

  const loadItems = useCallback(
    async (targetPage: number, replace: boolean) => {
      replace ? setIsLoading(true) : setIsLoadingMore(true);
      setError(null);
      try {
        if (simulateError) throw new Error("forced-demo-error");
        const res = await getItems(filters, targetPage);
        setItems((prev) => (replace ? res.items : [...prev, ...res.items]));
        setHasMore(res.hasMore);
        setPage(targetPage);
      } catch {
        setError("We couldn't load items right now. Check your connection and try again.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [filters, simulateError]
  );

  // Reload from page 1 whenever filters (or the demo error toggle) change
  useEffect(() => {
    loadItems(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, simulateError]);

  function updateFilters(partial: Partial<ItemFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Browse items</h1>
          <p className="mt-1 text-sm text-muted">
            Search and filter everything reported by the campus community.
          </p>
        </div>
        {/* Demo-only control so the error state can be reviewed without a backend */}
        <button
          onClick={() => setSimulateError((v) => !v)}
          className="text-xs text-muted underline decoration-dotted hover:text-ink"
        >
          {simulateError ? "Stop simulating error" : "Simulate error (demo)"}
        </button>
      </div>

      <SearchBar
        className="mt-6"
        value={filters.query}
        onChange={(query) => updateFilters({ query })}
        onSearch={(query) => updateFilters({ query })}
      />

      <div className="mt-4">
        <FilterBar filters={filters} onChange={updateFilters} onClear={clearFilters} />
      </div>

      <div className="mt-6">
        <ItemGrid
          items={items}
          isLoading={isLoading}
          error={error}
          onRetry={() => loadItems(1, true)}
          emptyTitle="No items match your search"
          emptyDescription="Try clearing a filter or searching a different keyword."
        />
      </div>

      {!isLoading && !error && hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => loadItems(page + 1, false)}
            disabled={isLoadingMore}
            className="rounded-md border border-line px-6 py-2.5 text-sm font-medium text-ink hover:border-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore ? "Loading more..." : "Load more items"}
          </button>
        </div>
      )}
    </div>
  );
}