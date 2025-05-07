import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import axios from "axios";

// Apply the stored theme before rendering
const applyStoredTheme = () => {
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme)").matches;

  // If user h chosen a theme, use it
  if (storedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (storedTheme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    // If no stored preference, use system preference
    if (prefersDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }
};

// No global axios configuration - each component will handle its own requests

// Apply theme before rendering
applyStoredTheme();

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
