"use client";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="galaxy-button">
      <button onClick={toggleTheme} aria-label="Toggle theme">
        <span className="spark"></span>
        <span className="backdrop"></span>
        <span className="galaxy__container">
          <span className="star star--static" style={{ top: "20%", left: "15%" }}></span>
          <span className="star star--static" style={{ top: "75%", left: "80%" }}></span>
          <span className="star star--static" style={{ top: "15%", left: "70%" }}></span>
          <span className="star star--static" style={{ top: "80%", left: "20%" }}></span>
        </span>
        <span className="galaxy">
          <span className="galaxy__ring">
            {/* Generate 20 stars randomly placed in a ring */}
            {Array.from({ length: 20 }).map((_, i) => {
              const angle = (i / 20) * 360;
              const radius = 35 + Math.random() * 15; // Random radius between 35% and 50%
              const top = 50 + radius * Math.sin((angle * Math.PI) / 180);
              const left = 50 + radius * Math.cos((angle * Math.PI) / 180);
              return (
                <span
                  key={i}
                  className="star"
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    transform: `translate(-50%, -50%) rotateX(-65deg)`, // Counter-rotate to face camera
                  }}
                ></span>
              );
            })}
          </span>
        </span>
        <span className="text">{isDark ? "🌙 Dark" : "☀️ Light"}</span>
      </button>
      <div className="bodydrop"></div>

      <style>{`
        .galaxy-button {
          position: relative;
          display: inline-block;
        }
        .galaxy-button button {
          appearance: none;
          background: none;
          border: none;
          padding: 8px 18px;
          border-radius: 100px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 90px;
          transition: transform 0.2s cubic-bezier(0.2, 1, 0.3, 1);
        }
        .galaxy-button button:hover {
          transform: scale(1.03);
        }
        .galaxy-button button:active {
          transform: scale(0.97);
        }
        
        /* The sweeping glowing border */
        .galaxy-button .spark {
          position: absolute;
          inset: 0;
          border-radius: 100px;
          background: conic-gradient(from 0deg, transparent 0 280deg, var(--accent) 360deg);
          animation: galaxy-spin 3s linear infinite;
          z-index: 0;
        }
        
        /* Inner button background */
        .galaxy-button .backdrop {
          position: absolute;
          inset: 1.5px;
          background: var(--card);
          border-radius: 100px;
          z-index: 1;
          backdrop-filter: blur(10px);
          transition: background 0.3s ease;
        }
        
        /* The text */
        .galaxy-button .text {
          position: relative;
          z-index: 10;
          color: var(--text);
          font-weight: 600;
          font-size: 0.8rem;
          font-family: Inter, sans-serif;
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        /* Galaxy 3D container */
        .galaxy-button .galaxy__container {
          position: absolute;
          inset: 0;
          z-index: 2;
          overflow: hidden;
          border-radius: 100px;
          opacity: 0.8;
          pointer-events: none;
        }
        .galaxy-button .galaxy {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 250%;
          height: 250%;
          transform: translate(-50%, -50%) rotateX(65deg);
          transform-style: preserve-3d;
          z-index: 3;
          pointer-events: none;
        }
        
        /* Rotating ring of stars */
        .galaxy-button .galaxy__ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          transform-style: preserve-3d;
          animation: galaxy-spin 15s linear infinite;
        }
        
        /* Individual stars */
        .galaxy-button .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: var(--text);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--text);
          animation: twinkle 2s ease-in-out infinite alternate;
        }
        .galaxy-button .star--static {
          width: 1.5px;
          height: 1.5px;
          opacity: 0.5;
          animation: none;
          background: var(--text);
          box-shadow: none;
        }
        
        /* Ambient body drop shadow */
        .galaxy-button .bodydrop {
          position: absolute;
          inset: 0;
          border-radius: 100px;
          background: var(--accent);
          filter: blur(15px);
          opacity: 0.2;
          z-index: -1;
          transition: opacity 0.3s ease;
        }
        .galaxy-button:hover .bodydrop {
          opacity: 0.4;
        }
        
        @keyframes galaxy-spin {
          to { transform: rotate(360deg) rotateX(0deg); }
        }
        .galaxy-button .galaxy__ring {
            animation: ring-spin 15s linear infinite;
        }
        @keyframes ring-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes twinkle {
          0% { opacity: 0.2; transform: translate(-50%, -50%) rotateX(-65deg) scale(0.8); }
          100% { opacity: 1; transform: translate(-50%, -50%) rotateX(-65deg) scale(1.3); }
        }
      `}</style>
    </div>
  );
}
