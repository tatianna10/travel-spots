import express from 'express';
import routes from './src/routes/index.js';
import { errorHandler } from './src/middlewares/errorMiddleware.js';
import { connectDB } from './src/config/db.js';

const app = express();

connectDB().catch(err => console.error('DB connection failed:', err.message));

app.use(express.json());

app.get('/', (req, res) => res.send('Travel Spots API'));
app.get('/api/health', (req, res) => res.status(200).send('ok'));

app.use('/api', routes);
app.use(errorHandler);

export default app;
