import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import {
  getNotifications,
  markAsRead,
  getUnreadCount,
} from "./notifications.controller.js";

const router = Router();

router.get("/:userId", authenticate, getNotifications);
router.get("/:userId/unread-count", authenticate, getUnreadCount);
router.patch("/:id/read", authenticate, markAsRead);

export default router;