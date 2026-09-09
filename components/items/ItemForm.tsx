"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PackageX, PackageCheck } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { itemFormSchema, ItemFormValues } from "@/lib/validators/item";
import { CATEGORY_OPTIONS, LOCATION_OPTIONS } from "@/lib/constants/item-options";
import { createItem } from "@/lib/api-client";

interface ItemFormProps {
  mode?: "create" | "edit";
  defaultValues?: Partial<ItemFormValues>;
  initialImageUrl?: string;
  /** Inject a custom submit handler (e.g. updateItem) to reuse this form for editing */
  onSubmitItem?: (values: ItemFormValues, image: File | null) => Promise<void>;
}

export default function ItemForm({
  mode = "create",
  defaultValues,
  initialImageUrl,
  onSubmitItem,
}: ItemFormProps) {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      type: "lost",
      title: "",
      description: "",
      location: "",
      date: "",
      additionalInfo: "",
      ...defaultValues,
    },
  });

  const selectedType = watch("type");

  async function onSubmit(values: ItemFormValues) {
    // A photo is required for new posts; editing can keep the existing one
    if (mode === "create" && !imageFile) {
      setImageError("Please add a photo of the item.");
      return;
    }

    try {
      if (onSubmitItem) {
        await onSubmitItem(values, imageFile);
      } else {
        // Placeholder submission until POST /api/items exists
        await createItem({ ...values, image: imageFile });
      }
      toast.success(
        mode === "create" ? "Item reported successfully." : "Item updated successfully."
      );
      router.push("/items");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Lost / Found toggle */}
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-ink">
          Is this item lost or found?
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <label
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border py-2.5 text-sm font-medium transition-colors ${
              selectedType === "lost"
                ? "border-lost bg-lost-bg text-lost"
                : "border-line text-muted hover:border-ink-soft"
            }`}
          >
            <input type="radio" value="lost" {...register("type")} className="sr-only" />
            <PackageX className="h-4 w-4" aria-hidden="true" />
            Lost
          </label>
          <label
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border py-2.5 text-sm font-medium transition-colors ${
              selectedType === "found"
                ? "border-found bg-found-bg text-found"
                : "border-line text-muted hover:border-ink-soft"
            }`}
          >
            <input type="radio" value="found" {...register("type")} className="sr-only" />
            <PackageCheck className="h-4 w-4" aria-hidden="true" />
            Found
          </label>
        </div>
        {errors.type && <p className="mt-1.5 text-sm text-lost">{errors.type.message}</p>}
      </fieldset>

      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-ink">
          Item title
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Black North Face Backpack"
          {...register("title")}
          aria-invalid={!!errors.title}
          className="w-full rounded-md border border-line bg-paper-raised px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-amber focus:outline-none"
        />
        {errors.title && <p className="mt-1.5 text-sm text-lost">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe the item, where it was, and any distinguishing details."
          {...register("description")}
          aria-invalid={!!errors.description}
          className="w-full rounded-md border border-line bg-paper-raised px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-amber focus:outline-none"
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-lost">{errors.description.message}</p>
        )}
      </div>

      {/* Category + Location */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-ink">
            Category
          </label>
          <select
            id="category"
            {...register("category")}
            defaultValue=""
            aria-invalid={!!errors.category}
            className="w-full rounded-md border border-line bg-paper-raised px-3 py-2.5 text-sm text-ink focus:border-amber focus:outline-none"
          >
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1.5 text-sm text-lost">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-ink">
            Location
          </label>
          <select
            id="location"
            {...register("location")}
            defaultValue=""
            aria-invalid={!!errors.location}
            className="w-full rounded-md border border-line bg-paper-raised px-3 py-2.5 text-sm text-ink focus:border-amber focus:outline-none"
          >
            <option value="" disabled>
              Select a location
            </option>
            {LOCATION_OPTIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {errors.location && (
            <p className="mt-1.5 text-sm text-lost">{errors.location.message}</p>
          )}
        </div>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-ink">
          Date {selectedType === "lost" ? "lost" : "found"}
        </label>
        <input
          id="date"
          type="date"
          max={new Date().toISOString().split("T")[0]}
          {...register("date")}
          aria-invalid={!!errors.date}
          className="w-full rounded-md border border-line bg-paper-raised px-3 py-2.5 text-sm text-ink focus:border-amber focus:outline-none sm:w-1/2"
        />
        {errors.date && <p className="mt-1.5 text-sm text-lost">{errors.date.message}</p>}
      </div>

      {/* Image */}
      <ImageUpload
        initialImageUrl={initialImageUrl}
        onChange={(file) => {
          setImageFile(file);
          if (file) setImageError(undefined);
        }}
        error={imageError}
      />

      {/* Additional info */}
      <div>
        <label htmlFor="additionalInfo" className="mb-1.5 block text-sm font-medium text-ink">
          Additional information <span className="text-muted">(optional)</span>
        </label>
        <textarea
          id="additionalInfo"
          rows={3}
          placeholder="Anything else that might help — e.g. a reward, or the best time to contact you."
          {...register("additionalInfo")}
          className="w-full rounded-md border border-line bg-paper-raised px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-amber focus:outline-none"
        />
        {errors.additionalInfo && (
          <p className="mt-1.5 text-sm text-lost">{errors.additionalInfo.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-ink py-3 text-sm font-medium text-paper transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {isSubmitting
          ? mode === "create"
            ? "Posting..."
            : "Saving..."
          : mode === "create"
            ? "Post item"
            : "Save changes"}
      </button>
    </form>
  );
}