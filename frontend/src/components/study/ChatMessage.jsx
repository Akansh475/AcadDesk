import dayjs from "dayjs";
import { Bot, User } from "lucide-react";

function formatContent(content) {
  // Basic formatting — bold (**text**), line breaks
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

export default function ChatMessage({ message }) {
  const isUser = message.role === "USER";
  const isOptimistic = message.isOptimistic;

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
        isUser
          ? "bg-primary-600 text-white"
          : "bg-surface-100 text-surface-600 dark:bg-slate-800 dark:text-slate-300"
      }`}>
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-primary-600 text-white"
            : "rounded-tl-sm border border-surface-200 bg-white text-surface-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        } ${isOptimistic ? "opacity-70" : ""}`}
          dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
        />
        <span className="text-[10px] text-surface-400 dark:text-slate-500">
          {isOptimistic ? "Sending..." : dayjs(message.created_at).format("h:mm A")}
        </span>
      </div>
    </div>
  );
}