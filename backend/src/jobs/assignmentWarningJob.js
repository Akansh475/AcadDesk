import cron from "node-cron";
import dayjs from "dayjs";
import prisma from "../config/prisma.js";

export async function processAssignmentWarnings() {
  try {
    const todayStart = dayjs().startOf("day").toDate();
    const threeDaysLater = dayjs().add(3, "day").endOf("day").toDate();

    const assignments = await prisma.assignment.findMany({
      where: {
        status: "PENDING",
        marks: { not: null },
        due_date: {
          gte: todayStart,
          lte: threeDaysLater,
        },
      },
    });

    for (const assignment of assignments) {
      const daysLeft = Math.max(
        0,
        dayjs(assignment.due_date).startOf("day").diff(dayjs().startOf("day"), "day")
      );
      const daysText = daysLeft === 1 ? "1 day" : `${daysLeft} days`;
      const message = `⚠️ Your assignment '${assignment.title}' is due in ${daysText} and worth ${assignment.marks} marks. Submit soon.`;

      // Check if duplicate notification already created today for this user & message
      const existingNotification = await prisma.notification.findFirst({
        where: {
          user_id: assignment.user_id,
          message,
          created_at: { gte: todayStart },
        },
      });

      if (!existingNotification) {
        await prisma.notification.create({
          data: {
            user_id: assignment.user_id,
            source: "SYSTEM",
            type: "ANNOUNCEMENT",
            title: `Assignment Due Soon: ${assignment.title}`,
            message,
            is_read: false,
          },
        });
      }
    }

    console.log(`[AssignmentWarningJob] Processed ${assignments.length} assignments.`);
  } catch (error) {
    console.error("[AssignmentWarningJob] Error running assignment warning job:", error);
  }
}

export function initAssignmentWarningJob() {
  // Run daily at 8:00 AM ('0 8 * * *')
  const job = cron.schedule("0 8 * * *", async () => {
    console.log("[AssignmentWarningJob] Running daily 8 AM assignment warning job...");
    await processAssignmentWarnings();
  });

  return job;
}

export default initAssignmentWarningJob;
