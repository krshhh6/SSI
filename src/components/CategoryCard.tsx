"use client";

import React from "react";
import { motion } from "framer-motion";

export interface CategoryItem {
  id: string;
  title: string;
  desc?: string;
  iconUrl: string;
  color?: string;
  badge?: string | null;
}

interface CategoryCardProps {
  category: CategoryItem;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CategoryCard({
  category,
  isSelected = false,
  onClick,
}: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        width: 157,
        height: 166,
        padding: "18px 12px 14px 12px",
        background: isSelected ? "rgba(0, 142, 207, 0.07)" : "var(--card, #FFFFFF)",
        borderRadius: 16,
        border: isSelected ? "1.5px solid #008ECF" : "1px solid var(--border)",
        boxShadow: isSelected
          ? "0 12px 28px -6px rgba(0, 142, 207, 0.22), 0 0 0 1px #008ECF"
          : "0 2px 10px -2px rgba(15, 23, 42, 0.05), 0 0 1px rgba(15, 23, 42, 0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        position: "relative",
        boxSizing: "border-box",
        userSelect: "none",
        overflow: "hidden",
        transition: "all 0.24s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className="shrink-0 group"
    >
      {/* Subtle Top Ambient Glow Accent Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: 2.5,
          borderRadius: "0 0 4px 4px",
          background: isSelected
            ? "linear-gradient(90deg, #008ECF 0%, #00C896 100%)"
            : "transparent",
          transition: "all 0.25s ease",
        }}
        className="card-top-accent group-hover:bg-gradient-to-r group-hover:from-[#008ECF] group-hover:to-[#00C896]"
      />

      {/* "New" Badge - Top Right Corner */}
      {category.badge && (
        <span
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "#ECFDF5",
            color: "#059669",
            fontSize: "0.62rem",
            fontWeight: 800,
            padding: "2px 7px",
            borderRadius: 9999,
            border: "1px solid rgba(16, 185, 129, 0.25)",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#10B981" }} />
          {category.badge}
        </span>
      )}

      {/* 68px Dedicated Icon Squircle Container */}
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: 16,
          background: isSelected
            ? "rgba(0, 142, 207, 0.12)"
            : `color-mix(in srgb, ${category.color || "#008ECF"} 8%, transparent)`,
          border: `1px solid color-mix(in srgb, ${category.color || "#008ECF"} 16%, transparent)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.6)",
        }}
        className="group-hover:scale-105 group-hover:shadow-sm"
      >
        <img
          src={category.iconUrl}
          alt={category.title}
          loading="lazy"
          decoding="async"
          style={{
            width: 50,
            height: 50,
            objectFit: "contain",
            filter: "drop-shadow(0 3px 6px rgba(0, 0, 0, 0.08))",
            transition: "transform 0.22s ease",
          }}
          className="group-hover:scale-110"
        />
      </div>

      {/* Label & Micro-Action */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, width: "100%", marginTop: 6 }}>
        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: isSelected ? "#008ECF" : "var(--text, #0F172A)",
            textAlign: "center",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 130,
            wordBreak: "break-word",
            transition: "color 0.2s ease",
          }}
        >
          {category.title}
        </span>
        
        <span
          style={{
            fontSize: "0.66rem",
            fontWeight: 600,
            color: isSelected ? "#008ECF" : "var(--text-muted, #94A3B8)",
            display: "inline-flex",
            alignItems: "center",
            gap: 2,
            opacity: isSelected ? 1 : 0.75,
            transition: "all 0.2s ease",
          }}
          className="group-hover:text-[#008ECF] group-hover:opacity-100 group-hover:translate-x-0.5"
        >
          Explore <span style={{ fontSize: "0.72rem", lineHeight: 1 }}>→</span>
        </span>
      </div>
    </motion.div>
  );
}

export default CategoryCard;
