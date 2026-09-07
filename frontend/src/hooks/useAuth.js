import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";

async function loginApi(email, password) {
  try {
    const { data } = await apiClient.post("/api/auth/login", { email, password });
    return data;
  } catch (err) {
    if (err.response?.status === 404) throw { code: "NO_ACCOUNT" };
    if (err.response?.status === 401) throw { code: "WRONG_CREDENTIALS" };
    if (!err.response) throw { code: "NETWORK_ERROR" };
    const serverMsg = err.response?.data?.error;
    throw { code: "SERVER_ERROR", message: serverMsg };
  }
}

const ERROR_MESSAGES = {
  NO_ACCOUNT: "No account found with this email.",
  WRONG_CREDENTIALS: "Invalid email or password.",
  NETWORK_ERROR: "Cannot connect to the server. Please ensure the backend server is running on port 5000.",
  SERVER_ERROR: "Something went wrong. Please try again.",
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
      setError(err.message || ERROR_MESSAGES[err.code] || ERROR_MESSAGES.SERVER_ERROR);
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