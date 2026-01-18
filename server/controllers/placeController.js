import { v4 as uuid } from "uuid";
import { readDB, writeDB } from "../utils/jsonDb.js";

export function getPlaces(req, res) {
  const db = readDB();
  res.json(db.places);
}

export function getPlaceById(req, res) {
  const db = readDB();
  const place = db.places.find(p => p._id === req.params.id);

  if (!place) return res.status(404).json({ message: "Place not found" });
  res.json(place);
}

export function createPlace(req, res) {
  const db = readDB();

  const place = {
    _id: uuid(),
    ...req.body,
    createdAt: Date.now()
  };

  db.places.push(place);
  writeDB(db);
  res.json(place);
}

export function updatePlace(req, res) {
  const db = readDB();
  const index = db.places.findIndex(p => p._id === req.params.id);

  if (index === -1) return res.status(404).json({ message: "Place not found" });

  db.places[index] = { ...db.places[index], ...req.body };
  writeDB(db);
  res.json(db.places[index]);
}

export function deletePlace(req, res) {
  const db = readDB();
  const index = db.places.findIndex(p => p._id === req.params.id);

  if (index === -1) return res.status(404).json({ message: "Place not found" });

  const removed = db.places.splice(index, 1);
  writeDB(db);
  res.json(removed[0]);
}
