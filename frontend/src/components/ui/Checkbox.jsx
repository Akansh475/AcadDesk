import { Check } from "lucide-react";

export default function Checkbox({ checked, onChange, className = "", ...props }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
        checked
          ? "border-primary-600 bg-primary-600 text-white"
          : "border-slate-300 dark:border-slate-600"
      } ${className}`}
      {...props}
    >
      {checked && <Check size={13} strokeWidth={3} />}
    </button>
  );
}