"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check, ChevronRight, Car } from "lucide-react";

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
  { name: "Volkswagen", popular: false, models: ["Virtus", "Taigun", "Tiguan", "Polo", "Vento"] },
  { name: "Skoda", popular: false, models: ["Slavia", "Kushaq", "Kodiaq", "Octavia", "Superb"] },
  { name: "BMW", popular: false, models: ["3 Series", "5 Series", "X1", "X3", "X5", "7 Series"] },
  { name: "Mercedes-Benz", popular: false, models: ["C-Class", "E-Class", "GLC", "GLE", "S-Class", "A-Class"] },
  { name: "Audi", popular: false, models: ["A4", "A6", "Q3", "Q5", "Q7"] },
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

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 520,
            maxHeight: "85vh",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 24,
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--bg-secondary)",
            }}
          >
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <Car size={20} color="var(--accent)" />
                {selectedBrand ? `Select ${selectedBrand} Model` : "Select Your Car Brand"}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                {selectedBrand ? "Choose your car model for accurate pricing" : "Select brand to see available models"}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text)",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ padding: "16px 24px 12px", borderBottom: "1px solid var(--border)" }}>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: 14 }} />
              <input
                type="text"
                placeholder={selectedBrand ? `Search ${selectedBrand} models...` : "Search car brands..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 16px 10px 42px",
                  borderRadius: 12,
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: "0.9rem",
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
                  marginTop: 10,
                  background: "none",
                  border: "none",
                  color: "var(--accent)",
                  fontSize: "0.85rem",
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

          {/* Content List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
            {!selectedBrand ? (
              /* Brand Selection Grid */
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {filteredBrands.map((b) => (
                  <button
                    key={b.name}
                    onClick={() => {
                      setSelectedBrand(b.name);
                      setSearchQuery("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 16px",
                      borderRadius: 14,
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.background = "var(--border-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.background = "var(--bg)";
                    }}
                  >
                    <span>{b.name}</span>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </button>
                ))}
              </div>
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
