export default function Textarea({ className = "", rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      className={`w-full resize-none rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary-500 dark:border-slate-700 dark:text-slate-100 ${className}`}
      {...props}
    />
  );
}