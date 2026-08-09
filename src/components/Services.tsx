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
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CarSelectModal, { SelectedCar } from "./CarSelectModal";
import AuthModal from "./AuthModal";

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
        overflow: "hidden",
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

      <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: "100%", overflowX: "hidden" }}>
        
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

        {/* 3. Dual-Column GoMechanic Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 28,
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
          >
            {/* TAB 0: OUR SERVICES (ALL INCLUSIVE MAIN VIEW) */}
            {activeTab === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                
                {/* CATEGORY PACKAGES VIEW (when a category like AC Service & Repair or Car Services is selected) */}
                {selectedCategory ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Header bar with Back button */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <button
                          onClick={() => setSelectedCategory(null)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#E2001A",
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
                        <h3 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text)", margin: 0, fontFamily: "Outfit, sans-serif" }}>
                          {selectedCategory} Packages
                        </h3>
                      </div>
                      {selectedCar && (
                        <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 100, padding: "6px 14px", fontSize: "0.8rem", fontWeight: 800, color: "#10B981", display: "flex", alignItems: "center", gap: 6 }}>
                          🚗 {selectedCar.brand} - {selectedCar.model}
                        </div>
                      )}
                    </div>

                    {/* Section Groups (e.g. Service Packages, Pollution, AC Fitments for AC Service & Repair) */}
                    {(selectedCategory === "AC Service & Repair"
                      ? AC_PACKAGES
                      : selectedCategory === "Batteries"
                      ? BATTERIES_PACKAGES
                      : [{ sectionTitle: "Service Packages", packages: SCHEDULED_PACKAGES }]
                    ).map((sec, secIdx) => (
                      <div key={secIdx} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text)", margin: "8px 0 0 0", fontFamily: "Outfit, sans-serif" }}>
                          {sec.sectionTitle}
                        </h3>

                        {sec.packages.map((pkg) => (
                          <motion.div
                            key={pkg.id}
                            whileHover={{ y: -2 }}
                            style={{
                              background: "var(--card)",
                              border: pkg.isRecommended ? "2px solid #10B981" : "1px solid var(--border)",
                              borderRadius: 14,
                              padding: "24px 22px 18px",
                              position: "relative",
                              boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
                              display: "flex",
                              flexDirection: "column",
                              gap: 16,
                            }}
                          >
                            {/* TOP BADGE (e.g., FREE AC UNIT INSPECTION, FREE AC GAS, BESTSELLER) */}
                            {pkg.badge && (
                              <span
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
                                }}
                              >
                                {pkg.badge}
                              </span>
                            )}

                            {/* Package Card Main Layout */}
                            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 20, alignItems: "start" }} className="package-card-inner">
                              {/* Left Thumbnail */}
                              <div style={{ width: "100%", height: 135, borderRadius: 10, overflow: "hidden", background: "#f5f5f5" }}>
                                <img src={pkg.thumbnail} alt={pkg.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>

                              {/* Right Details */}
                              <div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                  <h4 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text)", margin: 0, fontFamily: "Outfit, sans-serif" }}>
                                    {pkg.title}
                                  </h4>
                                  <span style={{ fontSize: "0.75rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", padding: "3px 10px", borderRadius: 100, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                                    ⏱️ {pkg.timeTaken}
                                  </span>
                                </div>

                                {/* Specs subtitle */}
                                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: 12, lineHeight: 1.5 }}>
                                  • {pkg.timeTaken} &nbsp;• {pkg.warranty} &nbsp;• {pkg.recommendedInterval}
                                  {pkg.note && <div style={{ marginTop: 2, color: "#777", fontSize: "0.75rem" }}>• {pkg.note}</div>}
                                </div>

                                {/* Green Checklist */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: 12 }}>
                                  {pkg.checklist.map((item, idx) => (
                                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: "var(--text)", fontWeight: 500 }}>
                                      <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                                      <span>{item}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Optional Rating or View All */}
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                                  {pkg.rating && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                      <span style={{ background: "#FF6B6B", color: "white", padding: "2px 8px", borderRadius: 100, fontSize: "0.75rem", fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                                        <Star size={12} fill="white" /> {pkg.rating}
                                      </span>
                                      <span style={{ color: "#4285F4", fontSize: "0.85rem", fontWeight: 600 }}>Expert Rating</span>
                                    </div>
                                  )}
                                  
                                  {pkg.moreCount > 0 && (
                                    <button
                                      onClick={() => setViewingPackage(pkg)}
                                      style={{ background: "none", border: "none", color: "#0066FF", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer", padding: 0 }}
                                    >
                                      + {pkg.moreCount} more View All
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Card Bottom Bar: Price & Add To Cart Button */}
                            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                                {pkg.originalPrice && (
                                  <span style={{ fontSize: "0.9rem", color: "#888", textDecoration: "line-through" }}>
                                    Rs. {pkg.originalPrice}
                                  </span>
                                )}
                                <span style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text)" }}>
                                  ₹ {pkg.basePrice.toLocaleString()}
                                </span>
                              </div>

                              <button
                                onClick={() => {
                                  if (!selectedCar) {
                                    const el = document.getElementById("model-selector-widget");
                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                  } else {
                                    handleCheckPrices();
                                  }
                                }}
                                style={{
                                  background: selectedCar ? "#E2001A" : "none",
                                  border: selectedCar ? "none" : "1.5px solid #E2001A",
                                  color: selectedCar ? "white" : "#E2001A",
                                  padding: "8px 22px",
                                  borderRadius: 6,
                                  fontWeight: 900,
                                  fontSize: "0.88rem",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  boxShadow: selectedCar ? "0 4px 14px rgba(226,0,26,0.3)" : "none",
                                }}
                              >
                                + ADD TO CART
                              </button>
                            </div>

                            {/* Summer Sale Special Offer Bar (Matches GoMechanic reference screenshot) */}
                            {pkg.summerPrice && (
                              <div
                                style={{
                                  background: "var(--bg-secondary)",
                                  border: "1px solid var(--border)",
                                  borderRadius: 8,
                                  padding: "10px 14px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <span style={{ fontSize: "1.2rem" }}>☀️</span>
                                  <span style={{ fontSize: "0.86rem", color: "var(--text)", fontWeight: 700 }}>
                                    Get at <strong style={{ color: "#E2001A", fontSize: "1rem" }}>₹ {pkg.summerPrice}</strong>
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
                ) : (
                  /* PRIMARY 12 CATEGORIES GRID (Exact GoMechanic Square Box Grey Theme Layout) */
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: 8,
                    }}
                    className="categories-4col-grid"
                  >
                    {SERVICE_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.title;

                      return (
                        <motion.div
                          key={cat.id}
                          whileHover={{ y: -3, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedCategory(cat.title);
                          }}
                          style={{
                            position: "relative",
                            background: isSelected ? "rgba(226,0,26,0.06)" : "var(--bg-secondary)",
                            border: isSelected ? "2px solid #E2001A" : "1px solid var(--border)",
                            borderRadius: 4,
                            padding: "12px 6px 10px",
                            height: 146,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            cursor: "pointer",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {/* Badge */}
                          {cat.badge && (
                            <span
                              style={{
                                position: "absolute",
                                top: 6,
                                right: 6,
                                background: "#E8F5E9",
                                color: "#2E7D32",
                                fontSize: "0.6rem",
                                fontWeight: 700,
                                padding: "1px 5px",
                                borderRadius: 2,
                              }}
                            >
                              {cat.badge}
                            </span>
                          )}

                          {/* Clean Icon */}
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: 6,
                            }}
                          >
                            <img
                              src={cat.iconUrl}
                              alt={cat.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </div>

                          <h3
                            style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: "var(--text)",
                              margin: 0,
                              lineHeight: 1.3,
                            }}
                          >
                            {cat.title}
                          </h3>
                        </motion.div>
                      );
                    })}
                  </div>
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
          <motion.div
            id="model-selector-widget"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              position: "sticky",
              top: 90,
              alignSelf: "start",
              zIndex: 10,
            }}
          >
              {/* RIGHT COLUMN: Conditionally render Model Selector when category is active, or Original Quote Form on main view */}
              {selectedCategory ? (
                /* 1. Model Selector Widget (For Category Packages View - Screenshot 1) */
                <div
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                    padding: "20px",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {/* Widget Header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 900,
                        color: "var(--text)",
                        fontFamily: "Outfit, sans-serif",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Car size={20} color="#E2001A" />
                      {selectedCar ? "Selected Model" : "Select Model"}
                    </h3>
                    {selectedCar && (
                      <button
                        onClick={() => setSelectedCar(null)}
                        style={{ background: "none", border: "none", color: "#E2001A", fontWeight: 800, fontSize: "0.8rem", cursor: "pointer" }}
                      >
                        Change
                      </button>
                    )}
                  </div>

                  {/* Search Bar when model is NOT selected */}
                  {!selectedCar && (
                    <div style={{ position: "relative" }}>
                      <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        type="text"
                        placeholder="Search Models"
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
                  )}

                  {/* Model Selection Grid */}
                  {!selectedCar ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxHeight: 380, overflowY: "auto", paddingRight: 4 }}>
                      {POPULAR_CAR_MODELS.filter((m) => m.name.toLowerCase().includes(modelSearchQuery.toLowerCase())).map((car) => (
                        <motion.div
                          key={car.name}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedCar({ brand: car.brand, model: car.name })}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "10px 4px",
                            borderRadius: 12,
                            border: "1px solid var(--border)",
                            background: "var(--bg)",
                            cursor: "pointer",
                            textAlign: "center",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                          }}
                        >
                          <div style={{ width: 64, height: 44, marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img src={car.image} alt={car.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                          </div>
                          <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text)", lineHeight: 1.2 }}>{car.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    /* Booking Form & Cart Summary */
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)", borderRadius: 12, padding: "14px", display: "flex", alignItems: "center", gap: 10 }}>
                        <CheckCircle2 size={22} color="#10B981" />
                        <div>
                          <div style={{ fontSize: "0.9rem", fontWeight: 900, color: "var(--text)" }}>{selectedCar.brand} - {selectedCar.model}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Selected for accurate package pricing</div>
                        </div>
                      </div>

                      <input
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
              ) : (
                /* 2. Original Booking / Quote Widget (For Main 12 Categories View - Screenshot 2) */
                <div
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: "24px 20px",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Header */}
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 900,
                      color: "var(--text)",
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
                      color: "var(--text-secondary)",
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
                      <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)", margin: "0 0 6px 0" }}>
                        Quote Requested!
                      </h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: "0 0 16px 0" }}>
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
                          background: "var(--bg-secondary)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
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
                            background: "var(--bg)",
                            border: "1px solid var(--border)",
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
                              color: "var(--text)",
                              fontSize: "0.85rem",
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
                          <ChevronDown
                            size={16}
                            color="var(--text-muted)"
                            style={{ position: "absolute", right: 12, pointerEvents: "none" }}
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
                          padding: "11px 14px",
                          borderRadius: 6,
                          background: selectedCar ? "rgba(0, 102, 255, 0.05)" : "var(--bg)",
                          border: selectedCar ? "2px solid var(--accent)" : "1px solid var(--border)",
                          color: "var(--text)",
                          cursor: "pointer",
                          textAlign: "left",
                          width: "100%",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Car size={16} color="var(--accent)" />
                          <span style={{ fontSize: "0.85rem", fontWeight: selectedCar ? 800 : 600 }}>
                            {selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : "SELECT YOUR CAR"}
                          </span>
                        </div>
                        <ChevronDown size={16} color="var(--text-muted)" />
                      </button>

                      {/* 3. Mobile Number Input */}
                      <div style={{ position: "relative" }}>
                        <Phone size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
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
                            background: "var(--bg)",
                            border: "1px solid var(--border)",
                            color: "var(--text)",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            outline: "none",
                          }}
                        />
                      </div>

                      {/* 4. Action Button */}
                      <motion.button
                        onClick={handleCheckPrices}
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

                  {/* Trust Footer */}
                  <div
                    style={{
                      marginTop: 20,
                      paddingTop: 16,
                      borderTop: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Star size={16} color="#F59E0B" fill="#F59E0B" />
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text)" }}>4.8/5</div>
                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Based on 150,000+ Reviews</div>
                      </div>
                    </div>

                    <div style={{ height: 24, width: 1, background: "var(--border)" }} />

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Users size={16} color="#0066FF" />
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text)" }}>2 Million+</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Happy Customers</div>
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
