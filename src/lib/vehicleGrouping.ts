// Bosch Car Service Vehicle Grouping Matrix (Handbook Version 2022 A - Page 6)

export type BoschSegmentId = "1.1" | "1.2" | "2.1" | "2.2" | "3.1" | "3.2" | "4.1" | "4.2";

export interface BoschVehicleSegment {
  id: BoschSegmentId;
  mainGroup: string;
  subGroup: string;
  code: string;
  title: string;
  shortLabel: string;
  description: string;
  badgeBg: string;
  badgeText: string;
}

export const BOSCH_SEGMENTS: Record<BoschSegmentId, BoschVehicleSegment> = {
  "1.1": {
    id: "1.1",
    mainGroup: "Group 1. Hatchback",
    subGroup: "1.1 Entry",
    code: "Grp 1.1",
    title: "Hatchback Entry",
    shortLabel: "Hatchback Entry",
    description: "Compact & entry hatchbacks (Alto, Kwid, Eon, Wagon R, etc.)",
    badgeBg: "rgba(16, 185, 129, 0.12)",
    badgeText: "#059669",
  },
  "1.2": {
    id: "1.2",
    mainGroup: "Group 1. Hatchback",
    subGroup: "1.2 Regular",
    code: "Grp 1.2",
    title: "Hatchback Regular",
    shortLabel: "Hatchback Regular",
    description: "Premium hatchbacks & sub-compacts (Swift, i20, Baleno, Tiago, Polo, etc.)",
    badgeBg: "rgba(59, 130, 246, 0.12)",
    badgeText: "#2563EB",
  },
  "2.1": {
    id: "2.1",
    mainGroup: "Group 2. Sedan",
    subGroup: "2.1 Entry",
    code: "Grp 2.1",
    title: "Sedan Entry",
    shortLabel: "Sedan Entry",
    description: "Compact sedans (Dzire, Amaze, Aura, Tigor, Etios, etc.)",
    badgeBg: "rgba(139, 92, 246, 0.12)",
    badgeText: "#7C3AED",
  },
  "2.2": {
    id: "2.2",
    mainGroup: "Group 2. Sedan",
    subGroup: "2.2 Regular",
    code: "Grp 2.2",
    title: "Sedan Regular",
    shortLabel: "Sedan Regular",
    description: "Mid-size & executive sedans (City, Verna, Ciaz, Vento, Slavia, Virtus, etc.)",
    badgeBg: "rgba(236, 72, 153, 0.12)",
    badgeText: "#DB2777",
  },
  "3.1": {
    id: "3.1",
    mainGroup: "Group 3. MUV / SUV",
    subGroup: "3.1 Entry",
    code: "Grp 3.1",
    title: "MUV / SUV Entry",
    shortLabel: "Compact SUV / MUV",
    description: "Compact SUVs & family MUVs (Brezza, Nexon, Ertiga, Venue, EcoSport, etc.)",
    badgeBg: "rgba(245, 158, 11, 0.12)",
    badgeText: "#D97706",
  },
  "3.2": {
    id: "3.2",
    mainGroup: "Group 3. MUV / SUV",
    subGroup: "3.2 Regular",
    code: "Grp 3.2",
    title: "MUV / SUV Regular",
    shortLabel: "Mid / Full SUV",
    description: "Mid & full-size SUVs (Creta, Seltos, Scorpio, Thar, XUV700, Innova, Fortuner, etc.)",
    badgeBg: "rgba(239, 68, 68, 0.12)",
    badgeText: "#DC2626",
  },
  "4.1": {
    id: "4.1",
    mainGroup: "Group 4. Luxury",
    subGroup: "4.1 Regular",
    code: "Grp 4.1",
    title: "Luxury Regular",
    shortLabel: "Executive Luxury",
    description: "Executive luxury & imported D-segment (Octavia, Superb, Kodiaq, Tiguan, Endeavour, etc.)",
    badgeBg: "rgba(99, 102, 241, 0.12)",
    badgeText: "#4F46E5",
  },
  "4.2": {
    id: "4.2",
    mainGroup: "Group 4. Luxury",
    subGroup: "4.2 Premium",
    code: "Grp 4.2",
    title: "Luxury Premium",
    shortLabel: "Premium Luxury",
    description: "All Mercedes-Benz, BMW, Audi, Range Rover, Land Rover, Jaguar, Porsche, Volvo",
    badgeBg: "rgba(0, 142, 207, 0.12)",
    badgeText: "#008ECF",
  },
};

