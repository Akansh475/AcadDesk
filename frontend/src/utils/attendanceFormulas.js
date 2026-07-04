/**
 * Calculates how many classes a student can skip
 * and still stay at or above 70%.
 *
 * Formula: x = floor((attended - 0.70 * total) / 0.70)
 *
 * @param {number} attended - classes attended so far
 * @param {number} total    - total classes held so far
 * @returns {number} number of classes that can be skipped (>= 0)
 */
export function bunkBudget(attended, total) {
  if (total === 0) return 0;
  return Math.floor((attended - 0.7 * total) / 0.7);
}

/**
 * Calculates how many consecutive classes a student
 * must attend to reach 70%.
 *
 * Formula: x = ceil((0.70 * total - attended) / 0.30)
 *
 * @param {number} attended - classes attended so far
 * @param {number} total    - total classes held so far
 * @returns {number} number of classes needed (> 0)
 */
export function classesNeeded(attended, total) {
  if (total === 0) return 0;
  return Math.ceil((0.7 * total - attended) / 0.3);
}

/**
 * Returns a human-readable message for the bunk budget.
 * Used directly in SubjectCard.
 */
export function bunkBudgetMessage(attended, total) {
  if (total === 0) return "Semester not started yet";
  const percentage = (attended / total) * 100;
  if (percentage === 100) {
    const budget = bunkBudget(attended, total);
    return `Perfect attendance! You can skip ${budget} more ${budget === 1 ? "class" : "classes"}.`;
  }
  const budget = bunkBudget(attended, total);
  if (budget === 0) return "You are exactly at 70%. Don't miss any class.";
  return `You can skip ${budget} more ${budget === 1 ? "class" : "classes"} and still stay above 70%`;
}

/**
 * Returns a human-readable message for classes needed.
 * Used directly in SubjectCard.
 */
export function classesNeededMessage(attended, total) {
  if (total === 0) return "Semester not started yet";
  const needed = classesNeeded(attended, total);
  return `Attend next ${needed} consecutive ${needed === 1 ? "class" : "classes"} to reach 70%`;
}