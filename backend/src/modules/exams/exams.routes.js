import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { getUpcomingExams } from "./exams.controller.js";

const router = Router();

router.get("/:userId/upcoming", authenticate, getUpcomingExams);

export default router;