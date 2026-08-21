import { useState, useRef, useEffect } from "react";
import { Send, Loader2, BookOpen, Trash2, PanelLeftOpen } from "lucide-react";
import ChatMessage from "./ChatMessage";

export default function ChatWindow({
  session,
  messages,
  isSending,
  onSend,
  onDelete,
  isDeleting,
  attendancePercentage,
  showHistory,
  onToggleHistory,
}) {
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isSending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    onSend(input, attendancePercentage);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-200 px-5 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          {onToggleHistory && !showHistory && (
            <button
              type="button"
              onClick={onToggleHistory}
              className="rounded-lg p-1 text-surface-400 hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              title="Show session history"
            >
              <PanelLeftOpen size={16} />
            </button>
          )}
          <BookOpen size={15} className="text-primary-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-surface-800 dark:text-slate-100">
              {session?.subject_name}
            </p>
            <p className="text-xs text-surface-400">AI Tutor · Socratic method</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(session?.id)}
          disabled={isDeleting}
          className="rounded-lg p-1.5 text-surface-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
          title="End session"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 space-y-4 overflow-y-auto px-5 py-4"
      >
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-surface-600 dark:text-slate-300">
                Session started!
              </p>
              <p className="mt-1 text-xs text-surface-400">
                Ask your first question about {session?.subject_name}.
              </p>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* AI typing indicator */}
        {isSending && (
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-100 dark:bg-slate-800">
              <Loader2 size={14} className="animate-spin text-surface-500" />
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-surface-200 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-surface-400" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-surface-400" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-surface-400" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-surface-200 px-5 py-4 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question... (Enter to send, Shift+Enter for new line)"
            rows={2}
            className="flex-1 resize-none rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="mt-1.5 text-xs text-surface-400">
          Your AI tutor guides you to think — not just gives answers.
        </p>
      </div>
    </div>
  );
}