import express from 'express';
import cors from 'cors';

import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

app.get('/api/health', (req, res) => res.status(200).send('ok'));

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://travel-spots-jade.vercel.app' 
  ],
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/data/places', routes);

app.use(errorHandler);

export default app;
