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
      // Firebase, reCAPTCHA, and Google APIs
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://www.google.com https://firebaseinstallations.googleapis.com https://securetoken.googleapis.com",
      // Scripts: self + reCAPTCHA + Google Auth
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://www.google.com https://www.recaptcha.net https://apis.google.com",
      // Styles: self + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self + Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + data URIs for inline icons + Google Profile Pictures
      "img-src 'self' data: https:",
      // Frames: Google reCAPTCHA + Firebase Auth
      "frame-src 'self' https://www.google.com https://www.recaptcha.net https://sam-wheels.firebaseapp.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    domains: [],
    unoptimized: false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
