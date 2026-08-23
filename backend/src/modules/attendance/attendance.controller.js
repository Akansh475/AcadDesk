import prisma from "../../config/prisma.js";
import { getAttendanceData } from "../../integrations/erp/erpAdapter.js";
import dayjs from "dayjs";

async function resolveUser(userId, reqUser) {
  if (userId && userId !== "u1") {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, college_id: true },
    });
    if (user) return user;
  }
  if (reqUser?.id) {
    const user = await prisma.user.findUnique({
      where: { id: reqUser.id },
      select: { id: true, college_id: true },
    });
    if (user) return user;
  }
  return await prisma.user.findFirst({
    where: { role: "STUDENT" },
    select: { id: true, college_id: true },
  });
}

export async function getAttendance(req, res) {
  try {
    const { userId } = req.params;
    const user = await resolveUser(userId, req.user);

    if (!user) return res.status(404).json({ error: "User not found" });

    const subjects = await getAttendanceData(user.college_id);

    const total_classes_done = subjects.reduce((sum, s) => sum + s.classes_attended, 0);
    const total_classes_held = subjects.reduce((sum, s) => sum + s.classes_held, 0);
    const overall_percentage = total_classes_held > 0
      ? Math.round((total_classes_done / total_classes_held) * 100)
      : 0;

    res.json({
      summary: {
        total_classes_done,
        total_classes_held,
        overall_percentage,
        classes_remaining: 60,
      },
      subjects: subjects.map((s, i) => ({
        subject_id: String(i + 1),
        subject_name: s.subject_name,
        classes_attended: s.classes_attended,
        classes_held: s.classes_held,
        percentage: s.percentage,
      })),
    });
  } catch (err) {
    console.error("getAttendance error:", err);
    res.status(500).json({ error: "Failed to load attendance" });
  }
}

export async function getSubjectBreakdown(req, res) {
  try {
    const { userId, subjectId } = req.params;
    const user = await resolveUser(userId, req.user);

    if (!user) return res.status(404).json({ error: "User not found" });

    const subjects = await getAttendanceData(user.college_id);
    const subject = subjects[parseInt(subjectId) - 1];

    if (!subject) return res.status(404).json({ error: "Subject not found" });

    res.json({
      subject_id: subjectId,
      subject_name: subject.subject_name,
      overall: {
        attended: subject.classes_attended,
        held: subject.classes_held,
        percentage: subject.percentage,
      },
      monthly_breakdown: [],
    });
  } catch (err) {
    console.error("getSubjectBreakdown error:", err);
    res.status(500).json({ error: "Failed to load breakdown" });
  }
}