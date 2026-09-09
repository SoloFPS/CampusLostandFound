import { ItemCategory } from "@/types/item";

export const CATEGORY_OPTIONS: { value: ItemCategory; label: string }[] = [
  { value: "electronics", label: "Electronics" },
  { value: "accessories", label: "Accessories" },
  { value: "documents", label: "Documents" },
  { value: "clothing", label: "Clothing" },
  { value: "bags", label: "Bags" },
  { value: "keys", label: "Keys" },
  { value: "books", label: "Books" },
  { value: "other", label: "Other" },
];

export const LOCATION_OPTIONS: string[] = [
  "Library",
  "Student Union",
  "Computer Science Building",
  "Recreation Center",
  "Cafeteria",
  "Lecture Hall Complex",
  "Dormitories",
  "Parking Lot",
  "Other",
];