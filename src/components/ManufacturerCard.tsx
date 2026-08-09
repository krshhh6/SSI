"use client";

import React, { useState } from "react";
import Image from "next/image";
import BrandLogo from "./core/BrandLogos";

export interface Manufacturer {
  id: string;
  name: string;
  logoUrl: string;
  href?: string;
}

interface ManufacturerCardProps {
  manufacturer: Manufacturer;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function ManufacturerCard({
  manufacturer,
  isSelected = false,
  onClick,
}: ManufacturerCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={manufacturer.href || `#${manufacturer.id}`}
      onClick={onClick}
      className="flex flex-col items-center no-underline select-none bg-transparent border-0 cursor-pointer p-0 group focus:outline-none transition-transform duration-200 hover:scale-105"
    >
      {/* Square Bordered Container Box: 88px x 88px, bg #fafafa, border 1px solid #e5e5e5, border-radius 12px, padding 16px */}
      <div className="w-[88px] h-[88px] p-[16px] bg-[#fafafa] border border-[#e5e5e5] rounded-[12px] flex items-center justify-center shrink-0 overflow-hidden box-border">
        {!imgError ? (
          <Image
            src={manufacturer.logoUrl}
            alt={manufacturer.name}
            width={56}
            height={56}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BrandLogo brand={manufacturer.name} size={40} />
          </div>
        )}
      </div>

      {/* Caption Div: font 13px, font-weight 500, color #1a1a1a, mt-2 (8px gap), max 2 lines */}
      <div
        className={`mt-2 text-[13px] font-medium text-center leading-tight max-w-[88px] line-clamp-2 break-words transition-colors duration-150 ${
          isSelected ? "text-red-600 font-semibold" : "text-[#1a1a1a]"
        }`}
      >
        {manufacturer.name}
      </div>
    </a>
  );
}
