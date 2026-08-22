import prisma from "../../config/prisma.js";
import dayjs from "dayjs";

export async function getUpcomingAssignments(req, res) {
  try {
    const { userId } = req.params;
    const today = dayjs().startOf("day").toDate();

    const assignments = await prisma.assignment.findMany({
      where: {
        user_id: userId,
        due_date: { gte: today },
      },
      include: { subject: true },
      orderBy: { due_date: "asc" },
    });

    const result = assignments.map((a) => ({
      id: a.id,
      title: a.title,
      subject: a.subject.name,
      due_date: a.due_date,
      status: a.status,
      description: a.description,
      marks: a.marks,
    }));

    res.json(result);
  } catch (err) {
    console.error("getUpcomingAssignments error:", err);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
}