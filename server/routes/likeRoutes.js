import { Router } from 'express';
import Like from '../models/Like.js';
import { auth } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { requireOwnership } from '../middlewares/ownershipMiddleware.js';

const router = Router();

// ---------- GET LIKES COUNT FOR PLACE ----------
router.get('/data/likes', async (req, res, next) => {
  try {
    const { placeId } = req.query;
    if (!placeId) return res.status(400).json({ message: 'placeId is required' });

    const count = await Like.countDocuments({ placeId });
    res.json({ count });
  } catch (err) {
    next(err);
  }
});

// ---------- CHECK IF USER LIKED A PLACE ----------
router.get('/data/likes/check', auth, async (req, res, next) => {
  try {
    const { placeId } = req.query;
    if (!placeId) return res.status(400).json({ message: 'placeId is required' });

    const like = await Like.findOne({ placeId, userId: req.user._id });
    res.json({ liked: !!like, likeId: like ? like._id : null });
  } catch (err) {
    next(err);
  }
});

// ---------- LIKE A PLACE ----------
router.post(
  '/data/likes',
  auth,
  validateBody({
    placeId: { required: true, type: 'string', pattern: /^[0-9a-fA-F]{24}$/ },
  }),
  async (req, res, next) => {
    try {
      const { placeId } = req.body;

      const like = await Like.create({
        placeId,
        userId: req.user._id,
      });

      res.status(201).json(like);
    } catch (err) {
      // unique index on { placeId, userId }
      if (err && err.code === 11000) {
        return res.status(409).json({ message: 'Already liked' });
      }
      next(err);
    }
  }
);

// ---------- UNLIKE (OWNER ONLY) ----------
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
