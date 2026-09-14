import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import {
  sendMessageToStudent,
  getStudentMessages,
  markMessageAsRead,
  deleteMessage,
} from "./messages.controller.js";

const router = Router();

// Send message to a particular student
router.post("/student/:studentId", authenticate, sendMessageToStudent);

// Get all messages for a student (received from admin)
router.get("/student/:studentId", authenticate, getStudentMessages);

// Mark a message as read
router.patch("/:id/read", authenticate, markMessageAsRead);

// Delete a message
router.delete("/:id", authenticate, deleteMessage);

export default router;
