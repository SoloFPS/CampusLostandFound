import { Item, ItemFilters } from "@/types/item";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export interface GetItemsResponse {
  items: Item[];
  total: number;
  hasMore: boolean;
}

/**
 * Fetches a filtered, paginated list of items from the real API.
 */
export async function getItems(
  filters: ItemFilters,
  page: number = 1
): Promise<GetItemsResponse> {
  const params = new URLSearchParams();
  if (filters.query) params.set("query", filters.query);
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.location !== "all") params.set("location", filters.location);
  if (filters.date) params.set("date", filters.date);
  params.set("page", String(page));

  const res = await fetch(`${API_BASE_URL}/api/items?${params.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch items (${res.status})`);
  }

  return res.json();
}

export interface CreateItemPayload {
  title: string;
  description: string;
  type: Item["type"];
  category: Item["category"];
  location: string;
  date: string;
  image: File | null;
}

/**
 * Uploads the image (if present) then creates the item. Mirrors the
 * two-step flow NewItemForm already does inline — kept here too so any
 * other caller of createItem gets the same real behavior.
 */
export async function createItem(payload: CreateItemPayload): Promise<{ id: string }> {
  const { image, ...fields } = payload;

  if (!image) {
    throw new Error("An image is required.");
  }

  const uploadForm = new FormData();
  uploadForm.append("file", image);

  const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    credentials: "include",
    body: uploadForm,
  });
  if (!uploadRes.ok) {
    const data = await uploadRes.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to upload image");
  }
  const { imageUrl } = await uploadRes.json();

  const res = await fetch(`${API_BASE_URL}/api/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ ...fields, imageUrl }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to create item");
  }

  const data = await res.json();
  return { id: data.item.id };
}

export { API_BASE_URL };