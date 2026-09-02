"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Phone,
  Car,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Search,
  X,
  Star,
  Users
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CarSelectModal, { SelectedCar } from "./CarSelectModal";
import AuthModal from "./AuthModal";
import BrandLogo from "./core/BrandLogos";
import ManufacturerGrid from "./ManufacturerGrid";
import MaterialSymbol from "./core/MaterialSymbol";
import { CAR_BRANDS_CATALOG, getCarSegment, BoschSegmentId, BoschVehicleSegment, BOSCH_SEGMENTS } from "@/lib/vehicleGrouping";
import { buildSegmentPackages } from "@/lib/boschLabourSchedule";

// Cities list
export const CITIES = ["PATNA"];

// Sub-Navbar Tabs
export const NAV_TABS = [
  "Our Services",
  "Curated Custom Service",
  "Summer Services",
  "How Bosch Works?",
];

import { SERVICE_CATEGORIES, getCategoryByIdOrTitle, ServiceCategory } from "@/lib/servicesData";

const CURATED_SERVICES = [
  {
    title: "Batteries",
    badge: "SALE",
    iconUrl: "/battery.png",
    categoryId: "batteries",
  },
  {
    title: "Brakes",
    badge: "POPULAR",
    iconUrl: "/brakes_clean.png",
    categoryId: "car-services",
  },
  {
    title: "AC Parts",
    badge: null,
    iconUrl: "/AC.png",
    categoryId: "ac-service",
  },
  {
    title: "Bumpers",
    badge: "NEW",
    iconUrl: "/bumper.png",
    categoryId: "denting-painting",
  },
  {
    title: "Seat",
    badge: null,
    iconUrl: "/seat.png",
    categoryId: "car-spa-cleaning",
  },
  {
    title: "Side Mirrors",
    badge: null,
    iconUrl: "/sideMirror.png",
    categoryId: "windshields-lights",
  },
  {
    title: "Suspension",
    badge: "POPULAR",
    iconUrl: "/suspension.png",
    categoryId: "suspension-fitments",
  },
  {
    title: "Wheels",
    badge: null,
    iconUrl: "/wheel.png",
    categoryId: "tyres-wheel-care",
  },
  {
    title: "Lights",
    badge: "NEW",
    iconUrl: "/light.png",
    categoryId: "windshields-lights",
  },
];

const SUMMER_SERVICES = [
  {
    title: "Front Bumper Paint",
    desc: "Grade A paint booth finish for front bumper scratch & scuff removal.",
    bannerUrl: "/summer/bumper_paint.webp",
    tag: "Cooling Offer",
    categoryId: "denting-painting",
  },
  {
    title: "Rubbing & Polishing",
    desc: "High-shine Teflon paint restoration, anti-scratch sealant & swirl removal.",
    bannerUrl: "/summer/rubbing_polishing.webp",
    tag: "Popular",
    categoryId: "detailing-services",
  },
  {
    title: "Deep All Round Spa",
    desc: "Deep interior foam wash + anti-bacterial cabin sanitization & leather polish.",
    bannerUrl: "/summer/car_spa.webp",
    tag: "Summer Special",
    categoryId: "car-spa-cleaning",
  },
  {
    title: "AC Gas Top-Up & Chill Check",
    desc: "Cooling coil cleaning, AC gas refill & 100% compressor performance boost.",
    bannerUrl: "/summer/ac_topup.webp",
    tag: "Best Seller",
    categoryId: "ac-service",
  },
];

interface PackageItem {
  id: string;
  title: string;
  badge?: string;
  badgeColor?: string;
  rating?: string;
  timeTaken: string;
  warranty: string;
  recommendedInterval: string;
  note?: string;
  freePickup?: boolean;
  thumbnail: string;
  originalPrice?: number;
  basePrice: number;
  summerPrice?: number;
  summerDiscount?: string;
  isRecommended?: boolean;
  checklist: string[];
  moreCount: number;
  allDetails: string[];
}

const SCHEDULED_PACKAGES: PackageItem[] = [
  {
    id: "basic-service",
    title: "Basic Service",
    timeTaken: "4 Hrs Taken",
    warranty: "1000 Kms or 1 Month Warranty",
    recommendedInterval: "Every 5000 Kms or 3 Months (Recommended)",
    freePickup: true,
    thumbnail: "/packages/basic.jpg",
    basePrice: 3199,
    isRecommended: false,
    checklist: [
      "Wiper Fluid Replacement",
      "Battery Water Top Up",
      "Car Wash",
      "Interior Vacuuming ( Carpet & Seats )",
      "Engine Oil Replacement",
    ],
    moreCount: 4,
    allDetails: [
      "Engine Oil Replacement (Genuine Grade)",
      "Oil Filter Replacement",
      "Air Filter Cleaning",
      "Coolant Top Up (Up to 200ml)",
      "Wiper Fluid Replacement",
      "Battery Water Top Up",
      "Car Wash & Exterior Shampoo",
      "Interior Vacuuming (Carpet & Seats)",
      "40-Point General Health Inspection",
    ],
  },
  {
    id: "standard-service",
    title: "Standard Service",
    timeTaken: "6 Hrs Taken",
    warranty: "1000 Kms or 1 Month Warranty",
    recommendedInterval: "Every 10,000 Kms or 6 Months (Recommended)",
    freePickup: true,
    thumbnail: "/packages/standard.jpg",
    basePrice: 4799,
    isRecommended: true,
    checklist: [
      "Car Scanning",
      "Wiper Fluid Replacement",
      "Battery Water Top Up",
      "Car Wash",
      "Interior Vacuuming ( Carpet & Seats )",
      "Engine Oil Replacement",
      "Air Filter Cleaning",
      "Fuel Filter Inspection",
    ],
    moreCount: 10,
    allDetails: [
      "OBD-II Computerized Car Diagnostics Scanning",
      "Engine Oil Replacement (100% Synthetic)",
      "Oil Filter Replacement",
      "Air Filter Replacement",
      "Fuel Filter Inspection & Cleaning",
      "AC Filter Cleaning",
      "Spark Plugs Cleaning / Inspection",
      "Coolant Top Up",
      "Brake Fluid Top Up",
      "Wiper Fluid Replacement",
      "Battery Water Top Up",
      "Front & Rear Brake Pads Cleaning & De-dusting",
      "Foam Car Wash & Exterior Polish",
      "Deep Interior Vacuuming",
      "60-Point Inspection Report",
    ],
  },
  {
    id: "comprehensive-service",
    title: "Comprehensive Service",
    timeTaken: "8 Hrs Taken",
    warranty: "1000 Kms or 1 Month Warranty",
    recommendedInterval: "Every 20,000 Kms or 12 Months (Recommended)",
    freePickup: true,
    thumbnail: "/packages/basic.jpg",
    basePrice: 7499,
    isRecommended: false,
    checklist: [
      "AC Filter Replacement",
      "Brake Pads Cleaning",
      "Wheel Balancing & Alignment",
      "Engine Flushing",
      "Fuel Filter Replacement",
    ],
    moreCount: 14,
    allDetails: [
      "Full Synthetic Engine Oil Replacement",
      "Oil Filter + Air Filter + Cabin AC Filter Replacement",
      "Fuel Filter Replacement",
      "3D Computerized Wheel Alignment & Wheel Balancing",
      "Engine Flushing & Additive Treatment",
      "Front & Rear Brake Disc Inspection & Brake Pad Cleaning",
      "Throttle Body Cleaning",
      "Complete Suspensions & Shock Absorbers Check",
      "All Fluids Top Up (Brake Oil, Coolant, Transmission)",
      "Deep Foam Wash + Anti-Bacterial Interior Sanitization",
      "100-Point Comprehensive Inspection Report",
    ],
  },
];

