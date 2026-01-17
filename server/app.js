import express from "express";
import cors from "cors";

import usersRoutes from "./routes/users.routes.js";
import placesRoutes from "./routes/places.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import likesRoutes from "./routes/likes.routes.js";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({ status: "API is running" });
});

// Routes
app.use("/users", usersRoutes);
app.use("/data/places", placesRoutes);
app.use("/data/comments", commentsRoutes);
app.use("/data/likes", likesRoutes);

export default app;
