import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import Services from "@/components/Services";
import { getCategoryByIdOrTitle, SERVICE_CATEGORIES } from "@/lib/servicesData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}): Promise<Metadata> {
  const { serviceId } = await params;
  const category = getCategoryByIdOrTitle(serviceId);
  const title = category ? category.title : "Car Services";
  return {
    title: `${title} in Patna | Bosch Car Service – SAM Wheels`,
    description: `Book authorized ${title} in Patna at SAM Wheels Bosch Car Service. Genuine Bosch parts, certified technicians, upfront pricing.`,
  };
}

export async function generateStaticParams() {
  return SERVICE_CATEGORIES.map((cat) => ({
    serviceId: cat.id,
  }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const category = getCategoryByIdOrTitle(serviceId);
  const categoryTitle = category ? category.title : "Car Services";

  return (
    <>
      <Navbar />
      <main className="subpage-hero" style={{ minHeight: "100vh", paddingTop: "var(--navbar-height, 70px)" }}>
        <Services selectedCategory={categoryTitle} isDedicatedPage={true} />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
