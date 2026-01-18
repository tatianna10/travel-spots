import { Router } from 'express';
import mongoose from 'mongoose';
import Place from '../models/Place.js';
import { auth } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { requireOwnership } from '../middlewares/ownershipMiddleware.js';

const router = Router();
const { Types } = mongoose;

function validateObjectIdParam(paramName = 'id') {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!Types.ObjectId.isValid(String(value))) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    next();
  };
}

function pickPlaceFields(body) {
  // Whitelist allowed fields to update/create
  const allowed = [
    'title',
    'city',
    'country',
    'description',
    'longDescription',
    'imageUrl',
    'category',
  ];

  const out = {};
  for (const key of allowed) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
}

// ---------- GET ALL PLACES ----------
router.get('/data/places', async (req, res, next) => {
  try {
    const places = await Place.find().sort({ createdAt: -1 }).lean();
    res.json(places);
  } catch (err) {
    next(err);
  }
});

// ---------- GET PLACE BY ID ----------
router.get('/data/places/:id', validateObjectIdParam('id'), async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id).lean();
    if (!place) return res.status(404).json({ message: 'Place not found' });

    res.json(place);
  } catch (err) {
    next(err);
  }
});

// ---------- CREATE PLACE ----------
router.post(
  '/data/places',
  auth,
  validateBody({
    title: { required: true, type: 'string', minLength: 1 },
    city: { required: true, type: 'string', minLength: 1 },
    country: { required: true, type: 'string', minLength: 1 },
    description: { required: true, type: 'string', minLength: 1 },
    longDescription: { required: true, type: 'string', minLength: 4 },
    imageUrl: {
      required: true,
      type: 'string',
      pattern: /^https?:\/\//,
      message: 'The image URL should start with http:// or https://',
    },
    category: { required: false, type: 'string' },
  }),
  async (req, res, next) => {
    try {
      const data = pickPlaceFields(req.body);

      const ownerId = req.user?._id ?? req.user?.id;
      if (!ownerId || !Types.ObjectId.isValid(String(ownerId))) {
        return res.status(401).json({ message: 'Invalid or missing user id' });
      }

      const place = await Place.create({
        ...data,
        ownerId: new Types.ObjectId(String(ownerId)),
      });

      res.status(201).json(place);
    } catch (err) {
      next(err);
    }
  }
);

// ---------- UPDATE PLACE ----------
router.put(
  '/data/places/:id',
  auth,
  validateObjectIdParam('id'),
  // You can reuse the same validation but make fields optional
  validateBody({
    title: { required: false, type: 'string', minLength: 1 },
    city: { required: false, type: 'string', minLength: 1 },
    country: { required: false, type: 'string', minLength: 1 },
    description: { required: false, type: 'string', minLength: 1 },
    longDescription: { required: false, type: 'string', minLength: 4 },
    imageUrl: {
      required: false,
      type: 'string',
      pattern: /^https?:\/\//,
      message: 'The image URL should start with http:// or https://',
    },
    category: { required: false, type: 'string' },
  }),
  requireOwnership({ Model: Place, ownerField: 'ownerId', attachAs: 'place' }),
  async (req, res, next) => {
    try {
      const patch = pickPlaceFields(req.body);
      Object.assign(req.place, patch);

      const updated = await req.place.save();
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

// ---------- DELETE PLACE ----------
router.delete(
  '/data/places/:id',
  auth,
  validateObjectIdParam('id'),
  requireOwnership({ Model: Place, ownerField: 'ownerId' }),
  async (req, res, next) => {
    try {
      const deleted = await Place.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Place not found' });

      res.json({ message: 'Deleted', deleted });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
