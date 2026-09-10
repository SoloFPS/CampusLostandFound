"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inbox, ServerCrash, Loader2, PlusCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import MyPostCard from "@/components/items/MyPostCard";
import type { Item } from "@/types/item";

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; items: Item[] };

export default function MyPostsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [state, setState] = useState<FetchState>({ status: "loading" });

  const fetchPosts = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/items/mine", { credentials: "include" });
      if (!res.ok) {
        setState({ status: "error", message: `Couldn't load your posts (${res.status}).` });
        return;
      }
      const data = await res.json();
      setState({ status: "success", items: data.items ?? [] });
    } catch {
      setState({
        status: "error",
        message: "Couldn't reach the server. Check your connection and try again.",
      });
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    fetchPosts();
  }, [authLoading, user, router, fetchPosts]);

  const handleDeleted = (id: string) => {
    setState((prev) =>
      prev.status === "success" ? { status: "success", items: prev.items.filter((i) => i.id !== id) } : prev
    );
  };

  const handleResolved = (id: string) => {
    setState((prev) =>
      prev.status === "success"
        ? { status: "success", items: prev.items.map((i) => (i.id === id ? { ...i, status: "resolved" } : i)) }
        : prev
    );
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">My Posts</h1>
          <p className="mt-1 text-sm text-muted">Everything you&apos;ve reported as lost or found.</p>
        </div>
        <Link
          href="/items/new"
          className="hidden items-center gap-1.5 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-soft sm:flex"
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          New post
        </Link>
      </div>

      <div className="mt-6">
        {state.status === "loading" && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-lg border border-line bg-paper-raised" />
            ))}
          </div>
        )}

        {state.status === "error" && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-line bg-paper-raised px-6 py-16 text-center">
            <ServerCrash className="h-10 w-10 text-muted" aria-hidden="true" />
            <p className="max-w-sm text-sm text-muted">{state.message}</p>
            <button
              onClick={fetchPosts}
              className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-soft"
            >
              Try again
            </button>
          </div>
        )}

        {state.status === "success" && state.items.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-line bg-paper-raised px-6 py-16 text-center">
            <Inbox className="h-10 w-10 text-muted" aria-hidden="true" />
            <h2 className="font-display text-xl font-semibold text-ink">No posts yet</h2>
            <p className="max-w-sm text-sm text-muted">
              Lost something or found someone else&apos;s item? Post it so the campus community can help.
            </p>
            <Link
              href="/items/new"
              className="mt-2 flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-soft"
            >
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Create your first post
            </Link>
          </div>
        )}

        {state.status === "success" && state.items.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {state.items.map((item) => (
              <MyPostCard key={item.id} item={item} onDeleted={handleDeleted} onResolved={handleResolved} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}