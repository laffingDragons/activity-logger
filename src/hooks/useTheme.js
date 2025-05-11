import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "default");
  const [fontSize, setFontSize] = useState(localStorage.getItem("fontSize") || "16px");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  return { theme, setTheme, fontSize, setFontSize };
}