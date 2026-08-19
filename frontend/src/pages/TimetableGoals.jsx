import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useAcademicCalendar } from "../hooks/useAcademicCalendar";
import { useGoals } from "../hooks/useGoals";
import GoalsColumn from "../components/timetable/GoalsColumn";
import CalendarColumn from "../components/timetable/CalendarColumn";
import TaskModal from "../components/timetable/TaskModal";
import TaskLimitAlert from "../components/timetable/TaskLimitAlert";
import GoalForm from "../components/timetable/GoalForm";
import RoadmapView from "../components/timetable/RoadmapView";
import { Sparkles, Plus } from "lucide-react";

const CURRENT_USER_ID = (() => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.id ?? "u1";
  } catch {
    return "u1";
  }
})();

const CURRENT_COLLEGE_ID = "c1";

export default function TimetableGoals() {
  const {
    tasks, isLoading: tasksLoading, isError: tasksError, error: tasksErrorObj,
    isAtLimit, addTask, isAdding, editTask, isEditing, toggleComplete, removeTask,
  } = useTasks(CURRENT_USER_ID);

  const calendar = useAcademicCalendar(CURRENT_COLLEGE_ID);

  const {
    goals, isLoading: goalsLoading,
    createGoal, isCreating,
    deleteGoal, isDeleting,
  } = useGoals();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [limitAlertOpen, setLimitAlertOpen] = useState(false);
  const [goalFormOpen, setGoalFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks"); // "tasks" | "roadmap"

  const openAddModal = () => {
    if (isAtLimit) { setLimitAlertOpen(true); return; }
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => { setEditingTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTask(null); };

  const handleSave = async (formData) => {
    if (editingTask) {
      await editTask({ id: editingTask.id, payload: formData });
    } else {
      await addTask(formData);
    }
    closeModal();
  };

  const handleDelete = async (taskId) => {
    if (editingTask?.id === taskId) closeModal();
    await removeTask(taskId);
  };

  const handleGoalSubmit = async (formData) => {
    await createGoal(formData);
    setGoalFormOpen(false);
    setActiveTab("roadmap");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-10 lg:flex-row">

        {/* LEFT COLUMN */}
        <div className="lg:w-[40%]">
          {/* Tab switcher */}
          <div className="mb-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("tasks")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "tasks"
                  ? "bg-primary-600 text-white"
                  : "text-surface-500 hover:bg-surface-100"
              }`}
            >
              My Tasks
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("roadmap")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "roadmap"
                  ? "bg-primary-600 text-white"
                  : "text-surface-500 hover:bg-surface-100"
              }`}
            >
              <Sparkles size={12} />
              AI Roadmap
              {goals.length > 0 && (
                <span className="rounded-full bg-primary-100 px-1.5 py-0.5 text-[10px] font-bold text-primary-700">
                  {goals.length}
                </span>
              )}
            </button>
          </div>

          {/* Tasks tab */}
          {activeTab === "tasks" && (
            <GoalsColumn
              tasks={tasks}
              isLoading={tasksLoading}
              isError={tasksError}
              error={tasksErrorObj}
              isAtLimit={isAtLimit}
              onAddClick={openAddModal}
              onToggleComplete={(task) => toggleComplete(task.id, task.status)}
              onEdit={openEditModal}
              onDelete={handleDelete}
              isMutating={isAdding || isEditing}
            />
          )}

          {/* Roadmap tab */}
          {activeTab === "roadmap" && (
            <div>
              <button
                type="button"
                onClick={() => setGoalFormOpen(true)}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary-300 py-3 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:border-primary-500/30 dark:hover:bg-primary-500/5"
              >
                <Plus size={15} />
                Set a new goal
              </button>

              {goalsLoading && (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface-100 dark:bg-slate-800" />
                  ))}
                </div>
              )}

              {!goalsLoading && goals.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <Sparkles size={24} className="text-primary-300" />
                  <p className="text-sm font-medium text-surface-600 dark:text-slate-300">
                    No goals yet
                  </p>
                  <p className="text-xs text-surface-400">
                    Set a goal and AI will generate a week-by-week roadmap for you.
                  </p>
                </div>
              )}

              {!goalsLoading && goals.length > 0 && (
                <RoadmapView
                  goals={goals}
                  onDelete={deleteGoal}
                  isDeleting={isDeleting}
                />
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:w-[60%]">
          <CalendarColumn
            groupedEvents={calendar.groupedEvents}
            hasEvents={calendar.hasEvents}
            isLoading={calendar.isLoading}
            isError={calendar.isError}
            error={calendar.error}
          />
        </div>
      </div>

      <TaskModal
        open={modalOpen}
        task={editingTask}
        onSave={handleSave}
        onClose={closeModal}
        isSaving={isAdding || isEditing}
      />

      <TaskLimitAlert
        open={limitAlertOpen}
        onClose={() => setLimitAlertOpen(false)}
        onViewTasks={() => setLimitAlertOpen(false)}
      />

      {goalFormOpen && (
        <GoalForm
          onSubmit={handleGoalSubmit}
          isSubmitting={isCreating}
          onClose={() => setGoalFormOpen(false)}
        />
      )}
    </div>
  );
}