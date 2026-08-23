import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  generateExamQuestions,
  fetchQuestionHistory,
  saveQuestionSet,
  deleteQuestionSet,
} from "../api/questionsApi";

const STORAGE_KEY = "acaddesk_saved_questions";

export function useQuestions() {
  const queryClient = useQueryClient();

  const USER_ID = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.id ?? "u1";
    } catch {
      return "u1";
    }
  })();

  const [currentSet, setCurrentSet] = useState(null);
  const [viewMode, setViewMode] = useState("interactive"); // "interactive" | "exam_sheet"
  const [copiedState, setCopiedState] = useState(false);
  const [localHistory, setLocalHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync with local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localHistory));
    } catch (e) {
      console.warn("Could not sync questions to localStorage", e);
    }
  }, [localHistory]);

  // Fetch backend history if available
  const historyQuery = useQuery({
    queryKey: ["question-history", USER_ID],
    queryFn: () => fetchQuestionHistory(USER_ID),
    retry: 1,
  });

  // Generate mutation
  const generateMutation = useMutation({
    mutationFn: (payload) =>
      generateExamQuestions({
        ...payload,
        user_id: USER_ID,
      }),
    onSuccess: (data) => {
      setCurrentSet(data);
      // Prepend to local history
      setLocalHistory((prev) => {
        const filtered = prev.filter((item) => item.id !== data.id);
        return [data, ...filtered].slice(0, 30);
      });
      queryClient.invalidateQueries({ queryKey: ["question-history", USER_ID] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteQuestionSet(id, USER_ID),
    onSuccess: (_, deletedId) => {
      setLocalHistory((prev) => prev.filter((item) => item.id !== deletedId));
      if (currentSet?.id === deletedId) {
        setCurrentSet(null);
      }
      queryClient.invalidateQueries({ queryKey: ["question-history", USER_ID] });
    },
  });

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2500);
  };

  const handleCopyPaper = (includeAnswers = false) => {
    if (!currentSet || !currentSet.questions) return;

    let text = `========================================================\n`;
    text += `${currentSet.subject.toUpperCase()} - THEORETICAL EXAMINATION PAPER\n`;
    text += `Total Questions: ${currentSet.total_questions} | Maximum Marks: ${currentSet.total_marks} Marks\n`;
    text += `========================================================\n\n`;

    currentSet.questions.forEach((q, i) => {
      text += `Q${i + 1}. [${q.marks} Marks] (${q.type})\n`;
      text += `${q.question}\n`;
      text += `Topic: ${q.topic} | Bloom Level: ${q.bloom_level} | Time: ${q.estimated_time}\n`;

      if (includeAnswers) {
        text += `\n--- Model Answer & Key Points ---\n${q.model_answer}\n`;
        if (q.marking_scheme && q.marking_scheme.length > 0) {
          text += `\nMarking Scheme:\n` + q.marking_scheme.map((m) => `  * ${m}`).join("\n") + `\n`;
        }
        if (q.exam_tip) {
          text += `Exam Pro-Tip: ${q.exam_tip}\n`;
        }
      }
      text += `\n--------------------------------------------------------\n\n`;
    });

    handleCopy(text);
  };

  const handleDownloadMarkdown = () => {
    if (!currentSet) return;
    let md = `# ${currentSet.subject} - Exam Questions & Model Answers\n\n`;
    md += `**Total Questions:** ${currentSet.total_questions} | **Total Marks:** ${currentSet.total_marks} Marks | **Generated:** ${new Date().toLocaleDateString()}\n\n`;
    md += `> **Overview:** ${currentSet.overview}\n\n`;
    md += `---\n\n`;

    currentSet.questions.forEach((q, i) => {
      md += `### Question ${i + 1} (${q.marks} Marks)\n\n`;
      md += `**${q.question}**\n\n`;
      md += `* **Type:** ${q.type} | **Topic:** ${q.topic} | **Cognitive Level:** ${q.bloom_level} | **Est. Time:** ${q.estimated_time}\n\n`;
      md += `#### Model Answer:\n${q.model_answer}\n\n`;
      if (q.marking_scheme?.length > 0) {
        md += `#### Marking Scheme:\n`;
        q.marking_scheme.forEach((item) => {
          md += `- ${item}\n`;
        });
        md += `\n`;
      }
      if (q.exam_tip) {
        md += `💡 **Exam Pro-Tip:** ${q.exam_tip}\n\n`;
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentSet.subject.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_exam_questions.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Combine backend and local history with deduping
  const mergedHistory = (() => {
    const combined = [...(historyQuery.data || []), ...localHistory];
    const seen = new Set();
    return combined.filter((item) => {
      if (!item?.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  })();

  return {
    currentSet,
    setCurrentSet,
    generateQuestions: generateMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
    generationError: generateMutation.error?.response?.data?.error || generateMutation.error?.message,

    history: mergedHistory,
    historyLoading: historyQuery.isLoading,
    deleteSet: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    viewMode,
    setViewMode,
    copied: copiedState,
    copyText: handleCopy,
    copyPaper: handleCopyPaper,
    downloadMarkdown: handleDownloadMarkdown,
  };
}
