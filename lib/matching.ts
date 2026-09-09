/**
 * Lightweight, fully-transparent similarity scoring for "Potential
 * Matches". No ML/external AI — four simple, explainable rules summing
 * to a score out of 100.
 *
 * Rule            Weight   Logic
 * --------------  -------  ---------------------------------------------
 * Category        +30      Exact match, case-insensitive.
 * Keywords        +30      +10 per shared significant word, capped at 30.
 *                          ("significant" = 3+ letters, not a stopword)
 * Location        +20      +20 exact match, +10 if one location string
 *                          contains the other (different phrasing of the
 *                          same place, e.g. "Library" vs "Main Library,
 *                          2nd Floor").
 * Date proximity  +20      Tiered by days apart: <=1d: 20, <=3d: 15,
 *                          <=7d: 10, <=14d: 5, else 0.
 * --------------  -------  ---------------------------------------------
 *
 * A "lost" item is only ever compared against "found" items (and vice
 * versa) — that's what makes a match meaningful for reconnecting an item
 * with its owner, so it's a hard filter the caller applies before
 * scoring, not a weighted rule.
 */

export interface MatchableItem {
  id: string;
  type: "lost" | "found";
  status: "active" | "resolved";
  title: string;
  description: string;
  category: string;
  location: string;
  date: string; // ISO date string
}

export interface MatchReason {
  label: string;
  points: number;
}

export interface MatchResult<T extends MatchableItem = MatchableItem> {
  item: T;
  score: number;
  reasons: MatchReason[];
}

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "in", "on", "at", "for", "with",
  "my", "it", "is", "was", "to", "near", "by", "this", "that", "i",
]);

/** Break title/description into lowercase, deduplicated keywords. */
function extractKeywords(...texts: string[]): Set<string> {
  const words = texts
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return new Set(words);
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

/** Days between two ISO date strings (always positive). */
function daysApart(a: string, b: string) {
  const diffMs = Math.abs(new Date(a).getTime() - new Date(b).getTime());
  return diffMs / (1000 * 60 * 60 * 24);
}

/** Scores how likely `candidate` is to be a match for `source`. */
export function scoreMatch<T extends MatchableItem>(source: T, candidate: T): MatchResult<T> {
  const reasons: MatchReason[] = [];
  let score = 0;

  // Category — exact match only, keeps it unambiguous.
  if (normalize(source.category) === normalize(candidate.category)) {
    score += 30;
    reasons.push({ label: "Same category", points: 30 });
  }

  // Keywords — reward overlap in what the posts actually say.
  const sourceWords = extractKeywords(source.title, source.description);
  const candidateWords = extractKeywords(candidate.title, candidate.description);
  const shared = [...sourceWords].filter((w) => candidateWords.has(w));
  if (shared.length > 0) {
    const points = Math.min(30, shared.length * 10);
    score += points;
    reasons.push({
      label: `${shared.length} shared keyword${shared.length > 1 ? "s" : ""} (${shared.slice(0, 3).join(", ")})`,
      points,
    });
  }

  // Location — exact match scores full points; a substring match
  // (different phrasing of the same place) scores half.
  const sourceLoc = normalize(source.location);
  const candidateLoc = normalize(candidate.location);
  if (sourceLoc === candidateLoc) {
    score += 20;
    reasons.push({ label: "Same location", points: 20 });
  } else if (sourceLoc.includes(candidateLoc) || candidateLoc.includes(sourceLoc)) {
    score += 10;
    reasons.push({ label: "Similar location", points: 10 });
  }

  // Date proximity — closer dates are a stronger signal, but we don't
  // require an exact match since people rarely report the same day.
  const diff = daysApart(source.date, candidate.date);
  let datePoints = 0;
  if (diff <= 1) datePoints = 20;
  else if (diff <= 3) datePoints = 15;
  else if (diff <= 7) datePoints = 10;
  else if (diff <= 14) datePoints = 5;
  if (datePoints > 0) {
    score += datePoints;
    reasons.push({ label: `Dates within ${Math.ceil(diff)} day${diff > 1 ? "s" : ""}`, points: datePoints });
  }

  return { item: candidate, score, reasons };
}

/**
 * Scores every candidate against the source item, keeps only nonzero
 * scores, sorts best-first, and returns the top `limit`.
 */
export function findTopMatches<T extends MatchableItem>(
  source: T,
  candidates: T[],
  limit = 5
): MatchResult<T>[] {
  return candidates
    .map((candidate) => scoreMatch(source, candidate))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}