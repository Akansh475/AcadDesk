import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Send,
  Mail,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  ShieldAlert,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileText,
  User,
  Info,
} from "lucide-react";
import {
  sendMessageToStudent,
  fetchStudentMessages,
  markMessageAsRead,
  deleteStudentMessage,
} from "../../api/messagesApi";

const MESSAGE_TEMPLATES = [
  {
    label: "⚠️ Attendance Alert",
    category: "Attendance Alert",
    priority: "HIGH",
    subject: "Attendance below 75% threshold warning",
    message:
      "Dear student, your attendance in one or more registered courses has fallen below the mandatory 75% requirement. Please meet your course coordinator immediately to rectify this.",
  },
  {
    label: "📄 Document Verification",
    category: "Academic Advisory",
    priority: "MEDIUM",
    subject: "Pending semester registration documents",
    message:
      "Please report to the Registrar office (Admin Block, Room 104) with your original qualification certificates to complete the verification process.",
  },
  {
    label: "💳 Fee Reminder",
    category: "Fees & Finance",
    priority: "HIGH",
    subject: "Semester fee installment due",
    message:
      "This is a formal reminder that the upcoming term fee installment is due this week. Kindly clear your dues via the university portal to prevent exam hall-ticket holds.",
  },
  {
    label: "🌟 Academic Commendation",
    category: "Performance / CGPA",
    priority: "LOW",
    subject: "Commendation for outstanding academic performance",
    message:
      "Congratulations on achieving outstanding semester grades! The department commends your dedication and consistency towards your academic goals.",
  },
];

