"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Car, Phone, ChevronDown, CheckCircle2, ArrowRight, Star, Users } from "lucide-react";

export interface SelectedCar {
  brand: string;
  model: string;
}

interface QuoteSidebarProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedCar: SelectedCar | null;
  setSelectedCar: (car: SelectedCar | null) => void;
  phone: string;
  setPhone: (phone: string) => void;
  cities: string[];
  bookingSuccess: boolean;
  setBookingSuccess: (success: boolean) => void;
  loadingSubmit: boolean;
  onOpenCarModal: () => void;
  onCheckPrices: () => void;
}

export default function QuoteSidebar({
  selectedCity,
  setSelectedCity,
  selectedCar,
  setSelectedCar,
  phone,
  setPhone,
  cities,
  bookingSuccess,
  setBookingSuccess,
  loadingSubmit,
  onOpenCarModal,
  onCheckPrices,
}: QuoteSidebarProps) {
  return (
    <div
      style={{
        width: "394px",
        height: "532px",
        padding: "30px 48px",
        background: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
      className="shrink-0"
    >
      <div>
        {/* Header */}
        <h3
          style={{
            fontSize: "1.2rem",
            fontWeight: 900,
            color: "#1a1a1a",
            fontFamily: "Outfit, sans-serif",
            margin: "0 0 4px 0",
            lineHeight: 1.3,
          }}
        >
          Experience The Best Car Services In {selectedCity}
        </h3>
        <p
          style={{
            fontSize: "0.8rem",
            color: "#6b7280",
            margin: "0 0 18px 0",
          }}
        >
          Get instant quotes for your car service
        </p>

        {/* Success View */}
        {bookingSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center", padding: "16px 0" }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.15)",
                border: "2px solid #10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                color: "#10B981",
              }}
            >
              <CheckCircle2 size={26} />
            </div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px 0" }}>
              Quote Requested!
            </h4>
            <p style={{ fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.5, margin: "0 0 16px 0" }}>
              Our service manager in <strong>{selectedCity}</strong> will contact you at <strong>+91 {phone}</strong> shortly.
            </p>
            <button
              onClick={() => {
                setBookingSuccess(false);
                setPhone("");
                setSelectedCar(null);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
                color: "#1a1a1a",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Check Another Quote
            </button>
          </motion.div>
        ) : (
          /* Form Fields */
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* 1. City Select Dropdown */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 14px",
                  borderRadius: 6,
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <MapPin size={16} color="#E2001A" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    color: "#1a1a1a",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    outline: "none",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    paddingRight: 20,
                  }}
                >
                  {cities.map((c) => (
                    <option key={c} value={c} style={{ background: "#ffffff", color: "#1a1a1a" }}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  color="#9ca3af"
                  style={{ position: "absolute", right: 12, pointerEvents: "none" }}
                />
              </div>
            </div>

            {/* 2. Select Your Car Trigger */}
            <button
              onClick={onOpenCarModal}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "11px 14px",
                borderRadius: 6,
                background: selectedCar ? "rgba(0, 102, 255, 0.05)" : "#f9fafb",
                border: selectedCar ? "2px solid #0066FF" : "1px solid #e5e7eb",
                color: "#1a1a1a",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Car size={16} color="#0066FF" />
                <span style={{ fontSize: "0.85rem", fontWeight: selectedCar ? 800 : 600 }}>
                  {selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : "SELECT YOUR CAR"}
                </span>
              </div>
              <ChevronDown size={16} color="#9ca3af" />
            </button>

            {/* 3. Mobile Number Input */}
            <div style={{ position: "relative" }}>
              <Phone size={16} color="#9ca3af" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="tel"
                placeholder="ENTER MOBILE NUMBER"
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                style={{
                  width: "100%",
                  padding: "11px 14px 11px 38px",
                  borderRadius: 6,
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  color: "#1a1a1a",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  outline: "none",
                }}
              />
            </div>

            {/* 4. Action Button */}
            <motion.button
              onClick={onCheckPrices}
              disabled={loadingSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 6,
                background: "#E2001A",
                color: "white",
                border: "none",
                cursor: loadingSubmit ? "wait" : "pointer",
                fontFamily: "Outfit, sans-serif",
                fontSize: "0.9rem",
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                boxShadow: "0 6px 20px rgba(226, 0, 26, 0.3)",
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {loadingSubmit ? (
                "Submitting..."
              ) : (
                <>
                  CHECK PRICES FOR FREE
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>

      {/* Trust Footer */}
      <div
        style={{
          paddingTop: 16,
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Star size={16} color="#F59E0B" fill="#F59E0B" />
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text, #1a1a1a)" }}>4.7 / 5</div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-secondary, #6b7280)" }}>535+ Google Reviews</div>
          </div>
        </div>

        <div style={{ height: 24, width: 1, background: "var(--border, #e5e7eb)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Users size={16} color="#0066FF" />
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text, #1a1a1a)" }}>5,000+</div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-secondary, #6b7280)" }}>Happy Customers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
