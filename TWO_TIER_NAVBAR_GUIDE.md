# Two-Tier Sticky Navbar System

## Overview

A complete two-tier sticky navbar implementation for Next.js (App Router) + React, similar to GoMechanic.in's layout. **No overlap issues** — properly handles sticky positioning, z-index stacking, and side panel layouts.

---

## Components

### 1. **Navbar.tsx** (Top Bar)
- **Height**: 72px (`--topbar-height`)
- **Position**: `sticky`, `top: 0`, `z-index: 1000`
- **Features**: Logo, nav links, theme toggle, auth, CTA button
- **Already exists** in your project at `src/components/Navbar.tsx`

### 2. **CategoryNav.tsx** (Category Bar) ✨ NEW
- **Height**: 80px (`--categorybar-height`)
- **Position**: `sticky`, `top: var(--topbar-height)` (sits below top bar)
- **Features**: 
  - Horizontally scrollable category icons
  - Arrow navigation buttons
  - Active category highlight with underline animation
  - Smooth scroll behavior
- **Location**: `src/components/CategoryNav.tsx`

### 3. **PageLayout.tsx** (Layout Wrapper) ✨ NEW
- **Purpose**: Handles proper spacing and two-column layout
- **Features**:
  - Adds correct `padding-top` to prevent navbar overlap
  - Two-column grid: main content + sticky side panel
  - Side panel has independent scroll
  - Fully responsive (side panel collapses on mobile)
- **Location**: `src/components/PageLayout.tsx`

---

## CSS Variables (globals.css)

Added to `:root` in `src/app/globals.css`:

```css
:root {
  /* Navbar Heights - CRITICAL for proper sticky positioning */
  --topbar-height: 72px;
  --categorybar-height: 80px;
  --total-navbar-height: calc(var(--topbar-height) + var(--categorybar-height)); /* 152px */
}
```

**Why this matters:**
- Single source of truth for heights
- `CategoryNav` uses `top: var(--topbar-height)` to sit below top bar
- `PageLayout` uses `padding-top: var(--total-navbar-height)` to prevent overlap
- If you change navbar heights, everything stays in sync

---

## Usage

### Basic Page with Category Nav + Side Panel

```tsx
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import CategoryNav from "@/components/CategoryNav";
import PageLayout from "@/components/PageLayout";

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("car-services");
  const [selectedBrand, setSelectedBrand] = useState("");

  // Side Panel Component
  const sidePanel = (
    <div>
      <h3>Select Manufacturer</h3>
      {/* Your manufacturer selector UI */}
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
        {/* Your main content here */}
        <div>
          <h1>Services for {activeCategory}</h1>
          {/* Service cards, etc. */}
        </div>
      </PageLayout>
    </>
  );
}
```

### Page WITHOUT Category Nav

```tsx
<>
  <Navbar />
  
  <PageLayout hasCategoryNav={false}>
    {/* Content gets padding-top: var(--topbar-height) only */}
    <div>Your content</div>
  </PageLayout>
</>
```

### Page WITHOUT Side Panel

```tsx
<>
  <Navbar />
  <CategoryNav activeCategory={activeCategory} onCategoryClick={setActiveCategory} />
  
  <PageLayout hasCategoryNav>
    {/* Full-width content, no side panel */}
    <div>Your content</div>
  </PageLayout>
</>
```

---

## How Overlap is Prevented

### Problem (Before)
```
┌──────────────────────┐
│  Top Navbar (fixed)  │ ← overlaps content
├──────────────────────┤
│ Category (fixed)     │ ← overlaps content
├──────────────────────┤
│ CONTENT STARTS HERE  │ ← text hidden behind navbars!
│ Some text...         │
└──────────────────────┘
```

### Solution (After)
```
┌──────────────────────┐
│  Top Navbar (sticky) │ top: 0
├──────────────────────┤
│ Category (sticky)    │ top: 72px
├──────────────────────┤
│                      │ ← 152px padding-top
│ CONTENT STARTS HERE  │ ← text visible!
│ Some text...         │
└──────────────────────┘
```

### Technical Implementation

1. **Both navbars use `position: sticky`** (not `fixed`)
   - They occupy real space in document flow
   - Category bar sticks at `top: var(--topbar-height)`

2. **CSS variables ensure synchronization**
   ```css
   --topbar-height: 72px;
   --categorybar-height: 80px;
   --total-navbar-height: calc(72px + 80px); /* 152px */
   ```

3. **PageLayout adds correct padding-top**
   ```tsx
   <div style={{
     paddingTop: hasCategoryNav 
       ? "var(--total-navbar-height)"  // 152px
       : "var(--topbar-height)"         // 72px
   }}>
   ```

4. **Z-index stacking**
   - Top navbar: `z-index: 1000`
   - Category bar: `z-index: 40`
   - Content: default (`z-index: auto`)

---

## Side Panel Implementation

### Grid Layout (Not Absolute/Fixed)

```tsx
<div style={{
  display: "grid",
  gridTemplateColumns: "1fr 280px", // main content | side panel
  gap: 24,
}}>
  <div>{children}</div>       {/* Main content */}
  <aside>{sidePanel}</aside>  {/* Side panel */}
</div>
```

### Side Panel is Sticky

