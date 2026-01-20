import app from "../server/app.js";
import { connectDB } from "../server/config/db.js";

let dbReady = false;

async function ensureDB() {
  if (!dbReady) {
    await connectDB();
    dbReady = true;
  }
}

export default async function handler(req, res) {
  await ensureDB();
  return app(req, res);
}
