import prisma from "../../config/prisma.js";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";

// ==========================================
// 1. STUDENTS
// ==========================================
export async function getStudents(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 50));
    const search = req.query.search?.trim() || "";
    const branch = req.query.branch?.trim() || "";
    const year = req.query.year?.trim() || "";

    const where = {
      role: "STUDENT",
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { university_roll_no: { contains: search, mode: "insensitive" } },
        { student_id: { contains: search, mode: "insensitive" } },
      ];
    }

    if (branch) {
      where.branch = branch;
    }

    if (year) {
      where.year = year;
    }

    const [total, students] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          university_roll_no: true,
          student_id: true,
          year: true,
          section: true,
          cgpa: true,
          course: true,
          branch: true,
          phone: true,
          created_at: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      students,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (err) {
    console.error("getStudents error:", err);
    res.status(500).json({ error: "Failed to fetch students list" });
  }
}

export async function createStudent(req, res) {
  try {
    const {
      name,
      email,
      university_roll_no,
      student_id,
      branch,
      course,
      year,
      section,
      cgpa,
      phone,
      college_id = "c1",
    } = req.body;

    if (!name || !email || !university_roll_no) {
      return res.status(400).json({ error: "Name, email, and university roll number are required." });
    }

    // Check duplicate email
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    // Check duplicate roll number
    const existingRoll = await prisma.user.findFirst({
      where: { university_roll_no },
    });
    if (existingRoll) {
      return res.status(400).json({ error: `Roll number ${university_roll_no} is already assigned.` });
    }

    const hashedPassword = await bcrypt.hash("Student@123", 10);

    const newStudent = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: "STUDENT",
        college_id,
        university_roll_no: university_roll_no.trim(),
        student_id: student_id?.trim() || `STU${Date.now().toString().slice(-6)}`,
        branch: branch || "Computer Science",
        course: course || "B.Tech CSE",
        year: year || "1st Year",
        section: section || "A",
        cgpa: cgpa ? String(cgpa) : "0.00",
        phone: phone?.trim() || null,
      },
    });

    res.status(201).json(newStudent);
  } catch (err) {
    console.error("createStudent error:", err);
    res.status(500).json({ error: "Failed to create student" });
  }
}

export async function updateStudent(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      university_roll_no,
      student_id,
      branch,
      course,
      year,
      section,
      cgpa,
      phone,
    } = req.body;

    if (university_roll_no) {
      const existingRoll = await prisma.user.findFirst({
        where: {
          university_roll_no,
          NOT: { id },
        },
      });
      if (existingRoll) {
        return res.status(400).json({ error: "University roll number is already assigned to another student." });
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(email && { email: email.trim().toLowerCase() }),
        ...(university_roll_no && { university_roll_no: university_roll_no.trim() }),
        ...(student_id && { student_id: student_id.trim() }),
        ...(branch && { branch }),
        ...(course && { course }),
        ...(year && { year }),
        ...(section && { section }),
        ...(cgpa !== undefined && { cgpa: String(cgpa) }),
        ...(phone !== undefined && { phone: phone?.trim() || null }),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("updateStudent error:", err);
    res.status(500).json({ error: "Failed to update student" });
  }
}

export async function deleteStudent(req, res) {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id },
    });
    res.json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    console.error("deleteStudent error:", err);
    res.status(500).json({ error: "Failed to delete student" });
  }
}

// ==========================================
// 2. COURSES / SUBJECTS
// ==========================================
export async function getCourses(req, res) {
  try {
    const courses = await prisma.subject.findMany({
      orderBy: { created_at: "desc" },
    });

    const formatted = courses.map((c) => ({
      id: c.id,
      code: c.course_id || c.name.slice(0, 5).toUpperCase(),
      name: c.name,
      college_id: c.college_id,
      department: "Computer Science",
      created_at: c.created_at,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("getCourses error:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
}

export async function createCourse(req, res) {
  try {
    const { code, name, college_id = "c1" } = req.body;

    if (!code || !name) {
      return res.status(400).json({ error: "Course code and course name are required." });
    }

    const normalizedCode = code.trim().toUpperCase();
    const existing = await prisma.subject.findFirst({
      where: {
        OR: [
          { course_id: normalizedCode },
          { name: { equals: name.trim(), mode: "insensitive" } },
        ],
      },
    });

    if (existing) {
      return res.status(400).json({ error: "Course code already exists" });
    }

    const subject = await prisma.subject.create({
      data: {
        name: name.trim(),
        course_id: normalizedCode,
        college_id,
      },
    });

    res.status(201).json({
      id: subject.id,
      code: subject.course_id,
      name: subject.name,
      college_id: subject.college_id,
      created_at: subject.created_at,
    });
  } catch (err) {
    console.error("createCourse error:", err);
    res.status(500).json({ error: "Failed to create course" });
  }
}

export async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const { code, name } = req.body;

    if (code) {
      const normalizedCode = code.trim().toUpperCase();
      const existing = await prisma.subject.findFirst({
        where: {
          course_id: normalizedCode,
          NOT: { id },
        },
      });
      if (existing) {
        return res.status(400).json({ error: "Course code already exists" });
      }
    }

    const updated = await prisma.subject.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(code && { course_id: code.trim().toUpperCase() }),
      },
    });

    res.json({
      id: updated.id,
      code: updated.course_id,
      name: updated.name,
      college_id: updated.college_id,
      created_at: updated.created_at,
    });
  } catch (err) {
    console.error("updateCourse error:", err);
    res.status(500).json({ error: "Failed to update course" });
  }
}

