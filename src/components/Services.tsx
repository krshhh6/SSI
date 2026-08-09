"use client";
import { useState, useRef } from "react";
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
import { useCart } from "@/context/CartContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CarSelectModal, { SelectedCar } from "./CarSelectModal";
import AuthModal from "./AuthModal";
import BrandLogo from "./core/BrandLogos";
import ManufacturerGrid from "./ManufacturerGrid";
import ManufacturerPanel from "./ManufacturerPanel";
import CategoryGrid from "./CategoryGrid";
import QuoteSidebar from "./QuoteSidebar";

// Cities list
const CITIES = ["PATNA"];

// Sub-Navbar Tabs
const NAV_TABS = [
  "Our Services",
  "Curated Custom Service",
  "Summer Services",
  "How Bosch Works?",
];

// Service Categories matching GoMechanic reference
const SERVICE_CATEGORIES = [
  {
    id: "car-services",
    title: "Car Services",
    desc: "Periodic oil change, filter replacement & total engine health check.",
    iconUrl: "https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/category_icons_new/new_icons/car%20service%204.png",
    color: "#E2001A",
    badge: null,
  },
  {
    id: "ac-service",
    title: "AC Service & Repair",
    desc: "Gas refill, cooling coil cleaning & compressor diagnostics.",
    iconUrl: "https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/category_icons_new/new_icons/ac%20repair.svg",
    color: "#0066FF",
    badge: null,
  },
  {
    id: "batteries",
    title: "Batteries",
    desc: "Bosch heavy-duty battery replacement with doorstep installation.",
    iconUrl: "https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/category_icons_new/new_icons/14.png",
    color: "#FF8800",
    badge: null,
  },
  {
    id: "tyres-wheel",
    title: "Tyres & Wheel Care",
    desc: "3D computerized alignment, wheel balancing & tyre replacement.",
    iconUrl: "https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/category_icons_new/new_icons/6.png",
    color: "#00C896",
    badge: null,
  },
  {
    id: "denting-painting",
    title: "Denting & Painting",
    desc: "Grade A paint booth, panel repair & scratch removal.",
    iconUrl: "https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/category_icons_new/new_icons/denting1.svg",
    color: "#AA66FF",
    badge: null,
  },
  {
    id: "detailing",
    title: "Detailing Services",
    desc: "9H ceramic coating, Teflon paint protection & interior restoration.",
    iconUrl: "https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/category_icons_new/new_icons/8.png",
    color: "#FF4466",
    badge: null,
  },
  {
    id: "car-spa",
    title: "Car Spa & Cleaning",
    desc: "Deep foam wash, anti-bacterial sanitization & leather polish.",
    iconUrl: "https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/category_icons_new/new_icons/car%20spa.svg",
    color: "#00AAFF",
    badge: null,
  },
  {
    id: "car-inspections",
    title: "Car Inspections",
    desc: "Comprehensive 100-point inspection report for secondhand & overall check.",
    iconUrl: "https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/category_icons_new/new_icons/Car-Inspection.png",
    color: "#10B981",
    badge: "New",
  },
  {
    id: "windshield-glass",
    title: "Windshields & Lights",
    desc: "OEM glass replacement, wiper blade upgrades & window repairs.",
    iconUrl: "https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/category_icons_new/new_icons/10new.png",
    color: "#F59E0B",
    badge: null,
  },
  {
    id: "suspension-fitments",
    title: "Suspension & Fitments",
    desc: "Brake pad replacement, disc resurfacing & shock absorber inspection.",
    iconUrl: "https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/category_icons_new/new_icons/Suspension-_-Fitments.png",
    color: "#6366F1",
    badge: null,
  },
  {
    id: "clutch-body",
    title: "Clutch & Body Parts",
    desc: "Clutch plate replacement, flywheel overhaul & body panel fitments.",
    iconUrl: "https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/category_icons_new/new_icons/11new.png",
    color: "#E2001A",
    badge: "New",
  },
  {
    id: "insurance-claims",
    title: "Insurance Claims",
    desc: "Hassle-free cashless insurance claims with all major companies.",
    iconUrl: "https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/category_icons_new/new_icons/7.png",
    color: "#10B981",
    badge: null,
  },
];

const CURATED_SERVICES = [
  {
    title: "Batteries",
    badge: "SALE",
    iconUrl: "/battery.png",
  },
  {
    title: "Brakes",
    badge: "POPULAR",
    iconUrl: "/brakes_clean.png",
  },
  {
    title: "AC Parts",
    badge: null,
    iconUrl: "/AC.png",
  },
  {
    title: "Bumpers",
    badge: "NEW",
    iconUrl: "/bumper.png",
  },
  {
    title: "Seat",
    badge: null,
    iconUrl: "/seat.png",
  },
  {
    title: "Side Mirrors",
    badge: null,
    iconUrl: "/sideMirror.png",
  },
  {
    title: "Suspension",
    badge: "POPULAR",
    iconUrl: "/suspension.png",
  },
  {
    title: "Wheels",
    badge: null,
    iconUrl: "/wheel.png",
  },
  {
    title: "Lights",
    badge: "NEW",
    iconUrl: "/light.png",
  },
];

