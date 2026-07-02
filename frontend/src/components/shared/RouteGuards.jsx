import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  if (token && user) {
    const redirect = user.role === "admin" ? "/admin" : "/timetable";
    return <Navigate to={redirect} replace />;
  }

  return children;
}