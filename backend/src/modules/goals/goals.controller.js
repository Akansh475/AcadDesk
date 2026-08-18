import prisma from "../../config/prisma.js";
import Groq from "groq-sdk";
import dayjs from "dayjs";
import { getCalendarEvents } from "../../integrations/erp/erpAdapter.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function createGoal(req, res) {
  try {
    const { user_id, title, category, deadline } = req.body;

    if (!user_id || !title || !category || !deadline) {
      return res.status(400).json({ error: "user_id, title, category and deadline are required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: user_id },
      select: { college_id: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    let calendarEvents = [];
    try {
      calendarEvents = await getCalendarEvents(user.college_id);
    } catch {
      calendarEvents = [];
    }

    const weeksUntilDeadline = Math.max(1, dayjs(deadline).diff(dayjs(), "week"));

    const calendarSummary = calendarEvents.length > 0
      ? calendarEvents.map((e) => `- ${e.title} on ${dayjs(e.date).format("D MMM YYYY")}`).join("\n")
      : "No major events scheduled";

    const prompt = `You are an academic planning assistant for a college student in India.

The student has set the following goal:
- Goal: ${title}
- Category: ${category}
- Deadline: ${dayjs(deadline).format("D MMMM YYYY")} (${weeksUntilDeadline} weeks from now)

Their upcoming academic calendar:
${calendarSummary}

Generate a week-by-week roadmap to help them achieve this goal.
Consider their academic commitments and avoid scheduling heavy work during exam weeks.

Return a JSON object with a "weeks" array. Each week has week_number, focus, and tasks array.
Generate exactly ${Math.min(weeksUntilDeadline, 12)} weeks. Each week should have 3-5 tasks.

Example format:
{
  "weeks": [
    {
      "week_number": 1,
      "focus": "Foundation and Setup",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      model: "qwen/qwen3.6-27b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
      reasoning_effort: "none",
    });

    const rawContent = completion.choices[0]?.message?.content ?? '{"weeks":[]}';
    const parsed = JSON.parse(rawContent);
    const weeks = parsed.weeks ?? [];

    if (weeks.length === 0) {
      return res.status(500).json({ error: "AI returned empty roadmap. Try again." });
    }

    const goal = await prisma.goal.create({
      data: {
        user_id,
        title,
        category,
        deadline: new Date(deadline),
      },
    });

    await prisma.roadmapWeek.createMany({
      data: weeks.map((w) => ({
        goal_id: goal.id,
        week_number: w.week_number,
        focus: w.focus,
        tasks: w.tasks,
      })),
    });

    const fullGoal = await prisma.goal.findUnique({
      where: { id: goal.id },
      include: {
        roadmap: { orderBy: { week_number: "asc" } },
      },
    });

    res.status(201).json(fullGoal);
  } catch (err) {
    console.error("createGoal error:", err);
    res.status(500).json({ error: "Failed to generate roadmap. Try again." });
  }
}

export async function getGoals(req, res) {
  try {
    const { userId } = req.params;

    const goals = await prisma.goal.findMany({
      where: { user_id: userId },
      include: {
        roadmap: { orderBy: { week_number: "asc" } },
      },
      orderBy: { created_at: "desc" },
    });

    res.json(goals);
  } catch (err) {
    console.error("getGoals error:", err);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
}

export async function deleteGoal(req, res) {
  try {
    const { id } = req.params;

    await prisma.goal.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Goal not found" });
    }
    console.error("deleteGoal error:", err);
    res.status(500).json({ error: "Failed to delete goal" });
  }
}