const SUMMER_SERVICES = [
  {
    title: "Front Bumper Paint",
    desc: "Grade A paint booth finish for front bumper scratch & scuff removal.",
    bannerUrl: "/summer/bumper_paint.png",
    tag: "Cooling Offer",
  },
  {
    title: "Rubbing & Polishing",
    desc: "High-shine Teflon paint restoration, anti-scratch sealant & swirl removal.",
    bannerUrl: "/summer/rubbing_polishing.png",
    tag: "Popular",
  },
  {
    title: "Deep All Round Spa",
    desc: "Deep interior foam wash + anti-bacterial cabin sanitization & leather polish.",
    bannerUrl: "/summer/car_spa.png",
    tag: "Summer Special",
  },
  {
    title: "AC Gas Top-Up & Chill Check",
    desc: "Cooling coil cleaning, AC gas refill & 100% compressor performance boost.",
    bannerUrl: "/summer/ac_topup.png",
    tag: "Best Seller",
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
    sectionTitle: "Apollo Tyres",
    packages: [
      {
        id: "apollo-amazer-4g",
        title: "Apollo Amazer 4G",
        badge: "RECOMMENDED",
        timeTaken: "Takes 2 Hours",
        warranty: "5 Years warranty",
        recommendedInterval: "Tubeless • Fitting Cost Included",
        thumbnail: "/tyres/apollo_amazer.png",
        originalPrice: 7599,
        basePrice: 5711,
        rating: "4.2",
        isRecommended: true,
        checklist: [
          "Size - 185/65 R15",
          "5 years warranty",
          "Tubeless",
          "Fitting Cost Included",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "Tyre Replacement at Service Center",
          "Tyres Inspection for Tread",
          "Alignment & Balancing Charges Extra",
          "Based on Tyre Patterns and Availability Pricing May Vary",
        ],
      },
      {
        id: "apollo-alnac-4g",
        title: "Apollo Alnac 4G",
        timeTaken: "Takes 2 Hours",
        warranty: "5 Years warranty",
        recommendedInterval: "Tubeless • Fitting Cost Included",
        thumbnail: "/tyres/apollo_alnac.png",
        originalPrice: 6999,
        basePrice: 5199,
        rating: "4.5",
        isRecommended: false,
        checklist: [
          "Size - 185/65 R15",
          "5 years warranty",
          "Tubeless",
          "Fitting Cost Included",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "Tyre Replacement at Service Center",
          "Tyres Inspection for Tread",
          "Alignment & Balancing Charges Extra",
          "Based on Tyre Patterns and Availability Pricing May Vary",
        ],
      },
    ],
  },
  {
    sectionTitle: "MRF Tyres",
    packages: [
      {
        id: "mrf-ztx",
        title: "Mrf ZTX",
        badge: "RECOMMENDED",
        timeTaken: "Takes 2 Hours",
        warranty: "5 Years warranty",
        recommendedInterval: "Tubeless • Fitting Cost Included",
        thumbnail: "/tyres/mrf_ztx.png",
        originalPrice: 9800,
        basePrice: 7999,
        rating: "4.5",
        isRecommended: true,
        checklist: [
          "Size - 185/65 R15",
          "5 years warranty",
          "Tubeless",
          "Fitting Cost Included",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "Tyre Replacement at Service Center",
          "Tyres Inspection for Tread",
          "Alignment & Balancing Charges Extra",
          "Based on Tyre Patterns and Availability Pricing May Vary",
        ],
      },
      {
        id: "mrf-ecotred",
        title: "Mrf Ecotred",
        timeTaken: "Takes 2 Hours",
        warranty: "5 Years warranty",
        recommendedInterval: "Tubeless • Fitting Cost Included",
        thumbnail: "/tyres/mrf_tyre.png",
        originalPrice: 11200,
        basePrice: 9197,
        rating: "4.3",
        isRecommended: false,
        checklist: [
          "Free Pickup & Drop",
          "Tyre Replacement at Service Center",
          "Tyres Inspection for Tread",
          "Alignment & Balancing Charges Extra",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "Tyre Replacement at Service Center",
          "Tyres Inspection for Tread",
          "Alignment & Balancing Charges Extra",
          "Based on Tyre Patterns and Availability Pricing May Vary",
        ],
      },
      {
        id: "mrf-perfinza",
        title: "Mrf Perfinza",
        timeTaken: "Takes 2 Hours",
        warranty: "5 Years warranty",
        recommendedInterval: "Tubeless • Fitting Cost Included",
        thumbnail: "/tyres/mrf_tyre.png",
        originalPrice: 12800,
        basePrice: 10184,
        rating: "4.4",
        isRecommended: false,
        checklist: [
          "Free Pickup & Drop",
          "Tyre Replacement at Service Center",
          "Tyres Inspection for Tread",
          "Alignment & Balancing Charges Extra",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "Tyre Replacement at Service Center",
          "Tyres Inspection for Tread",
          "Alignment & Balancing Charges Extra",
          "Based on Tyre Patterns and Availability Pricing May Vary",
        ],
      },
    ],
  },
  {
    sectionTitle: "CEAT Tyres",
    packages: [
      {
        id: "ceat-secura-drive",
        title: "Ceat Secura Drive",
        badge: "POPULAR",
        timeTaken: "Takes 2 Hours",
        warranty: "5 Years warranty",
        recommendedInterval: "Tubeless • Fitting Cost Included",
        thumbnail: "/tyres/ceat_secura_drive.png",
        originalPrice: 8499,
        basePrice: 6499,
        rating: "4.6",
        isRecommended: false,
        checklist: [
          "Size - 185/65 R15",
          "5 years warranty",
          "Tubeless",
          "Fitting Cost Included",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "Tyre Replacement at Service Center",
          "Tyres Inspection for Tread",
          "Alignment & Balancing Charges Extra",
          "Based on Tyre Patterns and Availability Pricing May Vary",
        ],
      },
      {
        id: "ceat-gripp-ln-tl",
        title: "Ceat Gripp LN TL",
        timeTaken: "Takes 2 Hours",
        warranty: "5 Years warranty",
        recommendedInterval: "Tubeless • Fitting Cost Included",
        thumbnail: "/tyres/ceat_gripp_ln.png",
        originalPrice: 7999,
        basePrice: 5999,
        rating: "4.4",
        isRecommended: false,
        checklist: [
          "Size - 185/65 R15",
          "5 years warranty",
          "Tubeless",
          "Fitting Cost Included",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "Tyre Replacement at Service Center",
          "Tyres Inspection for Tread",
          "Alignment & Balancing Charges Extra",
          "Based on Tyre Patterns and Availability Pricing May Vary",
        ],
      },
    ],
  },
];

