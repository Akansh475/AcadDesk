import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUnreadCount } from "../../hooks/useNotifications";

export default function BellIcon() {
  const navigate = useNavigate();
  const { count, isError } = useUnreadCount();

  const showBadge = !isError && count > 0;

  return (
    <button
      type="button"
      onClick={() => navigate("/notifications")}
      aria-label={`Notifications${showBadge ? ` (${count} unread)` : ""}`}
      className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
    >
      <Bell size={16} />
      {showBadge && (
  <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
    {count > 9 ? "9+" : count}
  </span>
)}
    </button>
  );
}