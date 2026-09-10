import prisma from "../../config/prisma.js";

export async function getTasks(req, res) {
  try {
    const { userId } = req.params;

    // Check for pending tasks that just passed their deadline and haven't been deducted yet
    const now = new Date();
    const overdueTasks = await prisma.task.findMany({
      where: {
        user_id: userId,
        status: "PENDING",
        overdue_deducted: false,
        due_date: { lt: now },
      },
    });

    if (overdueTasks.length > 0) {
      await prisma.task.updateMany({
        where: { id: { in: overdueTasks.map((t) => t.id) } },
        data: { overdue_deducted: true },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { points: { decrement: 3 * overdueTasks.length } },
      });

      // Create notification for overdue task deduction
      for (const t of overdueTasks) {
        await prisma.notification.create({
          data: {
            user_id: userId,
            source: "SYSTEM",
            type: "ANNOUNCEMENT",
            title: `Goal Overdue: ${t.title}`,
            message: `⚠️ Your goal '${t.title}' is overdue. 3 points have been deducted from your accountability score.`,
            is_read: false,
          },
        }).catch(() => {});
      }
    }

    const tasks = await prisma.task.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    });

    res.json({
      tasks,
      points: user?.points ?? 0,
    });
  } catch (err) {
    console.error("getTasks error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}

export async function createTask(req, res) {
  try {
    const { user_id, title, description, due_date, priority } = req.body;

    if (!title || !due_date || !user_id) {
      return res.status(400).json({ error: "user_id, title and due_date are required" });
    }

    const existingCount = await prisma.task.count({
      where: { user_id, status: "PENDING" },
    });

    if (existingCount >= 10) {
      return res.status(400).json({ error: "Task limit reached. Complete or remove a task first." });
    }

    const task = await prisma.task.create({
      data: {
        user_id,
        title,
        description: description ?? null,
        due_date: new Date(due_date),
        priority: priority?.toUpperCase() ?? "MEDIUM",
        status: "PENDING",
      },
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
}

export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, due_date, priority, status } = req.body;

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    let pointsDelta = 0;
    const targetStatus = status ? status.toUpperCase() : null;

    if (targetStatus && targetStatus !== existingTask.status) {
      if (targetStatus === "COMPLETED") {
        pointsDelta = 5;
      } else if (existingTask.status === "COMPLETED" && targetStatus === "PENDING") {
        pointsDelta = -5;
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(due_date && { due_date: new Date(due_date) }),
        ...(priority && { priority: priority.toUpperCase() }),
        ...(targetStatus && { status: targetStatus }),
      },
    });

    let currentPoints = 0;
    if (pointsDelta !== 0) {
      const updatedUser = await prisma.user.update({
        where: { id: task.user_id },
        data: { points: { increment: pointsDelta } },
        select: { points: true },
      });
      currentPoints = updatedUser.points;

      // Notification
      const notifTitle = pointsDelta > 0 ? `🎯 Goal Completed! (+5 pts)` : `Goal Reopened (-5 pts)`;
      const notifMsg = pointsDelta > 0
        ? `Great job! You completed '${task.title}' and earned +5 points! Keep it up.`
        : `Task '${task.title}' was marked pending. 5 points were reversed.`;

      await prisma.notification.create({
        data: {
          user_id: task.user_id,
          source: "SYSTEM",
          type: "ANNOUNCEMENT",
          title: notifTitle,
          message: notifMsg,
          is_read: false,
        },
      }).catch(() => {});
    } else {
      const user = await prisma.user.findUnique({
        where: { id: task.user_id },
        select: { points: true },
      });
      currentPoints = user?.points ?? 0;
    }

    res.json({
      ...task,
      pointsDelta,
      userPoints: currentPoints,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }
    console.error("updateTask error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
}

export async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    await prisma.task.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(500).json({ error: "Failed to delete task" });
  }
}