// AC Service & Repair Packages Database matching GoMechanic Reference
const AC_PACKAGES: { sectionTitle: string; packages: PackageItem[] }[] = [
  {
    sectionTitle: "Service Packages",
    packages: [
      {
        id: "regular-ac-service",
        title: "Regular AC Service",
        badge: "FREE AC UNIT INSPECTION",
        badgeColor: "#10B981",
        timeTaken: "Takes 4 hours",
        warranty: "500 Kms or 1 Month Warranty",
        recommendedInterval: "Every 5,000 Kms or 3 Months (Recommended)",
        note: "In case of AC Gas Leakage - Cooling Coil / AC Unit Replacement might be required",
        thumbnail: "/images/ac-regular-service.png",
        originalPrice: 2399,
        basePrice: 1799,
        summerPrice: 1349,
        summerDiscount: "Extra 25% OFF",
        isRecommended: false,
        checklist: [
          "AC Vent Cleaning",
          "AC Inspection",
          "AC Gas (upto 400 gms)",
          "Condenser Cleaning",
          "AC Filter Cleaning",
        ],
        moreCount: 2,
        allDetails: [
          "AC Vent Anti-Bacterial Sanitization Cleaning",
          "AC High & Low Pressure Gas Check (upto 400 gms)",
          "AC Filter Cleaning & De-dusting",
          "Comprehensive 10-point AC Inspection",
          "Condenser High-Pressure Cleaning",
          "Compressor Oil Refill & Performance Diagnostics",
          "Cooling Temperature Sensor Test",
        ],
      },
      {
        id: "high-performance-ac-service",
        title: "High Performance AC Service",
        badge: "FREE AC GAS",
        badgeColor: "#10B981",
        timeTaken: "Takes 8 Hours",
        warranty: "1,000 Kms or 1 Month Warranty",
        recommendedInterval: "Every 10,000 Kms or 1 Year (Recommended)",
        note: "In case of AC Gas Leakage - Cooling Coil / AC Unit Replacement might be required",
        thumbnail: "/images/ac-high-performance.png",
        originalPrice: 4570,
        basePrice: 3199,
        summerPrice: 2699,
        summerDiscount: "Extra 25% OFF",
        isRecommended: false,
        checklist: [
          "AC Vent Cleaning",
          "AC Leak Test",
          "Dashboard Removing Refitting",
          "Dashboard Cleaning",
          "AC Gas (Upto 600gms)",
        ],
        moreCount: 4,
        allDetails: [
          "Complete Dashboard Removal & Precision Refitting",
          "Cooling Coil Deep Cleaning & Pressure Testing",
          "AC Nitrogen Leak Detection Test",
          "100% Synthetic Refrigerant Oil Replacement",
          "AC Gas Refill (Upto 600gms)",
          "AC Air Filter Replacement",
          "Condenser & Cooling Fan Deep Sanitization",
          "Dashboard Foam Wash & Leather Conditioning",
          "9-Point AC Performance Guarantee Report",
        ],
      },
    ],
  },
  {
    sectionTitle: "Pollution",
    packages: [
      {
        id: "anti-pollution-advance",
        title: "Anti-Pollution Advance",
        badge: "FREE CAR INSPECTION",
        badgeColor: "#10B981",
        timeTaken: "Takes 2–3 Hours",
        warranty: "1 Month Warranty",
        recommendedInterval: "Pickup & Drop Included",
        thumbnail: "/packages/basic.jpg",
        originalPrice: 1784,
        basePrice: 1249,
        isRecommended: false,
        checklist: [
          "AC Filter Replacement (Part Cost Included)",
          "Air Filter Cleaning",
          "Interior Vacuuming",
          "Wiper Fluid Replacement",
          "Throttle Body Cleaning (Petrol Cars)",
        ],
        moreCount: 3,
        allDetails: [
          "OEM High-Efficiency AC Cabin Filter Replacement",
          "Air Filter High-Pressure De-dusting & Cleaning",
          "Deep Interior Vacuuming & Anti-Allergen Sanitization",
          "Wiper Fluid Top Up",
          "Throttle Body Cleaning & Carbon Removal",
          "Exhaust Smoke & Carbon Emission Inspection",
          "Engine Idle Performance Adjustment",
          "Cabin Fresh Air Intake Sanitization",
        ],
      },
    ],
  },
  {
    sectionTitle: "AC Fitments",
    packages: [
      {
        id: "cooling-coil-replacement",
        title: "Cooling Coil Replacement",
        badge: "BESTSELLER",
        badgeColor: "#10B981",
        timeTaken: "Takes 8 Hours",
        warranty: "3 Months Warranty",
        recommendedInterval: "Recommended: In Case of No / Less Cooling",
        note: "Listed Part Only Included in the Price; Additional Parts are at Extra Cost • Free Pickup & Drop",
        thumbnail: "/images/ac-cooling-coil.png",
        originalPrice: 3729,
        basePrice: 2610,
        isRecommended: false,
        checklist: [
          "Cooling Coil Replacement ( OES )",
          "Prices are Estimated and Subject to Change Based on Part Availability",
          "Listed Part Only Included in the Price; Additional Parts are at Extra Cost",
          "Free Pickup & Drop",
        ],
        moreCount: 2,
        allDetails: [
          "Genuine OES Cooling Coil Evaporator Replacement",
          "Complete AC Gas Vacuuming & Fresh Gas Charge",
          "Refrigerant Expansion Valve Inspection",
          "Dashboard Fitting & Anti-Squeak Alignment",
          "Free Doorstep Pickup and Delivery",
          "3 Months Bosch Warranty Coverage",
        ],
      },
      {
        id: "condenser-replacement",
        title: "Condenser Replacement",
        badge: "FREE AC GAS TOP UP",
        badgeColor: "#10B981",
        timeTaken: "Takes 8 Hours",
        warranty: "3 Months Warranty",
        recommendedInterval: "Recommended: In Case of Condenser Leakage or Less Cooling",
        note: "Listed Part Only Included in the Price; Additional Parts are at Extra Cost • Free Pickup & Drop",
        thumbnail: "/images/ac-condenser.png",
        originalPrice: 6286,
        basePrice: 4400,
        isRecommended: false,
        checklist: [
          "Condenser Replacement (OES)",
          "Prices are Estimated and Subject to Change Based on Part Availability",
          "Listed Part Only Included in the Price; Additional Parts are at Extra Cost",
          "Free Pickup & Drop",
        ],
        moreCount: 2,
        allDetails: [
          "Genuine OES AC Condenser Unit Replacement",
          "Complementary AC Gas Top-Up (Free)",
          "High Pressure Radiator & Cooling Fan Cleaning",
          "System Nitrogen Pressure & Leak Test",
          "3 Months Bosch Warranty Coverage",
        ],
      },
      {
        id: "compressor-replacement",
        title: "AC Compressor Replacement",
        badge: "OES COMPRESSOR",
        badgeColor: "#10B981",
        timeTaken: "Takes 8 Hours",
        warranty: "3 Months Warranty",
        recommendedInterval: "Recommended: In Case of Compressor Noise / Failure",
        note: "Listed Part Only Included in the Price; Additional Parts are at Extra Cost • Free Pickup & Drop",
        thumbnail: "/images/ac-compressor.png",
        originalPrice: 14500,
        basePrice: 9999,
        isRecommended: false,
        checklist: [
          "AC Compressor Replacement (OES)",
          "Prices are Estimated and Subject to Change Based on Part Availability",
          "Listed Part Only Included in the Price; Additional Parts are at Extra Cost",
          "Free Pickup & Drop",
        ],
        moreCount: 2,
        allDetails: [
          "Genuine OES AC Compressor Replacement",
          "Complete AC Gas Charging & Oil Top-up",
          "AC System Flushing & Performance Test",
          "Free Doorstep Pickup and Delivery",
          "3 Months Bosch Warranty Coverage",
        ],
      },
      {
        id: "heater-core-replacement",
        title: "Heater Core Replacement",
        badge: "OES HEATER CORE",
        badgeColor: "#10B981",
        timeTaken: "Takes 8 Hours",
        warranty: "3 Months Warranty",
        recommendedInterval: "Recommended: In Case of Cabin Heating Failure / Coolant Leak inside Cabin",
        note: "Listed Part Only Included in the Price; Additional Parts are at Extra Cost • Free Pickup & Drop",
        thumbnail: "/images/ac-heater-core.png",
        originalPrice: 4200,
        basePrice: 2999,
        isRecommended: false,
        checklist: [
          "Heater Core Replacement (OES)",
          "Prices are Estimated and Subject to Change Based on Part Availability",
          "Listed Part Only Included in the Price; Additional Parts are at Extra Cost",
          "Free Pickup & Drop",
        ],
        moreCount: 2,
        allDetails: [
          "Genuine OES Heater Core Replacement",
          "Coolant Top-up and System Bleeding",
          "Dashboard Fitting & Anti-Squeak Inspection",
          "Free Doorstep Pickup and Delivery",
          "3 Months Bosch Warranty Coverage",
        ],
      },
    ],
  },
];

const BATTERIES_PACKAGES: { sectionTitle: string; packages: PackageItem[] }[] = [
  {
    sectionTitle: "Amaron",
    packages: [
      {
        id: "amaron-go-35-amp",
        title: "Amaron Go 35 Amp",
        timeTaken: "Takes 2 Hours",
        warranty: "60 Months Warranty",
        recommendedInterval: "Right Layout • Free of Cost Installation",
        thumbnail: "/images/amaron-go.png",
        originalPrice: 5171,
        basePrice: 3888,
        rating: "4.7",
        isRecommended: false,
        checklist: [
          "Free Pickup & Drop",
          "Free Installation",
          "Old Battery Price Included",
          "Available at Doorstep",
        ],
        moreCount: 0,
        allDetails: [
          "100% Genuine Amaron Go 35 Amp Battery",
          "Right Layout Design",
          "60 Months Warranty (30M Free + 30M Pro-Rata)",
          "Free of Cost Doorstep Installation",
          "Old Battery Price Included in the Final Price",
        ],
      },
      {
        id: "amaron-flo-35-amp",
        title: "Amaron Flo 35 Amp",
        timeTaken: "Takes 2 Hours",
        warranty: "72 Months Warranty",
        recommendedInterval: "Right Layout • Free of Cost Installation",
        thumbnail: "/images/amaron-flo.png",
        originalPrice: 5497,
        basePrice: 4133,
        rating: "4.2",
        isRecommended: false,
        checklist: [
          "Free Pickup & Drop",
          "Free Installation",
          "Old Battery Price Included",
          "Available at Doorstep",
        ],
        moreCount: 0,
        allDetails: [
          "100% Genuine Amaron Flo 35 Amp Battery",
          "Right Layout Design",
          "72 Months Warranty (36M Free + 36M Pro-Rata)",
          "Free of Cost Doorstep Installation",
          "Old Battery Price Included in the Final Price",
        ],
      },
    ],
  },
  {
    sectionTitle: "Exide",
    packages: [
      {
        id: "exide-mileage-35-amp",
        title: "Exide Mileage 35 Amp",
        timeTaken: "Takes 2 Hours",
        warranty: "72 Months Warranty",
        recommendedInterval: "Left Layout • Free of Cost Installation",
        thumbnail: "/images/exide-mileage.png",
        originalPrice: 5194,
        basePrice: 3905,
        rating: "4.4",
        isRecommended: false,
        checklist: [
          "Free Pickup & Drop",
          "Free Installation",
          "Old Battery Price Included",
          "Available at Doorstep",
        ],
        moreCount: 0,
        allDetails: [
          "100% Genuine Exide Mileage 35 Amp Battery",
          "Left Layout Design",
          "72 Months Warranty",
          "Free of Cost Doorstep Installation",
          "Old Battery Price Included in the Final Price",
        ],
      },
      {
        id: "exide-epiq-35-amp",
        title: "Exide Epiq 35 Amp",
        timeTaken: "Takes 2 Hours",
        warranty: "77 Months Warranty",
        recommendedInterval: "Left Layout • Free of Cost Installation",
        thumbnail: "/images/exide-epiq.png",
        originalPrice: 6020,
        basePrice: 4526,
        rating: "4.1",
        isRecommended: false,
        checklist: [
          "Free Pickup & Drop",
          "Free Installation",
          "Old Battery Price Included",
          "Available at Doorstep",
        ],
        moreCount: 0,
        allDetails: [
          "100% Genuine Exide Epiq 35 Amp Battery",
          "Left Layout Design",
          "77 Months Warranty",
          "Free of Cost Doorstep Installation",
          "Old Battery Price Included in the Final Price",
        ],
      },
    ],
  },
];

const TYRES_PACKAGES: { sectionTitle: string; packages: PackageItem[] }[] = [
  {
    sectionTitle: "Tyres Replacement",
    packages: [
      {
        id: "apollo-alnac-4g",
        title: "Apollo Alnac 4G (185/65 R15)",
        timeTaken: "Takes 2 Hours",
        warranty: "5 Years Warranty",
        recommendedInterval: "Free Alignment, Balancing & Fitting",
        thumbnail: "/tyres/apollo_alnac.png",
        originalPrice: 5499,
        basePrice: 4299,
        summerPrice: 3899,
        summerDiscount: "Extra 10% OFF",
        isRecommended: true,
        checklist: [
          "Tubeless Tyre Replacement",
          "Free Nitrogen Air Top-up",
          "Free Tyre Valves Included",
          "Doorstep & Workshop Fitting Available",
        ],
        moreCount: 3,
        allDetails: [
          "High Precision Steering & High Speed Stability",
          "Low Noise Tread Compound",
          "5 Years Manufacturer Warranty",
          "Free 3D Wheel Balancing with purchase",
        ],
      },
      {
        id: "ceat-securadrive",
        title: "CEAT SecuraDrive (185/65 R15)",
        timeTaken: "Takes 2 Hours",
        warranty: "5 Years Warranty",
        recommendedInterval: "Free Fitting & Wheel Balancing",
        thumbnail: "/tyres/ceat_secura_drive.png",
        originalPrice: 5199,
        basePrice: 4149,
        isRecommended: false,
        checklist: [
          "Exceptional Wet & Dry Braking",
          "Wide Longitudinal Grooves",
          "Tubeless High Durability",
          "Free Installation",
        ],
        moreCount: 2,
        allDetails: [
          "Optimized Tread Siping For Quiet Rides",
          "5-Year Unconditional Warranty Cover",
          "Premium Compound for Indian Roads",
        ],
      },
      {
        id: "mrf-ztx",
        title: "MRF ZTX (165/80 R14)",
        timeTaken: "Takes 2 Hours",
        warranty: "5 Years Warranty",
        recommendedInterval: "Long Tread Life • Free Fitting",
        thumbnail: "/tyres/mrf_ztx.png",
        originalPrice: 4699,
        basePrice: 3899,
        isRecommended: false,
        checklist: [
          "Extended Mileage Life",
          "High Puncture Resistance",
          "Tubeless Fitment",
          "Free Fitting",
        ],
        moreCount: 2,
        allDetails: [
          "Specially Engineered for High Fuel Economy",
          "5-Year Manufacturer Warranty",
        ],
      },
    ],
  },
  {
    sectionTitle: "Wheel Care",
    packages: [
      {
        id: "wheel-alignment-balancing",
        title: "3D Wheel Alignment & Balancing",
        timeTaken: "Takes 1 Hour",
        warranty: "500 Kms / 1 Month Warranty",
        recommendedInterval: "Every 5,000 Kms (Recommended)",
        thumbnail: "/wheel.png",
        originalPrice: 1499,
        basePrice: 999,
        isRecommended: true,
        checklist: [
          "3D Computerized Laser Alignment",
          "Dynamic 4-Wheel Balancing (Weights Included)",
          "Tyre Rotation",
          "Nitrogen Air Top-up",
        ],
        moreCount: 2,
        allDetails: [
          "3D Sensor Based Toe, Camber, Caster Calibration",
          "High Speed Wheel Balance Calibration",
          "Tyre Tread Depth & Pressure Inspection",
        ],
      },
    ],
  },
];

