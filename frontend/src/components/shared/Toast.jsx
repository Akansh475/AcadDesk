import { CheckCircle, XCircle } from "lucide-react";

export default function Toast({ message, type = "success" }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg transition-all ${
        isSuccess
          ? "border-primary-200 bg-primary-50 text-primary-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
      style={{ animation: "slideUp 0.3s ease-out both" }}
    >
      {isSuccess ? <CheckCircle size={16} /> : <XCircle size={16} />}
      {message}
    </div>
  );
}