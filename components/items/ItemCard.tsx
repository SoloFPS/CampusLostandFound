import Image from "next/image";
import Link from "next/link";
import { Pin, MapPin, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { Item } from "@/types/item";
import ItemBadge from "./ItemBadge";
import { CATEGORY_OPTIONS } from "@/lib/constants/item-options";

interface ItemCardProps {
  item: Item;
  /** Slight tilt for the "pinned to a corkboard" hero treatment */
  pinned?: boolean;
}

export default function ItemCard({ item, pinned = false }: ItemCardProps) {
  const categoryLabel =
    CATEGORY_OPTIONS.find((c) => c.value === item.category)?.label ?? item.category;

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-paper-raised transition-transform hover:-translate-y-1 hover:shadow-md ${
        pinned ? "rotate-[-1.5deg] hover:rotate-0" : ""
      }`}
    >
      {pinned && (
        <Pin
          className="absolute left-1/2 top-2 z-10 h-5 w-5 -translate-x-1/2 -rotate-45 text-amber-deep drop-shadow"
          fill="var(--color-amber)"
          aria-hidden="true"
        />
      )}

      <div className="relative aspect-[4/3] w-full bg-line">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover"
        />
        <ItemBadge type={item.type} className="absolute left-3 top-3" />
        {item.status === "resolved" && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-ink/85 px-2 py-1 text-xs font-medium text-paper">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Resolved
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-medium leading-snug text-ink">
            {item.title}
          </h3>
          <span className="shrink-0 rounded-md bg-paper px-2 py-0.5 text-xs font-medium text-muted">
            {categoryLabel}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {item.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-muted">{item.description}</p>

        <Link
          href={`/items/${item.id}`}
          className="mt-auto flex items-center justify-center gap-1 rounded-md border border-line py-2 text-sm font-medium text-ink transition-colors hover:border-ink group-hover:bg-ink group-hover:text-paper"
        >
          View Details
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}