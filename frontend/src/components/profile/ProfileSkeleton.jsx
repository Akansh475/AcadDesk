export default function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6 animate-pulse">
      {/* Hero Banner Skeleton */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-200 dark:bg-slate-800/60 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl bg-slate-300 dark:bg-slate-700 shrink-0" />
          <div className="space-y-3 flex-1 text-center md:text-left w-full">
            <div className="h-5 w-40 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto md:mx-0" />
            <div className="h-8 w-64 rounded-xl bg-slate-300 dark:bg-slate-700 mx-auto md:mx-0" />
            <div className="h-4 w-48 rounded bg-slate-300 dark:bg-slate-700 mx-auto md:mx-0" />
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
              <div className="h-7 w-24 rounded-lg bg-slate-300 dark:bg-slate-700" />
              <div className="h-7 w-24 rounded-lg bg-slate-300 dark:bg-slate-700" />
              <div className="h-7 w-16 rounded-lg bg-slate-300 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-8 w-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-7 w-16 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="h-5 w-48 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800/80" />
          <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800/80" />
        </div>
      </div>
    </div>
  );
}
