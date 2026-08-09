"use client";

import React from "react";
import { ManufacturerCard, Manufacturer } from "./ManufacturerCard";

export const DEFAULT_MANUFACTURERS: Manufacturer[] = [
  { id: "maruti-suzuki",    name: "Maruti Suzuki",    logoUrl: "/1.avif",  href: "/maruti-suzuki" },
  { id: "hyundai",          name: "Hyundai",          logoUrl: "/2.avif",  href: "/hyundai" },
  { id: "honda",            name: "Honda",            logoUrl: "/3.avif",  href: "/honda" },
  { id: "tata",             name: "Tata",             logoUrl: "/4.avif",  href: "/tata" },
  { id: "ford",             name: "Ford",             logoUrl: "/5.avif",  href: "/ford" },
  { id: "volkswagen",       name: "Volkswagen",       logoUrl: "/6.avif",  href: "/volkswagen" },
  { id: "mahindra",         name: "Mahindra",         logoUrl: "/7.avif",  href: "/mahindra" },
  { id: "renault",          name: "Renault",          logoUrl: "/8.avif",  href: "/renault" },
  { id: "chevrolet",        name: "Chevrolet",        logoUrl: "/9.avif",  href: "/chevrolet" },
  { id: "toyota",           name: "Toyota",           logoUrl: "/10.avif", href: "/toyota" },
  { id: "skoda",            name: "Skoda",            logoUrl: "/11.avif", href: "/skoda" },
  { id: "nissan",           name: "Nissan",           logoUrl: "/12.avif", href: "/nissan" },
  { id: "fiat",             name: "Fiat",             logoUrl: "/13.avif", href: "/fiat" },
  { id: "datsun",           name: "Datsun",           logoUrl: "/14.avif", href: "/datsun" },
  { id: "bmw",              name: "BMW",              logoUrl: "/15.avif", href: "/bmw" },
  { id: "kia",              name: "Kia",              logoUrl: "/16.avif", href: "/kia" },
  { id: "audi",             name: "Audi",             logoUrl: "/17.avif", href: "/audi" },
  { id: "mercedes-benz",    name: "Mercedes-Benz",    logoUrl: "/18.avif", href: "/mercedes-benz" },
  { id: "mg",               name: "MG",               logoUrl: "/19.avif", href: "/mg" },
  { id: "porsche",          name: "Porsche",          logoUrl: "/20.avif", href: "/porsche" },
  { id: "hindustan-motors", name: "Hindustan Motors", logoUrl: "/21.avif", href: "/hindustan-motors" },
];

interface ManufacturerGridProps {
  manufacturers?: Manufacturer[];
  brands?: string[];
  searchQuery?: string;
  selectedBrandId?: string;
  onSelectManufacturer?: (manufacturer: Manufacturer) => void;
  onSelectBrand?: (brandName: string) => void;
  className?: string;
}

export default function ManufacturerGrid({
  manufacturers,
  brands,
  searchQuery = "",
  selectedBrandId,
  onSelectManufacturer,
  onSelectBrand,
  className,
}: ManufacturerGridProps) {
  const items: Manufacturer[] = React.useMemo(() => {
    if (manufacturers && manufacturers.length > 0) return manufacturers;
    if (brands && brands.length > 0) {
      return brands.map((name) => {
        const match = DEFAULT_MANUFACTURERS.find(
          (m) => m.name.toLowerCase() === name.toLowerCase()
        );
        if (match) return match;
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
        return {
          id: slug,
          name: name,
          logoUrl: `/logos/${slug}.jpeg`,
          href: `/${slug}`,
        };
      });
    }
    return DEFAULT_MANUFACTURERS;
  }, [manufacturers, brands]);

  const filtered = items.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`w-full h-full overflow-y-auto scrollbar-thin ${className !== undefined ? className : "px-6 pt-2 pb-16"}`}>
      <div className="grid grid-cols-3 gap-x-[24px] gap-y-[32px] justify-items-center w-full">
        {filtered.map((item) => (
          <ManufacturerCard
            key={item.id}
            manufacturer={item}
            isSelected={
              selectedBrandId === item.id ||
              selectedBrandId?.toLowerCase() === item.name.toLowerCase()
            }
            onClick={(e) => {
              e.preventDefault();
              onSelectManufacturer?.(item);
              onSelectBrand?.(item.name);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export { ManufacturerCard };
