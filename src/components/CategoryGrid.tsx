"use client";

import React from "react";
import CategoryCard, { CategoryItem } from "./CategoryCard";

interface CategoryGridProps {
  categories: CategoryItem[];
  selectedCategory?: string | null;
  onSelectCategory?: (categoryTitle: string) => void;
}

export default function CategoryGrid({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryGridProps) {
  return (
    <div
      style={{
        width: "694px",
        maxWidth: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(4, 157px)",
        gap: "22px",
        justifyContent: "start",
      }}
      className="category-grid-container"
    >
      {categories.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          isSelected={selectedCategory === cat.title}
          onClick={() => onSelectCategory?.(cat.title)}
        />
      ))}
    </div>
  );
}
