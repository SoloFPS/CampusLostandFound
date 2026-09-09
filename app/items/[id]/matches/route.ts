import { NextResponse } from "next/server";
import { mockItems } from "@/lib/mock-data";
import { findTopMatches } from "@/lib/matching";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const source = mockItems.find((item) => item.id === params.id);

  if (!source) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  // Only compare against the opposite type and still-active posts — a
  // "lost" item should surface "found" candidates, and matching against
  // something already resolved isn't useful.
  const candidates = mockItems.filter(
    (item) => item.id !== source.id && item.status === "active" && item.type !== source.type
  );

  const matches = findTopMatches(source, candidates, 5);

  return NextResponse.json({ matches });
}