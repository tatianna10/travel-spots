import { Router } from 'express';
import mongoose from 'mongoose';
import Comment from '../models/Comment.js';
import { auth } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';

const router = Router();
const { Types } = mongoose;

function toObjectId(id) {
  return new Types.ObjectId(String(id));
}

function requireObjectId(value, fieldName) {
  if (!value) return { ok: false, status: 400, message: `${fieldName} is required` };
  if (!Types.ObjectId.isValid(String(value))) {
    return { ok: false, status: 400, message: `Invalid ${fieldName}` };
  }
  return { ok: true };
}

router.get('/', async (req, res, next) => {
  try {
    const { placeId } = req.query;

    const v = requireObjectId(placeId, 'placeId');
    if (!v.ok) return res.status(v.status).json({ message: v.message });

    const comments = await Comment.find({ placeId: toObjectId(placeId) })
      .sort({ createdAt: -1 })
      .lean();

    res.json(comments);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
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

      const email = req.user?.email || '';
      const usernameFromEmail = email.split('@')[0];

      const displayName =
        (req.user?.fullName && req.user.fullName.trim()) ||
        usernameFromEmail ||
        'Unknown user';

      const comment = await Comment.create({
        placeId: toObjectId(placeId),
        text: String(text).trim(),
        authorId: toObjectId(userId),
        authorEmail: email,
        authorName: displayName,
      });

      res.status(201).json(comment.toObject());
    } catch (err) {
      next(err);
    }
  }
);

export default router;
