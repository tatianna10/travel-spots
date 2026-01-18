import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/User.js';
import { JWT_SECRET } from '../config/env.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { authLimiter } from '../middlewares/rateLimitMiddleware.js';

const router = Router();

// ---------- REGISTER ----------
router.post(
  '/users/register',
  authLimiter,
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
      const email = String(req.body.email).trim().toLowerCase();
      const password = req.body.password;
      const fullName = req.body.fullName || '';

      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ message: 'User already exists' });

      const user = await User.create({
        email,
        fullName,
        password, // hashed by pre-save hook
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

// ---------- LOGIN ----------
router.post(
  '/users/login',
  authLimiter,
  validateBody({
    email: { required: true, type: 'string' },
    password: { required: true, type: 'string' },
  }),
  async (req, res, next) => {
    try {
      const email = String(req.body.email).trim().toLowerCase();
      const password = req.body.password;

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

export default router;
