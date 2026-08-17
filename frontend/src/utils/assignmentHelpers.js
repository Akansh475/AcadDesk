import dayjs from "dayjs";

/**
 * Groups a flat array of assignments by subject_id.
 * Returns array of { subject_id, subject_name, assignments[] }
 * sorted so subjects with overdue assignments come first.
 */
export function groupAssignmentsBySubject(assignments) {
  const map = {};

  for (const a of assignments) {
    if (!map[a.subject_id]) {
      map[a.subject_id] = {
        subject_id: a.subject_id,
        subject_name: a.subject_name,
        assignments: [],
      };
    }
    map[a.subject_id].assignments.push(a);
  }

  return Object.values(map).sort((a, b) => {
    const aHasOverdue = a.assignments.some((x) => x.status === "Overdue");
    const bHasOverdue = b.assignments.some((x) => x.status === "Overdue");
    if (aHasOverdue && !bHasOverdue) return -1;
    if (!aHasOverdue && bHasOverdue) return 1;
    return 0;
  });
}

/**
 * Returns days left until start_date.
 * Negative means it has passed.
 */
export function getDaysUntilExam(startDate) {
  return dayjs(startDate).startOf("day").diff(dayjs().startOf("day"), "day");
}

export const STATUS_STYLES = {
  Pending: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  Submitted: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  Overdue: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
};