const DENTING_PACKAGES: { sectionTitle: string; packages: PackageItem[] }[] = [
  {
    sectionTitle: "Panel Painting",
    packages: [
      {
        id: "front-bumper-paint",
        title: "Front Bumper Paint",
        timeTaken: "Takes 24 Hours",
        warranty: "2 Years Color & Gloss Warranty",
        recommendedInterval: "Grade-A Dust-Free Paint Booth",
        thumbnail: "/images/front-bumper-paint.jpg",
        originalPrice: 2800,
        basePrice: 2199,
        summerPrice: 1899,
        summerDiscount: "15% OFF",
        isRecommended: true,
        checklist: [
          "Grade A Paint Booth Painting",
          "Computerized Color Matching",
          "Scratch & Dent Removal",
          "Premium Clear Coat Gloss Finish",
        ],
        moreCount: 3,
        allDetails: [
          "Precision Sanding & Primer Application",
          "OEM Spec High-Solid Clear Coat",
          "Oven Baked Finish for Long Lasting Durability",
          "2 Years Guarantee against peeling/fading",
        ],
      },
      {
        id: "rear-bumper-paint",
        title: "Rear Bumper Paint",
        timeTaken: "Takes 24 Hours",
        warranty: "2 Years Color & Gloss Warranty",
        recommendedInterval: "Grade-A Paint Booth",
        thumbnail: "/packages/rear_bumper_paint.png",
        originalPrice: 2800,
        basePrice: 2199,
        isRecommended: false,
        checklist: [
          "High Quality Nippon/DuPont Paint",
          "Dent Pulling & Smoothing",
          "Computerized Color Match",
          "Rubbing & Polishing Finish",
        ],
        moreCount: 2,
        allDetails: [
          "Full Bumper Removal & Refitting",
          "Oven Baked Chamber Paint Process",
        ],
      },
      {
        id: "bonnet-paint",
        title: "Bonnet Paint & Repair",
        timeTaken: "Takes 24 Hours",
        warranty: "2 Years Paint Warranty",
        recommendedInterval: "Dust-Free Oven Chamber",
        thumbnail: "/images/bonnet-paint.avif",
        originalPrice: 3800,
        basePrice: 2999,
        isRecommended: false,
        checklist: [
          "Stone Chip & Scratch Removal",
          "Precision Color Matching",
          "Multi-Layer Primer & Base Coat",
          "High Gloss Buffing Finish",
        ],
        moreCount: 2,
        allDetails: [
          "Engine bay protective masking",
          "High temperature heat-resistant clear coat",
        ],
      },
      {
        id: "boot-paint",
        title: "Boot Paint & Tailgate",
        timeTaken: "Takes 24 Hours",
        warranty: "2 Years Paint Warranty",
        recommendedInterval: "Dust-Free Oven Chamber",
        thumbnail: "/packages/boot_paint.png",
        originalPrice: 3400,
        basePrice: 2699,
        isRecommended: false,
        checklist: [
          "Dent Pulling & Alignment",
          "Computerized Color Matching",
          "Oven Baking & Clear Coat",
          "Mirror Gloss Polishing",
        ],
        moreCount: 2,
        allDetails: [
          "Emblem removal & refitting included",
          "2 Years paint warranty",
        ],
      },
    ],
  },
  {
    sectionTitle: "Full Body Denting & Painting",
    packages: [
      {
        id: "full-body-dent-paint",
        title: "Full Body Dent & Paint Overhaul",
        timeTaken: "Takes 5-7 Days",
        warranty: "3 Years Comprehensive Paint Warranty",
        recommendedInterval: "Complete Showroom Resto Finish",
        thumbnail: "/packages/full_body_dent_paint.png",
        originalPrice: 32000,
        basePrice: 24999,
        summerPrice: 21999,
        summerDiscount: "Summer Mega Deal",
        isRecommended: true,
        checklist: [
          "All Panels Dent Removal & Alignment",
          "Full Body Dual-Layer Clear Coat",
          "Teflon Polish & Deep Shine Buffing",
          "Interior Deep Dry Cleaning (Free Bonus)",
        ],
        moreCount: 4,
        allDetails: [
          "Complete Exterior Dismantling & Masking",
          "Anti-Rust Primer Application on all bare metal",
          "3-Coat Metallic/Pearl Base Coat Application",
          "Final High-Gloss Compound & Machine Buffing",
        ],
      },
    ],
  },
];

const DETAILING_PACKAGES: { sectionTitle: string; packages: PackageItem[] }[] = [
  {
    sectionTitle: "Ceramic Coating",
    packages: [
      {
        id: "9h-ceramic-coating",
        title: "9H Nano Ceramic Coating",
        timeTaken: "Takes 48 Hours",
        warranty: "3 Years Warranty (Includes 2 Free Top-ups)",
        recommendedInterval: "Ultimate Hydrophobic & UV Shield",
        thumbnail: "/packages/ceramic_coating_bottle.png",
        originalPrice: 19999,
        basePrice: 14999,
        summerPrice: 12999,
        summerDiscount: "Save ₹2,000 Extra",
        isRecommended: true,
        checklist: [
          "3-Stage Paint Correction & Swirl Removal",
          "9H German Nano Ceramic Coating (2 Layers)",
          "Hydrophobic Water Repellent Effect",
          "Windshield & Alloy Wheel Coating Included",
        ],
        moreCount: 3,
        allDetails: [
          "Clay Bar Decontamination & Iron Fallout Removal",
          "Machine Compounding to remove 95%+ swirl marks",
          "High Gloss Mirror Reflection & Chemical Resistance",
          "2 Free Maintenance Booster Top-ups at 12 & 24 Months",
        ],
      },
      {
        id: "meguiars-ceramic-coating",
        title: "Meguiar's Ceramic Paint Protection",
        timeTaken: "Takes 24 Hours",
        warranty: "2 Years Paint Warranty",
        recommendedInterval: "Deep Gloss & Hydrophobic Shield",
        thumbnail: "/packages/meguiars_ceramic_coating.png",
        originalPrice: 16500,
        basePrice: 12499,
        isRecommended: false,
        checklist: [
          "Meguiar's USA Ceramic Coating Formula",
          "Dual Action Paint Polishing",
          "UV & Acid Rain Protection",
          "Free Interior Foam Wash",
        ],
        moreCount: 2,
        allDetails: [
          "Deep wet-look reflection",
          "Superior water beading and self-cleaning effect",
        ],
      },
    ],
  },
  {
    sectionTitle: "Teflon & Rubbing Polishing",
    packages: [
      {
        id: "meguiars-teflon-coating",
        title: "Meguiar's Teflon Paint Sealant",
        timeTaken: "Takes 6 Hours",
        warranty: "6 Months Warranty",
        recommendedInterval: "Every 6 Months (Recommended)",
        thumbnail: "/packages/meguiars_teflon_coating.png",
        originalPrice: 6500,
        basePrice: 4999,
        isRecommended: false,
        checklist: [
          "Full Body Machine Compound Rubbing",
          "Meguiar's Synthetic Sealant Application",
          "Minor Scratch & Swirl Removal",
          "Exterior Trim & Tyre Dressing",
        ],
        moreCount: 2,
        allDetails: [
          "Restores showroom paint luster",
          "Smooth slick surface finish with synthetic wax",
        ],
      },
      {
        id: "rubbing-polishing-buffer",
        title: "Deep Machine Rubbing & Polishing",
        timeTaken: "Takes 4 Hours",
        warranty: "3 Months Gloss Guarantee",
        recommendedInterval: "Pre-Monsoon & Post-Summer",
        thumbnail: "/packages/teflon_polishing_buffer.png",
        originalPrice: 3999,
        basePrice: 2999,
        isRecommended: false,
        checklist: [
          "Rotary Buffer Paint Compounding",
          "High Gloss Finish Polish",
          "All Chrome & Glass Polishing",
          "Tyre & Plastic Trim Shine",
        ],
        moreCount: 2,
        allDetails: [
          "Removes oxidation, minor blemishes, and water spots",
          "Deep shine with premium carnauba wax seal",
        ],
      },
    ],
  },
];

const CAR_SPA_PACKAGES: { sectionTitle: string; packages: PackageItem[] }[] = [
  {
    sectionTitle: "Spa & Wash Packages",
    packages: [
      {
        id: "deep-car-spa",
        title: "Deep All-Round Car Spa",
        timeTaken: "Takes 4 Hours",
        warranty: "Anti-Bacterial Sanitized",
        recommendedInterval: "Every 3 Months (Recommended)",
        thumbnail: "/packages/car_wash_wax.png",
        originalPrice: 2199,
        basePrice: 1499,
        summerPrice: 1199,
        summerDiscount: "Summer Special",
        isRecommended: true,
        checklist: [
          "High-Pressure Underbody & Foam Wash",
          "Interior Carpet & Roof Dry Cleaning",
          "Dashboard & Door Trim Conditioning",
          "AC Vent Anti-Bacterial Sanitization",
        ],
        moreCount: 3,
        allDetails: [
          "Stain Removal from Fabric & Leather Seats",
          "Trunk / Boot Area Deep Vacuuming",
          "Engine Bay De-greasing & Protective Spray",
          "Tyre Dressing & Alloy Wheel Cleaning",
        ],
      },
      {
        id: "foam-wash-wax",
        title: "Car Foam Wash & Liquid Wax",
        timeTaken: "Takes 1.5 Hours",
        warranty: "Instant Gloss Finish",
        recommendedInterval: "Monthly",
        thumbnail: "/packages/premium_top_wash.png",
        originalPrice: 999,
        basePrice: 699,
        isRecommended: false,
        checklist: [
          "pH Neutral Snow Foam Wash",
          "High Gloss Spray Wax Seal",
          "Interior Floor Vacuuming",
          "Glass & Mirror Streak-Free Cleaning",
        ],
        moreCount: 2,
        allDetails: [
          "High pressure water rinse",
          "Microfiber dry and tyre polish",
        ],
      },
      {
        id: "interior-dry-clean",
        title: "Deep Interior Dry Cleaning",
        timeTaken: "Takes 3 Hours",
        warranty: "100% Odor Removal",
        recommendedInterval: "Every 6 Months",
        thumbnail: "/packages/car_vacuuming.png",
        originalPrice: 1699,
        basePrice: 1199,
        isRecommended: false,
        checklist: [
          "Seats Foam Scrubbing & Extraction",
          "Carpet & Floor Mats Deep Cleaning",
          "Roof Lining Gentle Cleaning",
          "Dashboard UV Protection Coating",
        ],
        moreCount: 2,
        allDetails: [
          "Removes pet hair, food spills, and mold",
          "Eco-friendly germicidal sanitization",
        ],
      },
    ],
  },
];

const INSPECTIONS_PACKAGES: { sectionTitle: string; packages: PackageItem[] }[] = [
  {
    sectionTitle: "Inspection Services",
    packages: [
      {
        id: "100-point-inspection",
        title: "Comprehensive 100-Point Inspection",
        timeTaken: "Takes 2 Hours",
        warranty: "Detailed Digital Health Report",
        recommendedInterval: "Before Long Trips / Buy-Sell",
        thumbnail: "/packages/car_inspection_diagnostics.png",
        originalPrice: 1499,
        basePrice: 999,
        isRecommended: true,
        checklist: [
          "Full Engine & Transmission Diagnostic Check",
          "Brake, Suspension & Steering Evaluation",
          "Battery & Alternator Electrical Health Test",
          "Body & Paint Accidental History Inspection",
        ],
        moreCount: 3,
        allDetails: [
          "Comprehensive Digital Scorecard with Photos",
          "Fluid Level & Leakage Inspection (10 checkpoints)",
          "Tyre Wear, Tread Depth & Alignment Status",
          "Road Test Evaluation by Bosch Master Technician",
        ],
      },
      {
        id: "second-hand-inspection",
        title: "Second Hand Car Buy Inspection",
        timeTaken: "Takes 3 Hours",
        warranty: "Accidental & Odometer Tamper Check",
        recommendedInterval: "Before purchasing any used car",
        thumbnail: "/packages/second_hand_inspection.png",
        originalPrice: 2200,
        basePrice: 1499,
        isRecommended: true,
        checklist: [
          "Odometer Tampering & Chassis Rust Check",
          "Accidental Major Impact Damage Detection",
          "Engine Compression & Smoke Diagnostics",
          "Estimated Repair & Valuation Report",
        ],
        moreCount: 2,
        allDetails: [
          "Comprehensive 120-Point Checklist",
          "ECU Scan for hidden fault codes and mileage logs",
        ],
      },
      {
        id: "ecu-scanner-diagnostics",
        title: "Bosch ECU Scanner Diagnostics",
        timeTaken: "Takes 1 Hour",
        warranty: "Bosch KTS Diagnostic Scanner",
        recommendedInterval: "When Check Engine Light appears",
        thumbnail: "/packages/ecu_scanner_inspection.png",
        originalPrice: 1200,
        basePrice: 799,
        isRecommended: false,
        checklist: [
          "OBD-II Multi-System Error Code Scan",
          "Live Sensor Data Stream Analysis",
          "Check Engine & ABS Light Reset",
          "Component Actuation Tests",
        ],
        moreCount: 2,
        allDetails: [
          "Pinpoint electrical faults without guessing",
          "Detailed printout of DTC error codes",
        ],
      },
    ],
  },
];

