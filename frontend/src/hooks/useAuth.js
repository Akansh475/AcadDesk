import { useState } from "react";
import { useNavigate } from "react-router-dom";

async function loginApi(email, password) {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.status === 404) throw { code: "NO_ACCOUNT" };
  if (res.status === 401) throw { code: "WRONG_CREDENTIALS" };
  if (!res.ok) throw { code: "SERVER_ERROR" };

  return data;
}

const ERROR_MESSAGES = {
  NO_ACCOUNT: "No account found with this email.",
  WRONG_CREDENTIALS: "Invalid email or password.",
  SERVER_ERROR: "Something went wrong. Try again.",
  EMPTY_FIELDS: "Please fill in all fields.",
};

export function useAuth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email, password) => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError(ERROR_MESSAGES.EMPTY_FIELDS);
      return;
    }

    setIsLoading(true);
    try {
      const { token, user } = await loginApi(email, password);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/timetable");
      }
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] ?? ERROR_MESSAGES.SERVER_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const isAuthenticated = () => Boolean(localStorage.getItem("token"));

  return { login, logout, getUser, isAuthenticated, isLoading, error };
}