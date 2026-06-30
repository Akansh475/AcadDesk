export default function Header({ title }) {
  return (
    <header className="flex h-20 items-center justify-center border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-950">
      <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h1>
    </header>
  );
}