const TONE_CLASSES = {
  red: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  green: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  primary: "bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400",
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}