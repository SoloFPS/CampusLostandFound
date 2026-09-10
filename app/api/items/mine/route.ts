import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Item from "@/models/Item";
import { getAuthUser } from "@/lib/getAuthUser";
import { serializeItems } from "@/lib/serializers/item";

// GET /api/items/mine — every item posted by the logged-in user.
// Powers the My Posts page.
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 },
      );
    }

    await connectDB();
    const itemsRaw = await Item.find({ "postedBy.id": user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ items: serializeItems(itemsRaw) });
  } catch (err) {
    console.error("GET /api/items/mine failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch your posts" },
      { status: 500 },
    );
  }
}
