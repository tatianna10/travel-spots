import { v4 as uuid } from "uuid";
import { readDB, writeDB } from "../utils/jsonDb.js";

export function getComments(req, res) {
  const db = readDB();
  const { placeId } = req.query;

  const comments = db.comments
    .filter((c) => c.placeId === placeId)
    .sort((a, b) => b.createdAt - a.createdAt);

  res.json(comments);
}

export function createComment(req, res) {
  const db = readDB();
  const { placeId, text, authorId } = req.body;

  if (!placeId || !text || !authorId) {
    return res.status(400).json({ message: "Invalid comment" });
  }

  const comment = {
    _id: uuid(),        // Mongo style
    placeId,
    text,
    authorId,
    createdAt: Date.now(),
  };

  db.comments.push(comment);
  writeDB(db);
  res.json(comment);
}
