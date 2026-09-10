import type { ItemDocument } from "@/models/Item";
import type { Types } from "mongoose";

// .lean() returns a plain object straight from MongoDB — it never runs
// the schema's toJSON transform, so _id stays an ObjectId and there's
// no `id` field. Every route that uses .lean() for GET requests needs
// to run results through this before sending them to the client.
type LeanItemDoc = ItemDocument & {
  _id: Types.ObjectId;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export function serializeItem(doc: LeanItemDoc) {
  const { _id, __v, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export function serializeItems(docs: LeanItemDoc[]) {
  return docs.map(serializeItem);
}