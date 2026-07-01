import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./modules/tasks/tasks.routes.js";
import calendarRoutes from "./modules/calendar/calendar.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/calendar", calendarRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AcadDesk API is running" });
});

export default app;