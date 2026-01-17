import { Schema, model, Types } from "mongoose";

const likeSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    placeId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
    },
    createdAt: { 
        type: Number, 
        required: true }
});

const Like = model('Like', likeSchema);

export default Like;
