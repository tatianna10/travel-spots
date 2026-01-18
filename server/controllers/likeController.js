import { v4 as uuid } from "uuid";
import { readDB, writeDB } from "../utils/jsonDb.js";

export function getLikes(req, res) {
  const db = readDB();
  const { placeId } = req.query;

  const likes = db.likes.filter(l => l.placeId === placeId);
  res.json({ count: likes.length });
}

export function checkLike(req, res) {
  const db = readDB();
  const { placeId, userId } = req.query;

  const like = db.likes.find(l => l.placeId === placeId && l.userId === userId);
  res.json({ liked: !!like, likeId: like?._id || null });
}

export function createLike(req, res) {
  const db = readDB();
  const { placeId, userId } = req.body;

  if (db.likes.some(l => l.placeId === placeId && l.userId === userId)) {
    return res.status(409).json({ message: "Already liked" });
  }

  const like = {
    _id: uuid(),
    placeId,
    userId,
    createdAt: Date.now()
  };

  db.likes.push(like);
  writeDB(db);
  res.json(like);
}

export function deleteLike(req, res) {
  const db = readDB();
  const index = db.likes.findIndex(l => l._id === req.params.id);

  if (index === -1) return res.status(404).json({ message: "Like not found" });

  const removed = db.likes.splice(index, 1);
  writeDB(db);
  res.json(removed[0]);
}
