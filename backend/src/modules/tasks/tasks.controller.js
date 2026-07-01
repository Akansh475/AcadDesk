import prisma from "../../config/prisma.js";

export async function getTasks(req, res) {
  try {
    const { userId } = req.params;
    const tasks = await prisma.task.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });
    res.json(tasks);
  } catch (err) {
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

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(due_date && { due_date: new Date(due_date) }),
        ...(priority && { priority: priority.toUpperCase() }),
        ...(status && { status: status.toUpperCase() }),
      },
    });

    res.json(task);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }
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