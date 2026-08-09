# Integrating Two-Tier Navbar with Existing Services.tsx

## Quick Integration Steps

Your existing `Services.tsx` has the manufacturer selector embedded in the right sidebar. Here's how to integrate the new two-tier navbar system:

---

## Option 1: Minimal Changes (Recommended)

Keep your existing Services.tsx mostly as-is, just add the category bar on top.

### Step 1: Update your services page

**File**: `src/app/page.tsx` (or wherever Services is rendered)

```tsx
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import CategoryNav from "@/components/CategoryNav";
import Services from "@/components/Services";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <>
      <Navbar />
      
      {/* NEW: Add Category Bar */}
      <CategoryNav 
        activeCategory={activeCategory || undefined}
        onCategoryClick={(categoryId) => {
          setActiveCategory(categoryId);
          // Scroll to services section
          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Add padding-top to prevent overlap */}
      <div style={{ paddingTop: "var(--total-navbar-height)" }}>
        {/* Your existing page content */}
        <Services initialCategory={activeCategory} />
        {/* Other sections... */}
      </div>
    </>
  );
}
```

### Step 2: Update Services.tsx to accept initial category

Add a prop to Services.tsx:

```tsx
interface ServicesProps {
  initialCategory?: string | null;
}

export default function Services({ initialCategory }: ServicesProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || null);
  
  // Rest of your existing code...
  
  // Update useEffect to sync with prop
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);
}
```

**That's it!** Your existing Services component keeps working, but now has a category bar above it.

---

## Option 2: Full PageLayout Integration

If you want to use the new PageLayout component with the sticky side panel:

### Step 1: Extract the manufacturer selector

**File**: `src/components/ManufacturerSelector.tsx` (NEW)

```tsx
"use client";
import { Search, Car } from "lucide-react";

interface ManufacturerSelectorProps {
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  selectedCar: any;
  onSelectCar: (car: any) => void;
}

export default function ManufacturerSelector({
  selectedBrand,
  onSelectBrand,
  selectedCar,
  onSelectCar,
}: ManufacturerSelectorProps) {
  const BRANDS = [
    "Maruti Suzuki", "Hyundai", "Honda", "Tata", "Mahindra",
    "Toyota", "Kia", "Volkswagen", "Skoda", "Renault", "Chevrolet"
  ];

  return (
    <div>
      <h3 style={{
        fontSize: "0.95rem",
        fontWeight: 800,
        color: "var(--text)",
        fontFamily: "Outfit, sans-serif",
        margin: "0 0 16px 0",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        <Car size={16} color="#E2001A" />
        {selectedCar ? "Selected Model" : "Select Manufacturer"}
      </h3>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        <input
          type="text"
          placeholder="Search Brands"
          style={{
            width: "100%",
            padding: "8px 10px 8px 32px",
            borderRadius: 6,
            border: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            color: "var(--text)",
            fontSize: "0.8rem",
            outline: "none",
          }}
        />
      </div>

      {/* Brand Grid - 3 columns */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
        maxHeight: 280,
        overflowY: "auto",
        paddingRight: 4,
      }}>
        {BRANDS.map((brand) => (
          <button
            key={brand}
            onClick={() => onSelectBrand(brand)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 6px",
              borderRadius: 8,
              background: selectedBrand === brand ? "rgba(0,102,255,0.08)" : "var(--bg)",
              border: selectedBrand === brand ? "1px solid var(--accent)" : "1px solid var(--border)",
              color: "var(--text)",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s ease",
              gap: 6,
            }}
          >
            {/* Add brand logos here if you have them */}
            <span style={{
              fontSize: "0.72rem",
              fontWeight: selectedBrand === brand ? 700 : 500,
              lineHeight: 1.1
            }}>
              {brand}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Step 2: Update Services page to use PageLayout

**File**: `src/app/services/page.tsx` (or your services route)

```tsx
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import CategoryNav from "@/components/CategoryNav";
import PageLayout from "@/components/PageLayout";
import ManufacturerSelector from "@/components/ManufacturerSelector";

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("car-services");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);

  // Extract manufacturer selector as side panel
  const sidePanel = (
    <ManufacturerSelector
      selectedBrand={selectedBrand}
      onSelectBrand={setSelectedBrand}
      selectedCar={selectedCar}
      onSelectCar={setSelectedCar}
    />
  );

  return (
    <>
      <Navbar />
      <CategoryNav activeCategory={activeCategory} onCategoryClick={setActiveCategory} />
      
      <PageLayout hasCategoryNav sidePanel={sidePanel}>
        {/* Your service packages content */}
        <ServicePackages 
          category={activeCategory} 
          brand={selectedBrand}
          car={selectedCar}
        />
      </PageLayout>
    </>
  );
}
```

---

## Category ID Mapping

Map category IDs from CategoryNav to your existing service sections:

```tsx
const CATEGORY_MAP = {
  "car-services": "Periodic Services",
  "ac-service": "AC Service & Repair",
  "batteries": "Batteries",
  "tyres": "Tyres & Wheel Care",
  "denting-painting": "Denting & Painting",
  "detailing": "Detailing Services",
  "car-spa": "Car Spa & Cleaning",
  "inspection": "Custom Repair & Services",
};

