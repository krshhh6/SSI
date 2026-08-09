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
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        width: 157,
        height: 157,
        padding: "19px 38px",
        background: "rgba(234, 234, 234, 0.56)", // #EAEAEA8F semi-transparent light grey
        borderRadius: 8,
        border: "none",
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        boxSizing: "border-box",
        userSelect: "none",
      }}
      className="shrink-0"
    >
      {/* "New" Badge - Top Right Corner */}
      {category.badge && (
        <span
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "#0a8a3f",
            color: "white",
            fontSize: "10px",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 10,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          {category.badge}
        </span>
      )}

      {/* Icon: exact 48px x 48px, centered, margin-bottom 12px */}
      <div
        style={{
          width: 48,
          height: 48,
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <img
          src={category.iconUrl}
          alt={category.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Label: font 14px, font-weight 600, text-align center, color #1a1a1a, max 2 lines */}
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: isSelected ? "#E2001A" : "#1a1a1a",
          textAlign: "center",
          lineHeight: 1.25,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {category.title}
      </span>
    </motion.div>
  );
}

export default CategoryCard;
