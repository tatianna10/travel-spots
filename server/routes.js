import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import User from "./models/User.js";
import Place from "./models/Place.js";
import Comment from "./models/Comment.js";
import Like from "./models/Like.js";
import { JWT_SECRET, BCRYPT_ROUNDS } from "./config/env.js";

const router = Router();

// ---------- AUTH ----------
router.post("/users/register", async (req, res) => {
  const { email, password, fullName } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await User.create({
    _id: uuid(),
    email,
    fullName: fullName || "",
    password: hashed,
  });

  const token = jwt.sign({ id: user._id, email, fullName: user.fullName }, JWT_SECRET);
  res.json({ id: user._id, email, fullName: user.fullName, accessToken: token });
});

router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(403).json({ message: "Invalid login" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(403).json({ message: "Invalid login" });

  const token = jwt.sign(
    { id: user._id, email: user.email, fullName: user.fullName },
    JWT_SECRET
  );

  res.json({ id: user._id, email: user.email, fullName: user.fullName, accessToken: token });
});

// ---------- PLACES ----------
router.get("/data/places", async (req, res) => {
  const places = await Place.find();
  res.json(places);
});

router.post("/data/places", async (req, res) => {
  const place = await Place.create({ _id: uuid(), ...req.body, createdAt: Date.now() });
  res.json(place);
});

// ---------- COMMENTS ----------
router.get("/data/comments", async (req, res) => {
  const { placeId } = req.query;
  const comments = await Comment.find({ placeId }).sort({ createdAt: -1 });
  res.json(comments);
});

router.post("/data/comments", async (req, res) => {
  const { placeId, text, authorId } = req.body;

  const comment = await Comment.create({
    _id: uuid(),
    placeId,
    text,
    authorId,
    createdAt: Date.now(),
  });

  res.json(comment);
});

// ---------- LIKES ----------
router.post("/data/likes", async (req, res) => {
  const { placeId, userId } = req.body;

  const exists = await Like.findOne({ placeId, userId });
  if (exists) return res.status(409).json({ message: "Already liked" });

  const like = await Like.create({
    _id: uuid(),
    placeId,
    userId,
    createdAt: Date.now(),
  });

  res.json(like);
});

router.delete("/data/likes/:id", async (req, res) => {
  await Like.findByIdAndDelete(req.params.id);
  res.json({ message: "Unliked" });
});

export default router;
