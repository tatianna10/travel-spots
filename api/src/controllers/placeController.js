import mongoose from 'mongoose';
import Place from '../models/Place.js';

const { Types } = mongoose;

function isValidObjectId(v) {
  return Types.ObjectId.isValid(String(v));
}

function toObjectId(v) {
  return new Types.ObjectId(String(v));
}

function cleanPlaceBody(body) {
  // whitelist fields to avoid accidental/unsafe updates
  const allowed = ['title', 'location', 'description', 'imageUrl'];
  const out = {};
  for (const key of allowed) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
}

export async function getPlaces(req, res, next) {
  try {
    const places = await Place.find().sort({ createdAt: -1 }).lean();
    res.json(places);
  } catch (err) {
    next(err);
  }
}

export async function getPlaceById(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid place id' });
    }

    const place = await Place.findById(toObjectId(id)).lean();
    if (!place) return res.status(404).json({ message: 'Place not found' });

    res.json(place);
  } catch (err) {
    next(err);
  }
}

export async function createPlace(req, res, next) {
  try {
    const data = cleanPlaceBody(req.body);

    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // If you want ownership, set it from JWT (auth middleware required)
    // const ownerId = req.user?._id ?? req.user?.id;
    // if (ownerId && isValidObjectId(ownerId)) data.ownerId = toObjectId(ownerId);

    const place = await Place.create({
      ...data,
      title: data.title.trim(),
    });

    res.status(201).json(place);
  } catch (err) {
    next(err);
  }
}

export async function updatePlace(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid place id' });
    }

    const patch = cleanPlaceBody(req.body);
    if (patch.title !== undefined) patch.title = String(patch.title).trim();

    const updated = await Place.findByIdAndUpdate(
      toObjectId(id),
      { $set: patch },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Place not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deletePlace(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid place id' });
    }

    const deleted = await Place.findByIdAndDelete(toObjectId(id));
    if (!deleted) return res.status(404).json({ message: 'Place not found' });

    res.json(deleted);
  } catch (err) {
    next(err);
  }
}
