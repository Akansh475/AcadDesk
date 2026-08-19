import prisma from "../../config/prisma.js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = (subjectName, studentName, attendance) => `
You are an expert academic tutor specializing in ${subjectName} for a college student in India.

Student: ${studentName}
Subject: ${subjectName}
Attendance: ${attendance}%${attendance < 70 ? " (at risk — needs extra focus)" : ""}

Your teaching style:
- Use the Socratic method — guide students to discover answers themselves
- Ask follow-up questions to check understanding
- Break complex concepts into simple steps
- Use real-world analogies relevant to Indian students
- If a student is struggling, give hints before full answers
- Keep responses concise and focused — no unnecessary padding
- Use examples relevant to ${subjectName}
- Never do homework or assignments for them — teach concepts instead

Stay strictly within academic topics related to ${subjectName}. 
If asked unrelated questions, politely redirect to the subject.
`.trim();

export async function createSession(req, res) {
  try {
    const { user_id, subject_id, subject_name } = req.body;

    if (!user_id || !subject_name) {
      return res.status(400).json({ error: "user_id and subject_name are required" });
    }

    const session = await prisma.chatSession.create({
      data: { user_id, subject_id: subject_id ?? null, subject_name },
      include: { messages: true },
    });

    res.status(201).json(session);
  } catch (err) {
    console.error("createSession error:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
}

export async function getSessions(req, res) {
  try {
    const { userId } = req.params;

    const sessions = await prisma.chatSession.findMany({
      where: { user_id: userId },
      include: {
        messages: { orderBy: { created_at: "asc" }, take: 1 },
      },
      orderBy: { created_at: "desc" },
    });

    res.json(sessions);
  } catch (err) {
    console.error("getSessions error:", err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
}

export async function getSession(req, res) {
  try {
    const { id } = req.params;

    const session = await prisma.chatSession.findUnique({
      where: { id },
      include: { messages: { orderBy: { created_at: "asc" } } },
    });

    if (!session) return res.status(404).json({ error: "Session not found" });

    res.json(session);
  } catch (err) {
    console.error("getSession error:", err);
    res.status(500).json({ error: "Failed to fetch session" });
  }
}

export async function sendMessage(req, res) {
  try {
    const { id } = req.params;
    const { content, student_name, attendance_percentage } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: "Message content is required" });
    }

    const session = await prisma.chatSession.findUnique({
      where: { id },
      include: { messages: { orderBy: { created_at: "asc" } } },
    });

    if (!session) return res.status(404).json({ error: "Session not found" });

    // Save student message
    await prisma.chatMessage.create({
      data: { session_id: id, role: "USER", content: content.trim() },
    });

    // Build conversation history for Groq
    const history = session.messages.map((m) => ({
      role: m.role === "USER" ? "user" : "assistant",
      content: m.content,
    }));

    history.push({ role: "user", content: content.trim() });

    const completion = await groq.chat.completions.create({
      model: "qwen/qwen3.6-27b",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT(
            session.subject_name ?? "General Studies",
            student_name ?? "Student",
            attendance_percentage ?? 100
          ),
        },
        ...history,
      ],
      temperature: 0.6,
      max_tokens: 1000,
      reasoning_effort: "none",
    });

    const aiContent = completion.choices[0]?.message?.content ?? "I'm sorry, I couldn't generate a response. Please try again.";

    // Save AI response
    const aiMessage = await prisma.chatMessage.create({
      data: { session_id: id, role: "ASSISTANT", content: aiContent },
    });

    res.json(aiMessage);
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
}

export async function deleteSession(req, res) {
  try {
    const { id } = req.params;
    await prisma.chatSession.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Session not found" });
    }
    console.error("deleteSession error:", err);
    res.status(500).json({ error: "Failed to delete session" });
  }
}