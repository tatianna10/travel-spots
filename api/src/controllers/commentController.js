import mongoose from 'mongoose';
import Comment from '../models/Comment.js';

const { Types } = mongoose;

function assertObjectId(value, fieldName) {
  if (!value) return { ok: false, status: 400, message: `${fieldName} is required` };
  if (!Types.ObjectId.isValid(String(value))) {
    return { ok: false, status: 400, message: `Invalid ${fieldName}` };
  }
  return { ok: true };
}

function toObjectId(value) {
  return new Types.ObjectId(String(value));
}

function getAuthorMongoId(req) {
  // expects JWT payload has `_id`
  return req.user?._id;
}

function getAuthorSnapshot(req) {
  const email = req.user?.email ?? '';
  const name = req.user?.fullName ?? email ?? 'Unknown user';
  return { authorEmail: email, authorName: name };
}

export async function getComments(req, res, next) {
  try {
    const { placeId } = req.query;

    const v = assertObjectId(placeId, 'placeId');
    if (!v.ok) return res.status(v.status).json({ message: v.message });

    const comments = await Comment.find({ placeId: toObjectId(placeId) })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(comments);
  } catch (err) {
    next(err);
  }
}

export async function createComment(req, res, next) {
  try {
    const { placeId, text } = req.body;

    const v = assertObjectId(placeId, 'placeId');
    if (!v.ok) return res.status(v.status).json({ message: v.message });

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ message: 'Invalid comment' });
    }

    const authorId = getAuthorMongoId(req);
    const a = assertObjectId(authorId, 'user id');
    if (!a.ok) return res.status(401).json({ message: 'Invalid or missing user id' });

    const comment = await Comment.create({
      placeId: toObjectId(placeId),
      text: text.trim(),
      authorId: toObjectId(authorId),
      ...getAuthorSnapshot(req),
    });

    return res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}
