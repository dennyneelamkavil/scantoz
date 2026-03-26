"use client";

import { ToastContainer } from "react-toastify";
import { useTheme } from "@/context/ThemeContext";

export default function ToastProvider() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar
      pauseOnFocusLoss={false}
      pauseOnHover
      draggable
      theme={theme === "dark" ? "dark" : "light"}
    />
  );
}
