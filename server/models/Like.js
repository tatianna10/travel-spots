import { Schema, model } from "mongoose";

const likeSchema = new Schema(
  {
    placeId: {
      type: Schema.Types.ObjectId,
      ref: "Place",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent the same user from liking the same place twice
likeSchema.index({ placeId: 1, userId: 1 }, { unique: true });

const Like = model("Like", likeSchema);
export default Like;
