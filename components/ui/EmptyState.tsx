"use client";

import { LucideIcon, PackageSearch } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon = PackageSearch,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line px-6 py-14 text-center">
      <Icon className="h-9 w-9 text-muted" aria-hidden="true" />
      <h3 className="font-display text-base font-medium text-ink">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-muted">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-soft"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}