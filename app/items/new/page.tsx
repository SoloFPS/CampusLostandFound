"use client";

import { useSearchParams } from "next/navigation";
import NewItemForm from "@/components/items/NewItemForm";

export default function NewItemPage() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const defaultType = typeParam === "found" ? "found" : "lost";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Report an item</h1>
      <p className="mt-1 text-sm text-muted">
        Add as much detail as you can — it makes it easier for someone to recognize their item.
      </p>

      <div className="mt-6 rounded-lg border border-line bg-paper-raised p-6">
        <NewItemForm defaultType={defaultType} />
      </div>
    </div>
  );
}