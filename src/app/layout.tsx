import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import AnimatePresenceProvider from "@/components/AnimatePresenceProvider";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ssl-gamma.vercel.app"),
  title: "Bosch Car Service – SAM Wheels Pvt Ltd | Authorized Workshop Patna",
  description:
    "SAM Wheels Pvt Ltd – Bosch Authorized Multi-Brand Car Service Center in Patna, Bihar. Expert diagnostics, genuine parts, certified technicians. 4.7★ Google Rating | 535+ Reviews.",
  keywords:
    "Bosch Car Service Patna, SAM Wheels, car service Patna, multi-brand car service, Bosch authorized workshop Bihar",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Bosch Car Service – SAM Wheels Pvt Ltd",
    description: "Authorized Bosch Multi-Brand Car Service Center in Patna, Bihar.",
    url: "https://ssl-gamma.vercel.app",
    siteName: "SAM Wheels",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <AnimatePresenceProvider>
              {children}
            </AnimatePresenceProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

