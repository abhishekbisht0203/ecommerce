// Theme toggle script
// Handles dark / light mode switching and persists preference in localStorage.

(function () {
  const STORAGE_KEY = "theme-preference";
  const DARK_CLASS = "dark";

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add(DARK_CLASS);
    } else {
      document.documentElement.classList.remove(DARK_CLASS);
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    applyTheme(theme);
  }

  // Expose a simple toggle function for inline handlers
  window.toggleTheme = function () {
    const isDark = document.documentElement.classList.contains(DARK_CLASS);
    applyTheme(isDark ? "light" : "dark");
  };

  // Initialise on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
