import serverless from 'serverless-http';
import app from '../server/app.js';
import { connectDB } from '../server/config/db.js';

let dbReady = false;

async function ensureDB() {
  if (!dbReady) {
    await connectDB();
    dbReady = true;
  }
}

const handler = serverless(app);

export default async function (req, res) {
  await ensureDB();
  return handler(req, res);
}
