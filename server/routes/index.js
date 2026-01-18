import { Router } from 'express';
import authRoutes from './authRoutes.js';
import placeRoutes from './placeRoutes.js';
import commentRoutes from './commentRoutes.js';
import likeRoutes from './likeRoutes.js';

const router = Router();

router.use(authRoutes);
router.use(placeRoutes);
router.use(commentRoutes);
router.use(likeRoutes);

export default router;
