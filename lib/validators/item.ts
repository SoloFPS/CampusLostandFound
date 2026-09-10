import { z } from "zod";
import { ITEM_TYPES, ITEM_CATEGORIES } from "@/types/item";

// Fields the user actually fills in via the form. No imageUrl here —
// that's set programmatically after the Cloudinary upload succeeds,
// so RHF must never validate it as part of form submission.
export const newItemFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().min(10, "Add a bit more detail (10+ characters)").max(2000),
  type: z.enum(ITEM_TYPES as [string, ...string[]]),
  category: z.enum(ITEM_CATEGORIES as [string, ...string[]]),
  location: z.string().min(2, "Location is required").max(200),
  date: z.string().min(1, "Date is required"),
});
export type NewItemFormInput = z.infer<typeof newItemFormSchema>;

// Full shape the server validates, after imageUrl has been attached.
export const newItemSchema = newItemFormSchema.extend({
  imageUrl: z.string().url("Missing or invalid image URL"),
});
export type NewItemInput = z.infer<typeof newItemSchema>;