// Use in your Services component
const categoryTitle = CATEGORY_MAP[activeCategory] || "All Services";
```

---

## Smooth Scroll to Category

When user clicks a category, scroll to that section:

```tsx
<CategoryNav 
  activeCategory={activeCategory}
  onCategoryClick={(categoryId) => {
    setActiveCategory(categoryId);
    
    // Scroll to the section with that category
    const sectionId = `category-${categoryId}`;
    const element = document.getElementById(sectionId);
    
    if (element) {
      const offset = 152; // Total navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset - 24;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }}
/>

// In your service sections:
<div id="category-car-services">
  {/* Service packages for car services */}
</div>
```

---

## Preserve Existing Sticky Behavior

If you want to keep your existing right sidebar sticky (the manufacturer selector), but also add the category bar:

```tsx
// Your existing Services.tsx structure
<div style={{ 
  display: "grid", 
  gridTemplateColumns: selectedCategory ? "minmax(0,1fr) 190px" : "minmax(0,1fr) 230px",
  gap: 20,
  paddingTop: "var(--total-navbar-height)" // ADD THIS
}}>
  {/* Left: Service packages */}
  <div>...</div>
  
  {/* Right: Manufacturer selector (keeps existing sticky behavior) */}
  <div style={{
    position: "sticky",
    top: "calc(var(--total-navbar-height) + 24px)", // UPDATE THIS
    alignSelf: "start",
  }}>
    {/* Your existing manufacturer selector UI */}
  </div>
</div>
```

**Key changes:**
1. Add `paddingTop: "var(--total-navbar-height)"` to outer container
2. Update sticky `top` to `calc(var(--total-navbar-height) + 24px)`

---

## Testing Checklist

After integration:

- [ ] Visit page, scroll down - both navbars stick correctly
- [ ] Click category - content scrolls into view (not hidden behind navbars)
- [ ] Select manufacturer - side panel updates, doesn't overlap content
- [ ] Resize window - mobile: side panel stacks below (no overlap)
- [ ] Theme toggle works - category bar background updates
- [ ] Long content - side panel scrolls independently

---

## Quick Fix for Existing Pages

If you have multiple pages that need the padding fix:

**Create a wrapper component:**

```tsx
// src/components/PageContent.tsx
export function PageContent({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ paddingTop: "var(--total-navbar-height)" }}>
      {children}
    </div>
  );
}

// Use in any page
<>
  <Navbar />
  <CategoryNav />
  <PageContent>
    {/* Your content */}
  </PageContent>
</>
```

---

## Need Help?

Common issues:
- **Content overlaps navbar**: Make sure `padding-top` is set on the content container
- **Category bar not sticking below navbar**: Check `top: var(--topbar-height)` in CategoryNav
- **Side panel overlaps content**: Use PageLayout or update your grid `gridTemplateColumns`

See full documentation in `TWO_TIER_NAVBAR_GUIDE.md`