export async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    await prisma.subject.delete({
      where: { id },
    });
    res.json({ success: true, message: "Course deleted successfully" });
  } catch (err) {
    console.error("deleteCourse error:", err);
    res.status(500).json({ error: "Failed to delete course" });
  }
}

// ==========================================
// 3. CALENDAR
// ==========================================
export async function getCalendar(req, res) {
  try {
    const events = await prisma.academicCalendarEvent.findMany({
      orderBy: { date: "asc" },
    });
    res.json(events);
  } catch (err) {
    console.error("getCalendar error:", err);
    res.status(500).json({ error: "Failed to fetch academic calendar" });
  }
}

export async function createCalendarEvent(req, res) {
  try {
    const { title, type, date, course_id, college_id = "c1" } = req.body;

    if (!title || !type || !date) {
      return res.status(400).json({ error: "Title, type, and date are required." });
    }

    const typeMapping = {
      exam: "EXAM",
      practical: "PRACTICAL",
      pbl: "PBL",
      holiday: "HOLIDAY",
    };

    const event = await prisma.academicCalendarEvent.create({
      data: {
        title: title.trim(),
        type: typeMapping[type.toLowerCase()] || "EXAM",
        date: new Date(date),
        course_id: course_id || null,
        college_id,
      },
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("createCalendarEvent error:", err);
    res.status(500).json({ error: "Failed to create calendar event" });
  }
}

export async function updateCalendarEvent(req, res) {
  try {
    const { id } = req.params;
    const { title, type, date, course_id } = req.body;

    const typeMapping = {
      exam: "EXAM",
      practical: "PRACTICAL",
      pbl: "PBL",
      holiday: "HOLIDAY",
    };

    const updated = await prisma.academicCalendarEvent.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(type && { type: typeMapping[type.toLowerCase()] || "EXAM" }),
        ...(date && { date: new Date(date) }),
        ...(course_id !== undefined && { course_id: course_id || null }),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("updateCalendarEvent error:", err);
    res.status(500).json({ error: "Failed to update calendar event" });
  }
}

export async function deleteCalendarEvent(req, res) {
  try {
    const { id } = req.params;
    await prisma.academicCalendarEvent.delete({
      where: { id },
    });
    res.json({ success: true, message: "Calendar event deleted" });
  } catch (err) {
    console.error("deleteCalendarEvent error:", err);
    res.status(500).json({ error: "Failed to delete calendar event" });
  }
}

// ==========================================
// 4. ASSIGNMENTS
// ==========================================
export async function getAssignments(req, res) {
  try {
    const assignments = await prisma.assignment.findMany({
      include: { subject: true },
      orderBy: { due_date: "asc" },
    });

    const formatted = assignments.map((a) => ({
      id: a.id,
      title: a.title,
      course_id: a.subject_id,
      course_name: a.subject?.name || "General Course",
      due_date: a.due_date,
      marks: a.marks,
      description: a.description,
      file_url: a.file_url,
      file_name: a.file_name,
      file_size: a.file_size,
      status: a.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("getAssignments error:", err);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
}

export async function createAssignment(req, res) {
  try {
    const { title, course_id, due_date, marks, description, file_url, file_name, file_size } = req.body;

    if (!title || !course_id || !due_date) {
      return res.status(400).json({ error: "Title, course, and due date are required." });
    }

    // Get an admin or default user to assign reference
    const adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });
    const fallbackUser = adminUser || (await prisma.user.findFirst());

    const newAssignment = await prisma.assignment.create({
      data: {
        title: title.trim(),
        subject_id: course_id,
        user_id: fallbackUser?.id || "admin",
        due_date: new Date(due_date),
        marks: marks ? parseInt(marks, 10) : 20,
        description: description?.trim() || null,
        file_url: file_url || null,
        file_name: file_name || null,
        file_size: file_size || null,
      },
      include: { subject: true },
    });

    res.status(201).json(newAssignment);
  } catch (err) {
    console.error("createAssignment error:", err);
    res.status(500).json({ error: "Failed to create assignment" });
  }
}

export async function updateAssignment(req, res) {
  try {
    const { id } = req.params;
    const { title, course_id, due_date, marks, description, file_url, file_name, file_size } = req.body;

    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(course_id && { subject_id: course_id }),
        ...(due_date && { due_date: new Date(due_date) }),
        ...(marks !== undefined && { marks: parseInt(marks, 10) }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(file_url !== undefined && { file_url }),
        ...(file_name !== undefined && { file_name }),
        ...(file_size !== undefined && { file_size }),
      },
      include: { subject: true },
    });

    res.json(updated);
  } catch (err) {
    console.error("updateAssignment error:", err);
    res.status(500).json({ error: "Failed to update assignment" });
  }
}

export async function deleteAssignment(req, res) {
  try {
    const { id } = req.params;
    await prisma.assignment.delete({
      where: { id },
    });
    res.json({ success: true, message: "Assignment deleted" });
  } catch (err) {
    console.error("deleteAssignment error:", err);
    res.status(500).json({ error: "Failed to delete assignment" });
  }
}

// ==========================================
// 5. ATTENDANCE (Bulk Marking)
// ==========================================
export async function getAttendanceByCourseAndDate(req, res) {
  try {
    const { courseId, date } = req.params;
    const targetDate = dayjs(date).startOf("day").toDate();
    const nextDate = dayjs(date).endOf("day").toDate();

    // Get all students
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: {
        id: true,
        name: true,
        university_roll_no: true,
        student_id: true,
        branch: true,
        section: true,
      },
      orderBy: { university_roll_no: "asc" },
    });

    // Get existing records for this course + date
    const existingRecords = await prisma.attendanceRecord.findMany({
      where: {
        subject_id: courseId,
        date: {
          gte: targetDate,
          lte: nextDate,
        },
      },
    });

    const statusMap = new Map(existingRecords.map((r) => [r.user_id, r.status]));

    const records = students.map((s) => ({
      student_id: s.id,
      name: s.name,
      university_roll_no: s.university_roll_no,
      student_id_code: s.student_id,
      branch: s.branch,
      section: s.section,
      status: statusMap.get(s.id) || "PRESENT",
    }));

    res.json({
      course_id: courseId,
      date,
      total_enrolled: students.length,
      records,
      has_saved_records: existingRecords.length > 0,
    });
  } catch (err) {
    console.error("getAttendanceByCourseAndDate error:", err);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
}

export async function saveBulkAttendance(req, res) {
  try {
    const { course_id, date, records } = req.body;

    if (!course_id || !date || !Array.isArray(records)) {
      return res.status(400).json({ error: "Course ID, date, and records are required." });
    }

    const sessionDate = dayjs(date).toDate();
    const targetDate = dayjs(date).startOf("day").toDate();
    const nextDate = dayjs(date).endOf("day").toDate();

    // Atomic transaction
    await prisma.$transaction(async (tx) => {
      // Delete existing records for this subject and date
      await tx.attendanceRecord.deleteMany({
        where: {
          subject_id: course_id,
          date: {
            gte: targetDate,
            lte: nextDate,
          },
        },
      });

      // Insert new records
      if (records.length > 0) {
        await tx.attendanceRecord.createMany({
          data: records.map((r) => ({
            subject_id: course_id,
            user_id: r.student_id,
            date: sessionDate,
            status: r.status === "ABSENT" ? "ABSENT" : "PRESENT",
          })),
        });
      }
    });

    res.json({
      success: true,
      message: `Successfully saved attendance for ${records.length} students on ${date}.`,
      count: records.length,
    });
  } catch (err) {
    console.error("saveBulkAttendance error:", err);
    res.status(500).json({ error: "Failed to save attendance in bulk" });
  }
}

// ==========================================
// 6. NOTIFICATIONS (Broadcast)
// ==========================================
export async function getNotifications(req, res) {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { created_at: "desc" },
    });
    res.json(notifications);
  } catch (err) {
    console.error("getNotifications error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}

export async function createNotification(req, res) {
  try {
    const { title, message, type = "ANNOUNCEMENT" } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required." });
    }

    const typeMapping = {
      exam: "EXAM",
      holiday: "HOLIDAY",
      event: "EVENT",
      announcement: "ANNOUNCEMENT",
      attendance: "ATTENDANCE",
    };

    const notifType = typeMapping[type.toLowerCase()] || "ANNOUNCEMENT";

    // Broadcast to all active students
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true },
    });

    if (students.length > 0) {
      await prisma.notification.createMany({
        data: students.map((s) => ({
          user_id: s.id,
          title: title.trim(),
          message: message.trim(),
          type: notifType,
          source: "SYSTEM",
        })),
      });
    }

    res.status(201).json({
      title,
      message,
      type: notifType,
      broadcast_count: students.length,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("createNotification error:", err);
    res.status(500).json({ error: "Failed to broadcast notification" });
  }
}
