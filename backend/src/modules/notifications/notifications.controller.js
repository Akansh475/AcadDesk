import prisma from "../../config/prisma.js";
import dayjs from "dayjs";

async function resolveUser(userId, reqUser) {
  if (userId && userId !== "u1") {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (user) return user;
  }
  if (reqUser?.id) {
    const user = await prisma.user.findUnique({
      where: { id: reqUser.id },
      select: { id: true },
    });
    if (user) return user;
  }
  return await prisma.user.findFirst({
    where: { role: "STUDENT" },
    select: { id: true },
  });
}

export async function getNotifications(req, res) {
  try {
    const { userId } = req.params;
    const user = await resolveUser(userId, req.user);

    if (!user) return res.json([]);

    const sevenDaysAgo = dayjs().subtract(7, "day").toDate();

    const notifications = await prisma.notification.findMany({
      where: {
        user_id: user.id,
        created_at: { gte: sevenDaysAgo },
      },
      orderBy: { created_at: "desc" },
    });

    res.json(notifications);
  } catch (err) {
    console.error("getNotifications error:", err);
    res.status(500).json({ error: "Failed to load notifications" });
  }
}

export async function markAsRead(req, res) {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: { id },
      data: { is_read: true },
    });

    res.json(notification);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Notification not found" });
    }
    console.error("markAsRead error:", err);
    res.status(500).json({ error: "Failed to mark as read" });
  }
}

export async function getUnreadCount(req, res) {
  try {
    const { userId } = req.params;
    const user = await resolveUser(userId, req.user);

    if (!user) return res.json({ count: 0 });

    const sevenDaysAgo = dayjs().subtract(7, "day").toDate();

    const count = await prisma.notification.count({
      where: {
        user_id: user.id,
        is_read: false,
        created_at: { gte: sevenDaysAgo },
      },
    });

    res.json({ count });
  } catch (err) {
    console.error("getUnreadCount error:", err);
    res.status(500).json({ error: "Failed to get unread count" });
  }
}