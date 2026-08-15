import { getTodayTimetable } from "../../integrations/erp/erpAdapter.js";
import prisma from "../../config/prisma.js";

export async function getTimetableToday(req, res) {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { college_id: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const timetable = await getTodayTimetable(user.college_id);

    res.json(timetable.map((t, i) => ({
      id: String(i + 1),
      subject: t.subject,
      time: t.time,
      room: t.room,
      teacher: t.teacher,
    })));
  } catch (err) {
    console.error("getTimetableToday error:", err);
    res.status(500).json({ error: "Failed to load timetable" });
  }
}