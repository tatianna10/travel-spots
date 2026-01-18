import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "./models/User.js";
import Place from "./models/Place.js";
import Comment from "./models/Comment.js";
import Like from "./models/Like.js";
import { JWT_SECRET, BCRYPT_ROUNDS } from "./config/env.js";

const router = Router();

// ---------- AUTH ----------
router.post("/users/register", async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, Number(BCRYPT_ROUNDS));

        const user = await User.create({
            email,
            fullName: fullName || "",
            password: hashed,
        });

        const token = jwt.sign({ id: user._id, email, fullName: user.fullName }, JWT_SECRET);
        
        // Return .id for React compatibility
        res.json({ id: user._id, email, fullName: user.fullName, accessToken: token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/users/login", async (req, res) => {
    try {
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
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ---------- PLACES ----------
router.get("/data/places", async (req, res) => {
    const places = await Place.find().sort({ createdAt: -1 });
    res.json(places);
});

router.post("/data/places", async (req, res) => {
    try {
        const place = await Place.create(req.body);
        res.json(place);
    } catch (err) {
        res.status(400).json({ message: "Could not create place" });
    }
});

router.get("/data/places/:id", async (req, res) => {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Not found" });
    res.json(place);
});

// ---------- COMMENTS ----------
router.get("/data/comments", async (req, res) => {
    const { placeId } = req.query;
    const comments = await Comment.find({ placeId }).sort({ createdAt: -1 });
    res.json(comments);
});

router.post("/data/comments", async (req, res) => {
    try {
        const comment = await Comment.create(req.body);
        res.json(comment);
    } catch (err) {
        res.status(400).json({ message: "Could not post comment" });
    }
});

// ---------- LIKES ----------
router.get("/data/likes", async (req, res) => {
    const { placeId } = req.query;
    const count = await Like.countDocuments({ placeId });
    res.json({ count });
});

router.post("/data/likes", async (req, res) => {
    const { placeId, userId } = req.body;

    const exists = await Like.findOne({ placeId, userId });
    if (exists) return res.status(409).json({ message: "Already liked" });

    const like = await Like.create({ placeId, userId });
    res.json(like);
});

router.delete("/data/likes/:id", async (req, res) => {
    // Delete by the ID provided in the URL
    await Like.findByIdAndDelete(req.params.id);
    res.json({ message: "Unliked" });
});

export default router;