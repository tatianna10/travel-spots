import express from "express";
import cors from "cors";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import fetch from "node-fetch";

const app = express();
const PORT = 3030;
const SECRET = "softuni_secret";

// Helpers
const readDB = () => JSON.parse(fs.readFileSync("db.json"));
const writeDB = (data) => fs.writeFileSync("db.json", JSON.stringify(data, null, 2));

app.use(cors());
app.use(express.json());

/* ================================
   AUTH REGISTER
================================ */
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

/* ================================
   AUTH LOGIN
================================ */
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

/* ================================
   PLACES CRUD
================================ */

// GET all places
app.get("/data/places", (req, res) => {
    const db = readDB();
    res.json(db.places);
});

// GET place by ID
app.get("/data/places/:id", (req, res) => {
    const db = readDB();
    const place = db.places.find(p => p.id === req.params.id);

    if (!place) {
        return res.status(404).json({ message: "Place not found" });
    }

    res.json(place);
});

/// CREATE place
app.post("/data/places", (req, res) => {
    const db = readDB();

    // Preserve React's exact order:
    const orderedBody = { ...req.body };

    // Insert id FIRST + overwrite likes/comments LAST
    const newPlace = {
        id: uuid(),
        ...orderedBody,
        likes: Array.isArray(orderedBody.likes) ? orderedBody.likes : [],
        comments: Array.isArray(orderedBody.comments) ? orderedBody.comments : []
    };

    db.places.push(newPlace);
    writeDB(db);

    res.json(newPlace);
});

// UPDATE place
app.put("/data/places/:id", (req, res) => {
    const db = readDB();
    const index = db.places.findIndex(p => p.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Place not found" });
    }

    db.places[index] = {
        ...db.places[index],
        ...req.body
    };

    writeDB(db);

    res.json(db.places[index]);
});

// DELETE place
app.delete("/data/places/:id", (req, res) => {
    const db = readDB();
    const index = db.places.findIndex(p => p.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Place not found" });
    }

    const deleted = db.places.splice(index, 1);
    writeDB(db);

    res.json({ message: "Deleted", deleted });
});

/* ================================
   WEATHER PROXY (Open-Meteo)
================================ */
app.get("/weather", async (req, res) => {
    const { lat, lng, days } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ message: "lat and lng are required" });
    }

    const forecastDays = days || 3;

    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${encodeURIComponent(lat)}` +
        `&longitude=${encodeURIComponent(lng)}` +
        `&daily=weathercode,temperature_2m_max` +
        `&forecast_days=${encodeURIComponent(forecastDays)}` +
        `&timezone=auto`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(502).json({ message: "Weather service error" });
        }
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch weather" });
    }
});


/* ================================
   START SERVER
================================ */
app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
);
