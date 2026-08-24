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

/**
 * Calculates the delay penalty for an assignment.
 * Policy: 2% deduction from total marks for every 1 day of delay.
 *
 * @param {number|string|null|undefined} marks - Total marks for assignment
 * @param {string|Date} dueDate - Due date of the assignment
 * @param {string} status - Current status ('Pending', 'Overdue', 'Submitted', etc.)
 */
export function calculateAssignmentPenalty(marks, dueDate, status) {
  const isSubmitted = status === "Submitted" || status === "SUBMITTED";
  const daysDiff = dayjs(dueDate).startOf("day").diff(dayjs().startOf("day"), "day");
  const isOverdue = !isSubmitted && (status === "Overdue" || status === "OVERDUE" || daysDiff < 0);
  const daysOverdue = isOverdue ? Math.max(1, Math.abs(daysDiff)) : 0;
  const penaltyRatePerDay = 2; // 2% per day
  const totalMarks = marks != null ? Number(marks) : null;

  if (totalMarks === null || isNaN(totalMarks)) {
    return {
      isOverdue,
      daysOverdue,
      deductionPercentage: isOverdue ? daysOverdue * penaltyRatePerDay : 0,
      deductedMarks: 0,
      obtainableMarks: null,
      totalMarks: null,
      penaltyRatePerDay,
    };
  }

  const deductionPercentage = isOverdue ? Math.min(100, daysOverdue * penaltyRatePerDay) : 0;
  const rawDeducted = (totalMarks * deductionPercentage) / 100;
  const deductedMarks = Number(rawDeducted.toFixed(2));
  const obtainableMarks = Number(Math.max(0, totalMarks - rawDeducted).toFixed(2));

  return {
    isOverdue,
    daysOverdue,
    deductionPercentage,
    deductedMarks,
    obtainableMarks,
    totalMarks,
    penaltyRatePerDay,
  };
}