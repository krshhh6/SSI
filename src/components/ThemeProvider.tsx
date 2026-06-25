"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: (originX?: number, originY?: number) => void;
}>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = useCallback(
    (originX = window.innerWidth / 2, originY = window.innerHeight / 2) => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const next: Theme = theme === "dark" ? "light" : "dark";

      // Create overlay div for eclipse wipe
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 99999;
        pointer-events: none;
        background-color: ${next === "dark" ? "#0F1011" : "#F4F7F9"};
        clip-path: circle(0px at ${originX}px ${originY}px);
        transition: clip-path 0.55s cubic-bezier(0.45, 0, 0.15, 1);
      `;
      document.body.appendChild(overlay);
      overlayRef.current = overlay;

      // Expand the circle
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const maxRadius = Math.hypot(
            Math.max(originX, window.innerWidth - originX),
            Math.max(originY, window.innerHeight - originY)
          ) * 1.1;
          overlay.style.clipPath = `circle(${maxRadius}px at ${originX}px ${originY}px)`;
        });
      });

      // Switch theme at midpoint
      setTimeout(() => {
        setTheme(next);
        localStorage.setItem("theme", next);
        document.documentElement.setAttribute("data-theme", next);
      }, 280);

      // Remove overlay after animation
      setTimeout(() => {
        overlay.style.transition = "opacity 0.25s ease";
        overlay.style.opacity = "0";
        setTimeout(() => {
          overlay.remove();
          overlayRef.current = null;
          isAnimating.current = false;
        }, 260);
      }, 500);
    },
    [theme]
  );

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

