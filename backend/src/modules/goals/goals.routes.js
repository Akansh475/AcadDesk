import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { createGoal, getGoals, deleteGoal } from "./goals.controller.js";

const router = Router();

router.get("/:userId", authenticate, getGoals);
router.post("/", authenticate, createGoal);
router.delete("/:id", authenticate, deleteGoal);

export default router;