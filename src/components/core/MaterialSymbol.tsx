"use client";

import React from "react";

export interface MaterialSymbolProps {
  name: string;
  variant?: "outlined" | "rounded" | "sharp";
  size?: number | string;
  fill?: boolean;
  weight?: number;
  grade?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function MaterialSymbol({
  name,
  variant = "rounded",
  size = 22,
  fill = false,
  weight = 500,
  grade = 0,
  color,
  className = "",
  style = {},
}: MaterialSymbolProps) {
  const fontVariation = `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${
    typeof size === "number" ? Math.min(Math.max(size, 20), 48) : 24
  }`;

  const familyName =
    variant === "sharp"
      ? "Material Symbols Sharp"
      : variant === "outlined"
      ? "Material Symbols Outlined"
      : "Material Symbols Rounded";

  const variantClass =
    variant === "sharp"
      ? "material-symbols-sharp"
      : variant === "outlined"
      ? "material-symbols-outlined"
      : "material-symbols-rounded";

  return (
    <span
      className={`${variantClass} select-none ${className}`}
      style={{
        fontFamily: `'${familyName}', sans-serif`,
        fontSize: typeof size === "number" ? `${size}px` : size,
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
        color: color,
        fontVariationSettings: fontVariation,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
        ...style,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
