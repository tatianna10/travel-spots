import express from 'express';
import cors from 'cors';

import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);        
app.use(errorHandler); 

export default app;
