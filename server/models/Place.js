import { Schema, model, Types } from "mongoose";

const placeSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title type is required!'],
        trim: true,
    },
    city: {
        type: String,
        required: [true, 'City is required!'],
        trim: true,
    },
    country: {
        type: String,
        required: [true, 'Country is required!'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        trim: true,
    },
    longDescription: {
        type: String,
        required: [true, 'Long description is required!'],
        minlength: [4, 'The Description should be at least 4 characters long'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Place image is required!'],
        match: [/^https?:\/\//, 'The image URL should start with http:// or https://'],
        trim: true,
    },
    category: {
        type: String,
        trim: true
    },
    ownerId: {
        type: String,
        required: true
    }
});

const Place = model('Place', placeSchema);

export default Place;
