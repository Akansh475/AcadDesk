import prisma from "../../config/prisma.js";

async function resolveAdminSender(reqUser) {
  if (reqUser?.id) {
    const user = await prisma.user.findUnique({
      where: { id: reqUser.id },
      select: { id: true, name: true, role: true },
    });
    if (user) return user;
  }
  // Fallback to any admin in the database
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true, name: true, role: true },
  });
  if (admin) return admin;

  // Fallback to first user
  return await prisma.user.findFirst({
    select: { id: true, name: true, role: true },
  });
}

/**
 * Admin sends a message to a specific student
 * POST /api/messages/student/:studentId
 */
export async function sendMessageToStudent(req, res) {
  try {
    const { studentId } = req.params;
    const { subject, message, category = "General", priority = "MEDIUM" } = req.body;

    if (!subject || !subject.trim()) {
      return res.status(400).json({ error: "Subject is required" });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message body is required" });
    }

    // Verify student exists
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true, name: true, email: true },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const sender = await resolveAdminSender(req.user);
    if (!sender) {
      return res.status(500).json({ error: "No sender found" });
    }

    const validPriorities = ["HIGH", "MEDIUM", "LOW"];
    const normalizedPriority = validPriorities.includes(priority?.toUpperCase())
      ? priority.toUpperCase()
      : "MEDIUM";

    const newMsg = await prisma.adminMessage.create({
      data: {
        student_id: student.id,
        sender_id: sender.id,
        sender_name: sender.name || "Administrator",
        subject: subject.trim(),
        message: message.trim(),
        category: category.trim() || "General",
        priority: normalizedPriority,
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Also trigger a system notification for the student
    try {
      await prisma.notification.create({
        data: {
          user_id: student.id,
          source: "SYSTEM",
          type: "ADMIN_MESSAGE",
          title: `Message from Admin: ${subject.trim()}`,
          message: message.trim(),
        },
      });
    } catch (notifErr) {
      console.warn("Could not create linked notification:", notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: `Message delivered to ${student.name}`,
      data: newMsg,
    });
  } catch (err) {
    console.error("sendMessageToStudent error:", err);
    res.status(500).json({ error: "Failed to send message to student" });
  }
}

/**
 * Retrieve all messages for a student
 * GET /api/messages/student/:studentId
 */
export async function getStudentMessages(req, res) {
  try {
    const { studentId } = req.params;

    // Check if student exists or resolve default
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true, name: true },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const messages = await prisma.adminMessage.findMany({
      where: { student_id: student.id },
      orderBy: { created_at: "desc" },
      include: {
        sender: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    const unreadCount = messages.filter((m) => !m.is_read).length;

    res.json({
      messages,
      unreadCount,
      totalCount: messages.length,
    });
  } catch (err) {
    console.error("getStudentMessages error:", err);
    res.status(500).json({ error: "Failed to load messages" });
  }
}

/**
 * Mark a message as read
 * PATCH /api/messages/:id/read
 */
export async function markMessageAsRead(req, res) {
  try {
    const { id } = req.params;

    const updated = await prisma.adminMessage.update({
      where: { id },
      data: { is_read: true },
    });

    res.json({ success: true, message: updated });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Message not found" });
    }
    console.error("markMessageAsRead error:", err);
    res.status(500).json({ error: "Failed to mark message as read" });
  }
}

/**
 * Delete a message
 * DELETE /api/messages/:id
 */
export async function deleteMessage(req, res) {
  try {
    const { id } = req.params;

    await prisma.adminMessage.delete({
      where: { id },
    });

    res.json({ success: true, message: "Message deleted successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Message not found" });
    }
    console.error("deleteMessage error:", err);
    res.status(500).json({ error: "Failed to delete message" });
  }
}
