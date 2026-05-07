import HomeProducts from "@/components/Home/HomeProducts";
import CirLogo from "@/components/Home/CirLogo";
import StatsShowcase from "@/components/Home/ExPro";
import HeroSection from "@/components/Home/Hero";
import ServicesStrip from "@/components/Home/ServicesStrip";

/* ── Page-level SEO ──────────────────────────────────────────────── */
export const metadata = {
  title: "Home | Power Electronics – Electrical Solutions in Patna",
  description:
    "Power Electronics — Bihar's most trusted electrical dealer. UPS, solar panels, CCTV, wiring, batteries & stabilizers. 30+ years experience, 15,000+ happy customers in Patna.",
  alternates: { canonical: "https://powerele.shop" },
  openGraph: {
    title: "Power Electronics – Electrical Solutions in Patna, Bihar",
    description:
      "Authorized dealer for Exide, Microtek, Adani Solar, CP Plus, Dahua & more. Expert installation of UPS, CCTV, solar & wiring systems across Bihar.",
    url: "https://powerele.shop",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Power Electronics – Professional Electrical Solutions, Patna",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesStrip />
      <CirLogo />
      <StatsShowcase />
      <HomeProducts />
    </>
  );
}