const WINDSHIELD_PACKAGES: { sectionTitle: string; packages: PackageItem[] }[] = [
  {
    sectionTitle: "Windshield & Glass",
    packages: [
      {
        id: "front-windshield-replacement",
        title: "Front Windshield Replacement",
        timeTaken: "Takes 4 Hours",
        warranty: "1 Year Leakage & Fitting Warranty",
        recommendedInterval: "AIS / Saint-Gobain OEM Glass",
        thumbnail: "/packages/front_windshield_replacement.png",
        originalPrice: 6999,
        basePrice: 5499,
        isRecommended: true,
        checklist: [
          "100% Genuine Laminated Safety Glass",
          "DOW / Sika Polyurethane Adhesive Fitting",
          "Cashless Insurance Claims Available",
          "Sensor & Fastag Safe Transfer",
        ],
        moreCount: 3,
        allDetails: [
          "AIS (Asahi India) / Saint-Gobain Certified OEM Glass",
          "Zero optical distortion guaranteed",
          "1 Year Warranty against water/air leakage",
        ],
      },
      {
        id: "rear-windshield-replacement",
        title: "Rear Windshield Replacement",
        timeTaken: "Takes 4 Hours",
        warranty: "1 Year Fitting Warranty",
        recommendedInterval: "Defogger Compatible",
        thumbnail: "/packages/rear_windshield_replacement.png",
        originalPrice: 5500,
        basePrice: 4299,
        isRecommended: false,
        checklist: [
          "Tempered Glass with Built-in Defogger Lines",
          "OEM Quality Sealant Fitment",
          "Fastag & Rear Wiper Assembly Transfer",
          "Free Vacuuming of broken glass",
        ],
        moreCount: 2,
        allDetails: [
          "High thermal shock resistance",
          "Cashless Insurance claim support",
        ],
      },
    ],
  },
  {
    sectionTitle: "Lights & Assemblies",
    packages: [
      {
        id: "front-headlight-assembly",
        title: "Front Headlight Assembly Replacement",
        timeTaken: "Takes 2 Hours",
        warranty: "1 Year Warranty",
        recommendedInterval: "Lumax / Minda OEM Parts",
        thumbnail: "/packages/front_headlight.png",
        originalPrice: 3800,
        basePrice: 2899,
        isRecommended: false,
        checklist: [
          "OEM High-Clarity Polycarbonate Lens",
          "Bulb & Beam Alignment Calibration",
          "Moisture-Proof Sealed Assembly",
          "Plug & Play OEM Connector",
        ],
        moreCount: 2,
        allDetails: [
          "Exact factory fitment",
          "Clear beam pattern for safe night driving",
        ],
      },
      {
        id: "rear-taillight-assembly",
        title: "Rear Taillight Assembly",
        timeTaken: "Takes 1.5 Hours",
        warranty: "1 Year Warranty",
        recommendedInterval: "OEM Fitment",
        thumbnail: "/packages/rear_taillight.png",
        originalPrice: 2600,
        basePrice: 1999,
        isRecommended: false,
        checklist: [
          "Brake, Reverse & Indicator Light Assembly",
          "Weatherproof Gasket Seal",
          "OEM Genuine Fit",
          "Free Installation",
        ],
        moreCount: 2,
        allDetails: [
          "Vibration and impact resistant housing",
        ],
      },
      {
        id: "fog-light-kit",
        title: "High Intensity Fog Light Kit",
        timeTaken: "Takes 2 Hours",
        warranty: "1 Year Warranty",
        recommendedInterval: "All Weather Fog / Rain Visibility",
        thumbnail: "/packages/fog_light.png",
        originalPrice: 2100,
        basePrice: 1499,
        isRecommended: false,
        checklist: [
          "Pair of Fog Lamp Units with Bulbs",
          "Relay & Wiring Harness Included",
          "Bumper Cutout & Clean Mount",
          "High Penetration Yellow/White Beam",
        ],
        moreCount: 2,
        allDetails: [
          "Waterproof IP67 rated fog lamps",
        ],
      },
    ],
  },
];

const SUSPENSION_PACKAGES: { sectionTitle: string; packages: PackageItem[] }[] = [
  {
    sectionTitle: "Suspension Care",
    packages: [
      {
        id: "front-shock-absorbers",
        title: "Front Shock Absorber Replacement",
        timeTaken: "Takes 4 Hours",
        warranty: "1 Year Warranty",
        recommendedInterval: "Gabriel / Monroe OEM Gas Struts",
        thumbnail: "/suspension.png",
        originalPrice: 4800,
        basePrice: 3899,
        isRecommended: true,
        checklist: [
          "Pair of Front Gas Shock Absorbers",
          "Strut Mount & Buffer Inspection",
          "Eliminates thud noises and body roll",
          "Free Wheel Alignment included",
        ],
        moreCount: 3,
        allDetails: [
          "OEM Grade Nitrogen Gas Charged Struts",
          "Smoother ride over potholes and speed breakers",
          "1 Year Manufacturer Warranty",
        ],
      },
      {
        id: "rear-shock-absorbers",
        title: "Rear Shock Absorber Replacement",
        timeTaken: "Takes 3 Hours",
        warranty: "1 Year Warranty",
        recommendedInterval: "Every 40,000 Kms",
        thumbnail: "/suspension.png",
        originalPrice: 4200,
        basePrice: 3299,
        isRecommended: false,
        checklist: [
          "Pair of Rear Gas Shocks",
          "Coil Spring & Bushing Health Check",
          "Improved high-speed stability",
          "Free Suspension Inspection",
        ],
        moreCount: 2,
        allDetails: [
          "Heavy duty damping rate for Indian road conditions",
        ],
      },
    ],
  },
  {
    sectionTitle: "Brake Services",
    packages: [
      {
        id: "front-brake-pads-bosch",
        title: "Bosch Front Brake Pads Replacement",
        timeTaken: "Takes 2 Hours",
        warranty: "10,000 Kms / 6 Months Warranty",
        recommendedInterval: "Every 15,000 Kms (Recommended)",
        thumbnail: "/brakes_clean.png",
        originalPrice: 2200,
        basePrice: 1699,
        isRecommended: true,
        checklist: [
          "100% Genuine Bosch Low-Metallic Brake Pads",
          "Brake Caliper Pin Lubrication",
          "Disc Rotor Cleaning & De-glazing",
          "Brake Fluid Level Top-up",
        ],
        moreCount: 3,
        allDetails: [
          "Superior stopping power with minimal brake dust",
          "Quiet operation with anti-squeal shims",
          "Prevents premature disc wear",
        ],
      },
      {
        id: "disc-lathe-resurfacing",
        title: "Brake Disc Rotor Lathe Resurfacing",
        timeTaken: "Takes 2 Hours",
        warranty: "Judder-Free Braking Guaranteed",
        recommendedInterval: "Eliminates steering wheel brake vibrations",
        thumbnail: "/brakes_clean.png",
        originalPrice: 1499,
        basePrice: 999,
        isRecommended: false,
        checklist: [
          "High Precision On-Car Lathe Machining",
          "Removes ridges, grooves, and warping",
          "Restores flat friction contact area",
          "Extends brake pad life",
        ],
        moreCount: 2,
        allDetails: [
          "Eliminates pedal pulsation and brake shudder",
        ],
      },
    ],
  },
];

const CLUTCH_PACKAGES: { sectionTitle: string; packages: PackageItem[] }[] = [
  {
    sectionTitle: "Clutch Overhaul",
    packages: [
      {
        id: "clutch-set-replacement",
        title: "Complete Clutch Set Replacement",
        timeTaken: "Takes 6 Hours",
        warranty: "10,000 Kms / 6 Months Warranty",
        recommendedInterval: "Valeo / Ceekay / Luk OEM Clutch",
        thumbnail: "/brakes_clean.png",
        originalPrice: 7500,
        basePrice: 5999,
        isRecommended: true,
        checklist: [
          "Clutch Plate + Pressure Plate Replacement",
          "Clutch Release Bearing Replacement",
          "Flywheel Resurfacing & Inspection",
          "Transmission Gear Oil Replacement Included",
        ],
        moreCount: 3,
        allDetails: [
          "Restores effortless, smooth gear shifting",
          "Eliminates clutch slippage and RPM surging",
          "Improves pickup and fuel economy",
        ],
      },
      {
        id: "flywheel-overhaul",
        title: "Flywheel Overhaul & Resurfacing",
        timeTaken: "Takes 4 Hours",
        warranty: "Smooth Engagement Guarantee",
        recommendedInterval: "Done during clutch overhaul",
        thumbnail: "/brakes_clean.png",
        originalPrice: 2200,
        basePrice: 1499,
        isRecommended: false,
        checklist: [
          "Surface Grinding & Trueing",
          "Ring Gear Teeth Inspection",
          "Eliminates clutch shudder on startup",
          "Balanced rotational trueing",
        ],
        moreCount: 2,
        allDetails: [
          "Ensures maximum clutch pad friction grip",
        ],
      },
    ],
  },
  {
    sectionTitle: "Body Fitments",
    packages: [
      {
        id: "side-mirror-replacement",
        title: "Side View Mirror Assembly Replacement",
        timeTaken: "Takes 1.5 Hours",
        warranty: "1 Year Fitting Warranty",
        recommendedInterval: "OEM Fitment with Indicator",
        thumbnail: "/sideMirror.png",
        originalPrice: 1800,
        basePrice: 1199,
        isRecommended: false,
        checklist: [
          "Complete Mirror Assembly (Left/Right)",
          "Electrical Motor & Indicator Wiring Fit",
          "Mirror Glass & Outer Cover Included",
          "Free Installation",
        ],
        moreCount: 2,
        allDetails: [
          "OEM motorized adjustment compatible",
        ],
      },
    ],
  },
];

const INSURANCE_PACKAGES: { sectionTitle: string; packages: PackageItem[] }[] = [
  {
    sectionTitle: "Cashless Insurance Assistance",
    packages: [
      {
        id: "cashless-accidental-claim",
        title: "Cashless Accidental Claim Settlement",
        timeTaken: "Fast 3-5 Days Turnaround",
        warranty: "All Major Insurers Supported",
        recommendedInterval: "Hassle-Free End-to-End Claim Management",
        thumbnail: "/images/book-service-promo.jpg",
        originalPrice: 1500,
        basePrice: 0,
        isRecommended: true,
        checklist: [
          "Cashless Tie-ups with ICICI, HDFC, Bajaj, Tata AIG, etc.",
          "Digital Document Submission & FIR Assistance",
          "On-site Insurance Surveyor Inspection & Approval",
          "100% Genuine Bosch Parts for all repairs",
        ],
        moreCount: 3,
        allDetails: [
          "We handle all paperwork directly with your insurance company",
          "You only pay the compulsory deductible / depreciation",
          "Free Pickup & Drop facility during claim repair",
          "Lifetime paint warranty on accidental repairs",
        ],
      },
      {
        id: "windshield-insurance-claim",
        title: "Zero-Depreciation Windshield Claim",
        timeTaken: "Same Day Approval",
        warranty: "Preserve No Claim Bonus (NCB) Assistance",
        recommendedInterval: "Cashless Glass Replacement",
        thumbnail: "/packages/front_windshield_replacement.png",
        originalPrice: 1200,
        basePrice: 0,
        isRecommended: false,
        checklist: [
          "Instant Cashless Approval for broken windshields",
          "AIS OEM Glass Replacement",
          "Fastag Safe Transfer",
          "Zero Out-of-Pocket processing fee",
        ],
        moreCount: 2,
        allDetails: [
          "Same day claim processing and fitment",
        ],
      },
    ],
  },
];

