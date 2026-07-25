import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import dayjs from "dayjs";

async function seed() {
  console.log("🌱 Seeding database...");

  // ── Users ──
  const studentPassword = await bcrypt.hash("student123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);

  const student = await prisma.user.upsert({
    where: { email: "student@acaddesk.com" },
    update: {
      phone: "9876543210",
      university_roll_no: "2200970100042",
      student_id: "GEHU2200042",
      year: "3rd Year",
      section: "CS-3B",
      cgpa: "8.4",
      course: "B.Tech",
      branch: "Computer Science Engineering",
    },
    create: {
      name: "Akansh Dev",
      email: "student@acaddesk.com",
      password: studentPassword,
      role: "STUDENT",
      college_id: "c1",
      phone: "9876543210",
      university_roll_no: "2200970100042",
      student_id: "GEHU2200042",
      year: "3rd Year",
      section: "CS-3B",
      cgpa: "8.4",
      course: "B.Tech",
      branch: "Computer Science Engineering",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@acaddesk.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@acaddesk.com",
      password: adminPassword,
      role: "ADMIN",
      college_id: "c1",
    },
  });

  // ── Subjects ──
  const subjectData = [
    { name: "Computer Networks", college_id: "c1" },
    { name: "Operating Systems", college_id: "c1" },
    { name: "DBMS", college_id: "c1" },
    { name: "Computer Networks Lab", college_id: "c1" },
    { name: "OS Lab", college_id: "c1" },
  ];

  const subjects = [];
  for (const s of subjectData) {
    const subject = await prisma.subject.upsert({
      where: { id: s.name },
      update: {},
      create: { name: s.name, college_id: s.college_id },
    });
    subjects.push(subject);
  }

  // ── Attendance Records ──
  await prisma.attendanceRecord.deleteMany({ where: { user_id: student.id } });

  const attendanceData = [
    { subjectIndex: 0, attended: 18, held: 25 },
    { subjectIndex: 1, attended: 14, held: 24 },
    { subjectIndex: 2, attended: 20, held: 25 },
    { subjectIndex: 3, attended: 8,  held: 10 },
    { subjectIndex: 4, attended: 5,  held: 10 },
  ];

  const today = dayjs();

  for (const item of attendanceData) {
    const subject = subjects[item.subjectIndex];
    const records = [];
    for (let i = 0; i < item.held; i++) {
      const date = today.subtract(item.held - i, "day").toDate();
      const status = i < item.attended ? "PRESENT" : "ABSENT";
      records.push({ user_id: student.id, subject_id: subject.id, date, status });
    }
    await prisma.attendanceRecord.createMany({ data: records });
  }

  // ── Notifications ──
  await prisma.notification.deleteMany({ where: { user_id: student.id } });

  await prisma.notification.createMany({
    data: [
      {
        user_id: student.id,
        source: "ERP",
        type: "EXAM",
        title: "Mid Term Exam scheduled - 12 July",
        message: "Mid term theory exams begin from 12th July. Check your timetable for subject-wise schedule.",
        is_read: false,
        created_at: dayjs().subtract(2, "hour").toDate(),
      },
      {
        user_id: student.id,
        source: "SYSTEM",
        type: "ATTENDANCE",
        title: "Attendance dropped below 70% in Operating Systems",
        message: "Your attendance in Operating Systems is now 58%. Attend the next 10 classes to recover.",
        is_read: false,
        created_at: dayjs().subtract(5, "hour").toDate(),
      },
      {
        user_id: student.id,
        source: "SYSTEM",
        type: "ATTENDANCE",
        title: "Attendance at risk in OS Lab",
        message: "Your OS Lab attendance is 50%. Immediate action required.",
        is_read: false,
        created_at: dayjs().subtract(1, "day").toDate(),
      },
      {
        user_id: student.id,
        source: "ERP",
        type: "HOLIDAY",
        title: "Republic Day Holiday - 26 January",
        message: "The college will remain closed on 26th January on account of Republic Day.",
        is_read: true,
        created_at: dayjs().subtract(2, "day").toDate(),
      },
      {
        user_id: student.id,
        source: "ERP",
        type: "EVENT",
        title: "Hackathon registration open",
        message: "TechFest Hackathon registrations are open. Last date to register is 20th July.",
        is_read: true,
        created_at: dayjs().subtract(3, "day").toDate(),
      },
      {
        user_id: student.id,
        source: "ERP",
        type: "ANNOUNCEMENT",
        title: "PBL submission deadline extended",
        message: "The PBL submission deadline has been extended to 25th July due to popular demand.",
        is_read: true,
        created_at: dayjs().subtract(5, "day").toDate(),
      },
    ],
  });

  console.log("✅ Seeding complete");
  console.log("   student@acaddesk.com / student123");
  console.log("   admin@acaddesk.com   / admin123");

  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  prisma.$disconnect();
  process.exit(1);
});