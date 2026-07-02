import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";

function InfoRow({ label, value, readOnly = true, fullWidth = false }) {
  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? "col-span-2" : ""}`}>
      <span className="text-xs font-medium uppercase tracking-wide text-surface-400">{label}</span>
      <span className="text-sm font-medium text-surface-800">{value || "—"}</span>
    </div>
  );
}

export default function ProfileInfoCard({ user, onSavePhone, isSaving }) {
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleEditClick = () => {
    setPhone(user?.phone ?? "");
    setPhoneError("");
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setPhoneError("");
  };

  const handleSave = async () => {
    setPhoneError("");
    const err = await onSavePhone(phone);
    if (err) {
      setPhoneError(err);
      return;
    }
    setEditing(false);
  };

  return (
    <div className="w-full space-y-4">

      {/* Academic Identity Card */}
      <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1 w-4 rounded-full bg-primary-500" />
            <h3 className="text-sm font-semibold text-surface-700">Academic Identity</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <InfoRow label="Student ID" value={user?.student_id} />
          <InfoRow label="University Roll No" value={user?.university_roll_no} />
          <InfoRow label="Course" value={user?.course} />
          <InfoRow label="Branch" value={user?.branch} />
          <InfoRow label="Year" value={user?.year} />
          <InfoRow label="Section" value={user?.section} />
        </div>
      </div>

      {/* Academic Performance Card */}
      <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <div className="h-1 w-4 rounded-full bg-primary-500" />
          <h3 className="text-sm font-semibold text-surface-700">Academic Performance</h3>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-surface-400">Current CGPA</span>
            <div className="flex items-end gap-1.5">
              <span className="text-2xl font-bold text-primary-600">{user?.cgpa}</span>
              <span className="mb-0.5 text-xs text-surface-400">/ 10.0</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-surface-400">Current Section</span>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
                {user?.section || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Card */}
      <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1 w-4 rounded-full bg-primary-500" />
            <h3 className="text-sm font-semibold text-surface-700">Contact Information</h3>
          </div>
          {!editing && (
            <button
              type="button"
              onClick={handleEditClick}
              className="flex items-center gap-1.5 rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-medium text-surface-600 transition-colors hover:bg-surface-100"
            >
              <Pencil size={12} />
              Edit Phone
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <InfoRow label="Email" value={user?.email} />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-surface-400">Phone</span>
            {editing ? (
              <div className="flex flex-col gap-1.5">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  autoFocus
                  placeholder="10 digit number"
                  className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-1.5 text-sm text-surface-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
                {phoneError && (
                  <p className="text-xs text-red-600">{phoneError}</p>
                )}
              </div>
            ) : (
              <span className="text-sm font-medium text-surface-800">
                {user?.phone || "—"}
              </span>
            )}
          </div>
        </div>

        {editing && (
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
            >
              <Check size={14} />
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}