import { useEffect } from "react";
import { X } from "lucide-react";

export default function Drawer({ open, onClose, title, subtitle, children }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-surface-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-200 px-5 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-surface-800 dark:text-slate-100">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-surface-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="ml-4 rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
      </div>
    </>
  );
}