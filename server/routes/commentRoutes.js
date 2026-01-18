import { Router } from 'express';
import mongoose from 'mongoose';
import Comment from '../models/Comment.js';
import { auth } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';

const router = Router();
const { Types } = mongoose;

router.get('/data/comments', async (req, res, next) => {
  try {
    const { placeId } = req.query;
    if (!placeId) return res.status(400).json({ message: 'placeId is required' });
    if (!Types.ObjectId.isValid(String(placeId))) {
      return res.status(400).json({ message: 'Invalid placeId' });
    }

    const comments = await Comment.find({ placeId: new Types.ObjectId(String(placeId)) })
      .sort({ createdAt: -1 })
      .lean();

    res.json(comments);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/data/comments',
  auth,
  validateBody({
    placeId: { required: true, type: 'string', pattern: /^[0-9a-fA-F]{24}$/ },
    text: { required: true, type: 'string', minLength: 1 },
  }),
  async (req, res, next) => {
    try {
      const { placeId, text } = req.body;

      const userId = req.user?._id ?? req.user?.id;
      if (!userId || !Types.ObjectId.isValid(String(userId))) {
        return res.status(401).json({ message: 'Invalid or missing user id' });
      }

      const comment = await Comment.create({
        placeId: new Types.ObjectId(String(placeId)),
        text: String(text).trim(),
        authorId: new Types.ObjectId(String(userId)),
        authorEmail: req.user?.email ?? '',
        authorName: req.user?.fullName ?? req.user?.email ?? 'Unknown user',
      });

      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
