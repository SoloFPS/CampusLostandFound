import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Item from "@/models/Item";

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/items/:id — item detail page
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: "Invalid item id" }, { status: 400 });
  }

  try {
    await connectDB();
    const item = await Item.findById(id).lean({ virtuals: true });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (err) {
    console.error(`GET /api/items/${id} failed:`, err);
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

// PATCH /api/items/:id — partial update (used for "Mark as Resolved" and Edit)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: "Invalid item id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    await connectDB();

    const updated = await Item.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean({ virtuals: true });

    if (!updated) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ item: updated });
  } catch (err) {
    console.error(`PATCH /api/items/${id} failed:`, err);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// DELETE /api/items/:id
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: "Invalid item id" }, { status: 400 });
  }

  try {
    await connectDB();
    const deleted = await Item.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/items/${id} failed:`, err);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}