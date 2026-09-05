// Bosch Car Service Standardised Labour Schedule (Version 2022 A)
// Official Rate Matrix across Vehicle Segments (Groups 1.1 to 4.2)

import { BoschSegmentId, BOSCH_SEGMENTS } from "./vehicleGrouping";

export interface ServicePackage {
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

export interface ServiceCategorySection {
  sectionTitle: string;
  packages: ServicePackage[];
}

// 1. Official Standard Labour Charges (Pages 2 - 5)
export const BOSCH_LABOUR_RATES: Record<
  string,
  Record<BoschSegmentId, number>
> = {
  // Standard Services
  paidService: {
    "1.1": 1425,
    "1.2": 1725,
    "2.1": 2200,
    "2.2": 2240,
    "3.1": 2400,
    "3.2": 2640,
    "4.1": 4320,
    "4.2": 6000,
  },
  diagnosticScanning: {
    "1.1": 675,
    "1.2": 675,
    "2.1": 675,
    "2.2": 675,
    "3.1": 750,
    "3.2": 750,
    "4.1": 1500,
    "4.2": 1500,
  },
  generalCheckup30: {
    "1.1": 440,
    "1.2": 440,
    "2.1": 750,
    "2.2": 750,
    "3.1": 830,
    "3.2": 830,
    "4.1": 1650,
    "4.2": 1650,
  },
  engineOilReplace: {
    "1.1": 330,
    "1.2": 330,
    "2.1": 450,
    "2.2": 450,
    "3.1": 550,
    "3.2": 550,
    "4.1": 750,
    "4.2": 850,
  },
  brakeOverhaulFront: {
    "1.1": 250,
    "1.2": 250,
    "2.1": 375,
    "2.2": 375,
    "3.1": 550,
    "3.2": 550,
    "4.1": 1650,
    "4.2": 2200,
  },
  brakeOverhaulRear: {
    "1.1": 225,
    "1.2": 225,
    "2.1": 350,
    "2.2": 350,
    "3.1": 550,
    "3.2": 550,
    "4.1": 1800,
    "4.2": 2200,
  },
  wheelAlignment: {
    "1.1": 440,
    "1.2": 440,
    "2.1": 550,
    "2.2": 550,
    "3.1": 750,
    "3.2": 750,
    "4.1": 1650,
    "4.2": 2200,
  },
  wheelBalancing4Wheels: {
    "1.1": 360,
    "1.2": 400,
    "2.1": 360,
    "2.2": 400,
    "3.1": 400,
    "3.2": 400,
    "4.1": 600,
    "4.2": 600,
  },
  washingCleaning: {
    "1.1": 500,
    "1.2": 500,
    "2.1": 500,
    "2.2": 500,
    "3.1": 750,
    "3.2": 750,
    "4.1": 1000,
    "4.2": 1000,
  },

  // AC Services
  acGasChargingLevel1: {
    "1.1": 1750,
    "1.2": 2050,
    "2.1": 1999,
    "2.2": 2450,
    "3.1": 2750,
    "3.2": 2750,
    "4.1": 3250,
    "4.2": 3500,
  },
  acLevel2Compressor: {
    "1.1": 2350,
    "1.2": 2350,
    "2.1": 2750,
    "2.2": 2750,
    "3.1": 3550,
    "3.2": 2750,
    "4.1": 4750,
    "4.2": 5500,
  },
  acLevel3Condenser: {
    "1.1": 2850,
    "1.2": 2850,
    "2.1": 3150,
    "2.2": 3300,
    "3.1": 4500,
    "3.2": 3300,
    "4.1": 6500,
    "4.2": 7500,
  },
  acLevel4Evaporator: {
    "1.1": 2750,
    "1.2": 3950,
    "2.1": 3150,
    "2.2": 3500,
    "3.1": 3500,
    "3.2": 3500,
    "4.1": 3500,
    "4.2": 4500,
  },

  // Brake Services
  brakePadReplacementFR: {
    "1.1": 390,
    "1.2": 425,
    "2.1": 550,
    "2.2": 625,
    "3.1": 770,
    "3.2": 770,
    "4.1": 1650,
    "4.2": 1850,
  },
  brakeDiscReplacement: {
    "1.1": 290,
    "1.2": 375,
    "2.1": 575,
    "2.2": 575,
    "3.1": 850,
    "3.2": 950,
    "4.1": 1200,
    "4.2": 1200,
  },
  caliperAssyReplacement: {
    "1.1": 650,
    "1.2": 750,
    "2.1": 850,
    "2.2": 925,
    "3.1": 1050,
    "3.2": 1050,
    "4.1": 1150,
    "4.2": 3100,
  },

  // Painting Works (Solid Panel Rates)
  paintFrontBumperSolid: {
    "1.1": 3734,
    "1.2": 4552,
    "2.1": 4776,
    "2.2": 5040,
    "3.1": 5787,
    "3.2": 6152,
    "4.1": 8596,
    "4.2": 18806,
  },
  paintRearBumperSolid: {
    "1.1": 3437,
    "1.2": 4289,
    "2.1": 4396,
    "2.2": 4708,
    "3.1": 5596,
    "3.2": 6589,
    "4.1": 8455,
    "4.2": 19800,
  },
  paintBonnetSolid: {
    "1.1": 3677,
    "1.2": 5018,
    "2.1": 5223,
    "2.2": 7016,
    "3.1": 7164,
    "3.2": 7464,
    "4.1": 9658,
    "4.2": 24164,
  },
  paintFrontDoorSolid: {
    "1.1": 3707,
    "1.2": 4713,
    "2.1": 4794,
    "2.2": 5927,
    "3.1": 6044,
    "3.2": 6314,
    "4.1": 8332,
    "4.2": 19220,
  },
  paintRearDoorSolid: {
    "1.1": 3538,
    "1.2": 4626,
    "2.1": 4681,
    "2.2": 5948,
    "3.1": 6044,
    "3.2": 6046,
    "4.1": 8208,
    "4.2": 19142,
  },
  paintFullBodySameColour: {
    "1.1": 34315,
    "1.2": 46148,
    "2.1": 49667,
    "2.2": 60548,
    "3.1": 63939,
    "3.2": 69746,
    "4.1": 102556,
    "4.2": 283914,
  },

  // Clutch & Suspension
  clutchCoverReplacement: {
    "1.1": 2200,
    "1.2": 2850,
    "2.1": 3100,
    "2.2": 3550,
    "3.1": 4150,
    "3.2": 4150,
    "4.1": 4650,
    "4.2": 5500,
  },
  gearboxRemovalRefit: {
    "1.1": 1500,
    "1.2": 1900,
    "2.1": 2200,
    "2.2": 2450,
    "3.1": 2650,
    "3.2": 2650,
    "4.1": 2850,
    "4.2": 3500,
  },
  frontSuspensionOverhaul: {
    "1.1": 1760,
    "1.2": 1760,
    "2.1": 1980,
    "2.2": 2450,
    "3.1": 3300,
    "3.2": 3300,
    "4.1": 4500,
    "4.2": 5500,
  },
};

/**
 * Builds dynamic package lists for any selected vehicle segment
 */
export function buildSegmentPackages(segmentId: BoschSegmentId = "1.2"): Record<string, ServiceCategorySection[]> {
  const seg = BOSCH_SEGMENTS[segmentId] || BOSCH_SEGMENTS["1.2"];

  // 1. PERIODIC CAR SERVICES (Basic, Standard, Comprehensive)
  const paidLabour = BOSCH_LABOUR_RATES.paidService[segmentId];
  const scanRate = BOSCH_LABOUR_RATES.diagnosticScanning[segmentId];
  const alignRate = BOSCH_LABOUR_RATES.wheelAlignment[segmentId];
  const balanceRate = BOSCH_LABOUR_RATES.wheelBalancing4Wheels[segmentId];

  const basicPrice = Math.round((paidLabour * 1.35) / 50) * 50; // Labour + engine oil & filter essential consumables
  const standardPrice = Math.round((paidLabour + scanRate + 1850) / 50) * 50;
  const comprehensivePrice = Math.round((paidLabour + scanRate + alignRate + balanceRate + 3200) / 50) * 50;

  const scheduledPackages: ServicePackage[] = [
    {
      id: "basic-service",
      title: "Basic Service",
      badge: "ESSENTIAL",
      badgeColor: "#10B981",
      timeTaken: "4 Hrs Taken",
      warranty: "1000 Kms or 1 Month Warranty",
      recommendedInterval: "Every 5,000 Kms or 3 Months (Recommended)",
      freePickup: true,
      thumbnail: "/packages/basic.jpg",
      originalPrice: Math.round(basicPrice * 1.3),
      basePrice: basicPrice,
      summerPrice: Math.round(basicPrice * 0.85),
      summerDiscount: "15% OFF",
      isRecommended: false,
      checklist: [
        "Engine Oil Replacement (Genuine Grade)",
        "Oil Filter Replacement",
        "Wiper Fluid Replacement & Battery Water Top Up",
        "Car Wash & Interior Vacuuming",
        "40-Point General Health Inspection",
      ],
      moreCount: 4,
      allDetails: [
        "Engine Oil Replacement (Genuine Grade)",
        "Oil Filter Replacement",
        "Air Filter Cleaning & De-dusting",
        "Coolant Top Up (Up to 200ml)",
        "Wiper Fluid Replacement",
        "Battery Water Top Up",
        "Car Wash & Exterior Shampoo",
        "Interior Vacuuming (Carpet & Seats)",
        "40-Point General Health Inspection Report",
      ],
    },
    {
      id: "standard-service",
      title: "Standard Service",
      badge: "MOST POPULAR",
      badgeColor: "#008ECF",
      rating: "4.8",
      timeTaken: "6 Hrs Taken",
      warranty: "1000 Kms or 1 Month Warranty",
      recommendedInterval: "Every 10,000 Kms or 6 Months (Recommended)",
      freePickup: true,
      thumbnail: "/packages/standard.jpg",
      originalPrice: Math.round(standardPrice * 1.3),
      basePrice: standardPrice,
      summerPrice: Math.round(standardPrice * 0.82),
      summerDiscount: "18% OFF",
      isRecommended: true,
      checklist: [
        "OBD-II Computerized Car Diagnostics Scanning",
        "Engine Oil Replacement (100% Synthetic)",
        "Oil Filter + Air Filter Replacement",
        "Front & Rear Brake Pads Cleaning & De-dusting",
        "Full Fluid Top Up & 60-Point Bosch Inspection",
      ],
      moreCount: 9,
      allDetails: [
        "OBD-II Computerized Car Diagnostics Scanning (Bosch KTS)",
        "Engine Oil Replacement (100% Synthetic)",
        "Oil Filter Replacement",
        "Air Filter Replacement",
        "Fuel Filter Inspection & Cleaning",
        "AC Cabin Filter Cleaning",
        "Spark Plugs Cleaning / Inspection",
        "Coolant & Brake Fluid Top Up",
        "Wiper Fluid Replacement & Battery Water Top Up",
        "Front & Rear Brake Pads Cleaning & De-dusting",
        "Foam Car Wash & Exterior Polish",
        "Deep Interior Vacuuming",
        "60-Point Comprehensive Inspection Report",
      ],
    },
    {
      id: "comprehensive-service",
      title: "Comprehensive Service",
      badge: "COMPLETE CARE",
      badgeColor: "#10B981",
      timeTaken: "8 Hrs Taken",
      warranty: "1000 Kms or 1 Month Warranty",
      recommendedInterval: "Every 20,000 Kms or 12 Months (Recommended)",
      freePickup: true,
      thumbnail: "/packages/basic.jpg",
      originalPrice: Math.round(comprehensivePrice * 1.3),
      basePrice: comprehensivePrice,
      summerPrice: Math.round(comprehensivePrice * 0.8),
      summerDiscount: "20% OFF",
      isRecommended: false,
      checklist: [
        "Full Synthetic Engine Oil + All Filters Replacement",
        "3D Computerized Wheel Alignment & Wheel Balancing",
        "AC Filter Replacement & Complete AC Inspection",
        "Throttle Body & Engine Flushing Treatment",
        "Complete Suspension Check & 100-Point Report",
      ],
      moreCount: 12,
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

  // 2. AC SERVICE & REPAIR
  const acL1Rate = BOSCH_LABOUR_RATES.acGasChargingLevel1[segmentId];
  const acL2Rate = BOSCH_LABOUR_RATES.acLevel2Compressor[segmentId];
  const acL3Rate = BOSCH_LABOUR_RATES.acLevel3Condenser[segmentId];
  const acL4Rate = BOSCH_LABOUR_RATES.acLevel4Evaporator[segmentId];

  const acPackages: ServiceCategorySection[] = [
    {
      sectionTitle: "Service Packages",
      packages: [
        {
          id: "regular-ac-service",
          title: "Regular AC Service (Level 1)",
          badge: "FREE AC INSPECTION",
          badgeColor: "#10B981",
          timeTaken: "Takes 4 hours",
          warranty: "500 Kms or 1 Month Warranty",
          recommendedInterval: "Every 5,000 Kms or 3 Months (Recommended)",
          note: "Standardised Bosch labour rate including AC gas recovery & refilling",
          thumbnail: "/images/ac-regular-service.png",
          originalPrice: Math.round(acL1Rate * 1.35),
          basePrice: acL1Rate,
          summerPrice: Math.round(acL1Rate * 0.8),
          summerDiscount: "Summer 20% OFF",
          isRecommended: false,
          checklist: [
            "AC Gas Recovery & Refilling (Refrigerant Included)",
            "AC Vent Anti-Bacterial Cleaning",
            "Condenser High-Pressure Cleaning",
            "AC Filter Cleaning & De-dusting",
            "Cooling Temperature & Pressure Diagnostics",
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
          title: "High Performance AC Service (Level 4)",
          badge: "DEEP COOLING",
          badgeColor: "#10B981",
          timeTaken: "Takes 8 Hours",
          warranty: "1,000 Kms or 1 Month Warranty",
          recommendedInterval: "Every 10,000 Kms or 1 Year (Recommended)",
          note: "Includes dashboard removal/refitting & evaporator deep cleaning",
          thumbnail: "/images/ac-high-performance.png",
          originalPrice: Math.round((acL1Rate + acL4Rate) * 1.25),
          basePrice: acL1Rate + acL4Rate,
          summerPrice: Math.round((acL1Rate + acL4Rate) * 0.85),
          summerDiscount: "15% OFF",
          isRecommended: true,
          checklist: [
            "Complete Dashboard Removal & Precision Refitting",
            "Cooling Coil / Evaporator Deep Pressure Cleaning",
            "AC Nitrogen Leak Detection Test",
            "100% Synthetic Refrigerant Gas & Oil Refill",
            "Condenser & Cooling Fan Deep Sanitization",
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
      sectionTitle: "AC Fitments & Part Replacements",
      packages: [
        {
          id: "compressor-replacement",
          title: "AC Compressor Replacement (Level 2)",
          badge: "BOSCH CERTIFIED",
          badgeColor: "#10B981",
          timeTaken: "Takes 6 Hours",
          warranty: "3 Months Warranty",
          recommendedInterval: "In Case of Compressor Noise / Low Cooling",
          thumbnail: "/images/ac-compressor.png",
          originalPrice: Math.round(acL2Rate * 1.3),
          basePrice: acL2Rate,
          isRecommended: false,
          checklist: [
            "Compressor R/R & Precision Mounting",
            "System Flushing & De-contamination",
            "Fresh Refrigerant Oil Recharge",
            "Free Doorstep Pickup and Delivery",
          ],
          moreCount: 2,
          allDetails: [
            "Genuine OEM/OES AC Compressor Fitment",
            "Complete AC Gas Charging & Oil Top-up",
            "AC System Flushing & Performance Test",
            "Free Doorstep Pickup and Delivery",
          ],
        },
        {
          id: "condenser-replacement",
          title: "AC Condenser Replacement (Level 3)",
          badge: "FREE GAS CHECK",
          badgeColor: "#10B981",
          timeTaken: "Takes 6 Hours",
          warranty: "3 Months Warranty",
          recommendedInterval: "In Case of Condenser Leakage or Puncture",
          thumbnail: "/images/ac-condenser.png",
          originalPrice: Math.round(acL3Rate * 1.3),
          basePrice: acL3Rate,
          isRecommended: false,
          checklist: [
            "Condenser Unit Fitment & Seal Integrity Check",
            "High Pressure Radiator & Cooling Fan Cleaning",
            "Nitrogen Pressure & Leak Test",
            "Free Pickup & Drop",
          ],
          moreCount: 2,
          allDetails: [
            "Genuine OEM/OES AC Condenser Unit Replacement",
            "Complementary AC Gas Top-Up (Free)",
            "High Pressure Radiator & Cooling Fan Cleaning",
            "System Nitrogen Pressure & Leak Test",
            "3 Months Bosch Warranty Coverage",
          ],
        },
      ],
    },
  ];

  // 3. DENTING & PAINTING
  const frontBumperPaint = BOSCH_LABOUR_RATES.paintFrontBumperSolid[segmentId];
  const rearBumperPaint = BOSCH_LABOUR_RATES.paintRearBumperSolid[segmentId];
  const bonnetPaint = BOSCH_LABOUR_RATES.paintBonnetSolid[segmentId];
  const doorPaint = BOSCH_LABOUR_RATES.paintFrontDoorSolid[segmentId];
  const fullBodyPaint = BOSCH_LABOUR_RATES.paintFullBodySameColour[segmentId];

  const dentingPackages: ServiceCategorySection[] = [
    {
      sectionTitle: "Panel Painting (Grade A Paint Booth)",
      packages: [
        {
          id: "front-bumper-paint",
          title: "Front Bumper Painting",
          badge: "FLAWLESS MATCH",
          badgeColor: "#008ECF",
          timeTaken: "24 Hours",
          warranty: "2 Years Paint Warranty",
          recommendedInterval: "Scratches, Scuffs & Colour Fade",
          thumbnail: "/summer/bumper_paint.png",
          originalPrice: Math.round(frontBumperPaint * 1.3),
          basePrice: frontBumperPaint,
          summerPrice: Math.round(frontBumperPaint * 0.88),
          summerDiscount: "12% OFF",
          checklist: [
            "Grade A Temperature-Controlled Paint Booth",
            "OEM 100% Computerized Color Matching (PPG/Nippon)",
            "3-Coat Painting (Primer, Base Coat, Clear Lacquer)",
            "High-Gloss Mirror Finish Rubbing & Buffing",
          ],
          moreCount: 2,
          allDetails: [
            "Complete Bumper Demount & Precision Surface Sanding",
            "Multi-Layer Anti-Rust Primer Application",
            "Infrared Baking for Rock-Hard Factory Durability",
            "2 Years Warranty on Paint Peeling & Cracking",
          ],
        },
        {
          id: "rear-bumper-paint",
          title: "Rear Bumper Painting",
          badge: "OEM FINISH",
          badgeColor: "#10B981",
          timeTaken: "24 Hours",
          warranty: "2 Years Paint Warranty",
          recommendedInterval: "Rear Scratches & Dent Repair",
          thumbnail: "/summer/bumper_paint.png",
          originalPrice: Math.round(rearBumperPaint * 1.3),
          basePrice: rearBumperPaint,
          checklist: [
            "Grade A Paint Booth High-Gloss Finish",
            "Precision Computerized Paint Shade Match",
            "Dent Pulling & Surface Levelling Included",
            "Mirror Clearcoat UV Protection",
          ],
          moreCount: 2,
          allDetails: [
            "Bumper Removal, Alignment & Re-installation",
            "High Pressure Clear Lacquer Coat",
            "Anti-Scratch Tough Finish",
          ],
        },
        {
          id: "bonnet-hood-paint",
          title: "Engine Hood / Bonnet Painting",
          badge: "PREMIUM FINISH",
          badgeColor: "#10B981",
          timeTaken: "36 Hours",
          warranty: "2 Years Paint Warranty",
          recommendedInterval: "Stone Chips, Scratches & Oxidation",
          thumbnail: "/summer/bumper_paint.png",
          originalPrice: Math.round(bonnetPaint * 1.3),
          basePrice: bonnetPaint,
          checklist: [
            "High Precision Computerized Paint Matching",
            "Under-hood Heat Shield Preservation",
            "3-Stage Paint Booth Application",
            "Full Surface De-nibbing & Mirror Polishing",
          ],
          moreCount: 2,
          allDetails: [
            "Complete Surface Sanding & Dent Repair",
            "Double Clearcoat Application for UV Resistance",
            "2 Years Warranty Against Peeling & Cracking",
          ],
        },
        {
          id: "door-panel-paint",
          title: "Door Panel Painting (Per Door)",
          badge: "EXACT MATCH",
          badgeColor: "#10B981",
          timeTaken: "24 Hours",
          warranty: "2 Years Paint Warranty",
          recommendedInterval: "Door Dents & Side Scratches",
          thumbnail: "/summer/bumper_paint.png",
          originalPrice: Math.round(doorPaint * 1.3),
          basePrice: doorPaint,
          checklist: [
            "Grade A Paint Booth Painting",
            "Handle & Trim R/R with Complete Masking",
            "Dent Levelling & Primer Coating",
            "High-Gloss Machine Buffing",
          ],
          moreCount: 2,
          allDetails: [
            "Seamless Panel Blending with Adjacent Panels",
            "Factory Clearcoat Baking",
          ],
        },
      ],
    },
    {
      sectionTitle: "Full Body Painting",
      packages: [
        {
          id: "full-body-paint",
          title: "Full Body Complete Painting (Same Colour)",
          badge: "SHOWROOM FINISH",
          badgeColor: "#008ECF",
          timeTaken: "5 - 7 Days",
          warranty: "3 Years Comprehensive Paint Warranty",
          recommendedInterval: "Total Vehicle Restoration",
          thumbnail: "/summer/rubbing_polishing.png",
          originalPrice: Math.round(fullBodyPaint * 1.25),
          basePrice: fullBodyPaint,
          checklist: [
            "Complete Body Dent Removal & Surface Preparation",
            "Full Vehicle Masking & Grade A Booth Painting",
            "Multi-Layer Basecoat + Double High-Gloss Clearcoat",
            "Free 3-Stage Ceramic Polish & Interior Deep Spa",
          ],
          moreCount: 4,
          allDetails: [
            "Complete Body Dent Removal & Precision Surface Sanding",
            "Full Vehicle Anti-Corrosion Primer",
            "Infrared Paint Booth Baking",
            "Mirror Finish 3-Stage Rubbing & High Gloss Glaze",
            "3 Years Written Warranty Against Fading, Cracking & Peeling",
          ],
        },
      ],
    },
  ];

  // 4. BRAKES & SUSPENSION
  const brakePadLabour = BOSCH_LABOUR_RATES.brakePadReplacementFR[segmentId];
  const brakeOverhaulF = BOSCH_LABOUR_RATES.brakeOverhaulFront[segmentId];
  const brakeOverhaulR = BOSCH_LABOUR_RATES.brakeOverhaulRear[segmentId];
  const suspensionOverhaul = BOSCH_LABOUR_RATES.frontSuspensionOverhaul[segmentId];

  const suspensionPackages: ServiceCategorySection[] = [
    {
      sectionTitle: "Brake Services",
      packages: [
        {
          id: "front-brake-pads",
          title: "Front Brake Pads Replacement",
          badge: "BOSCH GENUINE",
          badgeColor: "#10B981",
          timeTaken: "2 Hours",
          warranty: "1 Month / 1000 Kms Warranty",
          recommendedInterval: "Every 20,000 Kms or when squealing",
          thumbnail: "/brakes_clean.png",
          originalPrice: Math.round(brakePadLabour * 1.3),
          basePrice: brakePadLabour,
          checklist: [
            "Front Brake Calipers De-mounting & Cleaning",
            "Brake Disc Inspection & Thickness Measurement",
            "Brake Fluid Line Inspection & Bleeding",
            "Road Test & Braking Performance Verification",
          ],
          moreCount: 2,
          allDetails: [
            "Genuine Bosch Brake Pads Fitment",
            "Caliper Pin Greasing & Anti-Seize Lubrication",
            "Brake Disc Runout Measurement",
          ],
        },
        {
          id: "complete-brake-overhaul",
          title: "Complete 4-Wheel Brake Overhaul",
          badge: "MAX SAFETY",
          badgeColor: "#008ECF",
          timeTaken: "4 Hours",
          warranty: "3 Months Warranty",
          recommendedInterval: "Every 30,000 Kms or Low Braking Power",
          thumbnail: "/brakes_clean.png",
          originalPrice: Math.round((brakeOverhaulF + brakeOverhaulR + 400) * 1.25),
          basePrice: brakeOverhaulF + brakeOverhaulR + 400,
          checklist: [
            "Front Disc Caliper Overhaul & Piston Service",
            "Rear Drum Brake / Caliper Servicing & De-dusting",
            "Complete Hydraulic Brake Line Flushing & Bleeding (Bosch DOT 4)",
            "Handbrake Cable Tension Calibration",
          ],
          moreCount: 3,
          allDetails: [
            "4-Wheel Complete Brake Overhaul",
            "Bosch DOT 4 High-Boiling Brake Fluid Flush",
            "Caliper Pins, Springs & Retainers Cleaning",
            "Master Cylinder Hydraulic Pressure Check",
          ],
        },
      ],
    },
    {
      sectionTitle: "Suspension Care",
      packages: [
        {
          id: "front-suspension-overhaul",
          title: "Front Suspension Overhaul",
          badge: "SMOOTH RIDE",
          badgeColor: "#10B981",
          timeTaken: "6 Hours",
          warranty: "6 Months Warranty",
          recommendedInterval: "Rattling Noise, Bumpy Ride or Uneven Tyre Wear",
          thumbnail: "/suspension.png",
          originalPrice: Math.round(suspensionOverhaul * 1.3),
          basePrice: suspensionOverhaul,
          checklist: [
            "Strut Assembly Inspection & Shock Absorber Test",
            "Lower Control Arm & Ball Joint Health Check",
            "Link Rod & Sway Bar Bushing Inspection",
            "Tie Rod End & Steering Knuckle Calibration",
          ],
          moreCount: 3,
          allDetails: [
            "Complete Front Suspension Overhaul",
            "Precision Torque Mounting of All Bushings & Arms",
            "Complimentary 3D Wheel Alignment Check",
          ],
        },
      ],
    },
  ];

  // 5. TYRES & WHEEL CARE
  const tyresPackages: ServiceCategorySection[] = [
    {
      sectionTitle: "Wheel Care",
      packages: [
        {
          id: "wheel-alignment-balancing",
          title: "3D Computerized Wheel Alignment & Balancing",
          badge: "EXTEND TYRE LIFE",
          badgeColor: "#10B981",
          timeTaken: "1.5 Hours",
          warranty: "1 Month / 1000 Kms",
          recommendedInterval: "Every 5,000 Kms or Steering Pulling",
          thumbnail: "/wheel.png",
          originalPrice: Math.round((alignRate + balanceRate) * 1.3),
          basePrice: alignRate + balanceRate,
          checklist: [
            "3D Computerized High-Precision Laser Alignment",
            "4-Wheel Dynamic Computerized Balancing",
            "Tyre Pressure Calibration (Nitrogen Top-up)",
            "Steering Center & Camber/Caster Adjustment",
          ],
          moreCount: 2,
          allDetails: [
            "High Definition Laser Wheel Alignment Sensor Check",
            "Wheel Runout & Rim Bend Inspection",
            "Tyre Rotation Recommendation",
          ],
        },
      ],
    },
  ];

  // 6. CAR INSPECTIONS
  const scanPrice = BOSCH_LABOUR_RATES.diagnosticScanning[segmentId];
  const checkup30Price = BOSCH_LABOUR_RATES.generalCheckup30[segmentId];
  const secondHandPrice = Math.round((scanPrice + checkup30Price + 450) / 50) * 50;

  const inspectionPackages: ServiceCategorySection[] = [
    {
      sectionTitle: "Inspection Services",
      packages: [
        {
          id: "diagnostic-scanning",
          title: "OBD-II Diagnostic Computerized Scanning",
          badge: "BOSCH KTS SCAN",
          badgeColor: "#008ECF",
          timeTaken: "45 Mins",
          warranty: "Diagnostic Health Report",
          recommendedInterval: "Check Engine Light or Electrical Issue",
          thumbnail: "/packages/basic.jpg",
          originalPrice: Math.round(scanPrice * 1.3),
          basePrice: scanPrice,
          checklist: [
            "Full ECU Electronic Error Identification",
            "Live Sensor Data & Actual Value Diagnostic",
            "Fault Code Clearing & Reset",
            "Printed Diagnostic Health Report",
          ],
          moreCount: 2,
          allDetails: [
            "Engine, ABS, Airbag, BCM, EPS Diagnostics",
            "Error Identification, Erase Error, Actual Values Report",
          ],
        },
        {
          id: "30-point-checkup",
          title: "30-Point General Vehicle Checkup",
          badge: "PRE-TRIP CHECK",
          badgeColor: "#10B981",
          timeTaken: "1.5 Hours",
          warranty: "Detailed Health Report",
          recommendedInterval: "Before Long Trips or Periodic Check",
          thumbnail: "/packages/standard.jpg",
          originalPrice: Math.round(checkup30Price * 1.3),
          basePrice: checkup30Price,
          checklist: [
            "Under Chassis & Suspension Inspection",
            "Brake Pad & Disc Wear Check",
            "All Fluid Levels & Quality Check (Brake, Coolant, Oil)",
            "Battery Voltage & Alternator Charging Test",
          ],
          moreCount: 2,
          allDetails: [
            "Engine Bay, Brakes, Suspension, Electricals, Fluids 30-Point Checklist",
          ],
        },
        {
          id: "used-car-inspection",
          title: "100-Point Comprehensive Used Car Inspection",
          badge: "BUY WITH CONFIDENCE",
          badgeColor: "#10B981",
          timeTaken: "3 Hours",
          warranty: "Detailed 10-Page Inspection Report",
          recommendedInterval: "Buying or Selling a Pre-Owned Vehicle",
          thumbnail: "/packages/basic.jpg",
          originalPrice: Math.round(secondHandPrice * 1.3),
          basePrice: secondHandPrice,
          checklist: [
            "Accidental Damage & Chassis Structural Integrity",
            "Engine Compression & Transmission Health Test",
            "Electronic OBD-II Scanning with Bosch Scanner",
            "Paint Depth Meter Check for Repainted Panels",
          ],
          moreCount: 4,
          allDetails: [
            "100-Point Comprehensive Multi-System Physical & Computer Inspection",
            "Odometer Tampering & Service Record Check",
            "Road Test & Suspension Clunk Evaluation",
            "Estimated Repair Cost Valuation Report",
          ],
        },
      ],
    },
  ];

  // 7. CLUTCH OVERHAUL
  const clutchLabour = BOSCH_LABOUR_RATES.clutchCoverReplacement[segmentId];
  const gearboxLabour = BOSCH_LABOUR_RATES.gearboxRemovalRefit[segmentId];
  const totalClutchOverhaul = clutchLabour + gearboxLabour;

  const clutchPackages: ServiceCategorySection[] = [
    {
      sectionTitle: "Clutch Overhaul & Transmission",
      packages: [
        {
          id: "clutch-overhaul",
          title: "Complete Clutch Overhaul (Plate + Pressure + Bearing)",
          badge: "BOSCH GENUINE",
          badgeColor: "#008ECF",
          timeTaken: "6 Hours",
          warranty: "6 Months Warranty",
          recommendedInterval: "Hard Clutch, Slipping Gears or Low Pickup",
          thumbnail: "/packages/standard.jpg",
          originalPrice: Math.round(totalClutchOverhaul * 1.3),
          basePrice: totalClutchOverhaul,
          checklist: [
            "Gearbox / Transaxle Removal & Precision Re-fitment",
            "Clutch Plate, Pressure Plate & Release Bearing Overhaul",
            "Flywheel Facing & Runout Inspection",
            "Hydraulic Clutch Line Bleeding & Fluid Replacement",
          ],
          moreCount: 3,
          allDetails: [
            "Complete Clutch Assembly Overhaul",
            "Transmission Oil Top-up & Smooth Shift Calibration",
            "Road Test & Gear Engagement Verification",
          ],
        },
      ],
    },
  ];

  // 8. CAR SPA & CLEANING
  const washLabour = BOSCH_LABOUR_RATES.washingCleaning[segmentId];
  const deepSpaPrice = Math.round((washLabour * 2.8) / 50) * 50;

  const carSpaPackages: ServiceCategorySection[] = [
    {
      sectionTitle: "Spa & Wash Packages",
      packages: [
        {
          id: "deep-foam-wash",
          title: "Bosch Exterior Foam Wash & Interior Vacuuming",
          badge: "QUICK REFRESH",
          badgeColor: "#10B981",
          timeTaken: "1 Hour",
          warranty: "Quality Clean Guarantee",
          recommendedInterval: "Fortnightly Car Cleaning",
          thumbnail: "/summer/car_spa.png",
          originalPrice: Math.round(washLabour * 1.35),
          basePrice: washLabour,
          checklist: [
            "High Pressure Underbody Wash",
            "pH-Neutral Snow Foam Exterior Wash",
            "Deep Cabin Vacuuming (Carpet, Mats & Seats)",
            "Tyre & Dashboard Dressing Polish",
          ],
          moreCount: 2,
          allDetails: [
            "Complete Exterior High-Pressure Wash",
            "Interior Dashboard & Console Sanitization",
          ],
        },
        {
          id: "deep-interior-spa",
          title: "Deep Interior Spa & Anti-Bacterial Sanitization",
          badge: "DEEP CLEAN",
          badgeColor: "#008ECF",
          timeTaken: "4 Hours",
          warranty: "Germ-Free Guarantee",
          recommendedInterval: "Every 6 Months or Monsoon",
          thumbnail: "/summer/car_spa.png",
          originalPrice: Math.round(deepSpaPrice * 1.3),
          basePrice: deepSpaPrice,
          checklist: [
            "Upholstery & Fabric Seat Deep Foam Shampooing",
            "Roof Lining & Carpet High Pressure Extraction",
            "AC Vent Anti-Bacterial Steaming & Sanitization",
            "Leather Seat Conditioning & Dashboard UV Protection",
          ],
          moreCount: 3,
          allDetails: [
            "Deep Interior Extraction & Stain Removal",
            "Bacterial & Odour Neutralization Treatment",
          ],
        },
      ],
    },
  ];

  // 9. BATTERIES
  const batteryMultiplier = segmentId.startsWith("1") ? 0 : segmentId.startsWith("2") ? 600 : segmentId.startsWith("3") ? 1400 : 3200;
  const batteryPrice = 3850 + batteryMultiplier;
  const alternatorCheckPrice = Math.round((scanRate + 350) / 50) * 50;

  const batteryPackages: ServiceCategorySection[] = [
    {
      sectionTitle: "Batteries & Electrical",
      packages: [
        {
          id: "bosch-battery-replace",
          title: "Bosch Maintenance-Free Heavy Duty Battery",
          badge: "55M WARRANTY",
          badgeColor: "#10B981",
          timeTaken: "45 Mins",
          warranty: "Up to 55 Months Official Warranty",
          recommendedInterval: "Battery Age > 3 Years or Starting Trouble",
          thumbnail: "/images/exide-epiq.png",
          originalPrice: Math.round(batteryPrice * 1.25),
          basePrice: batteryPrice,
          checklist: [
            "Genuine Bosch High-Cranking Maintenance-Free Battery",
            "Free Doorstep Delivery & Installation",
            "Old Battery Buyback Rebate Included",
            "Anti-Corrosion Petroleum Terminal Gel Treatment",
          ],
          moreCount: 2,
          allDetails: [
            "High-Cranking Bosch Silver Alloy Technology",
            "Alternator Charging Rate & Voltage Regulator Test",
          ],
        },
        {
          id: "alternator-starter-check",
          title: "Alternator & Starter Motor Health Diagnostic",
          badge: "ELECTRICAL",
          badgeColor: "#008ECF",
          timeTaken: "1.5 Hours",
          warranty: "Detailed Electrical Report",
          recommendedInterval: "Battery Drain or Slow Engine Cranking",
          thumbnail: "/packages/ecu_scanner_inspection.png",
          originalPrice: Math.round(alternatorCheckPrice * 1.3),
          basePrice: alternatorCheckPrice,
          checklist: [
            "Alternator Output Voltage & Diode Ripple Check",
            "Starter Motor Load Test & Solenoid Operation",
            "Parasitic Dark Current Battery Drain Test",
            "Drive Belt Tension & Pulley Alignment Check",
          ],
          moreCount: 2,
          allDetails: [
            "Complete Electrical Charging & Starting System Diagnosis",
            "Wiring Harness Inspection for Short Circuits",
          ],
        },
      ],
    },
  ];

  // 10. DETAILING & CERAMIC COATING
  const rubbingBase = segmentId.startsWith("1") ? 1850 : segmentId.startsWith("2") ? 2450 : segmentId.startsWith("3") ? 2950 : 3950;
  const teflonBase = Math.round((rubbingBase * 1.35) / 50) * 50;
  const ceramicBase = segmentId.startsWith("1") ? 7500 : segmentId.startsWith("2") ? 9500 : segmentId.startsWith("3") ? 12000 : 16500;

  const detailingPackages: ServiceCategorySection[] = [
    {
      sectionTitle: "Paint Protection & Detailing",
      packages: [
        {
          id: "exterior-rubbing-polish",
          title: "Full Exterior 3M Machine Rubbing & High-Gloss Polish",
          badge: "SWIRL REMOVAL",
          badgeColor: "#10B981",
          timeTaken: "3 Hours",
          warranty: "Mirror Gloss Finish",
          recommendedInterval: "Every 6 Months for Paint Longevity",
          thumbnail: "/summer/rubbing_polishing.png",
          basePrice: rubbingBase,
          checklist: [
            "Multi-Stage Rotary Machine Compound Rubbing",
            "Swirl Mark & Minor Scratch Removal",
            "High-Gloss Carnauba Wax Protective Glaze",
            "Tyre Dressing & Chrome Trim Restoration",
          ],
          moreCount: 2,
          allDetails: [
            "3-Stage Paint Correction & Surface Decontamination",
            "Mirror-Like Optical Clarity Enhancement",
          ],
        },
        {
          id: "teflon-coating",
          title: "Bosch All-Weather Teflon Paint Protection Coating",
          badge: "POPULAR",
          badgeColor: "#008ECF",
          timeTaken: "4 Hours",
          warranty: "6 Months Paint Warranty",
          recommendedInterval: "Before Summer or Monsoon Season",
          thumbnail: "/packages/meguiars_teflon_coating.png",
          basePrice: teflonBase,
          checklist: [
            "Complete Surface Clay-Bar Decontamination",
            "Hydrophobic Teflon Sealant Application",
            "UV Ray & Road Tar Chemical Protection Barrier",
            "Water Beading & Paint Fading Prevention",
          ],
          moreCount: 2,
          allDetails: [
            "Hydrophobic Sealant Layer for High Repellency",
            "Enhanced Gloss & Protection Against Bird Droppings",
          ],
        },
        {
          id: "9h-ceramic-coating",
          title: "9H Ultra-Gloss Nano Ceramic Coating (2-Year Warranty)",
          badge: "PREMIUM 9H",
          badgeColor: "#AA66FF",
          timeTaken: "2 Days",
          warranty: "2 Years Official Warranty",
          recommendedInterval: "Ultimate Long-Term Paint Armor",
          thumbnail: "/packages/meguiars_ceramic_coating.png",
          basePrice: ceramicBase,
          checklist: [
            "Full Multi-Stage Paint Correction & Surface Levelling",
            "Dual-Layer 9H Hardness Nano Ceramic Application",
            "Extreme 110° Hydrophobic Water Repellency",
            "Free 6-Month Ceramic Maintenance Top-Up",
          ],
          moreCount: 3,
          allDetails: [
            "Deep Diamond Gloss & 9H Scratch Resistance",
            "Protection Against Chemical Etching, Oxidation & UV Rays",
            "Official Warranty Certificate with Periodic Inspections",
          ],
        },
      ],
    },
  ];

  // 11. WINDSHIELDS & LIGHTS
  const windshieldBase = segmentId.startsWith("1") ? 4250 : segmentId.startsWith("2") ? 5450 : segmentId.startsWith("3") ? 6950 : 11500;
  const wiperBase = segmentId.startsWith("1") ? 750 : segmentId.startsWith("2") ? 950 : segmentId.startsWith("3") ? 1250 : 1650;
  const headlightBase = 650;

  const windshieldPackages: ServiceCategorySection[] = [
    {
      sectionTitle: "Windshield, Glass & Lights",
      packages: [
        {
          id: "front-windshield-replace",
          title: "Front Windshield OEM Glass Replacement & Bonding",
          badge: "AIS OEM GLASS",
          badgeColor: "#10B981",
          timeTaken: "3 Hours",
          warranty: "1 Year Leakage Warranty",
          recommendedInterval: "Cracked or Chipped Windshield",
          thumbnail: "/packages/front_windshield_replacement.png",
          originalPrice: Math.round(windshieldBase * 1.25),
          basePrice: windshieldBase,
          checklist: [
            "AIS / Saint-Gobain OEM Certified Laminated Safety Glass",
            "High-Tensile Polyurethane Adhesive Sealant",
            "1-Year Water Leakage & Bonding Seal Warranty",
            "Rear View Mirror & Fastag Precision Re-Fitment",
          ],
          moreCount: 2,
          allDetails: [
            "OEM Standard Glass with Acoustic & UV Filtering",
            "Curing & Water Leak Test Guaranteed",
          ],
        },
        {
          id: "wiper-blade-pair",
          title: "Bosch Aerotwin Frameless Wiper Blades (Pair)",
          badge: "BOSCH AEROTWIN",
          badgeColor: "#008ECF",
          timeTaken: "20 Mins",
          warranty: "Streak-Free Guarantee",
          recommendedInterval: "Before Monsoon or Every 12 Months",
          thumbnail: "/packages/windshield_spray.png",
          originalPrice: Math.round(wiperBase * 1.3),
          basePrice: wiperBase,
          checklist: [
            "Genuine Bosch Aerotwin Dual-Rubber Blades",
            "Streak-Free & Silent All-Weather Wiping",
            "Free Installation & Washer Jet Calibration",
            "Windshield Washer Reservoir Fluid Top-Up",
          ],
          moreCount: 2,
          allDetails: [
            "Aerodynamic Spoiler for High-Speed Performance",
            "Precision Cut Natural Rubber with Graphite Coating",
          ],
        },
        {
          id: "headlight-restoration",
          title: "Headlight De-Yellowing & UV Clarity Restoration",
          badge: "NIGHT VISION",
          badgeColor: "#F59E0B",
          timeTaken: "1 Hour",
          warranty: "6 Months Clarity Warranty",
          recommendedInterval: "Foggy, Yellowed or Dull Headlights",
          thumbnail: "/packages/front_headlight.png",
          originalPrice: Math.round(headlightBase * 1.35),
          basePrice: headlightBase,
          checklist: [
            "Multi-Stage Wet Sanding of Oxidation Layer",
            "Rotary Optical Lens Compounding & Polish",
            "UV Shield Clear Polymer Sealant Coating",
            "30%+ Improved Night Driving Beam Throw",
          ],
          moreCount: 2,
          allDetails: [
            "Restores 95%+ of Original Lens Clarity",
            "Prevents Fast Re-Yellowing from Sun Exposure",
          ],
        },
      ],
    },
  ];

  // 12. INSURANCE CLAIMS
  const insurancePackages: ServiceCategorySection[] = [
    {
      sectionTitle: "Insurance Claims & Accidental Repair",
      packages: [
        {
          id: "cashless-claim-assistance",
          title: "Cashless Accidental Insurance Claim & Survey Assistance",
          badge: "ZERO DEPOSIT",
          badgeColor: "#10B981",
          timeTaken: "Same Day Intimation",
          warranty: "Seamless Claim Processing",
          recommendedInterval: "Post-Accident Damage or Dents",
          thumbnail: "/packages/full_body_dent_paint.png",
          originalPrice: 1500,
          basePrice: 0,
          checklist: [
            "100% Cashless Tie-ups with All Major Insurance Companies",
            "Digital Claim Registration & On-Site Surveyor Coordination",
            "Genuine Bosch OEM Parts Replacement",
            "Zero Deductible Advice & Claim Assistance",
          ],
          moreCount: 3,
          allDetails: [
            "End-to-end documentation & claim filing",
            "Surveyor assessment & digital approval follow-up",
            "Quality paint booth finishing with color match warranty",
          ],
        },
        {
          id: "accidental-damage-assessment",
          title: "Accidental Damage Repair & Structural Alignment",
          badge: "CERTIFIED REPAIR",
          badgeColor: "#008ECF",
          timeTaken: "2 - 5 Days",
          warranty: "OEM Structural Warranty",
          recommendedInterval: "Structural or Body Impact",
          thumbnail: "/summer/bumper_paint.png",
          originalPrice: 2500,
          basePrice: 1500,
          checklist: [
            "Laser Chassis Measurement & Alignment Inspection",
            "Internal Mechanical & Suspension Impact Assessment",
            "Itemized Surveyor Repair & Parts Cost Estimate",
            "Free Inspection Waiver with Claim Execution",
          ],
          moreCount: 2,
          allDetails: [
            "Full structural integrity inspection",
            "Complete repair estimate with genuine part numbers",
          ],
        },
      ],
    },
  ];

  return {
    "car-services": [{ sectionTitle: "Service Packages", packages: scheduledPackages }],
    "ac-service": acPackages,
    "batteries": batteryPackages,
    "tyres-wheel": tyresPackages,
    "tyres": tyresPackages,
    "denting-painting": dentingPackages,
    "detailing": detailingPackages,
    "car-spa": carSpaPackages,
    "car-inspections": inspectionPackages,
    "inspection": inspectionPackages,
    "windshield-glass": windshieldPackages,
    "suspension-fitments": suspensionPackages,
    "clutch-body": clutchPackages,
    "insurance-claims": insurancePackages,
  };
}
