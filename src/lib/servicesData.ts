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
    iconUrl: "/category-icons-3d/car-services.webp",
    color: "#008ECF",
    badge: null,
  },
  {
    id: "ac-service",
    title: "AC Service & Repair",
    desc: "Gas refill, cooling coil cleaning & compressor diagnostics.",
    iconUrl: "/category-icons-3d/ac-service.webp",
    color: "#0066FF",
    badge: null,
  },
  {
    id: "batteries",
    title: "Batteries",
    desc: "Bosch heavy-duty battery replacement with doorstep installation.",
    iconUrl: "/category-icons-3d/batteries.webp",
    color: "#FF8800",
    badge: null,
  },
  {
    id: "tyres-wheel",
    title: "Tyres & Wheel Care",
    desc: "3D computerized alignment, wheel balancing & tyre replacement.",
    iconUrl: "/category-icons-3d/tyres-wheel.webp",
    color: "#00C896",
    badge: null,
  },
  {
    id: "denting-painting",
    title: "Denting & Painting",
    desc: "Grade A paint booth, panel repair & scratch removal.",
    iconUrl: "/category-icons-3d/denting-painting.webp",
    color: "#AA66FF",
    badge: null,
  },
  {
    id: "detailing",
    title: "Detailing Services",
    desc: "9H ceramic coating, Teflon paint protection & interior restoration.",
    iconUrl: "/category-icons-3d/detailing.webp",
    color: "#FF4466",
    badge: null,
  },
  {
    id: "car-spa",
    title: "Car Spa & Cleaning",
    desc: "Deep foam wash, anti-bacterial sanitization & leather polish.",
    iconUrl: "/category-icons-3d/car-spa.webp",
    color: "#00AAFF",
    badge: null,
  },
  {
    id: "car-inspections",
    title: "Car Inspections",
    desc: "Comprehensive 100-point inspection report for secondhand & overall check.",
    iconUrl: "/category-icons-3d/car-inspections.webp",
    color: "#10B981",
    badge: "New",
  },
  {
    id: "windshield-glass",
    title: "Windshields & Lights",
    desc: "OEM glass replacement, wiper blade upgrades & window repairs.",
    iconUrl: "/category-icons-3d/windshield-glass.webp",
    color: "#F59E0B",
    badge: null,
  },
  {
    id: "suspension-fitments",
    title: "Suspension & Fitments",
    desc: "Brake pad replacement, disc resurfacing & shock absorber inspection.",
    iconUrl: "/category-icons-3d/suspension-fitments.webp",
    color: "#6366F1",
    badge: null,
  },
  {
    id: "clutch-body",
    title: "Clutch & Body Parts",
    desc: "Clutch plate replacement, flywheel overhaul & body panel fitments.",
    iconUrl: "/category-icons-3d/clutch-body.webp",
    color: "#008ECF",
    badge: "New",
  },
  {
    id: "insurance-claims",
    title: "Insurance Claims",
    desc: "Hassle-free cashless insurance claims with all major companies.",
    iconUrl: "/category-icons-3d/insurance-claims.webp",
    color: "#10B981",
    badge: null,
  },
];

export function getCategoryByIdOrTitle(slugOrTitle: string): ServiceCategory | undefined {
  if (!slugOrTitle) return undefined;
  const lower = slugOrTitle.toLowerCase().trim();
  const direct = SERVICE_CATEGORIES.find(
    (c) => c.id.toLowerCase() === lower || c.title.toLowerCase() === lower
  );
  if (direct) return direct;

  // Match normalized slug variations (e.g., clutch-body-parts -> clutch-body)
  const clean = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const target = clean(slugOrTitle);
  return SERVICE_CATEGORIES.find(
    (c) =>
      clean(c.id) === target ||
      clean(c.title) === target ||
      clean(c.id).includes(target) ||
      target.includes(clean(c.id))
  );
}
