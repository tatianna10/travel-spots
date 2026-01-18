import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { PORT } from "./config/env.js";

await connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
