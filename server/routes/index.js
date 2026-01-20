import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';     
import placeRoutes from './placeRoutes.js';
import commentRoutes from './commentRoutes.js';
import likeRoutes from './likeRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);      
router.use('/data/places', placeRoutes); 
router.use('/comments', commentRoutes);
router.use('/likes', likeRoutes);

export default router;