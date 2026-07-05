import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { getAttendance, getSubjectBreakdown } from "./attendance.controller.js";

const router = Router();

router.get("/:userId", authenticate, getAttendance);
router.get("/:userId/:subjectId", authenticate, getSubjectBreakdown);

export default router;