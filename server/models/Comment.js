import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    placeId: {
      type: Schema.Types.ObjectId,
      ref: "Place",
      required: true,
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      minlength: 1,
      trim: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

const Comment = model("Comment", commentSchema);
export default Comment;
