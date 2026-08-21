import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useAcademicCalendar } from "../hooks/useAcademicCalendar";
import GoalsColumn from "../components/timetable/GoalsColumn";
import CalendarColumn from "../components/timetable/CalendarColumn";
import TaskModal from "../components/timetable/TaskModal";
import TaskLimitAlert from "../components/timetable/TaskLimitAlert";

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

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [limitAlertOpen, setLimitAlertOpen] = useState(false);

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-10 lg:flex-row">
        {/* LEFT COLUMN */}
        <div className="lg:w-[40%]">
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
    </div>
  );
}