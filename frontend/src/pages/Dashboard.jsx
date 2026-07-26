import { useDashboard } from "../hooks/useDashboard";
import WelcomeBar from "../components/dashboard/WelcomeBar";
import TodayTimetable from "../components/dashboard/TodayTimetable";
import AttendanceSummaryWidget from "../components/dashboard/AttendanceSummaryWidget";
import UpcomingDeadlines from "../components/dashboard/UpcomingDeadlines";
import NotificationsWidget from "../components/dashboard/NotificationsWidget";
import Drawer from "../components/shared/Drawer";
import AttendanceDetail from "../components/dashboard/drawers/AttendanceDetail";
import AssignmentDetail from "../components/dashboard/drawers/AssignmentDetail";
import ExamDetail from "../components/dashboard/drawers/ExamDetail";
import NotificationDetail from "../components/dashboard/drawers/NotificationDetail";

function getDrawerMeta(drawerType, drawerData) {
  switch (drawerType) {
    case "attendance":
      return { title: "Attendance Overview", subtitle: `Overall: ${drawerData?.overall_percentage}%` };
    case "assignment":
      return { title: drawerData?.title ?? "Assignment", subtitle: drawerData?.subject };
    case "exam":
      return { title: "Exam Details", subtitle: drawerData?.subject };
    case "notification":
      return { title: "Notification", subtitle: null };
    default:
      return { title: "", subtitle: null };
  }
}

export default function Dashboard() {
  const {
    user,
    timetable, timetableLoading,
    attendance, attendanceLoading,
    assignments, assignmentsLoading,
    exams, examsLoading,
    notifications, unreadCount,
    drawerOpen, drawerType, drawerData,
    openDrawer, closeDrawer,
  } = useDashboard();

  const { title, subtitle } = getDrawerMeta(drawerType, drawerData);

  // For attendance drawer we pass the full attendance object
  const handleAttendanceClick = (subject) => {
    openDrawer("attendance", attendance);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">

      {/* Welcome bar — full width */}
      <div className="mb-6">
        <WelcomeBar user={user} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Left column — 2/3 width */}
        <div className="space-y-5 lg:col-span-2">
          <TodayTimetable
            timetable={timetable}
            isLoading={timetableLoading}
          />
          <UpcomingDeadlines
            assignments={assignments}
            exams={exams}
            isLoadingAssignments={assignmentsLoading}
            isLoadingExams={examsLoading}
            onItemClick={openDrawer}
          />
        </div>

        {/* Right column — 1/3 width */}
        <div className="space-y-5">
          <AttendanceSummaryWidget
            attendance={attendance}
            isLoading={attendanceLoading}
            onSubjectClick={handleAttendanceClick}
          />
          <NotificationsWidget
            notifications={notifications}
            unreadCount={unreadCount}
            onItemClick={openDrawer}
          />
        </div>
      </div>

      {/* Shared drawer */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={title}
        subtitle={subtitle}
      >
        {drawerType === "attendance" && (
          <AttendanceDetail data={drawerData} />
        )}
        {drawerType === "assignment" && (
          <AssignmentDetail data={drawerData} />
        )}
        {drawerType === "exam" && (
          <ExamDetail data={drawerData} />
        )}
        {drawerType === "notification" && (
          <NotificationDetail data={drawerData} />
        )}
      </Drawer>
    </div>
  );
}