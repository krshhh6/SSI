import type { NextConfig } from "next";

const securityHeaders = [
  // Prevents your site from being embedded in iframes on other sites (Clickjacking protection)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevents browser from MIME-type sniffing (stops malicious file uploads from being executed)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Forces HTTPS for 1 year — prevents downgrade attacks
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Controls how much referrer info is sent when navigating away
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disables access to dangerous browser features
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Firebase, reCAPTCHA, and Google APIs, plus permissive 3D asset domains
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://www.google.com https://firebaseinstallations.googleapis.com https://securetoken.googleapis.com https://*.githack.com https://*.githubusercontent.com https://www.gstatic.com blob: data:",
      // Scripts: self + reCAPTCHA + Google Auth
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://www.google.com https://www.recaptcha.net https://apis.google.com blob: data:",
      // Workers for WebGL/Three.js
      "worker-src 'self' blob: data:",
      // Styles: self + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self + Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + data URIs for inline icons + Google Profile Pictures
      "img-src 'self' data: blob: https:",
      // Frames: Google reCAPTCHA + Firebase Auth
      "frame-src 'self' https://www.google.com https://www.recaptcha.net https://sam-wheels.firebaseapp.com",
      // Media: Cloudinary Videos
      "media-src 'self' https://res.cloudinary.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  compress: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: false,
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-icons",
      "recharts",
    ],
  },
  async headers() {
    return [
      {
        // Cache static assets (images, fonts, media) immutably for 1 year
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ttf|woff|woff2|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
