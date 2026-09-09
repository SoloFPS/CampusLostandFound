export type ItemType = "lost" | "found";

export type ItemCategory =
  | "electronics"
  | "accessories"
  | "documents"
  | "clothing"
  | "bags"
  | "keys"
  | "books"
  | "other";

export type ItemStatus = "active" | "resolved";

export interface Item {
  id: string;
  title: string;
  description: string;
  type: ItemType;
  category: ItemCategory;
  location: string;
  date: string; // ISO date string
  imageUrl: string;
  status: ItemStatus;
  postedBy: {
    id: string;
    name: string;
  };
}

export interface ItemFilters {
  query: string;
  type: ItemType | "all";
  category: ItemCategory | "all";
  location: string; // "all" or a specific location
  date: string; // "from" date as ISO string, or "" for no filter
}