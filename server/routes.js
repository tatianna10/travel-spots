import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from './models/User.js';
import Place from './models/Place.js';
import Comment from './models/Comment.js';
import Like from './models/Like.js';
import { JWT_SECRET } from './config/env.js';

const router = Router();

// ---------- AUTH ----------
router.post('/users/register', async (req, res) => {
  const { email, password, fullName } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'User already exists' });

  // User model pre('save') hashes password, so store plain here.
  const user = await User.create({
    email,
    fullName: fullName || '',
    password,
  });

  const token = jwt.sign(
    { _id: user._id, email: user.email, fullName: user.fullName },
    JWT_SECRET
  );

  res.json({
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    accessToken: token,
  });
});

router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(403).json({ message: 'Invalid login' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(403).json({ message: 'Invalid login' });

  const token = jwt.sign(
    { _id: user._id, email: user.email, fullName: user.fullName },
    JWT_SECRET
  );

  res.json({
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    accessToken: token,
  });
});

// ---------- PLACES ----------
router.get('/data/places', async (req, res) => {
  const places = await Place.find().sort({ createdAt: -1 });
  res.json(places);
});

router.post('/data/places', async (req, res) => {
  // with ObjectId + timestamps: no uuid, no createdAt manual
  const place = await Place.create(req.body);
  res.json(place);
});

// ---------- COMMENTS ----------
router.get('/data/comments', async (req, res) => {
  const { placeId } = req.query;
  if (!placeId) return res.status(400).json({ message: 'placeId is required' });

  const comments = await Comment.find({ placeId }).sort({ createdAt: -1 });
  res.json(comments);
});

router.post('/data/comments', async (req, res) => {
  const { placeId, text, authorId } = req.body;
  if (!placeId || !text || !authorId) {
    return res.status(400).json({ message: 'Invalid comment' });
  }

  const comment = await Comment.create({ placeId, text, authorId });
  res.json(comment);
});

// ---------- LIKES ----------
router.post('/data/likes', async (req, res) => {
  const { placeId, userId } = req.body;
  if (!placeId || !userId) {
    return res.status(400).json({ message: 'Invalid like' });
  }

  try {
    const like = await Like.create({ placeId, userId });
    res.json(like);
  } catch (e) {
    // because Like has unique index on { placeId, userId }
    if (e && e.code === 11000) {
      return res.status(409).json({ message: 'Already liked' });
    }
    throw e;
  }
});

router.delete('/data/likes/:id', async (req, res) => {
  const removed = await Like.findByIdAndDelete(req.params.id);
  if (!removed) return res.status(404).json({ message: 'Like not found' });

  res.json({ message: 'Unliked' });
});

export default router;
