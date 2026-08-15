import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes.js";
import taskRoutes from "./modules/tasks/tasks.routes.js";
import calendarRoutes from "./modules/calendar/calendar.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import attendanceRoutes from "./modules/attendance/attendance.routes.js";
import notificationRoutes from "./modules/notifications/notifications.routes.js";
import assignmentRoutes from "./modules/assignments/assignments.routes.js";
import examRoutes from "./modules/exams/exams.routes.js";
import timetableRoutes from "./modules/timetable/timetable.routes.js";

// add with other routes:


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/timetable", timetableRoutes);
// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AcadDesk API is running" });
});

export default app;