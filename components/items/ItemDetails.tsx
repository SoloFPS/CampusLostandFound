"use client";
import PotentialMatches from "./PotentialMatches";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  MapPin,
  Calendar,
  Clock,
  Tag,
  Flag,
  Pencil,
  Trash2,
  CheckCircle2,
  PackageX,
  PackageCheck,
  ImageOff,
} from "lucide-react";
import ContactPoster from "./ContactPoster";

export type ItemType = "lost" | "found";
export type ItemStatus = "active" | "resolved";

export interface Item {
  id: string;
  type: ItemType;
  status: ItemStatus;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string; // ISO date the item was lost/found
  postedAt: string; // ISO date the post was created
  imageUrl?: string;
  poster: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
}

interface ItemDetailsProps {
  item: Item;
  currentUserId?: string;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function ItemDetails({
  item: initialItem,
  currentUserId,
}: ItemDetailsProps) {
  const router = useRouter();
  const [item, setItem] = useState(initialItem);
  const [isResolving, setIsResolving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = Boolean(currentUserId) && currentUserId === item.poster.id;
  const isLost = item.type === "lost";

  const handleResolve = async () => {
    setIsResolving(true);
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });
      if (!res.ok) throw new Error();
      setItem((prev) => ({ ...prev, status: "resolved" }));
      toast.success("Marked as resolved. Glad it worked out!");
    } catch {
      toast.error("Couldn't update the post. Please try again.");
    } finally {
      setIsResolving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this post? This can't be undone.");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/items/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Post deleted.");
      router.push("/my-posts");
    } catch {
      toast.error("Couldn't delete the post. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleReport = async () => {
    try {
      const res = await fetch(`/api/items/${item.id}/report`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      toast.success("Thanks — our team will take a look.");
    } catch {
      toast.error("Couldn't submit the report. Please try again.");
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg border border-line bg-paper-raised">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted">
            <ImageOff className="h-10 w-10" aria-hidden="true" />
            <p className="text-sm">No image provided</p>
          </div>
        )}

        <span
          className={`absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-paper ${
            isLost ? "bg-lost" : "bg-found"
          }`}
        >
          {isLost ? (
            <PackageX className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <PackageCheck className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {isLost ? "Lost" : "Found"}
        </span>

        {item.status === "resolved" && (
          <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-medium text-paper">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Resolved
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col">
        <h1 className="font-display text-3xl font-semibold text-ink">
          {item.title}
        </h1>

        <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailRow icon={Tag} label="Category" value={item.category} />
          <DetailRow icon={MapPin} label="Location" value={item.location} />
          <DetailRow
            icon={Calendar}
            label={isLost ? "Date lost" : "Date found"}
            value={formatDate(item.date)}
          />
          <DetailRow icon={Clock} label="Posted" value={formatDate(item.postedAt)} />
        </dl>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-ink">Description</h2>
          <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
            {item.description}
          </p>
        </div>

        {/* Poster info */}
        <div className="mt-6 flex items-center gap-3 rounded-md border border-line bg-paper-raised p-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-tint text-sm font-semibold text-amber-deep">
            {item.poster.name.charAt(0)}
          </span>
          <div>
            <p className="text-xs text-muted">Posted by</p>
            <p className="text-sm font-medium text-ink">{item.poster.name}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <ContactPoster
            posterName={item.poster.name}
            email={item.poster.email}
            phone={item.poster.phone}
          />

          <button
            onClick={handleReport}
            className="flex items-center justify-center gap-2 rounded-md border border-line px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-lost hover:text-lost"
          >
            <Flag className="h-4 w-4" aria-hidden="true" />
            Report this post
          </button>

          {isOwner && (
            <div className="mt-2 flex flex-col gap-3 border-t border-line pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Manage your post
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/items/${item.id}/edit`}
                  className="flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-paper"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                </Link>

                {item.status !== "resolved" && (
                  <button
                    onClick={handleResolve}
                    disabled={isResolving}
                    className="flex items-center gap-2 rounded-md bg-found px-4 py-2 text-sm font-medium text-paper hover:opacity-90 disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    {isResolving ? "Updating..." : "Mark as Resolved"}
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 rounded-md border border-lost px-4 py-2 text-sm font-medium text-lost hover:bg-lost-bg disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>

        {isLost && <PotentialMatches itemId={item.id} />}
        
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Tag;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-deep" aria-hidden="true" />
      <div>
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="text-sm font-medium text-ink">{value}</dd>
      </div>
    </div>
  );
}