import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use(routes);

app.use(errorHandler);

export default app;