```tsx
<aside style={{
  position: "sticky",
  top: "calc(var(--total-navbar-height) + 24px)", // Below navbars + spacing
  alignSelf: "start",
  maxHeight: "calc(100vh - var(--total-navbar-height) - 48px)",
  overflowY: "auto", // Independent scroll
}}>
```

**Key points:**
- Side panel sits **beside** content (not overlapping)
- Has its own scroll (`overflow-y: auto`)
- Sticks below navbars as you scroll
- On mobile: stacks below content (no overlap)

---

## Responsive Behavior

### Desktop (> 1024px)
```
┌───────────────────────────────────┐
│       Top Navbar (72px)           │
├───────────────────────────────────┤
│     Category Bar (80px)           │
├────────────────────┬──────────────┤
│                    │              │
│   Main Content     │  Side Panel  │
│   (flex: 1)        │  (280px)     │
│                    │   [sticky]   │
│                    │              │
└────────────────────┴──────────────┘
```

### Mobile (≤ 1024px)
```
┌───────────────────────────────────┐
│       Top Navbar (72px)           │
├───────────────────────────────────┤
│     Category Bar (80px)           │
│   [horizontal scroll]             │
├───────────────────────────────────┤
│                                   │
│       Main Content                │
│       (full width)                │
│                                   │
├───────────────────────────────────┤
│                                   │
│       Side Panel                  │
│       (stacks below)              │
│                                   │
└───────────────────────────────────┘
```

CSS handles this automatically:
```css
@media (max-width: 1024px) {
  .page-layout-grid {
    grid-template-columns: 1fr !important; /* Single column */
  }
  
  .page-side-panel {
    position: relative !important; /* No longer sticky */
    top: 0 !important;
    max-height: none !important;
  }
}
```

---

## Demo Page

A full working example is at:
```
src/app/services-demo/page.tsx
```

Visit: `http://localhost:3000/services-demo`

**What it demonstrates:**
- Two-tier sticky navbar
- Category selection with active state
- Side panel with brand selector
- No overlap issues when scrolling
- Responsive layout

---

## Customization

### Change Navbar Heights

1. Edit `globals.css`:
   ```css
   :root {
     --topbar-height: 80px;        /* Was 72px */
     --categorybar-height: 100px;  /* Was 80px */
   }
   ```

2. Update `Navbar.tsx` container height:
   ```tsx
   <div style={{ height: 80 }}> {/* Match --topbar-height */}
   ```

3. Everything else auto-updates via CSS variables!

### Add More Categories

Edit `CategoryNav.tsx`:
```tsx
const CATEGORIES: Category[] = [
  { id: "custom", label: "Custom Service", icon: YourIcon },
  // ... add more
];
```

### Change Side Panel Width

Edit `PageLayout.tsx`:
```tsx
gridTemplateColumns: "1fr 320px", // Was 280px
```

---

## Troubleshooting

### Content still overlaps navbar
- Check if `hasCategoryNav` prop is set correctly in `<PageLayout>`
- Verify CSS variables are loaded (inspect computed styles)
- Ensure no conflicting `padding-top` on parent elements

### Side panel not sticky
- Check `position: sticky` is not overridden
- Verify parent container doesn't have `overflow: hidden`
- Ensure `top` value accounts for navbar heights

### Category bar arrows not showing
- Check `overflow-x: auto` on scroll container
- Verify arrow buttons have correct `position: absolute`
- Ensure `showLeftArrow`/`showRightArrow` state updates on scroll

---

## Files Modified/Created

### Created:
- ✅ `src/components/CategoryNav.tsx` - Category navigation bar
- ✅ `src/components/PageLayout.tsx` - Layout wrapper with side panel support
- ✅ `src/app/services-demo/page.tsx` - Full working example

### Modified:
- ✅ `src/app/globals.css` - Added navbar height CSS variables

### Existing (no changes needed):
- `src/components/Navbar.tsx` - Top navbar (already exists)

---

## Architecture Benefits

1. **No Hardcoded Values**
   - All heights use CSS variables
   - Change once, updates everywhere

2. **Proper Document Flow**
   - Uses `sticky`, not `fixed`
   - Content doesn't need manual offset adjustments

3. **Side Panel is Layout, Not Overlay**
   - True two-column grid
   - No z-index battles
   - Responsive by default

4. **Composable**
   - Mix and match: navbar only, navbar + categories, with/without side panel
   - Each component works independently

---

## Next Steps

1. **Integrate with existing Services.tsx**
   - Wrap your services page content with `PageLayout`
   - Move manufacturer selector to side panel
   - Add `CategoryNav` if needed

2. **Add animations**
   - Category transitions (Framer Motion `AnimatePresence`)
   - Smooth scroll on category change

3. **Persist state**
   - Save active category to URL params
   - Remember selected brand in localStorage

4. **Add mobile drawer**
   - Side panel can slide in as drawer on mobile
   - Use `AnimatePresence` + touch gestures

---

## Questions?

This system is production-ready and follows GoMechanic's two-tier layout pattern. All overlap issues are explicitly handled through:
- CSS variables for heights
- Proper `padding-top` calculation
- Grid layout for side panel (not absolute positioning)
- Sticky positioning (not fixed)

Test it at: `/services-demo`
