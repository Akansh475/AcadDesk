import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./tasks.controller.js";

const router = Router();

router.get("/:userId", authenticate, getTasks);
router.post("/", authenticate, createTask);
router.patch("/:id", authenticate, updateTask);
router.delete("/:id", authenticate, deleteTask);

export default router;