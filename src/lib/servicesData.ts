// Service Categories matching GoMechanic & Bosch reference
export interface ServiceCategory {
  id: string;
  title: string;
  desc: string;
  iconUrl: string;
  color: string;
  badge: string | null;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "car-services",
    title: "Car Services",
    desc: "Periodic oil change, filter replacement & total engine health check.",
    iconUrl: "https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/category_icons_new/new_icons/car%20service%204.png",
    color: "#008ECF",
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
    color: "#008ECF",
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

export function getCategoryByIdOrTitle(slugOrTitle: string): ServiceCategory | undefined {
  if (!slugOrTitle) return undefined;
  const lower = slugOrTitle.toLowerCase().trim();
  return SERVICE_CATEGORIES.find(
    (c) => c.id.toLowerCase() === lower || c.title.toLowerCase() === lower
  );
}
