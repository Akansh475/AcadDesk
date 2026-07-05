import prisma from "../../config/prisma.js";
import dayjs from "dayjs";

export async function getAttendance(req, res) {
  try {
    const { userId } = req.params;

    const records = await prisma.attendanceRecord.findMany({
      where: { user_id: userId },
      include: { subject: true },
      orderBy: { date: "asc" },
    });

    if (records.length === 0) {
      return res.json({ summary: null, subjects: [] });
    }

    // Group records by subject
    const subjectMap = {};
    for (const record of records) {
      const sid = record.subject_id;
      if (!subjectMap[sid]) {
        subjectMap[sid] = {
          subject_id: sid,
          subject_name: record.subject.name,
          classes_attended: 0,
          classes_held: 0,
        };
      }
      subjectMap[sid].classes_held += 1;
      if (record.status === "PRESENT") {
        subjectMap[sid].classes_attended += 1;
      }
    }

    const subjects = Object.values(subjectMap).map((s) => ({
      ...s,
      percentage: Math.round((s.classes_attended / s.classes_held) * 100),
    }));

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
        classes_remaining: 60, // static for now, comes from ERP later
      },
      subjects,
    });
  } catch (err) {
    console.error("getAttendance error:", err);
    res.status(500).json({ error: "Failed to load attendance" });
  }
}

export async function getSubjectBreakdown(req, res) {
  try {
    const { userId, subjectId } = req.params;

    const records = await prisma.attendanceRecord.findMany({
      where: { user_id: userId, subject_id: subjectId },
      include: { subject: true },
      orderBy: { date: "asc" },
    });

    if (records.length === 0) {
      return res.json({
        subject_id: subjectId,
        subject_name: "",
        overall: { attended: 0, held: 0, percentage: 0 },
        monthly_breakdown: [],
      });
    }

    const attended = records.filter((r) => r.status === "PRESENT").length;
    const held = records.length;
    const percentage = Math.round((attended / held) * 100);

    // Group by month
    const monthMap = {};
    for (const record of records) {
      const month = dayjs(record.date).format("MMMM");
      const dateLabel = dayjs(record.date).format("D MMM");
      if (!monthMap[month]) {
        monthMap[month] = {
          month,
          dates_held: [],
          dates_attended: [],
          dates_absent: [],
        };
      }
      monthMap[month].dates_held.push(dateLabel);
      if (record.status === "PRESENT") {
        monthMap[month].dates_attended.push(dateLabel);
      } else {
        monthMap[month].dates_absent.push(dateLabel);
      }
    }

    res.json({
      subject_id: subjectId,
      subject_name: records[0].subject.name,
      overall: { attended, held, percentage },
      monthly_breakdown: Object.values(monthMap),
    });
  } catch (err) {
    console.error("getSubjectBreakdown error:", err);
    res.status(500).json({ error: "Failed to load breakdown" });
  }
}