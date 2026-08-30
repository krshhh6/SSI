"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check, Car } from "lucide-react";
import BrandLogo from "./core/BrandLogos";
import ManufacturerGrid from "./ManufacturerGrid";

import { CAR_BRANDS_CATALOG, getCarSegment, BoschVehicleSegment } from "@/lib/vehicleGrouping";

export interface SelectedCar {
  brand: string;
  model: string;
  segment?: BoschVehicleSegment;
}

interface CarSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCar: (car: SelectedCar) => void;
  initialCar?: SelectedCar | null;
}

export default function CarSelectModal({ isOpen, onClose, onSelectCar, initialCar }: CarSelectModalProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>(initialCar?.brand || "");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const currentBrandObj = CAR_BRANDS_CATALOG.find((b) => b.name.toLowerCase() === selectedBrand.toLowerCase());

  const filteredBrands = CAR_BRANDS_CATALOG.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredModels = currentBrandObj
    ? currentBrandObj.models.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSelectModel = (modelName: string) => {
    const resolvedSegment = getCarSegment(selectedBrand, modelName);
    onSelectCar({ brand: selectedBrand, model: modelName, segment: resolvedSegment });
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(8px)",
          }}
        />

        {/* Modal Container - COMPACT 550px EXACT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 550,
            background: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15)",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          {/* Header - Single Row: Title + Close Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <h3 style={{ fontSize: "1.45rem", fontWeight: 700, color: "#1a1a1a", margin: 0, fontFamily: "Outfit, sans-serif" }}>
              {selectedBrand ? `Select ${selectedBrand} Model` : "Select Manufacturer"}
            </h3>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "#666",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Bar - COMPACT 48px HEIGHT */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Search size={18} color="#999" style={{ position: "absolute", left: 16 }} />
              <input
                type="text"
                placeholder="Search Brands"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  height: 48,
                  padding: "0 16px 0 46px",
                  borderRadius: 8,
                  background: "#ffffff",
                  border: "1px solid #ddd",
                  color: "#1a1a1a",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            {selectedBrand && (
              <button
                onClick={() => {
                  setSelectedBrand("");
                  setSearchQuery("");
                }}
                style={{
                  marginTop: 12,
                  background: "none",
                  border: "none",
                  color: "#E2001A",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                ← Back to all brands
              </button>
            )}
          </div>

          {/* Content List - MAX HEIGHT 400px SCROLLABLE */}
          <div style={{ maxHeight: 400, overflowY: "auto", overflowX: "hidden" }}>
            {!selectedBrand ? (
              /* Brand Selection Grid */
              <ManufacturerGrid
                brands={CAR_BRANDS_CATALOG.map((b) => b.name)}
                searchQuery={searchQuery}
                onSelectBrand={(b) => {
                  setSelectedBrand(b);
                  setSearchQuery("");
                }}
              />
            ) : (
              /* Model Selection List with Bosch Segment Indicators */
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filteredModels.map((item) => {
                  const seg = getCarSegment(selectedBrand, item.name);
                  const isCurrent = initialCar?.model === item.name && initialCar?.brand === selectedBrand;

                  return (
                    <button
                      key={item.name}
                      onClick={() => handleSelectModel(item.name)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        borderRadius: 12,
                        background: isCurrent ? "rgba(226,0,26,0.04)" : "#fafafa",
                        border: isCurrent ? "1.5px solid #E2001A" : "1px solid #e5e7eb",
                        color: "#111827",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#E2001A";
                        e.currentTarget.style.background = "rgba(226,0,26,0.02)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isCurrent) {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.background = "#fafafa";
                        }
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827" }}>
                          {item.name}
                        </span>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            color: "#6b7280",
                          }}
                        >
                          {seg.mainGroup} · {seg.subGroup}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          style={{
                            background: seg.badgeBg,
                            color: seg.badgeText,
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            padding: "3px 8px",
                            borderRadius: 6,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {seg.code}
                        </span>
                        {isCurrent && <Check size={18} color="#E2001A" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
