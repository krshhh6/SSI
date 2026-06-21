import { MetadataRoute } from 'next';

const SERVICES = [
  "periodic-maintenance",
  "engine-diagnostics",
  "dent-and-paint",
  "ac-service",
  "wheel-alignment",
  "car-detailing",
  "insurance-claims"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ssl-gamma.vercel.app";

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
  ];

  const dynamicRoutes = SERVICES.map((service) => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
