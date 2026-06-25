"use client";
import { useRef, useState } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  spotlightColor?: string;
}

export default function SpotlightCard({
  children,
  className,
  style,
  spotlightColor = "rgba(0, 102, 255, 0.15)",
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => setMousePos(null);

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight gradient overlay */}
      {mousePos && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 70%)`,
            transition: "opacity 0.2s ease",
            borderRadius: "inherit",
          }}
        />
      )}
      {/* Border highlight that follows cursor */}
      {mousePos && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2,
            borderRadius: "inherit",
            border: "1px solid transparent",
            background: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, var(--accent-glow), transparent 70%) border-box`,
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            maskComposite: "exclude",
          }}
        />
      )}
      {/* Card content sits above the spotlight */}
      <div style={{ position: "relative", zIndex: 3, height: "100%" }}>
        {children}
      </div>
    </div>
  );
}
