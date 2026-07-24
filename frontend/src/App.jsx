import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/shared/Layout";
import { ProtectedRoute, PublicRoute } from "./components/shared/RouteGuards";
import LoginPage from "./pages/LoginPage";
import TimetableGoals from "./pages/TimetableGoals";
import ProfilePage from "./pages/ProfilePage";
import AttendancePage from "./pages/AttendancePage";
import NotificationsPage from "./pages/NotificationsPage";


<Route path="/notifications" element={<NotificationsPage />} />

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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;