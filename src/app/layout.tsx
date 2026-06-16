import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Bosch Car Service – SAM Wheels Pvt Ltd | Authorized Workshop Patna",
  description:
    "SAM Wheels Pvt Ltd – Bosch Authorized Multi-Brand Car Service Center in Patna, Bihar. Expert diagnostics, genuine parts, certified technicians. 4.7★ Google Rating | 535+ Reviews.",
  keywords:
    "Bosch Car Service Patna, SAM Wheels, car service Patna, multi-brand car service, Bosch authorized workshop Bihar",
  openGraph: {
    title: "Bosch Car Service – SAM Wheels Pvt Ltd",
    description: "Authorized Bosch Multi-Brand Car Service Center in Patna, Bihar.",
    type: "website",
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
