"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ImageOff,
  ServerCrash,
} from "lucide-react";

interface MatchItem {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  imageUrl?: string;
}

interface MatchReason {
  label: string;
  points: number;
}

interface Match {
  item: MatchItem;
  score: number;
  reasons: MatchReason[];
}

interface PotentialMatchesProps {
  itemId: string;
}

type State =
  | {
      status: "loading";
    }
  | {
      status: "error";
    }
  | {
      status: "success";
      matches: Match[];
    };

export default function PotentialMatches({
  itemId,
}: PotentialMatchesProps) {
  const [state, setState] = useState<State>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;

    const fetchMatches = async () => {
      setState({ status: "loading" });

      try {
        const res = await fetch(
          `/api/items/${encodeURIComponent(itemId)}/matches`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch matches");
        }

        const data: { matches?: Match[] } = await res.json();

        if (!cancelled) {
          setState({
            status: "success",
            matches: data.matches ?? [],
          });
        }
      } catch {
        if (!cancelled) {
          setState({ status: "error" });
        }
      }
    };

    fetchMatches();

    return () => {
      cancelled = true;
    };
  }, [itemId]);

  // Loading state
  if (state.status === "loading") {
    return (
      <div className="mt-8 border-t border-line pt-6">
        <SectionHeading />

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-md border border-line bg-paper-raised"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (state.status === "error") {
    return (
      <div className="mt-8 border-t border-line pt-6">
        <SectionHeading />

        <div className="mt-3 flex items-center gap-2 text-sm text-muted">
          <ServerCrash
            className="h-4 w-4"
            aria-hidden="true"
          />

          <span>
            Couldn&apos;t load potential matches right now.
          </span>
        </div>
      </div>
    );
  }

  // No matches
  if (state.matches.length === 0) {
    return (
      <div className="mt-8 border-t border-line pt-6">
        <SectionHeading />

        <p className="mt-3 text-sm text-muted">
          No potential matches yet — check back as more
          items get posted.
        </p>
      </div>
    );
  }

  // Matches loaded successfully
  return (
    <div className="mt-8 border-t border-line pt-6">
      <SectionHeading />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {state.matches.map((match) => (
          <Link
            key={match.item.id}
            href={`/items/${match.item.id}`}
            className="flex gap-3 rounded-md border border-line bg-paper-raised p-3 transition-colors hover:border-amber-deep"
          >
            {/* Image */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-paper">
              {match.item.imageUrl ? (
                <Image
                  src={match.item.imageUrl}
                  alt={match.item.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted">
                  <ImageOff
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>

            {/* Match information */}
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-medium text-ink">
                  {match.item.title}
                </p>

                <span className="flex-shrink-0 rounded-full bg-amber-tint px-2 py-0.5 text-xs font-semibold text-amber-deep">
                  {match.score}% match
                </span>
              </div>

              <p className="mt-1 truncate text-xs text-muted">
                {match.item.category} · {match.item.location}
              </p>

              <div className="mt-1 flex flex-wrap gap-1">
                {match.reasons.map((reason) => (
                  <span
                    key={reason.label}
                    className="rounded-full bg-paper px-1.5 py-0.5 text-[10px] text-ink-soft"
                  >
                    {reason.label}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SectionHeading() {
  return (
    <div className="flex items-center gap-2">
      <Sparkles
        className="h-4 w-4 text-amber-deep"
        aria-hidden="true"
      />

      <h2 className="font-display text-lg font-semibold text-ink">
        Potential Matches
      </h2>
    </div>
  );
}