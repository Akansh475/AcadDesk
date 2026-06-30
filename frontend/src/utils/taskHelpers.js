import dayjs from "dayjs";

/**
 * Returns the number of whole days between today and the due date.
 * Positive = future, 0 = today, negative = overdue.
 */
export function getDaysLeft(dueDate) {
  const today = dayjs().startOf("day");
  const due = dayjs(dueDate).startOf("day");
  return due.diff(today, "day");
}

/**
 * Returns { label, tone } for a task's countdown, ready to render.
 * tone is one of "default" | "danger" used to pick text color classes.
 */
export function getCountdownMeta(dueDate) {
  const daysLeft = getDaysLeft(dueDate);

  if (daysLeft < 0) {
    return { label: "Overdue", tone: "danger", daysLeft };
  }
  if (daysLeft === 0) {
    return { label: "Due Today", tone: "danger", daysLeft };
  }
  return { label: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`, tone: "default", daysLeft };
}

/** Returns true if a date (string or Date) falls before today. */
export function isPastDate(date) {
  return dayjs(date).startOf("day").isBefore(dayjs().startOf("day"));
}

export const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

export const PRIORITY_DOT_CLASSES = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
};

export const CALENDAR_BADGE_CLASSES = {
  exam: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  practical: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  pbl: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  holiday: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
};

/** Sorts tasks: pending first (by priority, then due date), completed last. */
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "Completed" ? 1 : -1;
    }
    if (a.status === "Completed") {
      // most recently completed-feeling order isn't specified; fall back to due date
      return dayjs(a.due_date).diff(dayjs(b.due_date));
    }
    const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return dayjs(a.due_date).diff(dayjs(b.due_date));
  });
}

/** Groups academic calendar events by "Month YYYY", preserving chronological order. */
export function groupEventsByMonth(events) {
  const sorted = [...events].sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  const groups = [];
  const indexByKey = {};

  for (const event of sorted) {
    const key = dayjs(event.date).format("MMMM YYYY");
    if (!(key in indexByKey)) {
      indexByKey[key] = groups.length;
      groups.push({ month: key, events: [] });
    }
    groups[indexByKey[key]].events.push(event);
  }

  return groups;
}