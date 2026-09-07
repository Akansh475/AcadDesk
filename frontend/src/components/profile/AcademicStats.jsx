import { Award, GraduationCap, Calendar, Building2, TrendingUp, CheckCircle2 } from "lucide-react";

export default function AcademicStats({ user }) {
  const cgpaNumber = parseFloat(user?.cgpa);
  const hasCgpa = !isNaN(cgpaNumber);

  // Determine academic standing tier based on CGPA
  let standing = "Good Standing";
  let badgeColor = "text-primary-700 bg-primary-50 dark:bg-primary-950/60 dark:text-primary-300 border-primary-200 dark:border-primary-800";
  if (hasCgpa) {
    if (cgpaNumber >= 9.0) {
      standing = "Dean's Honor List";
      badgeColor = "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    } else if (cgpaNumber >= 8.0) {
      standing = "First Class with Distinction";
      badgeColor = "text-primary-700 bg-primary-50 dark:bg-primary-950/60 dark:text-primary-300 border-primary-200 dark:border-primary-800";
    } else if (cgpaNumber >= 6.5) {
      standing = "First Class Standing";
      badgeColor = "text-sky-700 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800";
    } else {
      standing = "Satisfactory Progress";
      badgeColor = "text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    }
  }

  const cgpaPercent = hasCgpa ? Math.min(Math.max((cgpaNumber / 10) * 100, 0), 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* 1. CGPA Metric Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary-200 dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Cumulative GPA
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/80 dark:text-primary-400">
            <Award size={17} />
          </div>
        </div>

        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {user?.cgpa || "—"}
          </span>
          {hasCgpa && (
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              / 10.0
            </span>
          )}
        </div>

        {/* Visual Progress Meter */}
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${cgpaPercent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold border ${badgeColor}`}>
              <CheckCircle2 size={11} />
              {standing}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Degree & Program */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary-200 dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Program
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/80 dark:text-sky-400">
            <GraduationCap size={17} />
          </div>
        </div>

        <div className="mt-2.5">
          <p className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate">
            {user?.course || "Undergraduate"}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
            {user?.branch || "General Studies"}
          </p>
        </div>

        <div className="mt-3">
          <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
            Regular Full-Time
          </span>
        </div>
      </div>

      {/* 3. Academic Cohort */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary-200 dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Academic Cohort
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400">
            <Calendar size={17} />
          </div>
        </div>

        <div className="mt-2.5">
          <p className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate">
            {user?.year || "Year 1"}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Section {user?.section || "—"}
          </p>
        </div>

        <div className="mt-3">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[11px] font-semibold border border-emerald-200/80 dark:border-emerald-800/80">
            <TrendingUp size={11} />
            Semester Active
          </span>
        </div>
      </div>

      {/* 4. Campus Registry */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary-200 dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Campus Registry
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
            <Building2 size={17} />
          </div>
        </div>

        <div className="mt-2.5">
          <p className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate">
            {user?.college_id || "MAIN-CAMPUS"}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
            Affiliated Institute
          </p>
        </div>

        <div className="mt-3">
          <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
            Role: {user?.role || "STUDENT"}
          </span>
        </div>
      </div>
    </div>
  );
}
