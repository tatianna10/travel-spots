import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { BCRYPT_ROUNDS } from '../config/env.js';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'User email is required!'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      default: '',
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'User password is required!'],
      minlength: [4, 'The password should be at least 4 characters long!'],
      select: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, BCRYPT_ROUNDS);
});

const User = model('User', userSchema);
export default User;
