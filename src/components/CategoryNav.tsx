"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Wrench, Wind, Battery, Disc, Hammer, Droplets, Sparkles, Car } from "lucide-react";

export interface Category {
  id: string;
  label: string;
  icon: React.ElementType;
}

const CATEGORIES: Category[] = [
  { id: "car-services", label: "Car Services", icon: Wrench },
  { id: "ac-service", label: "AC Service & Repair", icon: Wind },
  { id: "batteries", label: "Batteries", icon: Battery },
  { id: "tyres", label: "Tyres & Wheel Care", icon: Disc },
  { id: "denting-painting", label: "Denting & Painting", icon: Hammer },
  { id: "detailing", label: "Detailing Services", icon: Droplets },
  { id: "car-spa", label: "Car Spa & Cleaning", icon: Sparkles },
  { id: "inspection", label: "Car Inspection", icon: Car },
];

interface CategoryNavProps {
  activeCategory?: string;
  onCategoryClick?: (categoryId: string) => void;
}

export default function CategoryNav({ activeCategory, onCategoryClick }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div
      style={{
        position: "sticky",
        top: "var(--topbar-height)",
        zIndex: 40,
        background: "var(--navbar-bg)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--glass-border)",
        height: "var(--categorybar-height)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Left Arrow */}
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scroll("left")}
            style={{
              position: "absolute",
              left: 0,
              zIndex: 10,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
        )}

        {/* Scrollable Category Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            display: "flex",
            gap: 32,
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            padding: "16px 0",
            width: "100%",
          }}
          className="hide-scrollbar"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            const Icon = category.icon;

            return (
              <motion.button
                key={category.id}
                onClick={() => onCategoryClick?.(category.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: "0 0 auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "12px 20px",
                  borderRadius: 8,
                  background: isActive ? "rgba(225, 29, 47, 0.08)" : "transparent",
                  border: "none",
                  color: isActive ? "#E11D2F" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: isActive ? 600 : 500,
                  whiteSpace: "nowrap",
                  position: "relative",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                }}
              >
                <Icon size={20} style={{ color: isActive ? "#E11D2F" : "currentColor" }} />
                <span>{category.label}</span>
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 3,
                      left: 20,
                      right: 20,
                      height: 3,
                      backgroundColor: "#E11D2F",
                      borderRadius: 2,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scroll("right")}
            style={{
              position: "absolute",
              right: 0,
              zIndex: 10,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