export default function StudentAdminMessages({ studentId, studentName = "Student", isAdmin = false }) {
  const queryClient = useQueryClient();
  const queryKey = ["studentMessages", studentId];

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchStudentMessages(studentId),
    enabled: Boolean(studentId),
  });

  const messages = data?.messages || [];
  const unreadCount = data?.unreadCount || 0;

  // Composer State (for Admin)
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("Academic Advisory");
  const [priority, setPriority] = useState("MEDIUM");
  const [formError, setFormError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  // Mutation to send message
  const sendMutation = useMutation({
    mutationFn: (payload) => sendMessageToStudent(studentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setSubject("");
      setMessage("");
      setFormError("");
      setSuccessNotice(`Message sent successfully to ${studentName}!`);
      setTimeout(() => setSuccessNotice(""), 4000);
    },
    onError: (err) => {
      setFormError(err.response?.data?.error || "Failed to send message. Please try again.");
    },
  });

  // Mutation to mark as read
  const readMutation = useMutation({
    mutationFn: (msgId) => markMessageAsRead(msgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Mutation to delete message
  const deleteMutation = useMutation({
    mutationFn: (msgId) => deleteStudentMessage(msgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      setFormError("Please provide a message subject.");
      return;
    }
    if (!message.trim()) {
      setFormError("Please provide message body content.");
      return;
    }
    setFormError("");
    sendMutation.mutate({
      subject: subject.trim(),
      message: message.trim(),
      category,
      priority,
    });
  };

  const handleApplyTemplate = (tmpl) => {
    setSubject(tmpl.subject);
    setMessage(tmpl.message);
    setCategory(tmpl.category);
    setPriority(tmpl.priority);
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case "HIGH":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-semibold text-red-700 dark:bg-red-950/70 dark:text-red-300 border border-red-200 dark:border-red-900/50">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
            High Priority
          </span>
        );
      case "LOW":
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            Normal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
            Medium Priority
          </span>
        );
    }
  };

  const getCategoryColor = (cat) => {
    const c = (cat || "").toLowerCase();
    if (c.includes("attendance")) return "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800";
    if (c.includes("fee") || c.includes("finance")) return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    if (c.includes("exam")) return "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    if (c.includes("performance") || c.includes("cgpa")) return "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
  };

  return (
    <div className="space-y-6">
      {/* 1. Admin Composer Section (Only visible if isAdmin) */}
      {isAdmin && (
        <div className="rounded-2xl border border-primary-200/80 bg-gradient-to-b from-white to-primary-50/20 p-5 shadow-xs dark:border-primary-900/40 dark:from-slate-900 dark:to-primary-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-xs">
                <Send size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Message {studentName} in Profile
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Send official advisory notices, alerts, or directives directly to this student's profile.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/60">
              <ShieldAlert size={13} />
              Official Admin Notice
            </span>
          </div>

          {/* Preset Quick Templates */}
          <div className="mt-3">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles size={12} className="text-primary-600" />
              Quick Advisory Templates:
            </label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {MESSAGE_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-primary-700 dark:hover:bg-primary-950/40 transition-colors"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="mt-4 space-y-3">
            {formError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
                <AlertCircle size={15} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {successNotice && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-300 animate-fadeIn">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                <span>{successNotice}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-primary-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  <option value="Academic Advisory">Academic Advisory</option>
                  <option value="Attendance Alert">Attendance Alert</option>
                  <option value="Fees & Finance">Fees & Finance</option>
                  <option value="Examination Notice">Examination Notice</option>
                  <option value="Performance / CGPA">Performance / CGPA</option>
                  <option value="Disciplinary / Conduct">Disciplinary / Conduct</option>
                  <option value="General Directive">General Directive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-primary-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                >
                  <option value="MEDIUM">Medium (Standard Advisory)</option>
                  <option value="HIGH">High (Urgent / Immediate Action)</option>
                  <option value="LOW">Low (Informational / FYI)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject Line <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Document Verification Needed / Attendance Notice..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Message Content <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your official message, explanation, or instructions for this student..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <Info size={13} />
                Student will receive an instant notification in their portal.
              </span>
              <button
                type="submit"
                disabled={sendMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {sendMutation.isPending ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Delivering...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send Notice to Student</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Messages List / Inbox Container */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
              <MessageSquare size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Official Administration Messages
                {unreadCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-2xs">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct communications, academic warnings, and official directives from College Admin.
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            {messages.length} total
          </span>
        </div>

        {/* Message Items */}
        <div className="mt-4 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-700 mb-2" />
                  <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700 mb-1" />
                  <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400">
              <p>Failed to load administration messages.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-2 font-semibold underline"
              >
                Retry
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 mb-2">
                <Mail size={22} />
              </div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No Official Messages Yet
              </h4>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                {isAdmin
                  ? "You haven't sent any direct messages to this student. Use the composer above to deliver notices."
                  : "All clear! You currently have no outstanding notices or warnings from the administration."}
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isExpanded = expandedMessageId === msg.id;
              return (
                <div
                  key={msg.id}
                  className={`rounded-xl border transition-all ${
                    !msg.is_read
                      ? "border-primary-300 bg-primary-50/20 shadow-xs dark:border-primary-800/80 dark:bg-primary-950/15"
                      : "border-slate-200/90 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/80"
                  }`}
                >
                  <div
                    onClick={() => setExpandedMessageId(isExpanded ? null : msg.id)}
                    className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getPriorityBadge(msg.priority)}
                        <span
                          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getCategoryColor(
                            msg.category
                          )}`}
                        >
                          {msg.category || "General"}
                        </span>
                        {!msg.is_read && (
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            UNREAD
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        {msg.subject}
                      </h4>

                      <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {msg.sender_name || msg.sender?.name || "College Administration"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatTimestamp(msg.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {/* Mark as Read Button */}
                      {!msg.is_read && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            readMutation.mutate(msg.id);
                          }}
                          disabled={readMutation.isPending}
                          className="flex items-center gap-1 rounded-lg border border-primary-200 bg-white px-2.5 py-1 text-xs font-semibold text-primary-600 hover:bg-primary-50 dark:border-primary-800 dark:bg-slate-800 dark:text-primary-300 dark:hover:bg-primary-950/40 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 size={13} />
                          <span>Mark as Read</span>
                        </button>
                      )}

                      {/* Admin Delete Button */}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Delete this administration message?")) {
                              deleteMutation.mutate(msg.id);
                            }
                          }}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}

                      <div className="text-slate-400 p-1">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {/* Body Content - Expandable */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300 whitespace-pre-wrap">
                      <div className="font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5 text-xs">
                        <FileText size={13} />
                        Official Directive / Note:
                      </div>
                      {msg.message}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