export function getCategoryPackages(
  categoryNameOrId?: string | null,
  segmentId: BoschSegmentId = "1.2"
): { sectionTitle: string; packages: PackageItem[] }[] {
  const dynamicMap = buildSegmentPackages(segmentId);
  if (!categoryNameOrId) {
    return (dynamicMap["car-services"] as unknown as { sectionTitle: string; packages: PackageItem[] }[]) || [{ sectionTitle: "Service Packages", packages: SCHEDULED_PACKAGES }];
  }
  const match = getCategoryByIdOrTitle(categoryNameOrId);
  const id = match ? match.id : categoryNameOrId.toLowerCase();

  if (dynamicMap[id]) {
    return dynamicMap[id] as unknown as { sectionTitle: string; packages: PackageItem[] }[];
  }

  switch (id) {
    case "batteries":
      return BATTERIES_PACKAGES;
    case "detailing":
      return DETAILING_PACKAGES;
    case "windshield-glass":
    case "windshields-lights":
      return WINDSHIELD_PACKAGES;
    case "insurance-claims":
      return INSURANCE_PACKAGES;
    case "car-services":
    default:
      return (dynamicMap["car-services"] as unknown as { sectionTitle: string; packages: PackageItem[] }[]) || [{ sectionTitle: "Service Packages", packages: SCHEDULED_PACKAGES }];
  }
}

const POPULAR_CAR_MODELS = [
  { name: "Swift", brand: "Maruti Suzuki", image: "/cars/swift.png", segment: "Hatchback" },
  { name: "Wagon R", brand: "Maruti Suzuki", image: "/cars/wagonr.png", segment: "Hatchback" },
  { name: "Dzire", brand: "Maruti Suzuki", image: "/cars/dzire.png", segment: "Sedan" },
  { name: "Baleno", brand: "Maruti Suzuki", image: "/cars/baleno.png", segment: "Hatchback" },
  { name: "Alto", brand: "Maruti Suzuki", image: "/cars/alto.png", segment: "Hatchback" },
  { name: "Brezza", brand: "Maruti Suzuki", image: "/cars/swift.png", segment: "SUV" },
  { name: "City", brand: "Honda", image: "/cars/dzire.png", segment: "Sedan" },
  { name: "Creta", brand: "Hyundai", image: "/cars/dzire.png", segment: "SUV" },
  { name: "Nexon", brand: "Tata", image: "/cars/baleno.png", segment: "SUV" },
  { name: "Innova", brand: "Toyota", image: "/cars/dzire.png", segment: "MUV / SUV" },
];

const HOW_BOSCH_WORKS_STEPS = [
  {
    step: "01",
    title: "Select Your Car & Service",
    desc: "Choose from 12+ expert service categories with upfront transparent pricing.",
  },
  {
    step: "02",
    title: "Free Doorstep Pick-up",
    desc: "Our service manager picks up your car at your scheduled time anywhere in the city.",
  },
  {
    step: "03",
    title: "Bosch Genuine Service",
    desc: "Service performed at authorized Bosch workshop using 100% genuine parts.",
  },
  {
    step: "04",
    title: "Safe Delivery & Warranty",
    desc: "Hassle-free payment after inspection with 1,000 km / 1 Month Warranty.",
  },
];

export interface ServicesProps {
  selectedCategory?: string | null;
  setSelectedCategory?: (cat: string | null) => void;
  isDedicatedPage?: boolean;
  onCategorySelect?: (cat: (typeof SERVICE_CATEGORIES)[0]) => void;
}

export default function Services({
  selectedCategory: selectedCategoryProp,
  setSelectedCategory: setSelectedCategoryProp,
  isDedicatedPage = false,
  onCategorySelect,
}: ServicesProps = {}) {
  const router = useRouter();
  const { user } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  // State
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCity, setSelectedCity] = useState("PATNA");
  const [selectedCar, setSelectedCar] = useState<SelectedCar | null>(null);
  const [phone, setPhone] = useState("");
  
  // Dynamic Bosch Vehicle Segment resolved from selected car
  const currentSegment = getCarSegment(selectedCar?.brand, selectedCar?.model);

  // Local fallback if props are not passed
  const [localCategory, setLocalCategory] = useState<string | null>(null);
  const selectedCategory = selectedCategoryProp !== undefined ? selectedCategoryProp : localCategory;
  const setSelectedCategory = setSelectedCategoryProp !== undefined ? setSelectedCategoryProp : setLocalCategory;

  // Modals
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Curated Custom Services Carousel State (Display 4 at a time)
  const [curatedIndex, setCuratedIndex] = useState(0);
  const maxCuratedIndex = Math.max(0, CURATED_SERVICES.length - 4);

  const nextCurated = () => {
    setCuratedIndex((prev) => (prev >= maxCuratedIndex ? 0 : prev + 1));
  };

  const prevCurated = () => {
    setCuratedIndex((prev) => (prev <= 0 ? maxCuratedIndex : prev - 1));
  };

  // Summer Services Carousel State (Display 3 at a time)
  const [summerIndex, setSummerIndex] = useState(0);
  const maxSummerIndex = Math.max(0, SUMMER_SERVICES.length - 3);

  const nextSummer = () => {
    setSummerIndex((prev) => (prev >= maxSummerIndex ? 0 : prev + 1));
  };

  const prevSummer = () => {
    setSummerIndex((prev) => (prev <= 0 ? maxSummerIndex : prev - 1));
  };

