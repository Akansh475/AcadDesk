export default function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary-500 dark:border-slate-700 dark:text-slate-100 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}