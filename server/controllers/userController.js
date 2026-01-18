import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { readDB, writeDB } from "../utils/jsonDb.js";

const SECRET = "secret123"; // move to env later

export async function register(req, res) {
  const db = readDB();
  const { email, password, fullName } = req.body;

  if (db.users.some(u => u.email === email)) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = {
    _id: uuid(),
    email,
    fullName: fullName || "",
    password: hashed
  };

  db.users.push(user);
  writeDB(db);

  const token = jwt.sign({ id: user._id, email }, SECRET);
  res.json({ id: user._id, email, fullName: user.fullName, accessToken: token });
}

export async function login(req, res) {
  const db = readDB();
  const { email, password } = req.body;

  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(403).json({ message: "Invalid login" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(403).json({ message: "Invalid login" });

  const token = jwt.sign({ id: user._id, email }, SECRET);
  res.json({ id: user._id, email, fullName: user.fullName, accessToken: token });
}
