import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import AnimatePresenceProvider from "@/components/AnimatePresenceProvider";
import InitialLoader from "@/components/InitialLoader";
import NavigationProgress from "@/components/NavigationProgress";

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
  icons: {
    icon: [
      { url: "/bosch-logo.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/bosch-logo.png",
    apple: "/bosch-logo.png",
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
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <InitialLoader />
        <ThemeProvider>
          <CartProvider>
            <AuthProvider>
              <AnimatePresenceProvider>
                {children}
              </AnimatePresenceProvider>
            </AuthProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

