import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Item from "@/models/Item";
import { newItemSchema } from "@/lib/validators/item";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET() {
  try {
    await connectDB();
    const items = await Item.find().sort({ createdAt: -1 }).lean({ virtuals: true });
    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET /api/items failed:", err);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = newItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    const created = await Item.create({
      ...parsed.data,
      status: "active",
      // postedBy now comes from the verified session, never the client
      postedBy: { id: user.id, name: user.name },
    });

    return NextResponse.json({ item: created.toJSON() }, { status: 201 });
  } catch (err) {
    console.error("POST /api/items failed:", err);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}