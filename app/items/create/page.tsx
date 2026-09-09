import ItemForm from "@/components/items/ItemForm";
import { ItemType } from "@/types/item";

interface CreateItemPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function CreateItemPage({ searchParams }: CreateItemPageProps) {
  const params = await searchParams;
  const initialType: ItemType = params.type === "found" ? "found" : "lost";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Report an item</h1>
      <p className="mt-1 text-sm text-muted">
        Fill in as much detail as you can — clear details make it easier for someone to
        recognize their item.
      </p>

      <div className="mt-8 rounded-lg border border-line bg-paper-raised p-6 sm:p-8">
        <ItemForm mode="create" defaultValues={{ type: initialType }} />
      </div>
    </div>
  );
}