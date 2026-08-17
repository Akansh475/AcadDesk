import AssignmentRow from "./AssignmentRow";

export default function AssignmentGroup({ group }) {
  const { subject_name, assignments } = group;
  const hasOverdue = assignments.some((a) => a.status === "Overdue");

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        {hasOverdue && (
          <span className="h-2 w-2 rounded-full bg-red-500" />
        )}
        <h3 className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-slate-400">
          {subject_name}
        </h3>
      </div>
      <div className="space-y-2">
        {assignments.map((assignment) => (
          <AssignmentRow key={assignment.id} assignment={assignment} />
        ))}
      </div>
    </div>
  );
}