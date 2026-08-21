import { useState } from "react";
import { Plus, Sparkles, Bot } from "lucide-react";
import { useGoals } from "../hooks/useGoals";
import { useChat } from "../hooks/useChat";
import { useAttendance } from "../hooks/useAttendance";
import RoadmapView from "../components/timetable/RoadmapView";
import GoalForm from "../components/timetable/GoalForm";
import SessionList from "../components/study/SessionList";
import SubjectSelector from "../components/study/SubjectSelector";
import ChatWindow from "../components/study/ChatWindow";

export default function StudySession() {
  // ── Goals & Roadmap state & hooks ──
  const {
    goals,
    isLoading: goalsLoading,
    createGoal,
    isCreating: isCreatingGoal,
    deleteGoal,
    isDeleting: isDeletingGoal,
  } = useGoals();

  const [goalFormOpen, setGoalFormOpen] = useState(false);

  // ── AI Study Chat state & hooks ──
  const {
    sessions,
    sessionsLoading,
    activeSessionId,
    activeSession,
    messages,
    sessionLoading,
    isSending,
    startSession,
    isStarting: isStartingSession,
    selectSession,
    deleteSession,
    isDeleting: isDeletingSession,
    sendMessage,
  } = useChat();

  const { subjects } = useAttendance();

  const handleGoalSubmit = async (formData) => {
    await createGoal(formData);
    setGoalFormOpen(false);
  };

  const handleStartSession = async (payload) => {
    await startSession(payload);
  };

  // Find attendance percentage for the currently active subject session
  const currentAttendancePct =
    subjects.find(
      (s) =>
        s.subject_name?.toLowerCase() === activeSession?.subject_name?.toLowerCase()
    )?.percentage ?? 100;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ── LEFT COLUMN: Goals & AI Roadmap (38%) ── */}
        <div className="lg:w-[38%]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary-600 dark:text-primary-400" />
              <h2 className="text-sm font-semibold text-surface-800 dark:text-slate-100">
                Goals & AI Roadmaps
              </h2>
            </div>
            {goals.length > 0 && (
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-bold text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
                {goals.length} {goals.length === 1 ? "Goal" : "Goals"}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setGoalFormOpen(true)}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary-300 py-3 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50 dark:border-primary-500/30 dark:text-primary-400 dark:hover:bg-primary-500/5"
          >
            <Plus size={15} />
            Set a new goal
          </button>

          {goalsLoading && (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-2xl bg-surface-100 dark:bg-slate-800"
                />
              ))}
            </div>
          )}

          {!goalsLoading && goals.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-surface-200 p-8 text-center dark:border-slate-800">
              <Sparkles size={24} className="text-primary-300 dark:text-primary-500/40" />
              <p className="text-sm font-medium text-surface-700 dark:text-slate-300">
                No active goals yet
              </p>
              <p className="text-xs text-surface-400 dark:text-slate-500">
                Set an academic or career goal to receive a customized week-by-week roadmap.
              </p>
            </div>
          )}

          {!goalsLoading && goals.length > 0 && (
            <RoadmapView
              goals={goals}
              onDelete={deleteGoal}
              isDeleting={isDeletingGoal}
            />
          )}
        </div>

        {/* ── RIGHT COLUMN: AI Socratic Study Tutor (62%) ── */}
        <div className="flex flex-col lg:w-[62%]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-primary-600 dark:text-primary-400" />
              <h2 className="text-sm font-semibold text-surface-800 dark:text-slate-100">
                AI Socratic Tutor
              </h2>
            </div>
            <span className="text-xs text-surface-400 dark:text-slate-500">
              Interactive Concept Guidance
            </span>
          </div>

          <div className="flex h-[680px] overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Sidebar: Session History */}
            <div className="hidden w-56 shrink-0 border-r border-surface-200 dark:border-slate-800 sm:flex sm:flex-col">
              <SessionList
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelect={selectSession}
                onNew={() => selectSession(null)}
                isLoading={sessionsLoading}
              />
            </div>

            {/* Main Chat / Selector Window */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {activeSessionId && sessionLoading && (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
                    <p className="text-xs text-surface-400">Loading session...</p>
                  </div>
                </div>
              )}

              {activeSessionId && !sessionLoading && activeSession && (
                <ChatWindow
                  session={activeSession}
                  messages={messages}
                  isSending={isSending}
                  onSend={sendMessage}
                  onDelete={deleteSession}
                  isDeleting={isDeletingSession}
                  attendancePercentage={currentAttendancePct}
                />
              )}

              {!activeSessionId && (
                <SubjectSelector
                  subjects={subjects}
                  onStart={handleStartSession}
                  isStarting={isStartingSession}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Goal Creation Modal */}
      {goalFormOpen && (
        <GoalForm
          onSubmit={handleGoalSubmit}
          isSubmitting={isCreatingGoal}
          onClose={() => setGoalFormOpen(false)}
        />
      )}
    </div>
  );
}
