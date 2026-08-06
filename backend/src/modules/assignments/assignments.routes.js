import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { getUpcomingAssignments } from "./assignments.controller.js";

const router = Router();

router.get("/:userId/upcoming", authenticate, getUpcomingAssignments);

export default router;