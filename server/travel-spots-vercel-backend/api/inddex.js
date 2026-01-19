import app from '../server/app.js';
import { connectDB } from '../server/config/db.js';

await connectDB();   

export default app;  
