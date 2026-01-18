import { Router } from 'express';
import Place from '../models/Place.js';
import { auth } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { requireOwnership } from '../middlewares/ownershipMiddleware.js';

const router = Router();

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

router.get('/data/places', async (req, res, next) => {
  try {
    const places = await Place.find().sort({ createdAt: -1 });
    res.json(places);
  } catch (err) {
    next(err);
  }
});

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
      const place = await Place.create({ ...req.body, ownerId: req.user._id });
      res.status(201).json(place);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/data/places/:id",
  auth,
  async (req, res, next) => {
    if (!objectIdPattern.test(req.params.id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    next();
  },
  requireOwnership({ Model: Place, ownerField: 'ownerId', attachAs: 'place' }),
  async (req, res, next) => {
    try {
      const { ownerId, ...rest } = req.body; // prevent changing ownerId
      Object.assign(req.place, rest);
      const updated = await req.place.save();
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/data/places/:id',
  auth,
  async (req, res, next) => {
    if (!objectIdPattern.test(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    next();
  },
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
