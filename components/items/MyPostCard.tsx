"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  MapPin,
  Calendar,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  PackageX,
  PackageCheck,
  ImageOff,
  Loader2,
} from "lucide-react";
import type { Item } from "@/types/item";

interface MyPostCardProps {
  item: Item;
  onDeleted: (id: string) => void;
  onResolved: (id: string) => void;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function MyPostCard({ item, onDeleted, onResolved }: MyPostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const isLost = item.type === "lost";

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete "${item.title}"? This can't be undone.`);
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/items/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Post deleted.");
      onDeleted(item.id);
    } catch {
      toast.error("Couldn't delete the post. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleResolve = async () => {
    setIsResolving(true);
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Marked as resolved.");
      onResolved(item.id);
    } catch {
      toast.error("Couldn't update the post. Please try again.");
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-line bg-paper-raised">
      <div className="relative aspect-[4/3] bg-paper">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-muted">
            <ImageOff className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
        <span
          className={`absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-paper ${
            isLost ? "bg-lost" : "bg-found"
          }`}
        >
          {isLost ? (
            <PackageX className="h-3 w-3" aria-hidden="true" />
          ) : (
            <PackageCheck className="h-3 w-3" aria-hidden="true" />
          )}
          {isLost ? "Lost" : "Found"}
        </span>
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${
            item.status === "resolved" ? "bg-ink text-paper" : "bg-amber-tint text-amber-deep"
          }`}
        >
          {item.status === "resolved" ? "Resolved" : "Active"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-semibold text-ink">{item.title}</h3>
        <div className="mt-2 flex flex-col gap-1 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {item.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(item.date)}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/items/${item.id}`}
            className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-paper"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            View
          </Link>
          <Link
            href={`/items/${item.id}/edit`}
            className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-paper"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </Link>
          {item.status !== "resolved" && (
            <button
              onClick={handleResolve}
              disabled={isResolving}
              className="flex items-center gap-1.5 rounded-md bg-found px-3 py-1.5 text-xs font-medium text-paper hover:opacity-90 disabled:opacity-60"
            >
              {isResolving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Resolved
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 rounded-md border border-lost px-3 py-1.5 text-xs font-medium text-lost hover:bg-lost-bg disabled:opacity-60"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}