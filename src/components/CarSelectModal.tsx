"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check, Car } from "lucide-react";
import BrandLogo from "./core/BrandLogos";
import ManufacturerGrid from "./ManufacturerGrid";

export interface SelectedCar {
  brand: string;
  model: string;
}

const CAR_BRANDS = [
  { name: "Maruti Suzuki", popular: true, models: ["Swift", "Baleno", "Brezza", "Dzire", "Ertiga", "WagonR", "Alto K10", "Grand Vitara", "Fronx", "Ciaz"] },
  { name: "Hyundai", popular: true, models: ["Creta", "i20", "Venue", "Verna", "Grand i10 Nios", "Exster", "Alcazar", "Tucson"] },
  { name: "Tata", popular: true, models: ["Nexon", "Punch", "Harrier", "Safari", "Tiago", "Tigor", "Altroz", "Curvv"] },
  { name: "Mahindra", popular: true, models: ["Thar", "XUV700", "Scorpio-N", "Scorpio Classic", "XUV3XX", "Bolero", "XUV400"] },
  { name: "Honda", popular: true, models: ["City", "Amaze", "Elevate", "Civic", "WR-V", "Jazz"] },
  { name: "Toyota", popular: true, models: ["Fortuner", "Innova Crysta", "Innova Hycross", "Glanza", "Urban Cruiser Taisor", "Camry", "Hilux"] },
  { name: "Kia", popular: true, models: ["Seltos", "Sonet", "Carens", "EV6", "Carnival"] },
  { name: "Ford", popular: false, models: ["EcoSport", "Endeavour", "Figo", "Freestyle", "Aspire"] },
  { name: "Volkswagen", popular: false, models: ["Virtus", "Taigun", "Tiguan", "Polo", "Vento"] },
  { name: "Renault", popular: false, models: ["Kwid", "Triber", "Kiger", "Duster"] },
  { name: "Chevrolet", popular: false, models: ["Beat", "Cruze", "Sail", "Spark", "Tavera"] },
  { name: "Nissan", popular: false, models: ["Magnite", "Kicks", "Terrano", "Sunny", "Micra"] },
  { name: "Skoda", popular: false, models: ["Slavia", "Kushaq", "Kodiaq", "Octavia", "Superb"] },
  { name: "Fiat", popular: false, models: ["Punto", "Linea", "Avventura", "Urban Cross"] },
  { name: "Datsun", popular: false, models: ["redi-GO", "GO", "GO+"] },
  { name: "MG", popular: false, models: ["Hector", "Astor", "ZS EV", "Comet EV", "Gloster"] },
  { name: "BMW", popular: false, models: ["3 Series", "5 Series", "X1", "X3", "X5", "7 Series"] },
  { name: "Mercedes-Benz", popular: false, models: ["C-Class", "E-Class", "GLC", "GLE", "S-Class", "A-Class"] },
  { name: "Audi", popular: false, models: ["A4", "A6", "Q3", "Q5", "Q7"] },
  { name: "Jeep", popular: false, models: ["Compass", "Meridian", "Wrangler", "Grand Cherokee"] },
  { name: "Volvo", popular: false, models: ["XC40", "XC60", "XC90", "S90"] },
  { name: "Porsche", popular: false, models: ["911", "Cayenne", "Macan", "Panamera", "Taycan"] },
  { name: "Hindustan Motors", popular: false, models: ["Ambassador", "Contessa"] },
  { name: "Other", popular: false, models: ["Other Model"] },
];

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

  const currentBrandObj = CAR_BRANDS.find((b) => b.name === selectedBrand);

  const filteredBrands = CAR_BRANDS.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredModels = currentBrandObj
    ? currentBrandObj.models.filter((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSelectModel = (model: string) => {
    onSelectCar({ brand: selectedBrand, model });
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
                brands={CAR_BRANDS.map((b) => b.name)}
                searchQuery={searchQuery}
                onSelectBrand={(b) => {
                  setSelectedBrand(b);
                  setSearchQuery("");
                }}
              />
            ) : (
              /* Model Selection List */
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filteredModels.map((model) => (
                  <button
                    key={model}
                    onClick={() => handleSelectModel(model)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 18px",
                      borderRadius: 14,
                      background: "var(--bg)",
                      border: initialCar?.model === model && initialCar?.brand === selectedBrand ? "2px solid var(--accent)" : "1px solid var(--border)",
                      color: "var(--text)",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      if (!(initialCar?.model === model && initialCar?.brand === selectedBrand)) {
                        e.currentTarget.style.borderColor = "var(--border)";
                      }
                    }}
                  >
                    <span>{model}</span>
                    {initialCar?.model === model && initialCar?.brand === selectedBrand && (
                      <Check size={18} color="var(--accent)" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
