import { ShieldCheck, ShieldAlert } from "lucide-react";
import { classesNeeded } from "../../../utils/attendanceFormulas";

export default function AttendanceDetail({ data }) {
  if (!data) return null;

  const { subjects } = data;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-surface-200">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-surface-200 bg-surface-50">
              <th className="px-3 py-2.5 text-left font-medium text-surface-500">Subject</th>
              <th className="px-3 py-2.5 text-center font-medium text-surface-500">Held</th>
              <th className="px-3 py-2.5 text-center font-medium text-surface-500">Done</th>
              <th className="px-3 py-2.5 text-center font-medium text-surface-500">%</th>
              <th className="px-3 py-2.5 text-center font-medium text-surface-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {subjects.map((s) => {
              const isSafe = s.percentage >= 70;
              return (
                <tr key={s.subject_id} className="bg-white">
                  <td className="px-3 py-2.5 text-surface-700">{s.subject_name}</td>
                  <td className="px-3 py-2.5 text-center text-surface-600">{s.classes_held}</td>
                  <td className="px-3 py-2.5 text-center text-surface-600">{s.classes_attended}</td>
                  <td className={`px-3 py-2.5 text-center font-semibold ${isSafe ? "text-primary-600" : "text-red-600"}`}>
                    {s.percentage}%
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {isSafe
                      ? <ShieldCheck size={14} className="mx-auto text-primary-500" />
                      : <ShieldAlert size={14} className="mx-auto text-red-500" />
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* At risk subjects */}
      {subjects.filter((s) => s.percentage < 70).map((s) => {
        const needed = classesNeeded(s.classes_attended, s.classes_held);
        return (
          <div key={s.subject_id} className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-xs font-semibold text-red-700">{s.subject_name}</p>
            <p className="mt-0.5 text-xs text-red-600">
              Attend next {needed} consecutive {needed === 1 ? "class" : "classes"} to reach 70%
            </p>
          </div>
        );
      })}
    </div>
  );
}