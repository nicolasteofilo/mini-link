import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    avatarUrl: { type: String, required: false, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: Types.ObjectId };
export const UserModel = model("User", UserSchema);