const DENTING_PAINTING_PACKAGES: { sectionTitle: string; packages: PackageItem[] }[] = [
  {
    sectionTitle: "Front Side",
    packages: [
      {
        id: "front-bumper-paint",
        title: "Front Bumper Paint",
        badge: "2 YEAR WARRANTY",
        timeTaken: "Takes 24 Hours",
        warranty: "2 Years Warranty on Paint",
        recommendedInterval: "100% Colour Match",
        thumbnail: "/F1.webp",
        originalPrice: 3271,
        basePrice: 2944,
        rating: "4.6",
        isRecommended: false,
        checklist: [
          "Removal of Minor Dent & Scratches",
          "Grade A Primer Applied",
          "High Quality DuPont Paint",
          "Clear Coat Protective Layer Paint",
          "Panel Rubbing & Polishing",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "Takes 24 Hours",
          "2 Years Warranty on Paint",
          "100% Colour Match",
          "Grade A Primer Applied",
          "High Quality DuPont Paint",
          "Clear Coat Protective Layer Paint",
          "Panel Rubbing & Polishing",
        ],
      },
      {
        id: "bonnet-paint",
        title: "Bonnet Paint",
        badge: "2 YEAR WARRANTY",
        timeTaken: "Takes 24 Hours",
        warranty: "2 Years Warranty on Paint",
        recommendedInterval: "100% Colour Match",
        thumbnail: "/F2.webp",
        originalPrice: 3271,
        basePrice: 2944,
        rating: "4.5",
        isRecommended: false,
        checklist: [
          "Removal of Minor Dent & Scratches",
          "Grade A Primer Applied",
          "High Quality DuPont Paint",
          "Clear Coat Protective Layer Paint",
          "Panel Rubbing & Polishing",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "Takes 24 Hours",
          "2 Years Warranty on Paint",
          "100% Colour Match",
          "Grade A Primer Applied",
          "High Quality DuPont Paint",
          "Clear Coat Protective Layer Paint",
          "Panel Rubbing & Polishing",
        ],
      },
    ],
  },
  {
    sectionTitle: "Rear Side",
    packages: [
      {
        id: "rear-bumper-paint",
        title: "Rear Bumper Paint",
        timeTaken: "Takes 24 Hours",
        warranty: "2 Years Warranty on Paint",
        recommendedInterval: "100% Colour Match",
        thumbnail: "/packages/rear_bumper_paint.png",
        originalPrice: 3271,
        basePrice: 2944,
        rating: "4.7",
        isRecommended: true,
        checklist: [
          "Removal of Minor Dent & Scratches",
          "Grade A Primer Applied",
          "High Quality DuPont Paint",
          "Clear Coat Protective Layer Paint",
          "Panel Rubbing & Polishing",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "Takes 24 Hours",
          "2 Years Warranty on Paint",
          "100% Colour Match",
          "Grade A Primer Applied",
          "High Quality DuPont Paint",
          "Clear Coat Protective Layer Paint",
          "Panel Rubbing & Polishing",
        ],
      },
      {
        id: "boot-paint",
        title: "Boot Paint",
        timeTaken: "Takes 24 Hours",
        warranty: "2 Years Warranty on Paint",
        recommendedInterval: "100% Colour Match",
        thumbnail: "/packages/boot_paint.png",
        originalPrice: 3271,
        basePrice: 2944,
        rating: "4.6",
        isRecommended: false,
        checklist: [
          "Removal of Minor Dent & Scratches",
          "Grade A Primer Applied",
          "High Quality DuPont Paint",
          "Clear Coat Protective Layer Paint",
          "Panel Rubbing & Polishing",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "Takes 24 Hours",
          "2 Years Warranty on Paint",
          "100% Colour Match",
          "Grade A Primer Applied",
          "High Quality DuPont Paint",
          "Clear Coat Protective Layer Paint",
          "Panel Rubbing & Polishing",
        ],
      },
    ],
  },
  {
    sectionTitle: "Whole Body",
    packages: [
      {
        id: "full-body-dent-paint",
        title: "Full Body Dent Paint",
        badge: "FREE DEEP ALL ROUND CLEANING",
        timeTaken: "Takes 8 Days",
        warranty: "2 Years Warranty on Paint",
        recommendedInterval: "100% Colour Match",
        thumbnail: "/packages/full_body_dent_paint.png",
        originalPrice: 28000,
        basePrice: 21999,
        rating: "4.9",
        isRecommended: true,
        checklist: [
          "Removal of Minor Dent & Scratches",
          "Grade A Primer Applied",
          "High Quality DuPont Paint",
          "Clear Coat Protective Layer Paint",
          "Panel Rubbing & Polishing",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "Takes 8 Days",
          "2 Years Warranty on Paint",
          "100% Colour Match",
          "Grade A Primer Applied",
          "High Quality DuPont Paint",
          "Clear Coat Protective Layer Paint",
          "Panel Rubbing & Polishing",
          "Free Deep All Round Cleaning Included",
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
        id: "meguiars-ceramic-coating",
        title: "Meguiar's Ceramic Coating",
        badge: "FREE INTERIOR SPA",
        timeTaken: "Takes 3 Days",
        warranty: "1 Year Warranty",
        recommendedInterval: "Every 3 Years (Recommended)",
        thumbnail: "/packages/meguiars_ceramic_coating.png",
        originalPrice: 25000,
        basePrice: 17999,
        rating: "4.9",
        isRecommended: true,
        checklist: [
          "Complete Paint Correction",
          "2 Layers of Coating",
          "Removes Minor Scratches",
          "Deep All Round Spa",
          "Exterior Car Wash",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "Complete Paint Correction & Polishing",
          "2 Layers of Premium Meguiar's Ceramic Coating",
          "Removes Minor Scratches & Swirl Marks",
          "Free Deep All-Round Interior Spa Included",
          "Exterior High Pressure Car Wash",
        ],
      },
      {
        id: "9h-ceramic-coating",
        title: "9H Nano Ceramic Coating",
        badge: "3 YEAR WARRANTY",
        timeTaken: "Takes 24 Hours",
        warranty: "3 Years Warranty with annual maintenance",
        recommendedInterval: "9H Hardness Protection Layer",
        thumbnail: "/packages/ceramic_coating_bottle.png",
        originalPrice: 22000,
        basePrice: 15499,
        rating: "4.8",
        isRecommended: false,
        checklist: [
          "3-step paint correction & polishing",
          "Degreasing & surface preparation",
          "Double layer 9H Nano-ceramic coat",
          "Alloy wheel & windshield coating",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "Ultra hydrophobic coating",
          "Protects against bird droppings, acid rain, and scratches",
          "Extremely deep mirror shine",
        ],
      },
    ],
  },
  {
    sectionTitle: "Teflon Coating",
    packages: [
      {
        id: "meguiars-teflon-coating",
        title: "Meguiar's Teflon Coating",
        badge: "POPULAR",
        timeTaken: "Takes 24 Hours",
        warranty: "3 Months Warranty",
        recommendedInterval: "Every 1 Year (Recommended)",
        thumbnail: "/packages/meguiars_teflon_coating.png",
        originalPrice: 5500,
        basePrice: 3999,
        rating: "4.7",
        isRecommended: true,
        checklist: [
          "Pre-Coating Rubbing and Polishing",
          "Ultra Shine Polishing",
          "Removes Minor Scratches",
          "Exterior Car Wash",
          "Full Body Meguiar's Teflon Coating",
          "Meguiar's Exterior Anti-Rust Treatment",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "Pre-Coating Rubbing and Polishing",
          "Ultra Shine Polishing Treatment",
          "Removes Minor Scratches & Swirl Marks",
          "Full Body Meguiar's Teflon Coating Layer",
          "Meguiar's Exterior Anti-Rust Protection",
        ],
      },
      {
        id: "teflon-coating-buffer",
        title: "Teflon Paint Protection",
        badge: "1 YEAR WARRANTY",
        timeTaken: "Takes 6 Hours",
        warranty: "1 Year Warranty",
        recommendedInterval: "Protects against minor scratches & UV rays",
        thumbnail: "/packages/teflon_polishing_buffer.png",
        originalPrice: 4800,
        basePrice: 3299,
        rating: "4.5",
        isRecommended: false,
        checklist: [
          "Car Washing & Clay Bar Treatment",
          "Machine Rubbing to remove swirls",
          "Dual layer Teflon sealant application",
          "Tyre dressing & dashboard polish",
        ],
        moreCount: 0,
        allDetails: [
          "Free Pickup & Drop",
          "High-gloss mirror finish",
          "Hydrophobic effect (water repelling)",
          "Prevents paint fading",
        ],
      },
    ],
  },
];

const CAR_SPA_PACKAGES: { sectionTitle: string; packages: PackageItem[] }[] = [
  {
    sectionTitle: "Washing & Cleaning Packages",
    packages: [
      {
        id: "premium-top-wash",
        title: "Premium Top Wash",
        badge: "1 HOUR QUICK WASH",
        timeTaken: "Revitalize Your Ride In Just 1 Hour",
        warranty: "Applicable on Walk-In Only",
        recommendedInterval: "Preserving Paint & Finish • Eliminate Dust, Bird Droppings & Tree Sap",
        thumbnail: "/packages/premium_top_wash.png",
        originalPrice: 999,
        basePrice: 499,
        rating: "4.7",
        isRecommended: false,
        checklist: [
          "Exterior Top Wash",
          "Rinsing",
          "Hand Drying",
          "Tyre external wash",
        ],
        moreCount: 0,
        allDetails: [
          "High Pressure Exterior Top Wash",
          "Complete Water Rinsing & Shampoo Foam",
          "Microfiber Hand Drying",
          "Tyre External Pressure Cleaning",
          "Preserving Original Factory Paint & Gloss Finish",
        ],
      },
      {
        id: "car-wash-and-wax",
        title: "Car Wash & Wax",
        badge: "POPULAR",
        timeTaken: "Takes 3 Hours",
        warranty: "Maintains Car Shine",
        recommendedInterval: "Recommended Every 2 Months",
        thumbnail: "/packages/car_wash_wax.png",
        originalPrice: 1999,
        basePrice: 1299,
        rating: "4.8",
        isRecommended: true,
        checklist: [
          "Car Wash",
          "Interior Vacuuming",
          "Dashboard and Tyre Polish",
          "Body Wax",
        ],
        moreCount: 0,
        allDetails: [
          "Complete Pressure Car Wash",
          "Deep Interior Cabin & Trunk Vacuuming",
          "Dashboard, Console & Tyre Polish",
          "Premium High-Gloss Body Wax Application",
        ],
      },
      {
        id: "deep-interior-spa",
        title: "Deep Interior Spa & Vacuuming",
        badge: "DEEP CLEANING",
        timeTaken: "Takes 4 Hours",
        warranty: "100% Germ & Stain Free Guarantee",
        recommendedInterval: "Deep Seat & Carpet Shampooing",
        thumbnail: "/packages/car_vacuuming.png",
        originalPrice: 2499,
        basePrice: 1599,
        rating: "4.9",
        isRecommended: true,
        checklist: [
          "Deep Interior Vacuuming",
          "Seat Upholstery Shampoo",
          "Dashboard & Console Polishing",
          "AC Vent Sanitization",
        ],
        moreCount: 0,
        allDetails: [
          "Complete Carpet, Roof & Trunk Vacuuming",
          "Fabric / Leather Seat Upholstery Deep Shampooing",
          "Dashboard, Door Trims & Armrest Polishing",
          "Steam AC Vent Sanitization & Germ Removal",
        ],
      },
      {
        id: "windshield-foam-wash",
        title: "Windshield & Glass Foam Wash",
        timeTaken: "Takes 1 Hour",
        warranty: "Crystal Clear Vision",
        recommendedInterval: "Water Repellent & Anti-Fog Treatment",
        thumbnail: "/packages/windshield_spray.png",
        originalPrice: 1299,
        basePrice: 799,
        rating: "4.6",
        isRecommended: false,
        checklist: [
          "Windshield Pressure Foam Wash",
          "Anti-Fog Glass Polish",
          "Wiper Blade Cleaning",
          "Water Repellent Treatment",
        ],
        moreCount: 0,
        allDetails: [
          "Front & Rear Windshield High-Pressure Foam Wash",
          "Hydrophobic Water Repellent Glass Coating",
          "Anti-Fog Internal Glass Cleaning",
          "Wiper Blade Cleaning & Inspection",
        ],
      },
    ],
  },
];

const CAR_INSPECTION_PACKAGES: { sectionTitle: string; packages: PackageItem[] }[] = [
  {
    sectionTitle: "Used Car",
    packages: [
      {
        id: "second-hand-car-inspection",
        title: "Second Hand Car Inspection",
        badge: "GET 10% OFF ON PERIODIC SERVICE",
        timeTaken: "Takes 4 hours",
        warranty: "Available at Doorstep",
        recommendedInterval: "Scanner Report Provided • Get Car Valuation",
        thumbnail: "/packages/second_hand_inspection.png",
        originalPrice: 2499,
        basePrice: 1799,
        rating: "4.8",
        isRecommended: true,
        checklist: [
          "50 Points Check-List",
          "Physical Car Diagnosis",
          "Get Car Valuation",
          "Full Car Scanning",
          "Upfront Estimate",
        ],
        moreCount: 0,
        allDetails: [
          "50 Points Comprehensive Check-List Inspection",
          "Physical Exterior, Interior & Mechanical Car Diagnosis",
          "Complete ECU & OBD Diagnostic Scanner Report",
          "Accredited Used Car Market Valuation Certificate",
          "Upfront Transparent Repair Estimate Report",
        ],
      },
    ],
  },
  {
    sectionTitle: "Inspections",
    packages: [
      {
        id: "car-inspection-diagnostics",
        title: "Car Inspection / Diagnostics",
        timeTaken: "Takes 4 hours",
        warranty: "25 Points Checklist",
        recommendedInterval: "Every 1 Month (Recommended)",
        thumbnail: "/packages/car_inspection_diagnostics.png",
        originalPrice: 1499,
        basePrice: 999,
        rating: "4.7",
        isRecommended: false,
        checklist: [
          "Underbody Inspection",
          "Upfront Estimate",
          "25 Points Checklist",
        ],
        moreCount: 0,
        allDetails: [
          "Complete Underbody & Chassis Inspection",
          "25-Point Vital Vehicle Components Check",
          "Engine Fluid, Brake & Suspension Diagnostic",
          "Upfront Transparent Repair Estimate Report",
        ],
      },
      {
        id: "engine-comprehensive-inspection",
        title: "Engine & Mechanical Inspection",
        timeTaken: "Takes 3 hours",
        warranty: "30 Points Checklist",
        recommendedInterval: "Recommended: Engine Noise or Performance Drop",
        thumbnail: "/packages/engine_underhood_inspection.png",
        originalPrice: 1999,
        basePrice: 1299,
        rating: "4.6",
        isRecommended: false,
        checklist: [
          "Engine Compression Test",
          "Underhood Inspection",
          "Leakage & Belt Check",
          "Upfront Estimate",
        ],
        moreCount: 0,
        allDetails: [
          "Complete Engine Bay & Underhood Component Check",
          "Coolant, Oil & Transmission Fluid Leakage Inspection",
          "Belts, Pulleys & Engine Mountings Inspection",
          "Exhaust & Emissions System Diagnostic",
        ],
      },
      {
        id: "ecu-obd-scanning",
        title: "ECU / OBD Diagnostic Scanning",
        timeTaken: "Takes 2 hours",
        warranty: "Full Digital Report",
        recommendedInterval: "Recommended: Check Engine Light On",
        thumbnail: "/packages/ecu_scanner_inspection.png",
        originalPrice: 1299,
        basePrice: 799,
        rating: "4.9",
        isRecommended: false,
        checklist: [
          "Computerized OBD-II Scan",
          "Fault Code Clearance",
          "Sensor Health Diagnostics",
          "Digital Health Report",
        ],
        moreCount: 0,
        allDetails: [
          "Advanced Bosch OBD-II Computer Scanner Diagnostic",
          "Check Engine Light & Error Code Reading",
          "Sensor, ECU & Transmission Diagnostic Scan",
          "Instant Printable Digital Diagnostics Report",
        ],
      },
    ],
  },
];

const WINDSHIELD_PACKAGES: { sectionTitle: string; packages: PackageItem[] }[] = [
  {
    sectionTitle: "Windshields",
    packages: [
      {
        id: "front-windshield-replacement",
        title: "Front Windshield Replacement",
        badge: "LABOUR INCLUDED",
        timeTaken: "Takes 6 Hours",
        warranty: "1 Month Warranty on Fitting",
        recommendedInterval: "On Crack In Windshield (Recommended)",
        thumbnail: "/packages/front_windshield_replacement.png",
        originalPrice: 6499,
        basePrice: 4299,
        rating: "4.8",
        isRecommended: true,
        checklist: [
          "Windshield (ISI Approved)",
          "Opening & Fitting of New Windshield",
          "Sensor Charges Additional (If Applicable)",
          "Consumables - Sealant/Bond/Adhesive",
          "Free Pickup & Drop",
        ],
        moreCount: 0,
        allDetails: [
          "AIS / ISI Approved OEM Quality Front Glass",
          "Opening & Precision Fitting of New Windshield",
          "High-Bond Polyurethane Adhesive / Sealant Consumables",
          "Sensor & Rain Sensor Charges Additional (If Applicable)",
          "Free Doorstep Pickup & Drop Included",
        ],
      },
      {
        id: "rear-windshield-replacement",
        title: "Rear Windshield Replacement",
        badge: "LABOUR INCLUDED",
        timeTaken: "Takes 6 Hours",
        warranty: "1 Month Warranty on Fitting",
        recommendedInterval: "On Crack in Windshield (Recommended)",
        thumbnail: "/packages/rear_windshield_replacement.png",
        originalPrice: 5999,
        basePrice: 3899,
        rating: "4.7",
        isRecommended: false,
        checklist: [
          "Windshield (ISI Approved)",
          "Opening & Fitting of New Windshield",
          "Defogger Charges Additional (If Applicable)",
          "Consumables - Sealant/Bond/Adhesive",
          "Free Pickup & Drop",
        ],
        moreCount: 0,
        allDetails: [
          "ISI Approved Shatterproof Rear Glass",
          "Opening & Professional Installation",
          "High-Strength Polyurethane Adhesive Sealant",
          "Rear Defogger Connection & Wire Inspection",
          "Free Doorstep Pickup & Drop Included",
        ],
      },
    ],
  },
  {
    sectionTitle: "Glasses",
    packages: [
      {
        id: "door-glass-replacement",
        title: "Door Glass Replacement",
        badge: "LABOUR INCLUDED",
        timeTaken: "Takes 6 Hours",
        warranty: "1 Month Warranty on Fitting",
        recommendedInterval: "On Crack in Door Glass (Recommended)",
        thumbnail: "/packages/front_windshield_replacement.png",
        originalPrice: 3499,
        basePrice: 2299,
        rating: "4.6",
        isRecommended: false,
        checklist: [
          "Door Glass (AIS Approved)",
          "Opening & Fitting of New Door Glass",
          "Consumables - Bond/Adhesive",
          "Free Pickup & Drop",
          "UV Glass Charges Additional (If Applicable)",
        ],
        moreCount: 0,
        allDetails: [
          "AIS Approved Toughened Side Door Glass",
          "Power Window Channel Alignment & Fitting",
          "Consumables - Rubber Channel & Adhesive",
          "Free Doorstep Pickup & Drop Included",
        ],
      },
    ],
  },
  {
    sectionTitle: "Lights",
    packages: [
      {
        id: "front-headlight-replacement",
        title: "Front Headlight",
        timeTaken: "Takes 4 Hours",
        warranty: "1 Month Warranty on Fitting",
        recommendedInterval: "For Broken / Cracked Lights (Recommended)",
        thumbnail: "/packages/front_headlight.png",
        originalPrice: 4299,
        basePrice: 2899,
        rating: "4.8",
        isRecommended: true,
        checklist: [
          "Headlight OES (Price for single unit)",
          "Opening & Fitting of Bumper/Headlight",
          "Free Pickup & Drop",
          "Projector/LEDs/DRLs Additional (If Applicable)",
        ],
        moreCount: 0,
        allDetails: [
          "OEM/OES Headlight Assembly Replacement",
          "Front Bumper Dismantling & Refitting",
          "Electrical Harness & Bulb Testing",
          "Projector, LED & DRL Unit Charges Extra (If Applicable)",
          "Free Doorstep Pickup & Drop Included",
        ],
      },
      {
        id: "rear-taillight-replacement",
        title: "Rear Taillight",
        timeTaken: "Takes 4 Hours",
        warranty: "1 Month Warranty on Fitting",
        recommendedInterval: "For Broken / Cracked Lights (Recommended)",
        thumbnail: "/packages/rear_taillight.png",
        originalPrice: 3799,
        basePrice: 2499,
        rating: "4.7",
        isRecommended: false,
        checklist: [
          "Tail Light OES (Price for single unit)",
          "Opening & Fitting of Tail Light",
          "Free Pickup & Drop",
          "Bulbs/LEDs Additional (If Applicable)",
          "Tail Light price will differ from car model to model",
        ],
        moreCount: 0,
        allDetails: [
          "OEM/OES Tail Light Assembly Replacement",
          "Rear Bumper / Panel Dismantling & Refitting",
          "Electrical Harness & LED Strip Testing",
          "Bulbs & LED Charges Extra (If Applicable)",
          "Free Doorstep Pickup & Drop Included",
        ],
      },
      {
        id: "fog-light-replacement",
        title: "Fog Light",
        timeTaken: "Takes 4 Hours",
        warranty: "1 Month Warranty on Fitting",
        recommendedInterval: "For Broken / Non-Working Fog Lights",
        thumbnail: "/packages/fog_light.png",
        originalPrice: 2499,
        basePrice: 1599,
        rating: "4.6",
        isRecommended: false,
        checklist: [
          "Opening & Fitting of Bumper + Fog Lamp",
          "Fog Light Assembly Replacement (Single Unit)",
          "Free Pickup & Drop",
          "Wiring & Relay Check Included",
        ],
        moreCount: 0,
        allDetails: [
          "OEM/OES Fog Light Assembly (Front / Rear)",
          "Bumper Dismantling & Fog Light Housing Fitting",
          "Wiring Harness & Relay Testing",
          "LED / Halogen Fog Lamp Available",
          "Free Doorstep Pickup & Drop Included",
        ],
      },
    ],
  },
];

const getCategoryPackages = (categoryName: string) => {
  switch (categoryName) {
    case "Car Services":
      return [{ sectionTitle: "Scheduled Service Packages", packages: SCHEDULED_PACKAGES }];
    case "AC Service & Repair":
      return AC_PACKAGES;
    case "Batteries":
      return BATTERIES_PACKAGES;
    case "Tyres & Wheel Care":
      return TYRES_PACKAGES;
    case "Denting & Painting":
      return DENTING_PAINTING_PACKAGES;
    case "Detailing Services":
      return DETAILING_PACKAGES;
    case "Car Spa & Cleaning":
      return CAR_SPA_PACKAGES;
    case "Car Inspections":
      return CAR_INSPECTION_PACKAGES;
    case "Windshields & Lights":
      return WINDSHIELD_PACKAGES;
    default:
      return [{ sectionTitle: "General Packages", packages: SCHEDULED_PACKAGES }];
  }
};

const POPULAR_CAR_MODELS = [
  { name: "Swift", brand: "Maruti Suzuki", image: "/cars/swift.png" },
  { name: "WagonR", brand: "Maruti Suzuki", image: "/cars/wagonr.png" },
  { name: "Swift Dzire", brand: "Maruti Suzuki", image: "/cars/dzire.png" },
  { name: "Baleno", brand: "Maruti Suzuki", image: "/cars/baleno.png" },
  { name: "Alto", brand: "Maruti Suzuki", image: "/cars/alto.png" },
  { name: "Ritz", brand: "Maruti Suzuki", image: "/cars/alto.png" },
  { name: "Celerio", brand: "Maruti Suzuki", image: "/cars/wagonr.png" },
  { name: "Brezza", brand: "Maruti Suzuki", image: "/cars/swift.png" },
  { name: "Creta", brand: "Hyundai", image: "/cars/dzire.png" },
  { name: "Nexon", brand: "Tata", image: "/cars/baleno.png" },
];

const CAR_BRANDS_DB = [
  { name: "Maruti Suzuki", models: ["Swift", "Baleno", "Brezza", "Dzire", "Ertiga", "WagonR", "Alto K10", "Grand Vitara", "Fronx", "Ciaz"] },
  { name: "Hyundai", models: ["Creta", "i20", "Venue", "Verna", "Grand i10 Nios", "Exster", "Alcazar", "Tucson"] },
  { name: "Tata", models: ["Nexon", "Punch", "Harrier", "Safari", "Tiago", "Tigor", "Altroz"] },
  { name: "Mahindra", models: ["Thar", "XUV700", "Scorpio-N", "Scorpio Classic", "Bolero"] },
  { name: "Honda", models: ["City", "Amaze", "Elevate"] },
  { name: "Toyota", models: ["Fortuner", "Innova Crysta", "Innova Hycross", "Glanza"] },
  { name: "Kia", models: ["Seltos", "Sonet", "Carens"] },
  { name: "Volkswagen", models: ["Virtus", "Taigun", "Tiguan", "Polo"] },
  { name: "Renault", models: ["Kwid", "Triber", "Kiger"] },
  { name: "Ford", models: ["EcoSport", "Endeavour", "Figo", "Aspire"] },
  { name: "Chevrolet", models: ["Beat", "Cruze", "Spark", "Captiva"] }
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

interface ServicesProps {
  selectedCategory?: string | null;
  setSelectedCategory?: (cat: string | null) => void;
}

export default function Services({
  selectedCategory: selectedCategoryProp,
  setSelectedCategory: setSelectedCategoryProp,
}: ServicesProps = {}) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  // State
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCity, setSelectedCity] = useState("PATNA");
  const [selectedCar, setSelectedCar] = useState<SelectedCar | null>(null);
  const [phone, setPhone] = useState("");
  
  // Local fallback if props are not passed
  const [localCategory, setLocalCategory] = useState<string | null>(null);
  const selectedCategory = selectedCategoryProp !== undefined ? selectedCategoryProp : localCategory;
  const setSelectedCategory = (cat: string | null) => {
    if (setSelectedCategoryProp) setSelectedCategoryProp(cat);
    setLocalCategory(cat);
    setSelectedBrand(""); // Reset brand selection in the right panel when category changes
  };

  const [selectedBrand, setSelectedBrand] = useState<string>("");

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

  // Scheduled Packages & Model Selector State
  const [viewingPackage, setViewingPackage] = useState<PackageItem | null>(null);
  const [modelSearchQuery, setModelSearchQuery] = useState("");

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

    // 3. User Auth Check
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    // Submit booking
    await submitQuoteBooking();
  };

  const submitQuoteBooking = async () => {
    if (!user) return;
    setLoadingSubmit(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        userName: user.displayName || "Customer",
        userEmail: user.email || "",
        name: user.displayName || "Customer",
        phone: phone.replace(/\D/g, ""),
        brand: selectedCar?.brand || "General",
        model: selectedCar?.model || "Car",
        service: selectedCategory || "General Servicing",
        city: selectedCity,
        status: "pending",
        message: `Quote request from GoMechanic widget for ${selectedCity}`,
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

      <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 24px", boxSizing: "border-box" }}>
        
        {!selectedCategory && (
          <>
            {/* 1. Sub-Navbar Bar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 100,
                padding: "6px 12px",
                marginBottom: 48,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                position: "relative",
              }}
            >
              <button
                onClick={() => scrollTabs("left")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: 6,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <div
                ref={tabsNavRef}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  overflowX: "auto",
                  scrollBehavior: "smooth",
                  scrollbarWidth: "none",
                  flex: 1,
                  padding: "4px 8px",
                }}
              >
                {NAV_TABS.map((tab, idx) => {
                  const isActive = activeTab === idx;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(idx)}
                      style={{
                        position: "relative",
                        background: "none",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: 100,
                        fontSize: "0.9rem",
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "var(--text)" : "var(--text-secondary)",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {tab}
                      {isActive && (
                        <motion.div
                          layoutId="activeSubTab"
                          style={{
                            position: "absolute",
                            bottom: -2,
                            left: 16,
                            right: 16,
                            height: 3,
                            borderRadius: 2,
                            background: "#E2001A",
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => scrollTabs("right")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: 6,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ChevronRight size={20} />
              </button>
            </motion.div>

            {/* 2. Section Heading Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: 40 }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 14px",
                  borderRadius: 100,
                  border: "1px solid var(--border-hover)",
                  color: "var(--accent)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                SERVICES FOR ALL CAR BRANDS
              </span>
              <h2
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 900,
                  color: "var(--text)",
                  margin: "0 0 12px 0",
                  fontFamily: "Outfit, sans-serif",
                  lineHeight: 1.2,
                }}
              >
                Car Services Available In{" "}
                <span style={{ color: "#E2001A" }}>{selectedCity}</span>
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "1rem",
                  maxWidth: 680,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Choose from a wide assortment of car services from periodic car servicing, car care services, wheel care services, cashless Insurance claims and much more!
              </p>
            </motion.div>
          </>
        )}

        {/* 3. Dual-Column GoMechanic Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) 394px",
            gap: 20,
            alignItems: "start",
            position: "relative",
          }}
          className="gomechanic-services-layout desktop-only-services"
        >
          {/* LEFT COLUMN: Tab-Based View */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ minWidth: 0 }}
          >
            {/* TAB 0: OUR SERVICES (ALL INCLUSIVE MAIN VIEW) */}
            {activeTab === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                
                {/* CATEGORY PACKAGES VIEW (when a category like AC Service & Repair or Car Services is selected) */}
                {selectedCategory ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Always show category tabs scrollbar first */}
                    <div style={{ position: "relative", display: "flex", alignItems: "center", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "8px 12px", marginBottom: 12, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)" }}>
                      <button
                        onClick={() => {
                          const el = document.getElementById("category-scroll-container");
                          if (el) el.scrollBy({ left: -200, behavior: "smooth" });
                        }}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div
                        id="category-scroll-container"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 32,
                          overflowX: "auto",
                          scrollBehavior: "smooth",
                          scrollbarWidth: "none",
                          flex: 1,
                          padding: "4px 8px",
                        }}
                      >
                        {/* "All Categories" Tab to go back */}
                        <button
                          onClick={() => setSelectedCategory(null)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: "none",
                            border: "none",
                            padding: "12px 20px",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            transition: "all 0.2s ease",
                            borderRadius: 8,
                            flexShrink: 0,
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0, 0, 0, 0.04)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                        >
                          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#E11D2F" }}>
                            ← All Categories
                          </span>
                        </button>

                        <div style={{ width: 1, height: 24, background: "var(--border)", margin: "0 12px", flexShrink: 0 }} />

                        {SERVICE_CATEGORIES.map((cat) => {
                          const isActive = selectedCategory === cat.title;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => setSelectedCategory(cat.title)}
                              style={{
                                flex: "0 0 auto",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 6,
                                background: isActive ? "rgba(225, 29, 47, 0.08)" : "none",
                                border: "none",
                                padding: "12px 20px",
                                borderRadius: 8,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                transition: "all 0.2s ease",
                                position: "relative",
                                boxSizing: "border-box",
                              }}
                            >
                              <img
                                src={cat.iconUrl}
                                alt={cat.title}
                                style={{
                                  width: 24,
                                  height: 24,
                                  objectFit: "contain",
                                  filter: isActive ? "none" : "grayscale(100%) opacity(60%)",
                                  transition: "filter 0.2s ease",
                                }}
                              />
                              <span
                                style={{
                                  fontSize: "0.85rem",
                                  fontWeight: isActive ? 600 : 500,
                                  color: isActive ? "#E11D2F" : "var(--text-secondary)",
                                  transition: "color 0.2s ease",
                                }}
                              >
                                {cat.title}
                              </span>
                              {isActive && (
                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: 3,
                                    left: 20,
                                    right: 20,
                                    height: 3,
                                    backgroundColor: "#E11D2F",
                                    borderRadius: 2,
                                  }}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => {
                          const el = document.getElementById("category-scroll-container");
                          if (el) el.scrollBy({ left: 200, behavior: "smooth" });
                        }}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    {/* Header bar */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 12, flexWrap: "wrap" }}>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text)", margin: 0, fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {selectedCategory} Packages
                        </h3>
                      </div>
                      {selectedCar && (
                        <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 100, padding: "6px 14px", fontSize: "0.8rem", fontWeight: 800, color: "#10B981", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                          🚗 {selectedCar.brand} - {selectedCar.model}
                        </div>
                      )}
                    </div>

                    {/* Section Groups */}
                    {getCategoryPackages(selectedCategory).map((sec, secIdx) => (
                      <div key={secIdx} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text)", margin: "8px 0 0 0", fontFamily: "Outfit, sans-serif" }}>
                          {sec.sectionTitle}
                        </h3>

                        {sec.packages.map((pkg) => (
                          <motion.div
                            key={pkg.id}
                            whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}
                            style={{
                              background: "var(--card)",
                              border: "1px solid var(--border)",
                              borderRadius: 8,
                              padding: "16px",
                              position: "relative",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                              display: "flex",
                              flexDirection: "column",
                              gap: 0,
                            }}
                          >
                            {/* ── BADGE (green pill, in-flow top-left) ── */}
                            {pkg.badge && (
                              <div style={{ marginBottom: 10 }}>
                                <span style={{
                                  display: "inline-block",
                                  background: "#10B981",
                                  color: "white",
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  padding: "3px 8px",
                                  borderRadius: 3,
                                  letterSpacing: "0.03em",
                                  textTransform: "uppercase",
                                }}>
                                  {pkg.badge}
                                </span>
                              </div>
                            )}

                            {/* ── ROW 1: Image + Details side by side ── */}
                            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 10 }}>

                              {/* Left: Thumbnail - SMALL SQUARE */}
                              <div style={{
                                width: 145,
                                minWidth: 145,
                                height: 145,
                                borderRadius: 6,
                                overflow: "hidden",
                                background: "#f5f5f5",
                                flexShrink: 0,
                              }}>
                                <img src={pkg.thumbnail} alt={pkg.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>

                              {/* Right: Title + time chip + specs + checklist + rating */}
                              <div style={{ flex: 1, minWidth: 0 }}>

                                {/* Title row */}
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", margin: 0, fontFamily: "Outfit, sans-serif", lineHeight: 1.25 }}>
                                    {pkg.title}
                                  </h4>
                                  <span style={{
                                    flexShrink: 0,
                                    fontSize: "0.68rem",
                                    color: "#666",
                                    background: "var(--bg-secondary)",
                                    border: "1px solid var(--border)",
                                    padding: "2px 8px",
                                    borderRadius: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 3,
                                    fontWeight: 500,
                                    whiteSpace: "nowrap",
                                  }}>
                                    🕐 {pkg.timeTaken}
                                  </span>
                                </div>

                                {/* Specs line - COMPACT SINGLE LINE */}
                                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0 0 10px", lineHeight: 1.3 }}>
                                  • {pkg.timeTaken} • {pkg.warranty} • {pkg.recommendedInterval}
                                  {pkg.note && <> • {pkg.note}</>}
                                </p>

                                {/* Checklist 2-col - TIGHT SPACING */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 14px", marginBottom: 8 }}>
                                  {pkg.checklist.map((item, idx) => (
                                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: "0.8rem", color: "var(--text)", fontWeight: 500, lineHeight: 1.3 }}>
                                      <CheckCircle2 size={14} color="#10B981" style={{ flexShrink: 0, marginTop: 1 }} />
                                      <span>{item}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Rating + View All row - COMPACT */}
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  {pkg.rating && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                      <span style={{
                                        background: "#FF6B6B",
                                        color: "white",
                                        padding: "2px 7px",
                                        borderRadius: 12,
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 3,
                                      }}>
                                        <Star size={10} fill="white" /> {pkg.rating}
                                      </span>
                                      <span style={{ color: "#4285F4", fontSize: "0.75rem", fontWeight: 600 }}>Expert Rating</span>
                                    </div>
                                  )}
                                  {pkg.moreCount > 0 && (
                                    <button onClick={() => setViewingPackage(pkg)} style={{ background: "none", border: "none", color: "#0066FF", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", padding: 0 }}>
                                      + {pkg.moreCount} more View All
                                    </button>
                                  )}
                                </div>

                              </div>
                            </div>

                            {/* ── Summer Offer Bar ── */}
                            {pkg.summerPrice && (
                              <div style={{
                                background: "var(--bg-secondary)",
                                border: "1px solid var(--border)",
                                borderRadius: 8,
                                padding: "10px 14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 16,
                              }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <span style={{ fontSize: "1.1rem" }}>☀️</span>
                                  <span style={{ fontSize: "0.84rem", color: "var(--text)", fontWeight: 700 }}>
                                    Get at <strong style={{ color: "#E2001A" }}>₹ {pkg.summerPrice}</strong>
                                  </span>
                                </div>
                                <span style={{ background: "#10B981", color: "white", fontSize: "0.7rem", fontWeight: 800, padding: "3px 10px", borderRadius: 4 }}>
                                  {pkg.summerDiscount || "Extra 25% OFF"}
                                </span>
                              </div>
                            )}

                            {/* ── BOTTOM: Price + SELECT CAR & ADD TO CART ── */}
                            <div style={{
                              borderTop: "1px solid var(--border)",
                              paddingTop: 16,
                              marginTop: "auto",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              gap: 12,
                            }}>
                              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                                {pkg.originalPrice && (
                                  <span style={{ fontSize: "0.88rem", color: "#999", textDecoration: "line-through" }}>
                                    Rs. {pkg.originalPrice.toLocaleString()}
                                  </span>
                                )}
                                <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text)", fontFamily: "Outfit, sans-serif" }}>
                                  ₹ {pkg.basePrice.toLocaleString()}
                                </span>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                {/* SELECT CAR Button */}
                                <button
                                  onClick={() => {
                                    setIsCarModalOpen(true);
                                  }}
                                  style={{
                                    background: "none",
                                    border: "1.5px solid #6B7280",
                                    color: "var(--text)",
                                    padding: "9px 16px",
                                    borderRadius: 6,
                                    fontWeight: 700,
                                    fontSize: "0.84rem",
                                    cursor: "pointer",
                                    letterSpacing: "0.02em",
                                    transition: "all 0.2s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                  }}
                                  onMouseEnter={e => {
                                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2001A";
                                    (e.currentTarget as HTMLButtonElement).style.color = "#E2001A";
                                  }}
                                  onMouseLeave={e => {
                                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#6B7280";
                                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                                  }}
                                >
                                  <Car size={16} />
                                  <span>{selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : "Select Car"}</span>
                                </button>

                                {/* ADD TO CART Button */}
                                <button
                                  onClick={() => {
                                    // Always add item to cart (badge increment)
                                    addToCart({
                                      id: pkg.id,
                                      name: pkg.title,
                                      price: pkg.basePrice,
                                    });
                                    // Existing behaviour: prompt car selection or open booking
                                    if (!selectedCar) {
                                      setIsCarModalOpen(true);
                                    } else {
                                      handleCheckPrices();
                                    }
                                  }}
                                  style={{
                                    background: "none",
                                    border: "1.5px solid #E2001A",
                                    color: "#E2001A",
                                    padding: "9px 20px",
                                    borderRadius: 6,
                                    fontWeight: 800,
                                    fontSize: "0.88rem",
                                    cursor: "pointer",
                                    letterSpacing: "0.03em",
                                    transition: "all 0.2s ease",
                                  }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#E2001A"; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "#E2001A"; }}
                                >
                                  + ADD TO CART
                                </button>
                              </div>
                            </div>

                          </motion.div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* PRIMARY 12 CATEGORIES GRID (Exact GoMechanic Measured Layout) */
                  <CategoryGrid
                    categories={SERVICE_CATEGORIES}
                    selectedCategory={selectedCategory}
                    onSelectCategory={(title) => setSelectedCategory(title)}
                  />
                )}

                {/* Miles Roadside Assistance Red Promo Banner */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #E2001A 0%, #B30014 100%)",
                    borderRadius: 16,
                    padding: "24px 28px",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 10px 30px rgba(226, 0, 26, 0.25)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 900, fontFamily: "Outfit, sans-serif", marginBottom: 4 }}>
                      Miles
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 600, opacity: 0.9 }}>
                      Free Road Side Assistance & 24x7 Emergency Towing
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedCategory("Road Side Assistance");
                      if (!selectedCar) setIsCarModalOpen(true);
                    }}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      background: "white",
                      color: "#E2001A",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                    }}
                  >
                    <ArrowRight size={22} />
                  </motion.button>
                </div>

                {/* Curated Custom Services Section displaying 4 parts at a time with > navigation */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text)", margin: 0, fontFamily: "Outfit, sans-serif" }}>
                      Curated Custom Services
                    </h3>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {Array.from({ length: maxCuratedIndex + 1 }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCuratedIndex(idx)}
                          style={{
                            width: curatedIndex === idx ? 20 : 8,
                            height: 8,
                            borderRadius: 4,
                            background: curatedIndex === idx ? "#E2001A" : "var(--border)",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    {/* Left Arrow Button < */}
                    <motion.button
                      whileHover={{ scale: 1.15, background: "#E2001A", color: "#ffffff" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevCurated}
                      style={{
                        position: "absolute",
                        left: -16,
                        zIndex: 10,
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                        transition: "all 0.2s ease",
                      }}
                      aria-label="Previous Part"
                    >
                      <ChevronLeft size={22} />
                    </motion.button>

                    {/* Outer Viewport (Hides items outside the 4 visible slots) */}
                    <div style={{ overflow: "hidden", width: "100%", borderRadius: 16, padding: "4px 0" }}>
                      <motion.div
                        animate={{ x: `calc(-${curatedIndex} * (25% + 4px))` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{
                          display: "flex",
                          gap: 16,
                          width: "100%",
                        }}
                      >
                        {CURATED_SERVICES.map((item) => (
                          <motion.div
                            key={item.title}
                            whileHover={{ y: -6, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setSelectedCategory(item.title);
                              if (!selectedCar) setIsCarModalOpen(true);
                            }}
                            style={{
                              flex: "0 0 calc((100% - 48px) / 4)",
                              minWidth: "calc((100% - 48px) / 4)",
                              background: "var(--card)",
                              border: "1px solid var(--border)",
                              borderRadius: 16,
                              padding: "14px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              textAlign: "center",
                              cursor: "pointer",
                              position: "relative",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {item.badge && (
                              <span
                                style={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  background: item.badge === "SALE" ? "#E2001A" : item.badge === "POPULAR" ? "#FF8800" : "#10B981",
                                  color: "white",
                                  fontSize: "0.58rem",
                                  fontWeight: 800,
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  textTransform: "uppercase",
                                  zIndex: 2,
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                            
                            {/* Transparent PNG Image Container */}
                            <div
                              style={{
                                width: "100%",
                                height: 125,
                                marginBottom: 12,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 6,
                              }}
                            >
                              <img
                                src={item.iconUrl}
                                alt={item.title}
                                style={{
                                  maxHeight: "100%",
                                  maxWidth: "100%",
                                  objectFit: "contain",
                                  filter: "drop-shadow(0 6px 14px rgba(0, 0, 0, 0.15))",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            </div>

                            <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text)", lineHeight: 1.2 }}>
                              {item.title}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>

                    {/* Right Arrow Button > */}
                    <motion.button
                      whileHover={{ scale: 1.15, background: "#E2001A", color: "#ffffff" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextCurated}
                      style={{
                        position: "absolute",
                        right: -16,
                        zIndex: 10,
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                        transition: "all 0.2s ease",
                      }}
                      aria-label="Next Part"
                    >
                      <ChevronRight size={22} />
                    </motion.button>
                  </div>
                </div>

                {/* Get Summer Ready With Bosch Section with GoMechanic Banner Style & Carousel < > */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text)", margin: 0, fontFamily: "Outfit, sans-serif" }}>
                      Get Summer Ready With Bosch
                    </h3>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {Array.from({ length: maxSummerIndex + 1 }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSummerIndex(idx)}
                          style={{
                            width: summerIndex === idx ? 20 : 8,
                            height: 8,
                            borderRadius: 4,
                            background: summerIndex === idx ? "#E2001A" : "var(--border)",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    {/* Left Arrow Button < */}
                    <motion.button
                      whileHover={{ scale: 1.15, background: "#E2001A", color: "#ffffff" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevSummer}
                      style={{
                        position: "absolute",
                        left: -18,
                        zIndex: 10,
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                        transition: "all 0.2s ease",
                      }}
                      aria-label="Previous Summer Offer"
                    >
                      <ChevronLeft size={24} />
                    </motion.button>

                    {/* Visible Outer Container (Hides items outside 3 visible slots) */}
                    <div style={{ overflow: "hidden", width: "100%", borderRadius: 20, padding: "4px 0" }}>
                      <motion.div
                        animate={{ x: `calc(-${summerIndex} * (33.333% + 5.33px))` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{
                          display: "flex",
                          gap: 16,
                          width: "100%",
                        }}
                      >
                        {SUMMER_SERVICES.map((item) => (
                          <motion.div
                            key={item.title}
                            whileHover={{ y: -6, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setSelectedCategory(item.title);
                              if (!selectedCar) setIsCarModalOpen(true);
                            }}
                            style={{
                              flex: "0 0 calc((100% - 32px) / 3)",
                              minWidth: "calc((100% - 32px) / 3)",
                              display: "flex",
                              flexDirection: "column",
                              cursor: "pointer",
                            }}
                          >
                            {/* Top Cyan Tropical Banner Card */}
                            <div
                              style={{
                                width: "100%",
                                height: 220,
                                borderRadius: 18,
                                overflow: "hidden",
                                position: "relative",
                                boxShadow: "0 8px 24px rgba(0, 196, 214, 0.2)",
                                background: "linear-gradient(135deg, #00C5D8 0%, #0099AA 100%)",
                              }}
                            >
                              {/* Graphic Banner Image */}
                              <img
                                src={item.bannerUrl}
                                alt={item.title}
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
                                marginTop: 12,
                                textAlign: "center",
                                fontSize: "1.05rem",
                                fontWeight: 800,
                                color: "var(--text)",
                                fontFamily: "Outfit, sans-serif",
                              }}
                            >
                              {item.title}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>

                    {/* Right Arrow Button > */}
                    <motion.button
                      whileHover={{ scale: 1.15, background: "#E2001A", color: "#ffffff" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextSummer}
                      style={{
                        position: "absolute",
                        right: -18,
                        zIndex: 10,
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                        transition: "all 0.2s ease",
                      }}
                      aria-label="Next Summer Offer"
                    >
                      <ChevronRight size={24} />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* RIGHT COLUMN: Model Selector & Quote Booking Widget */}
          <div
            id="model-selector-widget"
            style={{
              position: "sticky",
              top: "calc(var(--navbar-height, 72px) + 16px)",
              alignSelf: "start",
              zIndex: 10,
              width: "394px",
            }}
          >
            {/* RIGHT COLUMN: Conditionally render Model Selector when category is active, or Original Quote Form on main view */}
              {/* RIGHT COLUMN */}
              {/* 1. Manufacturer Selection Panel */}
              {selectedCategory && !selectedCar && !selectedBrand && (
                <ManufacturerPanel
                  brands={[
                    "Maruti Suzuki",
                    "Hyundai",
                    "Honda",
                    "Tata",
                    "Ford",
                    "Volkswagen",
                    "Mahindra",
                    "Renault",
                    "Chevrolet",
                    "Toyota",
                    "Skoda",
                    "Nissan",
                    "Fiat",
                    "Datsun",
                    "BMW",
                    "Kia",
                    "Audi",
                    "Mercedes-Benz",
                    "MG",
                    "Porsche",
                    "Hindustan Motors"
                  ]}
                  selectedBrandId={selectedBrand}
                  onSelectBrand={(brand) => {
                    setSelectedBrand(brand);
                    setModelSearchQuery("");
                  }}
                />
              )}

              {/* 2. Model Selector & Booking Form Container */}
              {selectedCategory && (selectedCar || selectedBrand) && (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: "24px",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.06)",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    fontSize: "14px",
                    fontFamily: "Gilroy, sans-serif",
                    userSelect: "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {/* Widget Header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8, marginBottom: 12 }}>
                    <h3
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        color: "var(--text)",
                        fontFamily: "Outfit, sans-serif",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Car size={16} color="#E2001A" />
                      {selectedCar
                        ? "Selected Model"
                        : `Select ${selectedBrand} Model`}
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedCar(null);
                        setSelectedBrand("");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#E2001A",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      Change
                    </button>
                  </div>

                  {/* Model Selection View */}
                  {!selectedCar && selectedBrand && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <button
                        onClick={() => setSelectedBrand("")}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--accent)",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          padding: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          textAlign: "left",
                          alignSelf: "flex-start",
                        }}
                      >
                        ← Back to manufacturers
                      </button>

                      {/* Search bar */}
                      <div style={{ position: "relative" }}>
                        <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                        <input
                          type="text"
                          placeholder={`Search ${selectedBrand} Models`}
                          value={modelSearchQuery}
                          onChange={(e) => setModelSearchQuery(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 36px",
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
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 350, overflowY: "auto", paddingRight: 4 }}>
                        {(CAR_BRANDS_DB.find((b) => b.name === selectedBrand)?.models || ["Other Model"])
                          .filter((m) => m.toLowerCase().includes(modelSearchQuery.toLowerCase()))
                          .map((model) => (
                            <motion.button
                              key={model}
                              whileHover={{ x: 2, background: "var(--bg-secondary)" }}
                              onClick={() => setSelectedCar({ brand: selectedBrand, model })}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "12px 16px",
                                borderRadius: 10,
                                border: "1px solid var(--border)",
                                background: "var(--bg)",
                                color: "var(--text)",
                                fontWeight: 600,
                                fontSize: "0.88rem",
                                cursor: "pointer",
                                textAlign: "left",
                              }}
                            >
                              <span>{model}</span>
                              <ChevronRight size={16} color="var(--text-muted)" />
                            </motion.button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Booking Form View */}
                  {selectedCar && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)", borderRadius: 12, padding: "14px", display: "flex", alignItems: "center", gap: 10 }}>
                        <CheckCircle2 size={22} color="#10B981" />
                        <div>
                          <div style={{ fontSize: "0.9rem", fontWeight: 900, color: "var(--text)" }}>{selectedCar.brand} - {selectedCar.model}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Selected for accurate package pricing</div>
                        </div>
                      </div>

                      <div style={{ position: "relative" }}>
                        <Phone size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                        <input
                          type="tel"
                          placeholder="Enter 10-digit mobile number"
                          value={phone}
                          maxLength={10}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          style={{
                            width: "100%",
                            padding: "12px 12px 12px 38px",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            background: "var(--bg-secondary)",
                            color: "var(--text)",
                            fontSize: "0.9rem",
                            outline: "none",
                            fontWeight: 600,
                          }}
                        />
                      </div>

                      <button
                        onClick={handleCheckPrices}
                        disabled={loadingSubmit}
                        style={{
                          width: "100%",
                          padding: "14px",
                          borderRadius: 8,
                          background: "#E2001A",
                          color: "white",
                          border: "none",
                          fontWeight: 900,
                          fontSize: "0.95rem",
                          cursor: "pointer",
                          boxShadow: "0 4px 14px rgba(226,0,26,0.3)",
                        }}
                      >
                        {loadingSubmit ? "PROCESSING..." : "CHECK PRICES FOR FREE →"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Main View Quote Widget */}
              {!selectedCategory && (
                <QuoteSidebar
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  selectedCar={selectedCar}
                  setSelectedCar={setSelectedCar}
                  phone={phone}
                  setPhone={setPhone}
                  cities={CITIES}
                  bookingSuccess={bookingSuccess}
                  setBookingSuccess={setBookingSuccess}
                  loadingSubmit={loadingSubmit}
                  onOpenCarModal={() => setIsCarModalOpen(true)}
                  onCheckPrices={handleCheckPrices}
                />
              )}
          </div>{/* end sticky right column */}
        </div>{/* end grid */}
      </div>{/* end container */}

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
                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text)", margin: 0, fontFamily: "Outfit, sans-serif" }}>
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

      {/* Responsive Media Queries */}
      <style>{`
        .mobile-only-gomechanic-view {
          display: none;
        }

        /* Package card: stack image above details on narrow left column */
        .package-card-inner {
          grid-template-columns: 160px 1fr;
        }

        /* Category Grid - Responsive Columns */
        .categories-4col-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .categories-4col-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          .categories-4col-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 1100px) {
          .gomechanic-services-layout {
            grid-template-columns: 1fr 200px !important;
          }
          .package-card-inner {
            grid-template-columns: 120px 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .desktop-only-services {
            display: none !important;
          }
          .mobile-only-gomechanic-view {
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
}
