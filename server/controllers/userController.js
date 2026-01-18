import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { JWT_SECRET } from '../config/env.js';

function signToken(user) {
  // Keep both _id and id if you want an easier transition on the frontend
  const payload = {
    _id: user._id.toString(),
    id: user._id.toString(),
    email: user.email,
    fullName: user.fullName,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req, res, next) {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: normalizedEmail,
      fullName: fullName ? String(fullName).trim() : '',
      passwordHash,
    });

    const token = signToken(user);

    res.json({
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      accessToken: token,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(403).json({ message: 'Invalid login' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(403).json({ message: 'Invalid login' });

    const token = signToken(user);

    res.json({
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      accessToken: token,
    });
  } catch (err) {
    next(err);
  }
}
