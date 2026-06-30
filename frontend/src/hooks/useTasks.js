import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api/tasksApi";
import { sortTasks } from "../utils/taskHelpers";

export const TASK_LIMIT = 10;

export function useTasks(userId) {
  const queryClient = useQueryClient();
  const queryKey = ["tasks", userId];

  const tasksQuery = useQuery({
    queryKey,
    queryFn: () => fetchTasks(userId),
    enabled: Boolean(userId),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const addTaskMutation = useMutation({
    mutationFn: (payload) => createTask({ ...payload, user_id: userId }),
    onSuccess: invalidate,
  });

  const editTaskMutation = useMutation({
    mutationFn: ({ id, payload }) => updateTask(id, payload),
    onSuccess: invalidate,
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: ({ id, status }) => updateTask(id, { status }),
    onSuccess: invalidate,
  });

  const removeTaskMutation = useMutation({
    mutationFn: (id) => deleteTask(id),
    onSuccess: invalidate,
  });

  const tasks = tasksQuery.data ?? [];
  const sortedTasks = sortTasks(tasks);
  const isAtLimit = tasks.length >= TASK_LIMIT;

  return {
    tasks: sortedTasks,
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    isAtLimit,

    addTask: addTaskMutation.mutateAsync,
    isAdding: addTaskMutation.isPending,

    editTask: editTaskMutation.mutateAsync,
    isEditing: editTaskMutation.isPending,

    toggleComplete: (id, currentStatus) =>
      toggleCompleteMutation.mutateAsync({
        id,
        status: currentStatus === "Completed" ? "Pending" : "Completed",
      }),

    removeTask: removeTaskMutation.mutateAsync,
    isRemoving: removeTaskMutation.isPending,
  };
}