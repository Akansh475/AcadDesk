import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { getAcademicCalendar } from "./calendar.controller.js";

const router = Router();

router.get("/:collegeId", authenticate, getAcademicCalendar);

export default router;