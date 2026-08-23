import { Router } from "express";
import multer from "multer";
import {
  generateExamQuestions,
  extractFileText,
  getQuestionHistory,
  saveQuestionSet,
  deleteQuestionSet,
} from "./questions.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
});

const router = Router();

// Extract text from uploaded document (PDF, DOCX, TXT, etc.)
router.post("/extract-file", upload.single("file"), extractFileText);

// Generate exam theoretical questions from lecture notes (JSON or multipart)
router.post("/generate", upload.single("file"), generateExamQuestions);

// History and bookmarks
router.get("/history/:userId", getQuestionHistory);
router.post("/save", saveQuestionSet);
router.delete("/:id", deleteQuestionSet);

export default router;
