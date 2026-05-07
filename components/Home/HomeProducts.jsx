"use client";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { ArrowRight, ShoppingCart, Package } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function HomeProducts() {
  const { products, router } = useAppContext();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  /* one product per category, max 6 */
  const featured = (() => {
    const seen = {};
    const out = [];
    for (const p of products) {
      if (!seen[p.category] && out.length < 6) { seen[p.category] = true; out.push(p); }
    }
    if (out.length < 6) {
      for (const p of products) {
        if (!out.find(x => x._id === p._id) && out.length < 6) out.push(p);
      }
    }
    return out;
  })();

  return (
    <section
      ref={ref}
      className="relative w-full py-24 overflow-hidden bg-white"
      aria-labelledby="products-heading"
    >
      {/* Subtle top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, #e2e8f0 20%, #e2e8f0 80%, transparent)" }}
        aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
        >
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-3">
              Featured Products
            </p>
            <h2 id="products-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Popular Products
            </h2>
            <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-lg">
              Hand-picked top sellers from our catalog — quality gear from brands you trust.
            </p>
          </div>

          <Link
            href="/all-products"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
          >
            View All Products
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Products grid */}
        {featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
            {featured.map((product, i) => (
              <motion.div
                key={product._id || i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-slate-400" aria-hidden="true" />
            </div>
            <p className="text-slate-500 text-sm">Loading products…</p>
          </div>
        )}

        {/* CTA strip */}
        <motion.div
          className="mt-16 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
            backgroundImage: `linear-gradient(135deg,rgba(15,23,42,0.97) 0%,rgba(30,58,138,0.97) 100%), url(https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=800&auto=format&fit=crop)`,
            backgroundSize: "cover",
            backgroundBlend: "overlay",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#fbbf24" }}>
              Full Catalog
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {products.length > 0 ? `Explore ${products.length}+ Products` : "Explore Our Full Range"}
            </h3>
            <p className="text-white/55 text-sm mt-1">
              UPS · Solar · CCTV · Batteries · Wiring · Stabilizers
            </p>
          </div>

          <button
            onClick={() => router.push("/all-products")}
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg font-semibold text-sm flex-shrink-0 transition-all duration-300 hover:opacity-90 hover:shadow-2xl hover:shadow-amber-500/20"
            style={{ background: "#f59e0b", color: "#0c0a09" }}
          >
            <ShoppingCart className="w-4 h-4" aria-hidden="true" />
            Shop Now
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
