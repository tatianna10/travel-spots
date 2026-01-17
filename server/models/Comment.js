import { Schema, model, Types } from "mongoose";

const commentSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    placeId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        minlength: 1
    },
    authorId: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Number, 
        required: true }
});

const Comment = model('Comment', commentSchema);

export default Comment;

