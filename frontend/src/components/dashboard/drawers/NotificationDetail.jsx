import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const TYPE_ICONS = {
  exam: "📝", holiday: "🎉", event: "🚀",
  announcement: "📢", attendance: "⚠️",
  EXAM: "📝", HOLIDAY: "🎉", EVENT: "🚀",
  ANNOUNCEMENT: "📢", ATTENDANCE: "⚠️",
};

const SOURCE_LABELS = {
  erp: "College ERP", system: "AcadDesk System",
  ERP: "College ERP", SYSTEM: "AcadDesk System",
};

export default function NotificationDetail({ data }) {
  if (!data) return null;

  const { title, message, type, source, created_at, is_read } = data;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{TYPE_ICONS[type] ?? "🔔"}</span>
          <div>
            <h3 className="text-sm font-semibold text-surface-800">{title}</h3>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <span className="rounded-full bg-surface-200 px-2 py-0.5 text-[10px] font-medium text-surface-600">
                {SOURCE_LABELS[source] ?? source}
              </span>
              {!is_read && (
                <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-700">
                  Unread
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-surface-500">Message</p>
        <p className="text-sm leading-relaxed text-surface-700">{message}</p>
      </div>

      <p className="text-xs text-surface-400">
        {dayjs(created_at).format("D MMMM YYYY, h:mm A")} · {dayjs(created_at).fromNow()}
      </p>
    </div>
  );
}