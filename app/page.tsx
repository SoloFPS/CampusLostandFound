import Link from "next/link";
import { Search, PackageX, PackageCheck } from "lucide-react";
import SearchBar from "@/components/items/SearchBar";
import ItemCard from "@/components/items/ItemCard";
import { connectDB } from "@/lib/db";
import ItemModel from "@/models/Item";
import type { Item } from "@/types/item";

import { serializeItems } from "@/lib/serializers/item";

async function getHomePageData() {
  await connectDB();

  const [recentItemsRaw, pinnedPreviewRaw, totalCount, resolvedCount, activeCount] =
    await Promise.all([
      ItemModel.find().sort({ createdAt: -1 }).limit(4).lean(),
      ItemModel.find().sort({ createdAt: -1 }).limit(3).lean(),
      ItemModel.countDocuments(),
      ItemModel.countDocuments({ status: "resolved" }),
      ItemModel.countDocuments({ status: "active" }),
    ]);

  return {
    recentItems: serializeItems(recentItemsRaw),
    pinnedPreview: serializeItems(pinnedPreviewRaw),
    stats: [
      { label: "Items posted", value: totalCount },
      { label: "Successfully reunited", value: resolvedCount },
      { label: "Currently active", value: activeCount },
    ],
  };
}

export default async function HomePage() {
  const { recentItems, pinnedPreview, stats } = await getHomePageData();

  return (
    <>
      {/* Hero */}
      <section className="bg-pinboard border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Lost something on campus?
              <br />
              Someone may have found it.
            </h1>
            <p className="mt-4 max-w-md text-base text-muted">
              A shared board for students and staff to report lost items,
              post what they've found, and reconnect belongings with their
              owners — no middleman, no waiting at the front desk.
            </p>

            <SearchBar className="mt-8" />

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/items/new?type=lost"
                className="flex items-center gap-2 rounded-md bg-lost px-5 py-2.5 text-sm font-medium text-paper hover:opacity-90"
              >
                <PackageX className="h-4 w-4" aria-hidden="true" />
                Report Lost Item
              </Link>
              <Link
                href="/items/new?type=found"
                className="flex items-center gap-2 rounded-md bg-found px-5 py-2.5 text-sm font-medium text-paper hover:opacity-90"
              >
                <PackageCheck className="h-4 w-4" aria-hidden="true" />
                Report Found Item
              </Link>
            </div>
          </div>

          {/* Pinned preview cards */}
          <div className="hidden grid-cols-2 items-center gap-5 md:grid">
            {pinnedPreview.map((item, i) => (
              <div key={item.id} className={i === 2 ? "col-span-2 mx-auto w-2/3" : ""}>
                <ItemCard item={item} pinned />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-paper-raised">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-semibold text-ink">
                {stat.value.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recently posted */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Recently posted
            </h2>
            <p className="mt-1 text-sm text-muted">
              The latest items reported by the campus community.
            </p>
          </div>
          <Link
            href="/items"
            className="hidden items-center gap-1 text-sm font-medium text-amber-deep hover:underline sm:flex"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Browse all items
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        <Link
          href="/items"
          className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-amber-deep hover:underline sm:hidden"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Browse all items
        </Link>
      </section>
    </>
  );
}