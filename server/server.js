import express from "express";
import cors from "cors";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const app = express();
const PORT = 3030;
const SECRET = "softuni_secret";

// Helpers
const readDB = () => JSON.parse(fs.readFileSync("db.json"));
const writeDB = (data) => fs.writeFileSync("db.json", JSON.stringify(data, null, 2));

app.use(cors());
app.use(express.json());

// -----------------------------
// AUTH
// -----------------------------
app.post("/users/register", async (req, res) => {
    const { email, password } = req.body;

    const db = readDB();
    if (db.users.some(u => u.email === email)) {
        return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const id = uuid();

    const user = { id, email, password: hashed };
    db.users.push(user);
    writeDB(db);

    const token = jwt.sign({ id, email }, SECRET);

    res.json({ email, accessToken: token, _id: id });
});

app.post("/users/login", async (req, res) => {
    const { email, password } = req.body;
    const db = readDB();

    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(403).json({ message: "Invalid login" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(403).json({ message: "Invalid login" });

    const token = jwt.sign({ id: user.id, email }, SECRET);

    res.json({ email, accessToken: token, _id: user.id });
});

// -----------------------------
// PLACES CRUD
// -----------------------------

// GET ALL
app.get("/data/places", (req, res) => {
    const db = readDB();
    res.json(db.places);
});

// GET BY ID  ✔ ADDED
app.get("/data/places/:id", (req, res) => {
    const db = readDB();
    const place = db.places.find(p => p.id === req.params.id);

    if (!place) return res.status(404).json({ message: "Place not found" });

    res.json(place);
});

// CREATE
app.post("/data/places", (req, res) => {
    const db = readDB();
    const place = { id: uuid(), ...req.body };
    db.places.push(place);
    writeDB(db);

    res.json(place);
});

// UPDATE  ✔ ADDED
app.put("/data/places/:id", (req, res) => {
    const db = readDB();
    const idx = db.places.findIndex(p => p.id === req.params.id);

    if (idx === -1) {
        return res.status(404).json({ message: "Place not found" });
    }

    db.places[idx] = { ...db.places[idx], ...req.body };
    writeDB(db);

    res.json(db.places[idx]);
});

// DELETE  ✔ ADDED
app.delete("/data/places/:id", (req, res) => {
    const db = readDB();
    const idx = db.places.findIndex(p => p.id === req.params.id);

    if (idx === -1) {
        return res.status(404).json({ message: "Place not found" });
    }

    const removed = db.places.splice(idx, 1);
    writeDB(db);

    res.json(removed[0]);
});

// -----------------------------
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
