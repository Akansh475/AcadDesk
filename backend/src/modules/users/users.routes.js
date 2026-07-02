import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { getUser, updateUser } from "./users.controller.js";

const router = Router();

router.get("/:id", authenticate, getUser);
router.patch("/:id", authenticate, updateUser);

export default router;