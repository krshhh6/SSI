"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import CategoryNav from "@/components/CategoryNav";
import PageLayout from "@/components/PageLayout";
import { Search, Car } from "lucide-react";

/**
 * EXAMPLE PAGE: Services with Two-Tier Sticky Navbar + Side Panel
 * 
 * This demonstrates:
 * 1. Top navbar (Navbar.tsx) - sticky at top: 0
 * 2. Category bar (CategoryNav.tsx) - sticky at top: var(--topbar-height)
 * 3. PageLayout with side panel that sits BESIDE content (no overlap)
 * 4. Proper padding-top on content to prevent navbar overlap
 */
export default function ServicesDemoPage() {
  const [activeCategory, setActiveCategory] = useState("car-services");
  const [selectedBrand, setSelectedBrand] = useState("");

  const BRANDS = [
    "Maruti Suzuki", "Hyundai", "Honda", "Tata", "Mahindra", 
    "Toyota", "Kia", "Volkswagen", "Skoda"
  ];

  // Side Panel Component
  const sidePanel = (
    <div>
      <h3 style={{ 
        fontSize: "1.1rem", 
        fontWeight: 700, 
        marginBottom: 16,
        fontFamily: "Outfit, sans-serif",
        color: "var(--text)" 
      }}>
        Select Manufacturer
      </h3>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <Search size={16} color="#999" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
        <input
          type="text"
          placeholder="Search brands..."
          style={{
            width: "100%",
            padding: "10px 12px 10px 38px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--bg)",
            color: "var(--text)",
            fontSize: "0.85rem",
            outline: "none",
          }}
        />
      </div>

      {/* Brand List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {BRANDS.map((brand) => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              background: selectedBrand === brand ? "var(--accent)" : "var(--bg)",
              border: selectedBrand === brand ? "1px solid var(--accent)" : "1px solid var(--border)",
              color: selectedBrand === brand ? "white" : "var(--text)",
              fontSize: "0.85rem",
              fontWeight: selectedBrand === brand ? 600 : 500,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Car size={16} />
            {brand}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Top Navbar - sticky at top: 0 */}
      <Navbar />

      {/* 2. Category Bar - sticky at top: var(--topbar-height) */}
      <CategoryNav 
        activeCategory={activeCategory}
        onCategoryClick={setActiveCategory}
      />

      {/* 3. Page Layout - handles padding-top and two-column layout */}
      <PageLayout hasCategoryNav sidePanel={sidePanel}>
        {/* Main Content */}
        <div>
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: 800, 
            marginBottom: 16,
            fontFamily: "Outfit, sans-serif",
            color: "var(--text)"
          }}>
            {activeCategory === "car-services" && "Car Services"}
            {activeCategory === "ac-service" && "AC Service & Repair"}
            {activeCategory === "batteries" && "Batteries"}
            {activeCategory === "tyres" && "Tyres & Wheel Care"}
            {activeCategory === "denting-painting" && "Denting & Painting"}
            {activeCategory === "detailing" && "Detailing Services"}
            {activeCategory === "car-spa" && "Car Spa & Cleaning"}
            {activeCategory === "inspection" && "Car Inspection"}
          </h1>

          <p style={{ 
            fontSize: "1rem", 
            color: "var(--text-secondary)", 
            marginBottom: 32,
            lineHeight: 1.6 
          }}>
            {selectedBrand 
              ? `Showing services for ${selectedBrand}`
              : "Select a manufacturer from the right panel to see specific services"}
          </p>

          {/* Service Cards Grid */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20 
          }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 20,
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div style={{
                  width: "100%",
                  height: 180,
                  background: "var(--bg-secondary)",
                  borderRadius: 8,
                  marginBottom: 16,
                }}/>
                <h3 style={{ 
                  fontSize: "1.1rem", 
                  fontWeight: 700, 
                  marginBottom: 8,
                  color: "var(--text)"
                }}>
                  Service Package {i}
                </h3>
                <p style={{ 
                  fontSize: "0.9rem", 
                  color: "var(--text-secondary)",
                  marginBottom: 16,
                  lineHeight: 1.5
                }}>
                  Complete service package including oil change, filters, and inspection.
                </p>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center" 
                }}>
                  <span style={{ 
                    fontSize: "1.3rem", 
                    fontWeight: 800, 
                    color: "var(--accent)" 
                  }}>
                    ₹{2999 + i * 500}
                  </span>
                  <button style={{
                    background: "var(--bosch-red)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "none",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Demonstrate scroll length */}
          <div style={{ 
            marginTop: 60, 
            padding: 40, 
            background: "var(--card)",
            borderRadius: 12,
            border: "1px solid var(--border)"
          }}>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 700, 
              marginBottom: 16,
              color: "var(--text)"
            }}>
              Why Choose Our Services?
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 20 
            }}>
              {["Expert Technicians", "Genuine Parts", "Warranty Backed", "Transparent Pricing"].map((feature) => (
                <div key={feature} style={{
                  padding: 20,
                  background: "var(--bg)",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                }}>
                  <h4 style={{ 
                    fontSize: "1rem", 
                    fontWeight: 600, 
                    marginBottom: 8,
                    color: "var(--text)"
                  }}>
                    {feature}
                  </h4>
                  <p style={{ 
                    fontSize: "0.85rem", 
                    color: "var(--text-secondary)",
                    lineHeight: 1.5 
                  }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
