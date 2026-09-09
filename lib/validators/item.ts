import { z } from "zod";

export const itemFormSchema = z.object({
  type: z.enum(["lost", "found"], {
    required_error: "Select whether this item is lost or found.",
  }),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(80, "Title must be under 80 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description must be under 500 characters."),
  category: z.enum(
    ["electronics", "accessories", "documents", "clothing", "bags", "keys", "books", "other"],
    { required_error: "Select a category." }
  ),
  location: z.string().min(1, "Select a location."),
  date: z
    .string()
    .min(1, "Select a date.")
    .refine((val) => new Date(val) <= new Date(), {
      message: "Date cannot be in the future.",
    }),
  additionalInfo: z
    .string()
    .max(300, "Keep additional info under 300 characters.")
    .optional(),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;