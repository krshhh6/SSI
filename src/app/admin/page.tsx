import type { Metadata } from "next";
import AdminClient from "@/components/AdminClient";

export const metadata: Metadata = {
  title: "Admin Panel | Bosch Car Service – SAM Wheels",
  description: "Admin dashboard for managing bookings and users at SAM Wheels.",
  robots: "noindex, nofollow",
};

export default function AdminPage() {
  return <AdminClient />;
}
