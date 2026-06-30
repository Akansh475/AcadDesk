import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/shared/Layout";
import TimetableGoals from "./pages/TimetableGoals";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/timetable" replace />} />
        <Route path="/timetable" element={<TimetableGoals />} />
        {/* other routes (dashboard, attendance, etc.) get added here as those pages are built */}
      </Route>
    </Routes>
  );
}

export default App;