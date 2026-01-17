import bcrypt from 'bcrypt';
import { Schema, model } from "mongoose";


const userSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'User email is required!'],
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        default: "",
        trim: true
    },
    password: {
        type: String,
        required: [true, 'User password is required!'],
        minlength: [4, 'The password should be at least 4 characters long!'],
        select: false
    }
});

userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

const User = model('User', userSchema);

export default User;