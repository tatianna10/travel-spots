import mongoose from 'mongoose';
import Like from '../models/Like.js';

const { Types } = mongoose;

function isValidObjectId(v) {
  return Types.ObjectId.isValid(String(v));
}

function toObjectId(v) {
  return new Types.ObjectId(String(v));
}

function requirePlaceId(req, res) {
  const placeId = req.query.placeId ?? req.body.placeId;
  if (!placeId) {
    res.status(400).json({ message: 'placeId is required' });
    return null;
  }
  if (!isValidObjectId(placeId)) {
    res.status(400).json({ message: 'Invalid placeId' });
    return null;
  }
  return toObjectId(placeId);
}

function requireUserId(req, res) {
  const userId = req.user?._id ?? req.user?.id;
  if (!userId || !isValidObjectId(userId)) {
    res.status(401).json({ message: 'Invalid or missing user id' });
    return null;
  }
  return toObjectId(userId);
}

export async function getLikes(req, res, next) {
  try {
    const placeId = requirePlaceId(req, res);
    if (!placeId) return;

    const count = await Like.countDocuments({ placeId });
    res.json({ count });
  } catch (err) {
    next(err);
  }
}

export async function checkLike(req, res, next) {
  try {
    const placeId = requirePlaceId(req, res);
    if (!placeId) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const like = await Like.findOne({ placeId, userId }).select('_id').lean();
    res.json({ liked: !!like, likeId: like ? String(like._id) : null });
  } catch (err) {
    next(err);
  }
}

export async function createLike(req, res, next) {
  try {
    const placeId = requirePlaceId(req, res);
    if (!placeId) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    try {
      const like = await Like.create({ placeId, userId });
      res.status(201).json(like);
    } catch (e) {
      if (e?.code === 11000) {
        return res.status(409).json({ message: 'Already liked' });
      }
      throw e;
    }
  } catch (err) {
    next(err);
  }
}

export async function deleteLike(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid like id' });
    }

    const userId = requireUserId(req, res);
    if (!userId) return;

    const deleted = await Like.findOneAndDelete({ _id: toObjectId(id), userId });
    if (!deleted) return res.status(404).json({ message: 'Like not found' });

    res.json(deleted);
  } catch (err) {
    next(err);
  }
}
