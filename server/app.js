import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { connectDB } from './config/db.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use(routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
