import { RefreshCw } from "lucide-react";
import { useAssignments } from "../hooks/useAssignments";
import { useExamPhases } from "../hooks/useExamPhases";
import AssignmentGroup from "../components/assignments/AssignmentGroup";
import ExamPhaseList from "../components/assignments/ExamPhaseList";

export default function AssignmentsExams() {
  const {
    grouped,
    hasAssignments,
    isLoading: assignmentsLoading,
    isError: assignmentsError,
    refetch: refetchAssignments,
  } = useAssignments();

  const {
    upcomingPhases,
    hasPhases,
    isLoading: phasesLoading,
    isError: phasesError,
    refetch: refetchPhases,
  } = useExamPhases();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 lg:flex-row">

        {/* LEFT — Assignments (70%) */}
        <div className="lg:w-[70%]">
          <h2 className="mb-4 text-sm font-semibold text-surface-700 dark:text-slate-200">
            Assignments
          </h2>

          {assignmentsLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-surface-100 dark:bg-slate-800" />
                  <div className="h-14 animate-pulse rounded-xl bg-surface-100 dark:bg-slate-800" />
                  <div className="h-14 animate-pulse rounded-xl bg-surface-100 dark:bg-slate-800" />
                </div>
              ))}
            </div>
          )}

          {assignmentsError && !assignmentsLoading && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <p className="text-sm text-surface-500">
                Could not load assignments. Try again.
              </p>
              <button
                type="button"
                onClick={refetchAssignments}
                className="flex items-center gap-1.5 rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-medium text-surface-600 hover:bg-surface-100"
              >
                <RefreshCw size={13} />
                Retry
              </button>
            </div>
          )}

          {!assignmentsLoading && !assignmentsError && !hasAssignments && (
            <div className="flex min-h-[200px] items-center justify-center">
              <p className="text-sm text-surface-400">
                No assignments till now. Enjoy! 🎉
              </p>
            </div>
          )}

          {!assignmentsLoading && !assignmentsError && hasAssignments && (
            <div className="space-y-6">
              {grouped.map((group) => (
                <AssignmentGroup key={group.subject_id} group={group} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Exam Phases (30%) */}
        <div className="lg:w-[30%]">
          <h2 className="mb-4 text-sm font-semibold text-surface-700 dark:text-slate-200">
            Exam Schedule
          </h2>
          <ExamPhaseList
            upcomingPhases={upcomingPhases}
            hasPhases={hasPhases}
            isLoading={phasesLoading}
            isError={phasesError}
            onRetry={refetchPhases}
          />
        </div>
      </div>
    </div>
  );
}