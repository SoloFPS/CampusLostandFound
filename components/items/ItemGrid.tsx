import { Item } from "@/types/item";
import ItemCard from "./ItemCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";

interface ItemGridProps {
  items: Item[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

/**
 * Bundles the loading / error / empty / populated states for a list of
 * items so pages don't have to repeat that branching logic themselves.
 */
export default function ItemGrid({
  items,
  isLoading = false,
  error = null,
  onRetry,
  emptyTitle = "No items found",
  emptyDescription = "Try adjusting your filters or search terms.",
}: ItemGridProps) {
  if (isLoading) {
    return <LoadingSpinner label="Loading items..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}