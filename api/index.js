import express from 'express';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { connectDB } from './config/db.js';

const app = express();

connectDB().catch(err => console.error('DB connection failed:', err.message));


app.get('/', (req, res) => res.send('Travel Spots API'));
app.get('/api/health', (req, res) => res.status(200).send('ok'));

app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

export default app;
