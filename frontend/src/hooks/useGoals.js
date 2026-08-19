import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGoals, createGoal, deleteGoal } from "../api/goalsApi";

export function useGoals() {
  const USER_ID = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.id ?? "u1";
    } catch {
      return "u1";
    }
  })();

  const queryClient = useQueryClient();
  const queryKey = ["goals", USER_ID];

  const goalsQuery = useQuery({
    queryKey,
    queryFn: () => fetchGoals(USER_ID),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => createGoal({ ...payload, user_id: USER_ID }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteGoal(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    goals: goalsQuery.data ?? [],
    isLoading: goalsQuery.isLoading,
    isError: goalsQuery.isError,

    createGoal: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    deleteGoal: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}