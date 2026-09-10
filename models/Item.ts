import { Schema, models, model, type HydratedDocument } from "mongoose";
import type { ItemType, ItemCategory, ItemStatus } from "@/types/item";

export interface ItemDocument {
  title: string;
  description: string;
  type: ItemType;
  category: ItemCategory;
  location: string;
  date: string;
  imageUrl: string;
  status: ItemStatus;
  postedBy: {
    id: string;
    name: string;
  };
}

const ITEM_TYPES: ItemType[] = ["lost", "found"];
const ITEM_CATEGORIES: ItemCategory[] = [
  "electronics", "accessories", "documents", "clothing",
  "bags", "keys", "books", "other",
];
const ITEM_STATUSES: ItemStatus[] = ["active", "resolved"];

const ItemSchema = new Schema<ItemDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    type: { type: String, enum: ITEM_TYPES, required: true },
    category: { type: String, enum: ITEM_CATEGORIES, required: true },
    location: { type: String, required: true, trim: true, maxlength: 200 },
    date: { type: String, required: true },
    imageUrl: { type: String, required: true, trim: true },
    status: { type: String, enum: ITEM_STATUSES, default: "active" },
    postedBy: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

ItemSchema.index({ title: "text", description: "text" });
ItemSchema.index({ type: 1, status: 1 });
ItemSchema.index({ category: 1 });

export type ItemHydratedDocument = HydratedDocument<ItemDocument>;
export const Item = models.Item || model<ItemDocument>("Item", ItemSchema);
export default Item;