"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
  PackageX,
  PackageCheck,
  Tag,
  MapPin,
  Calendar,
  ImagePlus,
  Loader2,
  Send,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  newItemFormSchema,
  type NewItemFormInput,
} from "@/lib/validators/item";
import { ITEM_CATEGORIES } from "@/types/item";

interface NewItemFormProps {
  defaultType?: "lost" | "found";
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function NewItemForm({
  defaultType = "lost",
}: NewItemFormProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewItemFormInput>({
    resolver: zodResolver(newItemFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: defaultType,
      category: "other",
      location: "",
      date: new Date().toISOString().slice(0, 10),
    },
  });

  const selectedType = watch("type");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Only JPEG, PNG, WEBP, or GIF images are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setImageError("Image must be under 5MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
  };

  const onSubmit = async (values: NewItemFormInput) => {

    
    if (!user) {
      toast.error("Please log in to post an item.");
      router.push("/login");
      return;
    }
    if (!imageFile) {
      setImageError("Please add a photo of the item.");
      return;
    }

    try {
      setIsUploading(true);
      const uploadForm = new FormData();
      uploadForm.append("file", imageFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: uploadForm,
      });
      setIsUploading(false);

      if (!uploadRes.ok) {
        const data = await uploadRes.json().catch(() => null);
        toast.error(
          data?.error ?? "Couldn't upload the image. Please try again.",
        );
        return;
      }
      const { imageUrl } = await uploadRes.json();

      // imageUrl is attached here, after form-level validation already
      // passed — this is the piece that used to block validation entirely.
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...values, imageUrl }),
      });

      if (res.status === 400) {
        toast.error("Please check the form for errors.");
        return;
      }
      if (res.status === 401) {
        toast.error("Please log in to post an item.");
        router.push("/login");
        return;
      }
      if (!res.ok) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      const data = await res.json();
      toast.success(
        selectedType === "lost" ? "Lost item reported." : "Found item posted.",
      );
      router.push(`/items/${data.item.id}`);
    } catch {
      toast.error(
        "Couldn't reach the server. Check your connection and try again.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      {/* Type toggle */}
      <div>
        <label className="text-sm font-medium text-ink">Post type</label>
        <div className="mt-1.5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue("type", "lost")}
            className={`flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
              selectedType === "lost"
                ? "border-lost bg-lost text-paper"
                : "border-line text-ink-soft hover:bg-paper"
            }`}
          >
            <PackageX className="h-4 w-4" aria-hidden="true" />
            Lost
          </button>
          <button
            type="button"
            onClick={() => setValue("type", "found")}
            className={`flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
              selectedType === "found"
                ? "border-found bg-found text-paper"
                : "border-line text-ink-soft hover:bg-paper"
            }`}
          >
            <PackageCheck className="h-4 w-4" aria-hidden="true" />
            Found
          </button>
        </div>
      </div>

      {/* Image upload */}
      <div>
        <label className="text-sm font-medium text-ink">Photo</label>
        <div className="mt-1.5">
          {imagePreview ? (
            <div className="relative h-48 w-full overflow-hidden rounded-md border border-line">
              <Image
                src={imagePreview}
                alt="Selected item"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink/80 text-paper hover:bg-ink"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="image"
              className="flex h-48 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line bg-paper text-muted hover:border-amber-deep hover:text-amber-deep"
            >
              <ImagePlus className="h-8 w-8" aria-hidden="true" />
              <span className="text-sm font-medium">Click to add a photo</span>
              <span className="text-xs">
                JPEG, PNG, WEBP, or GIF — up to 5MB
              </span>
              <input
                id="image"
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        {imageError && <p className="mt-1 text-xs text-lost">{imageError}</p>}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="text-sm font-medium text-ink">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Black North Face backpack"
          className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-amber-deep"
          {...register("title")}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-lost">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="text-sm font-medium text-ink">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Include distinguishing details — color, brand, contents, any identifying marks."
          className="mt-1.5 w-full resize-none rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-amber-deep"
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-lost">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="text-sm font-medium text-ink">
            Category
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-md border border-line bg-paper px-3 focus-within:border-amber-deep">
            <Tag className="h-4 w-4 text-muted" aria-hidden="true" />
            <select
              id="category"
              className="w-full bg-transparent py-2.5 text-sm text-ink outline-none"
              {...register("category")}
            >
              {ITEM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="mt-1 text-xs text-lost">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="text-sm font-medium text-ink">
            Location
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-md border border-line bg-paper px-3 focus-within:border-amber-deep">
            <MapPin className="h-4 w-4 text-muted" aria-hidden="true" />
            <input
              id="location"
              type="text"
              placeholder="e.g. Main Library, 2nd Floor"
              className="w-full bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-muted"
              {...register("location")}
            />
          </div>
          {errors.location && (
            <p className="mt-1 text-xs text-lost">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="date" className="text-sm font-medium text-ink">
            {selectedType === "lost" ? "Date lost" : "Date found"}
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-md border border-line bg-paper px-3 focus-within:border-amber-deep">
            <Calendar className="h-4 w-4 text-muted" aria-hidden="true" />
            <input
              id="date"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              className="w-full bg-transparent py-2.5 text-sm text-ink outline-none"
              {...register("date")}
            />
          </div>
          {errors.date && (
            <p className="mt-1 text-xs text-lost">{errors.date.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className={`mt-2 flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium text-paper hover:opacity-90 disabled:opacity-60 ${
          selectedType === "lost" ? "bg-lost" : "bg-found"
        }`}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Uploading photo...
          </>
        ) : isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Posting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            {selectedType === "lost" ? "Report Lost Item" : "Report Found Item"}
          </>
        )}
      </button>
    </form>
  );
}
