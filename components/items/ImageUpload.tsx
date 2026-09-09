"use client";

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  initialImageUrl?: string;
  onChange: (file: File | null) => void;
  error?: string;
}

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUpload({ initialImageUrl, onChange, error }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialImageUrl ?? null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setLocalError("Please upload a JPG, PNG, or WEBP image.");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setLocalError(`Image must be smaller than ${MAX_SIZE_MB}MB.`);
        return;
      }
      setLocalError(null);
      setPreview(URL.createObjectURL(file));
      onChange(file);
    },
    [onChange]
  );

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0]);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  function handleRemove() {
    setPreview(null);
    setLocalError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const displayError = error ?? localError;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">Item photo</label>

      {preview ? (
        <div className="relative h-48 w-full overflow-hidden rounded-lg border border-line">
          <Image src={preview} alt="Selected item preview" fill className="object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove selected image"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/80 text-paper hover:bg-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          className={`flex h-48 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-center transition-colors ${
            isDragging ? "border-amber bg-amber-tint" : "border-line hover:border-ink-soft"
          }`}
        >
          <Upload className="h-7 w-7 text-muted" aria-hidden="true" />
          <p className="text-sm text-ink-soft">
            <span className="font-medium text-amber-deep">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted">JPG, PNG or WEBP, up to {MAX_SIZE_MB}MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleInputChange}
        className="sr-only"
        aria-label="Upload item photo"
      />

      {displayError && (
        <p className="mt-1.5 text-sm text-lost" role="alert">
          {displayError}
        </p>
      )}
    </div>
  );
}