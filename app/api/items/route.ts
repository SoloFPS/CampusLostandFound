import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Item from "@/models/Item";
import { newItemSchema } from "@/lib/validators/item";
import { getAuthUser } from "@/lib/getAuthUser";
import { serializeItems } from "@/lib/serializers/item";

const PAGE_SIZE = 8;

// GET /api/items?query=&type=&category=&location=&date=&page=
// Backs the Browse Items page's search/filter/infinite-scroll.
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim() ?? "";
    const type = searchParams.get("type") ?? "all";
    const category = searchParams.get("category") ?? "all";
    const location = searchParams.get("location") ?? "all";
    const date = searchParams.get("date") ?? "";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    const filter: Record<string, unknown> = {};

    if (type !== "all") filter.type = type;
    if (category !== "all") filter.category = category;
    if (location !== "all") filter.location = location;
    // date is a "from" filter — keep items on or after this date, since
    // date is stored as an ISO string (YYYY-MM-DD), lexical comparison
    // matches chronological comparison.
    if (date) filter.date = { $gte: date };
    if (query) {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      filter.$or = [{ title: regex }, { description: regex }];
    }

    const total = await Item.countDocuments(filter);
    const itemsRaw = await Item.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean();

    return NextResponse.json({
      items: serializeItems(itemsRaw),
      total,
      hasMore: page * PAGE_SIZE < total,
    });
    
  } catch (err) {
    console.error("GET /api/items failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const parsed = newItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await connectDB();
    const created = await Item.create({
      ...parsed.data,
      status: "active",
      postedBy: { id: user.id, name: user.name },
    });

    return NextResponse.json({ item: created.toJSON() }, { status: 201 });
  } catch (err) {
    console.error("POST /api/items failed:", err);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 },
    );
  }
}