export interface CarBrandInfo {
  name: string;
  popular: boolean;
  models: { name: string; segment: BoschSegmentId }[];
}

export const CAR_BRANDS_CATALOG: CarBrandInfo[] = [
  {
    name: "Maruti Suzuki",
    popular: true,
    models: [
      { name: "Swift", segment: "1.2" },
      { name: "Baleno", segment: "1.2" },
      { name: "Brezza", segment: "3.1" },
      { name: "Dzire", segment: "2.1" },
      { name: "Swift Dzire", segment: "2.1" },
      { name: "Ertiga", segment: "3.1" },
      { name: "Wagon R", segment: "1.1" },
      { name: "Alto", segment: "1.1" },
      { name: "Alto 800", segment: "1.1" },
      { name: "Alto K10", segment: "1.1" },
      { name: "Celerio", segment: "1.1" },
      { name: "Grand Vitara", segment: "3.2" },
      { name: "Fronx", segment: "3.1" },
      { name: "Ciaz", segment: "2.2" },
      { name: "S-Cross", segment: "3.2" },
      { name: "Ignis", segment: "1.2" },
      { name: "XL6", segment: "3.1" },
      { name: "Jimny", segment: "3.1" },
      { name: "Invicto", segment: "3.2" },
      { name: "Eeco", segment: "1.1" },
      { name: "Omni", segment: "1.1" },
      { name: "800", segment: "1.1" },
      { name: "Zen", segment: "1.1" },
      { name: "Zen Estilo", segment: "1.1" },
      { name: "Ritz", segment: "1.2" },
      { name: "SX4", segment: "2.2" },
      { name: "Esteem", segment: "2.1" },
      { name: "Gypsy", segment: "3.1" },
      { name: "Kizashi", segment: "2.1" },
    ],
  },
  {
    name: "Hyundai",
    popular: true,
    models: [
      { name: "Creta", segment: "3.2" },
      { name: "i20", segment: "1.2" },
      { name: "Elite i20", segment: "1.2" },
      { name: "i20 N Line", segment: "1.2" },
      { name: "Venue", segment: "1.2" },
      { name: "Venue N Line", segment: "1.2" },
      { name: "Verna", segment: "2.1" },
      { name: "Grand i10 Nios", segment: "1.2" },
      { name: "Grand i10", segment: "1.2" },
      { name: "i10", segment: "1.2" },
      { name: "Santro", segment: "1.2" },
      { name: "Exter", segment: "3.1" },
      { name: "Aura", segment: "2.1" },
      { name: "Xcent", segment: "2.1" },
      { name: "Accent", segment: "2.1" },
      { name: "Alcazar", segment: "3.2" },
      { name: "Tucson", segment: "3.2" },
      { name: "Santa Fe", segment: "3.2" },
      { name: "Elantra", segment: "2.2" },
      { name: "Eon", segment: "1.1" },
      { name: "Kona Electric", segment: "3.2" },
      { name: "Ioniq 5", segment: "4.1" },
    ],
  },
  {
    name: "Tata",
    popular: true,
    models: [
      { name: "Nexon", segment: "3.1" },
      { name: "Nexon EV", segment: "3.1" },
      { name: "Punch", segment: "3.1" },
      { name: "Punch EV", segment: "3.1" },
      { name: "Harrier", segment: "3.2" },
      { name: "Safari", segment: "3.2" },
      { name: "Tiago", segment: "1.2" },
      { name: "Tiago EV", segment: "1.2" },
      { name: "Tigor", segment: "2.1" },
      { name: "Tigor EV", segment: "2.1" },
      { name: "Altroz", segment: "1.2" },
      { name: "Curvv", segment: "3.1" },
      { name: "Hexa", segment: "3.2" },
      { name: "Aria", segment: "3.2" },
      { name: "Sumo", segment: "3.1" },
      { name: "Nano", segment: "1.1" },
      { name: "Indica", segment: "1.2" },
      { name: "Indica Vista", segment: "1.2" },
      { name: "Indigo", segment: "2.1" },
      { name: "Indigo Manza", segment: "2.1" },
      { name: "Bolt", segment: "1.2" },
      { name: "Zest", segment: "2.1" },
      { name: "Xenon", segment: "1.2" },
    ],
  },
  {
    name: "Mahindra",
    popular: true,
    models: [
      { name: "Thar", segment: "3.2" },
      { name: "Thar Roxx", segment: "3.2" },
      { name: "Scorpio-N", segment: "3.2" },
      { name: "Scorpio Classic", segment: "3.2" },
      { name: "Scorpio", segment: "3.2" },
      { name: "XUV700", segment: "3.2" },
      { name: "XUV500", segment: "3.2" },
      { name: "XUV3XO", segment: "3.1" },
      { name: "XUV300", segment: "3.1" },
      { name: "XUV400", segment: "3.1" },
      { name: "Bolero", segment: "3.1" },
      { name: "Bolero Neo", segment: "3.1" },
      { name: "Marazzo", segment: "3.2" },
      { name: "Xylo", segment: "3.1" },
      { name: "TUV300", segment: "3.1" },
      { name: "Quanto", segment: "3.1" },
      { name: "Verito", segment: "2.1" },
      { name: "Verito Vibe", segment: "1.2" },
      { name: "Logan", segment: "2.1" },
      { name: "Alturas G4", segment: "4.1" },
    ],
  },
  {
    name: "Honda",
    popular: true,
    models: [
      { name: "City", segment: "2.2" },
      { name: "City Hybrid", segment: "2.2" },
      { name: "Amaze", segment: "2.1" },
      { name: "Elevate", segment: "3.1" },
      { name: "Civic", segment: "2.2" },
      { name: "Accord", segment: "2.2" },
      { name: "CR-V", segment: "3.2" },
      { name: "WR-V", segment: "3.1" },
      { name: "BR-V", segment: "3.1" },
      { name: "Mobilio", segment: "3.1" },
      { name: "Jazz", segment: "1.2" },
      { name: "Brio", segment: "1.2" },
    ],
  },
  {
    name: "Toyota",
    popular: true,
    models: [
      { name: "Innova", segment: "3.2" },
      { name: "Innova Crysta", segment: "3.2" },
      { name: "Innova Hycross", segment: "3.2" },
      { name: "Fortuner", segment: "3.2" },
      { name: "Fortuner Legender", segment: "3.2" },
      { name: "Glanza", segment: "1.2" },
      { name: "Urban Cruiser", segment: "3.1" },
      { name: "Urban Cruiser Hyryder", segment: "3.2" },
      { name: "Urban Cruiser Taisor", segment: "3.1" },
      { name: "Hilux", segment: "3.2" },
      { name: "Camry", segment: "2.2" },
      { name: "Corolla Altis", segment: "2.2" },
      { name: "Corolla", segment: "2.2" },
      { name: "Yaris", segment: "2.2" },
      { name: "Etios", segment: "2.1" },
      { name: "Etios Liva", segment: "1.2" },
      { name: "Etios Cross", segment: "1.2" },
      { name: "Qualis", segment: "3.1" },
      { name: "Vellfire", segment: "4.2" },
      { name: "Land Cruiser", segment: "4.2" },
    ],
  },
  {
    name: "Kia",
    popular: true,
    models: [
      { name: "Seltos", segment: "3.2" },
      { name: "Sonet", segment: "3.1" },
      { name: "Carens", segment: "3.1" },
      { name: "Carnival", segment: "4.1" },
      { name: "EV6", segment: "4.2" },
      { name: "EV9", segment: "4.2" },
    ],
  },
  {
    name: "Volkswagen",
    popular: true,
    models: [
      { name: "Polo", segment: "1.2" },
      { name: "Vento", segment: "2.2" },
      { name: "Virtus", segment: "2.2" },
      { name: "Taigun", segment: "3.1" },
      { name: "Tiguan", segment: "4.1" },
      { name: "Jetta", segment: "4.1" },
      { name: "Passat", segment: "4.1" },
      { name: "Ameo", segment: "2.2" },
      { name: "T-Roc", segment: "4.1" },
    ],
  },
  {
    name: "Skoda",
    popular: true,
    models: [
      { name: "Slavia", segment: "2.2" },
      { name: "Kushaq", segment: "3.1" },
      { name: "Rapid", segment: "2.2" },
      { name: "Octavia", segment: "4.1" },
      { name: "Superb", segment: "4.1" },
      { name: "Kodiaq", segment: "4.1" },
      { name: "Laura", segment: "2.2" },
      { name: "Fabia", segment: "1.2" },
      { name: "Yeti", segment: "4.1" },
    ],
  },
  {
    name: "Ford",
    popular: false,
    models: [
      { name: "EcoSport", segment: "3.1" },
      { name: "Endeavour", segment: "4.1" },
      { name: "Figo", segment: "1.2" },
      { name: "Freestyle", segment: "2.2" },
      { name: "Aspire", segment: "2.2" },
      { name: "Fiesta", segment: "2.2" },
      { name: "Ikon", segment: "2.1" },
      { name: "Fusion", segment: "1.2" },
      { name: "Mondeo", segment: "4.1" },
    ],
  },
  {
    name: "Renault",
    popular: false,
    models: [
      { name: "Kwid", segment: "1.1" },
      { name: "Triber", segment: "1.2" },
      { name: "Kiger", segment: "3.1" },
      { name: "Duster", segment: "3.2" },
      { name: "Captur", segment: "3.2" },
      { name: "Lodgy", segment: "3.1" },
      { name: "Pulse", segment: "1.2" },
      { name: "Scala", segment: "2.2" },
      { name: "Fluence", segment: "2.2" },
      { name: "Koleos", segment: "4.1" },
    ],
  },
  {
    name: "Chevrolet",
    popular: false,
    models: [
      { name: "Beat", segment: "1.1" },
      { name: "Spark", segment: "1.1" },
      { name: "Cruze", segment: "2.2" },
      { name: "Sail", segment: "2.1" },
      { name: "Sail U-VA", segment: "1.2" },
      { name: "Aveo", segment: "2.1" },
      { name: "Aveo U-VA", segment: "1.1" },
      { name: "Optra", segment: "2.1" },
      { name: "Optra Magnum", segment: "2.1" },
      { name: "Tavera", segment: "3.1" },
      { name: "Enjoy", segment: "3.1" },
      { name: "Captiva", segment: "3.2" },
    ],
  },
  {
    name: "Nissan",
    popular: false,
    models: [
      { name: "Magnite", segment: "3.1" },
      { name: "Kicks", segment: "3.2" },
      { name: "Terrano", segment: "3.2" },
      { name: "Sunny", segment: "2.1" },
      { name: "Micra", segment: "1.2" },
      { name: "Datsun GO", segment: "1.1" },
      { name: "Datsun GO+", segment: "1.1" },
      { name: "Datsun redi-GO", segment: "1.1" },
      { name: "X-Trail", segment: "4.1" },
    ],
  },
  {
    name: "MG",
    popular: false,
    models: [
      { name: "Hector", segment: "3.2" },
      { name: "Hector Plus", segment: "3.2" },
      { name: "Astor", segment: "3.2" },
      { name: "ZS EV", segment: "3.2" },
      { name: "Comet EV", segment: "1.1" },
      { name: "Gloster", segment: "4.1" },
      { name: "Windsor EV", segment: "3.1" },
    ],
  },
  {
    name: "Fiat",
    popular: false,
    models: [
      { name: "Punto", segment: "1.2" },
      { name: "Linea", segment: "2.2" },
      { name: "Palio", segment: "1.1" },
      { name: "Avventura", segment: "3.2" },
      { name: "Urban Cross", segment: "3.2" },
    ],
  },
  {
    name: "Jeep",
    popular: false,
    models: [
      { name: "Compass", segment: "3.2" },
      { name: "Meridian", segment: "3.2" },
      { name: "Wrangler", segment: "3.2" },
      { name: "Grand Cherokee", segment: "4.1" },
    ],
  },
  {
    name: "Mercedes-Benz",
    popular: false,
    models: [
      { name: "A-Class", segment: "4.2" },
      { name: "C-Class", segment: "4.2" },
      { name: "E-Class", segment: "4.2" },
      { name: "S-Class", segment: "4.2" },
      { name: "GLA", segment: "4.2" },
      { name: "GLB", segment: "4.2" },
      { name: "GLC", segment: "4.2" },
      { name: "GLE", segment: "4.2" },
      { name: "GLS", segment: "4.2" },
      { name: "G-Class", segment: "4.2" },
      { name: "EQE", segment: "4.2" },
      { name: "EQS", segment: "4.2" },
    ],
  },
  {
    name: "BMW",
    popular: false,
    models: [
      { name: "2 Series", segment: "4.2" },
      { name: "3 Series", segment: "4.2" },
      { name: "5 Series", segment: "4.2" },
      { name: "7 Series", segment: "4.2" },
      { name: "X1", segment: "4.2" },
      { name: "X3", segment: "4.2" },
      { name: "X5", segment: "4.2" },
      { name: "X7", segment: "4.2" },
      { name: "iX1", segment: "4.2" },
      { name: "i4", segment: "4.2" },
      { name: "i7", segment: "4.2" },
    ],
  },
  {
    name: "Audi",
    popular: false,
    models: [
      { name: "A4", segment: "4.2" },
      { name: "A6", segment: "4.2" },
      { name: "A8 L", segment: "4.2" },
      { name: "Q3", segment: "4.2" },
      { name: "Q5", segment: "4.2" },
      { name: "Q7", segment: "4.2" },
      { name: "Q8", segment: "4.2" },
      { name: "e-tron", segment: "4.2" },
    ],
  },
  {
    name: "Land Rover / Range Rover",
    popular: false,
    models: [
      { name: "Range Rover Evoque", segment: "4.2" },
      { name: "Range Rover Velar", segment: "4.2" },
      { name: "Range Rover Sport", segment: "4.2" },
      { name: "Range Rover", segment: "4.2" },
      { name: "Defender", segment: "4.2" },
      { name: "Discovery Sport", segment: "4.2" },
      { name: "Discovery", segment: "4.2" },
    ],
  },
  {
    name: "Jaguar",
    popular: false,
    models: [
      { name: "XE", segment: "4.2" },
      { name: "XF", segment: "4.2" },
      { name: "XJ", segment: "4.2" },
      { name: "F-Pace", segment: "4.2" },
      { name: "F-Type", segment: "4.2" },
      { name: "I-Pace", segment: "4.2" },
    ],
  },
  {
    name: "Volvo",
    popular: false,
    models: [
      { name: "XC40", segment: "4.2" },
      { name: "XC60", segment: "4.2" },
      { name: "XC90", segment: "4.2" },
      { name: "S60", segment: "4.2" },
      { name: "S90", segment: "4.2" },
      { name: "C40 Recharge", segment: "4.2" },
    ],
  },
  {
    name: "Porsche",
    popular: false,
    models: [
      { name: "Macan", segment: "4.2" },
      { name: "Cayenne", segment: "4.2" },
      { name: "Panamera", segment: "4.2" },
      { name: "Taycan", segment: "4.2" },
      { name: "911", segment: "4.2" },
      { name: "718 Cayman / Boxster", segment: "4.2" },
    ],
  },
];

