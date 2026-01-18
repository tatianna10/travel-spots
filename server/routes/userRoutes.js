import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { auth } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';

const router = Router();
const { Types } = mongoose;

function validateObjectIdParam(param = 'id') {
  return (req, res, next) => {
    if (!Types.ObjectId.isValid(String(req.params[param]))) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    next();
  };
}

// ---------- GET CURRENT USER ----------
router.get('/data/users/me', auth, async (req, res, next) => {
  try {
    const userId = req.user._id ?? req.user.id;

    const user = await User.findById(userId).select('_id email fullName').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ ...user, _id: String(user._id) });
  } catch (err) {
    next(err);
  }
});

// ---------- GET PUBLIC USER BY ID (optional) ----------
router.get('/data/users/:id', validateObjectIdParam('id'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('_id fullName').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ ...user, _id: String(user._id) });
  } catch (err) {
    next(err);
  }
});

// ---------- UPDATE CURRENT USER (optional) ----------
router.put(
  '/data/users/me',
  auth,
  validateBody({
    fullName: { required: true, type: 'string', minLength: 1 },
  }),
  async (req, res, next) => {
    try {
      const userId = req.user._id ?? req.user.id;

      const updated = await User.findByIdAndUpdate(
        userId,
        { $set: { fullName: String(req.body.fullName).trim() } },
        { new: true, runValidators: true }
      ).select('_id email fullName');

      if (!updated) return res.status(404).json({ message: 'User not found' });

      res.json({ ...updated.toObject(), _id: updated._id.toString() });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
