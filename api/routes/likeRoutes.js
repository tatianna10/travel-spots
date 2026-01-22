import { Router } from 'express';
import mongoose from 'mongoose';
import Like from '../models/Like.js';
import { auth } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { requireOwnership } from '../middlewares/ownershipMiddleware.js';

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

    const count = await Like.countDocuments({ placeId: toObjectId(placeId) });
    res.json({ count });
  } catch (err) {
    next(err);
  }
});

router.get('/check', auth, async (req, res, next) => {
  try {
    const { placeId } = req.query;

    const v = requireObjectId(placeId, 'placeId');
    if (!v.ok) return res.status(v.status).json({ message: v.message });

    const u = requireObjectId(req.user?._id ?? req.user?.id, 'user id');
    if (!u.ok) return res.status(401).json({ message: 'Invalid or missing user id' });

    const userId = toObjectId(req.user._id ?? req.user.id);

    const like = await Like.findOne({
      placeId: toObjectId(placeId),
      userId,
    }).select('_id').lean();

    res.json({ liked: !!like, likeId: like ? String(like._id) : null });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  auth,
  validateBody({
    placeId: { required: true, type: 'string', pattern: /^[0-9a-fA-F]{24}$/ },
  }),
  async (req, res, next) => {
    try {
      const { placeId } = req.body;

      const u = requireObjectId(req.user?._id ?? req.user?.id, 'user id');
      if (!u.ok) return res.status(401).json({ message: 'Invalid or missing user id' });

      const like = await Like.create({
        placeId: toObjectId(placeId),
        userId: toObjectId(req.user._id ?? req.user.id),
      });

      res.status(201).json(like);
    } catch (err) {
      if (err?.code === 11000) {
        return res.status(409).json({ message: 'Already liked' });
      }
      next(err);
    }
  }
);

router.delete(
  '/:id',
  auth,
  requireOwnership({ Model: Like, ownerField: 'userId' }),
  async (req, res, next) => {
    try {
      if (!Types.ObjectId.isValid(String(req.params.id))) {
        return res.status(400).json({ message: 'Invalid like id' });
      }

      const deleted = await Like.findByIdAndDelete(toObjectId(req.params.id));
      if (!deleted) return res.status(404).json({ message: 'Like not found' });

      res.json({ message: 'Unliked', deleted });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
