import Groq from "groq-sdk";
import { createRequire } from "module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// In-memory store for generated question sets history (keyed by user_id)
const questionSetsHistory = new Map();

/**
 * Helper to extract text from an uploaded file buffer
 */
export async function extractTextFromFileBuffer(buffer, originalname, mimetype) {
  const ext = (originalname?.split(".").pop() || "").toLowerCase();

  // 1. PDF Files
  if (ext === "pdf" || mimetype === "application/pdf") {
    try {
      const parser = new PDFParse({ data: buffer });
      const res = await parser.getText();
      await parser.destroy();
      const rawText = res?.text || "";
      // Clean up multiple empty lines
      const clean = rawText
        .replace(/-- \d+ of \d+ --/g, "")
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      return clean;
    } catch (pdfErr) {
      console.error("PDF parse error:", pdfErr);
      throw new Error(`Failed to extract text from PDF: ${pdfErr.message}`);
    }
  }

  // 2. Word Documents (.docx, .doc)
  if (
    ext === "docx" ||
    ext === "doc" ||
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimetype === "application/msword"
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value.trim();
    } catch (docErr) {
      console.error("Docx parse error:", docErr);
      throw new Error(`Failed to extract text from Word document: ${docErr.message}`);
    }
  }

  // 3. Plain text / Markdown / HTML / JSON / RTF / CSV
  return buffer.toString("utf-8").trim();
}

/**
 * Endpoint to extract text from an uploaded file
 */
export async function extractFileText(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file was uploaded." });
    }

    const { originalname, mimetype, buffer, size } = req.file;

    const text = await extractTextFromFileBuffer(buffer, originalname, mimetype);

    if (!text || text.length < 10) {
      return res.status(400).json({
        error: "The uploaded file appears to be empty or contains scanned images without extractable text.",
      });
    }

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const charCount = text.length;

    res.json({
      success: true,
      fileName: originalname,
      fileSize: size,
      text,
      wordCount,
      charCount,
    });
  } catch (err) {
    console.error("extractFileText error:", err);
    res.status(500).json({ error: err.message || "Failed to parse document" });
  }
}

/**
 * Generate theoretical exam questions based on uploaded notes
 */
