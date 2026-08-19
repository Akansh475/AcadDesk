import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import {
  createSession,
  getSessions,
  getSession,
  sendMessage,
  deleteSession,
} from "./chat.controller.js";

const router = Router();

router.post("/sessions", authenticate, createSession);
router.get("/sessions/:userId", authenticate, getSessions);
router.get("/session/:id", authenticate, getSession);
router.post("/session/:id/message", authenticate, sendMessage);
router.delete("/session/:id", authenticate, deleteSession);

export default router;