interface ViewingPackage {
  title: string;
  allDetails: string[];
  [key: string]: unknown;
}

  // Scheduled Packages & Model Selector State
  const [viewingPackage, setViewingPackage] = useState<ViewingPackage | null>(null);
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [sidebarBrand, setSidebarBrand] = useState<string>("");
  const [isPriceRecalculating, setIsPriceRecalculating] = useState(false);
  const [priceChangeKey, setPriceChangeKey] = useState(0);

  // Quick submission handler
  const handleCheckPrices = async () => {
    // 1. Phone validation
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    // 2. Car validation
    if (!selectedCar) {
      setIsCarModalOpen(true);
      return;
    }

    // 3. Trigger 0.7s circle overlay animation & save lead to Firestore
    setLoadingSubmit(true);
    setIsPriceRecalculating(true);

    try {
      await addDoc(collection(db, "bookings"), {
        userId: user?.uid || "guest_price_check",
        userName: user?.displayName || `Customer (+91 ${cleanPhone})`,
        userEmail: user?.email || "",
        name: user?.displayName || `Customer (+91 ${cleanPhone})`,
        phone: cleanPhone,
        brand: selectedCar.brand,
        model: selectedCar.model,
        vehicleSegment: currentSegment.code,
        vehicleSegmentTitle: currentSegment.title,
        service: selectedCategory || "Car Services",
        city: selectedCity,
        status: "pending",
        message: `Free Price Check Lead: ${selectedCar.brand} ${selectedCar.model} in ${selectedCity}`,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error saving lead to admin panel:", err);
    } finally {
      setLoadingSubmit(false);
    }

    // 4. Exact 0.7 second delay for sleek circle overlay load, then fade-in the updated prices
    setTimeout(() => {
      setIsPriceRecalculating(false);
      setPriceChangeKey((k) => k + 1);
      setBookingSuccess(true);
      if (!selectedCategory) {
        setSelectedCategory("Car Services");
      }
      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    }, 700);
  };

  const submitQuoteBooking = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoadingSubmit(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: user?.uid || "guest_booking",
        userName: user?.displayName || `Customer (+91 ${cleanPhone})`,
        userEmail: user?.email || "",
        name: user?.displayName || `Customer (+91 ${cleanPhone})`,
        phone: cleanPhone,
        brand: selectedCar?.brand || "General",
        model: selectedCar?.model || "Car",
        vehicleSegment: currentSegment.code,
        vehicleSegmentTitle: currentSegment.title,
        service: selectedCategory || "General Servicing",
        city: selectedCity,
        status: "pending",
        message: `Booking request for ${selectedCity}${selectedCar ? ` - ${selectedCar.brand} ${selectedCar.model}` : ""}`,
        createdAt: serverTimestamp(),
      });
      setBookingSuccess(true);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const tabsNavRef = useRef<HTMLDivElement>(null);
  const curatedScrollRef = useRef<HTMLDivElement>(null);
  const summerScrollRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsNavRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      tabsNavRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollCurated = (direction: "left" | "right") => {
    if (curatedScrollRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      curatedScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{
        background: "var(--bg)",
        position: "relative",
        paddingTop: 60,
        paddingBottom: 80,
      }}
    >
      {/* Dynamic Background Glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(226, 0, 26, 0.04) 0%, rgba(0, 102, 255, 0.04) 50%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        
        {/* 1. Sub-Navbar Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "4px 8px",
            marginBottom: 24,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            position: "relative",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            maxWidth: "100%",
          }}
        >
          <button
            onClick={() => scrollTabs("left")}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "6px 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}
          >
            <ChevronLeft size={16} />
          </button>

          <div
            ref={tabsNavRef}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              overflowX: "auto",
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              flex: 1,
              padding: "2px 4px",
            }}
          >
            {NAV_TABS.map((tab, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(idx);
                  }}
                  style={{
                    position: "relative",
                    background: isActive ? "linear-gradient(135deg, #005691 0%, #008ECF 100%)" : "transparent",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: 8,
                    fontSize: "0.78rem",
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? "#ffffff" : "var(--text-secondary)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                    boxShadow: isActive ? "0 4px 12px rgba(0, 142, 207, 0.35)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)";
                      (e.currentTarget as HTMLElement).style.color = "var(--text)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scrollTabs("right")}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "6px 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}
          >
            <ChevronRight size={16} />
          </button>
        </motion.div>

        {/* 2. Section Heading Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 28 }}
        >
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: "#008ECF",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            SERVICES FOR ALL CAR BRANDS
          </div>
          <h2
            style={{
              fontSize: "1.85rem",
              fontWeight: 800,
              color: "var(--text)",
              margin: "0 0 8px 0",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
            }}
          >
            Car Services Available In{" "}
            <span style={{ color: "#008ECF" }}>{selectedCity}</span>
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              maxWidth: 620,
              margin: 0,
              lineHeight: 1.55,
            }}
          >
            Choose from a wide assortment of car services from periodic car servicing, car care services, wheel care services, cashless Insurance claims and much more!
          </p>
        </motion.div>

        {/* 3. Dual-Column GoMechanic Layout */}
        <div
          className="gomechanic-services-layout"
        >
          {/* LEFT COLUMN: Tab-Based View */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ minWidth: 0, width: "100%" }}
          >
            {/* TAB 0: OUR SERVICES (ALL INCLUSIVE MAIN VIEW) */}
            {activeTab === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                
                {/* CATEGORY PACKAGES VIEW (when a category like AC Service & Repair or Car Services is selected) */}
                {selectedCategory ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Header bar with Back button & Car selector */}
                    <div className="category-header-wrap">
                      <div>
                        <button
                          onClick={() => {
                            if (isDedicatedPage) {
                              router.push("/#services");
                            } else {
                              setSelectedCategory(null);
                            }
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#008ECF",
                            fontWeight: 700,
                            fontSize: "0.88rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: 0,
                            marginBottom: 8,
                          }}
                        >
                          <ArrowLeft size={16} /> Back to All Categories
                        </button>
                        <h3 style={{ fontSize: "clamp(1.25rem, 3.5vw, 1.6rem)", fontWeight: 900, color: "var(--text)", margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {selectedCategory} Packages
                        </h3>
                      </div>
                      {selectedCar ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <div
                            style={{
                              background: "rgba(0, 142, 207, 0.08)",
                              border: "1px solid rgba(0, 142, 207, 0.25)",
                              borderRadius: 100,
                              padding: "6px 14px",
                              fontSize: "0.82rem",
                              fontWeight: 800,
                              color: "#008ECF",
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            🚗 {selectedCar.brand} {selectedCar.model}
                          </div>
                          <button
                            onClick={() => setIsCarModalOpen(true)}
                            style={{
                              background: "var(--card)",
                              border: "1px solid var(--border)",
                              borderRadius: 100,
                              padding: "5px 12px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: "var(--text)",
                              cursor: "pointer",
                            }}
                          >
                            Change Car
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsCarModalOpen(true)}
                          style={{
                            background: "linear-gradient(135deg, #005691 0%, #008ECF 100%)",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: 100,
                            padding: "7px 16px",
                            fontSize: "0.8rem",
                            fontWeight: 800,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            boxShadow: "0 2px 8px rgba(226,0,26,0.3)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          🚗 Select Car for Exact Quote
                        </button>
                      )}
                    </div>
                      {/* Section Groups for selected category with relative position for circle overlay */}
                    <div style={{ position: "relative" }}>
                      {/* Circular Overlay Loader for 0.7s */}
                      <AnimatePresence>
                        {isPriceRecalculating && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              position: "absolute",
                              inset: -10,
                              zIndex: 50,
                              background: "rgba(255, 255, 255, 0.78)",
                              backdropFilter: "blur(6px)",
                              borderRadius: 16,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 14,
                              minHeight: 300,
                            }}
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                border: "3.5px solid rgba(0, 142, 207, 0.15)",
                                borderTopColor: "#008ECF",
                              }}
                            />
                            <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              Updating rates for {selectedCar?.brand} {selectedCar?.model}...
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {getCategoryPackages(selectedCategory, currentSegment.id).map((sec, secIdx) => (
                        <div key={secIdx} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                          <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text)", margin: "8px 0 0 0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {sec.sectionTitle}
                          </h3>

                          {sec.packages.map((pkg) => (
                            <motion.div
                              key={`${pkg.id}-${currentSegment.id}-${priceChangeKey}`}
                              initial={{ opacity: 0.25, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.45, ease: "easeOut" }}
                              whileHover={{ y: -2 }}
                              className="package-card"
                              style={{
                                background: "var(--card)",
                                border: pkg.isRecommended ? "2px solid #10B981" : "1px solid var(--border)",
                                borderRadius: 14,
                                position: "relative",
                                boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {/* TOP BADGE (e.g., FREE AC UNIT INSPECTION, FREE AC GAS, BESTSELLER) */}
                              {pkg.badge && (
                                <span
                                  className="package-card-badge"
                                  style={{
                                    position: "absolute",
                                    top: -12,
                                    left: 20,
                                    background: "#10B981",
                                    color: "white",
                                    fontSize: "0.68rem",
                                    fontWeight: 900,
                                    padding: "3px 10px",
                                    borderRadius: 4,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
                                    zIndex: 2,
                                  }}
                                >
                                  {pkg.badge}
                                </span>
                              )}

                              {/* Package Card Main Layout */}
                              <div className="package-card-inner">
                                {/* Left Thumbnail */}
                                <div className="package-card-thumb">
                                  <img src={pkg.thumbnail} alt={pkg.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>

                                {/* Right Details */}
                                <div className="package-card-body">
                                  <div className="package-card-header">
                                    <h4 className="package-card-title">
                                      {pkg.title}
                                    </h4>
                                    <span className="package-card-time">
                                      <MaterialSymbol name="schedule" size={14} weight={600} />
                                      {pkg.timeTaken}
                                    </span>
                                  </div>

                                  <div className="package-card-specs">
                                    • {pkg.timeTaken} • {pkg.warranty} • {pkg.recommendedInterval}
                                    {pkg.note && <div style={{ marginTop: 2, color: "#777", fontSize: "0.75rem" }}>• {pkg.note}</div>}
                                  </div>

                                  {/* Green Checklist */}
                                  <div className="package-checklist">
                                    {pkg.checklist.map((item, idx) => (
                                      <div key={idx} className="package-checklist-item">
                                        <MaterialSymbol name="check_circle" size={16} color="#10B981" fill style={{ flexShrink: 0, marginTop: 1 }} />
                                        <span>{item}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Optional Rating or View All */}
                                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
                                    {pkg.rating && (
                                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ background: "#FF6B6B", color: "white", padding: "2px 8px", borderRadius: 100, fontSize: "0.75rem", fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                                          <MaterialSymbol name="star" size={12} color="white" fill /> {pkg.rating}
                                        </span>
                                        <span style={{ color: "#4285F4", fontSize: "0.85rem", fontWeight: 600 }}>Expert Rating</span>
                                      </div>
                                    )}
                                    
                                    {pkg.moreCount > 0 && (
                                      <button
                                        onClick={() => setViewingPackage(pkg as unknown as ViewingPackage)}
                                        style={{ background: "none", border: "none", color: "#0066FF", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer", padding: 0 }}
                                      >
                                        + {pkg.moreCount} more View All
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Card Bottom Bar: Price & Add To Cart Button with Faded Animation */}
                              <div className="package-card-footer">
                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={`${pkg.id}-${currentSegment.id}-${priceChangeKey}`}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    style={{ display: "flex", flexDirection: "column", gap: 3 }}
                                  >
                                    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                                      {pkg.originalPrice && (
                                        <span style={{ fontSize: "0.88rem", color: "#888", textDecoration: "line-through" }}>
                                          Rs. {pkg.originalPrice}
                                        </span>
                                      )}
                                      <span style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text)" }}>
                                        ₹ {pkg.basePrice.toLocaleString()}
                                      </span>
                                    </div>
                                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>
                                      {selectedCar
                                        ? `(Customized for ${selectedCar.brand} ${selectedCar.model})`
                                        : `(Select your car model to get exact price)`}
                                    </span>
                                  </motion.div>
                                </AnimatePresence>

                                <a
                                  href={`https://wa.me/919028384499?text=${encodeURIComponent(
                                    `Hello SAM Wheels, I want to book the "${pkg.title}" (₹${pkg.basePrice.toLocaleString()})${
                                      selectedCar
                                        ? ` for my ${selectedCar.brand} ${selectedCar.model}`
                                        : ""
                                    }.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="package-book-btn"
                                >
                                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                  </svg>
                                  <span>Book via WhatsApp</span>
                                </a>
                              </div>

                              {/* Summer Sale Special Offer Bar (Matches GoMechanic reference screenshot) */}
                              {pkg.summerPrice && (
                                <div className="package-summer-bar">
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontSize: "1.2rem" }}>☀️</span>
                                    <span style={{ fontSize: "0.86rem", color: "var(--text)", fontWeight: 700 }}>
                                      Get at <strong style={{ color: "#008ECF", fontSize: "1rem" }}>₹ {pkg.summerPrice}</strong>
                                    </span>
                                  </div>
                                  <span
                                    style={{
                                      background: "#10B981",
                                      color: "white",
                                      fontSize: "0.72rem",
                                      fontWeight: 800,
                                      padding: "3px 10px",
                                      borderRadius: 4,
                                    }}
                                  >
                                    {pkg.summerDiscount || "Extra 25% OFF"}
                                  </span>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* PRIMARY 12 CATEGORIES GRID (Compact 4-Column Layout - All 12 Visible) */
                  <div
                    className="categories-grid-container"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      minWidth: 0,
                    }}
                  >
                    {SERVICE_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.title;

                      return (
                        <Link
                          key={cat.id}
                          href={`/services/${cat.id}`}
                          prefetch={true}
                          className="category-card-item group hover:-translate-y-1 active:scale-[0.98]"
                          onClick={(e) => {
                            if (onCategorySelect) {
                              e.preventDefault();
                              onCategorySelect(cat);
                            }
                          }}
                          style={{
                            position: "relative",
                            background: isSelected 
                              ? "rgba(0, 142, 207, 0.07)" 
                              : "var(--card, #FFFFFF)",
                            border: isSelected 
                              ? "1.5px solid #008ECF" 
                              : "1px solid var(--border)",
                            boxShadow: isSelected
                              ? "0 12px 28px -6px rgba(0, 142, 207, 0.22), 0 0 0 1px #008ECF"
                              : "0 2px 10px -2px rgba(15, 23, 42, 0.05), 0 0 1px rgba(15, 23, 42, 0.08)",
                            borderRadius: 16,
                            padding: "18px 12px 14px 12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                            textAlign: "center",
                            cursor: "pointer",
                            width: "100%",
                            minHeight: 166,
                            boxSizing: "border-box",
                            margin: 0,
                            overflow: "hidden",
                            textDecoration: "none",
                            touchAction: "manipulation",
                            WebkitTapHighlightColor: "transparent",
                            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          {/* Subtle Top Ambient Glow Accent Bar */}
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: "15%",
                              right: "15%",
                              height: 2.5,
                              borderRadius: "0 0 4px 4px",
                              background: isSelected
                                ? "linear-gradient(90deg, #008ECF 0%, #00C896 100%)"
                                : "transparent",
                              transition: "all 0.25s ease",
                            }}
                            className="card-top-accent group-hover:bg-gradient-to-r group-hover:from-[#008ECF] group-hover:to-[#00C896]"
                          />

                          {/* Modern Badge with Dot */}
                          {cat.badge && (
                            <span
                              style={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                background: "#ECFDF5",
                                color: "#059669",
                                fontSize: "0.62rem",
                                fontWeight: 800,
                                padding: "2px 7px",
                                borderRadius: 9999,
                                border: "1px solid rgba(16, 185, 129, 0.25)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                letterSpacing: "0.02em",
                                textTransform: "uppercase",
                              }}
                            >
                              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#10B981" }} />
                              {cat.badge}
                            </span>
                          )}

                          {/* 70px Dedicated Icon Squircle Container */}
                          <div
                            style={{
                              width: 70,
                              height: 70,
                              borderRadius: 16,
                              background: isSelected
                                ? "rgba(0, 142, 207, 0.12)"
                                : `color-mix(in srgb, ${cat.color || "#008ECF"} 8%, transparent)`,
                              border: `1px solid color-mix(in srgb, ${cat.color || "#008ECF"} 16%, transparent)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                            }}
                            className="group-hover:scale-105 group-hover:shadow-sm"
                          >
                            <img
                              src={cat.iconUrl}
                              alt={cat.title}
                              loading="lazy"
                              decoding="async"
                              style={{
                                width: 52,
                                height: 52,
                                objectFit: "contain",
                                filter: "drop-shadow(0 3px 6px rgba(0, 0, 0, 0.08))",
                                transition: "transform 0.22s ease",
                              }}
                              className="group-hover:scale-110"
                            />
                          </div>

                          {/* Label & Micro-Action */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, width: "100%", marginTop: 8 }}>
                            <h3
                              style={{
                                fontSize: "0.88rem",
                                fontWeight: 700,
                                color: isSelected ? "#008ECF" : "var(--text)",
                                margin: 0,
                                lineHeight: 1.25,
                                letterSpacing: "-0.01em",
                                textAlign: "center",
                                maxWidth: 130,
                                wordBreak: "break-word",
                                transition: "color 0.2s ease",
                              }}
                            >
                              {cat.title}
                            </h3>
                            
                            {/* Subtle micro-hint "Explore →" that highlights on hover */}
                            <span
                              style={{
                                fontSize: "0.68rem",
                                fontWeight: 600,
                                color: isSelected ? "#008ECF" : "var(--text-muted, #94A3B8)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 2,
                                opacity: isSelected ? 1 : 0.75,
                                transition: "all 0.2s ease",
                              }}
                              className="group-hover:text-[#008ECF] group-hover:opacity-100 group-hover:translate-x-0.5"
                            >
                              Explore <span style={{ fontSize: "0.75rem", lineHeight: 1 }}>→</span>
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}



                {/* Curated Custom Services Section displaying 4 parts at a time with > navigation */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Curated Custom Services
                    </h3>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <motion.button
                        whileHover={{ scale: 1.08, background: "#008ECF", color: "#ffffff", borderColor: "#008ECF" }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => {
                          prevCurated();
                          if (curatedScrollRef.current) {
                            curatedScrollRef.current.scrollBy({ left: -180, behavior: "smooth" });
                          }
                        }}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                          transition: "all 0.2s ease",
                        }}
                        aria-label="Previous Curated Service"
                      >
                        <ChevronLeft size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.08, background: "#008ECF", color: "#ffffff", borderColor: "#008ECF" }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => {
                          nextCurated();
                          if (curatedScrollRef.current) {
                            curatedScrollRef.current.scrollBy({ left: 180, behavior: "smooth" });
                          }
                        }}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                          transition: "all 0.2s ease",
                        }}
                        aria-label="Next Curated Service"
                      >
                        <ChevronRight size={16} />
                      </motion.button>
                    </div>
                  </div>

                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    {/* Outer Viewport */}
                    <div ref={curatedScrollRef} className="curated-scroll-container" style={{ overflow: "hidden", width: "100%", borderRadius: 16, padding: "4px 0" }}>
                      <motion.div
                        animate={{ x: `calc(-${curatedIndex} * (25% + 4px))` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{
                          display: "flex",
                          gap: 14,
                          width: "100%",
                        }}
                      >
                        {CURATED_SERVICES.map((item) => (
                          <div
                            key={item.title}
                            className="curated-card-item hover:-translate-y-1 active:scale-[0.98]"
                            onClick={() => {
                              const match = getCategoryByIdOrTitle(item.title) || getCategoryByIdOrTitle(item.categoryId);
                              if (onCategorySelect && match) {
                                onCategorySelect(match);
                              } else if (match) {
                                router.push(`/services/${match.id}`);
                              } else {
                                router.push(`/services/${item.categoryId || "car-services"}`);
                              }
                            }}
                            style={{
                              flex: "0 0 calc((100% - 42px) / 4)",
                              minWidth: "calc((100% - 42px) / 4)",
                              background: "var(--card)",
                              border: "1px solid var(--border)",
                              borderRadius: 14,
                              padding: "12px 10px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              textAlign: "center",
                              cursor: "pointer",
                              position: "relative",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                              touchAction: "manipulation",
                              WebkitTapHighlightColor: "transparent",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {item.badge && (
                              <span
                                style={{
                                  position: "absolute",
                                  top: 6,
                                  right: 6,
                                  background: item.badge === "SALE" ? "#008ECF" : item.badge === "POPULAR" ? "#FF8800" : "#10B981",
                                  color: "white",
                                  fontSize: "0.55rem",
                                  fontWeight: 800,
                                  padding: "2px 5px",
                                  borderRadius: 3,
                                  textTransform: "uppercase",
                                  zIndex: 2,
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                            
                            {/* Transparent PNG Image Container */}
                            <div
                              style={{
                                width: "100%",
                                height: 90,
                                marginBottom: 8,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 4,
                              }}
                            >
                              <img
                                src={item.iconUrl}
                                alt={item.title}
                                loading="lazy"
                                decoding="async"
                                style={{
                                  maxHeight: "100%",
                                  maxWidth: "100%",
                                  objectFit: "contain",
                                  filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12))",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            </div>

                            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.2 }}>
                              {item.title}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Get Summer Ready With Bosch Section with GoMechanic Banner Style & Carousel < > */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text)", margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Get Summer Ready With Bosch
                    </h3>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <motion.button
                        whileHover={{ scale: 1.08, background: "#008ECF", color: "#ffffff", borderColor: "#008ECF" }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => {
                          prevSummer();
                          if (summerScrollRef.current) {
                            summerScrollRef.current.scrollBy({ left: -260, behavior: "smooth" });
                          }
                        }}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                          transition: "all 0.2s ease",
                        }}
                        aria-label="Previous Summer Offer"
                      >
                        <ChevronLeft size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.08, background: "#008ECF", color: "#ffffff", borderColor: "#008ECF" }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => {
                          nextSummer();
                          if (summerScrollRef.current) {
                            summerScrollRef.current.scrollBy({ left: 260, behavior: "smooth" });
                          }
                        }}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                          transition: "all 0.2s ease",
                        }}
                        aria-label="Next Summer Offer"
                      >
                        <ChevronRight size={16} />
                      </motion.button>
                    </div>
                  </div>

                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    {/* Visible Outer Container */}
                    <div ref={summerScrollRef} className="summer-scroll-container" style={{ overflow: "hidden", width: "100%", borderRadius: 16, padding: "4px 0" }}>
                      <motion.div
                        animate={{ x: `calc(-${summerIndex} * (33.333% + 5.33px))` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{
                          display: "flex",
                          gap: 14,
                          width: "100%",
                        }}
                      >
                        {SUMMER_SERVICES.map((item) => (
                          <div
                            key={item.title}
                            className="summer-card-item hover:-translate-y-1 active:scale-[0.98]"
                            onClick={() => {
                              const match = getCategoryByIdOrTitle(item.categoryId || item.title);
                              if (onCategorySelect && match) {
                                onCategorySelect(match);
                              } else if (match) {
                                router.push(`/services/${match.id}`);
                              } else {
                                router.push(`/services/${item.categoryId || "ac-service"}`);
                              }
                            }}
                            style={{
                              flex: "0 0 calc((100% - 28px) / 3)",
                              minWidth: "calc((100% - 28px) / 3)",
                              display: "flex",
                              flexDirection: "column",
                              cursor: "pointer",
                              touchAction: "manipulation",
                              WebkitTapHighlightColor: "transparent",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {/* Top Cyan Tropical Banner Card */}
                            <div
                              style={{
                                width: "100%",
                                height: 180,
                                borderRadius: 14,
                                overflow: "hidden",
                                position: "relative",
                                boxShadow: "0 6px 20px rgba(0, 196, 214, 0.2)",
                                background: "linear-gradient(135deg, #00C5D8 0%, #0099AA 100%)",
                              }}
                            >
                              {/* Graphic Banner Image */}
                              <img
                                src={item.bannerUrl}
                                alt={item.title}
                                loading="lazy"
                                decoding="async"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                            </div>

                            {/* Bottom Centered Title Label */}
                            <div
                              style={{
                                padding: "10px 4px",
                                textAlign: "center",
                              }}
                            >
                              <h4
                                style={{
                                  fontSize: "0.95rem",
                                  fontWeight: 800,
                                  color: "var(--text)",
                                  margin: 0,
                                  lineHeight: 1.25,
                                }}
                              >
                                {item.title}
                              </h4>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: CURATED CUSTOM SERVICES DEDICATED VIEW */}
            {activeTab === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ marginBottom: 4 }}>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text)", margin: "0 0 4px 0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Curated Custom Services
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                    Select genuine parts & custom repairs tailored for your car
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 16,
                    width: "100%",
                  }}
                >
                  {CURATED_SERVICES.map((item) => (
                    <div
                      key={item.title}
                      className="hover:-translate-y-1 active:scale-[0.98]"
                      onClick={() => {
                        const match = getCategoryByIdOrTitle(item.categoryId || item.title);
                        if (onCategorySelect && match) {
                          onCategorySelect(match);
                        } else if (match) {
                          router.push(`/services/${match.id}`);
                        } else {
                          router.push(`/services/${item.categoryId}`);
                        }
                      }}
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 14,
                        padding: "16px 14px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        cursor: "pointer",
                        position: "relative",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                        touchAction: "manipulation",
                        WebkitTapHighlightColor: "transparent",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {item.badge && (
                        <span
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: item.badge === "SALE" ? "#008ECF" : item.badge === "POPULAR" ? "#FF8800" : "#10B981",
                            color: "white",
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            padding: "2px 6px",
                            borderRadius: 4,
                            textTransform: "uppercase",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                      <div
                        style={{
                          width: "100%",
                          height: 90,
                          marginBottom: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={item.iconUrl}
                          alt={item.title}
                          style={{
                            maxHeight: "100%",
                            maxWidth: "100%",
                            objectFit: "contain",
                            filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12))",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.2 }}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: SUMMER SERVICES DEDICATED VIEW */}
            {activeTab === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ marginBottom: 4 }}>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text)", margin: "0 0 4px 0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Get Summer Ready With Bosch
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                    Specialized AC, cooling, and interior hygiene packages for peak summer
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 16,
                    width: "100%",
                  }}
                >
                  {SUMMER_SERVICES.map((item) => (
                    <div
                      key={item.title}
                      className="hover:-translate-y-1 active:scale-[0.98]"
                      onClick={() => {
                        const match = getCategoryByIdOrTitle(item.categoryId || item.title);
                        if (onCategorySelect && match) {
                          onCategorySelect(match);
                        } else if (match) {
                          router.push(`/services/${match.id}`);
                        } else {
                          router.push(`/services/${item.categoryId}`);
                        }
                      }}
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 14,
                        overflow: "hidden",
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                        touchAction: "manipulation",
                        WebkitTapHighlightColor: "transparent",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: 160,
                          position: "relative",
                          background: "linear-gradient(135deg, #00C5D8 0%, #0099AA 100%)",
                        }}
                      >
                        <img
                          src={item.bannerUrl}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: "#008ECF",
                            color: "white",
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            padding: "3px 8px",
                            borderRadius: 4,
                            textTransform: "uppercase",
                          }}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <div style={{ padding: "14px 16px" }}>
                        <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)", margin: "0 0 4px 0" }}>
                          {item.title}
                        </h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: HOW BOSCH WORKS DEDICATED VIEW */}
            {activeTab === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ marginBottom: 4 }}>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text)", margin: "0 0 4px 0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    How Bosch Car Service Works
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                    Hassle-free 4-step car servicing with doorstep pick-up & 1,000 km warranty
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 16,
                    width: "100%",
                  }}
                >
                  {HOW_BOSCH_WORKS_STEPS.map((step) => (
                    <div
                      key={step.step}
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 14,
                        padding: "20px 18px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: "rgba(0, 142, 207, 0.1)",
                          color: "#008ECF",
                          fontWeight: 900,
                          fontSize: "0.95rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {step.step}
                      </div>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text)", margin: 0 }}>
                        {step.title}
                      </h4>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.45 }}>
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          {/* RIGHT COLUMN: Model Selector & Quote Booking Widget */}
          <motion.div
            id="model-selector-widget"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="sticky-form-card-container"
          >
              {/* RIGHT COLUMN: Conditionally render Model Selector when category is active, or Original Quote Form on main view */}
              {selectedCategory ? (
                /* 1. Model Selector Widget (For Category Packages View - Screenshot 1) */
                <div
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 18,
                    padding: "40px 32px",
                    boxShadow: "0 16px 45px rgba(0,0,0,0.08)",
                    position: "relative",
                    width: "100%",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                  }}
                >
                  {/* Widget Header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 900,
                        color: "var(--text)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <MaterialSymbol name="directions_car" size={20} color="#008ECF" fill />
                      {selectedCar
                        ? "Selected Model"
                        : sidebarBrand
                        ? `Select ${sidebarBrand} Model`
                        : "Select Manufacturer"}
                    </h3>
                    {selectedCar ? (
                      <button
                        onClick={() => {
                          setSelectedCar(null);
                          setSidebarBrand("");
                          setModelSearchQuery("");
                        }}
                        style={{ background: "none", border: "none", color: "#008ECF", fontWeight: 800, fontSize: "0.8rem", cursor: "pointer" }}
                      >
                        Change
                      </button>
                    ) : sidebarBrand ? (
                      <button
                        onClick={() => {
                          setSidebarBrand("");
                          setModelSearchQuery("");
                        }}
                        style={{ background: "none", border: "none", color: "#008ECF", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                      >
                        ← Brands
                      </button>
                    ) : null}
                  </div>

                  {!selectedCar ? (
                    !sidebarBrand ? (
                      /* STEP 1: Select Brand / Manufacturer using prebuilt ManufacturerGrid */
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {/* Search Brands */}
                        <div style={{ position: "relative" }}>
                          <MaterialSymbol name="search" size={18} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                          <input
                            type="text"
                            placeholder="Search Brands (e.g. Maruti, Hyundai)"
                            value={modelSearchQuery}
                            onChange={(e) => setModelSearchQuery(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 38px",
                              borderRadius: 8,
                              border: "1px solid var(--border)",
                              background: "var(--bg-secondary)",
                              color: "var(--text)",
                              fontSize: "0.85rem",
                              outline: "none",
                            }}
                          />
                        </div>

                        {/* Prebuilt ManufacturerGrid Component */}
                        <div style={{ maxHeight: 380, overflowY: "auto", overflowX: "hidden", paddingRight: 4 }}>
                          <ManufacturerGrid
                            brands={CAR_BRANDS_CATALOG.map((b) => b.name)}
                            searchQuery={modelSearchQuery}
                            onSelectBrand={(b) => {
                              setSidebarBrand(b);
                              setModelSearchQuery("");
                            }}
                            className="p-0"
                          />
                        </div>
                      </div>
                    ) : (
                      /* STEP 2: Select Model for Selected Brand */
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {/* Search Models */}
                        <div style={{ position: "relative" }}>
                          <MaterialSymbol name="search" size={18} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                          <input
                            type="text"
                            placeholder={`Search ${sidebarBrand} models...`}
                            value={modelSearchQuery}
                            onChange={(e) => setModelSearchQuery(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 38px",
                              borderRadius: 8,
                              border: "1px solid var(--border)",
                              background: "var(--bg-secondary)",
                              color: "var(--text)",
                              fontSize: "0.85rem",
                              outline: "none",
                            }}
                          />
                        </div>

                        {/* Models List */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 380, overflowY: "auto", paddingRight: 4 }}>
                          {(CAR_BRANDS_CATALOG.find((b) => b.name.toLowerCase() === sidebarBrand.toLowerCase())?.models || [])
                            .filter((m) => m.name.toLowerCase().includes(modelSearchQuery.toLowerCase()))
                            .map((m) => {
                              const carSeg = getCarSegment(sidebarBrand, m.name);
                              return (
                                <button
                                  key={m.name}
                                  onClick={() => {
                                    setSelectedCar({ brand: sidebarBrand, model: m.name, segment: carSeg });
                                    setModelSearchQuery("");
                                  }}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "11px 14px",
                                    borderRadius: 10,
                                    background: "var(--bg-secondary)",
                                    border: "1px solid var(--border)",
                                    color: "var(--text)",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    transition: "all 0.15s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#008ECF";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border)";
                                  }}
                                >
                                  <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text)" }}>
                                    {m.name}
                                  </span>
                                  <span
                                    style={{
                                      background: carSeg.badgeBg,
                                      color: carSeg.badgeText,
                                      fontSize: "0.7rem",
                                      fontWeight: 800,
                                      padding: "2px 8px",
                                      borderRadius: 6,
                                    }}
                                  >
                                    {carSeg.shortLabel}
                                  </span>
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )
                  ) : (
                    /* STEP 3: Booking Form & Instant Price / Callback Request */
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div style={{ background: "rgba(0, 142, 207, 0.06)", border: "1px solid rgba(0, 142, 207, 0.22)", borderRadius: 12, padding: "14px", display: "flex", alignItems: "center", gap: 10 }}>
                        <MaterialSymbol name="check_circle" size={22} color="#008ECF" fill />
                        <div>
                          <div style={{ fontSize: "0.9rem", fontWeight: 900, color: "var(--text)" }}>{selectedCar.brand} {selectedCar.model}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                            {currentSegment.shortLabel} · Bosch Standardized Rates
                          </div>
                        </div>
                      </div>

                      <input
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={phone}
                        maxLength={10}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "var(--bg-secondary)",
                          color: "var(--text)",
                          fontSize: "0.9rem",
                          outline: "none",
                        }}
                      />

                      <motion.button
                        onClick={handleCheckPrices}
                        disabled={loadingSubmit || isPriceRecalculating}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        style={{
                          width: "100%",
                          padding: "14px",
                          borderRadius: 8,
                          background: "linear-gradient(135deg, #005691 0%, #008ECF 100%)",
                          color: "white",
                          border: "none",
                          fontWeight: 900,
                          fontSize: "0.92rem",
                          cursor: (loadingSubmit || isPriceRecalculating) ? "wait" : "pointer",
                          boxShadow: "0 4px 14px rgba(0, 142, 207, 0.35)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        {(loadingSubmit || isPriceRecalculating) ? (
                          <div style={{ color: "#ffffff", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8 }}>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                border: "2px solid rgba(255, 255, 255, 0.3)",
                                borderTopColor: "#ffffff",
                              }}
                            />
                            <span>REQUESTING CALLBACK...</span>
                          </div>
                        ) : (
                          <span style={{ color: "#ffffff", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8 }}>
                            GET A FREE CALLBACK & ENQUIRY
                            <MaterialSymbol name="arrow_forward" size={18} color="#ffffff" weight={700} />
                          </span>
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
              ) : (
                /* 2. Original Booking / Quote Widget (For Main 12 Categories View - Screenshot 2) */
                <div
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 18,
                    padding: "40px 32px",
                    boxShadow: "0 16px 45px rgba(0,0,0,0.08)",
                    position: "relative",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Header */}
                  <h3
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 800,
                      color: "var(--text)",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      margin: "0 0 6px 0",
                      lineHeight: 1.25,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Experience The Best Car Services In {selectedCity}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text-secondary)",
                      margin: "0 0 24px 0",
                      lineHeight: 1.4,
                    }}
                  >
                    Get instant quotes for your car service
                  </p>

                  {/* Success View */}
                  {bookingSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        padding: "20px 14px",
                        borderRadius: 12,
                        background: "rgba(16, 185, 129, 0.08)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: "50%",
                          background: "#10B981",
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MaterialSymbol name="check_circle" size={24} color="#ffffff" fill />
                      </div>
                      <div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text)", margin: "0 0 4px 0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Prices Updated for {selectedCar?.brand} {selectedCar?.model}!
                        </h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45, margin: 0 }}>
                          Exact Bosch Standardised rates for <strong>{selectedCity}</strong> are loaded below.
                        </p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", marginTop: 6 }}>
                        <button
                          onClick={() => {
                            document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          style={{
                            width: "100%",
                            padding: "11px 16px",
                            borderRadius: 8,
                            background: "linear-gradient(135deg, #005691 0%, #008ECF 100%)",
                            color: "#ffffff",
                            fontSize: "0.85rem",
                            fontWeight: 800,
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(0, 142, 207, 0.35)",
                          }}
                        >
                          View Custom Packages ↓
                        </button>
                        <button
                          onClick={() => {
                            setBookingSuccess(false);
                            setPhone("");
                            setSelectedCar(null);
                          }}
                          style={{
                            width: "100%",
                            padding: "9px 16px",
                            borderRadius: 8,
                            background: "var(--bg-secondary)",
                            border: "1px solid var(--border)",
                            color: "var(--text)",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Check Another Vehicle
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    /* Form Fields */
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {/* 1. City Select Dropdown */}
                      <div style={{ position: "relative" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            height: 56,
                            padding: "0 16px",
                            borderRadius: 8,
                            background: "var(--bg-secondary)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          <MaterialSymbol name="location_on" size={18} color="#008ECF" fill />
                          <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            style={{
                              width: "100%",
                              background: "none",
                              border: "none",
                              color: "var(--text)",
                              fontSize: "0.92rem",
                              fontWeight: 700,
                              outline: "none",
                              cursor: "pointer",
                              appearance: "none",
                              WebkitAppearance: "none",
                              paddingRight: 20,
                            }}
                          >
                            {CITIES.map((c) => (
                              <option key={c} value={c} style={{ background: "var(--card)", color: "var(--text)" }}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <MaterialSymbol
                            name="expand_more"
                            size={18}
                            color="var(--text-muted)"
                            style={{ position: "absolute", right: 14, pointerEvents: "none" }}
                          />
                        </div>
                      </div>

                      {/* 2. Select Your Car Trigger */}
                      <button
                        onClick={() => setIsCarModalOpen(true)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          height: 56,
                          padding: "0 16px",
                          borderRadius: 8,
                          background: selectedCar ? "rgba(0, 102, 255, 0.05)" : "var(--bg-secondary)",
                          border: selectedCar ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                          color: "var(--text)",
                          cursor: "pointer",
                          textAlign: "left",
                          width: "100%",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <MaterialSymbol name="directions_car" size={18} color="var(--accent)" fill />
                          <span style={{ fontSize: "0.92rem", fontWeight: selectedCar ? 700 : 600, color: selectedCar ? "var(--text)" : "var(--text-secondary)" }}>
                            {selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : "Select your car model"}
                          </span>
                        </div>
                        <MaterialSymbol name="expand_more" size={18} color="var(--text-muted)" />
                      </button>

                      {/* 3. Mobile Number Input */}
                      <div style={{ position: "relative" }}>
                        <MaterialSymbol name="call" size={18} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                        <input
                          type="tel"
                          placeholder="Enter 10-digit mobile number"
                          value={phone}
                          maxLength={10}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          style={{
                            width: "100%",
                            height: 56,
                            padding: "0 16px 0 44px",
                            borderRadius: 8,
                            background: "var(--bg-secondary)",
                            border: "1px solid var(--border)",
                            color: "var(--text)",
                            fontSize: "0.92rem",
                            fontWeight: 500,
                            outline: "none",
                          }}
                        />
                      </div>

                      {/* 4. Action Button */}
                      <motion.button
                        onClick={handleCheckPrices}
                        disabled={loadingSubmit || isPriceRecalculating}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        style={{
                          width: "100%",
                          height: 56,
                          padding: "0 16px",
                          borderRadius: 8,
                          background: "linear-gradient(135deg, #005691 0%, #008ECF 100%)",
                          color: "#ffffff",
                          border: "none",
                          cursor: (loadingSubmit || isPriceRecalculating) ? "wait" : "pointer",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: "0.95rem",
                          fontWeight: 800,
                          letterSpacing: "0.03em",
                          textTransform: "uppercase",
                          boxShadow: "0 6px 18px rgba(0, 142, 207, 0.38)",
                          marginTop: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          textAlign: "center",
                        }}
                      >
                        {(loadingSubmit || isPriceRecalculating) ? (
                          <div style={{ color: "#ffffff", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8 }}>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                border: "2.5px solid rgba(255, 255, 255, 0.3)",
                                borderTopColor: "#ffffff",
                              }}
                            />
                            <span>REQUESTING CALLBACK...</span>
                          </div>
                        ) : (
                          <span style={{ color: "#ffffff", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8 }}>
                            GET A FREE CALLBACK & ENQUIRY
                            <MaterialSymbol name="arrow_forward" size={18} color="#ffffff" weight={700} />
                          </span>
                        )}
                      </motion.button>
                    </div>
                  )}

                  {/* Trust Stats Footer */}
                  <div
                    style={{
                      marginTop: 24,
                      paddingTop: 20,
                      borderTop: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <MaterialSymbol name="star" size={18} color="#F59E0B" fill />
                      <div>
                        <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text)", lineHeight: 1.1 }}>4.7 / 5</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>535+ Maps Reviews</div>
                      </div>
                    </div>

                    <div style={{ height: 28, width: 1, background: "var(--border)", flexShrink: 0 }} />

                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <MaterialSymbol name="group" size={18} color="#0066FF" fill />
                      <div>
                        <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text)", lineHeight: 1.1 }}>5,000+</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>Happy Customers</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </motion.div>
        </div>
      </div>

       {/* Checklist View All Modal */}
      {viewingPackage && (
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingPackage(null)}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(6px)",
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 540,
                maxHeight: "80vh",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                padding: "24px",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text)", margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {viewingPackage.title} Full Checklist
                </h3>
                <button
                  onClick={() => setViewingPackage(null)}
                  style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingRight: 4 }}>
                {viewingPackage.allDetails.map((detail: string, idx: number) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.88rem", color: "var(--text)", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                    <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0 }} />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}

      {/* Car Select Modal */}
      <CarSelectModal
        isOpen={isCarModalOpen}
        onClose={() => setIsCarModalOpen(false)}
        onSelectCar={(car) => {
          setSelectedCar(car);
          setIsCarModalOpen(false);
        }}
        initialCar={selectedCar}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          submitQuoteBooking();
        }}
      />

    </section>
  );
}