export async function generateExamQuestions(req, res) {
  try {
    let {
      subject,
      notes,
      numQuestions = 5,
      difficulty = "mixed",
      questionType = "mixed",
      user_id = "default",
    } = req.body;

    // If file was uploaded via multipart in this same request
    if (req.file) {
      const extracted = await extractTextFromFileBuffer(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      if (extracted) {
        notes = extracted;
      }
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({ error: "Subject name is required." });
    }

    if (!notes || !notes.trim()) {
      return res.status(400).json({
        error: "Lecture/study notes content is required. Please upload a notes file or paste text.",
      });
    }

    if (notes.trim().length < 15) {
      return res.status(400).json({
        error: "Notes content is too short. Please provide at least a few sentences of lecture notes or syllabus topics.",
      });
    }

    // Strictly enforce 1 to 10 questions limit as requested
    const count = Math.min(10, Math.max(1, parseInt(numQuestions, 10) || 5));

    let difficultyInstruction = "";
    if (difficulty === "easy") {
      difficultyInstruction = "Focus on foundational theoretical concepts, definitions, core working principles, and terminology found in the notes.";
    } else if (difficulty === "medium") {
      difficultyInstruction = "Focus on intermediate concepts, comparisons, architectural components, operational workflows, and procedural explanations from the notes.";
    } else if (difficulty === "hard") {
      difficultyInstruction = "Focus on in-depth theoretical analysis, derivations, edge cases, trade-offs, critical evaluations, and multi-part questions directly tied to the notes.";
    } else {
      difficultyInstruction = "Provide a balanced mix of 2-mark conceptual questions, 5-mark explanatory questions, and 10-mark in-depth theoretical questions.";
    }

    let typeInstruction = "";
    if (questionType === "short") {
      typeInstruction = "Generate Short Answer theoretical questions (2-3 Marks each).";
    } else if (questionType === "long") {
      typeInstruction = "Generate Long Descriptive / Comprehensive Essay theoretical questions (5-10 Marks each).";
    } else {
      typeInstruction = "Generate a well-balanced distribution of Short Answer (2-3 Marks) and Long Descriptive (5-10 Marks) theoretical questions.";
    }

    // Limit context length if extremely long to fit within token limits comfortably
    const safeNotes = notes.length > 20000 ? notes.slice(0, 20000) + "\n...[Content truncated for length]" : notes;

    const prompt = `You are a distinguished university professor and chief examination paper setter for undergraduate and postgraduate college courses.

TASK:
Deeply analyze the provided lecture/study notes for the subject "${subject.trim()}".
Generate EXACTLY ${count} theoretical examination questions strictly from an academic exam perspective (Mid-term / Semester End-term University Theory Exam format).

PRIMARY INSTRUCTION:
Base every single question directly on the specific topics, concepts, theorems, mechanisms, algorithms, models, definitions, and workflows explicitly described in the notes below. Do NOT generate generic questions that ignore the provided notes text.

LECTURE / STUDY NOTES CONTENT:
"""
${safeNotes.trim()}
"""

EXAM GUIDELINES & CONSTRAINTS:
1. QUANTITY: You MUST generate EXACTLY ${count} theoretical questions. Do NOT generate more or fewer than ${count}.
2. THEORETICAL RIGOR: Formulate authentic exam-grade theoretical questions that test deep conceptual understanding of the notes. Use standard university exam phrasing (e.g., "Explain the working mechanism of...", "Differentiate between X and Y with suitable diagrams/examples...", "Critically analyze why...", "Describe the architecture and state transitions of...").
3. DIFFICULTY & TYPE INSTRUCTIONS:
   - ${difficultyInstruction}
   - ${typeInstruction}
4. SCORING & DETAILS:
   - For every question, assign realistic marks (e.g., 2, 3, 5, 8, 10, or 15 marks).
   - Provide a comprehensive, structured Model Answer / Key Points detailing exactly what examiners look for (use bullet points, step-by-step structure, or markdown comparison tables where appropriate).
   - Provide a detailed Marking Scheme breakdown showing how points/marks are awarded.
   - Provide an actionable "Exam Pro-Tip" (e.g., advising students to include diagrams, highlight specific formulas or keywords from the notes, or common mistakes to avoid).
5. Output format: Return STRICTLY valid JSON conforming to the schema below.

JSON SCHEMA:
{
  "subject": "${subject.trim()}",
  "total_questions": ${count},
  "total_marks": <number>,
  "overview": "<brief 1-2 sentence summary of topics and concepts assessed directly from the notes>",
  "questions": [
    {
      "id": 1,
      "question": "<theoretical exam question based on the notes>",
      "marks": <number>,
      "type": "<Short Answer (2-3M) | Medium Theory (5-8M) | Long Descriptive (10-15M)>",
      "topic": "<specific topic or sub-topic from the notes>",
      "bloom_level": "<Understanding | Application | Analysis | Evaluation | Creation>",
      "estimated_time": "<e.g. 8 mins>",
      "model_answer": "<comprehensive model answer with clear formatting and explanations>",
      "marking_scheme": ["<point 1>", "<point 2>", "<point 3>"],
      "exam_tip": "<practical tip to score maximum marks in exams>"
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      model: "qwen/qwen3.6-27b",
      messages: [
        {
          role: "system",
          content:
            "You are an academic exam question paper generator. You strictly return valid JSON matching the requested schema without any markdown formatting wrappers or extraneous text.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 3500,
      reasoning_effort: "none",
    });

    const rawContent = completion.choices[0]?.message?.content ?? '{"questions":[]}';
    let parsedResult;

    try {
      parsedResult = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("JSON parse error from Groq response:", rawContent);
      return res.status(500).json({ error: "Failed to parse AI question response. Please try again." });
    }

    // Validate and clean up questions array
    const questions = Array.isArray(parsedResult.questions) ? parsedResult.questions : [];

    if (questions.length === 0) {
      return res.status(500).json({
        error: "AI was unable to generate questions from the provided notes. Please ensure your notes contain sufficient technical content.",
      });
    }

    // Limit to requested count
    const sanitizedQuestions = questions.slice(0, count).map((q, idx) => ({
      id: idx + 1,
      question: q.question || `Theoretical Question ${idx + 1}`,
      marks: parseInt(q.marks, 10) || 5,
      type: q.type || "Medium Theory",
      topic: q.topic || subject.trim(),
      bloom_level: q.bloom_level || "Understanding",
      estimated_time: q.estimated_time || "10 mins",
      model_answer: q.model_answer || "Key theoretical concepts and definitions from lecture notes.",
      marking_scheme: Array.isArray(q.marking_scheme)
        ? q.marking_scheme
        : ["Full explanation with relevant points and technical terms."],
      exam_tip: q.exam_tip || "Structure your answer with clear headings and bullet points.",
    }));

    const totalMarks = sanitizedQuestions.reduce((acc, q) => acc + q.marks, 0);

    const resultPayload = {
      id: `qs-${Date.now()}`,
      subject: subject.trim(),
      total_questions: sanitizedQuestions.length,
      total_marks: totalMarks,
      overview:
        parsedResult.overview ||
        `Theoretical questions generated from the uploaded ${subject.trim()} notes to evaluate conceptual and analytical understanding.`,
      questions: sanitizedQuestions,
      created_at: new Date().toISOString(),
    };

    // Save into history cache
    const userHistory = questionSetsHistory.get(user_id) || [];
    userHistory.unshift(resultPayload);
    questionSetsHistory.set(user_id, userHistory.slice(0, 20));

    res.status(200).json(resultPayload);
  } catch (err) {
    console.error("generateExamQuestions error:", err);
    res.status(500).json({
      error: err.message || "Failed to generate exam questions. Please verify your connection and try again.",
    });
  }
}

/**
 * Get previously generated question sets history
 */
export async function getQuestionHistory(req, res) {
  try {
    const { userId } = req.params;
    const history = questionSetsHistory.get(userId) || [];
    res.json(history);
  } catch (err) {
    console.error("getQuestionHistory error:", err);
    res.status(500).json({ error: "Failed to fetch question history" });
  }
}

/**
 * Save / Bookmark a question set
 */
export async function saveQuestionSet(req, res) {
  try {
    const { user_id, question_set } = req.body;
    if (!question_set) {
      return res.status(400).json({ error: "Question set payload is required" });
    }

    const userId = user_id || "default";
    const userHistory = questionSetsHistory.get(userId) || [];

    const existingIdx = userHistory.findIndex((s) => s.id === question_set.id);
    if (existingIdx >= 0) {
      userHistory[existingIdx] = { ...question_set, saved_at: new Date().toISOString() };
    } else {
      userHistory.unshift({
        ...question_set,
        id: question_set.id || `qs-${Date.now()}`,
        saved_at: new Date().toISOString(),
      });
    }

    questionSetsHistory.set(userId, userHistory.slice(0, 20));
    res.json({ success: true, message: "Question set saved successfully" });
  } catch (err) {
    console.error("saveQuestionSet error:", err);
    res.status(500).json({ error: "Failed to save question set" });
  }
}

/**
 * Delete a question set from history
 */
export async function deleteQuestionSet(req, res) {
  try {
    const { id } = req.params;
    const userId = req.query.userId || "default";

    const userHistory = questionSetsHistory.get(userId) || [];
    const updated = userHistory.filter((s) => s.id !== id);
    questionSetsHistory.set(userId, updated);

    res.json({ success: true, message: "Question set removed" });
  } catch (err) {
    console.error("deleteQuestionSet error:", err);
    res.status(500).json({ error: "Failed to delete question set" });
  }
}
