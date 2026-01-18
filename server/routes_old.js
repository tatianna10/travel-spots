import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from './models/User.js';
import Place from './models/Place.js';
import Comment from './models/Comment.js';
import Like from './models/Like.js';
import { JWT_SECRET } from './config/env.js';

import { auth } from './middlewares/authMiddleware.js';
import { validateBody } from './middlewares/validationMiddleware.js';
import { requireOwnership } from './middlewares/ownershipMiddleware.js';

const router = Router();

// ---------- AUTH ----------
router.post(
  '/users/register',
  validateBody({
    email: {
      required: true,
      type: 'string',
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email is invalid',
    },
    password: { required: true, type: 'string', minLength: 4 },
    fullName: { required: false, type: 'string' },
  }),
  async (req, res, next) => {
    try {
      const { email, password, fullName } = req.body;

      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ message: 'User already exists' });

      // User model hashes password in pre('save')
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
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/users/login',
  validateBody({
    email: { required: true, type: 'string' },
    password: { required: true, type: 'string' },
  }),
  async (req, res, next) => {
    try {
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
    } catch (err) {
      next(err);
    }
  }
);

// ---------- PLACES ----------
router.get('/data/places', async (req, res, next) => {
  try {
    const places = await Place.find().sort({ createdAt: -1 });
    res.json(places);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/data/places',
  auth,
  validateBody({
    title: { required: true, type: 'string', minLength: 1 },
    city: { required: true, type: 'string', minLength: 1 },
    country: { required: true, type: 'string', minLength: 1 },
    description: { required: true, type: 'string', minLength: 1 },
    longDescription: { required: true, type: 'string', minLength: 4 },
    imageUrl: {
      required: true,
      type: 'string',
      pattern: /^https?:\/\//,
      message: 'The image URL should start with http:// or https://',
    },
    category: { required: false, type: 'string' },
  }),
  async (req, res, next) => {
    try {
      const place = await Place.create({
        ...req.body,
        ownerId: req.user._id, // set from token
      });
      res.json(place);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/data/places/:id',
  auth,
  requireOwnership({ Model: Place, ownerField: 'ownerId', attachAs: 'place' }),
  async (req, res, next) => {
    try {
      // prevent ownerId being changed from client
      const { ownerId, ...rest } = req.body;

      Object.assign(req.place, rest);
      const updated = await req.place.save();
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/data/places/:id',
  auth,
  requireOwnership({ Model: Place, ownerField: 'ownerId' }),
  async (req, res, next) => {
    try {
      const deleted = await Place.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted', deleted });
    } catch (err) {
      next(err);
    }
  }
);

// ---------- COMMENTS ----------
router.get('/data/comments', async (req, res, next) => {
  try {
    const { placeId } = req.query;
    if (!placeId) return res.status(400).json({ message: "placeId is required" });

    const comments = await Comment.find({ placeId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/data/comments',
  auth,
  validateBody({
    placeId: { required: true, type: 'string' },
    text: { required: true, type: 'string', minLength: 1 },
  }),
  async (req, res, next) => {
    try {
      const { placeId, text } = req.body;

      const comment = await Comment.create({
        placeId,
        text,
        authorId: req.user._id, // set from token
      });

      res.json(comment);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/data/comments/:id',
  auth,
  requireOwnership({ Model: Comment, ownerField: 'authorId' }),
  async (req, res, next) => {
    try {
      const deleted = await Comment.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted', deleted });
    } catch (err) {
      next(err);
    }
  }
);

// ---------- LIKES ----------
router.post(
  '/data/likes',
  auth,
  validateBody({
    placeId: { required: true, type: 'string' },
  }),
  async (req, res, next) => {
    try {
      const { placeId } = req.body;

      const like = await Like.create({
        placeId,
        userId: req.user._id, // set from token
      });

      res.json(like);
    } catch (err) {
      if (err && err.code === 11000) {
        return res.status(409).json({ message: 'Already liked' });
      }
      next(err);
    }
  }
);

router.delete(
  '/data/likes/:id',
  auth,
  requireOwnership({ Model: Like, ownerField: 'userId' }),
  async (req, res, next) => {
    try {
      const deleted = await Like.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Like not found' });

      res.json({ message: 'Unliked', deleted });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
