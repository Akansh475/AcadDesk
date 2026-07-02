import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

async function seed() {
  console.log("🌱 Seeding database...");

  const studentPassword = await bcrypt.hash("student123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
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

  console.log("✅ Seeding complete");
  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  prisma.$disconnect();
  process.exit(1);
});