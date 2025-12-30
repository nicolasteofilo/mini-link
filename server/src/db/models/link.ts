import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const LinkSchema = new Schema({
  slug: { type: String, required: true, unique: true, trim: true, minLength: 4, index: true },
  longUrl: { type: String, required: true, trim: true, maxLength: 2048 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
}, {
  timestamps: true,
});

export type LinkDoc = InferSchemaType<typeof LinkSchema> & { _id: Types.ObjectId };

export const LinkModel = model("Link", LinkSchema);