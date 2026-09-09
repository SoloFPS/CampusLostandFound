"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  PackageSearch,
  ServerCrash,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import ItemDetails, { type Item } from "@/components/items/ItemDetails";

// TODO: replace with real session state from an auth hook/context
// once /api/auth/me is wired up. Mirrors the placeholder in Navbar.tsx.
const CURRENT_USER_ID = "user_aditi_r";

type FetchState =
  | { status: "loading" }
  | { status: "invalid" }
  | { status: "not-found" }
  | { status: "error"; message: string }
  | { status: "success"; item: Item };

export default function ItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [state, setState] = useState<FetchState>({ status: "loading" });

  const fetchItem = useCallback(async () => {
    if (!id || id.trim().length === 0) {
      setState({ status: "invalid" });
      return;
    }

    setState({ status: "loading" });

    try {
      const res = await fetch(`/api/items/${encodeURIComponent(id)}`);

      if (res.status === 400) {
        setState({ status: "invalid" });
        return;
      }
      if (res.status === 404) {
        setState({ status: "not-found" });
        return;
      }
      if (!res.ok) {
        setState({
          status: "error",
          message: `Something went wrong (${res.status}). Please try again.`,
        });
        return;
      }

      const data = (await res.json()) as Item;
      setState({ status: "success", item: data });
    } catch {
      setState({
        status: "error",
        message: "Couldn't reach the server. Check your connection and try again.",
      });
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <button
        onClick={() => router.push("/items")}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to browse
      </button>

      {state.status === "loading" && <LoadingState />}
      {state.status === "invalid" && <InvalidState />}
      {state.status === "not-found" && <NotFoundState />}
      {state.status === "error" && (
        <ErrorState message={state.message} onRetry={fetchItem} />
      )}
      {state.status === "success" && (
        <ItemDetails item={state.item} currentUserId={CURRENT_USER_ID} />
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid animate-pulse gap-8 md:grid-cols-2" aria-busy="true">
      <div className="aspect-square rounded-lg border border-line bg-paper-raised" />
      <div className="flex flex-col gap-4">
        <div className="h-8 w-2/3 rounded bg-paper-raised" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 rounded bg-paper-raised" />
          <div className="h-10 rounded bg-paper-raised" />
          <div className="h-10 rounded bg-paper-raised" />
          <div className="h-10 rounded bg-paper-raised" />
        </div>
        <div className="h-24 rounded bg-paper-raised" />
        <div className="h-12 rounded bg-paper-raised" />
      </div>
    </div>
  );
}

function EmptyPanel({
  icon: Icon,
  title,
  message,
  children,
}: {
  icon: typeof PackageSearch;
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-line bg-paper-raised px-6 py-16 text-center">
      <Icon className="h-10 w-10 text-muted" aria-hidden="true" />
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <p className="max-w-sm text-sm text-muted">{message}</p>
      {children}
    </div>
  );
}

function InvalidState() {
  return (
    <EmptyPanel
      icon={ShieldAlert}
      title="Invalid item link"
      message="This item link doesn't look right. Double-check the URL or head back to browse all items."
    />
  );
}

function NotFoundState() {
  return (
    <EmptyPanel
      icon={PackageSearch}
      title="Item not found"
      message="This post may have been removed or resolved. It might already have found its way home."
    />
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <EmptyPanel icon={ServerCrash} title="Couldn't load this item" message={message}>
      <button
        onClick={onRetry}
        className="mt-2 flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-soft"
      >
        <Loader2 className="h-4 w-4" aria-hidden="true" />
        Try again
      </button>
    </EmptyPanel>
  );
}