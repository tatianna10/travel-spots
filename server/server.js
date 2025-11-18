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

// Register
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

// Login
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

// Get all places
app.get("/data/places", (req, res) => {
    const db = readDB();
    res.json(db.places);
});

// Create place (THIS IS WHAT YOU MISSED)
app.post("/data/places", (req, res) => {
    const db = readDB();
    const place = { id: uuid(), ...req.body };
    db.places.push(place);
    writeDB(db);

    res.json(place);
});

// Start
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
