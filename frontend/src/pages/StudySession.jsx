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
  const [activeTab, setActiveTab] = useState("chat"); // 'chat' | 'roadmap'
  const [goalFormOpen, setGoalFormOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  // ── Goals & Roadmap state & hooks ──
  const {
    goals,
    isLoading: goalsLoading,
    createGoal,
    isCreating: isCreatingGoal,
    deleteGoal,
    isDeleting: isDeletingGoal,
  } = useGoals();

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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* ── TOP HEADER & VIEW TOGGLE ── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-slate-100">
            Study Session
          </h1>
          <p className="mt-0.5 text-xs text-surface-500 dark:text-slate-400">
            Learn through AI Socratic tutoring or plan academic milestones with week-by-week roadmaps.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1 rounded-xl bg-surface-100 p-1 dark:bg-slate-800 self-start sm:self-auto border border-surface-200 dark:border-slate-700/60 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "chat"
                ? "bg-white text-surface-900 shadow-sm dark:bg-slate-900 dark:text-white"
                : "text-surface-600 hover:text-surface-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Bot size={15} className={activeTab === "chat" ? "text-primary-600 dark:text-primary-400" : ""} />
            <span>AI Study Tutor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("roadmap")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "roadmap"
                ? "bg-white text-surface-900 shadow-sm dark:bg-slate-900 dark:text-white"
                : "text-surface-600 hover:text-surface-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Sparkles size={15} className={activeTab === "roadmap" ? "text-primary-600 dark:text-primary-400" : ""} />
            <span>Goals & Roadmaps</span>
            {goals.length > 0 && (
              <span className="rounded-full bg-primary-100 px-1.5 py-0.2 text-[10px] font-bold text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
                {goals.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── VIEW 1: AI STUDY TUTOR (CHATBOT) ── */}
      {activeTab === "chat" && (
        <div className="flex h-[720px] overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Sidebar: Session History */}
          <div
            className={`border-r border-surface-200 transition-all duration-300 ease-in-out dark:border-slate-800 flex flex-col ${
              showHistory
                ? "w-64 shrink-0 opacity-100"
                : "w-0 overflow-hidden border-r-0 opacity-0 pointer-events-none"
            }`}
          >
            <SessionList
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelect={selectSession}
              onNew={() => selectSession(null)}
              isLoading={sessionsLoading}
              onToggleHistory={() => setShowHistory(false)}
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
                showHistory={showHistory}
                onToggleHistory={() => setShowHistory((prev) => !prev)}
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
      )}

      {/* ── VIEW 2: GOALS & AI ROADMAPS ── */}
      {activeTab === "roadmap" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-surface-800 dark:text-slate-100">
                Academic & Career Goals
              </h2>
              <p className="text-xs text-surface-400 dark:text-slate-500">
                AI generates a structured week-by-week roadmap for each goal you set.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setGoalFormOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              <Plus size={14} />
              Set New Goal
            </button>
          </div>

          {goalsLoading && (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-2xl bg-surface-100 dark:bg-slate-800"
                />
              ))}
            </div>
          )}

          {!goalsLoading && goals.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-surface-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-500/10">
                <Sparkles size={24} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-surface-800 dark:text-slate-200">
                  No active goals yet
                </h3>
                <p className="mt-1 text-xs text-surface-400 dark:text-slate-500 max-w-sm">
                  Set an academic or career goal to receive a customized week-by-week roadmap powered by AI.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGoalFormOpen(true)}
                className="mt-2 flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700"
              >
                <Plus size={14} />
                Create First Goal
              </button>
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
      )}

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
