import { Router } from 'express';
import Comment from '../models/Comment.js';
import { auth } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { requireOwnership } from '../middlewares/ownershipMiddleware.js';

const router = Router();

// ---------- GET COMMENTS BY PLACE ----------
router.get('/data/comments', async (req, res, next) => {
  try {
    const { placeId } = req.query;
    if (!placeId) return res.status(400).json({ message: 'placeId is required' });

    const comments = await Comment.find({ placeId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

// ---------- CREATE COMMENT ----------
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

      const comment = await Comment.create({
        placeId,
        text,
        authorId: req.user._id,
      });

      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }
);

// ---------- DELETE COMMENT (OWNER ONLY) ----------
router.delete(
  '/data/comments/:id',
  auth,
  requireOwnership({ Model: Comment, ownerField: 'authorId' }),
  async (req, res, next) => {
    try {
      const deleted = await Comment.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Comment not found' });

      res.json({ message: 'Deleted', deleted });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
