"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import ManufacturerGrid from "./ManufacturerGrid";
import { Manufacturer } from "./ManufacturerCard";

interface ManufacturerPanelProps {
  manufacturers?: Manufacturer[];
  brands?: string[];
  selectedBrandId?: string;
  onClose?: () => void;
  onSelectManufacturer?: (manufacturer: Manufacturer) => void;
  onSelectBrand?: (brandName: string) => void;
}

export default function ManufacturerPanel({
  manufacturers,
  brands,
  selectedBrandId,
  onClose,
  onSelectManufacturer,
  onSelectBrand,
}: ManufacturerPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-[394px] h-[448px] bg-white rounded-[12px] border border-gray-100 shadow-xl flex flex-col shrink-0 overflow-hidden font-sans p-[32px] box-border">
      {/* HEADER ROW: Title + Close (×) button */}
      <div className="flex items-center justify-between mb-[20px] shrink-0">
        <h3 className="text-[18px] font-bold text-[#1a1a1a] m-0 leading-tight">
          Select Manufacturer
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="bg-transparent border-0 p-0 text-gray-500 hover:text-gray-800 cursor-pointer flex items-center justify-center transition-colors w-7 h-7 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={20} className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* SEARCH BOX WITH EXACT CLASS NAMES */}
      <div className="manufacturer-search-wrapper shrink-0 mb-[24px]">
        <Search className="manufacturer-search-icon" size={18} />
        <input
          type="text"
          placeholder="Search Brands"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="manufacturer-search-input"
        />
      </div>

      {/* LOGO GRID CONTENT AREA */}
      <div className="flex-1 min-h-0">
        <ManufacturerGrid
          manufacturers={manufacturers}
          brands={brands}
          searchQuery={searchQuery}
          selectedBrandId={selectedBrandId}
          onSelectManufacturer={onSelectManufacturer}
          onSelectBrand={onSelectBrand}
          className="px-0 pt-0 pb-4"
        />
      </div>
    </div>
  );
}
