"use client";

import { useEffect, useState } from "react";

export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md border border-line text-fg transition-colors hover:border-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${className ?? ""}`}
    >
      {isDark === null ? null : isDark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
          <circle cx="12" cy="12" r="4.5" />
          <path strokeLinecap="round" d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4l1.4-1.4M18 6l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 1020.354 15.354z" />
        </svg>
      )}
    </button>
  );
}
