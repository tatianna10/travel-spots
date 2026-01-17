import express from "express";
import cors from "cors";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// connect once (serverless: reuse connection if already open)
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

if (mongoose.connection.readyState === 0) {
  await mongoose.connect(MONGODB_URI);
}




// const app = express();
// const PORT = 3030;
// const SECRET = "s3cRET_xA9Q#P2!0cm@4bR7%wZl"; 

// ---------- DB HELPERS ----------
const readDB = () => JSON.parse(fs.readFileSync("db.json"));
const writeDB = (data) =>
  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));

app.use(cors());
app.use(express.json());

// ---------- AUTH REGISTER ----------
app.post("/users/register", async (req, res) => {
  const { email, password, fullName } = req.body;
  const db = readDB();

  if (db.users.some((u) => u.email === email)) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const id = uuid();
  const user = { id, email, fullName: fullName || "", password: hashed };

  db.users.push(user);
  writeDB(db);

  const token = jwt.sign({ id, email, fullName: user.fullName }, SECRET);
  res.json({ id, email, fullName: user.fullName, accessToken: token });
});

// ---------- AUTH LOGIN ----------
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  const user = db.users.find((u) => u.email === email);
  if (!user) return res.status(403).json({ message: "Invalid login" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(403).json({ message: "Invalid login" });

  const token = jwt.sign(
    { id: user.id, email: user.email, fullName: user.fullName },
    SECRET
  );

  res.json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    accessToken: token,
  });
});

// ---------- GET USER BY ID ----------
app.get("/data/users/:id", (req, res) => {
  const db = readDB();
  const user = db.users.find((u) => u.id === req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
  });
});

// ---------- PLACES CRUD ----------
app.get("/data/places", (req, res) => {
  const db = readDB();
  res.json(db.places);
});

app.get("/data/places/:id", (req, res) => {
  const db = readDB();
  const place = db.places.find((p) => p.id === req.params.id);
  if (!place) return res.status(404).json({ message: "Place not found" });
  res.json(place);
});

app.post("/data/places", (req, res) => {
  const db = readDB();
  const newPlace = { id: uuid(), ...req.body, createdAt: Date.now() };
  db.places.push(newPlace);
  writeDB(db);
  res.json(newPlace);
});

app.put("/data/places/:id", (req, res) => {
  const db = readDB();
  const index = db.places.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Place not found" });

  db.places[index] = { ...db.places[index], ...req.body };
  writeDB(db);
  res.json(db.places[index]);
});

app.delete("/data/places/:id", (req, res) => {
  const db = readDB();
  const index = db.places.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Place not found" });

  const deleted = db.places.splice(index, 1);
  writeDB(db);
  res.json({ message: "Deleted", deleted });
});

// ---------- COMMENTS ----------
app.get("/data/comments", (req, res) => {
  const db = readDB();
  const { placeId } = req.query;

  const comments = db.comments
    .filter((c) => c.placeId === placeId)
    .sort((a, b) => b.createdAt - a.createdAt);

  res.json(comments);
});

app.post("/data/comments", (req, res) => {
  const db = readDB();
  const { placeId, text, authorId } = req.body;

  if (!placeId || !text || !authorId) {
    return res.status(400).json({ message: "Invalid comment" });
  }

  const comment = {
    id: uuid(),
    placeId,
    text,
    authorId,
    createdAt: Date.now(),
  };

  db.comments.push(comment);
  writeDB(db);
  res.json(comment);
});

// ---------- LIKES ----------
app.get("/data/likes", (req, res) => {
  const db = readDB();
  const { placeId } = req.query;
  const likes = db.likes.filter((l) => l.placeId === placeId);
  res.json({ count: likes.length });
});

app.get("/data/likes/check", (req, res) => {
  const db = readDB();
  const { placeId, userId } = req.query;

  const like = db.likes.find(
    (l) => l.placeId === placeId && l.userId === userId
  );

  res.json({ liked: !!like, likeId: like?.id ?? null });
});

app.post("/data/likes", (req, res) => {
  const db = readDB();
  const { placeId, userId } = req.body;

  if (!placeId || !userId)
    return res.status(400).json({ message: "Invalid like" });

  if (db.likes.some((l) => l.placeId === placeId && l.userId === userId)) {
    return res.status(409).json({ message: "Already liked" });
  }

  const like = { id: uuid(), placeId, userId, createdAt: Date.now() };
  db.likes.push(like);
  writeDB(db);
  res.json(like);
});

app.delete("/data/likes/:id", (req, res) => {
  const db = readDB();
  const index = db.likes.findIndex((l) => l.id === req.params.id);

  if (index === -1) return res.status(404).json({ message: "Like not found" });

  const removed = db.likes.splice(index, 1);
  writeDB(db);
  res.json({ message: "Unliked", removed });
});

// ---------- START SERVER ----------
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
