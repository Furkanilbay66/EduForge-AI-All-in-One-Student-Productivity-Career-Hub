import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import studyRoutes from "./routes/study.js";
import plannerRoutes from "./routes/planner.js";
import roadmapRoutes from "./routes/roadmap.js";
import cvRoutes from "./routes/cv.js";
import projectRoutes from "./routes/projects.js";
import trackerRoutes from "./routes/tracker.js";
import communityRoutes from "./routes/community.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tracker", trackerRoutes);
app.use("/api/community", communityRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✓ EduForge AI backend running on http://localhost:${PORT}`);
});