/**
 * Resolves any brand and model string into its official Bosch Segment
 */
export function getCarSegment(brand?: string | null, model?: string | null): BoschVehicleSegment {
  if (!brand || !model) {
    return BOSCH_SEGMENTS["1.2"]; // Default fallback to Hatchback Regular
  }

  const cleanBrand = brand.toLowerCase().trim();
  const cleanModel = model.toLowerCase().trim();

  // 1. Check luxury brands directly (Group 4.2 Premium)
  if (
    cleanBrand.includes("mercedes") ||
    cleanBrand.includes("benz") ||
    cleanBrand.includes("bmw") ||
    cleanBrand.includes("audi") ||
    cleanBrand.includes("range rover") ||
    cleanBrand.includes("land rover") ||
    cleanBrand.includes("jaguar") ||
    cleanBrand.includes("porsche") ||
    cleanBrand.includes("volvo")
  ) {
    return BOSCH_SEGMENTS["4.2"];
  }

  // 2. Search catalog
  const matchedBrand = CAR_BRANDS_CATALOG.find(
    (b) => b.name.toLowerCase() === cleanBrand || cleanBrand.includes(b.name.toLowerCase())
  );

  if (matchedBrand) {
    const matchedModel = matchedBrand.models.find(
      (m) =>
        cleanModel === m.name.toLowerCase() ||
        cleanModel.includes(m.name.toLowerCase()) ||
        m.name.toLowerCase().includes(cleanModel)
    );

    if (matchedModel) {
      return BOSCH_SEGMENTS[matchedModel.segment];
    }
  }

  // 3. Fallback keywords inference
  if (
    cleanModel.includes("alto") ||
    cleanModel.includes("800") ||
    cleanModel.includes("omni") ||
    cleanModel.includes("eon") ||
    cleanModel.includes("kwid") ||
    cleanModel.includes("spark") ||
    cleanModel.includes("nano") ||
    cleanModel.includes("wagon")
  ) {
    return BOSCH_SEGMENTS["1.1"];
  }

  if (
    cleanModel.includes("dzire") ||
    cleanModel.includes("amaze") ||
    cleanModel.includes("aura") ||
    cleanModel.includes("tigor") ||
    cleanModel.includes("xcent") ||
    cleanModel.includes("etios")
  ) {
    return BOSCH_SEGMENTS["2.1"];
  }

  if (
    cleanModel.includes("city") ||
    cleanModel.includes("verna") ||
    cleanModel.includes("ciaz") ||
    cleanModel.includes("virtus") ||
    cleanModel.includes("slavia") ||
    cleanModel.includes("vento") ||
    cleanModel.includes("elantra")
  ) {
    return BOSCH_SEGMENTS["2.2"];
  }

  if (
    cleanModel.includes("brezza") ||
    cleanModel.includes("nexon") ||
    cleanModel.includes("punch") ||
    cleanModel.includes("venue") ||
    cleanModel.includes("sonet") ||
    cleanModel.includes("bolero") ||
    cleanModel.includes("ecosport") ||
    cleanModel.includes("magnite") ||
    cleanModel.includes("kiger") ||
    cleanModel.includes("ertiga")
  ) {
    return BOSCH_SEGMENTS["3.1"];
  }

  if (
    cleanModel.includes("creta") ||
    cleanModel.includes("seltos") ||
    cleanModel.includes("scorpio") ||
    cleanModel.includes("thar") ||
    cleanModel.includes("xuv700") ||
    cleanModel.includes("xuv500") ||
    cleanModel.includes("innova") ||
    cleanModel.includes("fortuner") ||
    cleanModel.includes("harrier") ||
    cleanModel.includes("safari") ||
    cleanModel.includes("compass") ||
    cleanModel.includes("duster") ||
    cleanModel.includes("hector")
  ) {
    return BOSCH_SEGMENTS["3.2"];
  }

  if (
    cleanModel.includes("octavia") ||
    cleanModel.includes("superb") ||
    cleanModel.includes("kodiaq") ||
    cleanModel.includes("tiguan") ||
    cleanModel.includes("endeavour") ||
    cleanModel.includes("passat")
  ) {
    return BOSCH_SEGMENTS["4.1"];
  }

  // Default to standard regular segment
  return BOSCH_SEGMENTS["1.2"];
}
