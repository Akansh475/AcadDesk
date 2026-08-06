import prisma from "../../config/prisma.js";
import dayjs from "dayjs";

export async function getUpcomingExams(req, res) {
  try {
    const { userId } = req.params;
    const today = dayjs().startOf("day").toDate();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { college_id: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const exams = await prisma.exam.findMany({
      where: {
        college_id: user.college_id,
        date: { gte: today },
      },
      include: { subject: true },
      orderBy: { date: "asc" },
    });

    const result = exams.map((e) => ({
      id: e.id,
      subject: e.subject.name,
      date: e.date,
      time: e.time,
      room: e.room,
      syllabus: e.syllabus,
    }));

    res.json(result);
  } catch (err) {
    console.error("getUpcomingExams error:", err);
    res.status(500).json({ error: "Failed to fetch exams" });
  }
}