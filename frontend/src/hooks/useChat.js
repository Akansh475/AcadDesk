import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSession,
  getSessions,
  getSession,
  sendMessage,
  deleteSession,
} from "../api/chatApi";

export function useChat() {
  const USER_ID = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.id ?? "u1";
    } catch {
      return "u1";
    }
  })();

  const USER_NAME = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.name ?? "Student";
    } catch {
      return "Student";
    }
  })();

  const queryClient = useQueryClient();
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [optimisticMessages, setOptimisticMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  // Fetch all sessions
  const sessionsQuery = useQuery({
    queryKey: ["chat-sessions", USER_ID],
    queryFn: () => getSessions(USER_ID),
  });

  // Fetch active session with messages
  const sessionQuery = useQuery({
    queryKey: ["chat-session", activeSessionId],
    queryFn: () => getSession(activeSessionId),
    enabled: Boolean(activeSessionId),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => createSession({ ...payload, user_id: USER_ID }),
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ["chat-sessions", USER_ID] });
      setActiveSessionId(newSession.id);
      setOptimisticMessages([]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-sessions", USER_ID] });
      if (activeSessionId) {
        setActiveSessionId(null);
        setOptimisticMessages([]);
      }
    },
  });

  const handleSendMessage = async (content, attendancePercentage = 100) => {
    if (!activeSessionId || !content.trim()) return;

    // Optimistic update — show user message immediately
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: "USER",
      content: content.trim(),
      created_at: new Date().toISOString(),
      isOptimistic: true,
    };

    setOptimisticMessages((prev) => [...prev, tempUserMsg]);
    setIsSending(true);

    try {
      const aiMessage = await sendMessage(activeSessionId, {
        content: content.trim(),
        student_name: USER_NAME,
        attendance_percentage: attendancePercentage,
      });

      // Refetch session to get all messages including AI response
      queryClient.invalidateQueries({ queryKey: ["chat-session", activeSessionId] });
      setOptimisticMessages([]);
    } catch (err) {
      // Remove optimistic message on failure
      setOptimisticMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setIsSending(false);
    }
  };

  const messages = [
    ...(sessionQuery.data?.messages ?? []),
    ...optimisticMessages,
  ];

  return {
    sessions: sessionsQuery.data ?? [],
    sessionsLoading: sessionsQuery.isLoading,

    activeSessionId,
    activeSession: sessionQuery.data ?? null,
    messages,
    sessionLoading: sessionQuery.isLoading,

    isSending,

    startSession: createMutation.mutateAsync,
    isStarting: createMutation.isPending,

    selectSession: (id) => {
      setActiveSessionId(id);
      setOptimisticMessages([]);
    },

    deleteSession: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    sendMessage: handleSendMessage,
  };
}