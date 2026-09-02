"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * High-precision automotive progress bar (Bosch Electric Blue -> Neon Cyan glow)
 * Provides instant tactile feedback during page and route transitions.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Complete and hide progress when route transition finishes
  useEffect(() => {
    if (isVisible) {
      setProgress(100);
      const finishTimer = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(finishTimer);
    }
  }, [pathname, searchParams]);

  // Intercept clicks on internal links for immediate tactile feedback
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external, hash-only, mailto, tel, or target="_blank"
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.getAttribute("target") === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // If it's a hash on the current page, don't trigger full progress
      if (href.startsWith("#") || (href.startsWith("/#") && pathname === "/")) {
        return;
      }

      // Check if target is a different route
      const targetPath = href.split("?")[0].split("#")[0];
      if (targetPath && targetPath !== pathname) {
        setIsVisible(true);
        setProgress(25);

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setTimeout(() => {
          setProgress(70);
        }, 120);
      }
    };

    const handleCustomNavigate = () => {
      setIsVisible(true);
      setProgress(35);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setTimeout(() => {
        setProgress(85);
      }, 150);
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    window.addEventListener("resetHome", handleCustomNavigate);

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("resetHome", handleCustomNavigate);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2.5,
        zIndex: 99999,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #005691 0%, #008ECF 45%, #00D2FF 80%, #00C896 100%)",
          boxShadow: "0 0 10px rgba(0, 142, 207, 0.8), 0 0 4px rgba(0, 210, 255, 0.6)",
          transition: progress === 100 
            ? "width 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease 0.15s" 
            : "width 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: progress === 100 ? 0 : 1,
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  );
}
