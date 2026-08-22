import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/shared/Layout";
import { ProtectedRoute, PublicRoute } from "./components/shared/RouteGuards";
import LoginPage from "./pages/LoginPage";
import TimetableGoals from "./pages/TimetableGoals";
import ProfilePage from "./pages/ProfilePage";
import AttendancePage from "./pages/AttendancePage";
import NotificationsPage from "./pages/NotificationsPage";
import Dashboard from "./pages/Dashboard";
import AssignmentsExams from "./pages/AssignmentsExams";
import StudySession from "./pages/StudySession";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/timetable" replace />} />
        <Route path="/timetable" element={<TimetableGoals />} />
        <Route path="/study" element={<StudySession />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/assignments" element={<AssignmentsExams />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;