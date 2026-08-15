import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { getTimetableToday } from "./timetable.controller.js";

const router = Router();

router.get("/:userId/today", authenticate, getTimetableToday);

export default router;