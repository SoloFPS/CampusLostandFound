import { Item, ItemFilters } from "@/types/item";
import { ItemFormValues } from "@/lib/validators/item";
import { mockItems } from "@/lib/mock-data";

// All API calls go through this base so no component or page ever
// hardcodes a URL. Same-origin by default, since API routes live inside
// this Next.js app. Only needed if the API is ever split into its own service.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const PAGE_SIZE = 8;

export interface GetItemsResponse {
  items: Item[];
  total: number;
  hasMore: boolean;
}

/**
 * Fetches a filtered, paginated list of items.
 *
 * Currently backed by mock data plus an artificial delay, so loading and
 * error states can be built and reviewed against realistic conditions.
 * Swap the body for `fetch(`${API_BASE_URL}/api/items?...`)` once the
 * route handler exists — the signature and return shape are already
 * API-shaped, so callers won't need to change.
 */
export async function getItems(
  filters: ItemFilters,
  page: number = 1
): Promise<GetItemsResponse> {
  await simulateNetworkDelay();

  const filtered = mockItems.filter((item) => {
    if (filters.type !== "all" && item.type !== filters.type) return false;
    if (filters.category !== "all" && item.category !== filters.category) return false;
    if (filters.location !== "all" && item.location !== filters.location) return false;
    if (filters.date && item.date < filters.date) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = `${item.title} ${item.description}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  return {
    items: pageItems,
    total: filtered.length,
    hasMore: start + PAGE_SIZE < filtered.length,
  };
}

export interface CreateItemPayload extends ItemFormValues {
  image: File | null;
}

/**
 * Placeholder create call — wire this to
 * `POST ${API_BASE_URL}/api/items` (multipart, or JSON + a separate
 * signed Cloudinary upload) once the route handler exists.
 */
export async function createItem(
  payload: CreateItemPayload
): Promise<{ id: string }> {
  await simulateNetworkDelay();
  console.log("createItem payload (placeholder):", payload);
  return { id: "mock-id" };
}

function simulateNetworkDelay(ms: number = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { API_BASE_URL };